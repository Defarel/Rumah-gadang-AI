export const HOME_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - Komunitas Minangkabau</title>
<meta name="description" content="Rumah Gadang AI - Komunitas digital Minangkabau">
<link rel="icon" href="/icon.png">
<link rel="canonical" href="https://www.rumahgadang-ai.my.id/">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:80px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6)}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;position:sticky;top:0;background:#000;z-index:10}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.box{padding:12px;background:#0a0a0a;border-bottom:2px solid #00ff88}
.inputRow{display:flex;gap:8px;align-items:center}
.txt{flex:1;background:#111;border:2px solid #00ff88;color:#fff;padding:14px 16px;border-radius:14px;font-size:15px;outline:none}
.btnPlus{width:48px;height:48px;background:#222;border:1px solid #333;color:#fff;border-radius:12px;font-size:28px;font-weight:900;display:grid;place-items:center;cursor:pointer}
.btnKirim{width:100%;margin-top:10px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:14px;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 0 12px rgba(0,255,136,0.6)}
#preview{margin-top:10px;display:none;position:relative}
#preview img{width:100%;border-radius:12px;max-height:320px;object-fit:cover;border:1px solid #00ff88}
#preview span{position:absolute;top:8px;right:8px;background:#000;color:#fff;padding:6px 10px;border-radius:20px;cursor:pointer;border:1px solid #333}
.post{padding:14px;display:flex;gap:10px;background:#0a0a0a;margin:10px 8px;border-radius:14px;border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;border-top:1px solid #1a1a1a}
.post-av{width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.post-body{flex:1;min-width:0}.post-name{font-weight:800;font-size:14px}.post-time{font-size:11px;color:#888;margin-left:6px}.post-text{margin-top:6px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}.post-img{margin-top:10px;border-radius:12px;overflow:hidden;border:1.5px solid #222}.post-img img{width:100%;display:block}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style></head><body>
<div id=app>
<div class=top><div style="display:flex;gap:10px;align-items:center"><img src="/icon.png" class=logo><b>RUMAH GADANG AI</b></div><button id=topLoginBtn style="background:#fff;color:#000;border:0;padding:6px 14px;border-radius:20px;font-weight:800;font-size:12px">LOGIN</button></div>
<div class=box>
<div class=inputRow>
<input id=tulisIn class=txt placeholder="Tulis disini...">
<button class=btnPlus>+</button>
</div>
<div id=preview><img id=prevImg><span onclick="clearImg()">✕</span></div>
<button class=btnKirim>KIRIM</button>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>
<div id=homeFeed style="padding:4px 0;color:#666">Loading Bos...</div>
</div>
<div class=bot><a href="/" class=on>🏠<br><span style="font-size:10px">Home</span></a><a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a><a href="/video">🎬<br><span style="font-size:10px">Video</span></a><a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a><a href="/ai">🤖<br><span style="font-size:10px">AI</span></a><a href="/akun">👤<br><span style="font-size:10px">Akun</span></a></div>
<script>
const LOGO_FALLBACK="/icon.png";
let selectedImg="";

// --- BOS INI KUNCI FIX NYA BOS ---
function getEmail(){
  let e = localStorage.getItem("user_email") || localStorage.getItem("rg_email") || "";
  if(!e){
    try{
      let p = JSON.parse(localStorage.getItem("rg_profile")||"{}");
      if(p.email) e = p.email;
    }catch{}
  }
  return (e||"").toLowerCase().trim();
}
function getName(){
  let n = localStorage.getItem("rg_name");
  if(n) return n;
  try{
    let p=JSON.parse(localStorage.getItem("rg_profile")||"{}");
    if(p.name && p.name!=="Dunsanak") return p.name;
  }catch{}
  return getEmail().split('@')[0] || "Dunsanak";
}
function getAvatar(){
  let a = localStorage.getItem("rg_avatar");
  if(a) return a;
  try{
    let p=JSON.parse(localStorage.getItem("rg_profile")||"{}");
    if(p.picture) return p.picture;
  }catch{}
  return LOGO_FALLBACK;
}
function isLogged(){ return !!getEmail() && getEmail().includes('@'); }
function clearImg(){ selectedImg=""; document.getElementById('preview').style.display='none'; document.getElementById('prevImg').src=""; document.getElementById('fileIn').value=""; }

function checkLoginUI(){
  let logged=isLogged();
  let inp=document.getElementById('tulisIn');
  let plus=document.querySelector('.btnPlus');
  let kirim=document.querySelector('.btnKirim');
  let topBtn=document.getElementById('topLoginBtn');
  let goAkun=()=>location.href='/akun';

  if(!logged){
    inp.placeholder="Login dulu Bos baru bisa tulis...";
    plus.onclick=goAkun; kirim.onclick=goAkun; inp.onclick=goAkun;
    kirim.style.opacity="0.6";
    topBtn.innerText="LOGIN"; topBtn.style.background="#fff"; topBtn.onclick=goAkun;
  }else{
    inp.placeholder="Tulis disini Bos... "+getName();
    plus.onclick=()=>document.getElementById('fileIn').click();
    kirim.onclick=addTulis; inp.onclick=null;
    kirim.style.opacity="1";
    topBtn.innerText=getName().toUpperCase().slice(0,12); topBtn.style.background="#00ff88"; topBtn.onclick=()=>location.href='/akun';
  }
}

function compressImage(file, maxW=1280, quality=0.7){
  return new Promise((resolve,reject)=>{
    let r=new FileReader();
    r.onload=(ev)=>{
      let img=new Image();
      img.onload=()=>{
        let canvas=document.createElement('canvas');
        let w=img.width, h=img.height;
        if(w>maxW){ h=h*(maxW/w); w=maxW; }
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror=reject; img.src=ev.target.result;
    };
    r.onerror=reject; r.readAsDataURL(file);
  });
}

document.getElementById('fileIn').addEventListener('change',async function(e){
 let f=e.target.files[0]; if(!f) return;
 try{
   document.getElementById('preview').style.display='block';
   selectedImg = await compressImage(f);
   document.getElementById('prevImg').src=selectedImg;
 }catch(err){ alert("Gagal baca foto Bos"); clearImg(); }
});

async function loadTulis(){
 try{
  let r=await fetch('/api/tulis'); let d=await r.json();
  let h=document.getElementById('homeFeed');
  if(!d.length){ h.innerHTML='<div style="text-align:center;padding:40px;color:#777">Belum ada tulisan Bos</div>'; return;}
  h.innerHTML=d.map(x=>{
   return '<div class=post><img class=post-av src="'+(x.picture||LOGO_FALLBACK)+'"><div class=post-body><div><span class=post-name>'+(x.name||'Anonim')+'</span><span class=post-time> • '+new Date(x.time).toLocaleString()+'</span></div><div class=post-text>'+(x.text||'')+'</div>'+(x.tulisImg?'<div class=post-img><img src="'+x.tulisImg+'" loading=lazy></div>':'')+'</div></div>';
  }).join('');
 }catch(e){ document.getElementById('homeFeed').innerHTML='Error Bos: '+e.message; }
}

async function addTulis(){
 if(!isLogged()){ location.href='/akun'; return; }
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt && !selectedImg){ alert("Tulis dulu Bos!"); return; }
 let btn=document.querySelector('.btnKirim'); btn.innerText="MENGIRIM..."; btn.disabled=true;
 try{
  let res=await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,email:getEmail(),name:getName(),picture:getAvatar(),tulisImg:selectedImg})});
  let j=await res.json();
  if(!j.ok){ alert(j.error||"Gagal Bos"); location.href='/akun'; return; }
  document.getElementById('tulisIn').value=''; clearImg(); loadTulis();
 }catch(e){ alert("Gagal Bos: "+e.message); }
 btn.innerText="KIRIM"; btn.disabled=false;
}

window.addEventListener('storage', checkLoginUI);
checkLoginUI();
loadTulis();
<\/script></body></html>
`;
