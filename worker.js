import { LOGO, GLOBAL_VIDEOS, ADMIN_EMAILS } from './config.js';
import { HOME_HTML } from './home/index.js';
import { AI_HTML } from './ai/index.js';
import { FOTO_HTML } from './foto/index.js';
import { VIDEO_HTML } from './video/index.js';
import { KANTOR_HTML } from './kantor/index.js';
import { AKUN_HTML } from './akun/index.js';
import { AI_API } from './ai/api-ai/api.js';
import { AKUN_API } from './akun/api-akun/api.js';
import { FOTO_API } from './foto/api-foto/api.js';
import { TULIS_API } from './home/api-tulis/api.js';
import { VIDEO_API } from './video/api-video/api.js';
import { SITEMAP_API } from './api-sitemap/index.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }});
    }

    // GET akun
    if (url.pathname === '/api/akun' && request.method === 'GET') {
      const userId = url.searchParams.get('id');
      const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
      return Response.json(user || {}, { headers: { 'Access-Control-Allow-Origin': '*' }});
    }

    // UPDATE akun - INI YANG BIKIN GAK BISA TADI BOS
    if (url.pathname === '/api/akun' && (request.method === 'POST' || request.method === 'PUT')) {
      try {
        const body = await request.json();
        const { id, name, email } = body;
        
        if (!id) return Response.json({ error: 'id wajib' }, { status: 400 });
        
        await env.DB.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
          .bind(name, email, id).run();
          
        // Kalau user belum ada, insert
        const cek = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(id).first();
        if (!cek) {
          await env.DB.prepare("INSERT INTO users (id, name, email) VALUES (?, ?, ?)")
            .bind(id, name, email).run();
        }

        return Response.json({ ok: true, msg: 'Akun berhasil diupdate' }, 
          { headers: { 'Access-Control-Allow-Origin': '*' }});
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    return fetch(request);
  }
}
