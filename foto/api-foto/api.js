export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname.toLowerCase();
    const h = { 'Content-Type':'application/json', ...cors };
    
    // === FIX 1 BOS: GET /api/foto HARUS BACA DARI foto DAN images BOS, BIAR GAK HITAM BOS! ===
    if ((path === "/api/foto" || path === "/api/images") && req.method === "GET") {
      try {
        let all = [];
        // Baca dari tabel baru Bos foto
        try { let r = await env.DB.prepare("SELECT * FROM foto ORDER BY time DESC LIMIT 100").all(); if(r.results) all = all.concat(r.results.map(x=>({...x, url:x.url||x.img}))); } catch {}
        // Baca dari tabel lama Bos images (biar foto lama gak hilang Bos!)
        try { let r = await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 100").all(); if(r.results) all = all.concat(r.results.map(x=>({...x, url:x.url||x.img}))); } catch {}
        // Baca dari ig_curated juga Bos
        try { let r = await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); if(r.results) all = all.concat(r.results.map(x=>({...x, url:x.img||x.thumbnail||x.linkIG}))); } catch {}
        
        // Sort by time Bos
        all.sort((a,b)=>(b.time||0)-(a.time||0));
        return new Response(JSON.stringify(all), { headers: h });
      } catch (e) { 
        return new Response(JSON.stringify([]), { headers: h }); 
      }
    }

    // === FIX 2 BOS: POST /api/foto DARI TOMBOL + IJO BOS, HANDLE FORM DATA BOS! INI YANG BIKIN MASUK BOS! ===
    if (path === "/api/foto" && req.method === "POST") {
      try {
        let email = "bos@rumahgadang-ai.my.id";
        let urlFoto = "";
        let ct = req.headers.get("content-type")||"";
        
        if(ct.includes("multipart/form-data") || ct.includes("form-data")){
          const fd = await req.formData();
          email = fd.get("email") || email;
          const file = fd.get("file");
          if(file){
            const buf = await file.arrayBuffer();
            if(buf.byteLength > 3*1024*1024) return new Response(JSON.stringify({ok:false,error:"File kegedean Bos, max 3MB"}),{headers:h,status:400});
            const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
            urlFoto = "data:"+(file.type||"image/jpeg")+";base64,"+b64;
          }
        } else {
          const j = await req.json().catch(()=>({}));
          email = j.email || email;
          urlFoto = j.url || j.img || j.image || "";
        }

        if(!urlFoto) return new Response(JSON.stringify({ok:false,error:"Foto kosong Bos"}),{headers:h,status:400});

        // Simpen ke tabel foto Bos (yang baru) DAN images Bos (biar kompatibel Bos!)
        try { await env.DB.prepare("INSERT INTO foto (email, img, url, time) VALUES (?,?,?,?)").bind(email, urlFoto, urlFoto, Date.now()).run(); } catch {}
        try { await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(urlFoto, Date.now()).run(); } catch {}
        
        return new Response(JSON.stringify({ok:true}), { headers: h });
      } catch (e) {
        return new Response(JSON.stringify({ok:false,error:e.message}),{headers:h,status:500});
      }
    }

    // === API LAMA BOS TETAP JALAN BOS, BIAR GAK RUSAK BOS ===
    if (path === "/api/images/add" && req.method === "POST") {
      try { const j = await req.json(); await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(j.url, Date.now()).run(); } catch {}
      return new Response(JSON.stringify({ ok: true }), { headers: h });
    }

    if (path === "/api/ig-curated" && req.method === "GET") {
      try { const r = await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); } catch { return new Response(JSON.stringify([]),{headers:h}); }
    }

    if (path === "/api/ig-curated/add" && req.method === "POST") {
      try { const j = await req.json(); await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,video,time) VALUES (?,?,?,?,?,?)").bind(j.akun||"minang", j.img, j.linkIG, j.caption||"", j.video||"", Date.now()).run(); return new Response(JSON.stringify({ok:true}),{headers:h}); } catch { return new Response(JSON.stringify({ok:false}),{headers:h}); }
    }

    if(path === "/api/ig-preview"){
      let igUrl = url.searchParams.get("url")||"";
      if(!igUrl) return new Response(JSON.stringify({error:"url kosong"}),{headers:h});
      try{
        let micro = await fetch("https://api.microlink.io/?url="+encodeURIComponent(igUrl));
        let mjson = await micro.json();
        return new Response(JSON.stringify({ thumbnail: mjson.data?.image?.url||"", username: mjson.data?.author||igUrl.split("/")[3]||"minang", caption: mjson.data?.description||"", linkIG: igUrl }),{headers:h});
      }catch(e){ return new Response(JSON.stringify({thumbnail:"", username:igUrl.split("/")[3]||"minang", caption:"IG ngeblok Bos", linkIG:igUrl}),{headers:h}); }
    }

    if (path === "/api/delete" && req.method === "POST") {
      try { const {type,id}=await req.json(); if(type==="ig") await env.DB.prepare("DELETE FROM ig_curated WHERE id=?").bind(id).run(); if(type==="foto"||type==="images") { await env.DB.prepare("DELETE FROM images WHERE id=?").bind(id).run(); await env.DB.prepare("DELETE FROM foto WHERE id=?").bind(id).run(); } return new Response(JSON.stringify({ok:true}),{headers:h}); } catch { return new Response(JSON.stringify({ok:false}),{headers:h}); }
    }

    return null;
  }
};
