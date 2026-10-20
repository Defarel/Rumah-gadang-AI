export default `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - Komunitas Minangkabau</title>
<meta name="description" content="Rumah Gadang AI - Komunitas digital Minangkabau, berbagi foto video dan AI karya anak Minang.">
<meta name="robots" content="index, follow">
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<link rel="canonical" href="https://www.rumahgadang-ai.my.id/">
<meta property="og:image" content="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Rumah Gadang AI","url":"https://www.rumahgadang-ai.my.id","logo":"https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png"}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:90px;border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;box-shadow:0 0 18px rgba(0,255,136,0.55), inset 0 0 18px rgba(0,255,136,0.12)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #151515;position:sticky;top:0;background:#000;z-index:20}
.logo{width:38px;height:38px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;box-shadow:0 0 10px #00ff88}
.brand{font-weight:900;letter-spacing:0.5px;font-size:15px}
.btnLogin{background:#fff;color:#000;border:0;padding:7px 16px;border-radius:22px;font-weight:900;font-size:12px;cursor:pointer;box-shadow:0 0 10px rgba(255,255,255,0.2)}
.box{padding:12px;background:#080808;border-bottom:2.5px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.25)}
.inputRow{display:flex;gap:8px;align-items:center}
.txt{flex:1;background:#121212;border:2px solid #00ff88;color:#fff;padding:14px 16px;border-radius:16px;font-size:15px;outline:none;box-shadow:0 0 12px rgba(0,255,136,0.45)}
.txt::placeholder{color:#8a8a8a}
.btnPlus{width:50px;height:50px;background:#1a1a1a;border:1.5px solid #2a2a2a;color:#fff;border-radius:14px;font-size:28px;font-weight:900;display:grid;place-items:center;cursor:pointer;flex-shrink:0}
.btnKirim{width:100%;margin-top:12px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:16px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 16px rgba(0,255,136,0.7);transition:0.15s}
.btnKirim:active{transform:scale(0.98)}
#preview{margin-top:12px;display:none;position:relative}
#preview img{width:100%;border-radius:14px;max-height:360px;object-fit:cover;border:1.5px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.3)}
#preview span{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.8);color:#fff;padding:6px 11px;border-radius:22px;cursor:pointer;border:1px solid #333;font-size:13px}
.post{padding:14px;display:flex;gap:11px;background:#0c0c0c;margin:12px 10px;border-radius:16px;border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;border-top:1px solid #1e1e1e;box-shadow:0 0 12px rgba(0,255,136,0.35), 0 0 24px rgba(0,255,136,0.12)}
.post-av{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;flex-shrink:0;box-shadow:0 0 8px rgba(0,255,136,0.5)}
.post-body{flex:1;min-width:0}
.post-name{font-weight:800;font-size:14px;color:#fff}
.post-email{font-size:11px;color:#00ff88;margin-left:4px}
.post-time{font-size:11px;color:#777;margin-left:6px}
.post-text{margin-top:7px;font-size:14.5px;line-height:1.55;color:#f0f0f0;white-space:pre-wrap;word-break:break-word}
.post-img{margin-top:11px;border-radius:12px;overflow:hidden;border:1.5px solid #222}
.post-img img{width:100%;display:block}
.like-bar{margin-top:11px;display:flex;gap:8px;align-items:center}
.btn-like{background:#161616;border:1px solid #2a2a2a;color:#ddd;padding:7px 13px;border-radius:22px;font-size:12px;cursor:pointer}
.del{background:#ff1a1a;color:#fff;border:0;padding:7px 13px;border-radius:22px;font-size:11px;cursor:pointer;margin-left:auto}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:525px;background:#000;border-top:2.5px solid #00ff88;display:flex;z-index:99;box-shadow:0 -6px 18px rgba(0,255,136,0.28)}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px;line-height:1}
.bot a.on{color:#00ff88;text-shadow:0 0 8px #00ff88}
.bot a span{font-size:10px;display:block;margin-top:2px;font-weight:700}
.empty{text-align:center;padding:50px 20px;color:#666}
.empty b{color:#00ff88}
</style></head><body>
<div id=app>
<div class=top><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class=logo onerror="this.src='https://i.ibb.co/r2gL8YJB/1791014451654.jpg'"><div class=brand>RUMAH GADANG AI</div></div><button class=btnLogin onclick="location.href='/akun'">LOGIN</button></div>
<div class=box>
<div class=inputRow>
<input id=tulisIn class=txt placeholder="Tulis disini sanak...">
<button class=btnPlus onclick="document.getElementById('fileIn').click()">+</button>
</div>
<div id=preview><img id=prevImg><span onclick="clearImg()">✕ Hapus</span></div>
<button class=btnKirim onclick="addTulis()">KIRIM</button>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>
<div id=homeFeed><div class=empty>Tunggu sanak...<br><b style="font-size:12px">Memuat feed @rumahgadang-ai.my.id</b></div></div>
</div>
<div class=bot>
<a href="/" class=on>🏠<br><span>Home</span></a>
<a href="/foto">🖼️<br><span>Foto</span></a>
<a href="/video">🎬<br><span>Video</span></a>
<a href="/kantor">🏢<br><span>Kantor</span></a>
<a href="/ai">🤖<br><span>AI</span></a>
<a href="/akun">👤<br><span>Akun</span></a>
</div>
<script>
const LOGO_FALLBACK="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
const ADMIN_EMAILS=["admin@rumahgadang-ai.my.id","naura@rumahgadang-ai.my.id","defarel@rumahgadang-ai.my.id"];
let selectedImg="";
function getEmail(){let e=(localStorage.getItem('rg_email')||"").toLowerCase().trim(); if(e && !e.includes('@')) e=e+'@rumahgadang-ai.my.id'; return e;}
function getName(){return localStorage.getItem('rg_name')|| (getEmail()?getEmail().split('@')[0]:'Dunsanak');}
function getAvatar(){return localStorage.getItem('rg_avatar')||LOGO_FALLBACK;}
function isAdmin(){return ADMIN_EMAILS.includes(getEmail());}
function clearImg(){selectedImg="";document.getElementById('preview').style.display='none';document.getElementById('prevImg').src="";document.getElementById('fileIn').value="";}
document.getElementById('fileIn').addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 if(f.size>5*1024*1024){alert("Max 5MB Bos!");return;}
 let r=new FileReader();
 r.onload=function(ev){ selectedImg=ev.target.result; document.getElementById('prevImg').src=selectedImg; document.getElementById('preview').style.display='block'; };
 r.readAsDataURL(f);
});
function fmtTime(t){let d=new Date(Number(t)||Date.now()); return d.toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}
async function loadTulis(){
 try{
  let r=await fetch('/api/tulis',{cache:'no-store'}); 
  let d=await r.json();
  let list = Array.isArray(d) ? d : (d.results||[]);
  let h=document.getElementById('homeFeed');
  if(!list.length){ h.innerHTML='<div class=empty>Belum ada tulisan Bos<br><span style="font-size:12px;color:#888">Jadi yang pertama posting @rumahgadang-ai.my.id</span></div>'; return;}
  let admin=isAdmin();
  h.innerHTML=list.map(x=>{
   let text = x.text || x.isi || x.judul || '';
   let img = x.tulisImg || x.img || '';
   let name = x.name || (x.email||'').split('@')[0] || 'Dunsanak';
   let email = x.user_email || x.email || '';
   let pic = x.picture || LOGO_FALLBACK;
   let time = x.time || x.created_at || Date.now();
   let likes = x.likes||0;
   return '<div class=post id="post-'+x.id+'"><img class=post-av src="'+pic+'" onerror="this.src=\\''+LOGO_FALLBACK+'\\'"><div class=post-body><div><span class=post-name>'+name+'</span><span class=post-email>'+email+'</span><span class=post-time> • '+fmtTime(time)+'</span></div><div class=post-text>'+text.replace(/</g,'&lt;')+'</div>'+(img?'<div class=post-img><img src="'+img+'" loading=lazy></div>':'')+'<div class=like-bar><button class=btn-like>❤️ '+likes+'</button><button class=btn-like>💬 Komen</button>'+(admin?'<button class=del onclick="hapusPost('+x.id+')">HAPUS</button>':'')+'</div></div></div>';
  }).join('');
 }catch(e){ document.getElementById('homeFeed').innerHTML='<div class=empty>Error Bos: '+e.message+'<br><button onclick="loadTulis()" style="margin-top:10px;background:#00ff88;color:#000;border:0;padding:8px 14px;border-radius:8px;font-weight:800">COBA LAGI</button></div>'; }
}
async function addTulis(){
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt && !selectedImg){ alert("Tulis dulu sanak!"); return; }
 let btn=document.querySelector('.btnKirim'); btn.innerText="MENGIRIM..."; btn.disabled=true;
 try{
  let email = getEmail() || 'anon@rumahgadang-ai.my.id';
  if(!email.includes('@')) email = email + '@rumahgadang-ai.my.id';
  let payload = {text:txt, email:email, user_email:email, name:getName(), picture:getAvatar(), tulisImg:selectedImg, isi:txt, img:selectedImg};
  let r=await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  let j=await r.json();
  if(j.ok===false) throw new Error(j.error||'Gagal');
  document.getElementById('tulisIn').value=''; clearImg(); await loadTulis(); window.scrollTo({top:0,behavior:'smooth'});
 }catch(e){ alert("Gagal Bos: "+e.message); }
 btn.innerText="KIRIM"; btn.disabled=false;
}
async function hapusPost(id){
 if(!confirm("Hapus postingan ini Bos?")) return;
 try{
  await fetch('/api/tulis/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});
  await fetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'tulis',id:id,email:getEmail()})}).catch(()=>{});
  document.getElementById('post-'+id)?.remove();
 }catch(e){ alert(e.message); }
}
loadTulis();
setInterval(loadTulis, 15000);
<\/script></body></html>
`;
