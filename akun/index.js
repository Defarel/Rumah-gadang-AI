export const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - Akun & Komunitas</title>
<meta name="description" content="Rumah Gadang AI - Komunitas Minangkabau">
<link rel="icon" href="/icon.png">
<link rel="canonical" href="https://www.rumahgadang-ai.my.id/akun">
<script src="https://cdn.tailwindcss.com"></script>
<style>
body{background:#000;color:#fff;font-family:system-ui,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:100px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 18px rgba(0,255,136,0.5)}
.neon{border:3px solid #00ff88;box-shadow:0 0 12px #00ff88}
.neon-avatar{border:2.5px solid #00ff88;box-shadow:0 0 10px #00ff88}
.post{padding:14px;display:flex;gap:10px;background:#0f0f0f;margin:10px;border-radius:16px;border:1px solid #1a1a1a;border-left:3px solid #00ff88}
.skeleton{height:70px;background:linear-gradient(90deg,#0a0a0a 25%,#151515 50%,#0a0a0a 75%);background-size:200% 100%;animation:shimmer 1.2s infinite;border-radius:16px;margin:10px}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
</style></head><body>
<div id=app>

<!-- TOP BAR BOS -->
<div style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222;position:sticky;top:0;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);z-index:20">
<div style="display:flex;gap:10px;align-items:center"><img src="/icon.png" style="width:38px;height:38px;border-radius:50%;border:2px solid #00ff88"><b>RUMAH GADANG AI</b></div>
<button id=topBtn onclick="goHome()" style="background:#00ff88;color:#000;border:0;padding:7px 16px;border-radius:20px;font-weight:900;font-size:12px">HOME</button>
</div>

<!-- BOX TULIS BOS - MUNCUL KALO UDAH LOGIN BOS -->
<div id=boxTulis style="padding:14px;background:#0a0a0a;border-bottom:2px solid #00ff88;display:none">
<div style="display:flex;gap:10px;align-items:center"><img id=miniAv src="/icon.png" style="width:42px;height:42px;border-radius:50%;border:2px solid #00ff88;object-fit:cover"><input id=tulisIn placeholder="Tulis disini Bos... Amanda ✨" style="flex:1;background:#111;border:2px solid #00ff88;color:#fff;padding:13px 16px;border-radius:14px;outline:none"><button onclick="document.getElementById('fileIn').click()" style="width:46px;height:46px;background:#1a1a1a;border:1px solid #333;color:#00ff88;border-radius:12px;font-size:28px;font-weight:900">+</button></div>
<div id=preview style="margin-top:10px;display:none;position:relative"><img id=prevImg style="width:100%;border-radius:12px;max-height:320px;object-fit:cover;border:1px solid #00ff88"><span onclick="clearImg()" style="position:absolute;top:8px;right:8px;background:#000;padding:6px 12px;border-radius:20px;cursor:pointer;border:1px solid #333">✕</span></div>
<button onclick="addTulis()" id=btnKirim style="width:100%;margin-top:12px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:14px;font-weight:900;box-shadow:0 0 12px rgba(0,255,136,0.6)">KIRIM 🚀</button>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>

<!-- BOX LOGIN BOS - MUNCUL KALO BELUM LOGIN BOS -->
<div id=boxLogin style="padding:16px;background:#0a0a0a;border-bottom:2px solid #00ff88">
<div style="background:#fff;color:#000;padding:18px;border-radius:24px" class=neon>
<h1 style="font-weight:900;font-size:20px">Rumah Gadang AI</h1>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:14px 0"><button onclick="tab('masuk')" id=t1 style="background:#000;color:#fff;padding:8px;border-radius:10px;font-weight:800;font-size:13px">Masuk</button><button onclick="tab('daftar')" id=t2 style="background:#eee;padding:8px;border-radius:10px;font-size:13px">Buat Akun</button><button onclick="tab('google')" id=t3 style="background:#eee;padding:8px;border-radius:10px;font-size:13px">Google</button></div>
<div id=pMasuk><input id=email placeholder="email kamu: amanda@..." style="width:100%;padding:12px;border-radius:12px;background:#f3f3f3;border:1px solid #ddd;color:#000;margin-bottom:8px"><input id=pass type=password placeholder="password (bebas)" style="width:100%;padding:12px;border-radius:12px;background:#f3f3f3;border:1px solid #ddd;color:#000;margin-bottom:10px"><button onclick="doLogin()" style="width:100%;background:#000;color:#fff;padding:12px;border-radius:12px;font-weight:800">Masuk</button></div>
<div id=pDaftar style="display:none"><input id=rName placeholder="Nama: Amanda" style="width:100%;padding:12px;border-radius:12px;background:#f3f3f3;border:1px solid #ddd;color:#000;margin-bottom:8px"><input id=rEmail placeholder="email: amanda@..." style="width:100%;padding:12px;border-radius:12px;background:#f3f3f3;border:1px solid #ddd;color:#000;margin-bottom:8px"><input id=rPass type=password placeholder="password" style="width:100%;padding:12px;border-radius:12px;background:#f3f3f3;border:1px solid #ddd;color:#000;margin-bottom:10px"><button onclick="doRegister()" style="width:100%;background:#00ff00;color:#000;padding:12px;border-radius:12px;font-weight:900">Buat Akun</button></div>
<div id=pGoogle style="display:none"><button onclick="doGoogle()" style="width:100%;background:#fff;border:2px solid #000;padding:12px;border-radius:12px;font-weight:800">Login Google (isi manual)</button></div>
</div>
<img src="https://i.ibb.co/HpVSvhYH/Rumah-Gadang-AI1.jpg" style="width:100%;height:220px;object-fit:cover;border-radius:0 0 20px 20px;margin-top:4px;border:3px solid #00ff88;border-top:0">
</div>

<!-- PROFILE BOX BOS -->
<div id=profileBox style="padding:16px;display:none">
<div style="background:#121212;border:3px solid #00ff00;border-radius:24px;padding:16px;box-shadow:0 0 15px #00ff00">
<div style="display:flex;gap:14px"><div style="position:relative" onclick="editFoto()"><img id=av src="https://i.pravatar.cc/150?u=naura" style="width:64px;height:64px;border-radius:50%;object-fit:cover" class=neon-avatar><div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);border-radius:50%;display:grid;place-items:center;font-size:10px;opacity:0" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">Ganti</div></div><div><h2 id=dName style="font-weight:900;font-size:18px">Dunsanak</h2><p id=dUser style="font-size:12px;color:#888"></p><p id=dEmail style="font-size:11px;color:#888"></p><div style="display:flex;gap:10px;margin-top:4px;font-size:13px"><b id=f1>0</b> pengikut <b id=f2>0</b> mengikuti</div><p id=mutual style="font-size:11px;color:#00ff88;display:none">● Saling mengikuti</p><p id=bioText style="font-size:12px;color:#aaa;margin-top:4px"></p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px"><button onclick="editProfil()" style="background:#222;padding:10px;border-radius:12px;font-size:13px">Edit profil</button><button id=followBtn onclick="doFollow()" style="background:#fff;color:#000;padding:10px;border-radius:12px;font-weight:800;font-size:13px;display:none">Ikuti</button></div>
<button onclick="doLogout()" style="width:100%;background:#ff2222;color:#fff;padding:10px;border-radius:12px;font-weight:800;margin-top:10px;font-size:13px">LOGOUT</button>
<input type=file id=photoInput accept="image/*" style="display:none">
</div>
</div>

<!-- FEED BOS -->
<div id=homeFeed style="padding:6px 0"><div class=skeleton></div><div class=skeleton></div></div>

<!-- CARI TEMAN BOS -->
<div style="padding:16px;border-top:2px solid #00ff88;background:#050505;margin-top:10px">
<h3 style="font-weight:900;margin-bottom:10px">Cari Teman 🔍</h3><div style="display:flex;gap:8px"><input id=q placeholder="@naura / admin / amanda" style="flex:1;padding:10px;border-radius:12px;background:#111;border:1px solid #333;color:#fff"><button onclick="doSearch()" style="background:#fff;color:#000;padding:10px 16px;border-radius:12px;font-weight:800">Cari</button></div><div id=list style="margin-top:12px;display:flex;flex-direction:column;gap:8px"></div>
</div>

<a href="/" style="display:block;text-align:center;color:#666;font-size:11px;padding:16px;text-decoration:none">← Balik ke Home - Rumah Gadang AI</a>
</div>

<!-- BOTTOM NAV -->
<div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:rgba(0,0,0,0.98);border-top:2px solid #00ff88;display:flex;z-index:99"><a href="/" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🎬<br><span style="font-size:10px">Video</span></a><a href="/akun" style="flex:1;text-align:center;padding:10px 0;color:#fff;text-decoration:none">👤<br><span style="font-size:10px">Akun</span></a></div>

<script>
const ADMIN_EMAILS=["admin@rumahgadang-ai.my.id","naura@rumahgadang-ai.my.id"];
let data=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(!data.name) data.name="Dunsanak";
function syncStorage(email,name,pic){ email=email.toLowerCase().trim(); name=name||email.split('@')[0]; localStorage.setItem("user_email",email); localStorage.setItem("rg_email",email); localStorage.setItem("rg_name",name); if(pic) localStorage.setItem("rg_avatar",pic); let old={}; try{old=JSON.parse(localStorage.getItem("rg_profile")||"{}");}catch{} let merged={...old,email:email,name:name,picture:pic||old.picture||""}; localStorage.setItem("rg_profile",JSON.stringify(merged)); data=merged; }
function isAdminNow(){ let e=(localStorage.getItem("user_email")||"").toLowerCase(); return ADMIN_EMAILS.includes(e); }
function tab(t){ document.getElementById('pMasuk').style.display=t==='masuk'?'block':'none'; document.getElementById('pDaftar').style.display=t==='daftar'?'block':'none'; document.getElementById('pGoogle').style.display=t==='google'?'block':'none'; document.getElementById('t1').style.background=t==='masuk'?'#000':'#eee'; document.getElementById('t1').style.color=t==='masuk'?'#fff':'#000'; document.getElementById('t2').style.background=t==='daftar'?'#000':'#eee'; document.getElementById('t2').style.color=t==='daftar'?'#fff':'#000'; document.getElementById('t3').style.background=t==='google'?'#000':'#eee'; document.getElementById('t3').style.color=t==='google'?'#fff':'#000'; }
async function saveToD1(email,name,pic){ try{ await fetch('/api/register-user',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.toLowerCase(),name:name,picture:pic||""})}); }catch{} }
async function saveProfile(email,obj){ try{ await fetch('/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.toLowerCase(),...obj})}); }catch{} }
function getUsernameFromUrl(){ let p=location.pathname; if(p==="/akun"||p==="/a"||p==="/"||p==="") return null; let u=p.replace("/","").split("/")[0]; if(["foto","video","ai","kantor","tulis","api","sitemap","robots","icon.png"].includes(u)) return null; return u.toLowerCase(); }
async function loadStats(e){ if(!e) return; try{ let r=await fetch('/api/follow-stats/'+encodeURIComponent(e.toLowerCase())); let j=await r.json(); document.getElementById('f1').innerText=j.followers; document.getElementById('f2').innerText=j.following; }catch{} }
async function checkFollow(){ let my=localStorage.getItem("user_email"); let viewed=document.getElementById('dEmail').innerText; let btn=document.getElementById('followBtn'); if(!my||!viewed||my.toLowerCase()===viewed.toLowerCase()||!viewed.includes('@')){ btn.style.display='none'; return; } btn.style.display='block'; try{ let r=await fetch('/api/check-follow/'+encodeURIComponent(my)+'/'+encodeURIComponent(viewed)); let j=await r.json(); btn.innerText=j.following?'Mengikuti ✓':'Ikuti'; btn.dataset.f=j.following; document.getElementById('mutual').style.display=j.mutual?'block':'none'; }catch{} }
async function doFollow(){ let my=localStorage.getItem("user_email"); let viewed=document.getElementById('dEmail').innerText; let btn=document.getElementById('followBtn'); let isF=btn.dataset.f==="true"; let ep=isF?'/api/unfollow':'/api/follow'; btn.innerText="..."; await fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower_id:my,following_id:viewed})}); checkFollow(); loadStats(viewed); }
async function loadUsers(){ try{ let r=await fetch('/api/users'); let u=await r.json(); render(u); }catch{} }
async function doSearch(){ let q=document.getElementById('q').value.trim(); if(!q){ loadUsers(); return; } try{ let r=await fetch('/api/search-users/'+encodeURIComponent(q)); let u=await r.json(); render(u); }catch{} }
function render(users){ let my=localStorage.getItem("user_email")||""; let list=document.getElementById('list'); list.innerHTML=""; let fil=(users||[]).filter(x=>x.email.toLowerCase()!==my.toLowerCase()); if(!fil.length){ list.innerHTML='<p style="text-align:center;color:#666;font-size:12px;padding:10px">Belum ada teman</p>'; return; } fil.forEach(u=>{ let pic=u.picture||'https://i.pravatar.cc/100?u='+u.email; let d=document.createElement('div'); d.style.cssText="display:flex;justify-content:space-between;background:#111;padding:8px;border-radius:12px;align-items:center"; d.innerHTML='<div style="display:flex;gap:8px;align-items:center"><img src="'+pic+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover"><div><div style="font-size:13px;font-weight:800">'+u.name+' <span style="color:#888;font-size:11px">@'+u.username+'</span></div><div style="font-size:10px;color:#888">'+u.email+'</div></div></div><a href="/'+u.username+'" style="background:#fff;color:#000;font-size:11px;padding:6px 12px;border-radius:20px;font-weight:800;text-decoration:none">Lihat</a>'; list.appendChild(d); }); }
async function loadProfileFromD1(email){ try{ let r=await fetch('/api/profile/'+encodeURIComponent(email.toLowerCase())); let p=await r.json(); if(p && p.picture){ document.getElementById('av').src=p.picture; document.getElementById('bioText').innerText=p.bio||''; syncStorage(email,p.name||data.name,p.picture); } }catch{} }
function editFoto(){ document.getElementById('photoInput').click(); }
async function uploadFoto(input){ let file=input.files[0]; if(!file) return; let reader=new FileReader(); reader.onload=async function(e){ let base64=e.target.result; document.getElementById('av').src=base64; document.getElementById('miniAv').src=base64; let email=localStorage.getItem("user_email"); data.picture=base64; syncStorage(email,data.name,base64); await saveProfile(email,{picture:base64,name:data.name}); await saveToD1(email,data.name,base64); alert("Foto profil diganti Bos!"); }; reader.readAsDataURL(file); }
function editProfil(){ let n=prompt("Ganti nama:",data.name); if(n===null) return; let b=prompt("Bio:",document.getElementById('bioText').innerText||""); let p=prompt("URL Foto (kosongkan kalau pakai upload):",data.picture||""); if(n){ data.name=n; if(p) data.picture=p; let email=localStorage.getItem("user_email"); syncStorage(email,n,p||data.picture||""); document.getElementById('dName').innerText=n; document.getElementById('nameMini')?document.getElementById('nameMini').innerText=n:null; if(p){ document.getElementById('av').src=p; document.getElementById('miniAv').src=p; } if(b!==null) document.getElementById('bioText').innerText=b; saveProfile(email,{name:n,bio:b||"",picture:p||data.picture||""}); saveToD1(email,n,p||data.picture||""); } }
function goHome(){ location.href='/'; }
function getEmail(){ let e=localStorage.getItem("user_email")||localStorage.getItem("rg_email")||""; if(!e){try{let p=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(p.email) e=p.email;}catch{}} return (e||"").toLowerCase().trim(); }
function getName(){ let n=localStorage.getItem("rg_name"); if(n) return n; try{let p=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(p.name) return p.name;}catch{} return getEmail().split('@')[0]||"Dunsanak"; }
function getAvatar(){ let a=localStorage.getItem("rg_avatar"); if(a) return a; try{let p=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(p.picture) return p.picture;}catch{} return "/icon.png"; }
function isLogged(){ let e=getEmail(); return !!e && e.includes('@'); }

// --- HOME LOGIC GABUNG BOS ---
let selectedImg="";
function clearImg(){ selectedImg=""; document.getElementById('preview').style.display='none'; }
function compressImage(file,maxW=1280,q=0.7){ return new Promise((res,rej)=>{ let r=new FileReader(); r.onload=ev=>{ let img=new Image(); img.onload=()=>{ let c=document.createElement('canvas'); let w=img.width,h=img.height; if(w>maxW){h=h*(maxW/w);w=maxW;} c.width=w;c.height=h; c.getContext('2d').drawImage(img,0,0,w,h); res(c.toDataURL('image/jpeg',q)); }; img.onerror=rej; img.src=ev.target.result; }; r.onerror=rej; r.readAsDataURL(file); }); }
document.getElementById('fileIn').addEventListener('change',async e=>{ let f=e.target.files[0]; if(!f) return; try{ document.getElementById('preview').style.display='block'; selectedImg=await compressImage(f); document.getElementById('prevImg').src=selectedImg; }catch{ clearImg(); } });
async function loadTulis(){ try{ let r=await fetch('/api/tulis'); let d=await r.json(); let h=document.getElementById('homeFeed'); if(!d.length){ h.innerHTML='<div style="text-align:center;padding:30px;color:#777">Belum ada tulis </div>'; return;} h.innerHTML=d.map(x=>{ return \`<div class=post><img src="\${x.picture||'/icon.png'}" style="width:40px;height:40px;border-radius:50%;border:1.5px solid #00ff88"><div style="flex:1"><div><b style="font-size:13px">\${x.name||'Anonim'}</b><span style="font-size:11px;color:#888;margin-left:6px">\${new Date(x.time).toLocaleString('id-ID')}</span></div><div style="margin-top:4px;font-size:14px;white-space:pre-wrap">\${x.text||''}</div>\${x.tulisImg?'<div style="margin-top:8px;border-radius:12px;overflow:hidden"><img src="'+x.tulisImg+'" style="width:100%"></div>':''}</div></div>\`; }).join(''); }catch(err){ document.getElementById('homeFeed').innerText='Error: '+err.message; } }
async function addTulis(){ if(!isLogged()){ document.getElementById('boxLogin').scrollIntoView({behavior:'smooth'}); return; } let txt=document.getElementById('tulisIn').value.trim(); if(!txt && !selectedImg) return; let btn=document.getElementById('btnKirim'); btn.innerText="MENGIRIM..."; btn.disabled=true; try{ await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,email:getEmail(),name:getName(),picture:getAvatar(),tulisImg:selectedImg})}); document.getElementById('tulisIn').value=''; clearImg(); loadTulis(); }catch(e){} btn.innerText="KIRIM 🚀"; btn.disabled=false; }

async function checkLogin(){
  let email=localStorage.getItem("user_email")||localStorage.getItem("rg_email");
  if(email) syncStorage(email, localStorage.getItem("rg_name")||data.name, localStorage.getItem("rg_avatar")||data.picture);
  let urlUsername=getUsernameFromUrl();
  let boxTulis=document.getElementById('boxTulis');
  let boxLogin=document.getElementById('boxLogin');
  let profileBox=document.getElementById('profileBox');

  if(urlUsername){
    try{ let r=await fetch('/api/user/'+urlUsername); let u=await r.json(); if(u && u.email){ boxLogin.style.display='none'; boxTulis.style.display='none'; profileBox.style.display='block'; document.getElementById('dEmail').innerText=u.email; document.getElementById('dName').innerText=u.name; document.getElementById('dUser').innerText='@'+u.username; document.getElementById('av').src=u.picture||'https://i.pravatar.cc/150?u='+u.email; loadProfileFromD1(u.email); loadStats(u.email); checkFollow(); loadUsers(); loadTulis(); return; } }catch{}
  }
  if(!isLogged()){
    boxLogin.style.display='block'; profileBox.style.display='none'; boxTulis.style.display='none';
  } else {
    let myUsername=getEmail().split('@')[0].replace(/[^a-z0-9]/g,'').toLowerCase();
    if(location.pathname==="/akun"||location.pathname==="/a"){ history.replaceState(null,"","/"+myUsername); }
    boxLogin.style.display='none'; profileBox.style.display='block'; boxTulis.style.display='block';
    document.getElementById('dEmail').innerText=getEmail(); document.getElementById('dName').innerText=getName(); document.getElementById('dUser').innerText='@'+myUsername;
    document.getElementById('av').src=getAvatar(); document.getElementById('miniAv').src=getAvatar();
    loadProfileFromD1(getEmail()); loadStats(getEmail()); checkFollow();
  }
  loadUsers(); loadTulis();
}

function doLogin(){ let e=document.getElementById('email').value.trim().toLowerCase(); if(!e.includes('@')) return alert("Isi email Bos"); syncStorage(e,e.split('@')[0],""); saveToD1(e,e.split('@')[0]).then(()=>{ let u=e.split('@')[0].replace(/[^a-z0-9]/g,''); history.replaceState(null,"","/"+u); checkLogin(); }); }
function doRegister(){ let n=document.getElementById('rName').value.trim(); let e=document.getElementById('rEmail').value.trim().toLowerCase(); if(!n||!e) return alert("Isi nama & email Bos"); syncStorage(e,n,""); saveToD1(e,n).then(()=>{ let u=e.split('@')[0].replace(/[^a-z0-9]/g,''); history.replaceState(null,"","/"+u); checkLogin(); }); }
function doGoogle(){ let e=prompt("Email Google:"); let n=prompt("Nama:"); if(!e) return; let name=n||e.split('@')[0]; syncStorage(e.toLowerCase(),name,""); saveToD1(e.toLowerCase(),name).then(()=>{ let u=e.toLowerCase().split('@')[0].replace(/[^a-z0-9]/g,''); history.replaceState(null,"","/"+u); checkLogin(); }); }
function doLogout(){ localStorage.removeItem("user_email"); localStorage.removeItem("rg_email"); localStorage.removeItem("rg_name"); localStorage.removeItem("rg_avatar"); localStorage.removeItem("rg_profile"); location.href="/akun"; }

checkLogin();
<\/script></body></html>
`;
