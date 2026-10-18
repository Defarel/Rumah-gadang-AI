export const TULIS_API = {
  async handle(req, env, url, cors){
    const h = {"Content-Type":"application/json", ...cors};
    try{
      if(url.pathname==="/api/tulis" && req.method==="GET"){
        let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results), {headers: h});
      }
      if(url.pathname==="/api/tulis" && req.method==="POST"){
        let j = await req.json();
        let list = Array.isArray(j) ? j : [j];
        for(let x of list){
          let judul = x.judul || x.title || (x.isi||"").slice(0,40) || "Berita";
          let isi = x.isi || x.text || x.content || "";
          let img = x.img || x.image || x.tulisImg || "";
          // coba insert dengan kolom lengkap, kalau gagal coba isi doang
          try{
            await env.DB.prepare("INSERT INTO tulis (judul, isi, img) VALUES (?,?,?)").bind(judul, isi, img).run();
          }catch(e){
            try{
              await env.DB.prepare("INSERT INTO tulis (isi) VALUES (?)").bind(isi || judul).run();
            }catch(e2){
              await env.DB.prepare("INSERT INTO tulis (judul, isi) VALUES (?,?)").bind(judul, isi).run();
            }
          }
        }
        return new Response(JSON.stringify({ok:true, count:list.length}), {headers: h});
      }
      if(url.pathname==="/api/tulis/delete"){
        let j = await req.json();
        await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run();
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }
    }catch(err){
      return new Response(JSON.stringify({ok:false, error: err.message}), {headers: h, status:500});
    }
    return null;
  }
}
