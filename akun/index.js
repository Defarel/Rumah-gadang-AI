export const AKUN_HTML = `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun - Rumah Gadang AI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-top:64px;padding-bottom:80px;border-left:2px solid #00ff88;border-right:2px solid #00ff88}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff88;position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;z-index:100}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 18px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer}
.profile-sec{padding:16px}
.prof-top{display:flex;align-items:center;gap:16px;margin-bottom:12px}
.avatar-wrap{position:relative;width:86px;height:86px;flex-shrink:0;cursor:pointer}
.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #00ff88}
.avatar-badge{position:absolute;bottom:-2px;right:-2px;background:#00ff88;color:#000;border-radius:50%;width:28px;height:28px;display:grid;place-items:center;font-weight:900;font-size:20px;border:2px solid #000}
.stats-wrap{flex:1;display:flex;justify-content:space-around;text-align:center}
.stat-num{font-size:18px;font-weight:800} .stat-label{font-size:12px;color:#888}
.name-display{font-size:17px;font-weight:800;margin-bottom:14px}
.action-bar{display:flex;gap:8px;margin-bottom:18px}
.btn-action{flex:1;padding:11px;background:#222;color:#fff;border:1px solid #333;border-radius:12px;font-weight:700;font-size:13px;cursor:pointer}
.btn-keluar{background:#ff2d2d!important;border:none!important;color:#fff!important;font-weight:800}
.main-tabs{display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid #1a1a1a;padding-bottom:12px}
.m-tab{flex:1;padding:11px;border-radius:12px;background:#222;color:#888;text-align:center;font-weight:800;font-size:14px;cursor:pointer;border:1px solid #333}
.m-tab.active{background:#2f7bff;color:#fff;border-color:#2f7bff}
.btn-add-photo{width:100%;padding:13px;background:#00ff88;color:#000;border:none;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer;margin-bottom:12px}
.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.photo-item{aspect-ratio:1/1;border-radius:12px;overflow:hidden;background:#111;border:1px solid #222;position:relative}
.photo-item img{width:100%;height:100%;object-fit:cover}
.photo-del{position:absolute;top:4px;right:4px;background:rgba(0,0,0,.7);color:#fff;border:none;width:22px;height:22px;border-radius:50%;cursor:pointer}

/* LIST TEMAN KAYA FOTO 2 */
.teman-wrap{background:#fff;border-radius:16px;padding:10px}
.fb-header{font-size:18px;font-weight:800;color:#050505;padding:6px 4px 10px}
.fb-card{display:flex;gap:12px;padding:12px 4px;border-top:1px solid #eee}
.fb-av{width:68px;height:68px;border-radius:50%;object-fit:cover;flex-shrink:0}
.fb-name{font-weight:700;color:#050505;font-size:15px}
.fb-mutual{font-size:13px;color:#65676b;margin:3px 0 8px}
.btn-fb-blue{width:100%;padding:10px;background:#0866ff;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;margin-bottom:6px}
.btn-fb-gray{width:100%;padding:10px;background:#e4e6eb;color:#050505;border:none;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer}

#editModal{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999;display:none;place-items:center;padding:18px}
#editModal.show{display:grid}
.modal-box{background:#111;border:2px solid #00ff88;border-radius:20px;padding:20px;width:100%;max-width:380px}
.input-field{width:100%;padding:13px 14px;background:#222;border:1px solid #333;border-radius:12px;color:#fff;margin-bottom:10px;outline:none}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:18px}.bot a.on{color:#fff}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<div id="editModal"><div class="modal-box">
<img id="editPrev" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;display:block;margin:0 auto 12px">
<input id="editName" class="input-field" placeholder="Nama baru">
<input id="editFile" type="file" accept="image/*" class="input-field">
<div style="display:flex;gap:8px"><button class="btn-action" onclick="closeEdit()">Batal</button><button class="btn-action" style="background:#00ff88;color:#000;font-weight:900" onclick="saveEdit()">Simpan</button></div>
</div></div>
<input id="gInput" type="file" accept="image/*" multiple style="display:none">
<div class="bot">
<a href="/">🏠<br><span style="font-size:10px">Home</span></a>
<a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
<a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
<a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a>
<a href="/ai">🤖<br><span style="font-size:10px">AI</span></a>
<a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a>
</div>
<script>
const FALLBACK="https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
let activeMainTab="foto", viewingUserEmail=null, pendingB64=null;
const getEmail=()=> (localStorage.getItem('rg_email')||"").toLowerCase().trim();
const getName=()=> localStorage.getItem('rg_name')||"Dunsanak";
const getAvatar=()=> localStorage.getItem('rg_avatar')||FALLBACK;
const getPhotos=()=>{try{return JSON.parse(localStorage.getItem('rg_photos')||"[]")}catch{return[]}};
const setPhotos=(a)=> localStorage.setItem('rg_photos',JSON.stringify(a));

function render(){
  const c=document.getElementById('viewContainer');
  if(!getEmail()){c.innerHTML='<div style="padding:20px;text-align:center">Login dulu bos</div>';return}
  const target=viewingUserEmail||getEmail();
  const isMe=target===getEmail();
  let data={name:isMe?getName():"Dunsanak", picture:isMe?getAvatar():FALLBACK, followers:0, following:0, posts:getPhotos().length};
  c.innerHTML=\`
  <div class="profile-sec">
    <div class="prof-top">
      <div class="avatar-wrap" onclick="openEdit()">
        <img src="\${data.picture}" class="avatar-img" onerror="this.src='\${FALLBACK}'">
        \${isMe?'<div class="avatar-badge">+</div>':''}
      </div>
      <div class="stats-wrap">
        <div><div class="stat-num">\${data.posts}</div><div class="stat-label">postingan</div></div>
        <div><div class="stat-num">\${data.followers}</div><div class="stat-label">pengikut</div></div>
        <div><div class="stat-num">\${data.following}</div><div class="stat-label">mengikuti</div></div>
      </div>
    </div>
    <div class="name-display">\${data.name}</div>
    <div class="action-bar">
      \${isMe?\`<button class="btn-action" onclick="openEdit()">Edit profil</button><button class="btn-action btn-keluar" onclick="logout()">Keluar</button>\`:\`<button class="btn-action" style="background:#00ff88;color:#000;font-weight:900" onclick="toggleFollow('\${target}')">Ikuti</button><button class="btn-action" onclick="viewingUserEmail=null;render()">Kembali</button>\`}
    </div>
    <div class="main-tabs">
      <div class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="activeMainTab='foto';render()">FOTO</div>
      <div class="m-tab \${activeMainTab==='video'?'active':''}" onclick="activeMainTab='video';render()">video</div>
      <div class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="activeMainTab='teman';render()">Teman</div>
    </div>
    <div id="tab"></div>
  </div>\`;
  loadTab(isMe);
}
function loadTab(isMe){
  const box=document.getElementById('tab'); if(!box) return;
  if(activeMainTab==='foto'){
    const photos=isMe?getPhotos():[];
    let h=\`<button class="btn-add-photo" onclick="openGallery()">\${photos.length>=12?'Maksimal 12 foto':' + Tambah foto dari galeri ('+photos.length+'/12)'}</button>\`;
    if(photos.length===0){ h+='<div style="text-align:center;padding:30px;color:#666">Belum ada foto</div>'; }
    else{ h+='<div class="photo-grid">'+photos.map((p,i)=>\`<div class="photo-item"><img src="\${p}"><button class="photo-del" onclick="delPhoto(\${i})">✕</button></div>\`).join('')+'</div>'; }
    box.innerHTML=h;
  }else if(activeMainTab==='teman'){
    box.innerHTML='<div class="teman-wrap"><div class="fb-header">Orang yang mungkin Anda kenal</div><div style="text-align:center;padding:20px;color:#888">Memuat...</div></div>';
    fetch('/api/akun/list').then(r=>r.json()).then(users=>{
      const list=(Array.isArray(users)?users:[]).filter(u=>u.email.toLowerCase()!==getEmail());
      if(!list.length){ box.innerHTML='<div class="teman-wrap"><div class="fb-header">Orang yang mungkin Anda kenal</div><div style="text-align:center;padding:20px;color:#777">Belum ada pengguna</div></div>'; return; }
      box.innerHTML='<div class="teman-wrap"><div class="fb-header">Orang yang mungkin Anda kenal</div>'+list.map(u=>\`
        <div class="fb-card" id="u-\${u.email}">
          <img src="\${u.picture||FALLBACK}" class="fb-av">
          <div style="flex:1">
            <div class="fb-name">\${u.name||'Dunsanak'}</div>
            <div class="fb-mutual">1 teman bersama</div>
            <button class="btn-fb-blue" onclick="toggleFollow('\${u.email}',this)">Tambah jadi teman</button>
            <button class="btn-fb-gray" onclick="document.getElementById('u-\${u.email}').style.display='none'">Hapus</button>
          </div>
        </div>\`).join('')+'</div>';
    }).catch(()=>{ box.innerHTML='<div style="color:#f55;text-align:center">Gagal load D1</div>'; });
  }else{ box.innerHTML='<div style="text-align:center;padding:40px;color:#666">Video segera</div>'; }
}
function openEdit(){
  document.getElementById('editPrev').src=getAvatar();
  document.getElementById('editName').value=getName();
  document.getElementById('editModal').classList.add('show');
  pendingB64=null;
  document.getElementById('editFile').onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{pendingB64=ev.target.result; document.getElementById('editPrev').src=pendingB64}; r.readAsDataURL(f);
  };
}
function closeEdit(){ document.getElementById('editModal').classList.remove('show'); }
function saveEdit(){
  const n=document.getElementById('editName').value.trim()||getName();
  const av=pendingB64||getAvatar();
  localStorage.setItem('rg_name',n); localStorage.setItem('rg_avatar',av);
  fetch('/api/akun/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getEmail(),name:n,picture:av})}).catch(()=>{});
  closeEdit(); render();
}
function openGallery(){
  if(getPhotos().length>=12){ alert('Maks 12 foto per akun!'); return; }
  document.getElementById('gInput').click();
}
document.getElementById('gInput').addEventListener('change', async e=>{
  const files=Array.from(e.target.files||[]); if(!files.length) return;
  let photos=getPhotos(); const sisa=12-photos.length;
  const take=files.slice(0,sisa);
  for(let f of take){ const b=await toB64(f); photos.push(b); }
  setPhotos(photos);
  fetch('/api/akun/photos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getEmail(), photos:photos, table:'d1consule'})}).catch(()=>{});
  e.target.value=''; render();
});
const toB64=f=> new Promise(r=>{ const fr=new FileReader(); fr.onload=e=>r(e.target.result); fr.readAsDataURL(f); });
function delPhoto(i){ if(!confirm('Hapus foto ini?')) return; let p=getPhotos(); p.splice(i,1); setPhotos(p); fetch('/api/akun/photos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:getEmail(),photos:p,table:'d1consule'})}).catch(()=>{}); render(); }
function logout(){ if(confirm('Keluar?')){ localStorage.removeItem('rg_email'); localStorage.removeItem('rg_name'); localStorage.removeItem('rg_avatar'); location.reload(); } }
async function toggleFollow(target,btn){ if(btn) btn.textContent='Meminta...'; try{ await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:getEmail(),following:target})}); if(btn){ btn.textContent='Berteman'; btn.style.background='#e4e6eb'; btn.style.color='#000'; } }catch(e){ alert('Gagal'); if(btn) btn.textContent='Tambah jadi teman'; } }
render();
<\/script></body></html>`;
