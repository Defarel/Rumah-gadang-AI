// api-sitemap/index.js - KUNCI 6: SITEMAP BOS!
export const SITEMAP_API = {
  async handle(req, env, url) {
    const path = url.pathname;

    // /sitemap.xml dan /sitemap Bos
    if (path === '/sitemap.xml' || path === '/sitemap' || path === '/sitemap/') {
      const host = url.hostname; // www.rumahgadang-ai.my.id
      const origin = `https://${host}`;
      const date = new Date().toISOString().split('T')[0]; // 2026-10-14 kayak di foto Bos!

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/foto</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/video</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/ai</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/akun</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/kantor</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // /robots.txt Bos
    if (path === '/robots.txt') {
      const host = url.hostname;
      const robots = `User-agent: *
Allow: /

Sitemap: https://${host}/sitemap.xml
`;
      return new Response(robots, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    return null; // bukan urusan sitemap
  }
}
