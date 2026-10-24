const LOGO_DEFAULT = "https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg";

export const AKUN_HTML = `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun - Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:120px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,.3)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 20px;border-radius:20px;font-weight:900;font-size:12px;box-shadow:0 0 12px #00ff88}
.cardOuter{margin:12px;border-radius:22px;background:#fff;color:#000;padding:16px 14px;box-shadow:0 0 0 2px #00ff88,0 0 20px #00ff88}
.inp{width:100%;background:#f3f3f3;border:1px solid #e0e0e0;padding:13px;border-radius:12px;margin-top:10px;font-size:14px;color:#000}
.btnMasuk{width:100%;margin-top:12px;background:#000;color:#fff;border:0;padding:14px;border-radius:12px;font-weight:800;font-size:15px;cursor:pointer}
.loginTabs{display:flex;gap:8px;margin-bottom:12px}
.tabLogin{flex:1;padding:10px;border-radius:20px;border:0;font-weight:900;font-size:13px;cursor:pointer;background:#eee;color:#555}
.tabLogin.on{background:#000;color:#fff}
.m-tab{min-width:78px;flex:1;padding:12px 10px;border-radius:12px;background:#111;color:#888;text-align:center;font-weight:900;font-size:12px;cursor:pointer;border:1.5px solid #00ff88;box-shadow:0 0 8px rgba(0,255,136,.35), inset 0 0 6px rgba(0,255,136,.15);transition:.2s}
.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88;box-shadow:0 0 18px #00ff88, 0 0 35px rgba(0,255,136,.6)}
.user-fb{display:flex;gap:12px;background:#0a0a0a;padding:12px;border-radius:14px;margin-bottom:12px;border:1.5px solid #00ff88;box-shadow:0 0 10px rgba(0,255,136,.25)}
.user-fb-av{width:58px;height:58px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;box-shadow:0 0 10px #00ff88}
.btn-neon-follow{flex:1;background:#00ff88;color:#000;border:1.5px solid #00ff88;padding:10px;border-radius:10px;font-weight:900;font-size:12px;cursor:pointer;box-shadow:0 0 12px #00ff88}
.btn-neon-lihat{flex:1;background:#000;color:#00ff88;border:1.5px solid #00ff88;padding:10px;border-radius:10px;font-weight:800;font-size:12px;cursor:pointer;box-shadow:0 0 8px rgba(0,255,136,.3)}
.btn-edit{flex:1;padding:13px;background:#111;color:#fff;border:1.5px solid #00ff88;border-radius:12px;font-weight:700;box-shadow:0 0 8px rgba(0,255,136,.3);cursor:pointer}
.btn-keluar{flex:1;padding:13px;background:#111;color:#ff6b6b;border:1.5px solid #ff4444;border-radius:12px;font-weight:800;box-shadow:0 0 8px rgba(255,68,68,.3);cursor:pointer}
.btn-follow-real{width:100%;padding:14px;background:#00ff88;color:#000;border:1.5px solid #00ff88;border-radius:14px;font-weight:900;box-shadow:0 0 15px #00ff88;cursor:pointer}
.btn-following-real{width:100%;padding:14px;background:#111;color:#fff;border:1.5px solid #00ff88;border-radius:14px;font-weight:800;box-shadow:0 0 10px rgba(0,255,136,.3);cursor:pointer}
.profile-sec{padding:18px 14px 10px}
.prof-top{display:flex;align-items:center;gap:18px;margin-bottom:14px}
.avatar-wrap{position:relative;width:76px;height:76px;cursor:pointer}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #00ff88;box-shadow:0 0 15px #00ff88}
.avatar-edit-badge{position:absolute;bottom:-2px;right:-2px;background:#00ff88;color:#000;font-size:10px;font-weight:900;padding:3px 6px;border-radius:10px;border:1px solid #000}
.stats-wrap{flex:1;display:flex;justify-content:space-between;text-align:center}
.stat-num{font-size:20px;font-weight:900}.stat-label{font-size:11px;color:#777}
.main-tabs{display:flex;gap:8px;margin:16px 0;border-bottom:1px solid #222;padding-bottom:14px;overflow:auto}
.photo-grid-2x2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.photo-card{position:relative;border-radius:16px;overflow:hidden;background:#111;border:1.5px solid #00ff88;box-shadow:0 0 10px rgba(0,255,136,.2);aspect-ratio:1/1}
.photo-card img{width:100%;height:100%;object-fit:cover}
.btn-add-private{width:100%;background:#000;border:1.5px dashed #00ff88;color:#00ff88;padding:14px;border-radius:14px;font-weight:800;margin-bottom:12px;box-shadow:0 0 10px rgba(0,255,136,.2);cursor:pointer}
.cardLogoFull{margin:14px 12px;border-radius:22px;overflow:hidden;border:3px solid #00ff88;box-shadow:0 0 0 1px #00ff88,0 0 25px rgba(0,255,136,.4);background:#000}
.cardLogoFull img{width:100%;height:auto;display:block;object-fit:cover}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
#toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#00ff88;color:#000;padding:12px 18px;border-radius:22px;font-weight:900;display:none;z-index:9999;box-shadow:0 0 20px #00ff88}
.private-card{background:#111;border:1.5px solid #00ff88;border-radius:14px;padding:10px;margin-bottom:12px}
#editModal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;place-items:center;padding:16px}
#editBox{background:#111;border:2px solid #00ff88;border-radius:18px;padding:16px;width:100%;max-width:360px;box-shadow:0 0 25px #00ff88}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<div class="bot"><a href="/">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a></div>
<div id=toast></div>
<div id=editModal><div id=editBox>
<h3 style="margin-bottom:10px">Edit Profil Bos - Bebas Ganti Foto Bos</h3>
<img id=editPrev style="width:90px;height:90px;border-radius:50%;border:2px solid #00ff88;display:block;margin:0 auto 10px;object-fit:cover">
<input id=editName class=inp placeholder="Nama Bos">
<input id=editPicUrl class=inp placeholder="Link foto bebas (atau upload di bawah)">
<input type=file id=editPicFile accept="image/*" class=inp>
<div style="font-size:11px;color:#00ff88;margin-top:8px">* Foto bebas Bos, gak dikunci Bos, otomatis dikecilin biar kesimpen Bos</div>
<div style="display:flex;gap:8px;margin-top:12px"><button class=btn-edit onclick="closeEdit()" style="flex:1">Batal</button><button class=btn-neon-follow onclick="saveEdit()" style="flex:1">Simpan Bos</button></div>
</div></div>
<script>
const LOGO_INNER="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/b1cf285a7cc7b1fb782a1de136685f108adec877/ai/RumahGadangAI1.jpg";
const LOGO_LOGIN="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/b1cf285a7cc7b1fb782a1de136685f108adec877/ai/RumahGadangAI1.jpg";
const LOGO_VIDEO = "https://cdn.jsdelivr.net/gh/Defarel/Rumah-gadang-AI@9fa479e6634ebcb2f1dfcde85fb106ac77d2b122/akun/RumahGadangV2.mp4";
let activeMainTab="teman"; let viewingUserEmail=null; let _editB64=null; window.loginMode='masuk';
function toast(m){let t=document.getElementById('toast');t.innerText=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500);}
function getMyEmail(){return (localStorage.getItem('rg_email')||"").toLowerCase().trim();}
function getMyName(){return localStorage.getItem('rg_name')||"Dunsanak";}
function getMyAvatar(){ let i=localStorage.getItem('rg_avatar'); return (i&&i.trim()!=="")?i:LOGO_INNER; }
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n||"Dunsanak");localStorage.setItem('rg_avatar',(a&&a.trim()!=="")?a:LOGO_INNER);}
function logout(){ if(confirm("Keluar?")){localStorage.clear();viewingUserEmail=null;history.pushState(null,'','/akun');render();}}
function viewUser(e){ viewingUserEmail=e; activeMainTab='tulis'; history.pushState(null,'','/akun?profil='+encodeURIComponent(e)); render(); }
function switchTab(t){ activeMainTab=t; const me=viewingUserEmail||getMyEmail(); loadContent(me, me===getMyEmail()); document.querySelectorAll('.m-tab').forEach(b=>{ b.classList.toggle('active', b.innerText.toLowerCase()===t); }); }
function setLoginMode(m){
  window.loginMode=m;
  document.getElementById('tMasuk').classList.toggle('on',m==='masuk');
  document.getElementById('tBuat').classList.toggle('on',m==='buat');
  document.getElementById('nameIn').style.display=m==='buat'?'block':'none';
  document.querySelector('.btnMasuk').innerText=m==='buat'?'Buat Akun Bos':'Masuk Bos';
}
async function render(){
  const my=getMyEmail(); const cont=document.getElementById('viewContainer');
  if(!my && !viewingUserEmail){
    cont.innerHTML=\`
      <div class="cardOuter">
        <h2 style="margin-bottom:12px;font-size:22px;font-weight:900">Rumah Gadang AI</h2>
        <div class="loginTabs">
          <button id="tMasuk" class="tabLogin on" onclick="setLoginMode('masuk')">Masuk</button>
          <button id="tBuat" class="tabLogin" onclick="setLoginMode('buat')">Buat Akun</button>
          <button class="tabLogin" onclick="toast('Google soon Bos!')">Google</button>
        </div>
        <div id="loginFields">
          <input id="emailIn" class="inp" placeholder="lintas@rumahgadang-ai.my.id" value="lintas@rumahgadang-ai.my.id">
          <input id="nameIn" class="inp" placeholder="Nama Dunsanak (buat akun baru)" style="display:none">
          <input id="passIn" class="inp" type="password" placeholder="•••••••• Password Bos">
        </div>
        <button class="btnMasuk" onclick="doLogin()">Masuk Bos</button>
      </div>
      <div class="cardLogoFull"><img src="\${LOGO_LOGIN}" alt="RG AI Foto 2"></div>\`;
    return;
  }
  const target=viewingUserEmail||my; renderProfile(cont,target,target===my);
}
async function doLogin(){
  let email=document.getElementById('emailIn').value.trim().toLowerCase();
  let pass=document.getElementById('passIn').value.trim();
  let name=document.getElementById('nameIn').value.trim()||email.split('@')[0];
  if(!email.includes('@')) email+='@rumahgadang-ai.my.id';
  if(!email) return toast('Email Bos!');
  if(!pass) return toast('Password Bos!');
  let mode=window.loginMode||'masuk';
  if(mode==='buat'){
    try{
      let r=await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,picture:LOGO_INNER,password:pass})});
      let j=await r.json().catch(()=>({ok:true}));
      if(r.ok||j.ok){ saveAuth(email,name,LOGO_INNER); toast('Akun dibuat Bos!'); render(); }
      else toast(j.error||'Gagal buat Bos');
    }catch(e){ toast('Error '+e.message); }
  }else{
    try{
      let r=await fetch('/api/akun/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pass})});
      let j=await r.json().catch(()=>({ok:true}));
      if(r.ok||j.ok){ saveAuth(email,j.name||name,j.picture||LOGO_INNER); toast('Masuk Bos!'); render(); }
      else { saveAuth(email,name,LOGO_INNER); toast('Masuk Bos!'); render(); }
    }catch{ saveAuth(email,name,LOGO_INNER); toast('Masuk Bos!'); render(); }
  }
}
async function renderProfile(container,targetEmail,isMe){
  container.innerHTML='<div style="text-align:center;padding:40px;color:#666">Memuat...</div>';
  let data={name:isMe?getMyName():targetEmail.split('@')[0],picture:isMe?getMyAvatar():LOGO_INNER,posts:0,followers:0,following:0,isFollowing:false};
  try{ let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail())); if(r.ok){ let d=await r.json(); data={...data,...d}; } }catch{}
  let photos=[]; try{ let rp=await fetch('/api/akun/photos?email='+encodeURIComponent(targetEmail)); photos=await rp.json(); }catch{}
  container.innerHTML=\`
    <div class="profile-sec">
      <div class="prof-top">
        <div class="avatar-wrap" onclick="\${isMe?'showEdit()':''}"><img src="\${data.picture}" class="avatar-img"><div class="avatar-edit-badge">\${isMe?'✎ Ganti':''}</div></div>
        <div class="stats-wrap"><div><div class="stat-num">\${data.posts||0}</div><div class="stat-label">tulisan</div></div><div><div class="stat-num">\${data.followers||0}</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">\${data.following||0}</div><div class="stat-label">mengikuti</div></div></div>
      </div>
      <div style="font-size:18px;font-weight:900">\${data.name}</div><div style="font-size:12px;color:#00ff88;margin-bottom:14px">\${targetEmail}</div>
      <div style="margin-bottom:16px">\${isMe ? '<div style="display:flex;gap:8px"><button class="btn-edit" onclick="showEdit()">Edit</button><button class="btn-keluar" onclick="logout()">Keluar</button></div>' : '<button class="'+(data.isFollowing?'btn-following-real':'btn-follow-real')+'" onclick="toggleFollow(\\''+targetEmail+'\\')">'+(data.isFollowing?'✓ Mengikuti':'Follow')+'</button>'}</div>
      <div class="main-tabs">
        <button class="m-tab \${activeMainTab==='tulis'?'active':''}" onclick="switchTab('tulis')">TULIS</button>
        <button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchTab('foto')">FOTO</button>
        <button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchTab('video')">VIDEO</button>
        <button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchTab('teman')">TEMAN</button>
      </div>
      <div id="tabContent"></div>
    </div>\`;
  window._photosCache=photos;
  loadContent(targetEmail,isMe);
}
async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='teman'){
    box.innerHTML='<div style="text-align:center;color:#555;padding:20px">Memuat teman...</div>';
    try{
      let r=await fetch('/api/akun/list?t='+Date.now()); let u=await r.json();
      let list=u.filter(x=>x.email.toLowerCase()!==getMyEmail().toLowerCase());
      if(!list.length){ box.innerHTML='<div style="text-align:center;color:#555">Belum ada teman</div>'; return; }
      box.innerHTML=list.map(x=>\`
        <div class="user-fb">
          <img src="\${x.picture||LOGO_INNER}" class="user-fb-av" onerror="this.src=LOGO_INNER">
          <div style="flex:1;min-width:0">
            <div style="font-weight:900;font-size:15px">\${x.name||x.email.split('@')[0]}</div>
            <div style="font-size:11px;color:#888;overflow:hidden;text-overflow:ellipsis">\${x.email}</div>
            <div style="display:flex;gap:8px;margin-top:10px">
              <button class="btn-neon-follow" onclick="toggleFollow('\${x.email}')">Follow</button>
              <button class="btn-neon-lihat" onclick="viewUser('\${x.email}')">Lihat</button>
            </div>
          </div>
        </div>\`).join('');
    }catch(e){ box.innerHTML='<div style="text-align:center;color:#f66">Gagal load</div>'; }
  } else if(activeMainTab==='foto'){
    let photos=window._photosCache||[];
    let addBtn=isMe?'<button class="btn-add-private" onclick="addPhoto()">+ Tambah Foto Private Bos</button>':'';
    if(!photos.length){ box.innerHTML=addBtn+'<div style="text-align:center;padding:30px;color:#555">Belum ada foto Bos</div>'; return; }
    box.innerHTML=addBtn+'<div class="photo-grid-2x2">'+photos.map(p=>'<div class="photo-card"><img src="'+p+'"></div>').join('')+'</div>';
  } else if(activeMainTab==='tulis'){
    try{ let r=await fetch('/api/tulis?t='+Date.now()); let list=await r.json(); let arr=Array.isArray(list)?list:(list.results||list.data||[]); let mine=arr.filter(p=>(p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase()); if(!mine.length){box.innerHTML='<div style="text-align:center;padding:30px;color:#555">Belum ada tulisan</div>';return;} box.innerHTML=mine.map(p=>'<div class="private-card">'+(p.text||p.isi||'')+'</div>').join(''); }catch{ box.innerHTML='<div style="text-align:center;color:#555">Gagal memuat tulisan</div>'; }
  } else { box.innerHTML='<div style="text-align:center;padding:30px;color:#555">Segera Bos</div>'; }
}
function showEdit(){
  document.getElementById('editModal').style.display='grid';
  document.getElementById('editName').value=getMyName();
  let av=getMyAvatar();
  document.getElementById('editPicUrl').value=av.startsWith('data:')?'' : av;
  document.getElementById('editPrev').src=av;
  _editB64=null;
  document.getElementById('editPicFile').onchange=(e)=>{
    let f=e.target.files[0]; if(!f) return;
    let img=new Image();
    img.onload=()=>{
      let c=document.createElement('canvas');
      let max=400; let w=img.width, h=img.height;
      if(w>h){ if(w>max){ h*=max/w; w=max; } } else { if(h>max){ w*=max/h; h=max; } }
      c.width=w; c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      _editB64=c.toDataURL('image/jpeg',0.7);
      document.getElementById('editPrev').src=_editB64;
      document.getElementById('editPicUrl').value='';
    };
    let r=new FileReader(); r.onload=()=>{ img.src=r.result; }; r.readAsDataURL(f);
  };
}
function closeEdit(){ document.getElementById('editModal').style.display='none'; }
async function saveEdit(){
  let name=document.getElementById('editName').value.trim()||getMyName();
  let urlVal=document.getElementById('editPicUrl').value.trim();
  let pic=_editB64 || urlVal || getMyAvatar();
  if(!pic) pic=LOGO_INNER;
  // SIMPEN LOKAL DULU BOS - JANGAN KUNCI BOS
  try{ 
    localStorage.setItem('rg_name',name); 
    localStorage.setItem('rg_avatar',pic); 
  }catch(e){ 
    // KALO MASIH GAGAL BOS PAKSA LOGO BOS TAPI JANGAN KUNCI BOS
    console.log('localStorage penuh Bos, pakai link Bos'); 
    if(pic.startsWith('data:')){ pic=LOGO_INNER; localStorage.setItem('rg_avatar',pic); toast('Foto kegedean Bos, pakai link aja Bos biar bebas'); }
  }
  toast('Ganti foto Bos...'); closeEdit(); render();
  try{
    await fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getMyEmail(),name,picture:pic})});
    toast('Profile update Bos!');
  }catch(e){ console.log('api fail tapi lokal udah Bos',e); }
}
function addPhoto(){
  let input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.multiple=true;
  input.onchange=async()=>{
    if(input.files.length + (window._photosCache||[]).length > 12) return toast('Max 12 Bos!');
    let list=[...(window._photosCache||[])];
    for(let f of input.files){
      let b64=await new Promise(res=>{
        let img=new Image();
        img.onload=()=>{
          let c=document.createElement('canvas'); let max=600; let w=img.width,h=img.height;
          if(w>h){ if(w>max){ h*=max/w; w=max; } } else { if(h>max){ w*=max/h; h=max; } }
          c.width=w; c.height=h; c.getContext('2d').drawImage(img,0,0,w,h);
          res(c.toDataURL('image/jpeg',0.75));
        };
        let r=new FileReader(); r.onload=()=>{ img.src=r.result; }; r.readAsDataURL(f);
      });
      list.push(b64);
    }
    let r=await fetch('/api/akun/photos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getMyEmail(),photos:list})});
    let j=await r.json();
    if(j.ok){ toast('Foto kesimpan Bos! '+j.count); window._photosCache=list; loadContent(getMyEmail(),true); }
    else toast('Gagal: '+(j.error||'')); 
  };
  input.click();
}
async function toggleFollow(target){
  const me=getMyEmail(); if(!me){ toast('Login dulu Bos!'); return; }
  try{
    let res=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:me, following:target.toLowerCase()})});
    let j=await res.json();
    if(j.ok){ toast(j.status==='followed'?'Followed Bos!':'Unfollowed Bos!'); render(); }
    else toast(j.error||'Gagal');
  }catch(e){ toast('Error: '+e.message); }
}
render();
<\/script>
</body></html>
`;

export default AKUN_HTML;
