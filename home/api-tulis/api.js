export const TULIS_API = {
  async handle(req, env, url, cors) {
    const c = cors || {"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS"};
    const p = url.pathname;

    if(req.method==="OPTIONS") return new Response(null,{headers:c});

    // POST - TULIS KE TABEL YANG BENER: 'tulis'
    if(p==="/api/tulis" && req.method==="POST"){
      try{
        let j=await req.json();
        let isi = j.isi || j.text || j.judul || "";
        let nama = j.nama || j.name || "Warga";
        if(!isi) return new Response(JSON.stringify({ok:false}),{headers:c, status:400});
        
        // Cek struktur tabel tulis dulu, pakai yang generik
        try{
          await env.DB.prepare("INSERT INTO tulis (isi) VALUES (?)").bind(isi).run();
        }catch{
          // kalau tabel tulis punya kolom nama, isi, tanggal
          await env.DB.prepare("INSERT INTO tulis (nama, isi, tanggal) VALUES (?, ?, datetime('now','localtime'))").bind(nama, isi).run();
        }
        
        return new Response(JSON.stringify({ok:true}),{headers:c});
      }catch(e){ return new Response(JSON.stringify({ok:false, error:e.message}),{headers:c, status:500}); }
    }

    // GET - BACA DARI 'tulis' YANG 17 ITU
    if((p==="/api/tulis" || p==="/api/tulisan") && req.method==="GET"){
      try{
        let r=await env.DB.prepare("SELECT * FROM tulis ORDER BY rowid DESC LIMIT 100").all();
        return new Response(JSON.stringify(r.results||[]),{headers:c});
      }catch(e){
        return new Response(JSON.stringify([]),{headers:c});
      }
    }

    // DELETE MATIIN DULU BIAR GAK KEHAPUS LAGI
    if(p.startsWith("/api/tulis/delete")){
      return new Response(JSON.stringify({ok:false, error:"delete off"}),{headers:c, status:403});
    }
    return null;
  }
}
