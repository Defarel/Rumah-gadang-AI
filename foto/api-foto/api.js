export const FOTO_API = {
  async handle(req, env, url, cors) {
    if (!url.pathname.startsWith('/api/foto')) return null;
    if (req.method === 'GET') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM fotos ORDER BY id DESC LIMIT 100").all();
        return new Response(JSON.stringify(results || []), { headers: cors });
      } catch (e) {
        return new Response(JSON.stringify([]), { headers: cors });
      }
    }
    if (req.method === 'POST') {
      const b = await req.json();
      // Bos simpan URL foto nya langsung di D1 Bos, gak pake R2 Bos!
      await env.DB.prepare("INSERT INTO fotos (url, caption, user_id, created_at) VALUES (?, ?, ?, ?)").bind(b.url, b.caption, b.user || 'anon', Date.now()).run();
      return new Response(JSON.stringify({ ok: true }), { headers: cors });
    }
    return null;
  }
}
