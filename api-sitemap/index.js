export const SITEMAP_API = {
  async handle(req, env, url, cors) {
    const base = "https://rumahgadang-ai.my.id";
    const logo = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";

    // ROBOTS - GOOGLE CUMA KE SITEMAP BOS
    if (url.pathname === "/robots.txt") {
      return new Response(`User-agent: *
Allow: /
Sitemap: ${base}/sitemap.xml`, 
      { headers: { "Content-Type": "text/plain" } });
    }

    // SITEMAP - LOGO BOLA DUNIA FULL DISINI BOS!
    if (url.pathname === "/sitemap.xml" || url.pathname === "/api/sitemap") {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${base}/</loc>
    <priority>1.0</priority>
    <image:image><image:loc>${logo}</image:loc><image:title>Rumah Gadang AI</image:title></image:image>
  </url>
  <url><loc>${base}/foto</loc><priority>0.9</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
  <url><loc>${base}/video</loc><priority>0.9</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
  <url><loc>${base}/ai</loc><priority>0.8</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
  <url><loc>${base}/kantor</loc><priority>0.7</priority><image:image><image:loc>${logo}</image:loc></image:image></url>
</urlset>`;
      return new Response(xml, { headers: { "Content-Type": "application/xml" } });
    }

    // SCHEMA LOGO - JUGA DISINI BOS!
    if (url.pathname === "/api/logo" || url.pathname === "/api/schema") {
      return new Response(JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Rumah Gadang AI",
        "url": base,
        "logo": logo,
        "image": logo
      }), { headers: cors });
    }
    return null;
  }
}
