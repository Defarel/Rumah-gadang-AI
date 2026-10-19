export const TULIS_API = {
  async handle(req, env, url, cors){
    const h = {"Content-Type":"application/json", ...cors};
    try{
      const path = url.pathname;

      // --- GET /api/tulis BOS - BUAT HOME FEED BOS ---
      if(path === "/api/tulis" && req.method === "GET"){
        // BOS: SELECT * BIAR KOMPATIBEL TABEL LAMA & BARU BOS
        let r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 100").all();
        // BOS: NORMALISASI BIAR FRONTEND GAK ERROR BOS
        let data = (r.results||[]).map(row=>{
          return {
            id: row.id,
            text: row.text || row.isi || row.judul || "",
            isi: row.isi || row.text || "",
            judul: row.judul || (row.text||"").slice(0,40),
            email: row.email || "",
            name: row.name || row.nama || "Dunsanak",
            picture: row.picture || row.avatar || "",
            tulisImg: row.tulisImg || row.img || row.image || "",
            img: row.img || row.tulisImg || "",
            time: row.time || row.created_at || Date.now(),
            likes: row.likes || 0
          };
        });
        return new Response(JSON.stringify(data), {headers: h});
      }

      // --- POST /api/tulis/add BOS - INI YANG DIPAKE HOME FULL TADI BOS ---
      if((path === "/api/tulis/add" || path === "/api/tulis") && req.method === "POST"){
        let j = await req.json();
        let list = Array.isArray(j) ? j : [j];

        // BOS: CEK LOGIN, KALO GAK ADA EMAIL TOLAK BOS
        for(let x of list){
          let email = (x.email||"").toLowerCase().trim();
          if(!email || email.includes('anon@')){
            // BOS: KALO DARI HOME FULL TADI UDAH DI CEK DI FRONTEND BOS, TAPI BACKEND JUGA JAGA BOS
            if(path === "/api/tulis/add" && !email){
              return new Response(JSON.stringify({ok:false, error:"Login dulu Bos!"}), {headers:h, status:401});
            }
          }
        }

        for(let x of list){
          let text = x.text || x.isi || x.content || "";
          let judul = x.judul || x.title || text.slice(0,60) || "Berita";
          let isi = x.isi || text || "";
          let email = (x.email||"").toLowerCase().trim() || "anon@rg.id";
          let name = x.name || x.nama || "Dunsanak";
          let picture = x.picture || x.avatar || "";
          let tulisImg = x.tulisImg || x.img || x.image || "";
          let time = Date.now();

          // BOS: COBA INSERT TABEL BARU DULU (text,email,name,picture,tulisImg,time,likes) BOS
          try{
            await env.DB.prepare(
              "INSERT INTO tulis (text, judul, isi, email, name, picture, tulisImg, img, time, likes) VALUES (?,?,?,?,?,?,?,?,?,0)"
            ).bind(text, judul, isi, email, name, picture, tulisImg, tulisImg, time).run();
          }catch(e){
            // BOS: FALLBACK KALO TABEL LAMA CUMA ADA (judul,isi,img) BOS
            try{
              await env.DB.prepare("INSERT INTO tulis (judul, isi, img, text, tulisImg, email, name, picture, time) VALUES (?,?,?,?,?,?,?,?,?)")
                .bind(judul, isi, tulisImg, text, tulisImg, email, name, picture, time).run();
            }catch(e2){
              try{
                await env.DB.prepare("INSERT INTO tulis (judul, isi, img) VALUES (?,?,?)").bind(judul, isi, tulisImg).run();
              }catch(e3){
                await env.DB.prepare("INSERT INTO tulis (isi) VALUES (?)").bind(isi || text).run();
              }
            }
          }
        }
        return new Response(JSON.stringify({ok:true, count:list.length}), {headers: h});
      }

      // --- DELETE BOS ---
      if((path === "/api/tulis/delete" || path === "/api/delete") && req.method === "POST"){
        let j = await req.json();
        let id = j.id || j.tulisId;
        if(!id) return new Response(JSON.stringify({ok:false, error:"id kosong Bos"}), {headers:h, status:400});
        await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok:true}), {headers: h});
      }

    }catch(err){
      return new Response(JSON.stringify({ok:false, error: err.message}), {headers: h, status:500});
    }
    return null;
  }
}
