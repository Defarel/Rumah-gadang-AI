export const HOME_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - Komunitas Minangkabau</title>
<meta name="description" content="Rumah Gadang AI - Komunitas digital Minangkabau">
<link rel="icon" href="/icon.png">
<link rel="canonical" href="https://www.rumahgadang-ai.my.id/">
<style>
body{background:#000;color:#fff;font-family:system-ui,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:100px;border-left:2px solid #00ff88;border-right:2px solid #00ff88;border-bottom:2px solid #00ff88;box-shadow:0 0 18px rgba(0,255,136,0.5)}
.post{padding:14px;display:flex;gap:10px;background:#0f0f0f;margin:10px;border-radius:16px;border:1px solid #1a1a1a;border-left:3px solid #00ff88}
.c-item{display:flex;gap:8px;margin-top:6px;font-size:12px;background:#141414;padding:8px;border-radius:8px}
.c-av{width:24px;height:24px;border-radius:50%;object-fit:cover}
</style></head><body>
<div id=app>

<!-- TOP BAR -->
<div style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222;position:sticky;top:0;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);z-index:20">
<div style="display:flex;gap:10px;align-items:center"><img src="/icon.png" style="width:38px;height:38px;border-radius:50%;border:2px solid #00ff88"><b>RUMAH GADANG AI</b></div>
<a href="/akun" style="background:#00ff88;color:#000;border:0;padding:7px 16px;border-radius:20px;font-weight:900;font-size:12px;text-decoration:none">AKUN SAYA</a>
</div>

<!-- BOX TULIS -->
<div style="padding:14px;background:#0a0a0a;border-bottom:2px solid #00ff88">
<div style="display:flex;gap:10px;align-items:center">
<img id=miniAv src="/icon.png" style="width:42px;height:42px;border-radius:50%;border:2px solid #00ff88;object-fit:cover">
<input id=tulisIn placeholder="Tulis sesuatu Bos..." style="flex:1;background:#111;border:2px solid #00ff88;color:#fff;padding:13px 16px;border-radius:14px;outline:none">
<button onclick="document.getElementById('tulisFile').click()" style="width:46px;height:46px;background:#1a1a1a;border:1px solid #333;color:#00ff88;border-radius:12px;font-size:28px;font-weight:900">+</button>
</div>
<div id=tulisPreview style="margin-top:10px;display:none;position:relative">
<img id=tulisPreviewImg style="width:100%;border-radius:12px;max-height:320px;object-fit:cover;border:1px solid #00ff88">
<span onclick="clearPrev()" style="position:absolute;top:8px;right:8px;background:#000;padding:6px 12px;border-radius:20px;cursor:pointer;border:1px solid #333">✕</span>
</div>
<button onclick="addTulis()" style="width:100%;margin-top:12px;background:#00ff88;color:#000;border:0;padding:14px;border-radius:14px;font-weight:900;box-shadow:0 0 12px rgba(0,255,136,0.6)">KIRIM 🚀</button>
<input type=file id=tulisFile accept="image/*" style="display:none">
</div>

<!-- FEED -->
<div id=homeFeed style="padding:6px 0"></div>

<a href="/akun" style="display:block;text-align:center;color:#666;font-size:11px;padding:16px;text-decoration:none">Menu Akun & Pengaturan →</a>
</div>

<!-- BOTTOM NAV -->
<div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:rgba(0,0,0,0.98);border-top:2px solid #00ff88;display:flex;z-index:99">
<a href="/" style="flex:1;text-align:center;padding:10px 0;color:#fff;text-decoration:none">🏠<br><span style="font-size:10px">Home</span></a>
<a href="/foto" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🖼️<br><span style="font-size:10px">Foto</span></a>
<a href="/video" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🎬<br><span style="font-size:10px">Video</span></a>
<a href="/kantor" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🏢<br><span style="font-size:10px">Kantor</span></a>
<a href="/ai" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">🤖<br><span style="font-size:10px">AI</span></a>
<a href="/akun" style="flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none">👤<br><span style="font-size:10px">Akun</span></a>
</div>

<script>
const LOGO_URL="/icon.png";
let pending="";

function getEmail(){ let e=localStorage.getItem("user_email")||localStorage.getItem("rg_email")||""; if(!e){try{let p=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(p.email) e=p.email;}catch{}} return (e||"").toLowerCase().trim(); }
function getName(){ let n=localStorage.getItem("rg_name"); if(n) return n; try{let p=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(p.name) return p.name;}catch{} return getEmail().split('@')[0]||"Dunsanak"; }
function getAvatar(){ let a=localStorage.getItem("rg_avatar"); if(a) return a; try{let p=JSON.parse(localStorage.getItem("rg_profile")||"{}"); if(p.picture) return p.picture;}catch{} return LOGO_URL; }

// Helper untuk mengubah email/username menjadi URL profil berformat /username
function getProfileLink(emailOrUser) {
  if (!emailOrUser) return "/akun";
  let clean = emailOrUser.toLowerCase().trim();
  let username = clean.includes('@') ? clean.split('@')[0] : clean;
  username = username.replace(/[^a-z0-9]/g, '');
  return "/" + username;
}

document.getElementById('miniAv').src = getAvatar();

async function loadTulis(){
 try{
  let r=await fetch('/api/tulis');
  let d=await r.json();
  let h=document.getElementById('homeFeed');
  if(!d.length){ h.innerHTML='<div style="text-align:center;padding:30px;color:#777">Belum ada tulisan Bos</div>'; return;}
  
  h.innerHTML=d.map(x=>{
    let profileUrl = getProfileLink(x.email || x.user_email || x.name);
    let avatarImg = x.picture || LOGO_URL;
    let authorName = x.name || 'Anonim';
    let timeStr = x.time ? new Date(x.time).toLocaleString('id-ID') : '';

    return \`<div class=post>
      <a href="\${profileUrl}"><img src="\${avatarImg}" style="width:40px;height:40px;border-radius:50%;border:1.5px solid #00ff88;object-fit:cover"></a>
      <div style="flex:1">
        <div>
          <a href="\${profileUrl}" style="font-size:13px;font-weight:bold;color:#fff;text-decoration:none">\${authorName}</a>
          <span style="font-size:11px;color:#888;margin-left:6px">\${timeStr}</span>
        </div>
        <div style="margin-top:4px;font-size:14px;white-space:pre-wrap">\${x.text||''}</div>
        \${x.tulisImg?'<div style="margin-top:8px;border-radius:12px;overflow:hidden"><img src="'+x.tulisImg+'" style="width:100%"></div>':''}
        <div style="display:flex;gap:15px;margin-top:10px;font-size:12px">
          <button onclick="likePost('\${x.id}')" style="background:none;border:0;color:#ff4444;cursor:pointer">❤️ \${x.likes||0}</button>
          <button onclick="openComments('tulis','\${x.id}')" style="background:none;border:0;color:#00ff88;cursor:pointer">💬 Komen</button>
          <button onclick="sharePost('\${encodeURIComponent(x.text||'')}')" style="background:none;border:0;color:#888;cursor:pointer">📤 Share</button>
        </div>
        <div id="comments-\${x.id}" style="display:none;margin-top:8px;border-top:1px solid #222;padding-top:8px"></div>
      </div>
    </div>\`;
  }).join('');
 }catch(err){ document.getElementById('homeFeed').innerHTML='<div style="text-align:center;color:#ff4444;padding:20px">Gagal memuat feed Bos</div>'; }
}

async function likePost(id){
  if(!getEmail()){ alert('Login dulu Bos'); location.href='/akun'; return; }
  try{
    await fetch('/api/like',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'tulis',item_id:id,email:getEmail()})});
    loadTulis();
  }catch(e){}
}

async function openComments(type,item_id){
 let box=document.getElementById('comments-'+item_id);
 if(!box) return;
 box.style.display=box.style.display==='none'?'block':'none';
 if(box.style.display==='none') return;
 box.innerHTML='Loading Bos...';
 try{
  let r=await fetch('/api/comments?type='+type+'&id='+item_id);
  let list=await r.json();
  let html='<div style="display:flex;gap:6px;margin-bottom:8px"><input id="cInp-'+item_id+'" placeholder="Komen Bos..." style="flex:1;padding:8px;border-radius:8px;background:#111;color:#fff;border:1px solid #333"><button onclick="addComment(\\''+type+'\\',\\''+item_id+'\\')" style="background:#00ff88;color:#000;border:0;padding:8px 12px;border-radius:8px;font-weight:900">Kirim</button></div>';
  html+=list.map(c=>'<div class="c-item"><img class="c-av" src="'+(c.picture||LOGO_URL)+'"><div><b style="color:#00ff88">'+c.name+'</b> '+c.text+'</div></div>').join('');
  box.innerHTML=html;
 }catch(e){ box.innerHTML='Gagal memuat komen Bos'; }
}

async function addComment(type,item_id){
 let inp=document.getElementById('cInp-'+item_id);
 if(!inp || !inp.value.trim()) return;
 if(!getEmail()){ alert('Login dulu Bos'); location.href='/akun'; return; }
 await fetch('/api/comments/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:type,item_id:String(item_id),text:inp.value.trim(),email:getEmail(),name:getName(),picture:getAvatar()})});
 inp.value='';
 openComments(type,item_id);
 setTimeout(()=>openComments(type,item_id),400);
}

function sharePost(t){ 
  let txt=decodeURIComponent(t);
  if(navigator.share){ navigator.share({title:'Rumah Gadang AI',text:txt,url:location.href}); } 
  else { navigator.clipboard.writeText(location.href); alert('Link disalin Bos!'); } 
}

function clearPrev(){ pending=""; document.getElementById('tulisPreview').style.display='none'; }

document.getElementById('tulisFile').addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 let rd=new FileReader();
 rd.onload=function(ev){
  let img=new Image();
  img.onload=function(){
   let c=document.createElement('canvas'); c.width=600; c.height=600*img.height/img.width;
   c.getContext('2d').drawImage(img,0,0,c.width,c.height);
   pending=c.toDataURL('image/jpeg',0.6);
   document.getElementById('tulisPreviewImg').src=pending;
   document.getElementById('tulisPreview').style.display='block';
  };
  img.src=ev.target.result;
 };
 rd.readAsDataURL(f);
});

async function addTulis(){
 if(!getEmail()){ alert('Login dulu Bos'); location.href='/akun'; return; }
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt && !pending) return alert('Tulis sesuatu Bos');
 await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,email:getEmail(),name:getName(),picture:getAvatar(),tulisImg:pending})});
 document.getElementById('tulisIn').value=''; 
 clearPrev(); 
 loadTulis();
}

loadTulis();
</script></body></html>
`;
