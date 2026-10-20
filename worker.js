export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };
    if(request.method==='OPTIONS') return new Response(null,{headers:cors});
    
    try{
      if(env.DB){
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
      }
    }catch(e){}

    try{
      // API AKUN
      if(path==='/api/akun'){
        if(request.method==='GET'){
          const email=url.searchParams.get('email')||url.searchParams.get('id');
          if(!email) return Response.json({}, {headers:cors});
          const u=await env.DB.prepare("SELECT * FROM rg_users WHERE email=?").bind(email).first();
          return Response.json(u||{}, {headers:cors});
        }
        const b=await request.json();
        const email=b.email||b.id; if(!email) return Response.json({error:'email'}, {status:400, headers:cors});
        const cek=await env.DB.prepare("SELECT email FROM rg_users WHERE email=?").bind(email).first();
        if(cek) await env.DB.prepare("UPDATE rg_users SET name=?, picture=? WHERE email=?").bind(b.name,b.picture,email).run();
        else await env.DB.prepare("INSERT INTO rg_users (email,name,picture,time) VALUES (?,?,?,?)").bind(email,b.name,b.picture,Date.now()).run();
        return Response.json({ok:true},{headers:cors});
      }
      // API TULIS - HIJAU
      if(path.startsWith('/api/tulis')){
        if(request.method==='POST'){
          const b=await request.json();
          await env.DB.prepare("INSERT INTO tulis (text,user_email,name,picture,tulisImg,time) VALUES (?,?,?,?,?,?)").bind(b.text||b.isi||'',b.user_email||b.email||'',b.name||'',b.picture||'',b.tulisImg||b.url||'',Date.now()).run();
          return Response.json({ok:true,msg:'Posted Bos'},{headers:cors});
        }
        const {results}=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 100").all();
        return Response.json(results||[],{headers:cors});
      }
      // API SITEMAP
      if(path==='/api-sitemap' || path==='/api/sitemap'){
        const {results}=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all();
        return Response.json({urls: results||[]},{headers:cors});
      }
      if(path.startsWith('/api/')) return Response.json({ok:true,path},{headers:cors});

      // FULL UI - RUMAH GADANG AI
      const HTML = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Rumah Gadang AI</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0;font-family:Inter,system-ui}
        body{background:#0a0a0a;color:#fff;min-height:100vh}
        header{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;background:#111;border-bottom:1px solid #222;position:sticky;top:0;z-index:10}
        .logo{font-weight:900;font-size:20px} .logo span{color:#facc15}
        nav{display:flex;gap:8px;overflow:auto}
        nav button{background:#1a1a1a;border:1px solid #2a2a2a;color:#aaa;padding:8px 14px;border-radius:999px;cursor:pointer;white-space:nowrap}
        nav button.active{background:#facc15;color:#000;border-color:#facc15;font-weight:700}
        .wrap{max-width:700px;margin:0 auto;padding:20px}
        .card{background:#161616;border:1px solid #222;border-radius:16px;padding:16px;margin-bottom:14px}
        .input{width:100%;background:#0f0f0f;border:1px solid #222;border-radius:12px;padding:12px;color:#fff;outline:none}
        .btn{background:#facc15;color:#000;border:0;padding:10px 18px;border-radius:10px;font-weight:800;cursor:pointer;width:100%}
        .post .head{display:flex;gap:10px;align-items:center;margin-bottom:10px}
        .post .ava{width:36px;height:36px;border-radius:50%;background:#333}
        .muted{color:#888;font-size:13px}
      </style></head><body>
      <header><div class="logo">RUMAH <span>GADANG</span> AI</div><div class="muted" id="userInfo"></div></header>
      <div class="wrap">
        <nav id="nav">
          <button class="active" data-p="home">Home</button>
          <button data-p="tulis">Tulis</button>
          <button data-p="foto">Foto</button>
          <button data-p="video">Video</button>
          <button data-p="ai">AI</button>
          <button data-p="kantor">Kantor</button>
          <button data-p="akun">Akun</button>
        </nav>

        <div id="page-home" class="page">
          <div class="card"><h2>Selamat Datang di Rumah Gadang AI</h2><p class="muted" style="margin-top:8px">Boomark Consle 18 Oktober - Platform asli Minang.</p>
          <div style="margin-top:12px;display:flex;gap:8px"><button class="btn" style="width:auto" onclick="go('tulis')">Mulai Menulis</button><button class="btn" style="width:auto;background:#222;color:#fff" onclick="go('foto')">Lihat Foto</button></div></div>
          <div id="feed"></div>
        </div>

        <div id="page-tulis" class="page" style="display:none">
          <div class="card"><textarea id="teks" class="input" rows="4" placeholder="Apa kabar hari ini Bos? Tulis disini..."></textarea><div style="margin-top:10px"><input id="imgUrl" class="input" placeholder="URL gambar (opsional)"><button class="btn" style="margin-top:10px" onclick="kirimTulis()">Posting Tulis - API HIJAU</button></div></div>
          <div id="feedTulis"></div>
        </div>

        <div id="page-foto" class="page" style="display:none"><div class="card"><h3>Foto</h3><p class="muted">Galeri Rumah Gadang</p></div><div id="gridFoto" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></div></div>
        <div id="page-video" class="page" style="display:none"><div class="card"><h3>Video</h3><p class="muted">Video Adat Minang</p><div style="margin-top:10px;background:#000;height:180px;border-radius:12px;display:flex;align-items:center;justify-content:center">Video Player</div></div></div>
        <div id="page-ai" class="page" style="display:none"><div class="card"><h3>AI Chat</h3><input class="input" placeholder="Tanya AI..."><button class="btn" style="margin-top:10px">Chat</button></div></div>
        <div id="page-kantor" class="page" style="display:none"><div class="card"><h3>Kantor</h3><p class="muted">Info kantor Rumah Gadang AI, Padang, Sumbar.</p></div></div>
        <div id="page-akun" class="page" style="display:none"><div class="card"><h3>Akun</h3><input id="a_email" class="input" placeholder="email"><input id="a_name" class="input" style="margin-top:8px" placeholder="nama"><input id="a_pic" class="input" style="margin-top:8px" placeholder="url foto"><button class="btn" style="margin-top:10px" onclick="saveAkun()">Simpan Akun</button></div></div>
      </div>

      <script>
        let user = {email: localStorage.getItem('rg_email')||'', name: localStorage.getItem('rg_name')||'', picture: localStorage.getItem('rg_pic')||''};
        function go(p){document.querySelectorAll('.page').forEach(e=>e.style.display='none');document.getElementById('page-'+p).style.display='block';document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active', b.dataset.p===p)); if(p==='home'||p==='tulis') loadTulis();}
        document.getElementById('nav').onclick=e=>{if(e.target.dataset.p) go(e.target.dataset.p);}
        async function loadTulis(){const r=await fetch('/api/tulis');const d=await r.json();const html=d.map(x=>'<div class="card post"><div class="head"><img class="ava" src="'+(x.picture||'https://i.pravatar.cc/100')+'"><div><div style="font-weight:700">'+(x.name||'Warga Gadang')+'</div><div class="muted">'+new Date(x.time).toLocaleString()+'</div></div></div><div>'+(x.text||'')+'</div>'+(x.tulisImg?'<img src="'+x.tulisImg+'" style="width:100%;border-radius:12px;margin-top:10px">':'')+'</div>').join(''); document.getElementById('feed').innerHTML=html; const ft=document.getElementById('feedTulis'); if(ft) ft.innerHTML=html; document.getElementById('gridFoto').innerHTML=d.filter(x=>x.tulisImg).map(x=>'<img src="'+x.tulisImg+'" style="width:100%;border-radius:12px">').join(''); }
        async function kirimTulis(){const text=document.getElementById('teks').value; if(!text) return alert('Tulis dulu Bos'); const body={text, user_email:user.email, name:user.name, picture:user.picture, tulisImg:document.getElementById('imgUrl').value}; const r=await fetch('/api/tulis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const j=await r.json(); if(j.ok){document.getElementById('teks').value=''; loadTulis(); alert('HIJAU BOS - Keposting');} }
        async function saveAkun(){user.email=document.getElementById('a_email').value; user.name=document.getElementById('a_name').value; user.picture=document.getElementById('a_pic').value; localStorage.setItem('rg_email',user.email); localStorage.setItem('rg_name',user.name); localStorage.setItem('rg_pic',user.picture); await fetch('/api/akun',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(user)}); document.getElementById('userInfo').innerText=user.name; alert('Akun tersimpan');}
        if(user.name) document.getElementById('userInfo').innerText=user.name;
        loadTulis();
      </script></body></html>`;
      return new Response(HTML, {headers:{"Content-Type":"text/html;charset=utf-8"}});
    }catch(err){
      return Response.json({ok:false,error:err.message},{status:500,headers:cors});
    }
  }
}
