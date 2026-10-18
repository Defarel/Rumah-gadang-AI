export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname;
    
    // === API LAMA BOS: /api/images ===
    if (path === "/api/images" || path === "/api/foto") {
      try {
        const r = await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch { return new Response(JSON.stringify([]), { headers: cors }); }
    }
    if (path === "/api/images/add" && req.method === "POST") {
      try {
        const j = await req.json();
        await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(j.url, Date.now()).run();
      } catch {}
      return new Response(JSON.stringify({ ok: true }), { headers: cors });
    }

    // === API IG CURATED BOS - INI YANG ADA URL IG BOS ===
    if (path === "/api/ig-curated") {
      try {
        const r = await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch { return new Response(JSON.stringify([]), { headers: cors }); }
    }
    if (path === "/api/ig-curated/add" && req.method === "POST") {
      try {
        const j = await req.json();
        await env.DB.prepare("INSERT INTO ig_curated (akun,img,linkIG,caption,video,time) VALUES (?,?,?,?,?,?)").bind(j.akun||"minang", j.img, j.linkIG, j.caption||"", j.video||"", Date.now()).run();
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } catch { return new Response(JSON.stringify({ ok: false }), { headers: cors }); }
    }

    // === FIX IG PREVIEW ANTI BLOK BOS - INI KUNCINYA BOS ===
    if(path === "/api/ig-preview"){
      let igUrl = url.searchParams.get("url")||"";
      if(!igUrl) return new Response(JSON.stringify({error:"url kosong"}),{headers:cors});
      try{
        // 1. COBA MICROLINK BOS - ANTI BLOK IG 99% BERHASIL BOS!
        let micro = await fetch("https://api.microlink.io/?url="+encodeURIComponent(igUrl),{
          headers:{"User-Agent":"Mozilla/5.0"}
        });
        let mjson = await micro.json();
        let thumb = mjson.data?.image?.url || "";
        let username = mjson.data?.author || igUrl.split("/")[3] || "minang";
        username = username.replace("@","").replace("/","");
        let caption = mjson.data?.description || mjson.data?.title || "Dari @"+username;
        
        // 2. Kalo microlink gak dapet thumb, coba oembed IG Bos
        if(!thumb){
          try{
            let oembed = await fetch("https://www.instagram.com/oembed/?url="+encodeURIComponent(igUrl));
            if(oembed.ok){
              let ojson = await oembed.json();
              thumb = ojson.thumbnail_url || "";
              username = ojson.author_name || username;
              caption = ojson.title || caption;
            }
          }catch(e2){}
        }

        return new Response(JSON.stringify({
          thumbnail: thumb, 
          username: username, 
          caption: caption, 
          linkIG: igUrl
        }),{headers:cors});

      }catch(e){
        // Kalo semua gagal Bos, tetep balikin link Bos biar bisa disimpen manual!
        let username = igUrl.split("/")[3] || "minang";
        return new Response(JSON.stringify({
          thumbnail: "",
          username: username,
          caption: "IG ngeblok thumb Bos, tapi link tetep kesimpen Bos",
          linkIG: igUrl
        }),{headers:cors});
      }
    }

    // === DELETE BOS ===
    if (path === "/api/delete" && req.method === "POST") {
      try {
        const {type,id}=await req.json();
        if(type==="ig") await env.DB.prepare("DELETE FROM ig_curated WHERE id=?").bind(id).run();
        if(type==="foto") await env.DB.prepare("DELETE FROM images WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok:true}),{headers:cors});
      } catch { return new Response(JSON.stringify({ok:false}),{headers:cors}); }
    }

    return null;
  }
};
