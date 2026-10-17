export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun - Rumah Gadang AI</title>
<script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-black text-white min-h-screen flex items-center justify-center p-4">
<div class="w-full max-w-sm bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
  <h1 class="text-2xl font-bold text-center mb-2">Rumah Gadang AI</h1>
  <p id="status" class="text-center text-zinc-400 text-sm mb-6">Silahkan login Bos</p>
  
  <div id="loginForm">
    <input id="email" type="email" placeholder="Email Bos (admin@rumahgadang-ai.my.id)" class="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 mb-3 text-white" />
    <input id="pass" type="password" placeholder="Password Bos" class="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 mb-4 text-white" />
    <button onclick="doLogin()" class="w-full bg-white text-black p-3 rounded-xl font-bold mb-3">LOGIN BOS</button>
    <button onclick="doDaftar()" class="w-full bg-zinc-800 p-3 rounded-xl font-bold mb-3 border border-zinc-700">DAFTAR BOS</button>
    <button onclick="doGoogle()" class="w-full bg-red-600 p-3 rounded-xl font-bold">LOGIN GOOGLE BOS</button>
  </div>

  <div id="logoutForm" style="display:none">
    <div class="text-center mb-4">
      <div class="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">A</div>
      <p id="userEmail" class="font-bold"></p>
      <p id="userRole" class="text-xs px-2 py-1 rounded bg-zinc-800 inline-block mt-1"></p>
    </div>
    <button onclick="doLogout()" class="w-full bg-red-600 p-3 rounded-xl font-bold">LOGOUT BOS</button>
    <a href="/" class="block text-center mt-4 text-zinc-400 text-sm">← Kembali ke Home Bos</a>
  </div>
</div>

<script>
  const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];
  function isAdmin(e){
    if(!e) return false;
    return ADMIN_EMAILS.includes(e.toLowerCase().trim());
  }

  function checkLogin(){
    let email = localStorage.getItem("user_email");
    if(email){
      document.getElementById("loginForm").style.display="none";
      document.getElementById("logoutForm").style.display="block";
      document.getElementById("userEmail").innerText = email;
      document.getElementById("status").innerText = "Sudah login Bos!";
      let roleEl = document.getElementById("userRole");
      if(isAdmin(email)){
        roleEl.innerText = "AKUN SP.FC ADMIN BOS";
        roleEl.className = "text-xs px-2 py-1 rounded bg-green-600 inline-block mt-1";
      }else{
        roleEl.innerText = "USER BIASA BOS";
        roleEl.className = "text-xs px-2 py-1 rounded bg-zinc-700 inline-block mt-1";
      }
    }else{
      document.getElementById("loginForm").style.display="block";
      document.getElementById("logoutForm").style.display="none";
      document.getElementById("status").innerText = "Silahkan login Bos";
    }
  }

  function doLogin(){
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("pass").value.trim();
    if(!email || !pass){ alert("Isi email & password Bos!"); return; }
    // LOGIN SUKSES BOS - SIMPAN EMAIL BOS!
    localStorage.setItem("user_email", email.toLowerCase());
    alert("Login sukses Bos sebagai " + email);
    checkLogin();
  }

  function doDaftar(){
    let email = document.getElementById("email").value.trim();
    if(!email){ alert("Isi email Bos!"); return; }
    localStorage.setItem("user_email", email.toLowerCase());
    alert("Daftar sukses Bos! Auto login sebagai " + email);
    checkLogin();
  }

  function doGoogle(){
    // SIMULASI GOOGLE LOGIN BOS - BOS GANTI EMAIL INI JADI ADMIN BOS!
    let email = prompt("Masukkan email Google Bos:", "admin@rumahgadang-ai.my.id");
    if(!email) return;
    localStorage.setItem("user_email", email.toLowerCase());
    alert("Login Google sukses Bos!");
    checkLogin();
  }

  function doLogout(){
    localStorage.removeItem("user_email");
    localStorage.removeItem("is_admin");
    alert("Logout sukses Bos!");
    location.reload();
  }

  checkLogin();
<\/script>
</body></html>`;
