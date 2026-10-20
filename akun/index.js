export const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun & Profil - Rumah Gadang AI</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:80px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6)}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo-title{display:flex;gap:10px;align-items:center}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;box-shadow:0 0 8px #00ff88}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 18px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer;box-shadow:0 0 8px rgba(0,255,136,0.6)}
.login-card{margin:20px 16px;background:#fff;border-radius:24px;padding:24px;color:#000;border:2px solid #00ff88;box-shadow:0 0 20px rgba(0,255,136,0.8)}
.login-title{font-size:22px;font-weight:800;margin-bottom:16px;color:#000}
.tabs-auth{display:flex;gap:8px;margin-bottom:16px}
.tab-btn{flex:1;padding:10px 4px;border-radius:12px;border:none;font-size:13px;font-weight:700;cursor:pointer;background:#ececec;color:#333;text-align:center}
.tab-btn.active{background:#000;color:#fff}
.input-field{width:100%;padding:14px 16px;background:#f3f3f3;border:1px solid #e0e0e0;border-radius:14px;font-size:14px;margin-bottom:12px;outline:none}
.btn-submit{width:100%;padding:14px;background:#000;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;margin-top:4px}
.gadang-img-box{margin:0 16px;border-radius:24px;overflow:hidden;border:2px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,0.5)}
.gadang-img-box img{width:100%;display:block;max-height:300px;object-fit:cover}
.profile-sec{padding:20px 16px 10px}
.prof-top{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.avatar-wrap{position:relative;width:72px;height:72px;flex-shrink:0}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid #00ff88;background:#111}
.avatar-badge{position:absolute;bottom:0;right:0;background:#fff;color:#000;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;font-weight:bold;font-size:14px;border:1px solid #000;cursor:pointer}
.music-bubble{position:absolute;top:-20px;left:-10px;background:#222;color:#aaa;padding:4px 8px;border-radius:10px;font-size:10px;border:1px solid #444;white-space:nowrap}
.stats-wrap{flex:1;display:flex;justify-content:space-around;text-align:center}
.stat-num{font-size:18px;font-weight:800;color:#fff}
.stat-label{font-size:12px;color:#888}
.name-display{font-size:16px;font-weight:800;margin-bottom:4px;color:#fff}
.email-display{font-size:12px;color:#00ff88;margin-bottom:12px}
.action-bar{display:flex;gap:8px;margin-bottom:20px;align-items:center}
.btn-action{flex:1;padding:12px;background:#222;color:#fff;border:1px solid #333;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;text-align:center}
.btn-keluar{background:#ff3333!important;color:#fff!important;border:none!important;font-weight:800}
.btn-follow{background:#00ff88!important;color:#000!important;border:none!important;font-weight:900}
.btn-following{background:#333!important;color:#fff!important;border:1px solid #555!important}
.main-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid #222;padding-bottom:12px}
.m-tab{flex:1;padding:12px;border-radius:12px;background:#222;color:#888;text-align:center;font-weight:800;font-size:14px;cursor:pointer;border:1px solid #333}
.m-tab.active{background:#3a86ff;color:#fff;border-color:#3a86ff;box-shadow:0 0 10px rgba(58,134,255,0.5)}
.content-area{padding:10px 0}
.empty-box{text-align:center;padding:50px 20px;color:#666;font-size:14px}
.user-item{display:flex;align-items:center;justify-content:space-between;background:#111;padding:12px;border-radius:14px;margin-bottom:10px;border:1px solid #222}
.user-info{display:flex;align-items:center;gap:12px;cursor:pointer}
.user-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.user-name{font-weight:800;font-size:14px;color:#fff}
.user-email{font-size:11px;color:#777}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99;box-shadow:0 -4px 12px rgba(0,255,136,0.3)}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style>
</head>
<body>
<div id="app">
  <div class="top">
    <div class="logo-title">
      <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo">
      <b>RUMAH GADANG AI</b>
    </div>
    <button class="btn-home" onclick="location.href='/'">HOME</button>
  </div>
  <div id="viewContainer"></div>
</div>
<input type="file" id="filePicker" accept="image/*" style="display:none" onchange="handleFileSelect(event)">
<div class="bot">
  <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
  <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
  <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
  <a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a>
  <a href="/ai">🤖<br><span style="font-size:10px">AI</span></a>
  <a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a>
</div>
<script>
const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
let authTab = "masuk";
let activeMainTab = "foto";
let viewingUserEmail = null;

// KUNCI BOS - BACA ?profil= DARI HOME BIAR KLIK FOTO LANGSUNG KE PROFIL ORANG
const urlParams = new URLSearchParams(location.search);
const profilParam = urlParams.get('profil');
if(profilParam){
  viewingUserEmail = decodeURIComponent(profilParam);
}

function getMyEmail(){ return (localStorage.getItem('rg_email')||"").toLowerCase().trim(); }
function getMyName(){ return localStorage.getItem('rg_name')||"Dunsanak"; }
function getMyAvatar(){ 
  let img = localStorage.getItem('rg_avatar');
  return (img && img.trim() !== "") ? img : LOGO_DEFAULT; 
}
function saveAuth(email, name, avatar){
  localStorage.setItem('rg_email', email.toLowerCase().trim());
  localStorage.setItem('rg_name', name || "Dunsanak");
  localStorage.setItem('rg_avatar', (avatar && avatar.trim() !== "") ? avatar : LOGO_DEFAULT);
}
function logout(){
  if(confirm("Keluar dari akun?")){
    localStorage.removeItem('rg_email');
    localStorage.removeItem('rg_name');
    localStorage.removeItem('rg_avatar');
    viewingUserEmail = null;
    history.pushState(null,'','/akun');
    render();
  }
}
function triggerGallery(){ document.getElementById('filePicker').click(); }
function handleFileSelect(event){
  const file = event.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      const canvas = document.createElement('canvas');
      const MAX = 800; let w=img.width,h=img.height;
      if(w>h){ if(w>MAX){h*=MAX/w;w=MAX;} } else { if(h>MAX){w*=MAX/h;h=MAX;} }
      canvas.width=w; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      updateProfileData(null, canvas.toDataURL('image/jpeg',0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
async function editProfile(){
  const newName = prompt("Masukkan nama baru:", getMyName()); if(newName===null) return;
  if(confirm("Ganti foto profil dari galeri?")){ 
    if(newName.trim() && newName.trim()!==getMyName()) updateProfileData(newName.trim(), null);
    triggerGallery(); 
  } else {
    if(newName.trim()) updateProfileData(newName.trim(), null);
  }
}
async function updateProfileData(newName, newAvatar){
  const email = getMyEmail(); if(!email) return;
  const finalName = newName || getMyName();
  const finalAvatar = newAvatar || getMyAvatar();
  saveAuth(email, finalName, finalAvatar); render(); 
  try{ await fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email, name:finalName, picture:finalAvatar})}); }catch(e){}
}
async function render(){
  const myEmail = getMyEmail();
  const container = document.getElementById('viewContainer');
  if(!myEmail && !viewingUserEmail){ renderLoginView(container); return; }
  const targetEmail = viewingUserEmail || myEmail;
  const isMe = (targetEmail === myEmail);
  renderProfileView(container, targetEmail, isMe);
}
function renderLoginView(container){
  container.innerHTML = \`
    <div class="login-card">
      <div class="login-title">Rumah Gadang AI</div>
      <div class="tabs-auth">
        <button class="tab-btn \${authTab==='masuk'?'active':''}" onclick="switchAuthTab('masuk')">Masuk</button>
        <button class="tab-btn \${authTab==='daftar'?'active':''}" onclick="switchAuthTab('daftar')">Buat Akun</button>
        <button class="tab-btn \${authTab==='google'?'active':''}" onclick="switchAuthTab('google')">Google</button>
      </div>
      <div id="authForm">
        \${authTab === 'google' ? \`
          <p style="text-align:center;font-size:13px;margin:20px 0;color:#555">Masuk cepat dengan Google</p>
          <button class="btn-submit" onclick="doGoogleLogin()">Lanjutkan dengan Google</button>
        \` : \`
          \${authTab === 'daftar' ? '<input id="nameIn" class="input-field" placeholder="nama kamu: Farel">' : ''}
          <input id="emailIn" class="input-field" type="email" placeholder="email: amanda@rumahgadang-ai.my.id">
          <input id="passIn" class="input-field" type="password" placeholder="password bebas">
          <button class="btn-submit" onclick="doAuth()">\${authTab==='masuk'?'Masuk':'Daftar'}</button>
        \`}
      </div>
    </div>
    <div class="gadang-img-box"><img src="\${LOGO_DEFAULT}"></div>
  \`;
}
function switchAuthTab(tab){ authTab=tab; render(); }
async function doAuth(){
  let email=document.getElementById('emailIn')?.value.trim().toLowerCase();
  const pass=document.getElementById('passIn')?.value.trim();
  const name=document.getElementById('nameIn')?.value.trim()||email.split('@')[0]||"Dunsanak";
  if(!email){alert("Isi email dulu Bos!");return;}
  if(!email.includes('@')) email=email+'@rumahgadang-ai.my.id';
  try{ await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,password:pass,picture:LOGO_DEFAULT})}); }catch(e){}
  saveAuth(email,name,LOGO_DEFAULT); viewingUserEmail=null; history.pushState(null,'','/akun'); render();
}
function doGoogleLogin(){
  let email=prompt("Email Google:","user@gmail.com"); if(email){ email=email.toLowerCase(); saveAuth(email,email.split('@')[0],LOGO_DEFAULT); viewingUserEmail=null; history.pushState(null,'','/akun'); render(); }
}
async function renderProfileView(container, targetEmail, isMe){
  container.innerHTML = \`<div style="text-align:center;padding:40px;color:#888">Memuat profil \${targetEmail}...</div>\`;
  let profileData = { name: isMe ? getMyName() : targetEmail.split('@')[0], picture: isMe ? getMyAvatar() : LOGO_DEFAULT, posts:0, followers:0, following:0, isFollowing:false };
  try{
    let res=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail()));
    if(res.ok){ let d=await res.json(); profileData={...profileData,...d}; if(!profileData.picture) profileData.picture=LOGO_DEFAULT; if(isMe) saveAuth(targetEmail,profileData.name,profileData.picture); }
  }catch(e){}
  container.innerHTML = \`
    <div class="profile-sec">
      <div class="prof-top">
        <div class="avatar-wrap">
          <div class="music-bubble">\${isMe?'Coba bagikan lagu...':profileData.name}</div>
          <img src="\${profileData.picture}" class="avatar-img" onerror="this.src='\${LOGO_DEFAULT}'">
          <div class="avatar-badge" onclick="\${isMe?'triggerGallery()':''}">+</div>
        </div>
        <div class="stats-wrap">
          <div><div class="stat-num">\${profileData.posts||0}</div><div class="stat-label">postingan</div></div>
          <div><div class="stat-num">\${profileData.followers||0}</div><div class="stat-label">pengikut</div></div>
          <div><div class="stat-num">\${profileData.following||0}</div><div class="stat-label">mengikuti</div></div>
        </div>
      </div>
      <div class="name-display">\${profileData.name}</div>
      <div class="email-display">\${targetEmail}</div>
      <div class="action-bar">
        \${isMe ? \`
          <button class="btn-action" onclick="editProfile()">Edit profil</button>
          <button class="btn-action btn-keluar" onclick="logout()">Keluar</button>
        \` : \`
          <button class="btn-action \${profileData.isFollowing?'btn-following':'btn-follow'}" onclick="toggleFollow('\${targetEmail}')">\${profileData.isFollowing?'Following':'Follow'}</button>
          <button class="btn-action" onclick="backToMyProfile()">Kembali ke Akunku</button>
        \`}
      </div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchMainTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchMainTab('video')">VIDEO</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchMainTab('teman')">TEMAN</button>
      </div>
      <div id="tabContent" class="content-area">Memuat...</div>
    </div>
  \`;
  loadTabContent(targetEmail);
}
function switchMainTab(tab){ activeMainTab=tab; render(); }
function backToMyProfile(){ viewingUserEmail=null; history.pushState(null,'','/akun'); render(); }
function viewUser(email){ viewingUserEmail=email; history.pushState(null,'','/akun?profil='+encodeURIComponent(email)); render(); }
async function loadTabContent(targetEmail){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='teman'){
    box.innerHTML='<div style="text-align:center;color:#666">Mengambil daftar D1...</div>';
    try{
      let res=await fetch('/api/akun/list'); let users=await res.json();
      if(!Array.isArray(users)||!users.length){ box.innerHTML='<div class="empty-box">Belum ada pengguna lain.</div>'; return; }
      box.innerHTML=users.map(u=>\`
        <div class="user-item">
          <div class="user-info" onclick="viewUser('\${u.email}')">
            <img src="\${u.picture||LOGO_DEFAULT}" class="user-avatar" onerror="this.src='\${LOGO_DEFAULT}'">
            <div><div class="user-name">\${u.name||'Dunsanak'}</div><div class="user-email">\${u.email}</div></div>
          </div>
          <button class="btn-action btn-follow" style="padding:6px 14px;font-size:11px" onclick="viewUser('\${u.email}')">Lihat Profil</button>
        </div>
      \`).join('');
    }catch(e){ box.innerHTML='<div style="color:#ff4444;text-align:center">Gagal memuat</div>'; }
  } else {
    try{
      let r=await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)); let posts=await r.json(); let list=Array.isArray(posts)?posts:(posts.results||[]);
      let myPosts=list.filter(p=>(p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase());
      if(!myPosts.length) box.innerHTML='<div class="empty-box">Belum ada '+activeMainTab+' dari '+targetEmail+'</div>';
      else box.innerHTML=myPosts.map(p=>\`<div style="background:#111;border:1px solid #222;border-radius:12px;padding:12px;margin-bottom:10px"><div style="font-size:13px;white-space:pre-wrap">\${(p.text||p.isi||'').slice(0,200)}</div>\${(p.tulisImg||p.img)?'<img src="'+(p.tulisImg||p.img)+'" style="width:100%;margin-top:8px;border-radius:10px">':''}</div>\`).join('');
    }catch(e){ box.innerHTML='<div class="empty-box">Belum ada '+activeMainTab+'</div>'; }
  }
}
async function toggleFollow(targetEmail){
  const myEmail=getMyEmail(); if(!myEmail){alert("Login dulu!");return;}
  try{ await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:myEmail,following:targetEmail})}); }catch(e){}
  render();
}
render();
<\/script>
</body>
</html>
`;
