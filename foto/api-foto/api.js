export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname.toLowerCase();
    const h = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };

    // GET /api/images = ID 12 LU ADA DI SINI BOS! INI YANG DIPAKE TAMPILAN BARU LU BOS!
    if (path.startsWith("/api/images")) {
      if(req.method==="GET"){
        try{ let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); }catch{ return new Response(JSON.stringify([]),{headers:h}); }
      }
      if(req.method==="POST" && path.endsWith("/add")){
        try{ let j=await req.json(); await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(j.url, Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:h}); }
      }
    }

    // GET /api/foto juga sekalian Bos biar gak kosong Bos
    if (path.startsWith("/api/foto")) {
      if(req.method==="GET"){
        try{ let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); }catch{ return new Response(JSON.stringify([]),{headers:h}); }
      }
      if(req.method==="POST"){
        try{ let j=await req.json().catch(async()=>{ let fd=await req.formData(); return {url: fd.get('file')? '' : ''} }); let urlFoto=j.url||j.img||''; if(urlFoto){ await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(urlFoto, Date.now()).run(); } return new Response(JSON.stringify({ok:true}),{headers:h}); }catch{ return new Response(JSON.stringify({ok:false}),{headers:h}); }
      }
    }

    if(path.startsWith("/api/ig-curated")){
      if(req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); }catch{ return new Response(JSON.stringify([]),{headers:h}); } }
      if(req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,time) VALUES (?,?,?,?,?)").bind(j.akun||'minang',j.img,j.linkIG,j.caption||'',Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch{ return new Response(JSON.stringify({ok:false}),{headers:h}); } }
    }
    if(path.startsWith("/api/ig-preview")){ let u=url.searchParams.get("url")||""; try{ let m=await fetch("https://api.microlink.io/?url="+encodeURIComponent(u)); let j=await m.json(); return new Response(JSON.stringify({thumbnail:j.data?.image?.url||"",username:j.data?.author||"minang",caption:j.data?.description||"",linkIG:u}),{headers:h}); }catch{ return new Response(JSON.stringify({thumbnail:"",username:"minang",linkIG:u}),{headers:h}); } }
    if(path.startsWith("/api/delete") && req.method==="POST"){ try{ let {type,id}=await req.json(); if(type==='foto'||type==='images') await env.DB.prepare("DELETE FROM images WHERE id=?").bind(id).run(); if(type==='ig') await env.DB.prepare("DELETE FROM ig_curated WHERE id=?").bind(id).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch{ return new Response(JSON.stringify({ok:false}),{headers:h}); } }
    return null;
  }
};
