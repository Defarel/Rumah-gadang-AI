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
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Email'
    };
    if(req.method === "OPTIONS") return new Response("", {headers: cors});

    try{
      if(env.DB){
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS local_videos (id TEXT PRIMARY KEY, created_at INTEGER)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS blocked_videos (id TEXT PRIMARY KEY)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS profiles (email TEXT PRIMARY KEY, name TEXT, bio TEXT, picture TEXT)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, username TEXT, picture TEXT)").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS followers (follower_id TEXT, following_id TEXT, PRIMARY KEY (follower_id, following_id))").run();
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS tulisan (id TEXT PRIMARY KEY, judul TEXT, isi TEXT, created_at INTEGER)").run();
      }
    }catch(e){}

    let r;
    r = await SITEMAP_API.handle(req, env, url);
    if(r) return r;

    // BOS! API DULU BOS!
    if(path.startsWith('/api/')){
      r = await TULIS_API.handle(req, env, url, cors);
      if(r) return r;
      r = await FOTO_API.handle(req, env, url, cors);
      if(r) return r;
      r = await VIDEO_API.handle(req, env, url, cors);
      if(r) return r;
      r = await AI_API.handle(req, env, url, cors);
      if(r) return r;
      r = await AKUN_API.handle(req, env, url, cors);
      if(r) return r;
      
      // BOS! JANGAN RETURN [] BOS! RETURN 404 BOS BIAR KETAHUAN BOS!
      return new Response(JSON.stringify({error:"API not found: "+path}), {status:404, headers: cors});
    }

    // BOS! HALAMAN HTML BOS!
    if(path === "/" || path === "/home") {
      return new Response(HOME_HTML, {headers: {'Content-Type':'text/html'}});
    }
    if(path.startsWith("/video")) {
      return new Response(VIDEO_HTML, {headers: {'Content-Type':'text/html'}});
    }
    if(path.startsWith("/foto")) {
      return new Response(FOTO_HTML, {headers: {'Content-Type':'text/html'}});
    }
    if(path.startsWith("/ai")) {
      return new Response(AI_HTML, {headers: {'Content-Type':'text/html'}});
    }
    if(path.startsWith("/kantor")) {
      return new Response(KANTOR_HTML, {headers: {'Content-Type':'text/html'}});
    }
    if(path.startsWith("/akun") || path.startsWith("/a/") || path === "/a") {
      return new Response(AKUN_HTML, {headers: {'Content-Type':'text/html'}});
    }
    // BOS! UNTUK @username BOS! MISAL /naura BOS!
    if(path.length > 1 && !path.includes(".") && !path.startsWith("/api")){
      let username = path.replace("/","").split("/")[0].toLowerCase();
      let blocked = ["foto","video","ai","kantor","tulis","api","sitemap","robots"];
      if(!blocked.includes(username)){
        return new Response(AKUN_HTML, {headers: {'Content-Type':'text/html'}});
      }
    }

    return new Response(HOME_HTML, {headers: {'Content-Type':'text/html'}});
  }
}
