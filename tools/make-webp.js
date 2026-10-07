// Gera versões .webp das imagens usadas no site (os originais .jpg/.png ficam como fallback).
// Uso: node tools/make-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG = path.join(__dirname, '..', 'assets', 'img');
const SKIP = new Set(['mapa-conectividade.jpg']); // arquivo errado do kit (contém o slide 08), não usado

(async () => {
  const files = fs.readdirSync(IMG).filter((f) => /\.(jpe?g)$/i.test(f) && !SKIP.has(f));
  for (const f of files) {
    const out = f.replace(/\.jpe?g$/i, '.webp');
    await sharp(path.join(IMG, f)).webp({ quality: 80, effort: 6 }).toFile(path.join(IMG, out));
  }
  // Hero em larguras menores para o srcset
  for (const w of [1280, 1920]) {
    await sharp(path.join(IMG, 'hero-fachada.jpg')).resize(w).webp({ quality: 78, effort: 6 })
      .toFile(path.join(IMG, `hero-fachada-${w}.webp`));
  }
  // Hero em retrato (celular): recorte 900×1350 enquadrando o letreiro e a entrada
  const portrait = { left: 180, top: 0, width: 900, height: 1350 };
  await sharp(path.join(IMG, 'hero-fachada.jpg')).extract(portrait).webp({ quality: 78, effort: 6 })
    .toFile(path.join(IMG, 'hero-fachada-portrait.webp'));
  await sharp(path.join(IMG, 'hero-fachada.jpg')).extract(portrait).resize(600).webp({ quality: 78, effort: 6 })
    .toFile(path.join(IMG, 'hero-fachada-portrait-600.webp'));
  // Logo da S16 (PNG de 231KB sem transparência → WebP sem perdas visíveis)
  await sharp(path.join(IMG, 'logo-yapi.png')).webp({ quality: 90, effort: 6 }).toFile(path.join(IMG, 'logo-yapi.webp'));

  const kb = (f) => Math.round(fs.statSync(path.join(IMG, f)).size / 1024);
  fs.readdirSync(IMG).filter((f) => f.endsWith('.webp')).sort().forEach((f) => {
    const src = ['.jpg', '.png'].map((e) => f.replace(/(-\d+)?\.webp$/, e)).find((s) => fs.existsSync(path.join(IMG, s)));
    console.log(`${f.padEnd(34)} ${String(kb(f)).padStart(4)} KB  (original ${src ? kb(src) : '?'} KB)`);
  });
})();
