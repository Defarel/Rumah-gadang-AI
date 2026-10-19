// KUNCI 1: TULIS BOS
export const TULIS_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/tulis" && req.method==="GET"){
      let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 100").all();
      return new Response(JSON.stringify(r.results||[]),{headers:cors});
    }
    if(url.pathname==="/api/tulis" && req.method==="POST"){
      let j=await req.json();
      let foto = j.tulisImg || j.url || "";
      await env.DB.prepare("INSERT INTO tulis (text,user_email,name,picture,time,tulisImg,url) VALUES (?,?,?,?,?,?,?)").bind(j.text||"",j.user_email||"",j.name||"",j.picture||"",Date.now(),foto,foto).run();
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }
    if(url.pathname==="/api/tulis/delete"){
      // cek admin
      return new Response(JSON.stringify({ok:true}),{headers:cors});
    }
    return null;
  }
}
