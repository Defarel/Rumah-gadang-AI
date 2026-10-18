// KUNCI 1: TULIS BOS - FIX TXT
export const TULIS_API = {
  async handle(req, env, url, cors) {
    if(url.pathname==="/api/tulis" && req.method==="GET"){
      let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC").all();
      return new Response(JSON.stringify(r.results), {headers: cors});
    }
    if(url.pathname==="/api/tulis" && req.method==="POST"){
      let j = await req.json();
      // support upload 5 file sekaligus
      if(Array.isArray(j)){
        for(let x of j){
          await env.DB.prepare("INSERT INTO tulis (judul, isi) VALUES (?, ?)").bind(x.judul, x.isi).run();
        }
        return new Response(JSON.stringify({ok:true, count: j.length}), {headers: cors});
      } else {
        await env.DB.prepare("INSERT INTO tulis (judul, isi) VALUES (?, ?)").bind(j.judul, j.isi).run();
        return new Response(JSON.stringify({ok:true}), {headers: cors});
      }
    }
    if(url.pathname==="/api/tulis/delete"){
      let j = await req.json();
      await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run();
      return new Response(JSON.stringify({ok:true}), {headers: cors});
    }
    return null;
  }
}
