// Gera derivados a partir dos originais (os originais não são alterados).
// - mapa-conectividade-s05.jpg: o arquivo mapa-conectividade.jpg do kit contém o slide 08,
//   então o mapa é recortado de reference/slide-05.png (x 530–1389, y 231–714).
// - logo-yapi-header(-light).png: logotipo "YAPI / PESQUISA CLÍNICA" com fundo removido.
// - favicon.png: símbolo do logo com fundo removido.
const sharp = require('sharp');
const path = require('path');
const IMG = path.join(__dirname, '..', 'assets', 'img');

const BG = [223, 197, 172];      // --c-sand, fundo embutido no logo
const PAPER = [248, 245, 240];   // --c-paper (versão clara)

function keyOut(data, w, h, refs, recolor) {
  const out = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    const c = [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]];
    let best = null;
    for (const ref of refs) {
      const v = ref.map((r, k) => r - BG[k]);
      const u = c.map((x, k) => x - BG[k]);
      const vv = v.reduce((s, x) => s + x * x, 0);
      const t = u.reduce((s, x, k) => s + x * v[k], 0) / vv;
      const res = u.reduce((s, x, k) => s + (x - t * v[k]) ** 2, 0);
      if (!best || res < best.res) best = { t, res, ref };
    }
    let a = Math.max(0, Math.min(1, best.t));
    if (a < 0.06) a = 0;
    const col = recolor && best.ref === refs[0] ? recolor : best.ref;
    out[p * 4] = col[0]; out[p * 4 + 1] = col[1]; out[p * 4 + 2] = col[2];
    out[p * 4 + 3] = Math.round(a * 255);
  }
  return out;
}

async function extremeColors(file) {
  const { data } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]]);
  const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const sat = (c) => Math.max(...c) - Math.min(...c);
  const avg = (arr) => [0, 1, 2].map((k) => Math.round(arr.reduce((s, c) => s + c[k], 0) / arr.length));
  const darkest = px.slice().sort((a, b) => lum(a) - lum(b)).slice(0, Math.floor(px.length * 0.05));
  const orange = px.filter((c) => c[0] > 150 && c[2] < 90).sort((a, b) => sat(b) - sat(a)).slice(0, 2000);
  return { dark: avg(darkest), orange: avg(orange) };
}

async function logoPart(file, region, refs, recolor, out, height) {
  const { data, info } = await sharp(file).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = keyOut(data, info.width, info.height, refs, recolor);
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ height, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(IMG, out));
  console.log('ok', out);
}

(async () => {
  await sharp(path.join(__dirname, '..', 'reference', 'slide-05.png'))
    .extract({ left: 530, top: 231, width: 860, height: 484 })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(IMG, 'mapa-conectividade-s05.jpg'));
  console.log('ok mapa-conectividade-s05.jpg');

  const logo = path.join(IMG, 'logo-yapi.png');
  const { dark, orange } = await extremeColors(logo);
  console.log('refs', dark, orange);
  const refs = [dark, orange];
  const word = { left: 28, top: 486, width: 440, height: 224 };
  await logoPart(logo, word, refs, null, 'logo-yapi-header.png', 120);
  await logoPart(logo, word, refs, PAPER, 'logo-yapi-header-light.png', 120);
  await logoPart(logo, { left: 37, top: 34, width: 422, height: 440 }, refs, null, 'favicon.png', 96);
})();
