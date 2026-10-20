export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // init tabel
    try {
      if (env.DB) {
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS rg_users (email TEXT PRIMARY KEY, pass TEXT, name TEXT, picture TEXT, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulis (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_email TEXT, name TEXT, picture TEXT, tulisImg TEXT, url TEXT, likes INTEGER DEFAULT 0, time INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, time INTEGER)").run();
      }
    } catch (e) {}

    try {
      // API AKUN - KODE LU BOS
      if (path === '/api/akun') {
        if (request.method === 'GET') {
          const id = url.searchParams.get('id') || url.searchParams.get('email');
          if (!id) return Response.json({ok:false, error:'id wajib'}, {status:400, headers:cors});
          const user = await env.DB.prepare("SELECT * FROM rg_users WHERE email = ?").bind(id).first();
          return Response.json(user || {}, {headers:cors});
        }
        if (request.method === 'POST' || request.method === 'PUT') {
          const body = await request.json();
          const finalEmail = body.email || body.id;
          if (!finalEmail) return Response.json({error:'email wajib'}, {status:400, headers:cors});
          const cek = await env.DB.prepare("SELECT email FROM rg_users WHERE email = ?").bind(finalEmail).first();
          if (cek) {
            await env.DB.prepare("UPDATE rg_users SET name=?, picture=? WHERE email=?").bind(body.name, body.picture, finalEmail).run();
          } else {
            await env.DB.prepare("INSERT INTO rg_users (email, name, picture, time) VALUES (?,?,?,?)").bind(finalEmail, body.name, body.picture, Date.now()).run();
          }
          return Response.json({ok:true, msg:'Akun berhasil diupdate'}, {headers:cors});
        }
      }

      // API TULIS - BIAR HIJAU UPLOAD
      if (path.startsWith('/api/tulis')) {
        if (request.method === 'POST') {
          const b = await request.json();
          await env.DB.prepare("INSERT INTO tulis (text, user_email, name, picture, tulisImg, time) VALUES (?,?,?,?,?,?)")
            .bind(b.text||b.isi, b.user_email||b.email, b.name, b.picture, b.tulisImg, Date.now()).run();
          return Response.json({ok:true, msg:'Tulisan ke-upload'}, {headers:cors});
        }
        if (request.method === 'GET') {
          const {results} = await env.DB.prepare("SELECT * FROM tulis ORDER BY time DESC LIMIT 50").all();
          return Response.json(results||[], {headers:cors});
        }
      }

      if (path.startsWith('/api/')) {
        return Response.json({ok:true, status:'API Ready Bos'}, {headers:cors});
      }

      return new Response("<h1>Rumah Gadang AI - Worker HIJAU Bos</h1><p>API /api/akun dan /api/tulis aktif</p>", {headers:{"Content-Type":"text/html;charset=utf-8"}});
    } catch (err) {
      return Response.json({ok:false, error:err.message}, {status:500, headers:cors});
    }
  }
}
