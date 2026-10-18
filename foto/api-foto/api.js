export const FOTO_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname;
    
    // API LAMA BOS: /api/images
    if (path === "/api/images" || path === "/api/foto") {
      try {
        const r = await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results || []), { headers: cors });
      } catch { return new Response(JSON.stringify([]), { headers: cors }); }
    }
    if (path === "/api/images/add" && req.method === "POST") {
      try {
        const j = await req.json();
        await env.DB.prepare("INSERT INTO images (url, likes, time) VALUES (?,?,?)").bind(j.url, 0, Date.now()).run();
      } catch {}
      return new Response(JSON.stringify({ ok: true }), { headers: cors });
    }

    // API LAMA BOS: /api/ig-curated (INI YANG BIKIN FOTO MUNCUL BANYAK BOS!)
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

    // IG PREVIEW BOS
if(url.pathname==="/api/ig-preview"){ 
  let igUrl=url.searchParams.get("url")||""; 
  try{ 
    // COBA PAKAI MICROLINK BOS - ANTI BLOK IG!
    let micro = await fetch("https://api.microlink.io/?url="+encodeURIComponent(igUrl));
    let mjson = await micro.json();
    let thumb = mjson.data?.image?.url || mjson.data?.logo?.url || "";
    let username = igUrl.split("/")[3] || "minang";
    let cap = mjson.data?.description || "Dari @"+username;
    // Kalo microlink juga gagal, coba oembed IG
    if(!thumb){
      let oembed = await fetch("https://www.instagram.com/oembed/?url="+encodeURIComponent(igUrl));
      let ojson = await oembed.json();
      thumb = ojson.thumbnail_url || "";
      username = ojson.author_name || username;
      cap = ojson.title || cap;
    }
    return new Response(JSON.stringify({thumbnail:thumb,username:username,caption:cap,linkIG:igUrl}),{headers:cors}); 
  }catch(e){ 
    return new Response(JSON.stringify({error:"gagal", thumbnail:"", username:"minang", caption:"IG ngeblok, upload manual Bos"}),{headers:cors}); 
  } 
}
