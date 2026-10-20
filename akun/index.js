const HTML_AKUN = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Akun</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}#app{max-width:520px;margin:0 auto;min-height:100vh;padding-bottom:80px;border-left:2px solid #00ff88;border-right:2px solid #00ff88} .top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222}.profile-sec{padding:16px}.stats-wrap{display:flex;justify-content:space-around;text-align:center;margin:12px 0}.stat-num{font-weight:900;font-size:20px}.btn-follow{width:100%;padding:14px;background:#00ff88;color:#000;border:0;border-radius:12px;font-weight:900}.btn-following{width:100%;padding:14px;background:#222;color:#fff;border:1px solid #444;border-radius:12px;font-weight:800}.user-fb{display:flex;gap:10px;background:#111;padding:12px;border-radius:12px;margin-bottom:10px;border:1px solid #222}.user-fb-av{width:50px;height:50px;border-radius:50%;border:1px solid #00ff88}.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex}.bot a{flex:1;text-align:center;padding:10px;color:#666;text-decoration:none}.bot a.on{color:#fff}.login-card{margin:20px;background:#fff;color:#000;padding:20px;border-radius:20px}.input-field{width:100%;padding:12px;border-radius:10px;border:1px solid #ddd;margin-bottom:10px}.btn-submit{width:100%;padding:12px;background:#000;color:#fff;border-radius:10px}</style></head><body>
<div id="app"><div class="top"><b>RUMAH GADANG AI</b><button onclick="location.href='/'" style="background:#00ff88;border:0;padding:6px 14px;border-radius:20px;font-weight:900">HOME</button></div><div id="view"></div></div>
<div class="bot"><a href="/">Home</a><a href="/akun" class="on">Akun</a></div>
<script>
let viewEmail=null;const p=new URLSearchParams(location.search).get('profil');if(p)viewEmail=decodeURIComponent(p);
function myE(){return(localStorage.getItem('rg_email')||'').toLowerCase()}function myN(){return localStorage.getItem('rg_name')||'Dunsanak'}function myA(){return localStorage.getItem('rg_avatar')||'https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png'}
function save(e,n,a){localStorage.setItem('rg_email',e.toLowerCase());localStorage.setItem('rg_name',n);localStorage.setItem('rg_avatar',a)}
async function render(){const my=myE();const c=document.getElementById('view');if(!my&&!viewEmail){c.innerHTML='<div class=login-card><input id=em class=input-field placeholder=naura@rumahgadang-ai.my.id><input id=nm class=input-field placeholder=Nama><button class=btn-submit onclick=login()>Masuk</button></div>';return}const target=viewEmail||my;let d={name:target.split('@')[0],picture:myA(),posts:0,followers:0,following:0,isFollowing:false};try{let r=await fetch('/api/akun/profile?email='+encodeURIComponent(target)+'&me='+encodeURIComponent(my)+'&t='+Date.now());if(r.ok)d=await r.json()}catch{}c.innerHTML='<div class=profile-sec><div style=display:flex;gap:16px;align-items:center><img src='+d.picture+' style=width:70px;height:70px;border-radius:50%;border:2px solid #00ff88><div class=stats-wrap style=flex:1><div><div class=stat-num>'+(d.posts||0)+'</div><div>tulisan</div></div><div><div class=stat-num>'+(d.followers||0)+'</div><div>pengikut</div></div><div><div class=stat-num>'+(d.following||0)+'</div><div>mengikuti</div></div></div></div><div style=margin-top:10px;font-weight:900>'+d.name+'</div><div style=color:#00ff88;font-size:12px>'+target+'</div><div style=margin-top:12px>'+(target===my?'<button onclick="localStorage.clear();location.href=\\'/akun\\'" class=btn-following>Keluar</button>':'<button id=fb class='+(d.isFollowing?'btn-following':'btn-follow')+' onclick="follow(\\''+target+'\\')">'+(d.isFollowing?'✓ Mengikuti':'Follow')+'</button>')+'</div><div id=list style=margin-top:16px></div></div>';loadList(target)}
async function login(){let e=document.getElementById('em').value.toLowerCase().trim();let n=document.getElementById('nm').value.trim()||e.split('@')[0];if(!e.includes('@'))e+='@rumahgadang-ai.my.id';await fetch('/api/akun/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,name:n,picture:myA()})});save(e,n,myA());viewEmail=null;history.pushState(null,'','/akun');render()}
async function loadList(t){const b=document.getElementById('list');try{let r=await fetch('/api/akun/list?t='+Date.now());let u=await r.json();let f=u.filter(x=>x.email.toLowerCase()!==myE());b.innerHTML=f.map(x=>'<div class=user-fb><img src='+(x.picture||myA())+' class=user-fb-av><div><b>'+(x.name||x.email)+'</b><br><span style=font-size:11px;color:#888>'+x.email+'</span><br><button onclick="location.href=\\'/akun?profil='+encodeURIComponent(x.email)+'\\'" style=margin-top:6px;padding:6px 12px;background:#222;color:#fff;border:0;border-radius:8px>Lihat</button></div></div>').join('')}catch{b.innerHTML='gagal'}}
async function follow(t){const me=myE();if(!me)return alert('login dulu');document.getElementById('fb').textContent='Loading...';let r=await fetch('/api/follow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({follower:me,following:t})});let j=await r.json();if(j.ok)render()}
render();
<\/script></body></html>`;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if (req.method === "OPTIONS") return new Response(null,{headers:cors});

    // API AKUN
    if (url.pathname.startsWith("/api/")) {
      const h = {"Content-Type":"application/json",...cors};
      try {
        if (url.pathname === "/api/akun/register" && req.method === "POST") {
          const b = await req.json();
          await env.DB.prepare("INSERT INTO users (email,name,picture,time) VALUES (?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,picture=excluded.picture,time=excluded.time").bind(b.email.toLowerCase(), b.name, b.picture||"https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png", Date.now()).run();
          return new Response(JSON.stringify({ok:true}),{headers:h});
        }
        if (url.pathname === "/api/akun/list") {
          const r = await env.DB.prepare("SELECT email,name,picture FROM users ORDER BY time DESC LIMIT 100").all();
          return new Response(JSON.stringify(r.results||[]),{headers:h});
        }
        if (url.pathname === "/api/akun/profile") {
          const target = (url.searchParams.get("email")||"").toLowerCase();
          const me = (url.searchParams.get("me")||"").toLowerCase();
          const u = await env.DB.prepare("SELECT * FROM users WHERE email=?").bind(target).first();
          let posts=0,followers=0,following=0,isFollowing=false;
          try{let c=await env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE LOWER(email)=? OR LOWER(user_email)=?").bind(target,target).first();posts=c?.c||0}catch{}
          try{let c=await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email=?").bind(target).first();followers=c?.c||0}catch{}
          try{let c=await env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_email=?").bind(target).first();following=c?.c||0}catch{}
          if(me){try{let c=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_email=? AND following_email=?").bind(me,target).first();isFollowing=!!c}catch{}}
          return new Response(JSON.stringify({email:target,name:u?.name||target.split('@')[0],picture:u?.picture||"https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png",posts,followers,following,isFollowing}),{headers:h});
        }
        if (url.pathname === "/api/follow" && req.method === "POST") {
          const {follower,following} = await req.json();
          const a=follower.toLowerCase().trim(), b=following.toLowerCase().trim();
          const ex=await env.DB.prepare("SELECT 1 FROM follows WHERE follower_email=? AND following_email=?").bind(a,b).first();
          if(ex){ await env.DB.prepare("DELETE FROM follows WHERE follower_email=? AND following_email=?").bind(a,b).run(); return new Response(JSON.stringify({ok:true,status:"unfollowed"}),{headers:h}); }
          else { 
            try{ await env.DB.prepare("INSERT INTO follows (follower_email,following_email,created_at) VALUES (?,?,?)").bind(a,b,Date.now()).run(); }catch{ await env.DB.prepare("INSERT INTO follows (follower_email,following_email) VALUES (?,?)").bind(a,b).run(); }
            return new Response(JSON.stringify({ok:true,status:"followed"}),{headers:h}); 
          }
        }
      } catch(e){ return new Response(JSON.stringify({ok:false,error:e.message}),{headers:h,status:500}); }
    }

    // HALAMAN HTML - INI FIX [object Object] BOS!
    if (url.pathname === "/akun" || url.pathname === "/a" || url.pathname.startsWith("/akun?") || url.pathname.startsWith("/a?")) {
      return new Response(HTML_AKUN, {headers:{"Content-Type":"text/html; charset=utf-8",...cors}});
    }

    return new Response("Not found",{status:404,headers:cors});
  }
}
