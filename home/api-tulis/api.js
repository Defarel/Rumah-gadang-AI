export const TULIS_API = {
  async handle(req, env, url, cors) {
    const path = url.pathname;
    if (!path.startsWith('/api/tulis')) return null;

    if (req.method === 'GET') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM tulis ORDER BY id DESC LIMIT 50").all();
        return new Response(JSON.stringify(results || []), { headers: cors });
      } catch (e) {
        // Kalau tabel belum ada Bos, bikin kosong dulu Bos biar gak loading terus!
        return new Response(JSON.stringify([]), { headers: cors });
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();
      await env.DB.prepare("INSERT INTO tulis (isi, user_id, created_at) VALUES (?, ?, ?)").bind(body.isi, body.user || 'anon', Date.now()).run();
      return new Response(JSON.stringify({ ok: true }), { headers: cors });
    }
    return null;
  }
}
