import { HOME_HTML } from "./home/index.js";
export default {
 async fetch(req, env) {
  const url = new URL(req.url);
  if (url.pathname === "/api/tulis") {
   if (req.method === "POST") {
    const b = await req.json();
    const id = Date.now().toString();
    await env.DB.prepare("INSERT INTO tulisan (id, isi, email, created_at) VALUES (?,?,?,?)").bind(id, b.isi||b.text||'', b.email||'admin', Date.now()).run();
    return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json'}});
   } else {
    const {results} = await env.DB.prepare("SELECT * FROM tulisan ORDER BY created_at DESC LIMIT 100").all();
    return new Response(JSON.stringify(results), {headers:{'Content-Type':'application/json'}});
   }
  }
  return new Response(HOME_HTML, {headers:{'Content-Type':'text/html'}});
 }
}
