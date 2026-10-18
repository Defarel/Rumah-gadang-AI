export const HOME_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/png" href="/icon.png">
<link rel="apple-touch-icon" href="/icon.png">
<meta name="theme-color" content="#00ff88">
<meta name="msapplication-TileColor" content="#0a0a0a">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Rumah Gadang AI","url":"https://www.rumahgadang-ai.my.id","logo":"https://www.rumahgadang-ai.my.id/icon.png"}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:80px;
border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;
box-shadow:0 0 12px rgba(0,255,136,0.6), inset 0 0 12px rgba(0,255,136,0.15)}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;box-shadow:0 0 8px #00ff88}
.box{padding:12px;background:#0a0a0a;border-bottom:2px solid #00ff88;box-shadow:0 0 8px rgba(0,255,136,0.3)}
.inputRow{display:flex;gap:8px;align-items:center}
.txt{flex:1;background:#111;border:2px solid #00ff88;color:#fff;padding:14px 16px;border-radius:14px;font-size:15px;outline:none;box-shadow:0 0 10px rgba(0,255,136,0.5)}
.txt::placeholder{color:#aaa}
.btnPlus{width:48px;height:48px;background:#222;border:1px solid #333;color:#fff;border-radius:12px;font-size:28px;font-weight:900;display:grid;place-items:center;cursor:pointer;flex-shrink:0}
.btnKirim{width:100%;margin-top:10px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 12px rgba(0,255,136,0.6)}
#preview{margin-top:10px;display:none;position:relative}
#preview img{width:100%;border-radius:12px;max-height:320px;object-fit:cover;border:1px solid #00ff88}
#preview span{position:absolute;top:8px;right:8px;background:#000;color:#fff;padding:6px 10px;border-radius:20px;cursor:pointer;border:1px solid #333}
.post{padding:14px;display:flex;gap:10px;background:#0a0a0a;margin:10px 8px;border-radius:14px;border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;border-top:1px solid #1a1a1a;box-shadow:0 0 10px rgba(0,255,136,0.35), 0 0 20px rgba(0,255,136,0.15)}
.post-av{width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88;flex-shrink:0;box-shadow:0 0 6px rgba(0,255,136,0.5)}
.post-body{flex:1;min-width:0}
.post-name{font-weight:800;font-size:14px;color:#fff}
.post-time{font-size:11px;color:#888;margin-left:6px}
.post-text{margin-top:6px;font-size:14px;line-height:1.5;color:#fff;white-space:pre-wrap;word-break:break-word}
.post-img{margin-top:10px;border-radius:12px;overflow:hidden;border:1.5px solid #222}
.post-img img{width:100%;display:block}
.like-bar{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
.btn-like{background:#111;border:1px solid #333;color:#fff;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer}
.del{background:#ff1a1a;color:#fff;border:0;padding:6px 12px;border-radius:20px;font-size:11px;cursor:pointer;font-weight:800;box-shadow:0 0 8px rgba(255,0,0,0.6)}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99;box-shadow:0 -4px 12px rgba(0,255,136,0.3)}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style></head><body>
<div id=app>
<div class=top><div style="display:flex;gap:10px;align-items:center"><img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" class=logo><b><span style="color:#00FF88">R</span><span style="color:#ffffff">umah</span> <span style="color:#00FF88">G</span><span style="color:#ffffff">adang</span> <span style="color:#00FF88">AI</span></b></div><button id=loginBtn onclick="location.href='/akun'" style="background:#fff;color:#000;border:0;padding:6px 14px;border-radius:20px;font-weight:800;font-size:12px">LOGIN</button></div>
<div class=box>
<div class=inputRow>
<input id=tulisIn class=txt placeholder="Tulis disini...">
<button class=btnPlus onclick="document.getElementById('fileIn').click()">+</button>
</div>
<div id=preview><img id=prevImg><span onclick="clearImg()">✕</span></div>
<button class=btnKirim onclick="addTulis()">KIRIM</button>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>
<div id=homeFeed style="padding:4px 0;color:#666">Loading ⏳️⏳️⏳️...</div>
</div>
<div class=bot><a href="/" class=on>🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun">👤<br><span style="font-size:10px">Akun</span></a></div>
<script>
const LOGO_FALLBACK="https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
const ADMIN_EMAILS=["admin@rumahgadang-ai.my.id","naura@rumahgadang-ai.my.id"];
let selectedImg="";
function getEmail(){
  let e = localStorage.getItem('rg_email')||localStorage.getItem('user_email')||"";
  return e.toLowerCase().trim();
}
function getName(){ 
  try{
    let p = localStorage.getItem('rg_profile');
    if(p){ let j=JSON.parse(p); if(j.name) return j.name; }
  }catch{}
  return localStorage.getItem('rg_name')||"Dunsanak"; 
}
function getAvatar(){ 
  try{
    let p = localStorage.getItem('rg_profile');
    if(p){ let j=JSON.parse(p); if(j.picture) return j.picture; }
  }catch{}
  return localStorage.getItem('rg_avatar')||LOGO_FALLBACK; 
}
function isAdmin(){ return ADMIN_EMAILS.includes(getEmail()); }
function clearImg(){ selectedImg=""; document.getElementById('preview').style.display='none'; document.getElementById('prevImg').src=""; document.getElementById('fileIn').value=""; }
function updateLogin(){
  let email = getEmail();
  let btn = document.getElementById('loginBtn');
  if(email){
    btn.innerText = email.split('@')[0] + (isAdmin()? ' ADMIN':'');
    btn.style.background = isAdmin() ? '#00ff88' : '#fff';
  }
}
document.getElementById('fileIn').addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 if(f.size>4*1024*1024){alert("Max 4MB Bos!");return;}
 let r=new FileReader();
 r.onload=function(ev){ 
   // BOS! KOMPRES OTOMATIS BOS BIAR BISA KIRIM BOS!
   let img=new Image();
   img.onload=function(){
     let canvas=document.createElement('canvas');
     let max=600;
     let w=img.width,h=img.height;
     if(w>max||h>max){ if(w>h){ h*=max/w; w=max; } else { w*=max/h; h=max; } }
     canvas.width=w; canvas.height=h;
     canvas.getContext('2d').drawImage(img,0,0,w,h);
     selectedImg=canvas.toDataURL('image/jpeg',0.6);
     document.getElementById('prevImg').src=selectedImg;
     document.getElementById('preview').style.display='block';
   };
   img.src=ev.target.result;
 };
 r.readAsDataURL(f);
});
async function loadTulis(){
 try{
  let r=await fetch('/api/tulis'); let d=await r.json();
  let h=document.getElementById('homeFeed');
  if(!d.length){ h.innerHTML='<div style="text-align:center;padding:40px;color:#777">Belum ada tulisan Bos</div>'; return;}
  let admin=isAdmin();
  h.innerHTML=d.map(x=>{
   let isi = x.isi || x.text || x.judul || "";
   let img = x.picture || x.tulisImg || x.url || "";
   let waktu = x.created_at ? new Date(x.created_at).toLocaleString() : (x.time ? new Date(x.time).toLocaleString() : "");
   let nama = x.email ? x.email.split('@')[0] : (x.name||'Anonim');
   let av = LOGO_FALLBACK;
   return '<div class=post id="post-'+x.id+'"><img class=post-av src="'+av+'" onerror="this.src=\\''+LOGO_FALLBACK+'\\'"><div class=post-body><div><span class=post-name>'+nama+'</span><span class=post-time> • '+waktu+'</span></div><div class=post-text>'+isi+'</div>'+(img?'<div class=post-img><img src="'+img+'" loading=lazy></div>':'')+'<div class=like-bar><span class=btn-like>❤️ '+(x.likes||0)+'</span><span class=btn-like>💬 Komen</span>'+(admin?'<button class=del onclick="hapusPost(\\''+x.id+'\\')">HAPUS</button>':'')+'</div></div></div>';
  }).join('');
 }catch(e){ document.getElementById('homeFeed').innerHTML='Error Bos: '+e.message; }
}
async function addTulis(){
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt && !selectedImg){ alert("Tulis dulu Bos!"); return; }
 let email = getEmail();
 if(!email){ alert("Login dulu Bos di Akun Bos!"); location.href='/akun'; return; }
 let btn=document.querySelector('.btnKirim'); btn.innerText="MENGIRIM..."; btn.disabled=true;
 try{
  // BOS! INI YANG BENAR BOS! PAKAI isi, email, picture BOS!
  await fetch('/api/tulis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({isi:txt,email:email,picture:selectedImg})});
  document.getElementById('tulisIn').value=''; clearImg(); loadTulis();
 }catch(e){ alert("Gagal Bos: "+e.message); }
 btn.innerText="KIRIM"; btn.disabled=false;
}
async function hapusPost(id){
 if(!confirm("Hapus postingan ini Bos?")) return;
 let email = getEmail();
 if(!isAdmin()){ alert("Cuma admin Bos!"); return; }
 try{
   let r = await fetch('/api/tulis/delete?admin='+email,{
     method:'POST',
     headers:{'Content-Type':'application/json','X-Admin-Email':email},
     body:JSON.stringify({id:id})
   });
   let d = await r.json();
   if(d.error){ alert(d.error); return; }
   document.getElementById('post-'+id)?.remove();
   loadTulis();
 }catch(e){ alert("Error hapus Bos: "+e.message); }
}
updateLogin();
loadTulis();
<\/script></body></html>
`;
