export const VIDEO_API = {
  async handle(req, env, url, cors) {
    if (!url.pathname.startsWith('/api/video')) return null;
    if (req.method === 'GET') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM local_videos ORDER BY id DESC LIMIT 50").all();
        return new Response(JSON.stringify(results || []), { headers: cors });
      } catch (e) {
        // Coba tabel videos Bos, kalau gak ada juga kasih kosong!
        try {
          const { results } = await env.DB.prepare("SELECT * FROM videos ORDER BY id DESC LIMIT 50").all();
          return new Response(JSON.stringify(results || []), { headers: cors });
        } catch {
          return new Response(JSON.stringify([]), { headers: cors });
        }
      }
    }
    return null;
  }
}
