export const TULIS_API = {
  async handle(req, env, url, cors){
    const h = {"Content-Type":"application/json", ...cors};
    try{
      // -------------------------------------------------------------
      // 1. GET: AMBIL DAFTAR POSTINGAN
      // -------------------------------------------------------------
      if(url.pathname==="/api/tulis" && req.method==="GET"){
        let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results || []), {headers: h});
      }

      // -------------------------------------------------------------
      // 2. POST: TAMBAH POSTINGAN BARU (/api/tulis atau /api/tulis/add)
      // -------------------------------------------------------------
      if((url.pathname==="/api/tulis" || url.pathname==="/api/tulis/add") && req.method==="POST"){
        let j = await req.json();
        let list = Array.isArray(j) ? j : [j];

        for(let x of list){
          // Ambil input email atau user
          let rawEmail = x.email || x.user_email || "";
          let cleanEmail = "";
          
          if (rawEmail) {
            cleanEmail = rawEmail.includes("@") 
              ? rawEmail.toLowerCase().trim() 
              : rawEmail.toLowerCase().trim() + "@rumahgadang-ai.my.id";
          } else {
            cleanEmail = "anon@rumahgadang-ai.my.id";
          }

          let judul = x.judul || x.title || (x.text || x.isi || "").slice(0, 40) || "Berita";
          let isi = x.text || x.isi || x.content || "";
          let name = x.name || cleanEmail.split('@')[0] || "Dunsanak";
          let picture = x.picture || x.avatar || "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
          let tulisImg = x.tulisImg || x.img || x.image || "";
          let timeNow = Date.now();

          // Simpan ke database dengan kolom lengkap (Mendukung struktur tabel lama & baru)
          try {
            await env.DB.prepare(`
              INSERT INTO tulis (judul, isi, text, email, user_email, name, picture, tulisImg, img, time, created_at, likes) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            `).bind(
              judul, 
              isi, 
              isi, 
              cleanEmail, 
              cleanEmail, 
              name, 
              picture, 
              tulisImg, 
              tulisImg, 
              timeNow, 
              timeNow
            ).run();
          } catch (e1) {
            // Fallback jika ada kolom yang belum tersedia di database
            try {
              await env.DB.prepare(`
                INSERT INTO tulis (text, email, name, picture, tulisImg, time, likes) 
                VALUES (?, ?, ?, ?, ?, ?, 0)
              `).bind(isi, cleanEmail, name, picture, tulisImg, timeNow).run();
            } catch (e2) {
              await env.DB.prepare("INSERT INTO tulis (text) VALUES (?)").bind(isi || judul).run();
            }
          }
        }

        return new Response(JSON.stringify({ok:true, count:list.length}), {headers: h});
      }

      // -------------------------------------------------------------
      // 3. DELETE: HAPUS POSTINGAN
      // -------------------------------------------------------------
      if(url.pathname==="/api/tulis/delete" && req.method==="POST"){
        let j = await req.json();
        if(j.id){
          await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run();
        }
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

    }catch(err){
      return new Response(JSON.stringify({ok:false, error: err.message}), {headers: h, status:500});
    }
    return null;
  }
}
