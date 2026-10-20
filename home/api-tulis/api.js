// KUNCI 1: TULIS BOS - VERSI AMAN GAK HAPUS DATA + AUTO TAMBAH KOLOM EMAIL
export const TULIS_API = {
  async handle(req, env, url, cors) {
    const h = {"Content-Type":"application/json", ...cors};
    try{
      if(env.DB){
        // 1. BIKIN TABEL KALAU BELUM ADA (versi lama)
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS tulis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT, email TEXT, name TEXT, picture TEXT, tulisImg TEXT, time INTEGER, likes INTEGER DEFAULT 0
          )
        `).run();

        // 2. TAMBAH SEMUA KOLOM YANG HILANG TANPA HAPUS DATA LAMA BOS
        let newCols = [
          "email TEXT",
          "user_email TEXT",
          "judul TEXT",
          "isi TEXT",
          "img TEXT",
          "created_at INTEGER",
          "url TEXT",
          "name TEXT",
          "picture TEXT",
          "tulisImg TEXT",
          "text TEXT",
          "time INTEGER",
          "likes INTEGER DEFAULT 0"
        ];
        for(let c of newCols){
          try{ await env.DB.prepare(`ALTER TABLE tulis ADD COLUMN ${c}`).run(); }catch(e){}
        }
      }

      // GET
      if(url.pathname==="/api/tulis" && req.method==="GET"){
        let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 100").all();
        return new Response(JSON.stringify(r.results || []), {headers: h});
      }

      // POST /api/tulis + /api/tulis/add
      if((url.pathname==="/api/tulis" || url.pathname==="/api/tulis/add") && req.method==="POST"){
        let j = await req.json().catch(()=>({}));
        let list = Array.isArray(j) ? j : [j];
        for(let x of list){
          let raw = (x.email || x.user_email || "").trim();
          let email = "";
          if(!raw){ email = "anon@rumahgadang-ai.my.id"; } 
          else if(raw.includes("@")){ email = raw.toLowerCase(); } 
          else { email = raw.toLowerCase() + "@rumahgadang-ai.my.id"; }

          let name = x.name || email.split('@')[0] || "Dunsanak";
          let text = x.text || x.isi || "";
          let img = x.tulisImg || x.img || x.image || "";
          let pic = x.picture || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
          let now = Date.now();
          if(!text && !img) continue;

          await env.DB.prepare(`
            INSERT INTO tulis (judul, isi, text, email, user_email, name, picture, tulisImg, img, time, created_at, likes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
          `).bind(text.slice(0,50), text, text, email, email, name, pic, img, img, now, now).run();
        }
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

      // DELETE
      if(url.pathname==="/api/tulis/delete" && req.method==="POST"){
        let j = await req.json().catch(()=>({}));
        if(j.id){ await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run(); }
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

    }catch(err){
      return new Response(JSON.stringify({ok:false, error: err.message}), {headers: h, status:500});
    }
    return null;
  }
}
export const handle = TULIS_API.handle;
export default TULIS_API;
