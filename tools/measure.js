// Mede extensões de "tinta" (pixels diferentes do fundo) no slide e no screenshot do site.
// Uso: node tools/measure.js <nn> "x0,y0,x1,y1" ["x0,y0,x1,y1" ...]
// Para cada caixa imprime: bbox da tinta no slide × no site (coordenadas 1456×819).
const sharp = require('sharp');
const path = require('path');
const ROOT = path.join(__dirname, '..');

async function load(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width };
}
function bbox(img, [x0, y0, x1, y1], thr) {
  const at = (x, y) => { const i = (y * img.w + x) * 3; return [img.data[i], img.data[i + 1], img.data[i + 2]]; };
  const bg = at(x0, y0);
  let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const c = at(x, y);
    if (Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > thr) {
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
  }
  return maxx < 0 ? null : { x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1 };
}

(async () => {
  const [nn, ...boxes] = process.argv.slice(2);
  const n = String(nn).padStart(2, '0');
  const ref = await load(path.join(ROOT, 'reference', `slide-${n}.png`));
  const site = await load(path.join(ROOT, 'tmp', 'compare', `s${n}.png`));
  const thr = Number(process.env.THR || 90);
  for (const b of boxes) {
    const box = b.split(',').map(Number);
    const r = bbox(ref, box, thr), s = bbox(site, box, thr);
    const f = (o) => (o ? `x${o.x} y${o.y} w${o.w} h${o.h}` : '—');
    const ratio = r && s ? (r.w / s.w).toFixed(3) : '';
    console.log(`[${b}]  slide: ${f(r)}  |  site: ${f(s)}  |  w ratio ${ratio}`);
  }
})();
