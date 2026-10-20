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

/* Profil Utama */
.profile-sec{padding:16px}
.prof-top{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.avatar-wrap{position:relative;width:76px;height:76px;flex-shrink:0;cursor:pointer}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid #00ff88}
.avatar-badge{position:absolute;bottom:0;right:0;background:#00ff88;color:#000;border-radius:50%;width:24px;height:24px;display:grid;place-items:center;font-weight:900;font-size:16px;border:2px solid #000;box-shadow:0 0 6px #00ff88}
.stats-wrap{flex:1;display:flex;justify-content:space-around;text-align:center}
.stat-num{font-size:18px;font-weight:800;color:#fff}
.stat-label{font-size:12px;color:#888}
.name-display{font-size:18px;font-weight:800;margin-bottom:14px;color:#fff}
.action-bar{display:flex;gap:10px;margin-bottom:16px;align-items:center}
.btn-action{flex:1;padding:10px;background:#222;color:#fff;border:1px solid #333;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;text-align:center}
.btn-keluar{background:#ff3333!important;color:#fff!important;border:none!important;font-weight:800}

/* Navigasi Tab (FOTO, Video, Teman) */
.main-tabs{display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid #222;padding-bottom:12px}
.m-tab{flex:1;padding:10px;border-radius:12px;background:#181818;color:#888;text-align:center;font-weight:800;font-size:14px;cursor:pointer;border:1px solid #282828}
.m-tab.active{background:#1877f2;color:#fff;border-color:#1877f2}
.content-area{padding:10px 0}

/* Grid Foto (Maksimal 12) */
.gallery-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.gallery-count{font-size:12px;color:#00ff88;font-weight:bold}
.btn-add-photo{background:#00ff88;color:#000;border:none;padding:8px 14px;border-radius:10px;font-weight:800;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
.photo-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:8px}
.photo-item{position:relative;width:100%;padding-top:100%;border-radius:12px;overflow:hidden;background:#111;border:1px solid #222}
.photo-item img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
.photo-del{position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.7);color:#ff4444;border:none;border-radius:50%;width:22px;height:22px;font-weight:bold;cursor:pointer}

/* List Teman (Gaya Foto 2 / Facebook) */
.friend-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:14px}
.friend-card{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #1a1a1a}
.friend-avatar{width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer}
.friend-info{flex:1}
.friend-name{font-weight:700;font-size:15px;color:#fff;margin-bottom:2px;cursor:pointer}
.friend-mutual{font-size:12px;color:#999;margin-bottom:8px;display:flex;align-items:center;gap:4px}
.friend-mutual-img{width:16px;height:16px;border-radius:50%;object-fit:cover}
.friend-actions{display:flex;flex-direction:column;gap:6px}
.btn-add-friend{background:#1877f2;color:#fff;border:none;padding:8px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;width:100%;text-align:center}
.btn-remove-friend{background:#3a3b3c;color:#e4e6eb;border:none;padding:8px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;width:100%;text-align:center}

/* Modal Edit Profil */
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:200;padding:16px}
.modal-box{background:#181818;border:1px solid #00ff88;border-radius:20px;padding:20px;width:100%;max-width:400px;color:#fff}
.modal-title{font-size:18px;font-weight:800;margin-bottom:16px;color:#00ff88}

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

<!-- Input File Tersembunyi untuk Galeri -->
<input type="file" id="avatarInput" accept="image/*" style="display:none" onchange="handleAvatarSelect(event)">
<input type="file" id="photoInput" accept="image/*" style="display:none" onchange="handlePhotoSelect(event)">

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
let userPhotos = [];

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
  container.innerHTML = `
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
  `;
}

function switchAuthTab(tab){ authTab = tab; render(); }

async function doAuth(){
  const email = document.getElementById('emailIn')?.value.trim();
  const pass = document.getElementById('passIn')?.value.trim();
  const name = document.getElementById('nameIn')?.value.trim() || "Dunsanak";
  if(!email){ alert("Isi email dulu!"); return; }
  try {
    await fetch('/api/akun/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password: pass, picture: LOGO_FALLBACK })
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
  let profileData = { name: isMe ? getMyName() : "Dunsanak", picture: isMe ? getMyAvatar() : LOGO_FALLBACK, posts: 0, followers: 0, following: 0 };
  try {
    let res = await fetch('/api/akun/profile?email=' + encodeURIComponent(targetEmail) + '&me=' + encodeURIComponent(getMyEmail()));
    if(res.ok){ let d = await res.json(); profileData = { ...profileData, ...d }; }
  } catch(e){}

  container.innerHTML = `
    <div class="profile-sec">
      <div class="prof-top">
        <div class="avatar-wrap" onclick="\${isMe ? 'triggerAvatarSelect()' : ''}">
          <img src="\${profileData.picture || LOGO_FALLBACK}" class="avatar-img" onerror="this.src='\${LOGO_FALLBACK}'">
          \${isMe ? '<div class="avatar-badge">+</div>' : ''}
        </div>
        <div class="stats-wrap">
          <div><div class="stat-num" id="statPosts">\${profileData.posts || 0}</div><div class="stat-label">postingan</div></div>
          <div><div class="stat-num">\${profileData.followers || 0}</div><div class="stat-label">pengikut</div></div>
          <div><div class="stat-num">\${profileData.following || 0}</div><div class="stat-label">mengikuti</div></div>
        </div>
      </div>
      <div class="name-display">\${profileData.name || 'Dunsanak'}</div>
      <div class="action-bar">
        \${isMe ? \`
          <button class="btn-action" onclick="openEditModal()">Edit profil</button>
          <button class="btn-action btn-keluar" onclick="logout()">Keluar</button>
        \` : \`
          <button class="btn-action" style="background:#1877f2" onclick="alert('Permintaan pertemanan terkirim')">Tambah Teman</button>
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
  `;
  loadTabContent(targetEmail, isMe);
}

function switchMainTab(tab){ activeMainTab = tab; render(); }

/* Edit Profil Modal */
function openEditModal(){
  const currentName = getMyName();
  const modalHTML = `
    <div class="modal-overlay" id="editModal">
      <div class="modal-box">
        <div class="modal-title">Edit Profil</div>
        <div style="margin-bottom:12px">
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:4px">Nama</label>
          <input id="editNameInput" class="input-field" value="\${currentName}" style="margin-bottom:0">
        </div>
        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:#aaa;display:block;margin-bottom:4px">Foto Profil</label>
          <button class="btn-action" style="width:100%" onclick="triggerAvatarSelect()">Pilih dari Galeri</button>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn-action" style="background:#333" onclick="closeEditModal()">Batal</button>
          <button class="btn-action" style="background:#00ff88;color:#000;font-weight:900" onclick="saveProfileChanges()">Simpan</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeEditModal(){
  const m = document.getElementById('editModal');
  if(m) m.remove();
}

function triggerAvatarSelect(){
  document.getElementById('avatarInput').click();
}

function handleAvatarSelect(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(evt){
    const base64 = evt.target.result;
    localStorage.setItem('rg_avatar', base64);
    syncProfileToD1(getMyName(), base64);
    render();
  };
  reader.readAsDataURL(file);
}

function saveProfileChanges(){
  const newName = document.getElementById('editNameInput')?.value.trim() || getMyName();
  localStorage.setItem('rg_name', newName);
  syncProfileToD1(newName, getMyAvatar());
  closeEditModal();
  render();
}

async function syncProfileToD1(name, picture){
  try {
    await fetch('/api/akun/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: getMyEmail(), name, picture })
    });
  } catch(e){}
}

/* Tab Content Handler */
async function loadTabContent(targetEmail, isMe){
  const box = document.getElementById('tabContent');
  if(!box) return;

  if(activeMainTab === 'foto'){
    await loadPhotoTab(box, targetEmail, isMe);
  } else if(activeMainTab === 'teman'){
    await loadFriendList(box);
  } else {
    box.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#aaa">
        <h3>Belum ada video</h3>
        <p style="font-size:13px;margin-top:6px">Video yang Anda bagikan akan muncul di sini.</p>
      </div>
    `;
  }
}

/* Galeri Foto (Maksimal 12) masuk ke d1consule */
async function loadPhotoTab(box, targetEmail, isMe){
  box.innerHTML = '<div style="text-align:center;color:#666">Memuat foto...</div>';
  try {
    let res = await fetch('/api/akun/photos?email=' + encodeURIComponent(targetEmail));
    if(res.ok){
      userPhotos = await res.json();
    } else {
      userPhotos = JSON.parse(localStorage.getItem('rg_photos_' + targetEmail) || "[]");
    }
  } catch(e){
    userPhotos = JSON.parse(localStorage.getItem('rg_photos_' + targetEmail) || "[]");
  }

  const count = userPhotos.length;
  const statEl = document.getElementById('statPosts');
  if(statEl) statEl.innerText = count;

  let html = `
    <div class="gallery-header">
      <span class="gallery-count">Foto Galeri (\${count}/12)</span>
      \${(isMe && count < 12) ? '<button class="btn-add-photo" onclick="triggerPhotoSelect()"><span>+</span> Tambah Foto</button>' : ''}
    </div>
  `;

  if(count === 0){
    html += `
      <div style="text-align:center;padding:30px 20px;color:#777">
        <p>Belum ada foto di galeri.</p>
        \${isMe ? '<p style="font-size:12px;margin-top:4px;color:#00ff88">Anda dapat menambahkan hingga 12 foto.</p>' : ''}
      </div>
    `;
  } else {
    html += '<div class="photo-grid">';
    userPhotos.forEach((imgSrc, idx) => {
      html += `
        <div class="photo-item">
          <img src="\${imgSrc}" alt="Foto \${idx+1}">
          \${isMe ? \`<button class="photo-del" onclick="deletePhoto(\${idx})">✕</button>\` : ''}
        </div>
      `;
    });
    html += '</div>';
  }
  box.innerHTML = html;
}

function triggerPhotoSelect(){
  if(userPhotos.length >= 12){
    alert("Maksimal 12 foto sudah tercapai!");
    return;
  }
  document.getElementById('photoInput').click();
}

function handlePhotoSelect(e){
  const file = e.target.files[0];
  if(!file) return;
  if(userPhotos.length >= 12){
    alert("Maksimal 12 foto aja!");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(evt){
    const base64 = evt.target.result;
    userPhotos.push(base64);
    const myEmail = getMyEmail();
    localStorage.setItem('rg_photos_' + myEmail, JSON.stringify(userPhotos));
    
    // Sinkronisasi ke database d1consule
    try {
      await fetch('/api/akun/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: myEmail, photos: userPhotos })
      });
    } catch(err){}

    render();
  };
  reader.readAsDataURL(file);
}

async function deletePhoto(idx){
  if(!confirm("Hapus foto ini dari galeri?")) return;
  userPhotos.splice(idx, 1);
  const myEmail = getMyEmail();
  localStorage.setItem('rg_photos_' + myEmail, JSON.stringify(userPhotos));
  try {
    await fetch('/api/akun/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: myEmail, photos: userPhotos })
    });
  } catch(err){}
  render();
}

/* List Teman (Sesuai Foto 2 Facebook) */
async function loadFriendList(box){
  box.innerHTML = '<div style="text-align:center;color:#666">Memuat daftar teman...</div>';
  let users = [];
  try {
    let res = await fetch('/api/akun/list');
    users = await res.json();
  } catch(e){}

  if(!Array.isArray(users) || users.length === 0){
    users = [
      { name: "Ana Mariana", email: "ana@gmail.com", picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", mutual: "1 teman bersama" },
      { name: "Selvi Ana", email: "selvi@gmail.com", picture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", mutual: "1 teman bersama" },
      { name: "Cut Eka", email: "cut@gmail.com", picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", mutual: "" },
      { name: "Dewii Dewi", email: "dewi@gmail.com", picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", mutual: "" },
      { name: "Diana Mayah", email: "diana@gmail.com", picture: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150", mutual: "1 teman bersama" }
    ];
  }

  let html = '<div class="friend-title">Orang yang mungkin Anda kenal</div>';
  users.forEach((u) => {
    html += `
      <div class="friend-card">
        <img src="\${u.picture || LOGO_FALLBACK}" class="friend-avatar" onerror="this.src='\${LOGO_FALLBACK}'" onclick="viewUser('\${u.email}')">
        <div class="friend-info">
          <div class="friend-name" onclick="viewUser('\${u.email}')">\${u.name || 'Pengguna'}</div>
          <div class="friend-mutual">
            \${u.mutual ? \`<img src="\${u.picture || LOGO_FALLBACK}" class="friend-mutual-img"> \${u.mutual}\` : ''}
          </div>
          <div class="friend-actions">
            <button class="btn-add-friend" onclick="alert('Permintaan pertemanan dikirim')">Tambah jadi teman</button>
            <button class="btn-remove-friend" onclick="this.closest('.friend-card').remove()">Hapus</button>
          </div>
        </div>
      </div>
    `;
  });

  box.innerHTML = html;
}

function viewUser(email){ viewingUserEmail = email; render(); }

render();
<\/script>
</body>
</html>`;
