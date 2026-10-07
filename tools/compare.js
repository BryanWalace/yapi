// Screenshot de cada seção em 1456×819 e composição "slide (cima) × site (baixo)".
// Uso: node tools/compare.js [números das seções, ex.: 1 2 3]   (sem argumentos = todas)
// Saída: tmp/compare/sNN.png e tmp/compare/sNN-cmp.png
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'tmp', 'compare');
const IDS = ['inicio', 'o-centro', 'numeros', 'areas', 'localizacao', 'insercao', 'estrutura', 'recepcao',
  'consultorios', 'tecnologias', 'coordenacao', 'suporte', 'apoio', 'viabilidade', 'principios', 'contato'];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json' };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const file = path.join(ROOT, p);
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); return res.end(); }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        res.end(buf);
      });
    }).listen(0, () => resolve(server));
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const wanted = process.argv.slice(2).map(Number);
  const list = wanted.length ? wanted : IDS.map((_, i) => i + 1);
  const server = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1456, height: 819 }, reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${server.address().port}/index.html`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.site-header,.wa-float,.skip-link{display:none!important}' });
  for (const n of list) {
    const nn = String(n).padStart(2, '0');
    const el = page.locator(`#${IDS[n - 1]}`);
    await el.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }));
    await page.waitForTimeout(250);
    const shot = path.join(OUT, `s${nn}.png`);
    await el.screenshot({ path: shot });
    const ref = await sharp(path.join(ROOT, 'reference', `slide-${nn}.png`)).resize(1000).png().toBuffer();
    const site = await sharp(shot).resize(1000, 563, { fit: 'fill' }).png().toBuffer();
    await sharp({ create: { width: 1000, height: 1130, channels: 3, background: '#ff00ff' } })
      .composite([{ input: ref, left: 0, top: 0 }, { input: site, left: 0, top: 567 }])
      .png().toFile(path.join(OUT, `s${nn}-cmp.png`));
    const box = await el.boundingBox();
    console.log(`s${nn} ${IDS[n - 1]} ${Math.round(box.width)}x${Math.round(box.height)}`);
  }
  await browser.close();
  server.close();
})();
