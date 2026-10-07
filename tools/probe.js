const sharp = require('sharp');
(async () => {
  const {data, info} = await sharp('reference/slide-05.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
  const px = (x,y)=>{const i=(y*info.width+x)*3;return [data[i],data[i+1],data[i+2]]};
  const bg = px(10,400); console.log('bg', bg, info.width, info.height);
  const diff = (a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
  // scan row 450 for x range differing from bg
  for (const y of [240,450,700]) { let xs=[];for(let x=480;x<info.width;x++){if(diff(px(x,y),bg)>6)xs.push(x)} console.log('row',y,xs[0],xs[xs.length-1]); }
  for (const x of [600,1000,1380]) { let ys=[];for(let y=180;y<800;y++){if(diff(px(x,y),bg)>6)ys.push(y)} console.log('col',x,ys[0],ys[ys.length-1]); }
  console.log('px 535,240', px(535,240), 'px 700,600', px(700,600));
  const L = await sharp('assets/img/logo-yapi.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
  const lp=(x,y)=>{const i=(y*L.info.width+x)*3;return [L.data[i],L.data[i+1],L.data[i+2]]};
  console.log('logo corners', lp(2,2), lp(497,2), lp(2,730), lp(250,480), lp(250,690), lp(110,130));
})();
