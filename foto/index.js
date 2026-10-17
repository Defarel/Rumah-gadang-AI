export const FOTO_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;padding-bottom:80px}
.top{padding:12px;border-bottom:1px solid #222;position:sticky;top:0;background:#000;z-index:10;display:flex;justify-content:space-between}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}
.cell{aspect-ratio:1;background:#111;position:relative;overflow:hidden;cursor:pointer}
.cell img{width:100%;height:100%;object-fit:cover}
.cell .play{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.2)}
.cell .play div{width:36px;height:36px;background:rgba(0,0,0,0.7);border-radius:50%;display:grid;place-items:center}
.fab{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#00ff88;color:#000;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-size:30px;font-weight:900;z-index:50}
#upPanel{position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:100;display:none;padding:16px;overflow-y:auto}
.box{max-width:480px;margin:20px auto;background:#111;border:1px solid #333;border-radius:16px;padding:16px}
input{width:100%;background:#0a0a0a;border:1px solid #333;color:#fff;padding:12px;border-radius:10px;margin-top:8px}
.btn{width:100%;margin-top:10px;padding:12px;border-radius:10px;border:0;font-weight:900}.btn-g{background:#00ff88;color:#000}.btn-w{background:#222;color:#fff;border:1px solid #333}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:22px}.bot a.on{color:#fff}
#modal{position:fixed;inset:0;background:#000;z-index:999;display:none;flex-direction:column}
#swipeWrap{flex:1;display:flex;overflow-x:scroll;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.slide{flex:0 0 100%;width:100%;height:100%;scroll-snap-align:start;position:relative;background:#000;display:flex;align-items:center;justify-content:center}
.slideMedia{width:100%;height:100%;position:relative;background:#000;display:flex;align-items:center;justify-content:center}
.slideMedia iframe{width:100%;height:100%;border:0}
.slideMedia img.thumb{width:100%;height:100%;object-fit:cover}
.slideMedia .bigPlay{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer}
.slideMedia .bigPlay div{width:80px;height:80px;background:rgba(0,0,0,0.7);border-radius:50%;display:grid;place-items:center;font-size:40px;border:2px solid #fff}
</style></head><body>
<div id=app>
<div class=top><b>RG FOTO</b><span style="font-size:11px;color:#00ff88">Swipe ↔ 1 Suara Bos!</span></div>
<div class=grid3 id=fg></div>
<div class=fab onclick="toggleUp()">+</div>
</div>

<div id=upPanel><div class=box>
<div style="display:flex;justify-content:space-between"><b style="color:#00ff88">TAMBAH FOTO BOS</b><button onclick="toggleUp()" style="background:#222;color:#fff;border:1px solid #444;border-radius:50%;width:32px;height:32px">X</button></div>
<input id=igUrl placeholder="https://www.instagram.com/reel/.../"><button class=btn btn-g onclick="previewIG()">🔍 AMBIL</button>
<div id=igPrev style="display:none;margin-top:10px;border:1px solid #333;padding:8px;border-radius:10px"><img id=igPrevImg style="width:100%;border-radius:8px;aspect-ratio:1/1;object-fit:cover"><div id=igPrevAkun style="color:#00ff88;font-size:12px;margin-top:6px"></div><button class="btn btn-g" onclick="saveIG()">+ SIMPAN</button></div>
<input id=fFile type=file accept="image/*" style="margin-top:14px"><button class="btn btn-w" onclick="upFoto()">📤 UPLOAD FOTO</button>
</div></div>

<div id=modal>
<div style="padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222">
<span id=mCount style="font-size:12px;color:#888">1/6</span>
<div style="display:flex;gap:8px;align-items:center">
<button id=soundBtn onclick="toggleSound()" style="background:#222;color:#fff;border:1px solid #444;padding:6px 12px;border-radius:20px;font-size:12px">🔇 Mute</button>
<span id=mAkun style="color:#00ff88;font-size:12px"></span>
<button onclick="closeM()" style="background:#222;color:#fff;border:0;padding:6px 14px;border-radius:20px">Tutup X</button>
</div>
</div>
<div id=swipeWrap></div>
<div style="padding:10px;border-top:1px solid #222;display:flex;gap:8px;background:#111">
<button onclick="swipe(-1)" style="flex:1;background:#222;color:#fff;border:1px solid #333;padding:12px;border-radius:10px">←</button>
<a id=mLink target="_blank" style="flex:2;background:#00ff88;color:#000;text-align:center;padding:12px;border-radius:10px;font-weight:900;text-decoration:none">Buka di IG ↗</a>
<button onclick="swipe(1)" style="flex:1;background:#222;color:#fff;border:1px solid #333;padding:12px;border-radius:10px">→</button>
</div>
</div>

<div class=bot><a href="/">🏠</a><a href="/foto" class=on>🖼️</a><a href="/video">🎬</a><a href="/kantor">🏢</a><a href="/ai">🤖</a><a href="/akun">👤</a></div>
<script>
let allData=[]; let curIdx=0; let tempIG={}; let soundOn=false;
function toggleUp(){ let p=document.getElementById('upPanel'); p.style.display=p.style.display==='block'?'none':'block'; }

async function loadFoto(){
 let r=await fetch('/api/ig-curated'); let d1=await r.json();
 let r2=await fetch('/api/images'); let d2=await r2.json();
 allData=[...d1.map(x=>({akun:x.akun,img:x.img,caption:x.caption||'',linkIG:x.linkIG||'',id:x.id})), ...d2.map(x=>({akun:'user',img:x.url,caption:'Foto user Bos',linkIG:x.url,id:x.id}))];
 let g=document.getElementById('fg');
 if(!allData.length){ g.innerHTML='<div style=grid-column:1/-1;padding:40px;text-align:center;color:#555>Belum ada foto Bos</div>'; return; }
 g.innerHTML=allData.map((x,i)=>'<div class=cell onclick="openAt('+i+')"><img src="'+x.img+'" loading=lazy onerror="this.src=\\'https://via.placeholder.com/300/111/555?text=RG\\'"><div class=play><div>▶️</div></div></div>').join('');
}

function getEmbed(linkIG){
 let embed=linkIG.split('?')[0]; if(!embed.endsWith('/')) embed+='/'; embed+='embed/';
 return embed;
}

function openAt(idx){
 curIdx=idx;
 let wrap=document.getElementById('swipeWrap');
 // BUAT SEMUA SLIDE JADI THUMBNAIL DULU BOS, CUMA 1 YANG JADI IFRAME BOS!
 wrap.innerHTML=allData.map((x,i)=>{
   let isIG = x.linkIG.includes('instagram.com');
   if(i===idx && isIG){
     return '<div class=slide data-idx="'+i+'"><div class=slideMedia id="media-'+i+'"><iframe src="'+getEmbed(x.linkIG)+'" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></div>';
   } else {
     return '<div class=slide data-idx="'+i+'"><div class=slideMedia id="media-'+i+'" onclick="playThis('+i+')"><img class=thumb src="'+x.img+'" loading=lazy><div class=bigPlay><div>▶️</div></div></div></div>';
   }
 }).join('');
 document.getElementById('modal').style.display='flex';
 updateInfo();
 setTimeout(()=>{ wrap.children[idx]?.scrollIntoView({inline:'start'}); },100);
 
 wrap.onscroll = debounce(()=>{
   let w=wrap.clientWidth; let newIdx=Math.round(wrap.scrollLeft/w);
   if(newIdx!==curIdx){ 
     stopAll(); curIdx=newIdx; playThis(newIdx); updateInfo(); 
   }
 },200);
}

function stopAll(){
 // MATIIN SEMUA VIDEO BOS, GANTI JADI THUMBNAIL BOS BIAR NGGAK TABRAKAN SUARA BOS!
 allData.forEach((x,i)=>{
   let el=document.getElementById('media-'+i);
   if(el && el.querySelector('iframe')){
     el.innerHTML='<img class=thumb src="'+x.img+'"><div class=bigPlay><div>▶️</div></div>';
     el.setAttribute('onclick','playThis('+i+')');
   }
 });
}

function playThis(idx){
 stopAll(); // matiin yang lain dulu Bos!
 let x=allData[idx]; if(!x) return;
 let el=document.getElementById('media-'+idx);
 if(!el) return;
 let isIG = x.linkIG.includes('instagram.com');
 if(isIG){
   el.innerHTML='<iframe src="'+getEmbed(x.linkIG)+'" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
 } else {
   el.innerHTML='<img class=thumb src="'+x.img+'" style="object-fit:contain">';
 }
 el.removeAttribute('onclick');
 curIdx=idx; updateInfo();
}

function swipe(dir){
 let newIdx=Math.max(0,Math.min(allData.length-1,curIdx+dir));
 stopAll(); curIdx=newIdx;
 playThis(newIdx);
 document.getElementById('swipeWrap').children[newIdx]?.scrollIntoView({behavior:'smooth',inline:'start'});
 updateInfo();
}

function updateInfo(){
 let x=allData[curIdx]; if(!x) return;
 document.getElementById('mAkun').innerText='@'+x.akun;
 document.getElementById('mCount').innerText=(curIdx+1)+' / '+allData.length;
 document.getElementById('mLink').href=x.linkIG;
}

function closeM(){ stopAll(); document.getElementById('modal').style.display='none'; document.getElementById('swipeWrap').innerHTML=''; }

function toggleSound(){
 soundOn=!soundOn;
 document.getElementById('soundBtn').innerText=soundOn?'🔊 Suara ON':'🔇 Mute';
 alert(soundOn?'Suara ON Bos! Tapi IG tetap butuh tap sekali Bos karena diblokir IG Bos!':'Mute Bos!');
 // Note: Instagram embed nggak bisa di-unmute lewat JS Bos, harus tap di videonya Bos
}

function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

async function previewIG(){ let url=document.getElementById('igUrl').value.trim(); if(!url) return alert('Paste link IG dulu Bos!'); document.getElementById('igPrev').style.display='block'; document.getElementById('igPrevImg').src='https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7d4c58900a85_w200.gif'; try{ let res=await fetch('/api/ig-preview?url='+encodeURIComponent(url)); let j=await res.json(); tempIG={akun:j.username||'minang',img:j.thumbnail,linkIG:url,caption:j.caption||''}; document.getElementById('igPrevImg').src=j.thumbnail; document.getElementById('igPrevAkun').innerText='@'+tempIG.akun; }catch(e){ alert('IG blok Bos'); document.getElementById('igPrev').style.display='none'; } }
async function saveIG(){ if(!tempIG.img) return alert('Ambil dulu Bos'); let res=await fetch('/api/ig-curated/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tempIG)}); let j=await res.json(); if(j.ok){ alert('Berhasil Bos!'); toggleUp(); loadFoto(); } }
async function upFoto(){ let el=document.getElementById('fFile'); if(!el.files[0]) return alert('Pilih foto Bos'); let f=el.files[0]; let rd=new FileReader(); rd.onload=async e=>{ let img=new Image(); img.onload=async ()=>{ let c=document.createElement('canvas'); c.width=600; c.height=600*img.height/img.width; c.getContext('2d').drawImage(img,0,0,c.width,c.height); let d=c.toDataURL('image/jpeg',0.6); await fetch('/api/images/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:d})}); alert('OK Bos!'); toggleUp(); loadFoto(); }; img.src=e.target.result; }; rd.readAsDataURL(f); }
loadFoto();
<\/script></body></html>
`;
