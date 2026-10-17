export const FOTO_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;padding-bottom:80px}
.top{padding:12px;border-bottom:1px solid #222;position:sticky;top:0;background:#000;z-index:10;display:flex;justify-content:space-between}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}
.cell{aspect-ratio:1;background:#111;position:relative;overflow:hidden;cursor:pointer}
.cell img{width:100%;height:100%;object-fit:cover}
.cell .play{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.25)}
.cell .play div{width:36px;height:36px;background:rgba(0,0,0,0.7);border-radius:50%;display:grid;place-items:center}
.fab{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#00ff88;color:#000;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;font-size:32px;font-weight:900;z-index:50;box-shadow:0 0 15px rgba(0,255,136,0.6);cursor:pointer}
#upPanel{position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:100;display:none;padding:16px;overflow-y:auto}
.box{max-width:480px;margin:40px auto;background:#111;border:1px solid #333;border-radius:16px;padding:16px}
input{width:100%;background:#0a0a0a;border:1px solid #333;color:#fff;padding:12px;border-radius:10px;margin-top:8px}
.btn{width:100%;margin-top:10px;padding:12px;border-radius:10px;border:0;font-weight:900;cursor:pointer}
.btn-g{background:#00ff88;color:#000}.btn-w{background:#222;color:#fff;border:1px solid #333}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:22px}.bot a.on{color:#fff}
#modal{position:fixed;inset:0;background:#000;z-index:999;display:none;flex-direction:column}
</style></head><body>
<div id=app>
<div class=top><b>RG FOTO</b><span style="font-size:11px;color:#00ff88">Semua bisa tambah Bos!</span></div>
<div class=grid3 id=fg></div>
<div class=fab onclick="toggleUp()">+</div>
</div>

<div id=upPanel>
<div class=box>
<div style="display:flex;justify-content:space-between"><b style="color:#00ff88">TAMBAH FOTO BOS</b><button onclick="toggleUp()" style="background:#222;color:#fff;border:1px solid #444;border-radius:50%;width:32px;height:32px">X</button></div>

<div style="margin-top:14px;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:12px">
<b style="font-size:12px">1. Paste Link Instagram Bos (Reel/Foto)</b>
<input id=igUrl placeholder="https://www.instagram.com/reel/xxxxx/">
<button class="btn btn-g" onclick="previewIG()">🔍 AMBIL THUMBNAIL</button>
<div id=igPrev style="display:none;margin-top:10px;border:1px solid #333;padding:8px;border-radius:10px">
<img id=igPrevImg style="width:100%;border-radius:8px;aspect-ratio:1/1;object-fit:cover">
<div id=igPrevAkun style="color:#00ff88;font-size:12px;margin-top:6px"></div>
<button class="btn btn-g" onclick="saveIG()">+ SIMPAN KE FOTO (Auto Play)</button>
</div>
<div style="font-size:10px;color:#666;margin-top:6px">Link IG akan auto-play pakai embed Bos: linkIG + /embed</div>
</div>

<div style="margin-top:14px;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:12px">
<b style="font-size:12px">2. Upload Foto dari HP Bos</b>
<input id=fFile type=file accept="image/*">
<button class="btn btn-w" onclick="upFoto()">📤 UPLOAD FOTO</button>
</div>

</div>
</div>

<div id=modal>
<div style="padding:12px;display:flex;justify-content:space-between;border-bottom:1px solid #222"><span id=mAkun style="color:#00ff88"></span><button onclick="closeM()" style="background:#222;color:#fff;border:0;padding:6px 14px;border-radius:20px">Tutup</button></div>
<div id=mContent style="flex:1;display:flex;background:#000"></div>
<div style="padding:12px;border-top:1px solid #222"><div id=mCap style="font-size:13px"></div><a id=mLink target="_blank" style="display:block;margin-top:10px;background:#00ff88;color:#000;text-align:center;padding:12px;border-radius:10px;font-weight:900;text-decoration:none">Buka di Instagram ↗ https://instagram.com/...</a></div>
</div>

<div class=bot><a href="/">🏠</a><a href="/foto" class=on>🖼️</a><a href="/video">🎬</a><a href="/kantor">🏢</a><a href="/ai">🤖</a><a href="/akun">👤</a></div>
<script>
let tempIG={};
function toggleUp(){ let p=document.getElementById('upPanel'); p.style.display=p.style.display==='block'?'none':'block'; }
async function loadFoto(){
 let r=await fetch('/api/ig-curated'); let data=await r.json();
 let r2=await fetch('/api/images'); let d2=await r2.json();
 let all=[...data,...d2.map(x=>({akun:'user',img:x.url,caption:'Foto user Bos',linkIG:x.url}))];
 let g=document.getElementById('fg');
 if(!all.length){ g.innerHTML='<div style=grid-column:1/-1;padding:40px;text-align:center;color:#555">Belum ada foto Bos, jadi yang pertama Bos! Klik + di bawah Bos!</div>'; return; }
 g.innerHTML=all.map(x=>'<div class=cell onclick="openFoto(\\''+x.img+'\\',\\''+(x.caption||'').replace(/'/g,'')+'\\',\\'@'+x.akun+'\\',\\''+x.linkIG+'\\')"><img src="'+x.img+'" loading=lazy><div class=play><div>▶️</div></div><div style=position:absolute;bottom:2px;left:2px;background:rgba(0,0,0,0.6);color:#fff;font-size:8px;padding:2px 4px;border-radius:4px>@'+x.akun+'</div></div>').join('');
}
function openFoto(img,cap,akun,linkIG){
 document.getElementById('mAkun').innerText=akun;
 document.getElementById('mCap').innerText=cap;
 document.getElementById('mLink').href=linkIG;
 document.getElementById('mLink').innerText='Buka di Instagram ↗ '+linkIG;
 let c=document.getElementById('mContent');
 let embed=linkIG.split('?')[0]; if(!embed.endsWith('/')) embed+='/'; embed+='embed';
 if(linkIG.includes('instagram.com')){ c.innerHTML='<iframe src="'+embed+'" style="width:100%;height:100%;border:0" allowfullscreen allow="autoplay; encrypted-media"></iframe>'; }
 else { c.innerHTML='<img src="'+img+'" style="width:100%;height:100%;object-fit:contain">'; }
 document.getElementById('modal').style.display='flex';
}
function closeM(){ document.getElementById('modal').style.display='none'; document.getElementById('mContent').innerHTML=''; }
async function previewIG(){
 let url=document.getElementById('igUrl').value.trim(); if(!url) return alert('Paste link IG dulu Bos!');
 document.getElementById('igPrev').style.display='block'; document.getElementById('igPrevImg').src='https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7d4c58900a85_w200.gif';
 try{
  let res=await fetch('/api/ig-preview?url='+encodeURIComponent(url));
  let j=await res.json();
  tempIG={akun:j.username||'minang',img:j.thumbnail,linkIG:url,caption:j.caption||'Dari @'+j.username,video:''};
  document.getElementById('igPrevImg').src=j.thumbnail;
  document.getElementById('igPrevAkun').innerText='@'+tempIG.akun+' • Siap auto-play Bos';
 }catch(e){ alert('IG diblok Bos, coba link lain Bos'); document.getElementById('igPrev').style.display='none'; }
}
async function saveIG(){
 if(!tempIG.img) return alert('Ambil dulu Bos');
 let res=await fetch('/api/ig-curated/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tempIG)});
 let j=await res.json(); if(j.ok){ alert('Berhasil Bos! Foto akan auto-play!'); toggleUp(); loadFoto(); } else alert('Gagal Bos');
}
async function upFoto(){
 let el=document.getElementById('fFile'); if(!el.files[0]) return alert('Pilih foto Bos');
 let f=el.files[0]; let rd=new FileReader();
 rd.onload=async e=>{
  let img=new Image(); img.onload=async ()=>{
   let c=document.createElement('canvas'); c.width=600; c.height=600*img.height/img.width; c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   let d=c.toDataURL('image/jpeg',0.6);
   await fetch('/api/images/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:d})});
   alert('Upload OK Bos!'); toggleUp(); loadFoto();
  }; img.src=e.target.result;
 }; rd.readAsDataURL(f);
}
loadFoto();
<\/script></body></html>
`;
