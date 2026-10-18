export const TULIS_API = {
  async handle(req, env, url, cors) {
    const c = cors || {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"};
    const p = url.pathname;

    // BOS! BIKIN TABEL + TAMBAH KOLOM BOS BIAR GAK ERROR BOS!
    try{
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulisan (id TEXT PRIMARY KEY, email TEXT, isi TEXT, judul TEXT, picture TEXT, created_at INTEGER, name TEXT, text TEXT, tulisImg TEXT, time INTEGER)`).run();
      try{ await env.DB.prepare("ALTER TABLE tulisan ADD COLUMN email TEXT").run(); }catch{}
      try{ await env.DB.prepare("ALTER TABLE tulisan ADD COLUMN isi TEXT").run(); }catch{}
      try{ await env.DB.prepare("ALTER TABLE tulisan ADD COLUMN picture TEXT").run(); }catch{}
      try{ await env.DB.prepare("ALTER TABLE tulisan ADD COLUMN created_at INTEGER").run(); }catch{}
    }catch{}

    // BOS! KIRIM BOS - TERIMA SEMUA NAMA BOS BIAR GAK GAGAL BOS!
    if(p==="/api/tulis" && req.method==="POST"){
      try{
        let j=await req.json();
        // BOS! BACA SEMUA VERSI BOS!
        let isi = j.isi || j.text || j.judul || j.isi_tulisan || "";
        let email = (j.email || j.user_email || j.userEmail || "sp.fc@rumahgadang-ai.my.id").toLowerCase();
        let picture = j.picture || j.tulisImg || j.url || j.img || "";
        let name = j.name || email.split('@')[0];
        
        if(!isi && !picture){
          return new Response(JSON.stringify({ok:false, error:"Kosong Bos"}),{headers:c});
        }
        let id = Date.now().toString();
        let now = Date.now();
        // BOS! SIMPAN KE SEMUA KOLOM BOS BIAR LOAD LAMA + BARU BISA BOS!
        await env.DB.prepare(`INSERT INTO tulisan (id,email,isi,judul,picture,created_at,name,text,tulisImg,time) VALUES (?,?,?,?,?,?,?,?,?,?)`)
        .bind(id,email,isi,isi,picture,now,name,isi,picture,now).run();
        return new Response(JSON.stringify({ok:true, id}),{headers:c});
      }catch(e){
        return new Response(JSON.stringify({ok:false, error:e.message}),{headers:c, status:500});
      }
    }

    // BOS! LOAD BOS!
    if((p==="/api/tulis" || p==="/api/tulisan") && req.method==="GET"){
      try{
        let r=await env.DB.prepare("SELECT * FROM tulisan ORDER BY created_at DESC LIMIT 50").all();
        // BOS! FALLBACK KALAU created_at NULL BOS!
        if(!r.results.length){
          let r2=await env.DB.prepare("SELECT * FROM tulisan ORDER BY rowid DESC LIMIT 50").all();
          return new Response(JSON.stringify(r2.results||[]),{headers:c});
        }
        return new Response(JSON.stringify(r.results||[]),{headers:c});
      }catch(e){
        return new Response(JSON.stringify([]),{headers:c});
      }
    }

    // BOS! HAPUS BOS!
    if(p.startsWith("/api/tulis/delete")){
      try{
        let j=await req.json().catch(()=>({}));
        let id=j.id || new URL(req.url).searchParams.get('id');
        if(id) await env.DB.prepare("DELETE FROM tulisan WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok:true}),{headers:c});
      }catch(e){ return new Response(JSON.stringify({ok:false}),{headers:c}); }
    }

    return null;
  }
}
