// Testes de interação (header, menu mobile, lightbox, contadores) com Playwright.
// Uso: node tools/check-ui.js   → imprime OK/FALHOU por verificação e salva screenshots em tmp/ui/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const SITE = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : ROOT; // SITE_DIR=dist testa o build
const OUT = path.join(ROOT, 'tmp', 'ui');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(SITE, p), (err, buf) => {
    if (err) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
    res.end(buf);
  });
});

let failures = 0;
function check(name, ok, extra = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'OK     ' : 'FALHOU '} ${name}${extra ? ` (${extra})` : ''}`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  const errors = [];

  // ---------- Desktop ----------
  const page = await browser.newPage({ viewport: { width: 1456, height: 819 } });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(OUT, 'desktop-top.png') });
  check('header transparente sobre o hero', !(await page.$eval('[data-header]', (h) => h.classList.contains('is-solid'))));

  await page.evaluate(() => window.scrollTo(0, document.getElementById('numeros').offsetTop - 64));
  await page.waitForTimeout(400);
  check('header sólido após o hero', await page.$eval('[data-header]', (h) => h.classList.contains('is-solid')));
  check('link ativo = Números', (await page.$eval('.nav-list a.is-active', (a) => a.textContent).catch(() => '')) === 'Números');
  await page.screenshot({ path: path.join(OUT, 'desktop-solid.png') });

  await page.evaluate(() => window.scrollTo(0, document.getElementById('consultorios').offsetTop - 64));
  await page.waitForTimeout(400);
  check('link ativo = Estrutura (S9)', (await page.$eval('.nav-list a.is-active', (a) => a.textContent).catch(() => '')) === 'Estrutura');

  // Lightbox
  const zooms = await page.$$('#recepcao .zoom');
  check('fotos da S8 viraram botões', zooms.length === 2);
  await zooms[0].click();
  await page.waitForTimeout(200);
  check('lightbox abre', await page.$eval('.lightbox', (b) => !b.hidden));
  check('scroll travado com lightbox', await page.evaluate(() => document.documentElement.classList.contains('is-locked')));
  check('foco no botão Fechar', await page.evaluate(() => document.activeElement.classList.contains('lightbox-close')));
  const cap1 = await page.$eval('.lightbox-caption', (c) => c.textContent);
  await page.keyboard.press('ArrowRight');
  const cap2 = await page.$eval('.lightbox-caption', (c) => c.textContent);
  check('seta → navega na mesma seção', cap1 !== cap2 && cap2.includes('2 / 2'), cap2);
  await page.screenshot({ path: path.join(OUT, 'lightbox.png') });
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  check('foco preso no lightbox', await page.evaluate(() => !!document.activeElement.closest('.lightbox')));
  await page.keyboard.press('Escape');
  check('ESC fecha o lightbox', await page.$eval('.lightbox', (b) => b.hidden));
  check('foco volta para a foto', await page.evaluate(() => document.activeElement.classList.contains('zoom')));
  check('scroll destravado', !(await page.evaluate(() => document.documentElement.classList.contains('is-locked'))));

  const s9 = await page.$$('#consultorios .zoom');
  await s9[1].click();
  check('legenda da S9 no lightbox', (await page.$eval('.lightbox-caption', (c) => c.textContent)).startsWith('Consultório 3'));
  await page.mouse.click(30, 120);
  check('clique fora fecha', await page.$eval('.lightbox', (b) => b.hidden));

  // Contadores e reveal (P7) — página nova, sem rolar antes
  const c = await browser.newPage({ viewport: { width: 1456, height: 819 } });
  c.on('pageerror', (e) => errors.push(e.message));
  await c.goto(url, { waitUntil: 'networkidle' });
  const before = await c.$eval('#numeros [data-count="5000"]', (e) => e.textContent);
  check('contador começa em zero', before === '+0', before);
  check('reveal aplicado fora da tela', await c.$eval('#numeros .stat', (e) => e.classList.contains('reveal') && !e.classList.contains('is-in')));
  await c.evaluate(() => window.scrollTo(0, document.getElementById('numeros').offsetTop));
  await c.waitForTimeout(450);
  const mid = await c.$eval('#numeros [data-count="5000"]', (e) => e.textContent);
  check('contador em andamento', mid !== '+0' && mid !== '+5.000', mid);
  await c.waitForTimeout(1600);
  const nums = await c.$$eval('#numeros [data-count]', (els) => els.map((e) => e.textContent));
  check('contadores terminam nos valores finais', nums.join('|') === '7|9|+450 mil|53|+5.000', nums.join('|'));
  check('reveal concluído na S3', await c.$eval('#numeros .stat', (e) => e.classList.contains('is-in')));
  const z = await c.$eval('.section-head', (e) => e.closest('section').id);
  check('S12 mantém centralização com reveal', await c.evaluate(() => {
    const li = document.querySelector('.support-list li');
    li.scrollIntoView();
    return getComputedStyle(li.querySelector('.support-title')).transform !== 'none';
  }), z);
  const rm = await browser.newPage({ viewport: { width: 1456, height: 819 }, reducedMotion: 'reduce' });
  await rm.goto(url, { waitUntil: 'networkidle' });
  check('reduced motion: sem reveal', (await rm.$$('.reveal')).length === 0);
  check('reduced motion: números já finais', (await rm.$eval('#numeros [data-count="5000"]', (e) => e.textContent)) === '+5.000');

  // ---------- Mobile ----------
  const m = await browser.newPage({ viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true });
  m.on('pageerror', (e) => errors.push(e.message));
  await m.goto(url, { waitUntil: 'networkidle' });
  const toggle = m.locator('.menu-toggle');
  check('hambúrguer visível no mobile', await toggle.isVisible());
  check('links escondidos com menu fechado', !(await m.locator('.nav-list a').first().isVisible()));
  await toggle.click();
  await m.waitForTimeout(350);
  check('menu abre', await m.$eval('#site-nav', (n) => n.classList.contains('is-open')));
  check('aria-expanded=true', (await toggle.getAttribute('aria-expanded')) === 'true');
  check('scroll do body travado', await m.evaluate(() => document.documentElement.classList.contains('is-locked')));
  await m.screenshot({ path: path.join(OUT, 'mobile-menu.png') });
  await m.keyboard.press('Escape');
  await m.waitForTimeout(350);
  check('ESC fecha o menu', !(await m.$eval('#site-nav', (n) => n.classList.contains('is-open'))));
  check('aria-expanded=false', (await toggle.getAttribute('aria-expanded')) === 'false');
  await toggle.click();
  await m.waitForTimeout(350);
  await m.locator('.nav-list a', { hasText: 'Contato' }).click();
  await m.waitForTimeout(2500);
  check('clique no link fecha o menu', !(await m.$eval('#site-nav', (n) => n.classList.contains('is-open'))));
  const top = await m.$eval('#contato', (s) => Math.round(s.getBoundingClientRect().top));
  check('âncora compensa o header (64px)', Math.abs(top - 64) <= 2, `top=${top}`);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('sem scroll horizontal em 375px', overflow === 0, `excesso=${overflow}px`);

  check('sem erros no console', errors.length === 0, errors.join(' | '));
  await browser.close();
  server.close();
  console.log(failures ? `\n${failures} verificação(ões) falharam` : '\nTodas as verificações passaram');
  process.exitCode = failures ? 1 : 0;
})();
