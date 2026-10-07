const sharp = require('sharp');
(async () => {
  const {data, info} = await sharp('reference/slide-05.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
  const px = (x,y)=>{const i=(y*info.width+x)*3;return [data[i],data[i+1],data[i+2]]};
  for (const y of [235,600,710]) { const r=[];for(let x=505;x<545;x++)r.push(px(x,y).join(',')); console.log(y, r.join(' ')); }
  for (const x of [560]) { const r=[];for(let y=222;y<240;y++)r.push(y+':'+px(x,y).join(','));console.log(r.join(' ')); const s=[];for(let y=705;y<725;y++)s.push(y+':'+px(x,y).join(','));console.log(s.join(' '));}
})();
