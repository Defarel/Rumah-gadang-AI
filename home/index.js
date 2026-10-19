export const HOME_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - Komunitas Minangkabau</title>
<meta name="description" content="Rumah Gadang AI - Komunitas digital Minangkabau">
<meta name="robots" content="index, follow">
<link rel="icon" href="/icon.png">
<link rel="canonical" href="https://www.rumahgadang-ai.my.id/">
<meta property="og:image" content="/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:system-ui,-apple-system,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:90px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 18px rgba(0,255,136,0.5)}
.top{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);z-index:10}
.logo{width:38px;height:38px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.box{padding:14px;background:#0a0a0a;border-bottom:2px solid #00ff88}
.inputRow{display:flex;gap:10px;align-items:center}
.avatarMini{width:42px;height:42px;border-radius:50%;border:1.5px solid #00ff88;object-fit:cover;flex-shrink:0}
.txt{flex:1;background:#111;border:2px solid #00ff88;color:#fff;padding:14px 16px;border-radius:16px;font-size:15px;outline:none;transition:.2s}
.txt:focus{border-color:#00ff88;box-shadow:0 0 10px rgba(0,255,136,0.3)}
.btnPlus{width:48px;height:48px;background:#1a1a1a;border:2px solid #333;color:#00ff88;border-radius:14px;font-size:28px;font-weight:900;display:grid;place-items:center;cursor:pointer;transition:.2s}
.btnPlus:active{transform:scale(0.95)}
.btnKirim{width:100%;margin-top:12px;background:linear-gradient(90deg,#00ff88,#00cc6a);color:#000;border:0;padding:15px;border-radius:16px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 14px rgba(0,255,136,0.6);transition:.2s}
.btnKirim:disabled{opacity:0.5;filter:grayscale(1)}
#preview{margin-top:12px;display:none;position:relative}
#preview img{width:100%;border-radius:16px;max-height:360px;object-fit:cover;border:2px solid #00ff88}
#preview span{position:absolute;top:10px;right:10px;background:#000;color:#fff;padding:6px 12px;border-radius:20px;cursor:pointer;border:1px solid #333;font-weight:800}
.post{padding:14px;display:flex;gap:12px;background:#0f0f0f;margin:10px 10px;border-radius:18px;border:1px solid #1e1e1e;border-left:3px solid #00ff88;animation:fade .3s ease}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.post-av{width:42px;height:42px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88;flex-shrink:0}
.post-body{flex:1;min-width:0}.post-name{font-weight:800;font-size:14px}.post-time{font-size:11px;color:#888;margin-left:6px}.post-text{margin-top:6px;font-size:14.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word}.post-img{margin-top:12px;border-radius:14px;overflow:hidden;border:1px solid #222}.post-img img{width:100%;display:block}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:rgba(0,0,0,0.98);border-top:2px solid #00ff88;display:flex;z-index:99;backdrop-filter:blur(10px)}.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px;transition:.2s}.bot a.on{color:#fff;text-shadow:0 0 8px #00ff88}
.skeleton{height:80px;background:linear-gradient(90deg,#0a0a0a 25%,#151515 50%,#0a0a0a 75%);background-size:200% 100%;animation:shimmer 1.2s infinite;border-radius:16px;margin:10px}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
</style></head><body>
<div id=app>
<div class=top><div style="display:flex;gap:10px;align-items:center"><img src="/icon.png" class=logo><b>RUMAH GADANG AI</b></div><button id=topLoginBtn style="background:#fff;color:#000;border:0;padding:7px 16px;border-radius:20px;font-weight:900;font-size:12px;cursor:pointer;transition:.2s">LOGIN</button></div>
<div class=box>
<div class=inputRow>
<img id=miniAv class=avatarMini src="/icon.png" style="display:none">
<input id=tulisIn class=txt placeholder="Loading Bos...">
<button class=btnPlus>+</button>
</div>
<div id=preview><img id=prevImg><span onclick="clearImg()">✕</span></div>
<button class=btnKirim>KIRIM 🚀</button>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>
<div id=homeFeed style="padding:6px 0"><div class=skeleton></div><div class=skeleton></div><div class=skeleton></div></div>
</div>
<div class=bot><a href="/" class=on>🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun">👤<br><span style="font-size:10px">Akun</span></a></div>
<script>
const LOGO_FALLBACK="/icon.png";
let selectedImg="";

// BOS: UPGRADE - SINKRON SUPER LENGKAP BOS
function getEmail(){
  let e = localStorage.getItem("user_email") || localStorage.getItem("rg_email") || "";
  if(!e){
    try{
      let p = JSON.parse(localStorage.getItem("rg_profile")||"{}");
      if(p.email) e = p.email;
    }catch{}
  }
  // BOS: CLEAN @ SPACES BOS
  return (e||"").toLowerCase().trim().replace(/@/g,'@').replace(/\s+/g,'');
}
function getName(){
  let n = (localStorage.getItem("rg_name")||"").trim();
  if(n && n!=="Dunsanak") return n;
  try{
    let p=JSON.parse(localStorage.getItem("rg_profile")||"{}");
    if(p.name && p.name!=="Dunsanak" && p.name.trim()) return p.name.trim();
  }catch{}
  let em = getEmail();
  if(em) return em.split('@')[0];
  return "Dunsanak";
}
function getAvatar(){
  let a = localStorage.getItem("rg_avatar");
  if(a && a.startsWith("data:")) return a;
  if(a && a.startsWith("http")) return a;
  try{
    let p=JSON.parse(localStorage.getItem("rg_profile")||"{}");
    if(p.picture) return p.picture;
  }catch{}
  return LOGO_FALLBACK;
}
function isLogged(){ 
  let e=getEmail(); 
  let ok = !!e && e.includes('@') && e.length>5;
  console.log("[RG] check login:", e, "logged:", ok);
  return ok; 
}
function clearImg(){ selectedImg=""; document.getElementById('preview').style.display='none'; document.getElementById('prevImg').src=""; document.getElementById('fileIn').value=""; }

function checkLoginUI(){
  let logged=isLogged();
  let inp=document.getElementById('tulisIn');
  let plus=document.querySelector('.btnPlus');
  let kirim=document.querySelector('.btnKirim');
  let topBtn=document.getElementById('topLoginBtn');
  let miniAv=document.getElementById('miniAv');
  let goAkun=()=>location.href='/akun';

  if(!logged){
    inp.placeholder="Login dulu Bos baru bisa tulis...";
    inp.disabled=false;
    miniAv.style.display="none";
    plus.onclick=goAkun; kirim.onclick=goAkun; inp.onclick=goAkun;
    kirim.style.opacity="0.6";
    topBtn.innerText="LOGIN"; topBtn.style.background="#fff"; topBtn.style.color="#000"; topBtn.onclick=goAkun;
  }else{
    inp.placeholder="Tulis disini Bos... "+getName()+" ✨";
    inp.disabled=false;
    miniAv.src=getAvatar(); miniAv.style.display="block";
    plus.onclick=()=>document.getElementById('fileIn').click();
    kirim.onclick=addTulis; inp.onclick=null;
    kirim.style.opacity="1";
    let shortName=getName().toUpperCase().slice(0,12);
    topBtn.innerText=shortName; topBtn.style.background="#00ff88"; topBtn.style.color="#000"; topBtn.onclick=()=>location.href='/akun';
  }
}

function compressImage(file, maxW=1280, quality=0.72){
  return new Promise((resolve,reject)=>{
    let r=new FileReader();
    r.onload=(ev)=>{
      let img=new Image();
      img.onload=()=>{
        let canvas=document.createElement('canvas');
        let w=img.width, h=img.height;
        if(w>maxW){ h=h*(maxW/w); w=maxW; }
        canvas.width=w; canvas.height=h;
        let ctx=canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror=reject; img.src=ev.target.result;
    };
    r.onerror=reject; r.readAsDataURL(file);
  });
}

document.getElementById('fileIn').addEventListener('change',async function(e){
 let f=e.target.files[0]; if(!f) return;
 // BOS: VALIDASI @ IMAGE BOS
 if(f.size>8*1024*1024){ alert("Foto kebesaran Bos, max 8MB Bos"); return; }
 try{
   document.getElementById('preview').style.display='block';
   selectedImg = await compressImage(f);
   document.getElementById('prevImg').src=selectedImg;
 }catch(err){ alert("Gagal baca foto Bos"); clearImg(); }
});

async function loadTulis(){
 try{
  let r=await fetch('/api/tulis',{cache:'no-store'}); 
  let d=await r.json();
  let h=document.getElementById('homeFeed');
  if(!Array.isArray(d) || !d.length){ h.innerHTML='<div style="text-align:center;padding:50px 20px;color:#777"><div style="font-size:40px">🌾</div><div style="margin-top:10px">Belum ada tulisan Bos<br><span style="font-size:12px">Jadi yang pertama posting Bos!</span></div></div>'; return;}
  h.innerHTML=d.map(x=>{
   let timeStr=""; try{ timeStr=new Date(x.time||Date.now()).toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}catch{timeStr="";}
   return \`<div class=post><img class=post-av src="\${(x.picture||LOGO_FALLBACK)}" onerror="this.src='/icon.png'"><div class=post-body><div><span class=post-name>\${(x.name||'Anonim')}</span><span class=post-time> • \${timeStr}</span></div><div class=post-text>\${(x.text||'').replace(/</g,'&lt;')}</div>\${(x.tulisImg?'<div class=post-img><img src="'+x.tulisImg+'" loading=lazy onerror="this.style.display=\\'none\\'"></div>':'')}</div></div>\`;
  }).join('');
 }catch(e){ document.getElementById('homeFeed').innerHTML='<div style="text-align:center;padding:30px;color:#f55">Gagal load Bos: '+e.message+'<br><button onclick="loadTulis()" style="margin-top:10px;background:#00ff88;border:0;padding:8px 16px;border-radius:10px;font-weight:800">Coba Lagi</button></div>'; }
}

async function addTulis(){
 if(!isLogged()){ location.href='/akun'; return; }
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt && !selectedImg){ 
   document.getElementById('tulisIn').focus();
   document.getElementById('tulisIn').style.borderColor="#ff4444";
   setTimeout(()=>document.getElementById('tulisIn').style.borderColor="#00ff88",1000);
   return; 
 }
 let btn=document.querySelector('.btnKirim'); 
 let oldText=btn.innerText;
 btn.innerText="MENGIRIM... 🚀"; btn.disabled=true;
 try{
  let res=await fetch('/api/tulis/add',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({text:txt,email:getEmail(),name:getName(),picture:getAvatar(),tulisImg:selectedImg})
  });
  let j=await res.json().catch(()=>({ok:false}));
  if(!res.ok || !j.ok){ 
    if(res.status===401){ location.href='/akun'; return; }
    throw new Error(j.error||"Gagal Bos");
  }
  document.getElementById('tulisIn').value=''; clearImg(); 
  // BOS: FEEDBACK SUKSES BOS
  btn.innerText="TERKIRIM ✅";
  setTimeout(()=>{btn.innerText=oldText; btn.disabled=false;},1200);
  loadTulis();
  window.scrollTo({top:0,behavior:'smooth'});
 }catch(e){ 
   btn.innerText="GAGAL ❌"; 
   setTimeout(()=>{btn.innerText=oldText; btn.disabled=false;},1500);
   console.error(e);
 }
}

// BOS: AUTO SYNC PAS BALIK KE TAB BOS
window.addEventListener('focus', checkLoginUI);
window.addEventListener('pageshow', checkLoginUI);
window.addEventListener('storage', checkLoginUI);
document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) checkLoginUI(); });

checkLoginUI();
loadTulis();
<\/script></body></html>
`;
