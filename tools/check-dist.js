// Teste do build servido (npm run preview): console, requisições e imagens.
// Uso: node tools/check-dist.js [url]   (padrão: http://localhost:3000)
const { chromium } = require('playwright');

const URL = process.argv[2] || 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const vp of [{ width: 1456, height: 819, name: 'desktop' }, { width: 375, height: 740, name: 'mobile', isMobile: true }]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile });
    const errors = [];
    const failed = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('requestfailed', (r) => failed.push(`${r.url()} (${r.failure().errorText})`));
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.url()} (HTTP ${r.status()})`); });

    await page.goto(URL, { waitUntil: 'networkidle' });
    // Rola a página inteira para disparar o lazy loading e os reveals
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    const imgs = await page.$$eval('img', (list) => list.map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, visible: i.getClientRects().length > 0 })));
    const broken = imgs.filter((i) => i.visible && !i.ok);
    const webp = imgs.filter((i) => i.src.endsWith('.webp')).length;
    const css = await page.evaluate(() => [...document.styleSheets].length);
    const counters = await page.$$eval('#numeros [data-count]', (els) => els.map((e) => e.textContent).join(' | '));

    report.push(`${vp.name}: ${imgs.length} imagens (${webp} servidas em .webp), ${broken.length} quebradas · ${css} folha(s) de estilo · ` +
      `${errors.length} erro(s) no console · ${failed.length} requisição(ões) com falha · contadores: ${counters}`);
    broken.forEach((b) => report.push(`   ✗ imagem não carregou: ${b.src}`));
    errors.forEach((e) => report.push(`   ✗ console: ${e}`));
    failed.forEach((f) => report.push(`   ✗ requisição: ${f}`));
    await page.close();
  }
  await browser.close();
  console.log(report.join('\n'));
  process.exitCode = report.some((l) => l.includes('✗')) ? 1 : 0;
})();
