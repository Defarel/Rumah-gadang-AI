// GABUNGAN AKUN HTML + AKUN API - RUMAH GADANG AI - FIX @+ = 1 BOS!
const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

const AKUN_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akun - Rumah Gadang AI</title>
<link rel="icon" href="${LOGO_DEFAULT}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:85px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,0.35)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.btn-home{background:#00ff88;color:#000;border:0;padding:8px 20px;border-radius:20px;font-weight:900;font-size:12px}
.profile-sec{padding:18px 14px 10px}.prof-top{display:flex;align-items:center;gap:18px;margin-bottom:14px}
.avatar-wrap{width:76px;height:76px}.avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2.5px solid #00ff88;background:#111}
.stats-wrap{flex:1;display:flex;justify-content:space-between;text-align:center}.stat-num{font-size:20px;font-weight:900}.stat-label{font-size:11px;color:#777}
.name-display{font-size:18px;font-weight:900;margin-top:4px}.email-display{font-size:12px;color:#00ff88;margin-bottom:14px}
.btn-follow-real{width:100%;padding:14px;background:#00ff88;color:#000;border:0;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer}
.btn-following-real{width:100%;padding:14px;background:#222;color:#fff;border:1px solid #444;border-radius:14px;font-weight:800;font-size:14px;cursor:pointer}
.btn-edit-keluar{display:flex;gap:8px;width:100%}.btn-edit{flex:1;padding:13px;background:#222;color:#fff;border:1px solid #333;border-radius:12px;font-weight:700}
.btn-keluar{flex:1;padding:13px;background:#1a1a1a;color:#ff4d4d;border:1px solid #331111;border-radius:12px;font-weight:800}
.main-tabs{display:flex;gap:8px;margin:16px 0;border-bottom:1px solid #222;padding-bottom:14px}.m-tab{flex:1;padding:12px 6px;border-radius:12px;background:#2a2a2a;color:#888;text-align:center;font-weight:800;font-size:12px;cursor:pointer;border:1px solid #333}
.m-tab.active{background:#00ff88;color:#000;border-color:#00ff88;box-shadow:0 0 12px rgba(0,255,136,0.5)}
.user-fb{display:flex;gap:12px;background:#0f0f0f;padding:12px;border-radius:14px;margin-bottom:12px;border:1px solid #222}
.user-fb-av{width:56px;height:56px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.private-card{background:#111;border:1px solid #222;border-radius:14px;padding:12px;margin-bottom:12px}
.empty-box{text-align:center;padding:50px 20px;color:#555;font-size:13px}
.login-card{margin:20px 16px;background:#fff;border-radius:24px;padding:24px;color:#000;border:2px solid #00ff88}
.input-field{width:100%;padding:14px 16px;background:#f3f3f3;border:1px solid #e0e0e0;border-radius:14px;margin-bottom:12px}
.btn-submit{width:100%;padding:14px;background:#000;color:#fff;border:none;border-radius:14px;font-weight:800}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style></head><body>
<div id="app"><div class="top"><div style="display:flex;gap:10px;align-items:center"><img src="${LOGO_DEFAULT}" class="logo"><b>RUMAH GADANG AI</b></div><button class="btn-home" onclick="location.href='/'">HOME</button></div><div id="viewContainer"></div></div>
<div class="bot"><a href="/">🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun" class="on">👤<br><span style="font-size:10px">Akun</span></a></div>
<script>
const LOGO_DEFAULT="${LOGO_DEFAULT}";
let activeMainTab="tulis"; let viewingUserEmail=null;
const urlParams=new URLSearchParams(location.search);
const profilParam=urlParams.get('profil'); if(profilParam){ viewingUserEmail=decodeURIComponent(profilParam); }
function getMyEmail(){return (localStorage.getItem('rg_email')||"").toLowerCase().trim();}
function getMyName(){return localStorage.getItem('rg_name')||"Dunsanak";}
function getMyAvatar(){ let i=localStorage.getItem('rg_avatar'); return (i&&i.trim()!=="")?i:LOGO_DEFAULT; }
function saveAuth(e,n,a){localStorage.setItem('rg_email',e.toLowerCase().trim());localStorage.setItem('rg_name',n||"Dunsanak");localStorage.setItem('rg_avatar',(a&&a.trim()!=="")?a:LOGO_DEFAULT);}
function logout(){ if(confirm("Keluar?")){localStorage.removeItem('rg_email');localStorage.removeItem('rg_name');localStorage.removeItem('rg_avatar');viewingUserEmail=null;history.pushState(null,'','/akun');render();}}
async function render(){ const my=getMyEmail(); const cont=document.getElementById('viewContainer'); if(!my&&!viewingUserEmail){cont.innerHTML='<div class="login-card"><input id="emailIn" class="input-field" placeholder="email: naura@rumahgadang-ai.my.id"><input id="nameIn" class="input-field" placeholder="Nama"><button class="btn-submit" onclick="doLogin()">Masuk / Daftar</button></div>';return;} const target=viewingUserEmail||my; renderProfile(cont,target,target===my);}
async function doLogin(){ let email=document.getElementById('emailIn').value.trim().toLowerCase(); let name=document.getElementById('nameIn').value.trim()||email.split('@')[0]; if(!email.includes('@')) email+='@rumahgadang-ai.my.id'; try{await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name,picture:LOGO_DEFAULT})});}catch(e){} saveAuth(email,name,LOGO_DEFAULT); viewingUserEmail=null; history.pushState(null,'','/akun'); render(); }
async function renderProfile(container,targetEmail,isMe){
  container.innerHTML='<div style="text-align:center;padding:40px;color:#666">Memuat...</div>';
  let data={name:isMe?getMyName():targetEmail.split('@')[0],picture:isMe?getMyAvatar():LOGO_DEFAULT,posts:0,followers:0,following:0,isFollowing:false};
  try{ let r=await fetch('/api/akun/profile?email='+encodeURIComponent(targetEmail)+'&me='+encodeURIComponent(getMyEmail())+'&t='+Date.now()); if(r.ok){ let d=await r.json(); data={...data,...d}; if(!data.picture) data.picture=LOGO_DEFAULT; if(isMe) saveAuth(targetEmail,data.name,data.picture);} }catch(e){}
  container.innerHTML=\`
    <div class="profile-sec">
      <div class="prof-top"><div class="avatar-wrap"><img src="\${data.picture}" class="avatar-img"></div><div class="stats-wrap"><div><div class="stat-num">\${data.posts||0}</div><div class="stat-label">tulisan</div></div><div><div class="stat-num">\${data.followers||0}</div><div class="stat-label">pengikut</div></div><div><div class="stat-num">\${data.following||0}</div><div class="stat-label">mengikuti</div></div></div></div>
      <div class="name-display">\${data.name}</div><div class="email-display">\${targetEmail}</div>
      <div style="margin-bottom:16px">\${isMe ? \`<div class="btn-edit-keluar"><button class="btn-edit" onclick="logout()">Keluar</button></div>\` : \`<button id="followBtn" class="\${data.isFollowing?'btn-following-real':'btn-follow-real'}" onclick="toggleFollow('\${targetEmail}')">\${data.isFollowing?'✓ Mengikuti':'Follow'}</button>\`}</div>
      <div class="main-tabs"><button class="m-tab \${activeMainTab==='tulis'?'active':''}" onclick="switchTab('tulis')">TULIS</button><button class="m-tab \${activeMainTab==='foto'?'active':''}" onclick="switchTab('foto')">FOTO</button><button class="m-tab \${activeMainTab==='video'?'active':''}" onclick="switchTab('video')">VIDEO</button><button class="m-tab \${activeMainTab==='teman'?'active':''}" onclick="switchTab('teman')">TEMAN</button></div>
      <div id="tabContent"></div>
    </div>\`; loadContent(targetEmail,isMe);
}
function switchTab(t){ activeMainTab=t; const me=viewingUserEmail||getMyEmail(); loadContent(me,me===getMyEmail()); document.querySelectorAll('.m-tab').forEach(b=>{ b.classList.toggle('active', b.textContent.toLowerCase()===t); }); }
function viewUser(e){ viewingUserEmail=e; activeMainTab='tulis'; history.pushState(null,'','/akun?profil='+encodeURIComponent(e)); render(); }
async function loadContent(targetEmail,isMe){
  const box=document.getElementById('tabContent'); if(!box) return;
  if(activeMainTab==='teman'){
    box.innerHTML='<div class="empty-box">Memuat teman...</div>';
    let finalList=[]; try{ let r=await fetch('/api/akun/list?t='+Date.now()); let u=await r.json(); if(Array.isArray(u)) finalList=u; }catch{}
    finalList=finalList.filter(u=>u.email.toLowerCase()!==getMyEmail().toLowerCase());
    if(!finalList.length){ box.innerHTML='<div class="empty-box">Belum ada pengguna lain</div>'; return; }
    box.innerHTML=finalList.map(u=>\`<div class="user-fb"><img src="\${u.picture||LOGO_DEFAULT}" class="user-fb-av"><div style="flex:1"><div style="font-weight:800">\${u.name||u.email.split('@')[0]}</div><div style="font-size:11px;color:#666">\${u.email}</div><div style="display:flex;gap:6px;margin-top:8px"><button class="btn-add-fb" style="flex:1;background:#00ff88;color:#000;border:0;padding:9px;border-radius:8px;font-weight:900" onclick="toggleFollow('\${u.email}')">Follow</button><button style="flex:1;background:#222;color:#aaa;border:0;padding:9px;border-radius:8px" onclick="viewUser('\${u.email}')">Lihat</button></div></div></div>\`).join('');
  } else if(activeMainTab==='tulis'){
    try{ let r=await fetch('/api/tulis?email='+encodeURIComponent(targetEmail)+'&t='+Date.now()); if(!r.ok) r=await fetch('/api/tulis?t='+Date.now()); let j=await r.json(); let list=Array.isArray(j)?j:(j.results||[]); let mine=list.filter(p=>(p.user_email||p.email||'').toLowerCase()===targetEmail.toLowerCase()); if(!mine.length){ box.innerHTML='<div class="empty-box">Belum ada tulisan</div>'; return;} box.innerHTML=mine.map(p=>\`<div class="private-card"><div style="font-size:13px;white-space:pre-wrap">\${(p.text||p.isi||'').toString().replace(/</g,'&lt;')}</div></div>\`).join(''); }catch{ box.innerHTML='<div class="empty-box">Gagal memuat</div>'; }
  } else { box.innerHTML='<div class="empty-box">Kosong</div>'; }
}
async function toggleFollow(target){
  const me=getMyEmail(); if(!me){ alert("Login dulu Bos!"); return; }
  target=target.toLowerCase(); const btn=document.getElementById('followBtn'); if(btn){ btn.textContent='Loading...'; btn.disabled=true; }
  try{
    let res=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:me,following:target})});
    let j=await res.json();
    if(j.ok){ setTimeout(()=>render(),600); } else { alert("Gagal: "+(j.error||"error")); render(); }
  }catch(e){ alert("Error: "+e.message); render(); }
}
render();
<\/script></body></html>`;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if (req.method === "OPTIONS") return new Response(null,{headers:cors});

    // API ROUTES - INI YANG BIKIN SELECT NO DATA TADI BOS!
    if (path.startsWith("/api/akun/") || path === "/api/follow" || path.startsWith("/api/followers") || path.startsWith("/api/following")) {
      const h = {"Content-Type":"application/json",...cors};
      try {
        if (path === "/api/akun/register" && req.method === "POST") {
          const {email,name,picture} = await req.json();
          const clean = email.toLowerCase().trim();
          const pic = picture || LOGO_DEFAULT;
          await env.DB.prepare("INSERT INTO users (email,name,picture,time) VALUES (?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture, time=excluded.time").bind(clean, name||clean.split('@')[0], pic, Date.now()).run();
          return new Response(JSON.stringify({ok:true}),{headers:h});
        }
        if (path === "/api/akun/list") {
          const r = await env.DB.prepare("SELECT email,name,picture FROM users ORDER BY time DESC LIMIT 100").all();
          return new Response(JSON.stringify(r.results||[]),{headers:h});
        }
        if (path === "/api/akun/profile") {
          const target = (url.searchParams.get("email")||"").toLowerCase().trim();
          const me = (url.searchParams.get("me")||"").toLowerCase().trim();
          const user = await env.DB.prepare("SELECT email,name,picture FROM users WHERE email=?").bind(target).first();
          let posts=0; try{ const c=await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE LOWER(email)=? OR LOWER(user_email)=?").bind(target,target).first(); posts=c?.c||0; }catch{}
          let followers=0,following=0,isFollowing=false;
          try{ const f1=await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email=?").bind(target).first(); followers=f1?.c||0; }catch{}
          try{ const f2=await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_email=?").bind(target).first(); following=f2?.c||0; }catch{}
          if(me){ try{ const chk=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_email=? AND following_email=?").bind(me,target).first(); isFollowing=!!chk; }catch{} }
          return new Response(JSON.stringify({email:target,name:user?.name||target.split('@')[0],picture:user?.picture||LOGO_DEFAULT,posts,followers,following,isFollowing}),{headers:h});
        }
        if (path === "/api/follow" && req.method === "POST") {
          const {follower,following} = await req.json();
          const a=follower.toLowerCase().trim(), b=following.toLowerCase().trim();
          if(a===b) return new Response(JSON.stringify({ok:false,error:"self"}),{headers:h,status:400});
          const ex=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_email=? AND following_email=?").bind(a,b).first();
          if(ex){
            await env.DB.prepare("DELETE FROM follows WHERE follower_email=? AND following_email=?").bind(a,b).run();
            return new Response(JSON.stringify({ok:true,status:"unfollowed"}),{headers:h});
          } else {
            // FIX TANPA created_at DULU BOS BIAR GAK NO DATA LAGI BOS!
            try{
              await env.DB.prepare("INSERT INTO follows (follower_email,following_email,created_at) VALUES (?,?,?)").bind(a,b,Date.now()).run();
            }catch{
              await env.DB.prepare("INSERT INTO follows (follower_email,following_email) VALUES (?,?)").bind(a,b).run();
            }
            return new Response(JSON.stringify({ok:true,status:"followed"}),{headers:h});
          }
        }
      } catch(e){
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:{...h},status:500});
      }
    }

    // HALAMAN AKUN HTML
    if (path === "/akun" || path.startsWith("/akun?") || path.startsWith("/akun/")) {
      return new Response(AKUN_HTML, {headers:{"Content-Type":"text/html;charset=utf-8",...cors}});
    }

    // HALAMAN /a YANG TADI KELUAR ok:true BOS, INI GUE BENERIN BOS!
    if (path === "/a" || path.startsWith("/a?")) {
      return new Response(AKUN_HTML, {headers:{"Content-Type":"text/html;charset=utf-8",...cors}});
    }

    return new Response("Not found",{status:404,headers:cors});
  }
}
