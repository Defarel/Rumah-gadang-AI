export const VIDEO_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;padding-bottom:80px}
.top{padding:12px;border-bottom:1px solid #222;position:fixed;top:0;width:100%;max-width:520px;background:#000;z-index:10;display:flex;justify-content:space-between}
#vWrap{margin-top:48px;height:calc(100vh - 96px);overflow-y:scroll;scroll-snap-type:y mandatory}
.vCard{height:calc(100vh - 96px);scroll-snap-align:start;position:relative;background:#000}
.vCard iframe,.thumb{width:100%;height:100%;border:0}
.vInfo{position:absolute;left:12px;bottom:20px;right:80px;z-index:5;background:rgba(0,0,0,0.6);padding:8px;border-radius:8px}
.vInfo a{color:#00ff88;font-size:11px;word-break:break-all}
.fab{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#ff0000;color:#fff;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;font-size:32px;font-weight:900;z-index:50;box-shadow:0 0 15px rgba(255,0,0,0.6);cursor:pointer}
#upPanel{position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:100;display:none;padding:16px}
.box{max-width:480px;margin:60px auto;background:#111;border:1px solid #333;border-radius:16px;padding:16px}
input{width:100%;background:#0a0a0a;border:1px solid #333;color:#fff;padding:12px;border-radius:10px;margin-top:8px}
.btn{width:100%;margin-top:10px;padding:12px;border-radius:10px;border:0;font-weight:900;cursor:pointer}
.btn-r{background:red;color:#fff}.btn-g{background:#00ff88;color:#000}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:22px}.bot a.on{color:#fff}
</style></head><body>
<div id=app>
<div class=top><b>RG VIDEO</b><span style="font-size:11px;color:#ff4444">Auto-play + Semua bisa tambah Bos!</span></div>
<div id=vWrap></div>
<div class=fab onclick="toggleUp()">+</div>
</div>

<div id=upPanel>
<div class=box>
<div style="display:flex;justify-content:space-between"><b style="color:#ff4444">TAMBAH VIDEO BOS</b><button onclick="toggleUp()" style="background:#222;color:#fff;border:1px solid #444;border-radius:50%;width:32px;height:32px">X</button></div>
<div style="margin-top:14px;padding:12px;background:#0a0a0a;border:1px solid #222;border-radius:12px">
<b style="font-size:12px">Paste Link YouTube Bos (Semua bisa Bos!)</b>
<input id=ytUrl placeholder="https://youtu.be/xxxxx atau https://youtube.com/watch?v=xxxxx">
<button class="btn btn-r" onclick="addVideo()">🔴 TAMBAH VIDEO - Auto Play</button>
<div style="font-size:10px;color:#666;margin-top:8px">Video akan langsung auto-play pas di-scroll Bos<br>URL YouTube disimpan: https://youtu.be/ID Bos</div>
</div>
</div>
</div>

<div class=bot><a href="/">🏠</a><a href="/foto">🖼️</a><a href="/video" class=on>🎬</a><a href="/kantor">🏢</a><a href="/ai">🤖</a><a href="/akun">👤</a></div>
<script>
function toggleUp(){ let p=document.getElementById('upPanel'); p.style.display=p.style.display==='block'?'none':'block'; }
function makeThumb(id){ return '<img class=thumb src="https://img.youtube.com/vi/'+id+'/hqdefault.jpg"><div style=position:absolute;inset:0;display:grid;place-items:center><div style=width:60px;height:60px;background:red;border-radius:50%;display:grid;place-items:center;font-size:30px>▶️</div></div>'; }
function makeIframe(id){ return '<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&mute=1&controls=1&playsinline=1&loop=1&playlist='+id+'&modestbranding=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class=vInfo><div style=font-weight:800>🎬 Video YouTube Bos</div><a href="https://youtu.be/'+id+'" target="_blank">https://youtu.be/'+id+'</a><div style=font-size:10px;color:#aaa;margin-top:4px>Auto-play pas scroll Bos</div></div>'; }
async function loadVideo(){
 let r=await fetch('/api/videos'); let v=await r.json();
 let w=document.getElementById('vWrap');
 if(!v.length){ w.innerHTML='<div style=padding:40px;text-align:center;color:#555>Belum ada video Bos, klik + tambah Bos!</div>'; return; }
 w.innerHTML=v.map(id=>'<div class=vCard><div class=inner data-id="'+id+'" style=width:100%;height:100%>'+makeThumb(id)+'</div></div>').join('');
 let obs=new IntersectionObserver((entries)=>{
   entries.forEach(en=>{
     if(en.isIntersecting){
       let inner=en.target.querySelector('.inner');
       let id=inner.dataset.id;
       if(!inner.innerHTML.includes('iframe')) inner.innerHTML=makeIframe(id);
     } else {
       // optional: pause pas keluar
       let inner=en.target.querySelector('.inner');
       if(inner && inner.innerHTML.includes('iframe')){
         // biar hemat kuota, tetap play aja Bos, kalau mau stop uncomment bawah
         // inner.innerHTML=makeThumb(inner.dataset.id);
       }
     }
   });
 },{root:w,threshold:0.7});
 document.querySelectorAll('.vCard').forEach(c=>obs.observe(c));
 setTimeout(()=>{ let f=document.querySelector('.inner'); if(f) f.innerHTML=makeIframe(f.dataset.id); },500);
}
async function addVideo(){
 let url=document.getElementById('ytUrl').value.trim(); if(!url) return alert('Paste link YouTube dulu Bos!');
 let res=await fetch('/api/videos/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ytUrl:url})});
 let j=await res.json();
 if(j.ok){ alert('Berhasil Bos! Video '+j.id+' akan auto-play!'); document.getElementById('ytUrl').value=''; toggleUp(); loadVideo(); }
 else { alert('Gagal Bos: '+j.msg); }
}
loadVideo();
<\/script></body></html>
`;
