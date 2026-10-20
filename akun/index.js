export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun</title><style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:85px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,.3)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 20px;border-radius:20px;font-weight:900;font-size:12px}
.profile-sec{padding:18px 14px 10px}.prof-top{display:flex;gap:18px;align-items:center}
.avatar-wrap{position:relative;width:76px;height:76px}.avatar-img{width:100%;height:100%;border-radius:50%;border:2.5px solid #00ff88;object-fit:cover;background:#111}
.stats-wrap{flex:1;display:flex;justify-content:space-between;text-align:center}.stat-num{font-size:20px;font-weight:900}.stat-label{font-size:11px;color:#777}
.name-display{font-size:18px;font-weight:900;margin-top:10px}.email-display{font-size:12px;color:#00ff88;margin-bottom:14px}
.btn-follow-real{width:100%;padding:14px;background:#00ff88;color:#000;border:0;border-radius:14px;font-weight:900;font-size:15px}.btn-following-real{width:100%;padding:14px;background:#222;color:#fff;border:1px solid #444;border-radius:14px;font-weight:800}
.main-tabs{display:flex;gap:8px;margin:16px 0;border-bottom:1px solid #222;padding-bottom:14px}.m-tab{flex:1;padding:12px 6px;border-radius:12px;background:#2a2a2a;color:#888;text-align:center;font-weight:800;font-size:11px;border:1px solid #333;cursor:pointer}.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88;box-shadow:0 0 12px rgba(0,255,136,.5)}
.user-fb{display:flex;gap:12px;background:#0f0f0f;padding:12px;border-radius:14px;margin-bottom:12px;border:1px solid #222}.user-fb-av{width:56px;height:56px;border-radius:50%;border:1.5px solid #00ff88;object-fit:cover}.btn-add-fb{flex:1;background:#00ff88;color:#000;border:0;padding:9px;border-radius:8px;font-weight:900;font-size:12px}.btn-hapus-fb{flex:1;background:#222;color:#aaa;border:0;padding:9px;border-radius:8px;font-size:12px}.btn-followed-teman{flex:1;background:#333;color:#00ff88;border:1px solid #00ff88;padding:9px;border-radius:8px;font-weight:800;font-size:12px}
.private-card{background:#111;border:1px solid #222;border-radius:14px;padding:12px;margin-bottom:12px}.empty-box{text-align:center;padding:40px 20px;color:#555}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<div class="bot"><a href="/">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a></div>
<script>
const LOGO_DEFAULT="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
let activeMainTab="tulis"; let viewingUserEmail=null;
const urlParams=new URLSearchParams(location.search); if(urlParams.get('profil')) viewingUserEmail=decodeURIComponent(urlParams.get('profil'));
function getMyEmail(){return (localStorage.getItem('rg_email')||"").toLowerCase().trim();}
function getMyName(){return localStorage.getItem('rg_name')||"Dunsanak";}
function getMyAvatar(){let i=localStorage.getItem('rg_avatar'); return i&&i.trim()?i:LOGO_DEFAULT;}
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n);localStorage.setItem('rg_avatar',a||LOGO_DEFAULT);}
async function render(){const my=getMyEmail(); const cont=document.getElementById('viewContainer'); if(!my&&!viewingUserEmail){cont.innerHTML='<div style="margin:20px;background:#fff;border-radius:20px;padding:20px"><input id="emailIn" placeholder="naura@rumahgadang-ai.my.id" style="width:100%;padding:12px;border-radius:12px;background:#eee;margin-bottom:10px"><input id="nameIn" placeholder="Nama" style="width:100%;padding:12px;border-radius:12px;background:#eee;margin-bottom:10px"><button onclick="doLogin()" style="width:100%;padding:14px;background:#000;color:#fff;border-radius:12px;font-weight:800">Masuk</button></div>';return;} const target=viewingUserEmail||my; renderProfile(target, target===my);}
async function doLogin(){let e=document.getElementById('emailIn').value.trim().toLowerCase(); let n=document.getElementById('nameIn').value.trim()||e.split('@')[0]; if(!e.includes('@')) e+='@rumahgadang-ai.my.id'; try{await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,name:n,picture:LOGO_DEFAULT})})}catch{} saveAuth(e,n,LOGO_DEFAULT); viewingUserEmail=null; history.pushState(null,'','/akun'); render();}
async function renderProfile(targetEmail,isMe){
  const container=document.getElementById('viewContainer'); container.innerHTML='<div style="text-align:center;padding:40px;color:#666">Memuat...</div>';
  let data={name:isMe?getMyName():targetEmail.split('@')[0],picture:isMe?getMyAvatar():LOGO_DEFAULT,posts:0,followers:0,following:0,isFollowing:false};
  try{let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail())+'&t='+Date.now()); if(r.ok){let d=await r.json(); data={...data,...d};}}catch(e){}
  container.innerHTML='<div class="profile-sec"><div class="prof-top"><div class="avatar-wrap"><img src="'+data.picture+'" class="avatar-img"></div><div class="stats-wrap"><div><div class="stat-num">'+(data.posts||0)+'</div><div class="stat-label">tulisan</div></div><div><div class="stat-num">'+(data.followers||0)+'</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">'+(data.following||0)+'</div><div class="stat-label">mengikuti</div></div></div></div><div class="name-display">'+data.name+'</div><div class="email-display">'+targetEmail+'</div><div style="margin-bottom:16px">'+(isMe?'': '<button id="followBtn" class="'+(data.isFollowing?'btn-following-real':'btn-follow-real')+'" onclick="toggleFollow(\\''+targetEmail+'\\')">'+(data.isFollowing?'✓ Mengikuti':'Follow')+'</button>')+'</div><div class="main-tabs"><button class="m-tab '+(activeMainTab==='tulis'?'active':'')+'" onclick="switchTab(\\'tulis\\')">TULIS</button><button class="m-tab '+(activeMainTab==='foto'?'active':'')+'" onclick="switchTab(\\'foto\\')">FOTO</button><button class="m-tab '+(activeMainTab==='video'?'active':'')+'" onclick="switchTab(\\'video\\')">VIDEO</button><button class="m-tab '+(activeMainTab==='teman'?'active':'')+'" onclick="switchTab(\\'teman\\')">TEMAN</button></div><div id="tabContent"></div></div>';
  loadContent(targetEmail,isMe);
}
function switchTab(t){activeMainTab=t; const me=viewingUserEmail||getMyEmail(); loadContent(me, me===getMyEmail()); document.querySelectorAll('.m-tab').forEach(b=>{b.classList.toggle('active', b.textContent.toLowerCase()===t);});}
function viewUser(e){viewingUserEmail=e; activeMainTab='tulis'; history.pushState(null,'','/akun?profil='+encodeURIComponent(e)); render();}
async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='teman'){
    box.innerHTML='<div style="color:#666;text-align:center;padding:20px">Memuat teman @rumahgadang-ai.my.id...</div>';
    let users=[]; try{let r=await fetch('/api/akun/list?t='+Date.now()); let j=await r.json(); if(Array.isArray(j)) users=j;}catch(e){}
    // filter
    let me=getMyEmail(); users=users.filter(u=>u.email.toLowerCase()!==me);
    if(!users.length){box.innerHTML='<div class="empty-box">Belum ada akun lain.<br>Login pakai naura@, lintas@, dll dulu Bos biar muncul</div>'; return;}
    // cek follow status untuk semua
    let html=''; for(let u of users){ let isF=false; try{let r=await fetch('/api/akun/profile?email='+encodeURIComponent(u.email)+'&me='+encodeURIComponent(me)+'&t='+Date.now()); let d=await r.json(); isF=d.isFollowing;}catch(e){} html+='<div class="user-fb"><img src="'+(u.picture||LOGO_DEFAULT)+'" class="user-fb-av"><div style="flex:1"><div style="font-weight:800">'+(u.name||u.email.split('@')[0])+'</div><div style="font-size:11px;color:#666">'+u.email+'</div><div style="display:flex;gap:6px;margin-top:8px"><button class="'+(isF?'btn-followed-teman':'btn-add-fb')+'" onclick="toggleFollow(\\''+u.email+'\\')">'+(isF?'✓ Mengikuti':'Follow')+'</button><button class="btn-hapus-fb" onclick="viewUser(\\''+u.email+'\\')">Lihat</button></div></div></div>'; }
    box.innerHTML=html;
  } else if(activeMainTab==='tulis'){
    try{let r=await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)+'&t='+Date.now()); if(!r.ok) r=await fetch('/api/tulis?t='+Date.now()); let j=await r.json(); let list=Array.isArray(j)?j:(j.results||j.data||[]); let mine=list.filter(p=> (p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase()); if(!mine.length) box.innerHTML='<div class="empty-box">Belum ada tulisan</div>'; else box.innerHTML=mine.map(p=>'<div class="private-card"><div style="font-size:13px;white-space:pre-wrap">'+(p.text||'').replace(/</g,'&lt;')+'</div></div>').join('');}catch(e){box.innerHTML='<div class="empty-box">Gagal memuat</div>';}
  } else { box.innerHTML='<div class="empty-box">Kosong</div>'; }
}
async function toggleFollow(target){
  const me=getMyEmail(); if(!me){alert('Login dulu Bos!');return;}
  target=target.toLowerCase();
  const btn=document.getElementById('followBtn'); if(btn){btn.textContent='Loading...'; btn.disabled=true;}
  try{let res=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:me, following:target})}); let j=await res.json(); console.log(j); if(j.ok){ if(j.status==='followed'){ if(btn){btn.textContent='✓ Mengikuti'; btn.className='btn-following-real';} } else { if(btn){btn.textContent='Follow'; btn.className='btn-follow-real';}} setTimeout(()=>render(),600);} else {alert('Gagal: '+j.error); render();}}catch(e){alert('Error: '+e.message); render();}
}
render();
<\/script></body></html>
`;

**Lu udah di langkah terakhir Bos!** D1 udah bener kayak screenshot lu Bos.

Abis deploy file di atas Bos:

1.  Login `lintas@rumahgadang-ai.my.id` Bos
2.  Klik tab **TEMAN** Bos -> bakal keluar `naura@rumahgadang-ai.my.id` dan akun lain Bos
3.  Klik **Follow** di situ Bos -> langsung jadi **✓ Mengikuti** Bos
4.  Buka `naura@rumahgadang-ai.my.id` Bos -> pengikutnya jadi **1** Bos
5.  Ganti login ke `naura@` Bos, follow balik `lintas@` Bos -> sekarang saling follow Bos, kayak IG Bos!

Coba Bos, abis itu kirim screenshot tab TEMAN nya Bos!
