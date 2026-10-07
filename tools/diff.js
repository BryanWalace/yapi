// Mapa de diferença slide × site (1456×819) e prancha com as 16 seções.
// Uso: node tools/diff.js   (requer tmp/compare/sNN.png gerados por tools/compare.js)
const sharp = require('sharp');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'tmp', 'compare');

(async () => {
  const tiles = [];
  console.log('seção | diferença média (0–255) | % de pixels com diferença > 40');
  for (let n = 1; n <= 16; n++) {
    const nn = String(n).padStart(2, '0');
    const a = await sharp(path.join(ROOT, 'reference', `slide-${nn}.png`)).removeAlpha().raw().toBuffer();
    const b = await sharp(path.join(OUT, `s${nn}.png`)).resize(1456, 819, { fit: 'fill' }).removeAlpha().raw().toBuffer();
    const d = Buffer.alloc(1456 * 819);
    let sum = 0, big = 0;
    for (let p = 0; p < 1456 * 819; p++) {
      const v = (Math.abs(a[p * 3] - b[p * 3]) + Math.abs(a[p * 3 + 1] - b[p * 3 + 1]) + Math.abs(a[p * 3 + 2] - b[p * 3 + 2])) / 3;
      sum += v; if (v > 40) big++;
      d[p] = Math.min(255, v * 3);
    }
    console.log(`S${nn} | ${(sum / (1456 * 819)).toFixed(1)} | ${((big / (1456 * 819)) * 100).toFixed(1)}%`);
    const img = await sharp(d, { raw: { width: 1456, height: 819, channels: 1 } }).negate().resize(364).png().toBuffer();
    tiles.push(img);
  }
  const W = 364, H = 205;
  await sharp({ create: { width: W * 4 + 30, height: H * 4 + 30, channels: 3, background: '#ff00ff' } })
    .composite(tiles.map((t, i) => ({ input: t, left: (i % 4) * (W + 10), top: Math.floor(i / 4) * (H + 10) })))
    .png().toFile(path.join(OUT, 'diff-sheet.png'));
})();
