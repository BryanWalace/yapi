// Screenshots por largura + detecção de scroll horizontal.
// Uso: node tools/responsive.js [larguras...]   (padrão: 375 768 1024 1440 1920)
// Saída: tmp/responsive/w<largura>-<grupo>.png (4 seções lado a lado) e relatório de overflow.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'tmp', 'responsive');
const HEIGHTS = { 375: 740, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(ROOT, p), (err, buf) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    res.end(buf);
  });
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => server.listen(0, r));
  const widths = process.argv.slice(2).map(Number);
  const list = widths.length ? widths : [375, 768, 1024, 1440, 1920];
  const browser = await chromium.launch();
  for (const w of list) {
    const h = HEIGHTS[w] || 900;
    const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce', isMobile: w < 768, hasTouch: w < 768 });
    await page.goto(`http://localhost:${server.address().port}/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }));
    await page.addStyleTag({ content: '.site-header,.wa-float,.skip-link{display:none!important}' });
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > vw + 0.5 || r.left < -0.5) && getComputedStyle(el).position !== 'fixed') {
          const clipped = el.closest('.section') && getComputedStyle(el.closest('.section')).overflow === 'hidden';
          bad.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} [${Math.round(r.left)}→${Math.round(r.right)}]${clipped ? ' (cortado)' : ''}`);
        }
      });
      return { scroll: document.documentElement.scrollWidth - vw, bad: bad.slice(0, 12) };
    });
    console.log(`${w}px: scroll horizontal = ${overflow.scroll}px`);
    overflow.bad.forEach((b) => console.log('   ', b));

    const ids = await page.$$eval('main > section', (s) => s.map((x) => x.id));
    const colW = w <= 768 ? 375 : 480;
    for (let g = 0; g < ids.length; g += 4) {
      const shots = [];
      for (const id of ids.slice(g, g + 4)) {
        const buf = await page.locator(`#${id}`).screenshot();
        shots.push(await sharp(buf).resize(colW).png().toBuffer());
      }
      const metas = await Promise.all(shots.map((b) => sharp(b).metadata()));
      const H = Math.max(...metas.map((m) => m.height));
      await sharp({ create: { width: colW * shots.length + 10 * (shots.length - 1), height: H, channels: 3, background: '#ff00ff' } })
        .composite(shots.map((b, i) => ({ input: b, left: i * (colW + 10), top: 0 })))
        .png().toFile(path.join(OUT, `w${w}-${g / 4 + 1}.png`));
    }
    await page.close();
  }
  await browser.close();
  server.close();
})();
