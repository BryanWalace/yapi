// Confere se cada texto e cada alt de CONTENT.md aparece na página renderizada.
// Uso: node tools/check-content.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const norm = (s) => s.replace(/↵/g, ' ').replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim();

// Extrai os textos esperados de CONTENT.md
function expected() {
  const md = fs.readFileSync(path.join(ROOT, 'CONTENT.md'), 'utf8');
  // Do "## S1 " até "## Header" ("## S1" também é prefixo de "## S10")
  const body = md.slice(md.indexOf('\n## S1 ') + 1, md.indexOf('\n## Header'));
  const texts = [];
  const alts = [];
  body.split('\n').forEach((line) => {
    if (/^## (Header|SEO)/.test(line)) return;
    const row = line.match(/^\| ([^|]+) \| ([^|]+) \|$/);
    if (row && !/^-+$/.test(row[1].trim()) && row[1].trim() !== 'Especialidade') { texts.push(row[1], row[2]); return; }
    const item = line.match(/^- (.+)$/);
    if (!item) return;
    let v = item[1];
    (v.match(/alt:? "([^"]+)"/g) || []).forEach((a) => alts.push(a.replace(/^alt:? "|"$/g, '')));
    (v.match(/legenda "([^"]+)"/g) || []).forEach((a) => texts.push(a.replace(/^legenda "|"$/g, '')));
    if (/^(Imagem|Imagens|Painel|Tabela)/.test(v)) {
      (v.match(/· "([^"]+)"/g) || []).forEach((a) => texts.push(a.replace(/^· "|"$/g, '')));
      return;
    }
    v = v.replace(/ → `[^`]+`/g, '');
    const kv = v.match(/^[^:]{1,40}: (.+)$/);
    if (kv && !/^\d/.test(v)) v = kv[1];
    if (v.includes(' · nome: ')) {
      v.split(' · ').forEach((part) => texts.push(part.replace(/^(nome|cargo): /, '')));
      return;
    }
    v.split(' — ').forEach((part) => texts.push(part.replace(/^(\d\d) /, '').replace(/^ENDEREÇO: |^E-MAIL: /, '')));
    if (/^\d\d /.test(v)) texts.push(v.slice(0, 2));
  });
  return { texts: texts.map(norm).filter(Boolean), alts: alts.map(norm) };
}

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(ROOT, p), (err, buf) => { if (err) { res.writeHead(404); return res.end(); } res.end(buf); });
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1456, height: 819 }, reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${server.address().port}/index.html`, { waitUntil: 'networkidle' });
  const pageText = norm(await page.evaluate(() => document.querySelector('main').textContent));
  const pageAlts = (await page.$$eval('main img', (imgs) => imgs.map((i) => i.alt))).map(norm);
  const { texts, alts } = expected();
  let missing = 0;
  texts.forEach((t) => { if (!pageText.includes(t)) { missing++; console.log('TEXTO AUSENTE:', t); } });
  alts.forEach((a) => { if (!pageAlts.includes(a)) { missing++; console.log('ALT AUSENTE:  ', a); } });
  // <head>: title e description de CONTENT.md §SEO
  const md = fs.readFileSync(path.join(ROOT, 'CONTENT.md'), 'utf8');
  const seoTitle = md.match(/^- title: (.+)$/m)[1].trim();
  const seoDesc = md.match(/^- description: (.+)$/m)[1].trim();
  if ((await page.title()) !== seoTitle) { missing++; console.log('TITLE DIFERENTE:', await page.title()); }
  const desc = await page.$eval('meta[name="description"]', (m) => m.content);
  if (desc !== seoDesc) { missing++; console.log('DESCRIPTION DIFERENTE:', desc); }
  const noAlt = await page.$$eval('img', (imgs) => imgs.filter((i) => !i.hasAttribute('alt')).length);
  if (noAlt) { missing++; console.log(`${noAlt} imagem(ns) sem atributo alt`); }
  ['Contigência', 'estrutura dedicado'].forEach((typo) => {
    if (pageText.includes(typo)) { missing++; console.log('ERRO DO PDF NÃO CORRIGIDO:', typo); }
  });
  console.log(`${texts.length} textos e ${alts.length} alts conferidos — ${missing ? `${missing} problema(s)` : 'todos presentes'}`);
  await browser.close();
  server.close();
  process.exitCode = missing ? 1 : 0;
})();
