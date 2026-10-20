export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname.toLowerCase();
    const h = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };

    // ================== 1. TABEL LAMA BOS - JANGAN DIHAPUS BOS! ==================
    // GET /api/images = ID 12 LU ADA DI SINI BOS! INI YANG DIPAKE TAMPILAN BARU LU BOS!
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
    }

    // /api/foto yang lama Bos biar gak kosong Bos - TETAP BACA DARI images BOS
    if (path === "/api/foto" && req.method === "GET" && !url.searchParams.get("email")) {
       // Kalau gak ada email = feed public Bos, baca dari images + foto Bos biar gak hilang Bos!
       try{
         // Gabungin images + foto Bos biar semua keliatan Bos!
         let r1 = await env.DB.prepare("SELECT id, url as img, url, time, 'public' as email FROM images ORDER BY time DESC LIMIT 100").all();
         let r2 = [];
         try {
           r2 = await env.DB.prepare("SELECT id, img, img as url, time, email FROM foto WHERE is_public=1 ORDER BY time DESC LIMIT 100").all();
         } catch(e) { r2 = {results:[]} }
         let combined = [...(r1.results||[]), ...(r2.results||[])].sort((a,b)=>b.time-a.time).slice(0,100);
         return new Response(JSON.stringify(combined),{headers:h});
       }catch{ return new Response(JSON.stringify([]),{headers:h}); }
    }

    // ================== 2. TABEL BARU BOS - FOTO KOMPRES + PUBLIC + BISA DILIHAT ORANG BOS ==================
    // UPLOAD BARU BOS - KOMPRES OTOMATIS + MASUK KE DUA TABEL BOS BIAR GAK HILANG BOS!
    if (path === "/api/foto/upload" && req.method === "POST") {
      try {
        const j = await req.json();
        const email = (j.email||"").toLowerCase().trim();
        let img = j.img || j.url || "";

        if(!email || !img) return new Response(JSON.stringify({ok:false, error:"Email/foto kosong"}),{headers:h, status:400});
        
        // CEGAH 3MB BOS!
        if(img.length > 350000) {
          return new Response(JSON.stringify({ok:false, error:`Foto kegedean Bos! ${Math.round(img.length/1024)}KB! Kompres dulu Bos jadi <300KB!`}),{headers:h, status:400});
        }

        // 1. Masuk ke tabel foto Bos (yang ada is_public, email Bos)
        await env.DB.prepare("INSERT INTO foto (email, img, time, is_public) VALUES (?,?,?,1)").bind(email, img, Date.now()).run();
        // 2. Masuk juga ke tabel images Bos biar di /api/images tetap muncul Bos! GAK HILANG BOS!
        await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(img, Date.now()).run();

        return new Response(JSON.stringify({ok:true, message:"MANTAP BOS! MASUK FOTO + IMAGES BOS!"}),{headers:h});
      } catch(e) {
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h, status:500});
      }
    }

    // LIST PER AKUN BOS - BISA DILIHAT ORANG LAIN BOS
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
          result = await env.DB.prepare("SELECT f.id, f.email, f.img, f.img as url, f.time, u.name, u.picture FROM foto f LEFT JOIN users u ON f.email=u.email WHERE f.is_public=1 ORDER BY f.time DESC LIMIT 100").all();
        }
        return new Response(JSON.stringify(result.results||[]),{headers:h});
      } catch(e) { return new Response(JSON.stringify([]),{headers:h}); }
    }

    // ================== 3. IG CURATED LAMA BOS - TETAP ADA BOS! ==================
    if(path.startsWith("/api/ig-curated")){
      if(req.method==="GET"){ try{ let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); }catch{ return new Response(JSON.stringify([]),{headers:h}); } }
      if(req.method==="POST"){ try{ let j=await req.json(); await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,time) VALUES (?,?,?,?,?)").bind(j.akun||'minang',j.img,j.linkIG,j.caption||'',Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch{ return new Response(JSON.stringify({ok:false}),{headers:h}); } }
    }
    if(path.startsWith("/api/ig-preview")){ let u=url.searchParams.get("url")||""; try{ let m=await fetch("https://api.microlink.io/?url="+encodeURIComponent(u)); let j=await m.json(); return new Response(JSON.stringify({thumbnail:j.data?.image?.url||"",username:j.data?.author||"minang",caption:j.data?.description||"",linkIG:u}),{headers:h}); }catch{ return new Response(JSON.stringify({thumbnail:"",username:"minang",linkIG:u}),{headers:h}); } }
    if(path.startsWith("/api/delete") && req.method==="POST"){ try{ let {type,id}=await req.json(); if(type==='foto'||type==='images'){ await env.DB.prepare("DELETE FROM images WHERE id=?").bind(id).run(); try{ await env.DB.prepare("DELETE FROM foto WHERE id=?").bind(id).run(); }catch{} } if(type==='ig') await env.DB.prepare("DELETE FROM ig_curated WHERE id=?").bind(id).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); }catch{ return new Response(JSON.stringify({ok:false}),{headers:h}); } }
    
    return null;
  }
};
