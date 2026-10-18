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
    if (path === "/api/ig-preview") {
      const igUrl = url.searchParams.get("url") || "";
      try {
        const resp = await fetch(igUrl, { headers: { "User-Agent": "Mozilla/5.0 (iPhone) AppleWebKit" } });
        const html = await resp.text();
        let thumb = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1] || "";
        let username = html.match(/"username":"([^"]+)"/)?.[1] || igUrl.split("/")[3] || "minang";
        thumb = thumb.replace(/&amp;/g, "&");
        return new Response(JSON.stringify({ thumbnail: thumb, username, caption: "Dari @"+username }), { headers: cors });
      } catch { return new Response(JSON.stringify({ error: "gagal" }), { headers: cors, status: 500 }); }
    }
    return null;
  }
}
