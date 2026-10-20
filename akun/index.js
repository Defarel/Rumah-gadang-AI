export const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun & Profil - Rumah Gadang AI</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:80px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo-title{display:flex;gap:10px;align-items:center}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 18px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer}
.profile-sec{padding:20px 16px 10px}
.prof-top{display:flex;align-items:center;gap:16px;margin-bottom:16px}
.avatar-wrap{position:relative;width:72px;height:72px}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid #00ff88;background:#111}
.avatar-badge{position:absolute;bottom:0;right:0;background:#fff;color:#000;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;font-weight:bold;font-size:14px;border:1px solid #000;cursor:pointer}
.stats-wrap{flex:1;display:flex;justify-content:space-around;text-align:center}
.stat-num{font-size:18px;font-weight:800}
.stat-label{font-size:12px;color:#888}
.name-display{font-size:16px;font-weight:800;margin-bottom:2px}
.email-display{font-size:12px;color:#00ff88;margin-bottom:12px}
.action-bar{display:flex;gap:8px;margin-bottom:18px}
.btn-action{flex:1;padding:12px;background:#222;color:#fff;border:1px solid #333;border-radius:12px;font-weight:700;font-size:13px;cursor:pointer;text-align:center}
.btn-keluar{background:#ff3333!important;border:none!important}
.btn-follow{background:#00ff88!important;color:#000!important;border:none!important;font-weight:900}
.btn-following{background:#333!important}
.main-tabs{display:flex;gap:6px;margin-bottom:16px;border-bottom:1px solid #222;padding-bottom:12px;overflow:auto}
.m-tab{flex:1;min-width:60px;padding:10px 6px;border-radius:12px;background:#222;color:#888;text-align:center;font-weight:800;font-size:12px;cursor:pointer;border:1px solid #333;white-space:nowrap}
.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88}
.content-area{padding:6px 0}
.empty-box{text-align:center;padding:40px 20px;color:#666;font-size:13px}
.user-item{display:flex;align-items:center;justify-content:space-between;background:#111;padding:12px;border-radius:14px;margin-bottom:10px;border:1px solid #222}
.user-info{display:flex;align-items:center;gap:12px;cursor:pointer}
.user-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.btn-add-private{width:100%;background:#151515;border:1.5px dashed #00ff88;color:#00ff88;padding:14px;border-radius:14px;font-weight:800;margin-bottom:12px;cursor:pointer}
.private-card{background:#111;border:1px solid #222;border-radius:14px;padding:10px;margin-bottom:12px}
.private-card img{width:100%;border-radius:10px;display:block}
.private-card video{width:100%;border-radius:10px}
.private-time{font-size:11px;color:#666;margin-top:6px}
.del-mini{background:#ff3333;color:#fff;border:0;padding:4px 10px;border-radius:20px;font-size:10px;float:right;cursor:pointer}
.login-card{margin:20px 16px;background:#fff;border-radius:24px;padding:24px;color:#000;border:2px solid #00ff88}
.tab-btn{flex:1;padding:10px;border-radius:12px;border:none;font-size:13px;font-weight:700;cursor:pointer;background:#ececec}
.tab-btn.active{background:#000;color:#fff}
.input-field{width:100%;padding:14px 16px;background:#f3f3f3;border:1px solid #e0e0e0;border-radius:14px;font-size:14px;margin-bottom:12px;outline:none}
.btn-submit{width:100%;padding:14px;background:#000;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style></head><body>
<div id="app">
  <div class="top"><div class="logo-title"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div>
  <div id="viewContainer"></div>
</div>
<input type="file" id="filePicker" accept="image/*" style="display:none">
<input type="file" id="privateFotoPicker" accept="image/*" style="display:none">
<input type="file" id="privateVideoPicker" accept="video/*" style="display:none">
<div class="bot">
  <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
  <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
  <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
  <a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a>
  <a href="/ai">🤖<br><span style="font-size:10px">AI</span></a>
  <a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a>
</div>
<script>
const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
let authTab="masuk";
let activeMainTab="tulis";
let viewingUserEmail=null;
const urlParams=new URLSearchParams(location.search);
const profilParam=urlParams.get('profil');
if(profilParam){ viewingUserEmail=decodeURIComponent(profilParam); }

function getMyEmail(){return (localStorage.getItem('rg_email')||"").toLowerCase().trim();}
function getMyName(){return localStorage.getItem('rg_name')||"Dunsanak";}
function getMyAvatar(){ let i=localStorage.getItem('rg_avatar'); return (i&&i.trim()!=="")?i:LOGO_DEFAULT; }
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n||"Dunsanak");localStorage.setItem('rg_avatar',(a&&a.trim()!=="")?a:LOGO_DEFAULT);}
function logout(){ if(confirm("Keluar?")){localStorage.removeItem('rg_email');localStorage.removeItem('rg_name');localStorage.removeItem('rg_avatar');viewingUserEmail=null;history.pushState(null,'','/akun');render();}}
function triggerGallery(){document.getElementById('filePicker').click();}
function handleFileSelect(ev){ const f=ev.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=e=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); const MAX=800; let w=img.width,h=img.height; if(w>h){if(w>MAX){h*=MAX/w;w=MAX;}}else{if(h>MAX){w*=MAX/h;h=MAX;}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h); updateProfileData(null,c.toDataURL('image/jpeg',0.85));}; img.src=e.target.result;}; r.readAsDataURL(f); }
document.getElementById('filePicker').addEventListener('change',handleFileSelect);

async function updateProfileData(n,a){ const e=getMyEmail(); if(!e) return; const fn=n||getMyName(); const fa=a||getMyAvatar(); saveAuth(e,fn,fa); render(); try{await fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,name:fn,picture:fa})});}catch(e){}}
async function render(){ const my=getMyEmail(); const cont=document.getElementById('viewContainer'); if(!my&&!viewingUserEmail){renderLogin(cont);return;} const target=viewingUserEmail||my; const isMe=target===my; renderProfile(cont,target,isMe);}
function renderLogin(c){ c.innerHTML = \`<div class="login-card"><div style="font-weight:800;font-size:20px;margin-bottom:14px">Rumah Gadang AI</div><div style="display:flex;gap:8px;margin-bottom:14px"><button class="tab-btn \${authTab==='masuk'?'active':''}" onclick="authTab='masuk';render()">Masuk</button><button class="tab-btn \${authTab==='daftar'?'active':''}" onclick="authTab='daftar';render()">Daftar</button></div>\${authTab==='daftar'?'<input id="nameIn" class="input-field" placeholder="Nama: Farel">':''}<input id="emailIn" class="input-field" placeholder="email: naura@rumahgadang-ai.my.id"><input id="passIn" class="input-field" type="password" placeholder="password"><button class="btn-submit" onclick="doAuth()">\${authTab==='masuk'?'Masuk':'Daftar'}</button></div>\`; }
async function doAuth(){ let email=document.getElementById('emailIn')?.value.trim().toLowerCase(); const name=document.getElementById('nameIn')?.value.trim()||email.split('@')[0]; if(!email){alert("Isi email!");return;} if(!email.includes('@')) email+='@rumahgadang-ai.my.id'; try{await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,picture:LOGO_DEFAULT})});}catch(e){} saveAuth(email,name,LOGO_DEFAULT); viewingUserEmail=null; history.pushState(null,'','/akun'); render();}

async function renderProfile(container,targetEmail,isMe){
  container.innerHTML='<div style="text-align:center;padding:40px;color:#888">Memuat '+targetEmail+'...</div>';
  let data={name:isMe?getMyName():targetEmail.split('@')[0],picture:isMe?getMyAvatar():LOGO_DEFAULT,posts:0,followers:0,following:0,isFollowing:false};
  try{ let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail())); if(r.ok){ let d=await r.json(); data={...data,...d}; if(!data.picture) data.picture=LOGO_DEFAULT; if(isMe) saveAuth(targetEmail,data.name,data.picture);} }catch(e){}
  try{ let r=await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)); let list=await r.json(); let arr=Array.isArray(list)?list:(list.results||[]); data.posts=arr.filter(p=>(p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase()).length; }catch(e){}
  container.innerHTML=\`
    <div class="profile-sec">
      <div class="prof-top">
        <div class="avatar-wrap"><img src="\${data.picture}" class="avatar-img" onerror="this.src='\${LOGO_DEFAULT}'"><div class="avatar-badge" onclick="\${isMe?'triggerGallery()':''}">+</div></div>
        <div class="stats-wrap"><div><div class="stat-num">\${data.posts}</div><div class="stat-label">tulisan</div></div><div><div class="stat-num">\${data.followers||0}</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">\${data.following||0}</div><div class="stat-label">mengikuti</div></div></div>
      </div>
      <div class="name-display">\${data.name}</div><div class="email-display">\${targetEmail}</div>
      <div class="action-bar">\${isMe?\`<button class="btn-action" onclick="editProfil()">Edit profil</button><button class="btn-action btn-keluar" onclick="logout()">Keluar</button>\`:\`<button class="btn-action \${data.isFollowing?'btn-following':'btn-follow'}" onclick="toggleFollow('\${targetEmail}')">\${data.isFollowing?'Following':'Follow'}</button><button class="btn-action" onclick="backToMy()">Kembali ke Akunku</button>\`}</div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='tulis'?'active':''}" onclick="switchTab('tulis')">TULIS</button>
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchTab('video')">VIDEO</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchTab('teman')">TEMAN</button>
      </div>
      <div id="tabContent" class="content-area"></div>
    </div>
  \`;
  loadContent(targetEmail,isMe);
}
function editProfil(){ const n=prompt("Nama baru:",getMyName()); if(n===null) return; if(n.trim()) updateProfileData(n.trim(),null); if(confirm("Ganti foto profil juga?")) triggerGallery(); }
function switchTab(t){ activeMainTab=t; render(); }
function backToMy(){ viewingUserEmail=null; history.pushState(null,'','/akun'); render(); }
function viewUser(e){ viewingUserEmail=e; history.pushState(null,'','/akun?profil='+encodeURIComponent(e)); render(); }

function getPrivateKey(type,email){ return 'rg_private_'+type+'_'+email.toLowerCase(); }
function getPrivateList(type,email){ try{ return JSON.parse(localStorage.getItem(getPrivateKey(type,email))||"[]"); }catch(e){return [];} }
function savePrivateList(type,email,list){ localStorage.setItem(getPrivateKey(type,email), JSON.stringify(list)); }

function addPrivateFoto(email){
  const picker=document.getElementById('privateFotoPicker');
  picker.onchange=(ev)=>{
    const f=ev.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement('canvas'); const MAX=1000; let w=img.width,h=img.height;
        if(w>MAX||h>MAX){ if(w>h){h*=MAX/w;w=MAX;}else{w*=MAX/h;h=MAX;} }
        c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
        const dataUrl=c.toDataURL('image/jpeg',0.8);
        let list=getPrivateList('foto',email);
        list.unshift({id:Date.now(),data:dataUrl,time:Date.now()});
        savePrivateList('foto',email,list);
        loadContent(email,true);
      };
      img.src=e.target.result;
    };
    r.readAsDataURL(f);
    picker.value='';
  };
  picker.click();
}
function addPrivateVideo(email){
  const picker=document.getElementById('privateVideoPicker');
  picker.onchange=(ev)=>{
    const f=ev.target.files[0]; if(!f) return;
    if(f.size>50*1024*1024){alert("Video max 50MB Bos, ini buat pribadi di dalam akun aja!");return;}
    const r=new FileReader();
    r.onload=e=>{
      let list=getPrivateList('video',email);
      list.unshift({id:Date.now(),data:e.target.result,time:Date.now(),name:f.name});
      savePrivateList('video',email,list);
      loadContent(email,true);
    };
    r.readAsDataURL(f);
    picker.value='';
  };
  picker.click();
}
function delPrivate(type,email,id){ if(!confirm("Hapus Bos?")) return; let list=getPrivateList(type,email); list=list.filter(x=>x.id!==id); savePrivateList(type,email,list); loadContent(email,true); }

async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='teman'){
    box.innerHTML='<div style="text-align:center;color:#666">Memuat teman...</div>';
    try{ let res=await fetch('/api/akun/list'); let users=await res.json(); if(!users.length){box.innerHTML='<div class="empty-box">Belum ada teman</div>';return;} box.innerHTML=users.map(u=>\`<div class="user-item"><div class="user-info" onclick="viewUser('\${u.email}')"><img src="\${u.picture||LOGO_DEFAULT}" class="user-avatar"><div><div style="font-weight:800;font-size:13px">\${u.name}</div><div style="font-size:11px;color:#777">\${u.email}</div></div></div><button class="btn-action btn-follow" style="padding:6px 12px;font-size:11px" onclick="viewUser('\${u.email}')">Lihat</button></div>\`).join(''); }catch(e){box.innerHTML='<div class="empty-box">Gagal</div>';}
  } else if(activeMainTab==='tulis'){
    box.innerHTML='<div style="text-align:center;color:#666">Memuat tulisan...</div>';
    try{
      let r=await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)); let posts=await r.json(); let list=Array.isArray(posts)?posts:(posts.results||[]); let mine=list.filter(p=>(p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase());
      if(!mine.length){box.innerHTML='<div class="empty-box">Belum ada tulisan dari '+targetEmail+'</div>';return;}
      box.innerHTML=mine.map(p=>\`<div class="private-card"><div style="font-size:13px;white-space:pre-wrap">\${(p.text||p.isi||'').replace(/</g,'&lt;')}</div>\${(p.tulisImg||p.img)?'<img src="'+(p.tulisImg||p.img)+'" style="margin-top:8px;border-radius:10px;width:100%">':''}<div class="private-time">\${new Date(Number(p.time||p.created_at||Date.now())).toLocaleString('id-ID')}</div></div>\`).join('');
    }catch(e){box.innerHTML='<div class="empty-box">Gagal memuat tulisan</div>';}
  } else if(activeMainTab==='foto'){
    let list=getPrivateList('foto',targetEmail);
    let html = '';
    if(isMe){ html += \`<button class="btn-add-private" onclick="addPrivateFoto('\${targetEmail}')">+ Tambah Foto Pribadi (hanya di dalam akun)</button>\`; }
    if(!list.length){ html += \`<div class="empty-box">Belum ada foto pribadi.<br><span style="font-size:11px;color:#555">Foto ini tidak akan muncul di menu Foto global, hanya di akun ini saja Bos.</span></div>\`; }
    else { html += list.map(x=>\`<div class="private-card">\${isMe?'<button class="del-mini" onclick="delPrivate(\\'foto\\',\\''+targetEmail+'\\','+x.id+')">Hapus</button>':''}<img src="\${x.data}"><div class="private-time">\${new Date(x.time).toLocaleString('id-ID')} - Pribadi</div></div>\`).join(''); }
    box.innerHTML=html;
  } else if(activeMainTab==='video'){
    let list=getPrivateList('video',targetEmail);
    let html='';
    if(isMe){ html += \`<button class="btn-add-private" onclick="addPrivateVideo('\${targetEmail}')">+ Tambah Video Pribadi (hanya di dalam akun)</button>\`; }
    if(!list.length){ html += \`<div class="empty-box">Belum ada video pribadi.<br><span style="font-size:11px;color:#555">Video ini tidak akan muncul di menu Video global, hanya di akun ini saja Bos.</span></div>\`; }
    else { html += list.map(x=>\`<div class="private-card">\${isMe?'<button class="del-mini" onclick="delPrivate(\\'video\\',\\''+targetEmail+'\\','+x.id+')">Hapus</button>':''}<video controls src="\${x.data}"></video><div class="private-time">\${new Date(x.time).toLocaleString('id-ID')} - Pribadi</div></div>\`).join(''); }
    box.innerHTML=html;
  }
}
async function toggleFollow(t){ const my=getMyEmail(); if(!my){alert("Login dulu");return;} try{await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:my,following:t})});}catch(e){} render(); }
render();
<\/script>
</body>
</html>
`;
