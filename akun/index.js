export const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun - Rumah Gadang AI</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/icon.png">
<style>

*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:120px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 20px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer}

/* GRID FIX BOS BIAR KELIATAN */
.photo-grid-2x2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.photo-card{position:relative;border-radius:16px;overflow:hidden;background:#111;border:1.5px solid #222;aspect-ratio:1/1}
.photo-card img{width:100%;height:100%;object-fit:cover;display:block}
.photo-del{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.85);color:#fff;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;z-index:2}

.btn-add-private{width:100%;background:#111;border:1.5px dashed #00ff88;color:#00ff88;padding:16px;border-radius:14px;font-weight:800;margin-bottom:12px;cursor:pointer}
.btn-save-foto{width:100%;background:#00ff88;color:#000;border:none;padding:15px;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;margin-bottom:20px}
.private-card{background:#111;border:1px solid #222;border-radius:14px;padding:10px;margin-bottom:12px;overflow:hidden}
.user-fb{display:flex;gap:12px;background:#0f0f0f;padding:12px;border-radius:14px;margin-bottom:12px;border:1px solid #222}
.user-fb-av{width:56px;height:56px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}

.profile-sec{padding:18px 14px 10px}
.prof-top{display:flex;align-items:center;gap:18px;margin-bottom:14px}
.avatar-wrap{position:relative;width:76px;height:76px}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #00ff88;background:#111}
.stats-wrap{flex:1;display:flex;justify-content:space-between;text-align:center}
.stat-num{font-size:20px;font-weight:900}.stat-label{font-size:11px;color:#777}
.main-tabs{display:flex;gap:8px;margin:16px 0;border-bottom:1px solid #222;padding-bottom:14px;overflow:auto}
.m-tab{min-width:78px;flex:1;padding:12px 10px;border-radius:12px;background:#2a2a2a;color:#888;text-align:center;font-weight:800;font-size:12px;cursor:pointer;border:1px solid #333}
.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88;box-shadow:0 0 12px rgba(0,255,136,0.5)}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
#toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#00ff88;color:#000;padding:12px 18px;border-radius:22px;font-weight:900;font-size:13px;display:none;z-index:9999}
.cardOuter{margin:12px;border-radius:22px;background:#fff;color:#000;padding:16px 14px;}
.inp{width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px;border-radius:12px;margin-top:10px;font-size:14px;color:#000}
.btnMasuk{width:100%;margin-top:12px;background:#000;color:#fff;border:0;padding:14px;border-radius:12px;font-weight:800}
.cardLogo{margin:14px 12px;border-radius:26px;overflow:hidden;position:relative;height:460px;background:#000;border:3px solid #00ff88;display:grid;place-items:center}
.rgWrap{position:relative;z-index:2;width:92%;height:92%;border-radius:50%;border:3px solid #00ff88;box-shadow:0 0 25px #00ff88;display:grid;place-items:center;background:#000;overflow:hidden}
.rgWrap img{width:100%;height:100%;object-fit:cover}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<input type="file" id="filePicker" accept="image/*" style="display:none">
<div class="bot"><a href="/">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a></div>
<div id=toast></div>
<script>
const LOGO_DEFAULT="https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
let activeMainTab="tulis"; let viewingUserEmail=null; let loginMode='masuk';
let myServerPhotos=[]; // FOTO DARI SERVER BOS
const urlParams=new URLSearchParams(location.search);
const profilParam=urlParams.get('profil'); if(profilParam){ viewingUserEmail=decodeURIComponent(profilParam); }
function toast(m){let t=document.getElementById('toast');t.innerText=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500);}
function getMyEmail(){return (localStorage.getItem('rg_email')||"").toLowerCase().trim();}
function getMyName(){return localStorage.getItem('rg_name')||"Dunsanak";}
function getMyAvatar(){ let i=localStorage.getItem('rg_avatar'); return (i&&i.trim()!=="")?i:LOGO_DEFAULT; }
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n||"Dunsanak");localStorage.setItem('rg_avatar',(a&&a.trim()!=="")?a:LOGO_DEFAULT);}
function logout(){ if(confirm("Keluar?")){localStorage.removeItem('rg_email');localStorage.removeItem('rg_name');localStorage.removeItem('rg_avatar');viewingUserEmail=null;history.pushState(null,'','/akun');render();}}
function triggerGallery(){document.getElementById('filePicker').click();}
document.getElementById('filePicker').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=ev=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const MAX=800; let w=img.width,h=img.height; if(w>h){if(w>MAX){h*=MAX/w;w=MAX;}}else{if(h>MAX){w*=MAX/h;h=MAX;}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h); updateProfile(null,c.toDataURL('image/jpeg',0.85)); }; img.src=ev.target.result; };
  r.readAsDataURL(f);
});
async function updateProfile(n,a){ const e=getMyEmail(); if(!e) return; saveAuth(e,n||getMyName(),a||getMyAvatar()); render(); try{await fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,name:n||getMyName(),picture:a||getMyAvatar()})});}catch(e){}}
async function render(){ const my=getMyEmail(); const cont=document.getElementById('viewContainer'); 
if(!my&&!viewingUserEmail){
  cont.innerHTML=\`<div class="cardOuter"><h2>Rumah Gadang AI</h2><input id="emailIn" class="inp" placeholder="email"><input id="nameIn" class="inp" placeholder="Nama"><button class="btnMasuk" onclick="doLogin()">Masuk</button></div><div class="cardLogo"><div class="rgWrap"><img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg"></div></div>\`;return;
} 
const target=viewingUserEmail||my; const isMe=target===my; renderProfile(cont,target,isMe);
}
async function doLogin(){ let email=document.getElementById('emailIn').value.trim().toLowerCase(); let name=document.getElementById('nameIn')?.value.trim()||email.split('@')[0]; if(!email.includes('@')) email+='@rumahgadang-ai.my.id'; saveAuth(email,name,LOGO_DEFAULT); try{await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,picture:LOGO_DEFAULT})});}catch{} render(); }
function editProfil(){ const n=prompt("Nama baru:",getMyName()); if(n&&n.trim()) updateProfile(n.trim(),null); }
function switchTab(t){ activeMainTab=t; const me=viewingUserEmail||getMyEmail(); loadContent(me, me===getMyEmail()); document.querySelectorAll('.m-tab').forEach(b=>{ b.classList.toggle('active', b.innerText.toLowerCase()===t); }); }
function viewUser(e){ viewingUserEmail=e; activeMainTab='tulis'; history.pushState(null,'','/akun?profil='+encodeURIComponent(e)); render(); }

// === LOAD FOTO DARI SERVER BOS - INI KUNCINYA BOS ===
async function fetchServerPhotos(email){
  try{
    let r = await fetch('/api/akun/photos?email='+encodeURIComponent(email)+'&t='+Date.now());
    if(!r.ok) return [];
    let data = await r.json();
    if(Array.isArray(data)) return data;
    if(typeof data === 'string') return JSON.parse(data);
    return [];
  }catch{ return []; }
}

async function renderProfile(container,targetEmail,isMe){
  container.innerHTML='<div style="text-align:center;padding:40px;color:#666">Memuat...</div>';
  let data={name:isMe?getMyName():targetEmail.split('@')[0],picture:isMe?getMyAvatar():LOGO_DEFAULT,posts:0,followers:0,following:0,isFollowing:false};
  try{ let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail())+'&t='+Date.now()); if(r.ok){ let d=await r.json(); data={...data,...d}; } }catch(e){}
  // LOAD FOTO SERVER DISINI BOS
  myServerPhotos = await fetchServerPhotos(targetEmail);
  container.innerHTML=\`
    <div class="profile-sec">
      <div class="prof-top"><div class="avatar-wrap"><img src="\${data.picture}" class="avatar-img"></div><div class="stats-wrap"><div><div class="stat-num">\${data.posts||0}</div><div class="stat-label">tulisan</div></div><div><div class="stat-num">\${data.followers||0}</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">\${data.following||0}</div><div class="stat-label">mengikuti</div></div></div></div>
      <div style="font-size:18px;font-weight:900">\${data.name}</div><div style="font-size:12px;color:#00ff88;margin-bottom:14px">\${targetEmail}</div>
      <div style="margin-bottom:16px">\${isMe ? \`<div style="display:flex;gap:8px"><button style="flex:1;padding:13px;background:#222;color:#fff;border:1px solid #333;border-radius:12px" onclick="editProfil()">Edit</button><button style="flex:1;padding:13px;background:#1a1a1a;color:#ff4d4d;border:1px solid #331111;border-radius:12px" onclick="logout()">Keluar</button></div>\` : \`<button id="followBtn" style="width:100%;padding:14px;background:\${data.isFollowing?'#222':'#00ff88'};color:\${data.isFollowing?'#fff':'#000'};border:0;border-radius:14px;font-weight:900" onclick="toggleFollow('\${targetEmail}')">\${data.isFollowing?'✓ Mengikuti':'Follow'}</button>\`}</div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='tulis'?'active':''}" onclick="switchTab('tulis')">TULIS</button>
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchTab('video')">VIDEO</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchTab('teman')">TEMAN</button>
      </div>
      <div id="tabContent"></div>
    </div>\`;
  loadContent(targetEmail,isMe);
}

async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='foto'){
    // TAMPIL 2x2 BOS BIAR GA KETUTUP
    if(!myServerPhotos.length){
      box.innerHTML = isMe ? \`<button class="btn-add-private" onclick="addFoto()">+ Tambah Foto (Max 12)</button><div style="text-align:center;padding:40px;color:#555">Belum ada foto<br>Foto tersimpan akan muncul disini</div>\` : '<div style="text-align:center;padding:40px;color:#555">Belum ada foto</div>';
      return;
    }
    let grid = '<div class="photo-grid-2x2">' + myServerPhotos.map((src,i)=>\`
      <div class="photo-card">
        <img src="\${src}" loading="lazy">
        \${isMe?'<button class="photo-del" onclick="hapusFoto('+i+')">✕</button>':''}
      </div>\`).join('') + '</div>';
    if(isMe) grid = '<button class="btn-add-private" onclick="addFoto()">+ Tambah Foto ('+myServerPhotos.length+'/12)</button><button class="btn-save-foto" onclick="saveAllFoto()">💾 Simpan ke Server</button>' + grid;
    box.innerHTML = grid;
  } else if(activeMainTab==='tulis'){
    try{ let r = await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)+'&t='+Date.now()); let list = await r.json(); let arr=Array.isArray(list)?list:(list.results||[]); let mine=arr.filter(p=>(p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase()); if(!mine.length){box.innerHTML='<div style="text-align:center;padding:40px;color:#555">Belum ada tulisan</div>';return;} box.innerHTML=mine.map(p=>\`<div class="private-card">\${p.text||p.isi||''}</div>\`).join(''); }catch{box.innerHTML='Gagal load';}
  } else if(activeMainTab==='teman'){
    box.innerHTML='<div style="text-align:center;color:#555;padding:20px">Memuat...</div>';
    try{ let r=await fetch('/api/akun/list?t='+Date.now()); let u=await r.json(); let list=u.filter(x=>x.email.toLowerCase()!==getMyEmail().toLowerCase()); box.innerHTML=list.map(x=>\`<div class="user-fb"><img src="\${x.picture||LOGO_DEFAULT}" class="user-fb-av"><div><b>\${x.name}</b><br><small>\${x.email}</small></div></div>\`).join(''); }catch{box.innerHTML='Gagal';}
  } else { box.innerHTML='<div style="text-align:center;padding:40px;color:#555">Segera</div>'; }
}

// === FUNGSI TAMBAH / HAPUS / SAVE FOTO BOS ===
let tempPhotos = [];
async function addFoto(){
  const input = document.createElement('input'); input.type='file'; input.accept='image/*'; input.multiple=true;
  input.onchange = async (e)=>{
    const files = Array.from(e.target.files).slice(0,12 - myServerPhotos.length);
    for(let f of files){
      const base64 = await new Promise(res=>{ const r=new FileReader(); r.onload=ev=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const MAX=800; let w=img.width,h=img.height; if(w>MAX||h>MAX){ if(w>h){h*=MAX/w;w=MAX;}else{w*=MAX/h;h=MAX;}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h); res(c.toDataURL('image/jpeg',0.7)); }; img.src=ev.target.result; }; r.readAsDataURL(f); });
      myServerPhotos.push(base64);
    }
    loadContent(viewingUserEmail||getMyEmail(), true);
    toast(myServerPhotos.length+' foto siap simpan Bos!');
  };
  input.click();
}
function hapusFoto(i){ myServerPhotos.splice(i,1); loadContent(viewingUserEmail||getMyEmail(), true); }
async function saveAllFoto(){
  const email=getMyEmail(); if(!email) return;
  if(myServerPhotos.length>12) return toast('Max 12 Bos!');
  toast('Menyimpan...');
  try{
    let r=await fetch('/api/akun/photos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email, photos: myServerPhotos})});
    let j=await r.json();
    if(j.ok) toast('Tersimpan Bos! '+j.count+' foto');
    else toast('Gagal: '+j.error);
  }catch(e){ toast('Error: '+e.message); }
}
async function toggleFollow(target){ const me=getMyEmail(); if(!me) return; let res=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:me, following:target.toLowerCase()})}); let j=await res.json(); if(j.ok) render(); }
render();
<\/script>
</body>
</html>
`;

export default AKUN_HTML;
