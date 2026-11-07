const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

export const AKUN_API = {
  async handle(req, env, url, corsHeaders) {
    const h = { "Content-Type": "application/json", ...corsHeaders, "Cache-Control":"no-store" };
    const path = url.pathname.toLowerCase();
    const method = req.method;

    try {
      // INIT TABLES - TETEP ADA SEMUA, TAPI CUMA JALAN 1X, BUKAN TIAP REQUEST
      // Ini yang bikin lama kemarin: tiap buka profil / teman, disuruh bikin 12 tabel dulu.
      // Sekarang pake flag, kalau udah pernah dibikin, langsung skip.
      if (!globalThis.__RG_DB_INITED) {
        const inits = [
          `CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)`,
          `CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, name TEXT, picture TEXT, time INTEGER)`,
          `CREATE TABLE IF NOT EXISTS follows (follower_email TEXT, following_email TEXT, created_at INTEGER, PRIMARY KEY(follower_email, following_email))`,
          `CREATE TABLE IF NOT EXISTS d1consule_photos_v2 (email TEXT, idx INTEGER, photo TEXT, updated_at INTEGER, PRIMARY KEY(email, idx))`,
          `CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, user_email TEXT, name TEXT, picture TEXT, time INTEGER)`,
          `CREATE TABLE IF NOT EXISTS photo_likes (photo_key TEXT, user_email TEXT, PRIMARY KEY(photo_key, user_email))`,
          `CREATE TABLE IF NOT EXISTS photo_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, photo_key TEXT, user_name TEXT, comment TEXT, time INTEGER)`,
          `CREATE TABLE IF NOT EXISTS comment_likes (comment_id INTEGER, user_email TEXT, PRIMARY KEY(comment_id, user_email))`,
          `CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, receiver TEXT, message TEXT, time INTEGER)`,
          `CREATE TABLE IF NOT EXISTS chat_history (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, role TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
          // INDEX BIAR CEPET - GAK NGURANGIN APA-APA, CUMA BIKIN QUERY LEBIH CEPET
          `CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_email)`,
          `CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_email)`,
          `CREATE INDEX IF NOT EXISTS idx_tulis_email ON tulis(email)`,
          `CREATE INDEX IF NOT EXISTS idx_tulis_user_email ON tulis(user_email)`,
          `CREATE INDEX IF NOT EXISTS idx_chats_sender_receiver ON chats(sender, receiver)`,
          `CREATE INDEX IF NOT EXISTS idx_chats_receiver_sender ON chats(receiver, sender)`,
          `CREATE INDEX IF NOT EXISTS idx_photo_comments_key ON photo_comments(photo_key)`,
          `CREATE INDEX IF NOT EXISTS idx_photo_likes_key ON photo_likes(photo_key)`,
          `CREATE INDEX IF NOT EXISTS idx_comment_likes_id ON comment_likes(comment_id)`,
          `CREATE INDEX IF NOT EXISTS idx_photos_email ON d1consule_photos_v2(email)`,
        ];
        // Jalankan semua barengan pake batch, bukan await satu-satu
        await env.DB.batch(inits.map(sql => env.DB.prepare(sql)));
        globalThis.__RG_DB_INITED = true;
      }
      
      // 1. REGISTER / LOGIN - SAMA PERSIS KAYAK PUNYA LU
      if (path === "/api/akun/register" && method === "POST") {
        const body = await req.json();
        let email = (body.email || "").toLowerCase().trim();
        let name = (body.name || email.split('@')[0]).trim();
        let picture = body.picture || LOGO_DEFAULT;
        if (picture.startsWith("data:") && picture.length > 150000) picture = LOGO_DEFAULT;
        if (!email.includes('@')) email += "@rumahgadang-ai.my.id";
        
        await env.DB.prepare(
          `INSERT INTO users (email, name, picture, time) VALUES (?,?,?,?)
           ON CONFLICT(email) DO UPDATE SET name=excluded.name, picture=excluded.picture, time=excluded.time`
        ).bind(email, name, picture, Date.now()).run();
        
        return new Response(JSON.stringify({ ok: true, email, name, picture }), { headers: h });
      }

      if (path === "/api/akun/login" && method === "POST") {
        const body = await req.json();
        let email = (body.email || "").toLowerCase().trim();
        if (!email.includes('@')) email += "@rumahgadang-ai.my.id";
        let u = await env.DB.prepare(`SELECT email,name,picture FROM users WHERE email=?`).bind(email).first();
        if(!u){
          let name = body.name || email.split('@')[0];
          let pic = LOGO_DEFAULT;
          await env.DB.prepare(`INSERT INTO users (email,name,picture,time) VALUES (?,?,?,?) ON CONFLICT(email) DO NOTHING`).bind(email,name,pic,Date.now()).run();
          return new Response(JSON.stringify({ ok: true, email, name, picture: pic }), { headers: h });
        }
        return new Response(JSON.stringify({ ok: true, email: u.email, name: u.name, picture: u.picture }), { headers: h });
      }

      // API PING ONLINE (Opsional pendukung frontend) - TETEP ADA
      if (path === "/api/akun/ping" && method === "POST") {
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 2. LIST SEMUA AKUN - SAMA PERSIS
      if (path === "/api/akun/list" && method === "GET") {
        const r1 = await env.DB.prepare("SELECT email, name, picture FROM users ORDER BY time DESC LIMIT 100").all().catch(()=>({results:[]}));
        return new Response(JSON.stringify(r1.results), { headers: h });
      }

      // 3. PROFILE - SAMA OUTPUTNYA, TAPI HITUNGNYA BARENGAN BIAR CEPET
      if (path === "/api/akun/profile" && method === "GET") {
        const targetEmail = (url.searchParams.get("email") || "").toLowerCase().trim();
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
        
        // Dulu: await satu-satu (4x nunggu). Sekarang: Promise.all (1x nunggu barengan)
        const [user, p, f, fg, c] = await Promise.all([
          env.DB.prepare("SELECT email, name, picture FROM users WHERE email=?").bind(targetEmail).first().catch(()=>null),
          env.DB.prepare("SELECT COUNT(*) as c FROM tulis WHERE email=? OR user_email=?").bind(targetEmail,targetEmail).first().catch(()=>({c:0})),
          env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE following_email=?").bind(targetEmail).first().catch(()=>({c:0})),
          env.DB.prepare("SELECT COUNT(*) as c FROM follows WHERE follower_email=?").bind(targetEmail).first().catch(()=>({c:0})),
          myEmail ? env.DB.prepare("SELECT 1 as x FROM follows WHERE follower_email=? AND following_email=?").bind(myEmail,targetEmail).first().catch(()=>null) : Promise.resolve(null)
        ]);
        
        return new Response(JSON.stringify({
          email: targetEmail, 
          name: user?.name || targetEmail.split('@')[0],
          picture: user?.picture || LOGO_DEFAULT, 
          posts: p?.c || 0, 
          followers: f?.c || 0, 
          following: fg?.c || 0, 
          isFollowing: !!c
        }), { headers: h });
      }

      // 4. UPDATE PROFIL - SAMA PERSIS
      if (path === "/api/akun/update" && method === "POST") {
        const { email, name, picture } = await req.json();
        const cleanEmail = (email || "").toLowerCase().trim();
        let pic = picture || LOGO_DEFAULT;
        if(pic.startsWith("data:") && pic.length>150000) pic = LOGO_DEFAULT;
        await env.DB.prepare("UPDATE users SET name=COALESCE(?,name), picture=COALESCE(?,picture) WHERE email=?").bind(name||null, pic||null, cleanEmail).run();
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 5. FOLLOW - SAMA PERSIS
      if (path === "/api/follow" && method === "POST") {
        const body = await req.json();
        const follower = (body.follower || "").toLowerCase().trim();
        const following = (body.following || "").toLowerCase().trim();
        if (follower === following) return new Response(JSON.stringify({ ok: false }), { headers: h });
        const existing = await env.DB.prepare("SELECT follower_email FROM follows WHERE follower_email=? AND following_email=?").bind(follower, following).first();
        if (existing) {
          await env.DB.prepare("DELETE FROM follows WHERE follower_email=? AND following_email=?").bind(follower, following).run();
          return new Response(JSON.stringify({ ok: true, status: "unfollowed" }), { headers: h });
        } else {
          await env.DB.prepare("INSERT INTO follows (follower_email, following_email, created_at) VALUES (?,?,?)").bind(follower, following, Date.now()).run();
          return new Response(JSON.stringify({ ok: true, status: "followed" }), { headers: h });
        }
      }

      // 6. FOLLOWERS & FOLLOWING - SAMA PERSIS
      if (path === "/api/followers" || path === "/api/following") {
        const email = (url.searchParams.get("email") || "").toLowerCase().trim();
        let sql = path.includes("followers") 
          ? `SELECT u.email, u.name, u.picture FROM follows f JOIN users u ON f.follower_email=u.email WHERE f.following_email=?`
          : `SELECT u.email, u.name, u.picture FROM follows f JOIN users u ON f.following_email=u.email WHERE f.follower_email=?`;
        const result = await env.DB.prepare(sql).bind(email).all().catch(()=>({results:[]}));
        return new Response(JSON.stringify(result.results||[]), { headers: h });
      }

      // 7. FOTO V2 - SAMA PERSIS, TAPI SIMPENNYA PAKE BATCH BIAR GAK 12x AWAIT
      if (path === "/api/akun/photos") {
        if (method === "POST") {
          const { email, photos } = await req.json();
          const clean = (email || "").toLowerCase().trim();
          if (!photos || !Array.isArray(photos)) return new Response(JSON.stringify({ ok: false }), { headers: h, status:400 });
          // Hapus dulu yang lama
          await env.DB.prepare("DELETE FROM d1consule_photos_v2 WHERE email=?").bind(clean).run();
          // Simpen baru pake batch, bukan for-await satu-satu
          const limited = photos.slice(0,12);
          if (limited.length > 0) {
            await env.DB.batch(limited.map((photo, i) => 
              env.DB.prepare("INSERT INTO d1consule_photos_v2 (email, idx, photo, updated_at) VALUES (?,?,?,?)").bind(clean, i, photo, Date.now())
            ));
          }
          return new Response(JSON.stringify({ ok: true, count: photos.length }), { headers: h });
        }
        if (method === "GET") {
          const email = (url.searchParams.get("email") || "").toLowerCase().trim();
          const res = await env.DB.prepare("SELECT photo FROM d1consule_photos_v2 WHERE email=? ORDER BY idx ASC").bind(email).all().catch(()=>({results:[]}));
          return new Response(JSON.stringify((res.results||[]).map(r=>r.photo)), { headers: h });
        }
      }

      // 8. API LIKE FOTO PERMANEN - SAMA PERSIS, TAPI COUNT + CEK LIKE BARENGAN
      if (path === "/api/photo/like") {
        let photo_key = url.searchParams.get("photo_key");
        let user_email = (url.searchParams.get("user_email") || "").toLowerCase().trim();

        if (method === "POST") {
          const body = await req.json().catch(()=>({}));
          photo_key = body.photo_key || photo_key;
          user_email = (body.user_email || user_email).toLowerCase().trim();
          
          if (!photo_key || !user_email) return new Response(JSON.stringify({ ok: false, error: "Missing data" }), { headers: h, status: 400 });
          
          const existing = await env.DB.prepare("SELECT 1 FROM photo_likes WHERE photo_key=? AND user_email=?").bind(photo_key, user_email).first();
          if (existing) {
            await env.DB.prepare("DELETE FROM photo_likes WHERE photo_key=? AND user_email=?").bind(photo_key, user_email).run();
          } else {
            await env.DB.prepare("INSERT OR IGNORE INTO photo_likes (photo_key, user_email) VALUES (?,?)").bind(photo_key, user_email).run();
          }
        }
        
        if (!photo_key) return new Response(JSON.stringify({ ok: false, error: "Missing photo_key" }), { headers: h, status: 400 });

        const [countRes, likedRes] = await Promise.all([
          env.DB.prepare("SELECT COUNT(*) as c FROM photo_likes WHERE photo_key=?").bind(photo_key).first().catch(()=>({c:0})),
          user_email ? env.DB.prepare("SELECT 1 FROM photo_likes WHERE photo_key=? AND user_email=?").bind(photo_key, user_email).first().catch(()=>null) : Promise.resolve(null)
        ]);
        
        return new Response(JSON.stringify({ ok: true, likes: countRes?.c || 0, likedByMe: !!likedRes }), { headers: h });
      }

      // 9. API LIKE KOMENTAR - SAMA PERSIS
      if (path === "/api/akun/komen/like" && method === "POST") {
        const { comment_id, email } = await req.json().catch(()=>({}));
        const cleanEmail = (email || "").toLowerCase().trim();
        if (!comment_id || !cleanEmail) return new Response(JSON.stringify({ ok: false }), { headers: h, status: 400 });
        
        const existing = await env.DB.prepare("SELECT 1 FROM comment_likes WHERE comment_id=? AND user_email=?").bind(comment_id, cleanEmail).first();
        if (existing) {
          await env.DB.prepare("DELETE FROM comment_likes WHERE comment_id=? AND user_email=?").bind(comment_id, cleanEmail).run();
        } else {
          await env.DB.prepare("INSERT OR IGNORE INTO comment_likes (comment_id, user_email) VALUES (?,?)").bind(comment_id, cleanEmail).run();
        }
        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      // 10. API KOMENTAR & DELETE KOMENTAR - SAMA OUTPUTNYA, TAPI GAK LOOP 1-1 LAGI
      if (path === "/api/photo/comment") {
        if (method === "POST") {
          const { photo_key, user_name, comment } = await req.json().catch(()=>({}));
          if (!photo_key || !comment) return new Response(JSON.stringify({ ok: false }), { headers: h, status: 400 });
          await env.DB.prepare("INSERT INTO photo_comments (photo_key, user_name, comment, time) VALUES (?,?,?,?)")
            .bind(photo_key, user_name || "Dunsanak", comment.trim(), Date.now()).run();
          return new Response(JSON.stringify({ ok: true }), { headers: h });
        }
        if (method === "DELETE") {
          const { comment_id } = await req.json().catch(()=>({}));
          if (!comment_id) return new Response(JSON.stringify({ ok: false }), { headers: h, status: 400 });
          await env.DB.prepare("DELETE FROM photo_comments WHERE id=?").bind(comment_id).run();
          await env.DB.prepare("DELETE FROM comment_likes WHERE comment_id=?").bind(comment_id).run();
          return new Response(JSON.stringify({ ok: true }), { headers: h });
        }
        
        const photo_key = url.searchParams.get("photo_key");
        const myEmail = (url.searchParams.get("me") || "").toLowerCase().trim();
        
        const comments = await env.DB.prepare("SELECT id, user_name as user, comment as text, time FROM photo_comments WHERE photo_key=? ORDER BY id ASC").bind(photo_key).all().catch(()=>({results:[]}));
        const list = comments.results || [];
        if (list.length === 0) return new Response(JSON.stringify([]), { headers: h });

        // Dulu: for loop, tiap komentar 2x query = kalau 50 komen = 100x query.
        // Sekarang: 2x query aja total pake IN + GROUP BY.
        const ids = list.map(c => c.id);
        const placeholders = ids.map(() => "?").join(",");
        
        const [likeCounts, myLikes] = await Promise.all([
          env.DB.prepare(`SELECT comment_id, COUNT(*) as c FROM comment_likes WHERE comment_id IN (${placeholders}) GROUP BY comment_id`).bind(...ids).all().catch(()=>({results:[]})),
          myEmail ? env.DB.prepare(`SELECT comment_id FROM comment_likes WHERE comment_id IN (${placeholders}) AND user_email=?`).bind(...ids, myEmail).all().catch(()=>({results:[]})) : Promise.resolve({results:[]})
        ]);

        const countMap = {};
        (likeCounts.results||[]).forEach(r => countMap[r.comment_id] = r.c);
        const myLikeSet = new Set((myLikes.results||[]).map(r => r.comment_id));

        let results = list.map(c => ({
          ...c,
          likes: countMap[c.id] || 0,
          likedByMe: myLikeSet.has(c.id)
        }));
        
        return new Response(JSON.stringify(results), { headers: h });
      }

      // 11. API CHAT & CLEAR CHAT - SAMA PERSIS SEMUA
      if (path === "/api/chat/send" && method === "POST") {
        const { sender, receiver, message } = await req.json().catch(()=>({}));
        const cleanSender = (sender || "").toLowerCase().trim();
        const cleanReceiver = (receiver || "").toLowerCase().trim();
        const cleanMessage = (message || "").trim();

        if (!cleanSender || !cleanReceiver || !cleanMessage) {
          return new Response(JSON.stringify({ ok: false, error: "Data kurang" }), { headers: h, status: 400 });
        }

        await env.DB.prepare("INSERT INTO chats (sender, receiver, message, time) VALUES (?, ?, ?, ?)")
          .bind(cleanSender, cleanReceiver, cleanMessage, Date.now()).run();

        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

      if (path === "/api/chat/get" && method === "GET") {
        const user1 = (url.searchParams.get("user1") || "").toLowerCase().trim();
        const user2 = (url.searchParams.get("user2") || "").toLowerCase().trim();

        if (!user1 || !user2) {
          return new Response(JSON.stringify({ ok: false, messages: [] }), { headers: h });
        }

        const { results } = await env.DB.prepare(
          "SELECT * FROM chats WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY id ASC"
        ).bind(user1, user2, user2, user1).all().catch(()=>({results:[]}));

        return new Response(JSON.stringify({ ok: true, messages: results || [] }), { headers: h });
      }

      // BARU: CEK UNREAD SEMUA TEMAN SEKALIGUS - BIAR FRONTEND GAK PERLU 100x FETCH
      // Cara pakenya: /api/chat/unread-all?me=email_gue
      // Baliknya: { ok:true, unread: ["teman1@...", "teman2@..."] }
      // Endpoint lama /api/chat/get TETEP ADA, ini cuma tambahan biar cepet.
      if (path === "/api/chat/unread-all" && method === "GET") {
        const me = (url.searchParams.get("me") || "").toLowerCase().trim();
        if (!me) return new Response(JSON.stringify({ ok: false, unread: [] }), { headers: h });
        // Ambil chat terakhir dari tiap pengirim yang kirim ke gue
        const { results } = await env.DB.prepare(
          `SELECT sender, MAX(time) as last_time FROM chats WHERE receiver = ? GROUP BY sender ORDER BY last_time DESC LIMIT 50`
        ).bind(me).all().catch(()=>({results:[]}));
        // Frontend yang ngecek rg_read_ nya, kita balikin aja siapa aja yang pernah chat
        return new Response(JSON.stringify({ ok: true, unread: (results||[]).map(r => r.sender) }), { headers: h });
      }

      // TAMBAHAN ENDPOINT HAPUS SEMUA CHAT - SAMA PERSIS
      if (path === "/api/chat/clear" && method === "POST") {
        const { user1, user2 } = await req.json().catch(()=>({}));
        const cleanUser1 = (user1 || "").toLowerCase().trim();
        const cleanUser2 = (user2 || "").toLowerCase().trim();

        if (!cleanUser1 || !cleanUser2) {
          return new Response(JSON.stringify({ ok: false, error: "User kurang" }), { headers: h, status: 400 });
        }

        await env.DB.prepare(
          "DELETE FROM chats WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)"
        ).bind(cleanUser1, cleanUser2, cleanUser2, cleanUser1).run();

        return new Response(JSON.stringify({ ok: true }), { headers: h });
      }

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { headers: h, status: 500 });
    }
    return null;
  }
};

export default AKUN_API;
