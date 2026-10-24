// KUNCI 1: TULIS API - LOVE + KOMEN AKTIF 2 TOMBOL (TANPA UNLIKE) FINAL BOS
export const TULIS_API = {
  async handle(req, env, url, cors) {
    const h = { "Content-Type": "application/json", ...cors, "Cache-Control": "no-store" };
    const pathname = url.pathname.toLowerCase();
    const method = req.method;
    
    try {
      if (env.DB) {
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, email TEXT, name TEXT, picture TEXT, tulisImg TEXT, time INTEGER, likes INTEGER DEFAULT 0)`).run();
        try{ await env.DB.prepare(`SELECT email FROM tulis_likes LIMIT 1`).run(); }
        catch{ try{ await env.DB.prepare(`DROP TABLE tulis_likes`).run(); }catch{} await env.DB.prepare(`CREATE TABLE tulis_likes (tulis_id TEXT, email TEXT, time INTEGER, PRIMARY KEY(tulis_id, email))`).run(); }
        try{ await env.DB.prepare(`SELECT email FROM tulis_komen LIMIT 1`).run(); }
        catch{ try{ await env.DB.prepare(`DROP TABLE tulis_komen`).run(); }catch{} await env.DB.prepare(`CREATE TABLE tulis_komen (id INTEGER PRIMARY KEY AUTOINCREMENT, tulis_id TEXT, email TEXT, name TEXT, picture TEXT, text TEXT, time INTEGER, likes INTEGER DEFAULT 0)`).run(); }
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS komen_likes (komen_id TEXT, email TEXT, time INTEGER, PRIMARY KEY(komen_id, email))`).run();
        try{ await env.DB.prepare(`ALTER TABLE tulis_komen ADD COLUMN likes INTEGER DEFAULT 0`).run(); }catch{}
        const newCols = ["user_email TEXT", "judul TEXT", "isi TEXT", "img TEXT", "image TEXT", "url TEXT", "created_at INTEGER", "nama TEXT", "avatar TEXT"];
        for (const c of newCols) { try { await env.DB.prepare(`ALTER TABLE tulis ADD COLUMN ${c}`).run(); } catch {} }
      }

      // 1. GET FEED + LOVE COUNT + KOMEN COUNT
      if (pathname === "/api/tulis" && method === "GET") {
        const me = (url.searchParams.get("me")||"").toLowerCase();
        const r = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 100").all();
        const list = r.results || [];
        for (const x of list) {
          const email = (x.user_email || x.email || "").toLowerCase().trim();
          if (email) {
            try {
              let u = await env.DB.prepare("SELECT picture FROM users WHERE LOWER(email)=? LIMIT 1").bind(email).first();
              if (!u) u = await env.DB.prepare("SELECT picture FROM rg_users WHERE LOWER(email)=? LIMIT 1").bind(email).first();
              if (u?.picture && u.picture.length > 10) { x.picture = u.picture; x.avatar = u.picture; }
            } catch {}
          }
          try{
            const lc = await env.DB.prepare(`SELECT COUNT(*) as c FROM tulis_likes WHERE tulis_id=?`).bind(String(x.id)).first();
            const kc = await env.DB.prepare(`SELECT COUNT(*) as c FROM tulis_komen WHERE tulis_id=?`).bind(String(x.id)).first();
            const liked = me ? await env.DB.prepare(`SELECT 1 FROM tulis_likes WHERE tulis_id=? AND email=?`).bind(String(x.id), me).first() : null;
            x.likes = lc?.c || 0;
            x.komen_count = kc?.c || 0;
            x.isLiked = !!liked;
          }catch{}
        }
        return new Response(JSON.stringify(list), { headers: h });
      }

      // 2. POST TULIS
      if ((pathname === "/api/tulis" || pathname === "/api/tulis/add") && method === "POST") {
        const j = await req.json().catch(() => ({}));
        const list = Array.isArray(j) ? j : [j];
        for (const x of list) {
          let raw = (x.email || x.user_email || "").trim();
          let email = !raw ? "anon@rumahgadang-ai.my.id" : raw.includes("@") ? raw.toLowerCase() : raw.toLowerCase() + "@rumahgadang-ai.my.id";
          const name = x.name || x.nama || email.split('@')[0] || "Dunsanak";
          const text = x.text || x.isi || x.judul || "";
          let img = x.tulisImg || x.img || x.image || x.url || "";
          let pic = x.picture || x.avatar || "";
          const now = Date.now();
          if (!text && !img) continue;
          if (!pic || pic.includes("icon.png")) {
            try {
              let u = await env.DB.prepare("SELECT picture FROM users WHERE LOWER(email)=?").bind(email).first();
              if (!u) u = await env.DB.prepare("SELECT picture FROM rg_users WHERE LOWER(email)=?").bind(email).first();
              if (u?.picture) pic = u.picture;
            } catch {}
          }
          if (!pic) pic = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
          await env.DB.prepare(`INSERT INTO tulis (judul, isi, text, email, user_email, name, nama, picture, avatar, tulisImg, img, image, url, time, created_at, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`).bind(text.slice(0, 50), text, text, email, email, name, name, pic, pic, img, img, img, img, now, now).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 3. LOVE POST - CUMA LOVE, GAK ADA UNLIKE BOS
      if(pathname === "/api/tulis/like" && method === "POST"){
        const b = await req.json().catch(()=>({}));
        const id = String(b.id||b.tulis_id||"");
        const email = (b.email||"").toLowerCase().trim();
        if(!id || !email) return new Response(JSON.stringify({ok:false,error:"id/email kosong"}),{headers:h,status:400});
        const ex = await env.DB.prepare(`SELECT 1 FROM tulis_likes WHERE tulis_id=? AND email=?`).bind(id,email).first();
        if(!ex){
          await env.DB.prepare(`INSERT INTO tulis_likes (tulis_id,email,time) VALUES (?,?,?)`).bind(id,email,Date.now()).run();
        }
        return new Response(JSON.stringify({ok:true,status:"loved"}),{headers:h});
      }

      // 4. KOMEN POST
      if(pathname === "/api/tulis/komen" && method === "POST"){
        const b = await req.json().catch(()=>({}));
        const id = String(b.id||b.tulis_id||"");
        const email = (b.email||"").toLowerCase().trim();
        const text = (b.text||"").trim();
        if(!id || !email || !text) return new Response(JSON.stringify({ok:false,error:"kosong"}),{headers:h,status:400});
        const name = b.name||email.split('@')[0];
        const pic = b.picture||"https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
        await env.DB.prepare(`INSERT INTO tulis_komen (tulis_id,email,name,picture,text,time,likes) VALUES (?,?,?,?,?,?,0)`).bind(id,email,name,pic,text,Date.now()).run();
        return new Response(JSON.stringify({ok:true}),{headers:h});
      }

      // 5. LIST KOMEN + LOVE KOMEN COUNT (2 TOMBOL AKTIF)
      if(pathname === "/api/tulis/komen" && method === "GET"){
        const id = url.searchParams.get("id")||url.searchParams.get("tulis_id")||"";
        const me = (url.searchParams.get("me")||"").toLowerCase();
        const r = await env.DB.prepare(`SELECT * FROM tulis_komen WHERE tulis_id=? ORDER BY time ASC LIMIT 100`).bind(String(id)).all();
        let list = r.results||[];
        for(const k of list){
          try{
            const lc = await env.DB.prepare(`SELECT COUNT(*) as c FROM komen_likes WHERE komen_id=?`).bind(String(k.id)).first();
            const liked = me ? await env.DB.prepare(`SELECT 1 FROM komen_likes WHERE komen_id=? AND email=?`).bind(String(k.id), me).first() : null;
            k.likes = lc?.c || k.likes || 0;
            k.isLiked = !!liked;
          }catch{}
        }
        return new Response(JSON.stringify(list),{headers:h});
      }

      // 6. LOVE KOMEN - CUMA LOVE, GAK ADA UNLIKE BOS
      if(pathname === "/api/tulis/komen/like" && method === "POST"){
        const b = await req.json().catch(()=>({}));
        const komen_id = String(b.komen_id||b.id||"");
        const email = (b.email||"").toLowerCase().trim();
        if(!komen_id || !email) return new Response(JSON.stringify({ok:false,error:"kosong"}),{headers:h,status:400});
        const ex = await env.DB.prepare(`SELECT 1 FROM komen_likes WHERE komen_id=? AND email=?`).bind(komen_id,email).first();
        if(!ex){
          await env.DB.prepare(`INSERT INTO komen_likes (komen_id,email,time) VALUES (?,?,?)`).bind(komen_id,email,Date.now()).run();
        }
        return new Response(JSON.stringify({ok:true,status:"loved"}),{headers:h});
      }
      
      // 7. DELETE
      if (pathname === "/api/tulis/delete" && method === "POST") {
        const j = await req.json().catch(() => ({}));
        if (j.id){
          await env.DB.prepare("DELETE FROM tulis WHERE id=?").bind(j.id).run();
          await env.DB.prepare("DELETE FROM tulis WHERE CAST(id AS TEXT)=?").bind(String(j.id)).run();
          await env.DB.prepare("DELETE FROM tulis_likes WHERE tulis_id=?").bind(String(j.id)).run();
          await env.DB.prepare("DELETE FROM tulis_komen WHERE tulis_id=?").bind(String(j.id)).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
    return null;
  }
};

export const handle = TULIS_API.handle;
export default TULIS_API;
