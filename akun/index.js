export const AKUN_HTML = `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun - Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:85px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,.35)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:40px;height:40px;border-radius:50%;border:2px solid #00ff88;object-fit:cover;box-shadow:0 0 10px #00ff88}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 20px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer}

/* LOGIN - LOGO JADI GEDE BOS */
.cardOuter{margin:12px;border-radius:22px;background:#fff;color:#000;padding:16px 14px;box-shadow:0 0 0 2px #00ff88,0 0 20px #00ff88}
.tabsLogin{display:flex;gap:8px;margin-bottom:12px}
.tabsLogin button{flex:1;padding:10px;border-radius:12px;border:0;font-weight:700;font-size:13px}
.tabsLogin button.on{background:#000;color:#fff}.tabsLogin button.off{background:#eee;color:#333}
.inp{width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px;border-radius:12px;margin-top:10px;font-size:14px;color:#000}
.btnMasuk{width:100%;margin-top:12px;background:#000;color:#fff;border:0;padding:14px;border-radius:12px;font-weight:800;font-size:15px}
.cardLogo{margin:14px 12px;border-radius:26px;overflow:hidden;position:relative;height:460px;background:#000;border:3px solid #00ff88;box-shadow:0 0 0 1px #00ff88,0 0 25px #00ff88;display:grid;place-items:center}
.cardLogo .brick{position:absolute;inset:0;background:radial-gradient(circle at center, rgba(0,255,136,.15) 0%, rgba(0,0,0,1) 70%)}
.cardLogo .rgWrap{position:relative;z-index:2;width:92%;height:92%;border-radius:50%;border:3px solid #00ff88;box-shadow:0 0 25px #00ff88,0 0 60px rgba(0,255,136,.6);display:grid;place-items:center;background:#000;padding:0;overflow:hidden}
.cardLogo .rgWrap img{width:100%;height:100%;object-fit:cover;filter:drop-shadow(0 0 12px #00ff88)}
.cardLogo .buka{position:absolute;bottom:18px;z-index:3;color:#fff;font-size:13px;background:rgba(0,0,0,.7);padding:6px 14px;border-radius:20px;border:1px solid #00ff88}

/* PROFIL */
.profile-sec{padding:18px 14px 10px}
.prof-top{display:flex;align-items:center;gap:18px;margin-bottom:14px}
.avatar-wrap{position:relative;width:78px;height:78px}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,.5)}
.avatar-badge{position:absolute;bottom:-2px;right:-2px;background:#fff;color:#000;border-radius:50%;width:24px;height:24px;display:grid;place-items:center;font-weight:bold;font-size:16px;border:1.5px solid #000;cursor:pointer}
.stats-wrap{flex:1;display:flex;justify-content:space-between;text-align:center}
.stat-num{font-size:20px;font-weight:900}.stat-label{font-size:11px;color:#777}
.name-display{font-size:18px;font-weight:900}.email-display{font-size:12px;color:#00ff88;margin-bottom:14px}
.btn-edit-keluar{display:flex;gap:8px}
.btn-edit{flex:1;padding:13px;background:#222;color:#fff;border:1px solid #333;border-radius:12px;font-weight:700}
.btn-keluar{flex:1;padding:13px;background:#1a1a1a;color:#ff4d4d;border:1px solid #331111;border-radius:12px;font-weight:800}
.main-tabs{display:flex;gap:8px;margin:16px 0;border-bottom:1px solid #222;padding-bottom:14px}
.m-tab{flex:1;padding:12px;border-radius:12px;background:#2a2a2a;color:#888;text-align:center;font-weight:800;font-size:12px;cursor:pointer;border:1px solid #333}
.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88;box-shadow:0 0 12px rgba(0,255,136,.5)}

/* FOTO 2x2 */
.btn-add-private{width:100%;background:#000;border:2px dashed #00ff88;color:#00ff88;padding:16px;border-radius:16px;font-weight:900;margin-bottom:12px;cursor:pointer;font-size:14px}
.photo-grid-2x2{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px}
.photo-card{position:relative;border-radius:16px;overflow:hidden;background:#111;border:1px solid #222;aspect-ratio:1/1}
.photo-card img{width:100%;height:100%;object-fit:cover;display:block}
.photo-del{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.8);color:#fff;border:none;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:14px;border:1px solid #444}
.btn-save-foto{width:100%;background:#00ff88;color:#000;border:none;padding:15px;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 15px rgba(0,255,136,.5);margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-save-foto:disabled{opacity:.5}
.private-card{background:#111;border:1px solid #222;border-radius:16px;padding:8px;margin-bottom:12px}

.user-fb{display:flex;gap:12px;background:#0f0f0f;padding:12px;border-radius:14px;margin-bottom:12px;border:1px solid #222}
.user-fb-av{width:60px;height:60px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
#toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#00ff88;color:#000;padding:12px 18px;border-radius:22px;font-weight:900;font-size:13px;display:none;z-index:9999;box-shadow:0 0 20px #00ff88}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<input type="file" id="filePicker" accept="image/*" style="display:none">
<input type="file" id="privateFotoPicker" accept="image/*" multiple style="display:none">
<input type="file" id="privateVideoPicker" accept="video/*" style="display:none">
<div class="bot"><a href="/">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a></div>
<div id=toast></div>
<script>
const LOGO_DEFAULT="https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
let activeMainTab="foto", viewingUserEmail=null;
function toast(m){let t=document.getElementById('toast');t.innerText=m;t.style.display='block';setTimeout(()=>t.style.display='none',3000);}
const getEmail=()=> (localStorage.getItem('rg_email')||"").toLowerCase().trim();
const getName=()=> localStorage.getItem('rg_name')||"Dunsanak";
const getAvatar=()=> localStorage.getItem('rg_avatar')||LOGO_DEFAULT;
const getPrivateKey=(t,e)=>'rg_private_'+t+'_'+e.toLowerCase();
const getPrivateList=(t,e)=>{try{return JSON.parse(localStorage.getItem(getPrivateKey(t,e))||"[]")}catch{return[]}};
const savePrivateList=(t,e,l)=>{localStorage.setItem(getPrivateKey(t,e),JSON.stringify(l));};
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n||"Dunsanak");localStorage.setItem('rg_avatar',a||LOGO_DEFAULT);}
function logout(){if(confirm("Keluar?")){localStorage.removeItem('rg_email');localStorage.removeItem('rg_name');localStorage.removeItem('rg_avatar');location.reload();}}
function triggerGallery(){document.getElementById('filePicker').click();}
document.getElementById('filePicker').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=ev=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); let w=img.width,h=img.height; const MAX=800; if(w>h){if(w>MAX){h*=MAX/w;w=MAX}}else{if(h>MAX){w*=MAX/h;h=MAX}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h); const url=c.toDataURL('image/jpeg',0.8); saveAuth(getEmail(),getName(),url); toast('Foto profil disimpan!'); render(); }; img.src=ev.target.result; }; r.readAsDataURL(f);
});

let loginMode='masuk';
function render(){
  const my=getEmail(), cont=document.getElementById('viewContainer');
  if(!my){cont.innerHTML=\`
<div style="margin:12px;border-radius:22px;background:#fff;color:#000;padding:16px 14px;box-shadow:0 0 0 2px #00ff88,0 0 20px #00ff88">
<div style="font-size:22px;font-weight:800;margin-bottom:12px">Rumah Gadang AI</div>
<div style="display:flex;gap:8px;margin-bottom:12px"><button onclick="loginMode='masuk';render()" style="flex:1;padding:10px;border-radius:12px;border:0;font-weight:700;background:\${loginMode==='masuk'?'#000;color:#fff':'#eee'}">Masuk</button><button onclick="loginMode='buat';render()" style="flex:1;padding:10px;border-radius:12px;border:0;font-weight:700;background:\${loginMode==='buat'?'#000;color:#fff':'#eee'}">Buat Akun</button><button style="flex:1;padding:10px;border-radius:12px;border:0;background:#eee">Google</button></div>
<input id="emailIn" style="width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px;border-radius:12px" placeholder="lintas@rumahgadang-ai.my.id" value="lintas@rumahgadang-ai.my.id">
<input id="passIn" type="password" style="width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px;border-radius:12px;margin-top:10px" placeholder="••••••••">
<input id="nameIn" style="width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px;border-radius:12px;margin-top:10px;display:\${loginMode==='buat'?'block':'none'}" placeholder="Nama Dunsanak">
<button onclick="doLogin()" style="width:100%;margin-top:12px;background:#000;color:#fff;border:0;padding:14px;border-radius:12px;font-weight:800">\${loginMode==='masuk'?'Masuk':'Buat Akun'}</button>
<div style="font-size:11px;color:#666;margin-top:8px;text-align:center">Masuk untuk lanjut Bos</div>
</div>
<div style="margin:14px 12px;border-radius:26px;overflow:hidden;position:relative;height:460px;background:#000;border:3px solid #00ff88;box-shadow:0 0 25px #00ff88;display:grid;place-items:center">
<div style="position:absolute;inset:0;background:radial-gradient(circle at center, rgba(0,255,136,.18) 0%, rgba(0,0,0,1) 70%)"></div>
<div style="position:relative;z-index:2;width:92%;height:92%;border-radius:50%;border:3px solid #00ff88;box-shadow:0 0 25px #00ff88;overflow:hidden;background:#000;display:grid;place-items:center"><img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" style="width:100%;height:100%;object-fit:cover"></div>
<div style="position:absolute;bottom:18px;z-index:3;color:#fff;font-size:13px;background:rgba(0,0,0,.7);padding:6px 14px;border-radius:20px;border:1px solid #00ff88">Buka situs web</div>
</div>\`;return;}
  const target=viewingUserEmail||my; const isMe=target===my; renderProfile(cont,target,isMe);
}
async function doLogin(){let e=document.getElementById('emailIn').value.trim().toLowerCase(); if(!e.includes('@')) e+='@rumahgadang-ai.my.id'; let n=document.getElementById('nameIn')?.value.trim()||e.split('@')[0]; try{await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,name:n,picture:LOGO_DEFAULT})});}catch{} saveAuth(e,n,LOGO_DEFAULT); render();}
function editProfil(){const n=prompt("Nama baru:",getName()); if(n) {saveAuth(getEmail(),n.trim(),getAvatar()); fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getEmail(),name:n.trim(),picture:getAvatar()})}).catch(()=>{}); render();}}
function switchTab(t){activeMainTab=t; const me=viewingUserEmail||getEmail(); loadContent(me,me===getEmail()); document.querySelectorAll('.m-tab').forEach((b,i)=>{const tabs=['tulis','foto','video','teman']; b.classList.toggle('active',tabs[i]===t);});}
function viewUser(e){viewingUserEmail=e; activeMainTab='tulis'; render();}

async function renderProfile(container,targetEmail,isMe){
  container.innerHTML='<div style="text-align:center;padding:40px;color:#666">Memuat...</div>';
  let data={name:isMe?getName():targetEmail.split('@')[0],picture:isMe?getAvatar():LOGO_DEFAULT,posts:0,followers:0,following:0};
  try{let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getEmail())+'&t='+Date.now()); if(r.ok){let d=await r.json(); data={...data,...d};}}catch{}
  const fotoCount=getPrivateList('foto',targetEmail).length;
  data.posts=fotoCount;
  container.innerHTML=\`
    <div class="profile-sec">
      <div class="prof-top"><div class="avatar-wrap"><img src="\${data.picture}" class="avatar-img"><div class="avatar-badge" onclick="\${isMe?'triggerGallery()':''}">+</div></div><div class="stats-wrap"><div><div class="stat-num">\${data.posts}</div><div class="stat-label">postingan</div></div><div><div class="stat-num">\${data.followers||0}</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">\${data.following||0}</div><div class="stat-label">mengikuti</div></div></div></div>
      <div class="name-display">\${data.name}</div><div class="email-display">\${targetEmail}</div>
      <div class="action-bar">\${isMe?'<div class="btn-edit-keluar"><button class="btn-edit" onclick="editProfil()">Edit profil</button><button class="btn-keluar" onclick="logout()">Keluar</button></div>':'<button style="width:100%;padding:14px;background:#00ff88;color:#000;border:0;border-radius:14px;font-weight:900" onclick="toggleFollow(\\''+targetEmail+'\\')">Follow</button>'}</div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='tulis'?'active':''}" onclick="switchTab('tulis')">TULIS</button>
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchTab('video')">VIDEO</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchTab('teman')">TEMAN</button>
      </div>
      <div id="tabContent"></div>
    </div>\`; loadContent(targetEmail,isMe);
}
async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='foto'){
    let list=getPrivateList('foto',targetEmail);
    let h=''; if(isMe) h+='<button class="btn-add-private" onclick="addPrivateFoto(\\''+targetEmail+'\\')">+ Tambah Foto Pribadi (max 12)</button>';
    if(!list.length){ h+='<div style="text-align:center;padding:40px;color:#555">Belum ada foto pribadi<br><span style="font-size:12px">Tambah sampai 12 foto - 2 kolom</span></div>'; }
    else {
      h+='<div class="photo-grid-2x2">'+list.map((x,i)=>'<div class="photo-card"><img src="'+x.data+'"><button class="photo-del" onclick="delFoto(\\''+targetEmail+'\\','+i+')">✕</button></div>').join('')+'</div>';
      if(isMe) h+='<button class="btn-save-foto" onclick="saveFotoToD1(\\''+targetEmail+'\\')">💾 SIMPAN FOTO ('+list.length+'/12) KE D1</button>';
    }
    box.innerHTML=h;
  } else if(activeMainTab==='teman'){
    box.innerHTML='<div style="font-weight:800;margin:8px 0 12px">Orang yang mungkin Anda kenal</div><div style="text-align:center;color:#555">Memuat...</div>';
    try{let r=await fetch('/api/akun/list?t='+Date.now()); let u=await r.json(); let final=(Array.isArray(u)?u:[]).filter(x=>x.email.toLowerCase()!==getEmail()); box.innerHTML=final.map(x=>'<div class="user-fb"><img src="'+(x.picture||LOGO_DEFAULT)+'" class="user-fb-av"><div style="flex:1"><div style="font-weight:800">'+(x.name||x.email)+'</div><div style="font-size:11px;color:#666">'+x.email+'</div><div style="display:flex;gap:6px;margin-top:8px"><button onclick="toggleFollow(\\''+x.email+'\\')" style="flex:1;background:#00ff88;color:#000;border:0;padding:10px;border-radius:10px;font-weight:900">Tambah jadi teman</button><button onclick="viewUser(\\''+x.email+'\\')" style="flex:1;background:#222;color:#aaa;border:0;padding:10px;border-radius:10px">Lihat</button></div></div></div>').join('');}catch(e){box.innerHTML='<div>Error</div>';}
  } else { box.innerHTML='<div style="text-align:center;padding:40px;color:#555">Belum ada konten</div>'; }
}
function addPrivateFoto(email){
  const p=document.getElementById('privateFotoPicker');
  p.onchange=ev=>{
    const files=Array.from(ev.target.files||[]); if(!files.length) return;
    let list=getPrivateList('foto',email);
    const sisa=12-list.length;
    if(files.length>sisa){ toast('Maks 12! Sisa '+sisa); }
    const take=files.slice(0,sisa);
    let done=0;
    take.forEach(f=>{
      const r=new FileReader();
      r.onload=e=>{
        const img=new Image(); img.onload=()=>{
          const c=document.createElement('canvas'); let w=img.width,h=img.height; const MAX=900; if(w>MAX||h>MAX){ if(w>h){h*=MAX/w;w=MAX}else{w*=MAX/h;h=MAX}} c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
          const url=c.toDataURL('image/jpeg',0.6);
          list=getPrivateList('foto',email); list.push({id:Date.now()+Math.random(),data:url}); savePrivateList('foto',email,list);
          done++; if(done===take.length){ toast(done+' foto ditambah, klik SIMPAN!'); loadContent(email,true); }
        }; img.src=e.target.result;
      }; r.readAsDataURL(f);
    }); p.value='';
  }; p.click();
}
function delFoto(email,idx){ if(!confirm('Hapus foto ini?')) return; let l=getPrivateList('foto',email); l.splice(idx,1); savePrivateList('foto',email,l); toast('Foto dihapus, jangan lupa SIMPAN'); loadContent(email,true); }
async function saveFotoToD1(email){
  let list=getPrivateList('foto',email);
  if(!list.length) return toast('Belum ada foto');
  const btn=document.querySelector('.btn-save-foto'); if(btn){btn.innerText='⏳ Menyimpan...'; btn.disabled=true;}
  try{
    const res=await fetch('/api/akun/photos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email, photos:list.map(x=>x.data), count:list.length, table:'d1consule'})});
    const j=await res.json().catch(()=>({ok:true}));
    toast('✅ '+list.length+' foto disimpan ke D1 consule!');
    setTimeout(()=>render(),600);
  }catch(e){ toast('Gagal simpan: '+e.message); if(btn){btn.innerText='💾 SIMPAN FOTO ('+list.length+'/12) KE D1'; btn.disabled=false;}}
}
async function toggleFollow(t){try{await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:getEmail(),following:t})}); toast('Follow OK'); render();}catch(e){toast('Gagal');}}
render();
<\/script></body></html>`;

export default AKUN_HTML;
