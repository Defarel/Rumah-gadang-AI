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
.book-shadow{
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
</style></head>
<body class="bg-black text-white min-h-screen flex items-center justify-center p-4">

<!-- LOGIN PAGE BOS - KAYAK BUKU FOTO 1 BOS -->
<div id="loginPage" class="w-full max-w-[860px] hidden">
  <div class="bg-[#b8a6ff] md:bg-gradient-to-br from-[#c4a8ff] to-[#ff8cc8] p-4 md:p-8 rounded-[32px]">
    <div class="book-shadow bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row">
      <!-- KIRI BOS - FORM LOGIN BOS -->
      <div class="w-full md:w-[52%] p-8 md:p-10 bg-white text-black flex flex-col justify-center">
        <h1 class="text-3xl font-bold text-black">Login</h1>
        <p class="text-sm text-zinc-500 mt-1 mb-6">Enter your credentials to get in Bos</p>
        
        <label class="text-xs font-semibold text-zinc-600">Email</label>
        <input id="email" type="email" placeholder="admin@rumahgadang-ai.my.id" class="w-full p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 mb-4 text-black outline-none focus:border-black" />
        
        <label class="text-xs font-semibold text-zinc-600">Password</label>
        <input id="pass" type="password" placeholder="••••••" class="w-full p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 mb-2 text-black outline-none focus:border-black" />
        
        <div class="flex items-center gap-2 mb-6 mt-1">
          <input type="checkbox" class="rounded"><span class="text-xs text-zinc-500">Remember me</span>
        </div>

        <button onclick="doLogin()" class="w-full bg-black text-white p-3.5 rounded-xl font-bold hover:bg-zinc-800">Login</button>
        <p class="text-center text-xs text-zinc-500 mt-4">Not a member? <b class="text-black">Create an account</b></p>
      </div>

      <!-- KANAN BOS - GAMBAR BUKU BOS -->
      <div class="w-full md:w-[48%] relative min-h-[320px] md:min-h-[480px] bg-black overflow-hidden">
        <img src="https://rumahgadang-ai.my.id/rumahgadangAI1.jpg" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-purple-500/20 to-blue-500/30"></div>
        <div class="absolute bottom-0 left-0 p-6">
          <h2 class="text-white text-2xl font-bold leading-tight">Be a Part of<br>Something <span class="font-black">Beautiful</span></h2>
          <p class="text-white/70 text-xs mt-2">Rumah Gadang AI - Padang</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs">RG</div>
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
    <button onclick="doLogout()" class="w-full bg-red-600 p-3 rounded-xl font-bold mt-3">LOGOUT BOS</button>
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
      document.getElementById("loginPage").classList.remove("hidden");
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
  function doLogout(){
    localStorage.removeItem("user_email");
    location.reload();
  }
  checkLogin();
<\/script>
</body></html>`;
