export const TULIS_API = {
  async handle(req, env, url, cors) {
    const h = cors || {"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
    if(req.method==="OPTIONS") return new Response(null,{headers:h});
    
    const path = url.pathname;

    // GET - BACA DARI TABEL TULIS YANG 17 TADI
    if(path==="/api/tulis" && req.method==="GET"){
      try{
        const {results} = await env.DB.prepare("SELECT id, teks FROM tulis ORDER BY CAST(id AS INTEGER) DESC LIMIT 100").all();
        return new Response(JSON.stringify(results),{headers:h});
      }catch(e){
        return new Response(JSON.stringify({error:e.message, data:[]}),{headers:h});
      }
    }

    // POST - TULIS BARU
    if(path==="/api/tulis" && req.method==="POST"){
      try{
        let b = await req.json();
        let teks = b.teks || b.isi || b.text || "";
        if(!teks) return new Response(JSON.stringify({ok:false}),{headers:h,status:400});
        let id = Date.now().toString() + Math.floor(Math.random()*1000).toString();
        await env.DB.prepare("INSERT INTO tulis (id, teks) VALUES (?, ?)").bind(id, teks).run();
        return new Response(JSON.stringify({ok:true, id}),{headers:h});
      }catch(e){
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:h,status:500});
      }
    }
    return null;
  }
}
