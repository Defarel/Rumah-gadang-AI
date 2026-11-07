export const SITEMAP_API = {
  async handle(req, env, url, cors) {
    const base = "https://rumahgadang-ai.my.id";
    const logo = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

    // ROBOTS - CUMA 5 INI DOANG YANG BOLEH, BOS!
    if (url.pathname === "/robots.txt") {
      return new Response(`User-agent: *
Allow: /
Allow: /foto
Allow: /video
Allow: /ai
Allow: /akun
Disallow: /kantor
Disallow: /luar
Disallow: /dalam
Disallow: /api/akun/update
Disallow: /api/akun/register
Disallow: /api/register
Disallow: /api/tulis/delete
Disallow: /api/ig-curated/delete
Disallow: /api/debug
Sitemap: ${base}/sitemap.xml
Host: ${base}`, 
      { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // SITEMAP - CUMA 5 INI DOANG, BOS!
    if (url.pathname === "/sitemap.xml" || url.pathname === "/api/sitemap") {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${base}/</loc>
    <lastmod>2026-11-07</lastmod>
    <priority>1.0</priority>
    <image:image><image:loc>${logo}</image:loc><image:title>Rumah Gadang AI</image:title></image:image>
  </url>
  <url><loc>${base}/foto</loc><lastmod>2026-11-07</lastmod><priority>0.9</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
  <url><loc>${base}/video</loc><lastmod>2026-11-07</lastmod><priority>0.9</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
  <url><loc>${base}/ai</loc><lastmod>2026-11-07</lastmod><priority>0.8</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
  <url><loc>${base}/akun</loc><lastmod>2026-11-07</lastmod><priority>0.7</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
</urlset>`;
      return new Response(xml, { 
        headers: { 
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff"
        } 
      });
    }

    // SCHEMA LOGO - TETEP ADA, BOS!
    if (url.pathname === "/api/logo" || url.pathname === "/api/schema") {
      return new Response(JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Rumah Gadang AI",
        "url": base,
        "logo": logo,
        "image": logo
      }), { headers: { ...cors, "Content-Type": "application/json; charset=utf-8" } });
    }
    return null;
  }
}
