export const VIDEO_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;padding-bottom:80px;
border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;
box-shadow:0 0 14px rgba(0,255,136,0.6), inset 0 0 14px rgba(0,255,136,0.15)}
.top{padding:12px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #00ff88;background:#000;position:fixed;top:0;width:100%;max-width:520px;z-index:20;box-shadow:0 0 10px rgba(0,255,136,0.4)}
#vWrap{margin-top:48px;height:calc(100vh - 96px);overflow-y:scroll;scroll-snap-type:y mandatory;background:#000;-webkit-overflow-scrolling:touch}
.vCard{height:calc(100vh - 96px);scroll-snap-align:start;position:relative;background:#000;
border-left:2.5px solid #00ff88;border-right:2.5px solid #00ff88;border-bottom:2.5px solid #00ff88;
border-radius:14px;margin:8px;overflow:hidden;
box-shadow:0 0 12px rgba(0,255,136,0.4)}
.inner{width:100%;height:100%;position:relative;background:#111}
.thumb{width:100%;height:100%;object-fit:cover;display:block}
.playIcon{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.3)}
.playIcon div{width:70px;height:70px;background:rgba(255,0,0,0.9);border-radius:50%;display:grid;place-items:center;font-size:36px;color:#fff;box-shadow:0 0 15px rgba(255,0,0,0.6)}
.vInfo{position:absolute;left:10px;right:10px;bottom:10px;background:rgba(0,0,0,0.75);padding:8px 10px;border-radius:10px;border:1px solid rgba(0,255,136,0.3)}
.vInfo a{color:#00ff88;font-size:11px;word-break:break-all}
.soundBadge{position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.7);border:1px solid #00ff88;color:#fff;padding:6px 10px;border-radius:20px;font-size:11px;z-index:5}
.fab{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#ff0000;color:#fff;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;font-size:32px;font-weight:900;z-index:50;box-shadow:0 0 15px rgba(255,0,0,0.6)}
#upPanel{position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:100;display:none;padding:16px}
.box{max-width:480px;margin:60px auto;background:#111;border:1.5px solid #00ff88;border-radius:16px;padding:16px;box-shadow:0 0 15px rgba(0,255,136,0.4)}
input{width:100%;background:#0a0a0a;border:2px solid #333;color:#fff;padding:12px;border-radius:10px;margin-top:8px}
input:focus{border-color:#00ff88;box-shadow:0 0 8px rgba(0,255,136,0.5);outline:none}
.btn{width:100%;margin-top:10px;padding:12px;border-radius:10px;border:0;font-weight:900;cursor:pointer}
.btn-r{background:red;color:#fff}.btn-g{background:#00ff88;color:#000}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2.5px solid #00ff88;display:flex;z-index:99;box-shadow:0 -4px 12px rgba(0,255,136,0.3)}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}.bot a.on{color:#fff}
</style></head><body>
<div id=app>
<div class=top><b>RG VIDEO</b><span style="font-size:11px;color:#00ff88"></span></div>
<div id=vWrap></div>
<div class=fab onclick="toggleUp()">+</div>
</div>

<div id=upPanel>
<div class=box>
<div style="display:flex;justify-content:space-between"><b style="color:#00ff88">TAMBAH VIDEO BOS</b><button onclick="toggleUp()" style="background:#222;color:#fff;border:1px solid #444;border-radius:50%;width:32px;height:32px">X</button></div>
<div style="margin-top:14px;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:12px">
<b style="font-size:12px;color:#fff">Paste Link YouTube Bos</b>
<input id=ytUrl placeholder="https://youtu.be/xxxxx">
<button class="btn btn-r" onclick="addVideo()">🔴 TAMBAH - Auto TikTok</button>
<div style="font-size:10px;color:#aaa;margin-top:8px">Video akan auto-play kayak TikTok Bos<br>Cuma 1 suara hidup Bos, yang lain mati Bos!</div>
</div>
</div>
</div>

<div class=bot><a href="/">🏠</a><a href="/foto">🖼️</a><a href="/video" class=on>🎬</a><a href="/kantor">🏢</a><a href="/ai">🤖</a><a href="/akun">👤</a></div>

<script>
let videos=[]; let curPlaying=null; let soundOn=false;
function toggleUp(){ let p=document.getElementById('upPanel'); p.style.display=p.style.display==='block'?'none':'block'; }

function makeThumb(id){
 return '<img class=thumb src="https://img.youtube.com/vi/'+id+'/hqdefault.jpg" loading=lazy><div class=playIcon><div>▶️</div></div><div class=soundBadge>Tap untuk play Bos</div>';
}
function makeIframe(id){
 let mute = soundOn?0:1;
 return '<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&mute='+mute+'&controls=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;height:100%;border:0"></iframe><div class=vInfo><div style="font-weight:800;color:#fff">🎬 Video YouTube Bos</div><a href="https://youtu.be/'+id+'" target="_blank">https://youtu.be/'+id+'</a><div style="font-size:10px;color:#fff;margin-top:2px">Geser atas/bawah Bos kayak TikTok • Tap video untuk suara Bos</div></div><div class=soundBadge onclick="toggleSound()" style="cursor:pointer">'+(soundOn?'🔊 Suara ON':'🔇 Tap Suara')+'</div>';
}

async function loadVideo(){
 let r=await fetch('/api/videos'); videos=await r.json();
 let w=document.getElementById('vWrap');
 if(!videos.length){ w.innerHTML='<div style=padding:40px;text-align:center;color:#555">Belum ada video Bos, klik + Bos!</div>'; return; }
 w.innerHTML=videos.map(id=>'<div class=vCard data-id="'+id+'"><div class=inner id="inner-'+id+'" onclick="playOnly(\\''+id+'\\')">'+makeThumb(id)+'</div></div>').join('');

 // OBSERVER KAYAK TIKTOK BOS - CUMA 1 YANG PLAY BOS
 let obs=new IntersectionObserver((entries)=>{
   entries.forEach(en=>{
     if(en.isIntersecting){
       let id=en.target.dataset.id;
       if(curPlaying!==id){
         playOnly(id);
       }
     }
   });
 },{root:w,threshold:0.75});
 document.querySelectorAll('.vCard').forEach(c=>obs.observe(c));
 
 // Auto play pertama Bos
 setTimeout(()=>{ if(videos[0]) playOnly(videos[0]); },600);
}

function playOnly(id){
 // MATIIN SEMUA VIDEO LAIN BOS! INI KUNCINYA BOS BIAR NGGAK TABRAKAN SUARA BOS!
 document.querySelectorAll('.inner').forEach(el=>{
   let eid=el.id.replace('inner-','');
   if(eid!==id){
     if(el.innerHTML.includes('iframe')){
       el.innerHTML=makeThumb(eid);
     }
   }
 });
 let cur=document.getElementById('inner-'+id);
 if(cur){
   if(!cur.innerHTML.includes('iframe')){
     cur.innerHTML=makeIframe(id);
     curPlaying=id;
   } else {
     // kalau sudah play, toggle suara Bos
     if(!soundOn){ toggleSound(); }
   }
 }
}

function toggleSound(){
 soundOn=!soundOn;
 if(curPlaying){
   let cur=document.getElementById('inner-'+curPlaying);
   if(cur){
     cur.innerHTML=makeIframe(curPlaying);
   }
 }
}

async function addVideo(){
 let url=document.getElementById('ytUrl').value.trim(); if(!url) return alert('Paste link YouTube dulu Bos!');
 let res=await fetch('/api/videos/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ytUrl:url})});
 let j=await res.json();
 if(j.ok){ alert('Berhasil Bos! Video '+j.id+' auto TikTok Bos!'); document.getElementById('ytUrl').value=''; toggleUp(); loadVideo(); }
 else { alert('Gagal Bos: '+j.msg); }
}
loadVideo();
<\/script></body></html>
`;
