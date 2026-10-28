export const FOTO_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="canonical" href="https://rumahgadang-ai.my.id/foto">
<title>Foto - Rumah Gadang AI</title>
<style>
/* ==========================================
   1. PENGATURAN DASAR & TAMPILAN UTAMA (BENTUK)
   ========================================== */
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;padding-bottom:80px}
.top{padding:12px;border-bottom:1px solid #222;position:sticky;top:0;background:#000;z-index:10;display:flex;justify-content:space-between;align-items:center}

/* ==========================================
   2. GRID FOTO Rapat & Kotak ala Instagram
   ========================================== */
.grid3{display:grid;grid-template-columns:repeat(3, 1fr);gap:2px;padding:0;background:#000}
.cell{aspect-ratio:1;background:#111;position:relative;overflow:hidden;cursor:pointer;border-radius:0;border:none;box-shadow:none;transition:0.1s}
.cell:active{transform:scale(0.98)}
.cell img{width:100%;height:100%;object-fit:cover;background:#222;display:block;border-radius:0}
.cell .play{position:absolute;top:6px;right:6px;width:24px;height:24px;background:rgba(0,0,0,0.6);border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,0.5);z-index:2}
.cell .play div{width:24px;height:24px;background:transparent;border-radius:50%;display:grid;place-items:center;font-size:10px;color:#fff;font-weight:900}

/* ==========================================
   3. TOMBOL TAMBAH (+) & PANEL UPLOAD/URL
   ========================================== */
.fab{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#00ff88;color:#000;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-size:30px;font-weight:900;z-index:50;box-shadow:0 0 16px #00ff88;cursor:pointer}
#upPanel{position:fixed;inset:0;background:rgba(0,0,0,0.97);z-index:100;display:none;padding:16px;overflow-y:auto}
.box{max-width:480px;margin:20px auto;background:#111;border:1px solid #333;border-radius:16px;padding:16px}
input{width:100%;background:#0a0a0a;border:1px solid #333;color:#fff;padding:12px;border-radius:10px;margin-top:8px}
.btn{width:100%;margin-top:10px;padding:12px;border-radius:10px;border:0;font-weight:900;cursor:pointer}
.btn-g{background:#00ff88;color:#000}
.btn-w{background:#222;color:#fff;border:1px solid #333}

/* ==========================================
   4. NAVIGASI BAWAH (BOTTOM BAR)
   ========================================== */
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:22px}
.bot a.on{color:#fff}

/* ==========================================
   5. MODAL / SLIDE PREVIEW FULLSCREEN & VIDEO IG
   ========================================== */
#modal{position:fixed;inset:0;background:#000;z-index:999;display:none;flex-direction:column}
#swipeWrap{flex:1;display:flex;overflow-x:scroll;scroll-snap-type:x mandatory}
.slide{flex:0 0 100%;scroll-snap-align:start;position:relative;background:#000;display:flex;align-items:center;justify-content:center}
.slideMedia{width:100%;height:100%;position:relative;background:#000;display:flex;align-items:center;justify-content:center}
.slideMedia iframe{width:100%;height:100%;border:0}
.slideMedia img.thumb{width:100%;height:100%;object-fit:cover}
.slideMedia .bigPlay{position:absolute;inset:0;display:grid;place-items:center;cursor:pointer}
.slideMedia .bigPlay div{width:80px;height:80px;background:rgba(0,255,136,0.9);border-radius:50%;display:grid;place-items:center;font-size:40px;border:2px solid #00ff88;color:#000;box-shadow:0 0 20px #00ff88}
.thumbBox{width:100%;aspect-ratio:1;background:#0a0a0a;border:1px dashed #333;border-radius:12px;margin-top:10px;display:grid;place-items:center;position:relative;overflow:hidden}
.thumbBox img{width:100%;height:100%;object-fit:cover}
.thumbBox span{font-size:11px;color:#666;text-align:center;padding:10px}
</style>
</head>
<body>

<!-- ==========================================
     6. STRUKTUR HTML TAMPILAN UTAMA
     ========================================== -->
<div id="app">
    <div class="top">
        <b>RG FOTO</b>
        <span id="fcnt" style="font-size:10px;color:#00ff88;border:1px solid #00ff88;padding:2px 6px;border-radius:8px">0</span>
    </div>
    <!-- Tempat Grid Foto Ditampilkan -->
    <div class="grid3" id="fg"></div>
    <!-- Tombol Tambah Menu (Floating Action Button) -->
    <div class="fab" onclick="toggleUp()">+</div>
</div>

<!-- ==========================================
     7. PANEL TAMBAH FOTO / URL INSTAGRAM
     ========================================== -->
<div id="upPanel">
    <div class="box">
        <div style="display:flex;justify-content:space-between">
            <b style="color:#00ff88">TAMBAH FOTO / LINK IG</b>
            <button onclick="toggleUp()" style="background:#222;color:#fff;border:1px solid #444;border-radius:50%;width:32px;height:32px">X</button>
        </div>
        
        <!-- BAGIAN 7A: Tambah Thumbnail Manual + URL Instagram -->
        <div style="background:#0a0a0a;border:1px solid #00ff88;border-radius:12px;padding:12px;margin-top:12px">
            <b style="color:#00ff88;font-size:12px">CARA 1: UPLOAD THUMB + URL IG</b>
            <div style="font-size:10px;color:#888;margin-top:4px">1. Pilih Gambar/Screenshot 2. Masukkan Link URL Instagram</div>
            <input id="fThumb" type="file" accept="image/*">
            <div class="thumbBox" id="thumbBox"><span>📸 Belum ada thumb<br>Klik Pilih File</span></div>
            <input id="igUrl" placeholder="https://www.instagram.com/reel/.../">
            <button class="btn btn-g" onclick="saveManual()">+ SIMPAN THUMB + URL IG ✅</button>
        </div>

        <div style="margin:14px 0;text-align:center;color:#444;font-size:11px">--- ATAU ---</div>

        <!-- BAGIAN 7B: Ambil Otomatis dari URL Instagram -->
        <div style="background:#111;border:1px solid #333;border-radius:12px;padding:12px">
            <b style="font-size:12px">CARA 2: AUTO AMBIL DARI URL IG</b>
            <button class="btn btn-w" onclick="previewIG()">🔍 AMBIL OTOMATIS</button>
            <div id="igPrev" style="display:none;margin-top:10px">
                <img id="igPrevImg" style="width:100%;border-radius:8px;aspect-ratio:1/1;object-fit:cover">
                <div id="igPrevAkun" style="color:#00ff88;font-size:12px;margin-top:6px"></div>
                <button class="btn btn-g" onclick="saveIG()">+ SIMPAN OTOMATIS</button>
            </div>
        </div>

        <!-- BAGIAN 7C: Upload Foto Biasa / Galeri -->
        <div style="margin-top:14px;border-top:1px solid #222;padding-top:12px">
            <input id="fFile" type="file" accept="image/*">
            <button class="btn btn-w" onclick="upFoto()">📤 UPLOAD FOTO BIASA</button>
            <div id="upInfo" style="font-size:10px;color:#00ff88;margin-top:6px;text-align:center"></div>
        </div>
    </div>
</div>

<!-- ==========================================
     8. MODAL FULLSCREEN SAAT FOTO DIKLIK
     ========================================== -->
<div id="modal">
    <div style="padding:10px;display:flex;justify-content:space-between;align-items:center">
        <span id="mCount" style="font-size:12px;color:#888">1/6</span>
        <span id="mAkun" style="color:#00ff88;font-size:12px"></span>
        <div style="display:flex;gap:6px">
            <button id="delInside" onclick="hapusCurrent()" style="background:#ff0000;color:#fff;border:1px solid #fff;padding:6px 14px;border-radius:20px;font-weight:900;display:none">🗑️ HAPUS</button>
            <button onclick="closeM()" style="background:#222;color:#fff;border:0;padding:6px 14px;border-radius:20px">Tutup X</button>
        </div>
    </div>
    <div id="swipeWrap"></div>
    <div style="padding:10px;border-top:1px solid #222;display:flex;gap:8px;background:#111">
        <button onclick="swipe(-1)" style="flex:1;background:#222;color:#fff;border:1px solid #333;padding:12px;border-radius:10px">←</button>
        <a id="mLink" target="_blank" style="flex:2;background:#00ff88;color:#000;text-align:center;padding:12px;border-radius:10px;font-weight:900;text-decoration:none">Buka di IG ↗</a>
        <button onclick="swipe(1)" style="flex:1;background:#222;color:#fff;border:1px solid #333;padding:12px;border-radius:10px">→</button>
    </div>
</div>

<!-- ==========================================
     9. MENU NAVIGASI BAWAH WEBSITE
     ========================================== -->
<div class="bot">
    <a href="/">🏠</a>
    <a href="/foto" class="on">🖼️</a>
    <a href="/video">🎬</a>
    <a href="/kantor">🏢</a>
    <a href="/ai">🤖</a>
    <a href="/akun">👤</a>
</div>

<!-- ==========================================
     10. LOGIKA JAVASCRIPT & FUNGSI FITUR
     ========================================== -->
<script>
let allData=[]; let curIdx=0; let tempIG={}; let manualThumb="";
function isAdmin(){ let e=(localStorage.getItem('rg_email')||'').toLowerCase(); return e.includes('defarel') || e.includes('admin') || localStorage.getItem('rg_admin')==='1'; }
function toggleUp(){let p=document.getElementById('upPanel'); p.style.display=p.style.display==='block'?'none':'block';}

async function loadFoto(){
 let r=await fetch('/api/ig-curated?_t='+Date.now()); let d1=await r.json();
 let r2=await fetch('/api/images?_t='+Date.now()); let d2=await r2.json();
 allData=[...d1.map(x=>({akun:x.akun,img:x.img,linkIG:x.linkIG||'',id:x.id,type:'ig'})), ...d2.map(x=>({akun:'user',img:x.url,caption:'Foto user Bos',linkIG:x.url,id:x.id,type:'foto'}))];
 document.getElementById('fcnt').innerText=allData.length+' FOTO';
 let g=document.getElementById('fg');
 if(!allData.length){ g.innerHTML='<div style=grid-column:1/-1;padding:40px;text-align:center;color:#555">Belum ada foto Bos</div>'; return; }
 g.innerHTML=allData.map((x,i)=>{ 
   let safe=x.img||'https://i.ibb.co/r2gL8YJB/1791014451654.jpg'; 
   return '<div class=cell onclick="openAt('+i+')"><img src="'+safe+'" loading=lazy><div class=play><div>▶</div></div></div>'; 
 }).join('');
}

async function hapusCurrent(){ let x=allData[curIdx]; if(!x) return; doDelete(x.id, x.type); }
async function doDelete(id,type){
  if(!confirm("Hapus foto ID: "+id+" ?")) return;
  try{
    let r = await fetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,type:type})});
    let j = await r.json();
    if(j.ok){ closeM(); setTimeout(()=>loadFoto(), 500); }
  }catch(err){ alert('Error: '+err.message); }
}

function stopAll(){
  document.querySelectorAll('#swipeWrap .slideMedia').forEach((el, idx)=>{
    let x=allData[idx]; if(!x) return;
    if(el.querySelector('iframe')){
      el.innerHTML='<img class=thumb src="'+x.img+'"><div class=bigPlay onclick="playThis('+idx+')"><div>▶️</div></div>';
    }
  });
}

function getEmbed(l){ let e=l.split('?')[0]; if(!e.endsWith('/')) e+='/'; e+='embed/'; return e; }

function openAt(idx){ 
  curIdx=idx; 
  let wrap=document.getElementById('swipeWrap'); 
  wrap.innerHTML=allData.map((x,i)=>{ return '<div class=slide><div class=slideMedia onclick="playThis('+i+')"><img class=thumb src="'+x.img+'"><div class=bigPlay><div>▶️</div></div></div></div>'; }).join(''); 
  document.getElementById('modal').style.display='flex'; 
  document.getElementById('delInside').style.display = isAdmin() ? 'block' : 'none';
  setTimeout(()=>{ wrap.children[idx]?.scrollIntoView({inline:'start'}); playThis(idx); updateInfo(idx); },150);
  wrap.onscrollend = ()=>{
    let newIdx = Math.round(wrap.scrollLeft / wrap.clientWidth);
    if(newIdx!==curIdx){ stopAll(); curIdx=newIdx; updateInfo(newIdx); playThis(newIdx); }
  };
}

function playThis(i){
  stopAll();
  let x=allData[i]; 
  let el=document.getElementById('swipeWrap').children[i].querySelector('.slideMedia'); 
  if(!el) return;
  if(x.linkIG && x.linkIG.includes('instagram.com')){
    el.innerHTML='<iframe src="'+getEmbed(x.linkIG)+'?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  } else {
    el.innerHTML='<img class=thumb src="'+x.img+'" style="object-fit:contain">';
  }
  curIdx=i; updateInfo(i);
}

function updateInfo(i){
  let x=allData[i]; if(!x) return;
  document.getElementById('mCount').innerText=(i+1)+'/'+allData.length;
  document.getElementById('mAkun').innerText='@'+(x.akun||'');
  document.getElementById('mLink').href=x.linkIG||x.img;
}

function swipe(d){ stopAll(); curIdx=Math.max(0,Math.min(allData.length-1,curIdx+d)); document.getElementById('swipeWrap').children[curIdx]?.scrollIntoView({behavior:'smooth',inline:'start'}); updateInfo(curIdx); setTimeout(()=>playThis(curIdx),400); }
function closeM(){ stopAll(); document.getElementById('modal').style.display='none'; }

function kompresImage(imgEl, maxW, quality){
  return new Promise(res=>{
    const c=document.createElement('canvas');
    let w=imgEl.width, h=imgEl.height;
    if(w>maxW || h>maxW){ if(w>h){ h*=maxW/w; w=maxW; } else { w*=maxW/h; h=maxW; } }
    c.width=w; c.height=h; c.getContext('2d').drawImage(imgEl,0,0,w,h);
    res(c.toDataURL('image/jpeg', quality));
  });
}

document.getElementById('fThumb').addEventListener('change',e=>{ 
  let f=e.target.files[0]; if(!f) return; 
  let rd=new FileReader(); 
  rd.onload=ev=>{ 
    let img=new Image(); 
    img.onload=async()=>{ 
      let c=document.createElement('canvas'); c.width=600;c.height=600; 
      let ctx=c.getContext('2d'); 
      let s=Math.min(img.width,img.height); 
      ctx.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,600,600); 
      let tempImg=new Image();
      tempImg.onload=async()=>{
        manualThumb=await kompresImage(tempImg, 600, 0.65);
        document.getElementById('thumbBox').innerHTML='<img src="'+manualThumb+'"><div style=position:absolute;bottom:2px;left:2px;background:#00ff88;color:#000;font-size:8px;padding:1px 4px;border-radius:4px>'+Math.round(manualThumb.length*0.75/1024)+'KB ✅</div>'; 
      };
      tempImg.src=c.toDataURL('image/jpeg',0.65);
    }; 
    img.src=ev.target.result; 
  }; 
  rd.readAsDataURL(f); 
});

async function saveManual(){ 
  let url=document.getElementById('igUrl').value.trim(); 
  if(!manualThumb) return alert('Pilih thumb dulu Bos!'); 
  if(!url) return alert('Paste link IG!'); 
  let akun=url.split("/")[3]||'minang'; 
  let res=await fetch('/api/ig-curated/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({akun,img:manualThumb,linkIG:url})}); 
  if((await res.json()).ok){ toggleUp(); loadFoto(); } 
}

async function previewIG(){ 
  let url=document.getElementById('igUrl').value.trim(); 
  if(!url) return alert('Paste link IG'); 
  try{ 
    let r=await fetch('/api/ig-preview?url='+encodeURIComponent(url)); 
    let j=await r.json(); 
    tempIG={akun:j.username||'minang',img:j.thumbnail,linkIG:url}; 
    document.getElementById('igPrev').style.display='block'; 
    document.getElementById('igPrevImg').src=j.thumbnail; 
    document.getElementById('igPrevAkun').innerText='@'+tempIG.akun; 
  }catch{} 
}

async function saveIG(){ 
  if(!tempIG.linkIG) return alert('Ambil dulu Bos'); 
  let r=await fetch('/api/ig-curated/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tempIG)}); 
  if((await r.json()).ok){ toggleUp(); loadFoto(); } 
}

async function upFoto(){ 
  let el=document.getElementById('fFile'); 
  if(!el.files[0]) return alert('Pilih foto'); 
  let info=document.getElementById('upInfo');
  info.innerText='Kompres Bos...';
  let f=el.files[0];
  let origKB=Math.round(f.size/1024);
  let rd=new FileReader(); 
  rd.onload=e=>{ 
    let img=new Image(); 
    img.onload=async()=>{ 
      let compressed=await kompresImage(img, 1024, 0.6);
      let compKB=Math.round(compressed.length*0.75/1024);
      info.innerText='Upload... '+origKB+'KB → '+compKB+'KB ✅';
      await fetch('/api/images/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:compressed})}); 
      try{
        let myEmail=localStorage.getItem('rg_email')||'anon@rumahgadang-ai.my.id';
        await fetch('/api/foto/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:myEmail, img:compressed})});
      }catch{}
      alert('OK BOS! Berhasil Diupload & Dikompres.');
      toggleUp(); loadFoto(); info.innerText='';
    }; 
    img.src=e.target.result; 
  }; 
  rd.readAsDataURL(f); 
}

loadFoto();
</script>
</body>
</html>
`;
export default FOTO_HTML;
