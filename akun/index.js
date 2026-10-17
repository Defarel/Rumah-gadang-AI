export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun - Rumah Gadang AI</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
.neon-box{ border: 4px solid #00ff00; box-shadow: 0 0 15px #00ff00, 0 0 30px #00ff0020 inset; border-radius: 24px; }
.neon-avatar{ border: 3px solid #00ff00; box-shadow: 0 0 10px #00ff00; }
.book-neon{ border: 4px solid #00ff00; box-shadow: 0 0 18px #00ff00, 0 0 40px #00ff0030 inset; border-radius: 28px; overflow: hidden; }
.neon-line{ height: 4px; background: #00ff00; box-shadow: 0 0 10px #00ff00; }
</style></head>
<body class="bg-black text-white min-h-screen flex items-center justify-center p-4">

<div id="loginPage" class="w-full max-w-[400px]">
  <div class="book-neon bg-[#121212]">
    <div class="bg-[#121212] p-7 text-white">
      <h1 class="text-[28px] font-black leading-none">Rumah Gadang AI</h1>
      <p class="text-sm text-zinc-400 mt-2 mb-6">Masukkan kredensial Anda untuk masuk</p>
      <label class="text-sm font-bold">Email</label>
      <input id="email" type="email" placeholder="nama@rumahgadang-ai.my.id" class="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mt-2 mb-4 text-white outline-none" />
      <label class="text-sm font-bold">Kata Sandi</label>
      <input id="pass" type="password" placeholder="••••••" class="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mt-2 mb-5 text-white outline-none" />
      <button onclick="doLogin()" class="w-full bg-white text-black p-4 rounded-2xl font-black text-lg">Masuk</button>
      <p class="text-center text-sm text-zinc-500 mt-4">Belum menjadi anggota? <b class="text-white">Buat akun.</b></p>
    </div>
    <div class="neon-line"></div>
    <div class="relative h-[380px] bg-black m-0 p-0">
      <img src="https://i.ibb.co/HpVSvhYH/Rumah-Gadang-AI1.jpg" class="w-full h-full object-cover block" />
      <div class="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center font-black text-black text-sm">RG</div>
    </div>
  </div>
</div>

<div id="profilePage" style="display:none" class="w-full max-w-[420px]">
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
          <button onclick="editName()" class="text-zinc-500 text-xs">✏️</button>
        </div>
        <p id="displayEmail" class="text-zinc-500 text-xs mb-1 truncate"></p>
        <p id="mutualText" class="text-[11px] text-green-400 mb-2 hidden">● Saling mengikuti</p>
        <div class="flex gap-6">
          <div class="text-center"><p id="followersCount" class="font-bold text-lg leading-none">0</p><p class="text-sm">pengikut</p></div>
          <div class="text-center"><p id="followingCount" class="font-bold text-lg leading-none">0</p><p class="text-sm">mengikuti</p></div>
          <div id="isAdminBadge" style="display:none" class="text-[10px] bg-green-500 text-black px-2 py-1 rounded-full font-bold h-fit">ADMIN</div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-6">
      <button onclick="editProfile()" class="bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm">Edit profil</button>
      <button id="followBtn" onclick="toggleFollow()" class="bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm">Ikuti</button>
    </div>
    <button onclick="doLogout()" class="w-full bg-red-600 p-3 rounded-xl font-bold mt-3">LOGOUT</button>
    <a href="/" class="block text-center mt-3 text-zinc-500 text-sm">Kembali ke Halaman depan</a>
    <p id="infoOther" class="text-center text-xs text-zinc-500 mt-2 hidden"></p>
  </div>
</div>

<script>
  const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];
  function isAdmin(e){ return ADMIN_EMAILS.includes((e||"").toLowerCase().trim()); }
  let data = JSON.parse(localStorage.getItem("rg_profile")||"{}");
  if(!data.name) data.name = "Dunsanak";
  function save(){ localStorage.setItem("rg_profile", JSON.stringify(data)); }

  function getViewedUser(){
    const params = new URLSearchParams(location.search);
    return params.get('user') || localStorage.getItem("user_email");
  }

  async function loadStats(userEmail){
    try{
      let r = await fetch('/api/follow-stats/' + encodeURIComponent(userEmail));
      let j = await r.json();
      document.getElementById('followersCount').innerText = j.followers;
      document.getElementById('followingCount').innerText = j.following;
    }catch(e){}
  }

  async function checkFollowStatus(){
    let myEmail = localStorage.getItem("user_email");
    let viewed = getViewedUser();
    if(!myEmail || !viewed || myEmail.toLowerCase() === viewed.toLowerCase()){
      document.getElementById('followBtn').style.display = 'none';
      return;
    }
    document.getElementById('followBtn').style.display = 'block';
    document.getElementById('infoOther').innerText = 'Melihat profil: ' + viewed;
    document.getElementById('infoOther').classList.remove('hidden');
    try{
      let r = await fetch('/api/check-follow/' + encodeURIComponent(myEmail) + '/' + encodeURIComponent(viewed));
      let j = await r.json();
      updateFollowBtn(j.following, j.mutual);
    }catch(e){}
  }

  function updateFollowBtn(isFollowing, isMutual){
    let btn = document.getElementById('followBtn');
    let mutualText = document.getElementById('mutualText');
    if(isMutual) mutualText.classList.remove('hidden'); else mutualText.classList.add('hidden');
    if(isFollowing){
      btn.innerText = "Mengikuti ✓";
      btn.className = "bg-white text-black p-3 rounded-xl font-semibold text-sm";
      btn.dataset.following = "1";
    }else{
      btn.innerText = "Ikuti";
      btn.className = "bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm";
      btn.dataset.following = "0";
    }
  }

  async function toggleFollow(){
    let myEmail = localStorage.getItem("user_email");
    let viewed = getViewedUser();
    if(!myEmail){ alert("Login dulu!"); return; }
    if(myEmail.toLowerCase() === viewed.toLowerCase()){ alert("Ga bisa follow diri sendiri"); return; }
    let btn = document.getElementById('followBtn');
    let isFollowing = btn.dataset.following === "1";
    let endpoint = isFollowing ? '/api/unfollow' : '/api/follow';
    btn.innerText = "Loading...";
    btn.disabled = true;
    try{
      await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({follower_id: myEmail, following_id: viewed})
      });
      await loadStats(viewed);
      await checkFollowStatus();
    }catch(e){ alert("Error: " + e.message); }
    btn.disabled = false;
  }

  function checkLogin(){
    let email = localStorage.getItem("user_email");
    if(!email){
      document.getElementById("loginPage").style.display="block";
      document.getElementById("profilePage").style.display="none";
      return;
    }
    let viewed = getViewedUser();
    document.getElementById("loginPage").style.display="none";
    document.getElementById("profilePage").style.display="block";
    document.getElementById("displayEmail").innerText = viewed;
    document.getElementById("displayName").innerText = (viewed === email ? data.name : viewed.split('@')[0]);
    if(isAdmin(email)) document.getElementById("isAdminBadge").style.display="block";
    let savedAvatar = localStorage.getItem("rg_avatar");
    if(savedAvatar) document.getElementById("avatarImg").src = savedAvatar;
    loadStats(viewed);
    checkFollowStatus();
  }

  function doLogin(){
    let email = document.getElementById("email").value.trim();
    if(!email){ alert("Isi email!"); return; }
    localStorage.setItem("user_email", email.toLowerCase());
    checkLogin();
  }
  function changeAvatar(e){
    let file = e.target.files[0];
    if(!file) return;
    let reader = new FileReader();
    reader.onload = function(ev){
      document.getElementById("avatarImg").src = ev.target.result;
      localStorage.setItem("rg_avatar", ev.target.result);
    };
    reader.readAsDataURL(file);
  }
  function editName(){
    let newName = prompt("Ganti nama:", data.name);
    if(newName){ data.name = newName; save(); document.getElementById("displayName").innerText = newName; }
  }
  function editProfile(){
    let newName = prompt("Edit nama profil:", data.name);
    if(newName) data.name = newName;
    save(); checkLogin();
  }
  function doLogout(){ localStorage.removeItem("user_email"); location.reload(); }
  checkLogin();
<\/script>
</body></html>`;
