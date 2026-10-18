export const TULIS_API = {
  async handle(req, env, url, cors) {
    const c = cors || {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"};
    const p = url.pathname;

    if(p==="/api/tulis" && req.method==="POST"){
      try{
        let j=await req.json();
        let isi = j.isi || j.text || j.judul || "";
        let email = (j.email || j.user_email || "sp.fc@rumahgadang-ai.my.id").toLowerCase();
        let picture = j.picture || j.tulisImg || "";
        let name = j.name || email.split('@')[0];
        if(!isi && !picture) return new Response(JSON.stringify({ok:false}),{headers:c});
        let id=Date.now().toString();
        let now=Date.now();
        await env.DB.prepare("INSERT INTO tulisan (id,email,isi,judul,picture,created_at,name,text,tulisImg,time) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(id,email,isi,isi,picture,now,name,isi,picture,now).run();
        return new Response(JSON.stringify({ok:true}),{headers:c});
      }catch(e){ return new Response(JSON.stringify({ok:false, error:e.message}),{headers:c, status:500}); }
    }

    if((p==="/api/tulis" || p==="/api/tulisan") && req.method==="GET"){
      try{
        let r=await env.DB.prepare("SELECT * FROM tulisan ORDER BY created_at DESC LIMIT 50").all();
        return new Response(JSON.stringify(r.results||[]),{headers:c});
      }catch{ return new Response(JSON.stringify([]),{headers:c}); }
    }

    if(p.startsWith("/api/tulis/delete")){
      try{
        let j=await req.json().catch(()=>({}));
        let id=j.id || url.searchParams.get('id');
        if(id) await env.DB.prepare("DELETE FROM tulisan WHERE id=?").bind(id).run();
        return new Response(JSON.stringify({ok:true}),{headers:c});
      }catch{ return new Response(JSON.stringify({ok:true}),{headers:c}); }
    }
    return null;
  }
}
