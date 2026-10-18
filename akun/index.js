export const AKUN_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun</title><script src="https://cdn.tailwindcss.com"></script><style>.neon-box{border:4px solid #00ff00;box-shadow:0 0 15px #00ff00;border-radius:24px}.neon-avatar{border:3px solid #00ff00;box-shadow:0 0 10px #00ff00}</style></head><body class="bg-black text-white min-h-screen flex items-center justify-center p-4">
<div class="w-full max-w-[420px] flex flex-col gap-4"><div class="neon-box bg-[#121212] p-5"><div class="flex gap-4"><div class="relative cursor-pointer" onclick="document.getElementById('photoInput').click()"><img id="av" src="https://i.pravatar.cc/150" class="w-16 h-16 rounded-full neon-avatar object-cover"><div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-[10px]">Ganti Foto</div></div><div><h2 id="dName" class="font-bold">SP.FC</h2><p id="dUser" class="text-xs text-zinc-500"></p><p id="dEmail" class="text-[11px] text-zinc-500"></p><div class="flex gap-2 mt-1 text-sm"><b id="f1">0</b> pengikut <b id="f2">0</b> mengikuti</div></div></div><div class="grid grid-cols-2 gap-2 mt-4"><button onclick="editProfil()" class="bg-zinc-800 p-2 rounded-xl text-sm">Edit profil</button><button onclick="doLogout()" class="w-full bg-red-600 p-2 rounded-xl text-sm font-bold">LOGOUT</button></div><input type="file" id="photoInput" accept="image/*" class="hidden"></div><a href="/" class="text-center text-xs text-zinc-500">Home</a></div>
<script>
let data=JSON.parse(localStorage.getItem("rg_profile")||"{}");
let email=localStorage.getItem("user_email")||"sp.fc@rumahgadang-ai.my.id";
document.getElementById('dEmail').innerText=email;
document.getElementById('dUser').innerText='@'+email.split('@')[0];
document.getElementById('dName').innerText=data.name||'SP.FC';
if(data.picture) document.getElementById('av').src=data.picture;

// LOAD FOTO DARI D1 BOS!
fetch('/api/profile/'+email).then(r=>r.json()).then(p=>{ if(p.picture){ document.getElementById('av').src=p.picture; data.picture=p.picture; localStorage.setItem("rg_profile",JSON.stringify(data)); } });

document.getElementById('photoInput').addEventListener('change', async function(){
  let file=this.files[0]; if(!file) return;
  
  // KOMPRES OTOMATIS BOS BIAR LANGSUNG BISA BOS!
  let img=new Image();
  img.src=URL.createObjectURL(file);
  await new Promise(r=>img.onload=r);
  let c=document.createElement('canvas');
  let max=200; // JADI KECIL BOS!
  let w=img.width, h=img.height;
  if(w>max || h>max){ if(w>h){ h*=max/w; w=max; } else { w*=max/h; h=max; } }
  c.width=w; c.height=h;
  c.getContext('2d').drawImage(img,0,0,w,h);
  let base64=c.toDataURL('image/jpeg',0.5); // JADI 10KB BOS!
  
  document.getElementById('av').src=base64;
  data.picture=base64; data.name=document.getElementById('dName').innerText;
  localStorage.setItem("rg_profile",JSON.stringify(data));
  
  await fetch('/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email, picture:base64, name:data.name})});
  alert('Foto diganti Bos!');
  this.value='';
});

function editProfil(){ let n=prompt("Nama:",document.getElementById('dName').innerText); if(n){ document.getElementById('dName').innerText=n; data.name=n; localStorage.setItem("rg_profile",JSON.stringify(data)); fetch('/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email, name:n, picture:data.picture||''})}); } }
function doLogout(){ localStorage.removeItem("user_email"); location.href="/akun"; }
<\/script></body></html>`;
