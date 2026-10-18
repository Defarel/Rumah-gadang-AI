import { LOGO, GLOBAL_VIDEOS, ADMIN_EMAILS } from './config.js';
import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';
import { FOTO_HTML } from './foto/index.js';
import { VIDEO_HTML } from './video/index.js';
import { KANTOR_HTML } from './kantor/index.js';
import { AKUN_HTML } from './akun/index.js';

// OTAK (API) - SESUAI FOTO BOS!
import { AI_API } from './ai/api-ai/api.js';
import { AKUN_API } from './akun/api-akun/api.js';
import { FOTO_API } from './foto/api-foto/api.js';
import { TULIS_API } from './home/api-tulis/api.js'; // ini yang di foto Bos masih di dalam home
import { SITEMAP_API } from './api-sitemap/index.js';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    // 1. SITEMAP DULUAN BOS! (KUNCI 6)
    let sitemapRes = await SITEMAP_API.handle(req, env, url);
    if (sitemapRes) return sitemapRes;

    // 2. API - OTAK (KUNCI 1-5)
    let apiRes = null;
    
    apiRes = await AI_API.handle(req, env, url, cors);
    if (apiRes) return apiRes;
    
    apiRes = await AKUN_API.handle(req, env, url, cors);
    if (apiRes) return apiRes;
    
    apiRes = await FOTO_API.handle(req, env, url, cors);
    if (apiRes) return apiRes;
    
    apiRes = await TULIS_API.handle(req, env, url, cors);
    if (apiRes) return apiRes;

    // 3. TAMPILAN - HTML
    if (path === '/ai' || path === '/ai/') {
      return new Response(AI_HTML, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }
    if (path === '/akun' || path === '/akun/' || path.startsWith('/u/')) {
      return new Response(AKUN_HTML, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }
    if (path === '/foto' || path === '/foto/') {
      return new Response(FOTO_HTML, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // Kalau bukan halaman statis, anggap username
    const STATIC_ROUTES = ['/', '/foto', '/video', '/ai', '/akun', '/kantor', '/home', '/api', '/sitemap.xml', '/robots.txt'];
    const isStatic = STATIC_ROUTES.some(r => path === r || path.startsWith(r + "/"));
    if (path.length > 1 && !isStatic && !path.includes(".") && !path.startsWith("/u/")) {
      return new Response(AKUN_HTML, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    return new Response("404 Bos - Halaman gak ada", { status: 404, headers: { "Content-Type": "text/html" } });
  } // <- INI YANG HILANG TADI DI LINE 178 BOS!
} // <- INI JUGA YANG HILANG BOS!
