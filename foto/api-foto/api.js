// KUNCI 2: FOTO BOS - INI YANG BENERIN NAURA KEMBAR!
export const FOTO_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/fotos" && req.method==="GET"){
      let r=await env.DB.prepare("SELECT * FROM fotos ORDER BY time DESC LIMIT 100").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }
    if(url.pathname==="/api/images"){
      let r=await env.DB.prepare("SELECT * FROM images ORDER BY time DESC LIMIT 50").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }
    if(url.pathname==="/api/ig-curated"){
      let r=await env.DB.prepare("SELECT * FROM ig_curated ORDER BY time DESC LIMIT 100").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }
    if(url.pathname==="/api/images/add" && req.method==="POST"){
      let j=await req.json();
      await env.DB.prepare("INSERT INTO images (url, time) VALUES (?,?)").bind(j.url||"", Date.now()).run();
      // OBAT KEMBAR BOS!
      if(j.user_email){
        await env.DB.prepare("UPDATE users SET picture=? WHERE email=?").bind(j.url, j.user_email).run();
        await env.DB.prepare("UPDATE profiles SET picture=? WHERE email=?").bind(j.url, j.user_email).run();
      }
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }
    return null;
  }
}
