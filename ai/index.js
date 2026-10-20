export const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun & Profil - Rumah Gadang AI</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-top:64px;padding-bottom:80px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6)}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff88;position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;z-index:100}
.logo-title{display:flex;gap:10px;align-items:center}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;box-shadow:0 0 8px #00ff88}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 18px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer}
.login-card{margin:16px;background:#fff;border-radius:20px;padding:20px;color:#000;border:2px solid #00ff88}
.login-title{font-size:22px;font-weight:800;margin-bottom:16px;color:#000}
.tabs-auth{display:flex;gap:8px;margin-bottom:16px}
.tab-btn{flex:1;padding:10px 4px;border-radius:12px;border:none;font-size:13px;font-weight:700;cursor:pointer;background:#ececec;color:#333}
.tab-btn.active{background:#000;color:#fff}
.input-field{width:100%;padding:14px 16px;background:#f3f3f3;border:1px solid #e0e0e0;border-radius:14px;font-size:14px;margin-bottom:12px;outline:none}
.btn-submit{width:100%;padding:14px;background:#000;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;margin-top:4px}
.gadang-img-box{margin:16px;border-radius:20px;overflow:hidden;border:2px solid #00ff88}
.gadang-img-box img{width:100%;display:block;max-height:300px;object-fit:cover}
.profile-sec{padding:16px}
.prof-top{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.avatar-wrap{position:relative;width:72px;height:72px;flex-shrink:0}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid #00ff88}
.avatar-badge{position:absolute;bottom:0;right:0;background:#00ff88;color:#000;border-radius:50%;width:22px;height:22px;display:grid;place-items:center;font-weight:900;font-size:16px;border:2px solid #000;box-shadow:0 0 6px #00ff88}
.music-bubble{position:absolute;top:-20px;left:-10px;background:#222;color:#aaa;padding:4px 8px;border-radius:10px;font-size:10px;border:1px solid #444}
.stats-wrap{flex:1;display:flex;justify-content:space-around;text-align:center}
.stat-num{font-size:18px;font-weight:800;color:#fff}
.stat-label{font-size:12px;color:#888}
.name-display{font-size:16px;font-weight:800;margin-bottom:12px;color:#fff}
.action-bar{display:flex;gap:8px;margin-bottom:16px;align-items:center}
.btn-action{flex:1;padding:10px;background:#222;color:#fff;border:1px solid #333;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;text-align:center}
.btn-keluar{background:#ff3333!important;color:#fff!important;border:none!important;font-weight:800}
.btn-follow{background:#00ff88!important;color:#000!important;border:none!important;font-weight:900}
.btn-following{background:#333!important;color:#fff!important;border:1px solid #555!important}
.btn-icon{width:38px;height:38px;background:#222;border:1px solid #333;border-radius:10px;display:grid;place-items:center;color:#fff;cursor:pointer}
.main-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid #222;padding-bottom:12px}
.m-tab{flex:1;padding:10px;border-radius:12px;background:#222;color:#888;text-align:center;font-weight:800;font-size:14px;cursor:pointer;border:1px solid #333}
.m-tab.active{background:#3a86ff;color:#fff;border-color:#3a86ff}
.content-area{padding:10px 0}
.empty-box{text-align:center;padding:40px 20px;color:#aaa}
.empty-box h3{color:#fff;font-size:18px;margin-bottom:8px}
.btn-blue{background:#4d61ff;color:#fff;border:none;padding:12px 28px;border-radius:12px;font-weight:800;font-size:14px;cursor:pointer;margin-top:16px}
.user-item{display:flex;align-items:center;justify-content:space-between;background:#111;padding:12px;border-radius:14px;margin-bottom:10px;border:1px solid #222}
.user-info{display:flex;align-items:center;gap:12px;cursor:pointer}
.user-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.user-name{font-weight:800;font-size:14px;color:#fff}
.user-email{font-size:11px;color:#777}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style>
</head>
<body>
<div id="app">
  <div class="top">
    <div class="logo-title">
      <img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" class="logo">
      <b>RUMAH GADANG AI</b>
    </div>
    <button class="btn-home" onclick="location.href='/'">HOME</button>
  </div>
  <div id="viewContainer"></div>
</div>
<div class="bot">
  <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
  <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
  <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
  <a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a>
  <a href="/ai">🤖<br><span style="font-size:10px">AI</span></a>
  <a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a>
</div>
<script>
const LOGO_FALLBACK = "https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
let authTab = "masuk";
let activeMainTab = "foto";
let viewingUserEmail = null;
function getMyEmail(){ return (localStorage.getItem('rg_email')||"").toLowerCase().trim(); }
function getMyName(){ return localStorage.getItem('rg_name')||"Farel"; }
function getMyAvatar(){ return localStorage.getItem('rg_avatar')||LOGO_FALLBACK; }
function saveAuth(email, name, avatar){
  localStorage.setItem('rg_email', email.toLowerCase().trim());
  localStorage.setItem('rg_name', name || "Dunsanak");
  if(avatar) localStorage.setItem('rg_avatar', avatar);
}
function logout(){
  if(confirm("Keluar dari akun?")){
    localStorage.removeItem('rg_email');
    localStorage.removeItem('rg_name');
    localStorage.removeItem('rg_avatar');
    viewingUserEmail = null;
    render();
  }
}
async function render(){
  const myEmail = getMyEmail();
  const container = document.getElementById('viewContainer');
  if(!myEmail && !viewingUserEmail){
    renderLoginView(container);
    return;
  }
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
          <p style="text-align:center;font-size:13px;margin:20px 0;color:#555">Masuk cepat dengan akun Google Anda</p>
          <button class="btn-submit" onclick="doGoogleLogin()">Lanjutkan dengan Google</button>
        \` : \`
          \${authTab === 'daftar' ? '<input id="nameIn" class="input-field" placeholder="nama kamu: Farel">' : ''}
          <input id="emailIn" class="input-field" type="email" placeholder="email kamu: amanda@...">
          <input id="passIn" class="input-field" type="password" placeholder="password (bebas)">
          <button class="btn-submit" onclick="doAuth()">\${authTab==='masuk'?'Masuk':'Daftar Sekarang'}</button>
        \`}
      </div>
    </div>
    <div class="gadang-img-box">
      <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" onerror="this.src='\${LOGO_FALLBACK}'" alt="Rumah Gadang AI Neon">
    </div>
  \`;
}
function switchAuthTab(tab){ authTab = tab; render(); }
async function doAuth(){
  const email = document.getElementById('emailIn')?.value.trim();
  const pass = document.getElementById('passIn')?.value.trim();
  const name = document.getElementById('nameIn')?.value.trim() || "Dunsanak";
  if(!email){ alert("Isi email dulu Bos!"); return; }
  try {
    await fetch('/api/akun/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password: pass, picture: LOGO_FALLBadge = LOGO_FALLBACK })
    });
  } catch(e) {}
  saveAuth(email, name, LOGO_FALLBACK);
  render();
}
function doGoogleLogin(){
  const email = prompt("Masukkan email Google kamu:", "user@gmail.com");
  if(email){
    saveAuth(email, email.split('@')[0], LOGO_FALLBACK);
    render();
  }
}
async function renderProfileView(container, targetEmail, isMe){
  container.innerHTML = \`<div style="text-align:center;padding:40px;color:#888">Memuat profil...</div>\`;
  let profileData = { name: isMe ? getMyName() : "Dunsanak", picture: LOGO_FALLBACK, posts: 0, followers: 0, following: 0, isFollowing: false };
  try {
    let res = await fetch('/api/akun/profile?email=' + encodeURIComponent(targetEmail) + '&me=' + encodeURIComponent(getMyEmail()));
    if(res.ok){ let d = await res.json(); profileData = { ...profileData, ...d }; }
  } catch(e){}
  container.innerHTML = \`
    <div class="profile-sec">
      <div class="prof-top">
        <div class="avatar-wrap">
          <div class="music-bubble">Coba bagikan lagu...</div>
          <img src="\${profileData.picture || LOGO_FALLBACK}" class="avatar-img" onerror="this.src='\${LOGO_FALLBACK}'">
          <div class="avatar-badge">+</div>
        </div>
        <div class="stats-wrap">
          <div><div class="stat-num">\${profileData.posts || 0}</div><div class="stat-label">postingan</div></div>
          <div><div class="stat-num">\${profileData.followers || 0}</div><div class="stat-label">pengikut</div></div>
          <div><div class="stat-num">\${profileData.following || 0}</div><div class="stat-label">mengikuti</div></div>
        </div>
      </div>
      <div class="name-display">\${profileData.name || 'Dunsanak'}</div>
      <div class="action-bar">
        \${isMe ? \`
          <button class="btn-action" onclick="alert('Fitur edit profil')">Edit profil</button>
          <button class="btn-action btn-keluar" onclick="logout()">Keluar</button>
          <div class="btn-icon">👤</div>
        \` : \`
          <button id="followBtn" class="btn-action \${profileData.isFollowing ? 'btn-following' : 'btn-follow'}" onclick="toggleFollow('\${targetEmail}')">
            \${profileData.isFollowing ? 'Following' : 'Follow'}
          </button>
          <button class="btn-action" onclick="viewingUserEmail=null;render();">Kembali</button>
        \`}
      </div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchMainTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchMainTab('video')">video</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchMainTab('teman')">Teman</button>
      </div>
      <div id="tabContent" class="content-area">Memuat isi...</div>
    </div>
  \`;
  loadTabContent(targetEmail);
}
function switchMainTab(tab){ activeMainTab = tab; render(); }
async function loadTabContent(targetEmail){
  const box = document.getElementById('tabContent');
  if(!box) return;
  if(activeMainTab === 'teman'){
    box.innerHTML = '<div style="text-align:center;color:#666">Mengambil daftar pendaftar D1...</div>';
    try {
      let res = await fetch('/api/akun/list');
      let users = await res.json();
      if(!Array.isArray(users) || !users.length){
        box.innerHTML = '<div class="empty-box">Belum ada pengguna lain yang mendaftar.</div>';
        return;
      }
      box.innerHTML = users.map(u => \`
        <div class="user-item">
          <div class="user-info" onclick="viewUser('\${u.email}')">
            <img src="\${u.picture || LOGO_FALLBACK}" class="user-avatar" onerror="this.src='\${LOGO_FALLBACK}'">
            <div>
              <div class="user-name">\${u.name || 'Dunsanak'}</div>
              <div class="user-email">\${u.email}</div>
            </div>
          </div>
          <button class="btn-action btn-follow" style="padding:6px 14px;font-size:11px" onclick="viewUser('\${u.email}')">Lihat</button>
        </div>
      \`).join('');
    } catch(e) {
      box.innerHTML = '<div style="color:#ff4444;text-align:center">Gagal memuat teman dari D1</div>';
    }
  } else {
    box.innerHTML = \`
      <div class="empty-box">
        <h3>Buat postingan pertama Anda</h3>
        <p style="font-size:13px">Bagikan sudut pandang Anda.</p>
        <button class="btn-blue" onclick="location.href='/'">Buat</button>
      </div>
    \`;
  }
}
function viewUser(email){ viewingUserEmail = email; render(); }
async function toggleFollow(targetEmail){
  const myEmail = getMyEmail();
  if(!myEmail){ alert("Login dulu!"); return; }
  try {
    let res = await fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follower: myEmail, following: targetEmail })
    });
    let d = await res.json();
    if(d.ok){ render(); }
  } catch(e){ alert("Gagal follow: " + e.message); }
}
render();
</script>
</body>
</html>`;
