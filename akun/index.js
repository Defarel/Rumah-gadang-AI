export const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun - Rumah Gadang AI</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{
max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:85px;
border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;
box-shadow:0 0 15px rgba(0,255,136,0.35), inset 0 0 0 1px rgba(0,255,136,0.2);
}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 20px;border-radius:20px;font-weight:900;font-size:12px;box-shadow:0 0 12px rgba(0,255,136,0.6);cursor:pointer}

/* LOGIN CARD KAYAK SCREENSHOT BOS */
.cardOuter{margin:12px;border-radius:22px;background:#fff;color:#000;padding:16px 14px 18px;box-shadow:0 0 0 2px #00ff88, 0 0 18px rgba(0,255,136,0.8), 0 0 36px rgba(0,255,136,0.35);position:relative}
.cardOuter h2{font-size:22px;font-weight:800;margin-bottom:12px;color:#000}
.tabsLogin{display:flex;gap:8px;margin-bottom:12px}
.tabsLogin button{flex:1;padding:10px 8px;border-radius:12px;border:0;font-weight:700;font-size:13px;cursor:pointer}
.tabsLogin button.on{background:#000;color:#fff}.tabsLogin button.off{background:#eee;color:#333}
.inp{width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px 14px;border-radius:12px;margin-top:10px;font-size:14px;outline:none;color:#000}
.inp:focus{border-color:#00ff88;box-shadow:0 0 0 2px rgba(0,255,136,0.2)}
.btnMasuk{width:100%;margin-top:12px;background:#000;color:#fff;border:0;padding:14px;border-radius:12px;font-weight:800;font-size:15px;cursor:pointer}
.cardLogo{margin:14px 12px;border-radius:22px;overflow:hidden;position:relative;height:420px;background:#0a0a0a;border:2px solid #00ff88;box-shadow:0 0 0 1px #00ff88, 0 0 18px #00ff88, inset 0 0 20px rgba(0,255,136,0.2);display:grid;place-items:center}
.cardLogo .brick{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600') center/cover;filter:brightness(0.3) contrast(1.2)}
.cardLogo .rgWrap{position:relative;z-index:2;width:88%;aspect-ratio:1;border-radius:50%;border:3px solid #00ff88;box-shadow:0 0 20px #00ff88, 0 0 50px rgba(0,255,136,0.6), inset 0 0 20px rgba(0,255,136,0.3);display:grid;place-items:center;background:radial-gradient(circle, rgba(0,255,136,0.15) 0%, rgba(0,0,0,0.9) 70%);padding:12px}
.cardLogo .rgWrap img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 12px #00ff88)}
.cardLogo .buka{position:absolute;bottom:36px;z-index:3;color:#fff;font-size:13px;background:rgba(0,0,0,0.6);padding:4px 12px;border-radius:20px;border:1px solid rgba(0,255,136,0.4)}

/* PROFILE LAMA BOS - TETAP ADA BOS */
.profile-sec{padding:18px 14px 10px}
.prof-top{display:flex;align-items:center;gap:18px;margin-bottom:14px}
.avatar-wrap{position:relative;width:76px;height:76px}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.5);background:#111}
.avatar-badge{position:absolute;bottom:-2px;right:-2px;background:#fff;color:#000;border-radius:50%;width:22px;height:22px;display:grid;place-items:center;font-weight:bold;font-size:14px;border:1.5px solid #000;cursor:pointer}
.stats-wrap{flex:1;display:flex;justify-content:space-between;text-align:center}
.stat-num{font-size:20px;font-weight:900}.stat-label{font-size:11px;color:#777;margin-top:2px}
.name-display{font-size:18px;font-weight:900;margin-top:4px}
.email-display{font-size:12px;color:#00ff88;margin-bottom:14px;opacity:0.9}
.action-bar{margin-bottom:16px}
.btn-follow-real{width:100%;padding:14px;background:#00ff88;color:#000;border:0;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 15px rgba(0,255,136,0.4)}
.btn-following-real{width:100%;padding:14px;background:#222;color:#fff;border:1px solid #444;border-radius:14px;font-weight:800;font-size:14px;cursor:pointer}
.btn-edit-keluar{display:flex;gap:8px;width:100%}
.btn-edit{flex:1;padding:13px;background:#222;color:#fff;border:1px solid #333;border-radius:12px;font-weight:700;font-size:13px}
.btn-keluar{flex:1;padding:13px;background:#1a1a1a;color:#ff4d4d;border:1px solid #331111;border-radius:12px;font-weight:800;font-size:13px}
.main-tabs{display:flex;gap:8px;margin:16px 0;border-bottom:1px solid #222;padding-bottom:14px;overflow:auto;scrollbar-width:none}
.main-tabs::-webkit-scrollbar{display:none}
.m-tab{min-width:78px;flex:1;padding:12px 10px;border-radius:12px;background:#2a2a2a;color:#888;text-align:center;font-weight:800;font-size:12px;cursor:pointer;border:1px solid #333;transition:.2s}
.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88;box-shadow:0 0 12px rgba(0,255,136,0.5);transform:translateY(-1px)}
.content-area{padding:6px 0}.empty-box{text-align:center;padding:50px 20px;color:#555;font-size:13px}
.user-fb{display:flex;gap:12px;background:#0f0f0f;padding:12px;border-radius:14px;margin-bottom:12px;border:1px solid #222}
.user-fb-av{width:60px;height:60px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.private-card{background:#111;border:1px solid #222;border-radius:14px;padding:12px;margin-bottom:12px}
.btn-add-fb{width:100%;background:#00ff88;color:#000;border:0;padding:11px;border-radius:10px;font-weight:900;font-size:13px;margin-bottom:6px}
.btn-hapus-fb{width:100%;background:#222;color:#aaa;border:0;padding:10px;border-radius:10px;font-size:12px}
.btn-add-private{width:100%;background:#111;border:1.5px dashed #00ff88;color:#00ff88;padding:14px;border-radius:14px;font-weight:800;margin-bottom:12px}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99;box-shadow:0 -5px 20px rgba(0,255,136,0.15)}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
#toast{position:fixed;left:50%;top:20px;transform:translateX(-50%);background:#00ff88;color:#000;padding:10px 16px;border-radius:20px;font-weight:800;font-size:12px;display:none;z-index:999;box-shadow:0 0 16px #00ff88}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo"><b style="letter-spacing:.5px">RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<input type="file" id="filePicker" accept="image/*" style="display:none">
<input type="file" id="privateFotoPicker" accept="image/*" style="display:none">
<input type="file" id="privateVideoPicker" accept="video/*" style="display:none">
<div class="bot"><a href="/">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a></div>
<div id=toast></div>
<script>
const LOGO_DEFAULT="https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
let activeMainTab="tulis";
let viewingUserEmail=null;
let loginMode='masuk';
const urlParams=new URLSearchParams(location.search);
const profilParam=urlParams.get('profil');
if(profilParam){ viewingUserEmail=decodeURIComponent(profilParam); }
function toast(m){let t=document.getElementById('toast');t.innerText=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500);}
function getMyEmail(){return (localStorage.getItem('rg_email')||"").toLowerCase().trim();}
function getMyName(){return localStorage.getItem('rg_name')||"Dunsanak";}
function getMyAvatar(){ let i=localStorage.getItem('rg_avatar'); return (i&&i.trim()!=="")?i:LOGO_DEFAULT; }
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n||"Dunsanak");localStorage.setItem('rg_avatar',(a&&a.trim()!=="")?a:LOGO_DEFAULT);}
function logout(){ if(confirm("Keluar?")){localStorage.removeItem('rg_email');localStorage.removeItem('rg_name');localStorage.removeItem('rg_avatar');viewingUserEmail=null;history.pushState(null,'','/akun');render();}}
function triggerGallery(){document.getElementById('filePicker').click();}
document.getElementById('filePicker').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=ev=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const MAX=800; let w=img.width,h=img.height; if(w>h){if(w>MAX){h*=MAX/w;w=MAX;}}else{if(h>MAX){w*=MAX/h;h=MAX;}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h); updateProfile(null,c.toDataURL('image/jpeg',0.85)); }; img.src=ev.target.result; };
  r.readAsDataURL(f);
});
async function updateProfile(n,a){ const e=getMyEmail(); if(!e) return; const fn=n||getMyName(); const fa=a||getMyAvatar(); saveAuth(e,fn,fa); render(); try{await fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,name:fn,picture:fa})});}catch(e){}}
async function render(){ const my=getMyEmail(); const cont=document.getElementById('viewContainer'); 
if(!my&&!viewingUserEmail){
  // TAMPILAN LUAR BOS - KAYAK SCREENSHOT BOS!
  cont.innerHTML=\`
<div class="cardOuter">
<h2>Rumah Gadang AI</h2>
<div class="tabsLogin">
<button id="tabMasuk" class="\${loginMode==='masuk'?'on':'off'}" onclick="switchLoginTab('masuk')">Masuk</button>
<button id="tabBuat" class="\${loginMode==='buat'?'on':'off'}" onclick="switchLoginTab('buat')">Buat Akun</button>
<button class="off" onclick="loginGoogle()">Google</button>
</div>
<input id="emailIn" class="inp" placeholder="lintas@rumahgadang-ai.my.id" value="lintas@rumahgadang-ai.my.id">
<input id="passIn" class="inp" type="password" placeholder="••••••••">
<input id="nameIn" class="inp" placeholder="Nama Dunsanak" style="display:\${loginMode==='buat'?'block':'none'}">
<button class="btnMasuk" onclick="doLogin()">\${loginMode==='masuk'?'Masuk':'Buat Akun'}</button>
<div style="font-size:11px;color:#666;margin-top:8px;text-align:center">Masuk untuk lanjut Bos</div>
</div>
<div class="cardLogo">
<div class="brick"></div>
<div class="rgWrap"><img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" onerror="this.src='https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png'" alt="RG AI"></div>
<div class="buka">Buka situs web</div>
</div>\`;
return;
} 
const target=viewingUserEmail||my; const isMe=target===my; renderProfile(cont,target,isMe);
}
function switchLoginTab(m){ loginMode=m; render(); }
async function doLogin(){ 
  let email=document.getElementById('emailIn').value.trim().toLowerCase(); 
  let pass=document.getElementById('passIn')?.value.trim()||'123456';
  let name=document.getElementById('nameIn')?.value.trim()||email.split('@')[0]; 
  if(!email.includes('@')) email+='@rumahgadang-ai.my.id'; 
  if(!email) return toast('Email Bos!');
  let btn=document.querySelector('.btnMasuk'); btn.innerText='Loading...'; btn.disabled=true;
  try{
    let url=loginMode==='masuk'?'/api/akun/login':'/api/akun/register';
    // fallback kalau login endpoint gak ada Bos, pakai register Bos
    let res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,picture:LOGO_DEFAULT,pass})}).catch(async()=>{
      return await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,picture:LOGO_DEFAULT})});
    });
    let j=await res.json().catch(()=>({ok:true}));
    saveAuth(email,name,LOGO_DEFAULT); 
    viewingUserEmail=null; 
    history.pushState(null,'','/akun'); 
    toast('Mantap Bos! Masuk!');
    render();
  }catch(e){ toast('Error Bos!'); saveAuth(email,name,LOGO_DEFAULT); render(); }
}
function loginGoogle(){ toast('Google coming soon Bos!'); }
function editProfil(){ const n=prompt("Nama baru:",getMyName()); if(n&&n.trim()) updateProfile(n.trim(),null); }
function switchTab(t){ activeMainTab=t; const me=viewingUserEmail||getMyEmail(); const isMe=me===getMyEmail(); loadContent(me,isMe); document.querySelectorAll('.m-tab').forEach((b,i)=>{ const tabs=['tulis','foto','video','teman']; b.classList.toggle('active', tabs[i]===t); }); }
function viewUser(e){ viewingUserEmail=e; activeMainTab='tulis'; history.pushState(null,'','/akun?profil='+encodeURIComponent(e)); render(); }
function getPrivateKey(t,e){ return 'rg_private_'+t+'_'+e.toLowerCase(); }
function getPrivateList(t,e){ try{ return JSON.parse(localStorage.getItem(getPrivateKey(t,e))||"[]"); }catch{return [];} }
function savePrivateList(t,e,l){ localStorage.setItem(getPrivateKey(t,e),JSON.stringify(l)); }
function addPrivateFoto(email){ const p=document.getElementById('privateFotoPicker'); p.onchange=ev=>{ const f=ev.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=e=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const MAX=1000; let w=img.width,h=img.height; if(w>MAX||h>MAX){if(w>h){h*=MAX/w;w=MAX;}else{w*=MAX/h;h=MAX;}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h); const url=c.toDataURL('image/jpeg',0.7); let l=getPrivateList('foto',email); l.unshift({id:Date.now(),data:url}); savePrivateList('foto',email,l); loadContent(email,true); }; img.src=e.target.result; }; r.readAsDataURL(f); p.value=''; }; p.click(); }
function addPrivateVideo(email){ const p=document.getElementById('privateVideoPicker'); p.onchange=ev=>{ const f=ev.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=e=>{ let l=getPrivateList('video',email); l.unshift({id:Date.now(),data:e.target.result}); savePrivateList('video',email,l); loadContent(email,true); }; r.readAsDataURL(f); p.value=''; }; p.click(); }
async function renderProfile(container,targetEmail,isMe){
  container.innerHTML='<div style="text-align:center;padding:40px;color:#666">Memuat...</div>';
  let data={name:isMe?getMyName():targetEmail.split('@')[0],picture:isMe?getMyAvatar():LOGO_DEFAULT,posts:0,followers:0,following:0,isFollowing:false};
  try{ let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail())+'&t='+Date.now()); if(r.ok){ let d=await r.json(); data={...data,...d}; if(!data.picture) data.picture=LOGO_DEFAULT; if(isMe) saveAuth(targetEmail,data.name,data.picture);} }catch(e){}
  container.innerHTML=\`
    <div class="profile-sec">
      <div class="prof-top"><div class="avatar-wrap"><img src="\${data.picture}" class="avatar-img"><div class="avatar-badge" onclick="\${isMe?'triggerGallery()':''}">+</div></div><div class="stats-wrap"><div><div class="stat-num">\${data.posts||0}</div><div class="stat-label">tulisan</div></div><div><div class="stat-num">\${data.followers||0}</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">\${data.following||0}</div><div class="stat-label">mengikuti</div></div></div></div>
      <div class="name-display">\${data.name}</div><div class="email-display">\${targetEmail}</div>
      <div class="action-bar">
        \${isMe ? \`<div class="btn-edit-keluar"><button class="btn-edit" onclick="editProfil()">Edit profil</button><button class="btn-keluar" onclick="logout()">Keluar</button></div>\` : \`<button id="followBtn" class="\${data.isFollowing?'btn-following-real':'btn-follow-real'}" onclick="toggleFollow('\${targetEmail}')">\${data.isFollowing?'✓ Mengikuti':'Follow'}</button>\`}
      </div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='tulis'?'active':''}" onclick="switchTab('tulis')">TULIS</button>
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchTab('video')">VIDEO</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchTab('teman')">TEMAN</button>
      </div>
      <div id="tabContent"></div>
    </div>\`;
  loadContent(targetEmail,isMe);
}
async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='teman'){
    box.innerHTML='<div style="font-weight:800;margin:8px 0 12px">Orang @rumahgadang-ai.my.id</div><div style="text-align:center;color:#555">Memuat...</div>';
    let allUsers=[];
    try{ let r=await fetch('/api/akun/list?t='+Date.now()); let u=await r.json(); if(Array.isArray(u)) allUsers=allUsers.concat(u); }catch(e){}
    try{ let r=await fetch('/api/tulis?t='+Date.now()); let posts=await r.json(); let arr=Array.isArray(posts)?posts:(posts.results||posts.data||[]); let map={}; arr.forEach(p=>{ let em=(p.user_email||p.email||'').toLowerCase(); if(em && em.includes('@rumahgadang-ai.my.id')){ if(!map[em]) map[em]={email:em,name:p.name||em.split('@')[0],picture:p.picture||LOGO_DEFAULT}; } }); allUsers=allUsers.concat(Object.values(map)); }catch(e){}
    let uniq={}; allUsers.forEach(u=>{ if(u.email && u.email.includes('@rumahgadang-ai.my.id')){ let k=u.email.toLowerCase(); if(!uniq[k]) uniq[k]=u; } });
    let finalList=Object.values(uniq).filter(u=>u.email.toLowerCase()!==getMyEmail().toLowerCase());
    if(!finalList.length){ box.innerHTML='<div class="empty-box">Belum ada pengguna lain</div>'; return; }
    box.innerHTML=finalList.map(u=>\`<div class="user-fb"><img src="\${u.picture||LOGO_DEFAULT}" class="user-fb-av"><div style="flex:1"><div style="font-weight:800">\${u.name||u.email.split('@')[0]}</div><div style="font-size:11px;color:#666">\${u.email}</div><div style="display:flex;gap:6px;margin-top:8px"><button class="btn-add-fb" style="flex:1" onclick="toggleFollow('\${u.email}')">Follow</button><button class="btn-hapus-fb" style="flex:1" onclick="viewUser('\${u.email}')">Lihat</button></div></div></div>\`).join('');
  } else if(activeMainTab==='tulis'){
    try{
      let r = await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)+'&t='+Date.now());
      if(!r.ok) r = await fetch('/api/tulis?t='+Date.now());
      let posts = await r.json();
      let list = Array.isArray(posts) ? posts : (posts.results || posts.data || []);
      let mine = list.filter(p => { let em = (p.user_email || p.email || '').toLowerCase(); return em === targetEmail.toLowerCase(); });
      if(!mine.length){ box.innerHTML='<div class="empty-box">Belum ada tulisan</div>'; return; }
      box.innerHTML = mine.map(p=>\`<div class="private-card"><div style="font-size:13px;white-space:pre-wrap">\${(p.text||p.isi||'').toString().replace(/</g,'&lt;')}</div>\${(p.tulisImg||p.img)?'<img src="'+(p.tulisImg||p.img)+'" style="margin-top:8px;width:100%;border-radius:10px">':''}</div>\`).join('');
    }catch(e){ box.innerHTML='<div class="empty-box">Gagal memuat tulisan</div>'; }
  } else if(activeMainTab==='foto'){
    let list=getPrivateList('foto',targetEmail); let h=''; if(isMe) h+=\`<button class="btn-add-private" onclick="addPrivateFoto('\${targetEmail}')">+ Tambah Foto Pribadi</button>\`; if(!list.length) h+='<div class="empty-box">Belum ada foto pribadi</div>'; else h+=list.map(x=>\`<div class="private-card"><img src="\${x.data}" style="width:100%;border-radius:10px"></div>\`).join(''); box.innerHTML=h;
  } else if(activeMainTab==='video'){
    let list=getPrivateList('video',targetEmail); let h=''; if(isMe) h+=\`<button class="btn-add-private" onclick="addPrivateVideo('\${targetEmail}')">+ Tambah Video Pribadi</button>\`; if(!list.length) h+='<div class="empty-box">Belum ada video pribadi</div>'; else h+=list.map(x=>\`<div class="private-card"><video controls src="\${x.data}" style="width:100%;border-radius:10px"></video></div>\`).join(''); box.innerHTML=h;
  }
}
async function toggleFollow(target){
  const me=getMyEmail(); if(!me){ alert("Login dulu Bos!"); return; }
  target=target.toLowerCase();
  const btn=document.getElementById('followBtn');
  if(btn){ btn.textContent='Loading...'; btn.disabled=true; }
  try{
    let res=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:me, following:target})});
    let j=await res.json();
    if(j.ok){ if(j.status==='followed'){ if(btn){ btn.textContent='✓ Mengikuti'; btn.className='btn-following-real'; } } else { if(btn){ btn.textContent='Follow'; btn.className='btn-follow-real'; } } setTimeout(()=>render(),600); } else { alert("Gagal: "+(j.error||"error")); render(); }
  }catch(e){ alert("Error: "+e.message); render(); }
}
render();
<\/script>
</body>
</html>
`;
export default AKUN_HTML;
