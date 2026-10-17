export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun</title><script src="https://cdn.tailwindcss.com"></script><style>.neon-box{border:4px solid #00ff00;box-shadow:0 0 15px #00ff00;border-radius:24px}.neon-avatar{border:3px solid #00ff00;box-shadow:0 0 10px #00ff00}.book-neon{border:4px solid #00ff00;box-shadow:0 0 18px #00ff00;border-radius:28px;overflow:hidden}.neon-line{height:4px;background:#00ff00}</style></head><body class="bg-black text-white min-h-screen flex items-center justify-center p-4">
<div id="loginPage" class="w-full max-w-[420px]"><div class="book-neon bg-white"><div class="bg-white p-6 text-black"><h1 class="text-[22px] font-black">Rumah Gadang AI</h1><div class="grid grid-cols-3 gap-2 my-4"><button onclick="tab('masuk')" id="t1" class="bg-black text-white p-2 rounded-xl text-sm font-bold">Masuk</button><button onclick="tab('daftar')" id="t2" class="bg-zinc-200 p-2 rounded-xl text-sm">Buat Akun</button><button onclick="tab('google')" id="t3" class="bg-zinc-200 p-2 rounded-xl text-sm">Google</button></div>
<div id="pMasuk"><input id="email" placeholder="email kamu" class="w-full p-3 rounded-xl bg-zinc-100 border mb-2 text-black"><input id="pass" type="password" placeholder="password" class="w-full p-3 rounded-xl bg-zinc-100 border mb-3 text-black"><button onclick="doLogin()" class="w-full bg-black text-white p-3 rounded-xl font-bold">Masuk</button></div>
<div id="pDaftar" style="display:none"><input id="rName" placeholder="Nama: Amanda" class="w-full p-3 rounded-xl bg-zinc-100 border mb-2 text-black"><input id="rEmail" placeholder="email: naura@..." class="w-full p-3 rounded-xl bg-zinc-100 border mb-2 text-black"><input id="rPass" type="password" placeholder="password" class="w-full p-3 rounded-xl bg-zinc-100 border mb-3 text-black"><button onclick="doRegister()" class="w-full bg-[#00ff00] text-black p-3 rounded-xl font-black">Buat Akun</button></div>
<div id="pGoogle" style="display:none"><button onclick="doGoogle()" class="w-full bg-white border p-3 rounded-xl font-bold">Login Google</button></div>
</div><div class="neon-line"></div><img src="https://i.ibb.co/HpVSvhYH/Rumah-Gadang-AI1.jpg" class="w-full h-[250px] object-cover"></div></div>
<div id="profilePage" style="display:none" class="w-full max-w-[420px] flex flex-col gap-4"><div class="neon-box bg-[#121212] p-5"><div class="flex gap-4"><img id="av" src="https://i.pravatar.cc/150?u=naura" class="w-16 h-16 rounded-full neon-avatar"><div><h2 id="dName" class="font-bold text-lg"></h2><p id="dUser" class="text-xs text-zinc-500"></p><p id="dEmail" class="text-[11px] text-zinc-500"></p><div class="flex gap-4 mt-1"><span id="f1">0</span> pengikut <span id="f2" class="ml-2">0</span> mengikuti</div><p id="mutual" class="text-[11px] text-green-400 hidden">● Saling mengikuti</p></div></div><div class="grid grid-cols-2 gap-2 mt-4"><button onclick="editName()" class="bg-zinc-800 p-2 rounded-xl text-sm">Edit profil</button><button id="followBtn" onclick="doFollow()" class="bg-zinc-800 p-2 rounded-xl text-sm hidden">Ikuti</button></div><button onclick="doLogout()" class="w-full bg-red-600 p-2 rounded-xl mt-2 font-bold">LOGOUT</button></div><div class="neon-box bg-[#121212] p-4"><h3 class="font-bold mb-2">Cari Teman 🔍</h3><div class="flex gap-2"><input id="q" placeholder="@naura / admin" class="flex-1 p-2 rounded-xl bg-zinc-800 text-white text-sm"><button onclick="doSearch()" class="bg-white text-black px-3 rounded-xl text-sm font-bold">Cari</button></div><div id="list" class="mt-3 flex flex-col gap-2"></div></div><a href="/" class="text-center text-xs text-zinc-500">Home - Rumah Gadang AI</a></div>
<script>
let data=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(!data.name) data.name="Dunsanak";
function tab(t){ document.getElementById('pMasuk').style.display=t==='masuk'?'block':'none'; document.getElementById('pDaftar').style.display=t==='daftar'?'block':'none'; document.getElementById('pGoogle').style.display=t==='google'?'block':'none'; document.getElementById('t1').className=t==='masuk'?'bg-black text-white p-2 rounded-xl text-sm font-bold':'bg-zinc-200 p-2 rounded-xl text-sm'; document.getElementById('t2').className=t==='daftar'?'bg-black text-white p-2 rounded-xl text-sm font-bold':'bg-zinc-200 p-2 rounded-xl text-sm'; document.getElementById('t3').className=t==='google'?'bg-black text-white p-2 rounded-xl text-sm font-bold':'bg-zinc-200 p-2 rounded-xl text-sm'; }
async function saveToD1(email,name){ try{ await fetch('/api/register-user',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.toLowerCase(),name:name})}); }catch{} }
function getUsernameFromUrl(){ let p=location.pathname; if(p==="/akun"||p==="/a"||p==="/"||p==="") return null; let u=p.replace("/","").split("/")[0]; if(["foto","video","ai","kantor","tulis","api","sitemap","robots"].includes(u)) return null; return u.toLowerCase(); }
function getViewedEmail(){ let uname=getUsernameFromUrl(); if(uname && uname.includes('@')) return uname; if(uname) return null; let params=new URLSearchParams(location.search); return params.get('user') || localStorage.getItem("user_email"); }
async function loadStats(e){ if(!e) return; try{ let r=await fetch('/api/follow-stats/'+encodeURIComponent(e.toLowerCase())); let j=await r.json(); document.getElementById('f1').innerText=j.followers; document.getElementById('f2').innerText=j.following; }catch{} }
async function checkFollow(){ let my=localStorage.getItem("user_email"); let viewed=document.getElementById('dEmail').innerText; let btn=document.getElementById('followBtn'); if(!my||!viewed||my.toLowerCase()===viewed.toLowerCase()){ btn.classList.add('hidden'); return; } btn.classList.remove('hidden'); try{ let r=await fetch('/api/check-follow/'+encodeURIComponent(my)+'/'+encodeURIComponent(viewed)); let j=await r.json(); btn.innerText=j.following?'Mengikuti ✓':'Ikuti'; btn.dataset.f=j.following; document.getElementById('mutual').className=j.mutual?'text-[11px] text-green-400':'text-[11px] text-green-400 hidden'; }catch{} }
async function doFollow(){ let my=localStorage.getItem("user_email"); let viewed=document.getElementById('dEmail').innerText; let btn=document.getElementById('followBtn'); let isF=btn.dataset.f==="true"; let ep=isF?'/api/unfollow':'/api/follow'; btn.innerText="..."; await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower_id:my,following_id:viewed})}); checkFollow(); loadStats(viewed); }
async function loadUsers(){ try{ let r=await fetch('/api/users'); let u=await r.json(); render(u); }catch{} }
async function doSearch(){ let q=document.getElementById('q').value.trim(); if(!q){ loadUsers(); return; } try{ let r=await fetch('/api/search-users/'+encodeURIComponent(q)); let u=await r.json(); render(u); }catch{} }
function render(users){ let my=localStorage.getItem("user_email")||""; let list=document.getElementById('list'); list.innerHTML=""; let fil=users.filter(x=>x.email.toLowerCase()!==my.toLowerCase()); if(fil.length===0){ list.innerHTML='<p class="text-xs text-zinc-500 text-center py-2">Belum ada teman. Login akun lain.</p>'; return; } fil.forEach(u=>{ let d=document.createElement('div'); d.className="flex justify-between bg-zinc-800 p-2 rounded-xl"; d.innerHTML='<div class="flex gap-2 items-center"><img src="https://i.pravatar.cc/100?u='+u.email+'" class="w-8 h-8 rounded-full"><div><p class="text-sm font-bold">'+u.name+' <span class="text-xs text-zinc-500">@'+u.username+'</span></p><p class="text-[10px] text-zinc-400">'+u.email+'</p></div></div><a href="/'+u.username+'" class="bg-white text-black text-xs px-3 py-1 rounded-full font-bold">Lihat</a>'; list.appendChild(d); }); }
async function checkLogin(){
  let email=localStorage.getItem("user_email");
  let urlUsername=getUsernameFromUrl();
  // Kalau buka /naura, ambil data naura dari D1
  if(urlUsername){
    try{
      let r=await fetch('/api/user/'+urlUsername);
      let u=await r.json();
      if(u && u.email){
        document.getElementById('loginPage').style.display='none';
        document.getElementById('profilePage').style.display='block';
        document.getElementById('dEmail').innerText=u.email;
        document.getElementById('dName').innerText=u.name;
        document.getElementById('dUser').innerText='@'+u.username;
        document.getElementById('av').src='https://i.pravatar.cc/150?u='+u.email;
        loadStats(u.email); checkFollow(); loadUsers();
        return;
      } else {
        // username belum ada di D1 tapi URL tetep /naura (kayak IG user not found tetep /username)
        if(email){
          // kalau udah login, tampilkan profil sendiri tapi URL tetep /naura? enggak, redirect ke username sendiri
          let myUsername=email.split('@')[0].replace(/[^a-z0-9]/g,'');
          if(urlUsername!==myUsername){
            document.getElementById('loginPage').style.display='none';
            document.getElementById('profilePage').style.display='block';
            document.getElementById('dEmail').innerText='User @'+urlUsername+' belum daftar';
            document.getElementById('dName').innerText='@'+urlUsername;
            document.getElementById('dUser').innerText='Belum ada';
            document.getElementById('list').innerHTML='<p class="text-xs text-zinc-400">Username ini belum terdaftar. Suruh @'+urlUsername+' login dulu.</p>';
            return;
          }
        }
      }
    }catch{}
  }
  if(!email){ document.getElementById('loginPage').style.display='block'; document.getElementById('profilePage').style.display='none'; return; }
  // === INI YANG BIKIN URL /akun OTOMATIS JADI /naura ===
  let myUsername=email.split('@')[0].replace(/[^a-z0-9]/g,'').toLowerCase();
  if(location.pathname==="/akun"||location.pathname==="/a"){
    history.replaceState(null,"","/"+myUsername);
  }
  document.getElementById('loginPage').style.display='none';
  document.getElementById('profilePage').style.display='block';
  document.getElementById('dEmail').innerText=email;
  document.getElementById('dName').innerText=data.name;
  document.getElementById('dUser').innerText='@'+myUsername;
  loadStats(email); checkFollow(); loadUsers(); saveToD1(email,data.name);
}
function doLogin(){ let e=document.getElementById('email').value.trim().toLowerCase(); if(!e) return alert("isi email"); localStorage.setItem("user_email",e); saveToD1(e,data.name).then(()=>{ let u=e.split('@')[0].replace(/[^a-z0-9]/g,''); history.replaceState(null,"","/"+u); checkLogin(); }); }
function doRegister(){ let n=document.getElementById('rName').value.trim(); let e=document.getElementById('rEmail').value.trim().toLowerCase(); if(!n||!e) return alert("isi nama & email"); data.name=n; localStorage.setItem("rg_profile",JSON.stringify(data)); localStorage.setItem("user_email",e); saveToD1(e,n).then(()=>{ let u=e.split('@')[0].replace(/[^a-z0-9]/g,''); history.replaceState(null,"","/"+u); checkLogin(); }); }
function doGoogle(){ let e=prompt("Email Google:"); let n=prompt("Nama:"); if(!e) return; data.name=n||e.split('@')[0]; localStorage.setItem("rg_profile",JSON.stringify(data)); localStorage.setItem("user_email",e.toLowerCase()); saveToD1(e.toLowerCase(),data.name).then(()=>{ let u=e.toLowerCase().split('@')[0].replace(/[^a-z0-9]/g,''); history.replaceState(null,"","/"+u); checkLogin(); }); }
function editName(){ let n=prompt("Ganti nama:",data.name); if(n){ data.name=n; localStorage.setItem("rg_profile",JSON.stringify(data)); document.getElementById('dName').innerText=n; saveToD1(localStorage.getItem("user_email"),n); } }
function doLogout(){ localStorage.removeItem("user_email"); location.href="/akun"; }
checkLogin();
<\/script></body></html>`;
