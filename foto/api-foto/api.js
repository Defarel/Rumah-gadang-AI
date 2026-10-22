export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname.toLowerCase();
    const h = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type', 'Cache-Control':'no-store, no-cache, must-revalidate' };

    if (path.startsWith("/api/images")) {
      if(req.method==="GET"){
        try{ let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:h}); }
      }
      if(req.method==="POST" && path.endsWith("/add")){
        try{ let j=await req.json(); await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(j.url, Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch(e){ return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h}); }
      }
      return null;
    }

    if (path === "/api/foto" && req.method === "GET" && !url.searchParams.get("email")) {
       try{
         let r1 = await env.DB.prepare("SELECT id, url as img, url, time FROM images ORDER BY time DESC LIMIT 100").all();
         return new Response(JSON.stringify(r1.results||[]),{headers:h});
       }catch(e){ return new Response(JSON.stringify([]),{headers:h}); }
    }

    if(path.startsWith("/api/ig-curated")){
      if(req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:h}); } }
      if(req.method==="POST" && path.endsWith("/add")){ try{ let j=await req.json(); await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,time) VALUES (?,?,?,?,?)").bind(j.akun||'minang',j.img,j.linkIG,j.caption||'',Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch(e){ return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h}); } }
      return null;
    }

    if(path.startsWith("/api/ig-preview")){
      let u=url.searchParams.get("url")||""; 
      try{ let m=await fetch("https://api.microlink.io/?url="+encodeURIComponent(u)); let j=await m.json(); return new Response(JSON.stringify({thumbnail:j.data?.image?.url||"",username:j.data?.author||"minang",linkIG:u}),{headers:h}); }catch{ return new Response(JSON.stringify({thumbnail:"",username:"minang",linkIG:u}),{headers:h}); }
    }

    // DELETE FINAL BRUTAL BOS
    if(path.startsWith("/api/delete") && req.method==="POST"){
      try{
        let body = await req.json();
        let id = body.id;
        let idInt = parseInt(id);
        let idStr = String(id);
        if(isNaN(idInt)) idInt = -1;

        if(!env.DB) return new Response(JSON.stringify({ok:false, error:"DB TIDAK KEPASANG BOS! cek wrangler.toml"}),{headers:h});

        let logs = [];
        // Coba semua cara Bos
        try{ let r = await env.DB.prepare("DELETE FROM ig_curated WHERE id = ?").bind(idInt).run(); logs.push("ig_int:"+r.meta.changes); }catch(e){ logs.push("ig_int_err:"+e.message); }
        try{ let r = await env.DB.prepare("DELETE FROM ig_curated WHERE CAST(id AS TEXT) = ?").bind(idStr).run(); logs.push("ig_str:"+r.meta.changes); }catch(e){ logs.push("ig_str_err:"+e.message); }
        try{ let r = await env.DB.prepare("DELETE FROM ig_curated WHERE rowid = ?").bind(idInt).run(); logs.push("ig_rowid:"+r.meta.changes); }catch(e){ logs.push("ig_rowid_err:"+e.message); }
        
        try{ let r = await env.DB.prepare("DELETE FROM images WHERE id = ?").bind(idInt).run(); logs.push("img_int:"+r.meta.changes); }catch(e){ logs.push("img_int_err:"+e.message); }
        try{ let r = await env.DB.prepare("DELETE FROM images WHERE CAST(id AS TEXT) = ?").bind(idStr).run(); logs.push("img_str:"+r.meta.changes); }catch(e){ logs.push("img_str_err:"+e.message); }
        try{ let r = await env.DB.prepare("DELETE FROM images WHERE rowid = ?").bind(idInt).run(); logs.push("img_rowid:"+r.meta.changes); }catch(e){ logs.push("img_rowid_err:"+e.message); }

        try{ let r = await env.DB.prepare("DELETE FROM foto WHERE id = ?").bind(idInt).run(); logs.push("foto_int:"+r.meta.changes); }catch(e){ logs.push("foto_int_err:"+e.message); }
        try{ let r = await env.DB.prepare("DELETE FROM foto WHERE CAST(id AS TEXT) = ?").bind(idStr).run(); logs.push("foto_str:"+r.meta.changes); }catch(e){ logs.push("foto_str_err:"+e.message); }

        return new Response(JSON.stringify({ok:true, deleted:id, logs:logs}),{headers:h});
      }catch(e){
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h});
      }
    }
    
    // DEBUG BOS BIAR TAU BOS ID NYA BOS
    if(path.startsWith("/api/debug/ids")){
      try{
        let ig = await env.DB.prepare("SELECT id, rowid, time FROM ig_curated ORDER BY id DESC LIMIT 30").all();
        let img = await env.DB.prepare("SELECT id, rowid, time FROM images ORDER BY id DESC LIMIT 30").all();
        return new Response(JSON.stringify({ig:ig.results, images:img.results}),{headers:h});
      }catch(e){ return new Response(JSON.stringify({error:e.message}),{headers:h}); }
    }

    return null;
  }
};
