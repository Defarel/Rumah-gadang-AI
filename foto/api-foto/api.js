export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname.toLowerCase();
    const h = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type' };

    // GET - INI KUNCINYA BOS, PAKAI startsWith BOS, BUKAN === BOS! BIAR ?t= KEDETEK BOS!
    if (path.startsWith("/api/foto") || path.startsWith("/api/images")) {
      if(req.method==="GET"){
        try {
          let list = [];
          // 1. Ambil dari images dulu Bos (soalnya id 12 lu ada di sini Bos!)
          try { let r = await env.DB.prepare("SELECT id, url, time FROM images ORDER BY time DESC LIMIT 100").all(); if(r.results) list = list.concat(r.results); } catch(e){}
          // 2. Ambil dari foto juga Bos
          try { let r = await env.DB.prepare("SELECT id, url, time FROM foto ORDER BY time DESC LIMIT 100").all(); if(r.results) list = list.concat(r.results); } catch(e){}
          
          list.sort((a,b)=>(b.time||0)-(a.time||0));
          return new Response(JSON.stringify(list), { headers: h });
        } catch { return new Response(JSON.stringify([]), { headers: h }); }
      }

      if(req.method==="POST"){
        try{
          let urlFoto = "";
          let ct = req.headers.get("content-type")||"";
          if(ct.includes("form-data")){
            const fd = await req.formData();
            const file = fd.get("file");
            if(file){ const buf = await file.arrayBuffer(); const b64 = btoa(String.fromCharCode(...new Uint8Array(buf))); urlFoto = "data:"+(file.type||"image/jpeg")+";base64,"+b64; }
          } else {
            const j = await req.json().catch(()=>({})); urlFoto = j.url || j.img || "";
          }
          if(!urlFoto) return new Response(JSON.stringify({ok:false}),{headers:h,status:400});
          // Simpen ke DUA-DUANYA Bos biar gak kosong lagi Bos!
          await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(urlFoto, Date.now()).run().catch(()=>{});
          await env.DB.prepare("INSERT INTO foto (url, time) VALUES (?,?)").bind(urlFoto, Date.now()).run().catch(async()=>{
            // Kalo foto belum ada kolom email, bikin yang simpel Bos
            await env.DB.prepare("CREATE TABLE IF NOT EXISTS foto (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
            await env.DB.prepare("INSERT INTO foto (url, time) VALUES (?,?)").bind(urlFoto, Date.now()).run();
          });
          return new Response(JSON.stringify({ok:true}),{headers:h});
        }catch(e){ return new Response(JSON.stringify({ok:false,error:e.message}),{headers:h,status:500}); }
      }
    }

    // API IG TETAP BOS
    if (path.startsWith("/api/ig-curated")) {
      try { const r = await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all(); return new Response(JSON.stringify(r.results||[]),{headers:h}); } catch { return new Response(JSON.stringify([]),{headers:h}); }
    }
    if (path === "/api/ig-preview") {
      let igUrl = url.searchParams.get("url")||"";
      try{ let m = await fetch("https://api.microlink.io/?url="+encodeURIComponent(igUrl)); let j = await m.json(); return new Response(JSON.stringify({thumbnail:j.data?.image?.url||"",username:j.data?.author||"minang",caption:j.data?.description||"",linkIG:igUrl}),{headers:h}); }catch{ return new Response(JSON.stringify({thumbnail:"",username:"minang",caption:"",linkIG:igUrl}),{headers:h}); }
    }
    return null;
  }
};
