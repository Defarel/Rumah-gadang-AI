export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun - Rumah Gadang AI</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://accounts.google.com/gsi/client" async defer></script>
<style>
.neon-box{border:4px solid #00ff00;box-shadow:0 0 15px #00ff00,0 0 30px #00ff0020 inset;border-radius:24px}
.neon-avatar{border:3px solid #00ff00;box-shadow:0 0 10px #00ff00}
.book-neon{border:4px solid #00ff00;box-shadow:0 0 18px #00ff00,0 0 40px #00ff0030 inset;border-radius:28px;overflow:hidden}
.neon-line{height:4px;background:#00ff00;box-shadow:0 0 10px #00ff00}
.tab-active{background:#00ff00;color:#000;font-weight:900}
.tab-idle{background:#1a1a1a;color:#888}
</style></head>
<body class="bg-black text-white min-h-screen flex items-center justify-center p-4">

<!-- LOGIN PAGE 3 KOLOM -->
<div id="loginPage" class="w-full max-w-[420px]">
  <div class="book-neon bg-white">
    <div class="bg-white p-6 text-black">
      <h1 class="text-[28px] font-black leading-none">Rumah Gadang AI</h1>
      <p class="text-sm text-zinc-500 mt-1 mb-4">Jadilah bagian dari sesuatu yang indah</p>
      
      <!-- 3 TAB BOS -->
      <div class="grid grid-cols-3 gap-2 mb-6">
        <button id="tabMasuk" onclick="switchTab('masuk')" class="tab-active p-3 rounded-xl text-sm">Masuk</button>
        <button id="tabDaftar" onclick="switchTab('daftar')" class="tab-idle p-3 rounded-xl text-sm">Buat Akun</button>
        <button id="tabGoogle" onclick="switchTab('google')" class="tab-idle p-3 rounded-xl text-sm">Google</button>
      </div>

      <!-- TAB 1: MASUK -->
      <div id="panelMasuk">
        <label class="text-sm font-bold">Email</label>
        <input id="email" type="email" placeholder="nama@rumahgadang-ai.my.id" class="w-full p-4 rounded-2xl bg-zinc-100 border border-zinc-200 mt-1 mb-3 text-black outline-none" />
        <label class="text-sm font-bold">Kata Sandi</label>
        <input id="pass" type="password" placeholder="••••••" class="w-full p-4 rounded-2xl bg-zinc-100 border border-zinc-200 mt-1 mb-4 text-black outline-none" />
        <button onclick="doLogin()" class="w-full bg-black text-white p-4 rounded-2xl font-bold">Masuk</button>
      </div>

      <!-- TAB 2: BUAT AKUN -->
      <div id="panelDaftar" style="display:none">
        <label class="text-sm font-bold">Nama Lengkap</label>
        <input id="regName" type="text" placeholder="Contoh: Naura" class="w-full p-4 rounded-2xl bg-zinc-100 border border-zinc-200 mt-1 mb-3 text-black outline-none" />
        <label class="text-sm font-bold">Email</label>
        <input id="regEmail" type="email" placeholder="naura@rumahgadang-ai.my.id" class="w-full p-4 rounded-2xl bg-zinc-100 border border-zinc-200 mt-1 mb-3 text-black outline-none" />
        <label class="text-sm font-bold">Kata Sandi</label>
        <input id="regPass" type="password" placeholder="Minimal 6 karakter" class="w-full p-4 rounded-2xl bg-zinc-100 border border-zinc-200 mt-1 mb-4 text-black outline-none" />
        <button onclick="doRegister()" class="w-full bg-[#00ff00] text-black p-4 rounded-2xl font-black">Buat Akun</button>
        <p class="text-[11px] text-zinc-500 mt-3 text-center">Username otomatis dari email: naura@... jadi @naura</p>
      </div>

      <!-- TAB 3: GOOGLE -->
      <div id="panelGoogle" style="display:none" class="text-center">
        <p class="text-sm text-zinc-600 mb-4">Masuk cepat pakai akun Google Bos</p>
        <div id="g_id_onload"
             data-client_id="YOUR_GOOGLE_CLIENT_ID"
             data-callback="handleGoogle"
             data-auto_prompt="false">
        </div>
        <div class="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left"></div>
        <button onclick="fakeGoogle()" class="w-full mt-3 bg-white border border-zinc-300 text-black p-4 rounded-2xl font-bold flex items-center justify-center gap-2">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5"> Lanjutkan dengan Google
        </button>
        <p class="text-[11px] text-zinc-500 mt-3">Untuk aktifkan Google login beneran, ganti YOUR_GOOGLE_CLIENT_ID di worker</p>
      </div>
    </div>

    <div class="neon-line"></div>
    <div class="relative h-[320px] bg-black overflow-hidden">
      <img src="https://i.ibb.co/HpVSvhYH/Rumah-Gadang-AI1.jpg" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-6">
        <h2 class="text-white text-[24px] font-black leading-[1.1]">Jadilah Bagian dari<br>Sesuatu yang Indah</h2>
        <p class="text-white/70 text-xs mt-2">Rumah Gadang AI - Padang • @naura</p>
      </div>
      <div class="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center font-black text-black text-sm">RG</div>
    </div>
  </div>
</div>

<!-- PROFILE PAGE - UDAH CONNECT DB BENERAN -->
<div id="profilePage" style="display:none" class="w-full max-w-[420px] flex flex-col gap-4">
  <div class="neon-box bg-[#121212] p-5">
    <div class="flex items-start gap-4">
      <div class="relative">
        <img id="avatarImg" src="https://i.pravatar.cc/150?u=naura" class="w-20 h-20 rounded-full object-cover neon-avatar" />
        <button onclick="document.getElementById('fileInput').click()" class="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-black rounded-full font-bold flex items-center justify-center border-2 border-black">+</button>
        <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="changeAvatar(event)" />
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h2 id="displayName" class="text-xl font-bold">Dunsanak</h2>
          <span id="displayUsername" class="text-xs text-zinc-500">@naura</span>
          <button onclick="editName()" class="text-zinc-500 text-xs">✏️</button>
        </div>
        <p id="displayEmail" class="text-zinc-500 text-xs mb-1 truncate"></p>
        <p id="mutualText" class="text-[11px] text-green-400 mb-2 hidden">● Saling mengikuti</p>
        <div class="flex gap-6">
          <div class="text-center"><p id="followersCount" class="font-bold text-lg leading-none">0</p><p class="text-[11px]">pengikut</p></div>
          <div class="text-center"><p id="followingCount" class="font-bold text-lg leading-none">0</p><p class="text-[11px]">mengikuti</p></div>
          <div id="isAdminBadge" style="display:none" class="text-[10px] bg-green-500 text-black px-2 py-1 rounded-full font-bold h-fit">ADMIN</div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-5">
      <button onclick="editProfile()" class="bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm">Edit profil</button>
      <button id="followBtn" onclick="toggleFollow()" class="bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm hidden">Ikuti</button>
    </div>
    <button onclick="doLogout()" class="w-full bg-red-600 p-3 rounded-xl font-bold mt-3">LOGOUT</button>
  </div>

  <div class="neon-box bg-[#121212] p-4">
    <h3 class="font-bold mb-3">Cari Teman 🔍</h3>
    <div class="flex gap-2"><input id="searchInput" placeholder="ketik @naura / nama" class="flex-1 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none text-sm"><button onclick="searchUser()" class="bg-white text-black px-4 rounded-xl font-bold text-sm">Cari</button></div>
    <div id="userList" class="mt-4 flex flex-col gap-2"></div>
  </div>
  <a href="/" class="block text-center text-zinc-500 text-sm">← Kembali ke Home</a>
</div>

<script>
  const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];
  function isAdmin(e){ return ADMIN_EMAILS.includes((e||"").toLowerCase().trim()); }
  let data = JSON.parse(localStorage.getItem("rg_profile")||"{}");
  if(!data.name) data.name = "Dunsanak";

  function switchTab(t){
    document.getElementById('panelMasuk').style.display = t==='masuk'?'block':'none';
    document.getElementById('panelDaftar').style.display = t==='daftar'?'block':'none';
    document.getElementById('panelGoogle').style.display = t==='google'?'block':'none';
    document.getElementById('tabMasuk').className = t==='masuk'?'tab-active p-3 rounded-xl text-sm':'tab-idle p-3 rounded-xl text-sm';
    document.getElementById('tabDaftar').className = t==='daftar'?'tab-active p-3 rounded-xl text-sm':'tab-idle p-3 rounded-xl text-sm';
    document.getElementById('tabGoogle').className = t==='google'?'tab-active p-3 rounded-xl text-sm':'tab-idle p-3 rounded-xl text-sm';
  }

  function save(){ localStorage.setItem("rg_profile", JSON.stringify(data)); }
  function getViewedUser(){ const p=new URLSearchParams(location.search); let u=p.get('user'); if(!u){ let path=location.pathname; if(path.startsWith('/u/')){ u=path.replace('/u/',''); } else if(path.length>1 && path!=='/akun'){ let maybe=path.replace('/','').split('/')[0]; if(maybe.length>2) { fetch('/api/user/'+maybe).then(r=>r.json()).then(j=>{ if(j.email){ location.href='/akun?user='+encodeURIComponent(j.email); } }); return localStorage.getItem("user_email"); } } } return u || localStorage.getItem("user_email"); }
  async function registerUser(email,name){ try{ await fetch('/api/register-user',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name})}); }catch{} }
  async function loadStats(e){ if(!e) return; try{ let r=await fetch('/api/follow-stats/'+encodeURIComponent(e.toLowerCase())); let j=await r.json(); document.getElementById('followersCount').innerText=j.followers; document.getElementById('followingCount').innerText=j.following; }catch{} }
  async function checkFollowStatus(){ let my=localStorage.getItem("user_email"); let viewed=getViewedUser(); let btn=document.getElementById('followBtn'); if(!my||!viewed||my.toLowerCase()===viewed.toLowerCase()){ btn.classList.add('hidden'); return; } btn.classList.remove('hidden'); try{ let r=await fetch('/api/check-follow/'+encodeURIComponent(my)+'/'+encodeURIComponent(viewed)); let j=await r.json(); updateFollowBtn(j.following,j.mutual); }catch{} }
  function updateFollowBtn(f,m){ let btn=document.getElementById('followBtn'); let mt=document.getElementById('mutualText'); if(m) mt.classList.remove('hidden'); else mt.classList.add('hidden'); if(f){ btn.innerText="Mengikuti ✓"; btn.className="bg-white text-black p-3 rounded-xl font-semibold text-sm"; btn.dataset.following="1"; } else { btn.innerText="Ikuti"; btn.className="bg-[#00ff00] text-black p-3 rounded-xl font-semibold text-sm"; btn.dataset.following="0"; } }
  async function toggleFollow(){ let my=localStorage.getItem("user_email"); let viewed=getViewedUser(); if(!viewed) return; let btn=document.getElementById('followBtn'); let isF=btn.dataset.following==="1"; let ep=isF?'/api/unfollow':'/api/follow'; btn.innerText="Loading..."; try{ await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower_id:my,following_id:viewed})}); await loadStats(viewed); await checkFollowStatus(); }catch(e){ alert(e.message); } }
  async function loadAllUsers(){ try{ let r=await fetch('/api/users'); let users=await r.json(); renderUsers(users); }catch{} }
  async function searchUser(){ let q=document.getElementById('searchInput').value.trim(); if(!q){ loadAllUsers(); return; } try{ let r=await fetch('/api/search-users/'+encodeURIComponent(q)); let users=await r.json(); renderUsers(users); }catch{} }
  function renderUsers(users){ let my=localStorage.getItem("user_email")||""; let list=document.getElementById('userList'); list.innerHTML=""; let filtered=users.filter(u=>u.email.toLowerCase()!==my.toLowerCase()); if(filtered.length===0){ list.innerHTML='<p class="text-xs text-zinc-500 text-center py-3">Belum ada teman. Suruh teman login biar muncul!<br>Coba buka /api/users buat cek</p>'; return; } filtered.forEach(u=>{ let div=document.createElement('div'); div.className="flex items-center justify-between bg-zinc-800 p-3 rounded-xl"; div.innerHTML='<div class="flex items-center gap-2"><img src="https://i.pravatar.cc/100?u='+u.email+'" class="w-8 h-8 rounded-full"><div><p class="text-sm font-bold">'+u.name+' <span class="text-zinc-500 text-xs">@'+u.username+'</span></p><p class="text-[11px] text-zinc-400">'+u.email+'</p></div></div><a href="/'+u.username+'" class="bg-white text-black text-xs px-3 py-1.5 rounded-full font-bold">Lihat</a>'; list.appendChild(div); }); }

  function checkLogin(){
    let email=localStorage.getItem("user_email");
    if(!email){ document.getElementById("loginPage").style.display="block"; document.getElementById("profilePage").style.display="none"; return; }
    let viewed=getViewedUser();
    // kalau viewed adalah username, resolve dulu
    if(viewed && !viewed.includes('@') && viewed!==email){
      fetch('/api/user/'+viewed).then(r=>r.json()).then(j=>{ if(j.email){ history.replaceState(null,'','/akun?user='+j.email); document.getElementById("displayEmail").innerText=j.email; document.getElementById("displayUsername").innerText='@'+j.username; document.getElementById("displayName").innerText=j.name; loadStats(j.email); } });
    }
    document.getElementById("loginPage").style.display="none";
    document.getElementById("profilePage").style.display="block";
    let actualViewed = viewed && viewed.includes('@') ? viewed : email;
    document.getElementById("displayEmail").innerText = actualViewed;
    document.getElementById("displayName").innerText = data.name;
    document.getElementById("displayUsername").innerText = '@'+actualViewed.split('@')[0];
    if(isAdmin(email)) document.getElementById("isAdminBadge").style.display="block";
    let av=localStorage.getItem("rg_avatar"); if(av) document.getElementById("avatarImg").src=av;
    loadStats(actualViewed);
    checkFollowStatus();
    loadAllUsers();
    registerUser(email, data.name);
  }

  function doLogin(){
    let email=document.getElementById("email").value.trim().toLowerCase();
    let pass=document.getElementById("pass").value;
    if(!email){ alert("Isi email Bos!"); return; }
    localStorage.setItem("user_email", email);
    registerUser(email, data.name);
    checkLogin();
  }
  function doRegister(){
    let name=document.getElementById("regName").value.trim();
    let email=document.getElementById("regEmail").value.trim().toLowerCase();
    let pass=document.getElementById("regPass").value;
    if(!name || !email || !pass){ alert("Lengkapi semua Bos!"); return; }
    if(pass.length<6){ alert("Password minimal 6 karakter"); return; }
    data.name=name; save();
    localStorage.setItem("user_email", email);
    registerUser(email, name).then(()=>{ alert("Akun @"+email.split('@')[0]+" berhasil dibuat!"); checkLogin(); });
  }
  function fakeGoogle(){
    let name=prompt("Masuk Google - masukkan nama kamu:");
    let email=prompt("Masukkan email Google kamu:");
    if(!email) return;
    data.name=name||email.split('@')[0]; save();
    localStorage.setItem("user_email", email.toLowerCase());
    registerUser(email.toLowerCase(), data.name).then(()=>checkLogin());
  }
  function handleGoogle(resp){
    try{
      let payload=JSON.parse(atob(resp.credential.split('.')[1]));
      let email=payload.email.toLowerCase();
      let name=payload.name||payload.given_name||email.split('@')[0];
      data.name=name; save();
      localStorage.setItem("user_email", email);
      registerUser(email, name).then(()=>checkLogin());
    }catch(e){ alert("Google login error: "+e.message); }
  }
  function changeAvatar(e){ let file=e.target.files[0]; if(!file) return; let r=new FileReader(); r.onload=function(ev){ document.getElementById("avatarImg").src=ev.target.result; localStorage.setItem("rg_avatar", ev.target.result); }; r.readAsDataURL(file); }
  function editName(){ let n=prompt("Ganti nama tampilan Bos (username tetap @"+localStorage.getItem("user_email").split('@')[0]+"):", data.name); if(n){ data.name=n; save(); document.getElementById("displayName").innerText=n; registerUser(localStorage.getItem("user_email"), n); } }
  function editProfile(){ editName(); }
  function doLogout(){ localStorage.removeItem("user_email"); location.href="/akun"; }
  checkLogin();
<\/script>
</body></html>`;
