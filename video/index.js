export const VIDEO_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>RG VIDEO</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif;overflow:hidden}
#header{background:#000;color:#fff;padding:12px 16px;font-weight:bold;border-bottom:2px solid #0f0;position:fixed;top:0;left:0;right:0;z-index:10}
#feed{position:fixed;top:45px;bottom:60px;left:0;right:0;overflow-y:scroll;scroll-snap-type:y mandatory;background:#000}
.v-item{width:100%;height:100%;scroll-snap-align:start;position:relative;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column}
.v-item iframe{width:100%;height:100%;border:0}
.v-info{position:absolute;bottom:20px;left:10px;right:10px;color:#fff;text-shadow:0 1px 3px #000}
#addBtn{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);width:70px;height:70px;background:red;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;color:#fff;border:0;z-index:20;box-shadow:0 0 20px red}
#nav{position:fixed;bottom:0;left:0;right:0;height:60px;background:#111;display:flex;justify-content:space-around;align-items:center;border-top:1px solid #333;z-index:10}
#nav a{font-size:22px;text-decoration:none}
#modal{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:100}
#modalBox{background:#222;padding:20px;border-radius:12px;width:90%;max-width:400px}
#modalBox input{width:100%;padding:12px;border-radius:8px;border:0;margin:10px 0}
#modalBox button{padding:10px 16px;border-radius:8px;border:0;margin:5px}
</style></head><body>
<div id="header">RG VIDEO</div>
<div id="feed"><div style="padding:60px 20px;text-align:center">Loading video Bos...</div></div>
<button id="addBtn">+</button>
<div id="nav">
<a href="/">🏠</a><a href="/foto">🖼️</a><a href="/video">🎬</a><a href="/kantor">🏢</a><a href="/ai">🤖</a><a href="/akun">👤</a>
</div>
<div id="modal"><div id="modalBox">
<h3>Tambah Video Bos!</h3>
<input id="ytInput" placeholder="Paste link YouTube Bos, contoh: https://youtu.be/jNQXAC9IVRw">
<button onclick="addVideo()" style="background:#0f0;color:#000">Simpan Bos</button>
<button onclick="closeModal()" style="background:#444;color:#fff">Batal Bos</button>
<div id="msg" style="margin-top:10px;color:#0f0"></div>
</div></div>
<script>
const FALLBACK_VIDEOS = ["jNQXAC9IVRw","M7lc1UVf-VE","dQw4w9WgXcQ","9bZkp7q19f0","kJQP7kiw5Fk"];
let videos=[];

async function loadVideos(){
  try{
    let res = await fetch('/api/videos');
    let data = await res.json();
    videos = (data && data.length>0) ? data : FALLBACK_VIDEOS;
  }catch(e){
    videos = FALLBACK_VIDEOS;
  }
  renderVideos();
}

function renderVideos(){
  const feed = document.getElementById('feed');
  if(!videos || videos.length===0){
    feed.innerHTML = '<div style="padding:80px 20px;text-align:center">Belum ada video Bos, klik + Bos!</div>';
    return;
  }
  feed.innerHTML = videos.map(id => \`
    <div class="v-item">
      <iframe src="https://www.youtube.com/embed/\${id}?autoplay=0&mute=0&controls=1&loop=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      <div class="v-info">ID: \${id}</div>
    </div>
  \`).join('');
}

document.getElementById('addBtn').onclick = ()=>{ document.getElementById('modal').style.display='flex'; };
function closeModal(){ document.getElementById('modal').style.display='none'; }
function getId(u){
  if(!u) return null;
  u=u.trim();
  let m=u.match(/(?:v=|youtu\\.be\\/|shorts\\/)([^?&\\/]{11})/);
  if(m) return m[1];
  if(/^[A-Za-z0-9_-]{11}$/.test(u)) return u;
  return null;
}
async function addVideo(){
  let url=document.getElementById('ytInput').value;
  let id=getId(url);
  if(!id){ document.getElementById('msg').innerText='Link salah Bos!'; return; }
  document.getElementById('msg').innerText='Menyimpan Bos...';
  try{
    let res=await fetch('/api/videos/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ytUrl:url})});
    let j=await res.json();
    if(j.ok){
      document.getElementById('msg').innerText='Berhasil Bos!';
      setTimeout(()=>{ closeModal(); loadVideos(); },800);
    }else{
      document.getElementById('msg').innerText=j.msg||'Gagal Bos';
    }
  }catch(e){ document.getElementById('msg').innerText='Error Bos'; }
}
loadVideos();
</script></body></html>`;
