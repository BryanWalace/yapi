// Build de produção: gera dist/ do zero, só com o que o site usa.
// Uso: npm run build            (ou SITE_URL=https://dominio npm run build)
//
// - index.html, CSS e JS minificados (os originais não são alterados)
// - CSS e JS com hash no nome (style.<hash>.css / main.<hash>.js): podem ter cache imutável
// - assets/: só os arquivos referenciados no HTML (incluindo .webp, favicon e og:image)
// - robots.txt, sitemap.xml e _headers (regras de cache para a Cloudflare)
// - SITE_URL (opcional): substitui o placeholder em robots/sitemap e torna o og:image absoluto
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');
const { minify } = require('html-minifier-terser');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const CACHE_RULES = ['/assets/*', '/css/*', '/js/*'];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

async function minifyAsset(src, loader, outDir, base) {
  const code = fs.readFileSync(path.join(ROOT, src), 'utf8');
  const out = (await esbuild.transform(code, { loader, minify: true, legalComments: 'none' })).code;
  const name = `${base}.${hash(out)}.${loader}`;
  write(path.join(DIST, outDir, name), out);
  return { from: src, to: `${outDir}/${name}`, before: Buffer.byteLength(code), after: Buffer.byteLength(out) };
}

// Caminhos locais referenciados no HTML (src, href, srcset, content)
function localRefs(html) {
  const refs = new Set();
  const add = (u) => {
    u = u.trim().split(/[?#]/)[0];
    if (!u || /^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(u)) return;
    refs.add(u);
  };
  for (const m of html.matchAll(/\s(?:src|href)=["']([^"']+)["']/g)) add(m[1]);
  for (const m of html.matchAll(/\ssrcset=["']([^"']+)["']/g)) m[1].split(',').forEach((c) => add(c.trim().split(/\s+/)[0]));
  for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+\.(?:jpe?g|png|webp|svg))["']/g)) add(m[1]);
  return [...refs];
}

(async () => {
  const t0 = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  // CSS e JS minificados, com hash no nome
  const css = await minifyAsset('css/style.css', 'css', 'css', 'style');
  const js = await minifyAsset('js/main.js', 'js', 'js', 'main');

  // HTML
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  html = html.replace('href="css/style.css"', `href="${css.to}"`).replace('src="js/main.js"', `src="${js.to}"`);
  if (!html.includes(css.to) || !html.includes(js.to)) throw new Error('Referência a css/style.css ou js/main.js não encontrada no index.html');
  if (SITE_URL) {
    html = html.replace(/(<meta property="og:image" content=")(?!https?:)([^"]+)"/, `$1${SITE_URL}/$2"`);
    html = html.replace('<meta property="og:type"', `<meta property="og:url" content="${SITE_URL}/">\n  <link rel="canonical" href="${SITE_URL}/">\n  <meta property="og:type"`);
  }
  const htmlMin = await minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true, // nunca remove o espaço entre palavras (ex.: "em<br> uma" quando o <br> some no mobile)
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    collapseBooleanAttributes: true,
    minifyCSS: true,
  });
  write(path.join(DIST, 'index.html'), htmlMin);

  // Assets: só o que o HTML referencia
  const assets = localRefs(htmlMin).filter((u) => u.startsWith('assets/'));
  for (const a of assets) {
    const src = path.join(ROOT, a);
    if (!fs.existsSync(src)) throw new Error(`Asset referenciado não existe no projeto: ${a}`);
    fs.mkdirSync(path.dirname(path.join(DIST, a)), { recursive: true });
    fs.copyFileSync(src, path.join(DIST, a));
  }

  // robots.txt e sitemap.xml (placeholder SITE_URL substituído se a variável existir)
  for (const f of ['robots.txt', 'sitemap.xml']) {
    let txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (SITE_URL) txt = txt.split('SITE_URL').join(SITE_URL);
    write(path.join(DIST, f), txt);
  }

  // _headers (Cloudflare): mesmas regras de cache do vercel.json
  const headers = CACHE_RULES.map((r) => `${r}\n  Cache-Control: public, max-age=31536000, immutable`).join('\n') +
    '\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n';
  write(path.join(DIST, '_headers'), headers);

  // Verificação: todo caminho local de dist/index.html é relativo e existe em dist/
  const broken = [];
  for (const u of localRefs(htmlMin)) {
    if (u.startsWith('/')) broken.push(`${u} (caminho absoluto)`);
    else if (!fs.existsSync(path.join(DIST, decodeURIComponent(u)))) broken.push(`${u} (não existe em dist/)`);
  }

  // Relatório
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p); else files.push({ f: path.relative(DIST, p).split(path.sep).join('/'), s: fs.statSync(p).size });
    }
  })(DIST);
  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`dist/ gerado em ${Date.now() - t0}ms${SITE_URL ? ` (SITE_URL=${SITE_URL})` : ' (SITE_URL não definida: placeholder mantido)'}`);
  console.log(`  ${css.from} ${kb(css.before)} → ${css.to} ${kb(css.after)}`);
  console.log(`  ${js.from} ${kb(js.before)} → ${js.to} ${kb(js.after)}`);
  console.log(`  index.html ${kb(Buffer.byteLength(html))} → ${kb(Buffer.byteLength(htmlMin))}`);
  console.log(`  ${files.length} arquivos, total ${kb(files.reduce((s, x) => s + x.s, 0))}`);
  if (broken.length) {
    console.error('\nCaminhos quebrados em dist/index.html:');
    broken.forEach((b) => console.error('  ✗', b));
    process.exitCode = 1;
  } else {
    console.log(`  ${localRefs(htmlMin).length} caminhos locais conferidos: todos relativos e presentes em dist/`);
  }
  if (process.argv.includes('--list')) files.sort((a, b) => a.f.localeCompare(b.f)).forEach((x) => console.log(`    ${x.f.padEnd(42)} ${kb(x.s).padStart(9)}`));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
