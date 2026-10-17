export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun - Rumah Gadang AI</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
.neon-box{
  border: 4px solid #00ff00;
  box-shadow: 0 0 15px #00ff00, 0 0 30px #00ff0020 inset;
  border-radius: 24px;
}
.neon-avatar{
  border: 3px solid #00ff00;
  box-shadow: 0 0 10px #00ff00;
}
.book-neon{
  border: 4px solid #00ff00;
  box-shadow: 0 0 18px #00ff00, 0 0 40px #00ff0030 inset;
  border-radius: 28px;
  overflow: hidden;
}
.neon-line{
  height: 4px;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
}
.neon-line-v{
  width: 4px;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
}
</style></head>
<body class="bg-black text-white min-h-screen flex items-center justify-center p-4">

<!-- LOGIN PAGE BOS - KAYAK BUKU FOTO 1 BOS + GARIS NEON BOS -->
<div id="loginPage" class="w-full max-w-[420px]">
  <div class="book-neon bg-white">
    <!-- ATAS BOS - FORM PUTIH -->
        <!-- ATAS BOS - FORM HITAM BOS -->
    <div class="bg-[#121212] p-7 text-white">
      <h1 class="text-3xl font-black text-white">Rumah Gadang AI</h1>
      <p class="text-sm text-zinc-400 mt-1 mb-6">Masukkan kredensial Anda untuk masuk</p>
      <label class="text-sm font-bold text-white">Email</label>
      <input id="email" type="email" placeholder="nama@rumahgadang-ai.my.id" class="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mt-1 mb-4 text-white outline-none focus:border-[#00ff00]" />
      <label class="text-sm font-bold text-white">Kata Sandi</label>
      <input id="pass" type="password" placeholder="••••••" class="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mt-1 mb-4 text-white outline-none focus:border-[#00ff00]" />
      
      <div class="flex items-center gap-2 mb-6">
        <input type="checkbox" class="w-5 h-5 rounded accent-[#00ff00]"><span class="text-sm text-zinc-400">Ingat saya</span>
      </div>
      
      <button onclick="doLogin()" class="w-full bg-white text-black p-4 rounded-2xl font-bold text-lg">Masuk</button>
      <p class="text-center text-sm text-zinc-500 mt-4">Belum menjadi anggota? <b class="text-white">Buat akun.</b></p>
    </div>
      <button onclick="doLogin()" class="w-full bg-black text-white p-4 rounded-2xl font-bold text-lg">Masuk</button>
      <p class="text-center text-sm text-zinc-500 mt-4">Belum menjadi anggota? <b class="text-black">Buat akun.</b></p>
    </div>

    <!-- BATAS NEON TENGAH BOS - INI GARIS IJO BOS YANG BOS CORET BOS -->
    <div class="neon-line"></div>

    <!-- BAWAH BOS - GAMBAR -->
    <div class="relative h-[360px] bg-[#0a0a2a] overflow-hidden">
      <img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" onerror="this.src='https://i.ibb.co/3FqRzXJ/rumah-gadang.jpg'" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-[#0a0a2a]/60 to-transparent"></div>
      <div class="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center font-black text-black">RG</div>
      <div class="absolute bottom-0 left-0 p-6">
        <h2 class="text-white text-[28px] font-black leading-[1.1]">Jadilah Bagian dari<br>Sesuatu yang Indah</h2>
        <p class="text-white/70 text-sm mt-3">Rumah Gadang AI</p>
      </div>
    </div>
  </div>
</div>

<!-- PROFILE PAGE BOS - TETAP KAYAK FOTO 2 BOS -->
<div id="profilePage" style="display:none" class="w-full max-w-[420px]">
  <div class="neon-box bg-[#121212] p-5">
    <div class="flex items-start gap-4">
      <div class="relative">
        <img id="avatarImg" src="https://i.pravatar.cc/150?u=naura" class="w-20 h-20 rounded-full object-cover neon-avatar" />
        <button onclick="document.getElementById('fileInput').click()" class="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-black rounded-full font-bold flex items-center justify-center border-2 border-black">+</button>
        <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="changeAvatar(event)" />
        <div class="absolute -top-8 -left-2 bg-[#2a2a2a] text-zinc-300 text-xs px-3 py-1.5 rounded-2xl">Cuma kepo aja...</div>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h2 id="displayName" class="text-xl font-bold">Farel</h2>
          <button onclick="editName()" class="text-zinc-500 text-xs">✏️</button>
        </div>
        <p id="displayEmail" class="text-zinc-500 text-xs mb-3 truncate">naura@rumahgadang-ai.my.id</p>
        <div class="flex gap-6">
          <div class="text-center"><p id="followersCount" class="font-bold text-lg leading-none">92</p><p class="text-sm">pengikut</p></div>
          <div class="text-center"><p id="followingCount" class="font-bold text-lg leading-none">421</p><p class="text-sm">mengikuti</p></div>
          <div id="isAdminBadge" style="display:none" class="text-[10px] bg-green-500 text-black px-2 py-1 rounded-full font-bold h-fit">ADMIN</div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-6">
      <button onclick="editProfile()" class="bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm">Edit profil</button>
      <button id="followBtn" onclick="toggleFollow()" class="bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm">Ikuti</button>
    </div>
    <button onclick="doLogout()" class="w-full bg-red-600 p-3 rounded-xl font-bold mt-3">LOGOUT</button>
    <a href="/" class="block text-center mt-3 text-zinc-500 text-sm">← Kembali ke Home Bos</a>
  </div>
</div>

<script>
  const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];
  function isAdmin(e){ return ADMIN_EMAILS.includes((e||"").toLowerCase().trim()); }
  let data = JSON.parse(localStorage.getItem("rg_profile")||"{}");
  if(!data.followers) data.followers = 92;
  if(!data.following) data.following = 421;
  if(!data.isFollowing) data.isFollowing = false;
  if(!data.name) data.name = "Farel";
  function save(){ localStorage.setItem("rg_profile", JSON.stringify(data)); }
  function checkLogin(){
    let email = localStorage.getItem("user_email");
    if(!email){
      document.getElementById("loginPage").style.display="block";
      document.getElementById("profilePage").style.display="none";
      return;
    }
    document.getElementById("loginPage").style.display="none";
    document.getElementById("profilePage").style.display="block";
    document.getElementById("displayEmail").innerText = email;
    document.getElementById("displayName").innerText = data.name;
    document.getElementById("followersCount").innerText = data.followers;
    document.getElementById("followingCount").innerText = data.following;
    if(isAdmin(email)) document.getElementById("isAdminBadge").style.display="block";
    let savedAvatar = localStorage.getItem("rg_avatar");
    if(savedAvatar) document.getElementById("avatarImg").src = savedAvatar;
    updateFollowBtn();
  }
  function doLogin(){
    let email = document.getElementById("email").value.trim();
    if(!email){ alert("Isi email Bos!"); return; }
    localStorage.setItem("user_email", email.toLowerCase());
    checkLogin();
  }
  function toggleFollow(){
    data.isFollowing = !data.isFollowing;
    if(data.isFollowing){ data.followers++; } else { data.followers--; }
    save();
    document.getElementById("followersCount").innerText = data.followers;
    updateFollowBtn();
  }
  function updateFollowBtn(){
    let btn = document.getElementById("followBtn");
    if(data.isFollowing){
      btn.innerText = "Mengikuti ✓";
      btn.className = "bg-white text-black p-3 rounded-xl font-semibold text-sm";
    }else{
      btn.innerText = "Ikuti";
      btn.className = "bg-[#2a2a2a] p-3 rounded-xl font-semibold text-sm";
    }
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
    let newName = prompt("Ganti nama Bos:", data.name);
    if(newName){ data.name = newName; save(); document.getElementById("displayName").innerText = newName; }
  }
  function editProfile(){
    let newName = prompt("Edit nama profil Bos:", data.name);
    if(newName) data.name = newName;
    let newFollowers = prompt("Edit pengikut Bos (angka):", data.followers);
    if(newFollowers) data.followers = parseInt(newFollowers)||data.followers;
    let newFollowing = prompt("Edit mengikuti Bos (angka):", data.following);
    if(newFollowing) data.following = parseInt(newFollowing)||data.following;
    save();
    checkLogin();
  }
  function doLogout(){ localStorage.removeItem("user_email"); location.reload(); }
  checkLogin();
<\/script>
</body></html>`;
