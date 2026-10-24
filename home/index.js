export default `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - Komunitas Minangkabau</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:system-ui,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:90px;border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;box-shadow:0 0 18px rgba(0,255,136,0.55)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #151515;position:sticky;top:0;background:#000;z-index:20}
.logo{width:38px;height:38px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.brand{font-weight:900;font-size:15px}
.btnLogin{background:#fff;color:#000;border:0;padding:7px 16px;border-radius:22px;font-weight:900;font-size:12px;cursor:pointer}
.box{padding:12px;background:#080808;border-bottom:2.5px solid #00ff88}
.inputRow{display:flex;gap:8px;align-items:center}
.txt{flex:1;background:#121212;border:2px solid #00ff88;color:#fff;padding:14px 16px;border-radius:16px;font-size:15px;outline:none}
.btnPlus{width:50px;height:50px;background:#1a1a1a;border:1.5px solid #2a2a2a;color:#fff;border-radius:14px;font-size:28px;font-weight:900;display:grid;place-items:center;cursor:pointer}
.btnKirim{width:100%;margin-top:12px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:16px;font-weight:900;font-size:15px;cursor:pointer}
#preview{margin-top:12px;display:none;position:relative}
#preview img{width:100%;border-radius:14px;max-height:400px;object-fit:cover;border:1.5px solid #00ff88}
#preview span{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.85);color:#fff;padding:6px 11px;border-radius:22px;cursor:pointer;border:1px solid #333;font-size:12px}
.post{padding:14px;display:flex;gap:11px;background:#0c0c0c;margin:12px 10px;border-radius:16px;border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;border-top:1px solid #1e1e1e;box-shadow:0 0 12px rgba(0,255,136,0.35)}
.post-av{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;flex-shrink:0;cursor:pointer}
.post-body{flex:1;min-width:0}
.post-name{font-weight:800;font-size:14px;color:#fff;cursor:pointer}
.post-email{font-size:11px;color:#00ff88;margin-left:4px;pointer-events:none}
.post-time{font-size:11px;color:#777;margin-left:6px}
.post-text{margin-top:7px;font-size:14.5px;line-height:1.55;color:#f0f0f0;white-space:pre-wrap;word-break:break-word}
.post-img{margin-top:11px;border-radius:12px;overflow:hidden;border:1.5px solid #222}
.post-img img{width:100%;display:block}
.like-bar{margin-top:11px;display:flex;gap:8px}
.btn-like{background:#161616;border:1px solid #2a2a2a;color:#ddd;padding:8px 16px;border-radius:22px;font-size:13px;cursor:pointer;font-weight:700}
.btn-like.liked{background:#00ff88;color:#000;border-color:#00ff88;font-weight:900}
.del{background:#ff1a1a;color:#fff;border:0;padding:7px 13px;border-radius:22px;font-size:11px;margin-left:auto;cursor:pointer}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:525px;background:#000;border-top:2.5px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#00ff88}
.bot a span{font-size:10px;display:block;margin-top:2px;font-weight:700}
.empty{text-align:center;padding:50px 20px;color:#666}
#komenSheet{display:none;position:fixed;inset:0;z-index:999;background:rgba(0,0,0,0.7)}
#komenSheet.show{display:block}
.komen-panel{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:525px;background:#0f0f0f;border-top-left-radius:18px;border-top-right-radius:18px;max-height:85vh;display:flex;flex-direction:column;border-top:2.5px solid #00ff88;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translate(-50%,100%)}to{transform:translate(-50%,0)}}
.komen-handle{width:40px;height:4px;background:#333;border-radius:10px;margin:10px auto}
.komen-head{padding:0 16px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222}
.komen-title{font-weight:900;font-size:20px}
.komen-close{font-size:22px;padding:6px 10px;cursor:pointer}
.komen-list{flex:1;overflow-y:auto;padding:10px 16px;display:flex;flex-direction:column;gap:18px}
.k-item{display:flex;gap:10px}
.k-av{width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;background:#222;border:1px solid #333}
.k-body{flex:1;min-width:0}
.k-user{font-size:13px;color:#aaa;display:flex;gap:6px;flex-wrap:wrap}
.k-user b{color:#fff}
.k-text{margin-top:4px;font-size:14.5px;line-height:1.5;color:#f1f1f1;white-space:pre-wrap;word-break:break-word}
.k-actions{margin-top:8px;display:flex;gap:20px;align-items:center}
.k-act{display:flex;gap:6px;align-items:center;font-size:14px;color:#aaa;cursor:pointer;padding:6px 12px;border-radius:16px;border:1px solid #2a2a2a;background:#1a1a1a}
.k-act:active{transform:scale(0.95)}
.k-act.loved{background:#ff2d55;color:#fff;border-color:#ff2d55;font-weight:900}
.k-input-bar{padding:10px 12px;border-top:1px solid #222;display:flex;gap:10px;align-items:center;background:#0f0f0f}
.k-input{flex:1;background:#222;border:1px solid #333;color:#fff;padding:12px 16px;border-radius:24px;font-size:14px;outline:none}
.k-send{width:40px;height:40px;background:#00ff88;border-radius:50%;display:grid;place-items:center;cursor:pointer;color:#000;font-weight:900;border:0;font-size:18px}
</style></head><body>
<div id=app>
<div class=top><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class=logo><div class=brand>RUMAH GADANG AI</div></div><button class=btnLogin id=btnLoginTop onclick="location.href='/akun'">LOGIN</button></div>
<div class=box>
<div class=inputRow>
<input id=tulisIn class=txt placeholder="Tulis disini sanak...">
<button class=btnPlus onclick="document.getElementById('fileIn').click()">+</button>
</div>
<div id=preview><img id=prevImg><span onclick="clearImg()">✕ Hapus</span></div>
<button class=btnKirim onclick="addTulis()">KIRIM</button>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>
<div id=homeFeed><div class=empty>Tunggu sanak...</div></div>
</div>
<div class=bot>
<a href="/" class=on>🏠<br><span>Home</span></a>
<a href="/foto">🖼️<br><span>Foto</span></a>
<a href="/video">🎬<br><span>Video</span></a>
<a href="/kantor">🏢<br><span>Kantor</span></a>
<a href="/ai">🤖<br><span>AI</span></a>
<a href="/akun">👤<br><span>Akun</span></a>
</div>

<div id=komenSheet onclick="if(event.target.id==='komenSheet') closeKomen()">
<div class=komen-panel>
<div class=komen-handle></div>
<div class=komen-head><div class=komen-title>Komentar</div><div class=komen-close onclick="closeKomen()">✕</div></div>
<div id=komenList class=komen-list><div class=empty>Memuat komen...</div></div>
<div class=k-input-bar><img id=kMyAv src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" style="width:32px;height:32px;border-radius:50%;object-fit:cover"><input id=kInput class=k-input placeholder="Bagikan pemikiran Anda..."><button class=k-send onclick="sendKomen()">➤</button></div>
</div>
</div>

<script>
const LOGO_FALLBACK="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
const ADMIN_EMAILS=["admin@rumahgadang-ai.my.id","naura@rumahgadang-ai.my.id","defarel@rumahgadang-ai.my.id"];
let selectedImg=""; let activeTulisId=""; let activeKomen=[];
function getEmail(){let e=(localStorage.getItem('rg_email')||"").toLowerCase().trim(); if(e && !e.includes('@')) e=e+'@rumahgadang-ai.my.id'; return e;}
function getName(){return localStorage.getItem('rg_name')|| (getEmail()?getEmail().split('@')[0]:'Dunsanak');}
function getAvatar(){return localStorage.getItem('rg_avatar')||LOGO_FALLBACK;}
function isAdmin(){return ADMIN_EMAILS.includes(getEmail());}
function clearImg(){selectedImg="";document.getElementById('preview').style.display='none';document.getElementById('prevImg').src="";document.getElementById('fileIn').value="";}
function openProfil(email){ if(!email) return; location.href='/akun?profil='+encodeURIComponent(email); }
document.getElementById('fileIn').addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 let r=new FileReader();
 r.onload=function(ev){
   let img=new Image();
   img.onload=function(){
     let canvas=document.createElement('canvas');
     let maxW=900; let w=img.width,h=img.height;
     if(w>maxW||h>maxW){ if(w>h){h*=maxW/w;w=maxW;} else {w*=maxW/h;h=maxW;} }
     canvas.width=w; canvas.height=h;
     canvas.getContext('2d').drawImage(img,0,0,w,h);
     selectedImg=canvas.toDataURL('image/jpeg',0.65);
     document.getElementById('prevImg').src=selectedImg;
     document.getElementById('preview').style.display='block';
   };
   img.src=ev.target.result;
 };
 r.readAsDataURL(f);
});
function fmtTime(t){let diff=Date.now()-Number(t); if(diff<60000) return "baru"; if(diff<3600000) return Math.floor(diff/60000)+" mnt lalu"; if(diff<86400000) return Math.floor(diff/3600000)+" jam lalu"; if(diff<2592000000) return Math.floor(diff/86400000)+" hr lalu"; if(diff<31536000000) return Math.floor(diff/2592000000)+" bln lalu"; return Math.floor(diff/31536000000)+" thn lalu"; }
function fmtTimeFull(t){let d=new Date(Number(t)||Date.now()); return d.toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}

// LOVE POST - TANPA UNLIKE BOS
async function likeTulis(id){
  const email=getEmail(); if(!email){ alert("Login dulu Bos!"); location.href="/akun"; return; }
  const btn=document.getElementById("like-btn-"+id); if(btn) btn.innerHTML="❤️ ⏳";
  try{ await fetch("/api/tulis/like",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:String(id),email:email})}); }catch{}
  loadTulis();
}
function openKomen(id){
  activeTulisId=id;
  document.getElementById('kMyAv').src=getAvatar();
  document.getElementById('komenSheet').classList.add('show');
  document.getElementById('komenList').innerHTML='<div class=empty>Memuat...</div>';
  loadKomen(id);
}
function closeKomen(){ document.getElementById('komenSheet').classList.remove('show'); activeTulisId=""; }
async function loadKomen(id){
  const me=getEmail();
  let r=await fetch("/api/tulis/komen?id="+id+"&me="+encodeURIComponent(me)+"&t="+Date.now(),{cache:'no-store'});
  activeKomen=await r.json(); renderKomen();
}
function renderKomen(){
  let h=document.getElementById('komenList');
  if(!activeKomen.length){ h.innerHTML='<div class=empty>Belum ada komentar. Jadi yang pertama Bos!</div>'; return; }
  h.innerHTML=activeKomen.map(k=>{
    let name=k.name||(k.email||'').split('@')[0]||'Dunsanak';
    let pic=k.picture||LOGO_FALLBACK;
    let time=fmtTime(k.time||Date.now());
    let text=(k.text||'').replace(/</g,'&lt;');
    let loved=k.isLiked?" loved":"";
    return '<div class=k-item><img class=k-av src="'+pic+'" onerror="this.src=\\''+LOGO_FALLBACK+'\\'"><div class=k-body><div class=k-user><b>@'+name+'</b><span> • '+time+'</span></div><div class=k-text>'+text+'</div><div class=k-actions><div class="k-act'+loved+'" onclick="loveKomen(\\''+k.id+'\\')"><span>❤️</span><span>'+(k.likes>0?k.likes:'Love')+'</span></div><div class=k-act onclick="replyKomen(\\''+name+'\\')"><span>💬</span><span>Balas</span></div></div></div></div>';
  }).join('');
}
async function loveKomen(komen_id){
  const email=getEmail(); if(!email){ alert("Login dulu Bos!"); return; }
  try{ await fetch("/api/tulis/komen/like",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({komen_id:String(komen_id),email:email})}); await loadKomen(activeTulisId); }catch{}
}
function replyKomen(name){ let input=document.getElementById('kInput'); input.value="@"+name+" "; input.focus(); }
async function sendKomen(){
  let input=document.getElementById('kInput'); let text=input.value.trim(); if(!text) return;
  const email=getEmail(); if(!email){ alert("Login dulu Bos!"); location.href="/akun"; return; }
  input.value=""; await fetch("/api/tulis/komen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:String(activeTulisId),email:email,text:text,name:getName(),picture:getAvatar()})});
  await loadKomen(activeTulisId); loadTulis();
}
document.getElementById('kInput').addEventListener('keydown',e=>{ if(e.key==='Enter') sendKomen(); });
async function loadTulis(){
 try{
  const me=getEmail(); if(me) document.getElementById('btnLoginTop').innerText=me.split('@')[0].toUpperCase().slice(0,8);
  let r=await fetch('/api/tulis?me='+encodeURIComponent(me)+'&t='+Date.now(),{cache:'no-store'}); 
  let d=await r.json(); let list=Array.isArray(d)?d:(d.results||[]);
  let h=document.getElementById('homeFeed'); if(!list.length){h.innerHTML='<div class=empty>Belum ada tulisan Bos</div>';return;} let admin=isAdmin();
  h.innerHTML=list.map(x=>{
   let text=x.text||x.isi||x.judul||''; let img=x.tulisImg||x.img||''; let name=x.name||(x.email||'').split('@')[0]||'Dunsanak'; let email=x.user_email||x.email||''; let pic=x.picture||LOGO_FALLBACK; let time=x.time||x.created_at||Date.now(); let likedClass=x.isLiked?" liked":"";
   return '<div class=post id="post-'+x.id+'"><img class=post-av src="'+pic+'" onclick="openProfil(\\''+email+'\\')" onerror="this.src=\\''+LOGO_FALLBACK+'\\'"><div class=post-body><div><span class=post-name onclick="openProfil(\\''+email+'\\')">'+name+'</span><span class=post-email>'+email+'</span><span class=post-time> • '+fmtTimeFull(time)+'</span></div><div class=post-text>'+text.replace(/</g,'&lt;')+'</div>'+(img?'<div class=post-img><img src="'+img+'" loading=lazy></div>':'')+'<div class=like-bar><button id="like-btn-'+x.id+'" class="btn-like'+likedClass+'" onclick="likeTulis(\\''+x.id+'\\')">❤️ '+(x.likes||0)+'</button><button class=btn-like onclick="openKomen(\\''+x.id+'\\')">💬 Komen '+(x.komen_count||0)+'</button>'+(admin?'<button class=del onclick="hapusPost('+x.id+')">HAPUS</button>':'')+'</div></div></div>';
  }).join('');
 }catch(e){document.getElementById('homeFeed').innerHTML='<div class=empty>Error: '+e.message+'</div>';}
}
async function addTulis(){
 let txt=document.getElementById('tulisIn').value.trim(); if(!txt&&!selectedImg){alert("Tulis dulu sanak!");return;}
 let btn=document.querySelector('.btnKirim');btn.innerText="MENGIRIM...";btn.disabled=true;
 try{
  let email=getEmail()||'anon@rumahgadang-ai.my.id'; if(!email.includes('@'))email=email+'@rumahgadang-ai.my.id';
  let payload={text:txt,email:email,user_email:email,name:getName(),picture:getAvatar(),tulisImg:selectedImg,isi:txt,img:selectedImg};
  let r=await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  let j=await r.json(); if(j.ok===false)throw new Error(j.error||'Gagal');
  document.getElementById('tulisIn').value='';clearImg();await loadTulis();
 }catch(e){alert("Gagal Bos: "+e.message);}
 btn.innerText="KIRIM";btn.disabled=false;
}
async function hapusPost(id){if(!confirm("Hapus Bos?"))return;await fetch('/api/tulis/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});location.reload();}
loadTulis();
<\/script></body></html>
`;
