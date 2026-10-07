const sharp = require('sharp');
(async () => {
  const {data, info} = await sharp('assets/img/logo-yapi.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,bg=[223,197,172];
  const d=(i)=>Math.abs(data[i]-bg[0])+Math.abs(data[i+1]-bg[1])+Math.abs(data[i+2]-bg[2]);
  const rows=[];for(let y=0;y<H;y++){let n=0,minx=W,maxx=0;for(let x=0;x<W;x++){if(d((y*W+x)*3)>40){n++;minx=Math.min(minx,x);maxx=Math.max(maxx,x)}}rows.push([n,minx,maxx])}
  let segs=[],inS=false,s=0;rows.forEach((r,y)=>{if(r[0]>0&&!inS){inS=true;s=y}else if(r[0]===0&&inS){inS=false;segs.push([s,y-1])}});if(inS)segs.push([s,H-1]);
  for(const [a,b] of segs){let mn=W,mx=0;for(let y=a;y<=b;y++){if(rows[y][0]){mn=Math.min(mn,rows[y][1]);mx=Math.max(mx,rows[y][2])}}console.log('seg',a,b,'x',mn,mx)}
  const darks={};for(let i=0;i<data.length;i+=3){const k=data[i]>>3<<3|0;} 
  console.log('sample dark', [...data.slice((520*W+250)*3,(520*W+250)*3+3)], [...data.slice((600*W+100)*3,(600*W+100)*3+3)]);
})();
