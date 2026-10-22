export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname.toLowerCase();
    const h = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };

    // ================== IMAGES ==================
    if (path.startsWith("/api/images")) {
      if(req.method==="GET"){
        try{ 
          let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 100").all(); 
          return new Response(JSON.stringify(r.results||[]),{headers:h}); 
        }catch{ return new Response(JSON.stringify([]),{headers:h}); }
      }
      if(req.method==="POST" && path.endsWith("/add")){
        try{ 
          let j=await req.json(); 
          await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(j.url, Date.now()).run(); 
          return new Response(JSON.stringify({ok:true}),{headers:h}); 
        }catch(e){ return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h}); }
      }
      return null;
    }

    // ================== FOTO LAMA ==================
    if (path === "/api/foto" && req.method === "GET" && !url.searchParams.get("email")) {
       try{
         let r1 = await env.DB.prepare("SELECT id, url as img, url, time, 'public' as email FROM images ORDER BY time DESC LIMIT 100").all();
         let combined = [...(r1.results||[])].sort((a,b)=>b.time-a.time).slice(0,100);
         return new Response(JSON.stringify(combined),{headers:h});
       }catch{ return new Response(JSON.stringify([]),{headers:h}); }
    }

    if (path === "/api/foto/upload" && req.method === "POST") {
      try {
        const j = await req.json();
        const email = (j.email||"").toLowerCase().trim();
        let img = j.img || j.url || "";
        if(!email || !img) return new Response(JSON.stringify({ok:false, error:"Email/foto kosong"}),{headers:h, status:400});
        await env.DB.prepare("INSERT INTO foto (email, img, time, is_public) VALUES (?,?,?,1)").bind(email, img, Date.now()).run();
        await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(img, Date.now()).run();
        return new Response(JSON.stringify({ok:true}),{headers:h});
      } catch(e) {
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h, status:500});
      }
    }

    if (path === "/api/foto/list" && req.method === "GET") {
      const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
      const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
      try {
        let result;
        if(targetEmail) {
          if(targetEmail === myEmail) {
            result = await env.DB.prepare("SELECT id, email, img, img as url, time, is_public FROM foto WHERE email = ? ORDER BY time DESC").bind(targetEmail).all();
          } else {
            result = await env.DB.prepare("SELECT id, email, img, img as url, time, is_public FROM foto WHERE email = ? AND is_public=1 ORDER BY time DESC").bind(targetEmail).all();
          }
        } else {
          result = await env.DB.prepare("SELECT id, email, img, img as url, time FROM foto WHERE is_public=1 ORDER BY time DESC LIMIT 100").all();
        }
        return new Response(JSON.stringify(result.results||[]),{headers:h});
      } catch(e) { return new Response(JSON.stringify([]),{headers:h}); }
    }

    // ================== IG CURATED ==================
    if(path.startsWith("/api/ig-curated")){
      if(req.method==="GET"){ 
        try{ 
          let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); 
          return new Response(JSON.stringify(r.results||[]),{headers:h}); 
        }catch{ return new Response(JSON.stringify([]),{headers:h}); } 
      }
      if(req.method==="POST" && path.endsWith("/add")){ 
        try{ 
          let j=await req.json(); 
          await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,time) VALUES (?,?,?,?,?)").bind(j.akun||'minang',j.img,j.linkIG,j.caption||'',Date.now()).run(); 
          return new Response(JSON.stringify({ok:true}),{headers:h}); 
        }catch(e){ return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h}); } 
      }
      return null;
    }

    if(path.startsWith("/api/ig-preview")){
      let u=url.searchParams.get("url")||""; 
      try{ 
        let m=await fetch("https://api.microlink.io/?url="+encodeURIComponent(u)); 
        let j=await m.json(); 
        return new Response(JSON.stringify({thumbnail:j.data?.image?.url||"",username:j.data?.author||"minang",caption:j.data?.description||"",linkIG:u}),{headers:h}); 
      }catch{ 
        return new Response(JSON.stringify({thumbnail:"",username:"minang",linkIG:u}),{headers:h}); 
      }
    }

    // ================== DELETE BRUTAL BOS FIX ==================
    if(path.startsWith("/api/delete") && req.method==="POST"){
      try{
        let body = await req.json();
        let id = body.id;
        let idInt = parseInt(id);
        if(isNaN(idInt)) idInt = 0;
        let idStr = String(id);

        let logs = [];
        try{ 
          let res = await env.DB.prepare("DELETE FROM images WHERE id=? OR id=?").bind(idInt, idStr).run(); 
          logs.push("images:"+ (res.meta?.changes||0));
        }catch(e){ logs.push("images err:"+e.message); }
        try{ 
          let res = await env.DB.prepare("DELETE FROM ig_curated WHERE id=? OR id=?").bind(idInt, idStr).run(); 
          logs.push("ig:"+ (res.meta?.changes||0));
        }catch(e){ logs.push("ig err:"+e.message); }
        try{ 
          let res = await env.DB.prepare("DELETE FROM foto WHERE id=? OR id=?").bind(idInt, idStr).run(); 
          logs.push("foto:"+ (res.meta?.changes||0));
        }catch(e){ logs.push("foto err:"+e.message); }

        return new Response(JSON.stringify({ok:true, deleted:id, logs:logs}),{headers:h});
      }catch(e){
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h});
      }
    }
    
    return null;
  }
};
