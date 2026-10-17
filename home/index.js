export const HOME_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rumah Gadang AI</title>
<script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-black text-white min-h-screen pb-20">
<div class="max-w-[500px] mx-auto p-3">
  <div class="flex justify-between items-center mb-3"><div class="flex gap-2 items-center"><div class="w-8 h-8 bg-zinc-800 rounded-full"></div><b>RUMAH GADANG AI</b></div><a href="/akun" id="loginBtn" class="bg-white text-black px-4 py-1 rounded-full text-sm font-bold">LOGIN</a></div>
  <div class="bg-zinc-900 border-2 border-green-500 rounded-2xl p-3 mb-3">
    <div class="flex gap-2"><input id="tulisInput" placeholder="Tulis disini..." class="flex-1 bg-zinc-800 p-3 rounded-xl text-white border border-zinc-700" /><button onclick="kirimTulis()" class="bg-zinc-800 border border-zinc-700 px-4 rounded-xl font-bold">+</button></div>
    <button onclick="kirimTulis()" class="w-full bg-[#00ff00] text-black p-3 rounded-xl font-bold mt-2">KIRIM</button>
    <p id="loading" class="text-xs text-zinc-500 mt-2" style="display:none">Loading Bos...</p>
  </div>
  <div id="listTulis"></div>
</div>
<div class="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around p-2 max-w-[500px] mx-auto">
  <a href="/" class="text-center"><div>🏠</div><div class="text-[10px]">Home</div></a>
  <a href="/foto" class="text-center"><div>🖼️</div><div class="text-[10px]">Foto</div></a>
  <a href="/video" class="text-center"><div>🎬</div><div class="text-[10px]">Video</div></a>
  <a href="/akun" class="text-center"><div>👤</div><div class="text-[10px]">Akun</div></a>
</div>
<script>
const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id"];
function isAdmin(e){ if(!e) return false; return ADMIN_EMAILS.includes(e.toLowerCase().trim()); }

function updateLoginBtn(){
  let email = localStorage.getItem("user_email");
  let btn = document.getElementById("loginBtn");
  if(email){ btn.innerText = email.split("@")[0]; btn.className = "bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold"; if(isAdmin(email)) btn.innerText += " ADMIN"; }
}

async function loadTulis(){
  let email = localStorage.getItem("user_email")||"";
  document.getElementById("loading").style.display="block";
  try{
    let r = await fetch("/api/tulis");
    let data = await r.json();
    let html = "";
    data.forEach(t=>{
      let isAdm = isAdmin(email);
      html += \`<div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
        <div class="flex justify-between">
          <div class="flex gap-2 items-center"><img src="\${t.picture||'https://i.pravatar.cc/100'}" class="w-8 h-8 rounded-full" /><div><b class="text-sm">\${t.name||'User'}</b><div class="text-[10px] text-zinc-500">\${new Date(t.time).toLocaleString()}</div></div></div>
          \${isAdm ? \`<button onclick="hapusTulis(\${t.id})" class="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">HAPUS</button>\` : ""}
        </div>
        <p class="mt-3 text-sm whitespace-pre-wrap">\${t.text}</p>
      </div>\`;
    });
    document.getElementById("listTulis").innerHTML = html || "<p class='text-center text-zinc-500 text-sm'>Belum ada tulisan Bos</p>";
  }catch(e){ console.log(e); }
  document.getElementById("loading").style.display="none";
}

async function kirimTulis(){
  let text = document.getElementById("tulisInput").value.trim();
  let email = localStorage.getItem("user_email");
  if(!email){ alert("Login dulu Bos di Akun!"); location.href="/akun"; return; }
  if(!text){ alert("Tulis dulu Bos!"); return; }
  let data = JSON.parse(localStorage.getItem("rg_profile")||"{}");
  await fetch("/api/tulis",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text,user_email:email,name:data.name||email.split("@")[0],picture:localStorage.getItem("rg_avatar")||"",time:Date.now()})});
  document.getElementById("tulisInput").value="";
  loadTulis();
}

async function hapusTulis(id){
  if(!confirm("Yakin hapus Bos?")) return;
  let email = localStorage.getItem("user_email")||"";
  let res = await fetch("/api/tulis/delete?admin="+email,{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Email":email},body:JSON.stringify({id:id})});
  let d = await res.json();
  if(d.error){ alert(d.error); } else { loadTulis(); }
}

updateLoginBtn();
loadTulis();
<\/script></body></html>`;
