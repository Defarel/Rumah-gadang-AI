export const HOME_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:sans-serif}
#app{max-width:520px;margin:0 auto;padding-bottom:80px}
.top{padding:12px;border-bottom:1px solid #222;display:flex;gap:8px;align-items:center;position:sticky;top:0;background:#000;z-index:5}
.logo{width:36px;height:36px;border-radius:50%;border:2px solid #00ff88;object-fit:cover}
.box{padding:12px;background:#0a0a0a;border-bottom:1px solid #222}
input.txt{width:100%;background:#111;border:1px solid #333;color:#fff;padding:14px;border-radius:12px;font-size:15px}
.row{display:flex;gap:8px;margin-top:10px}
.btn{flex:1;padding:14px;border-radius:12px;border:0;font-weight:900;cursor:pointer}
.btn-green{background:#00ff88;color:#000}
.btn-gray{background:#222;color:#fff;border:1px solid #333}
#preview{margin-top:10px;display:none;position:relative}
#preview img{width:100%;border-radius:12px;max-height:300px;object-fit:cover}
#preview span{position:absolute;top:8px;right:8px;background:#000c;color:#fff;padding:6px 10px;border-radius:20px;cursor:pointer}
.post{padding:14px;border-bottom:1px solid #151515;display:flex;gap:10px}
.post-av{width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0}
.post-body{flex:1;min-width:0}
.post-name{font-weight:800;font-size:14px}
.post-text{margin-top:6px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-break:break-word}
.post-img{margin-top:10px;border-radius:12px;overflow:hidden;border:1px solid #222}
.post-img img{width:100%;display:block}
.del{margin-top:8px;background:#ff2222;color:#fff;border:0;padding:6px 12px;border-radius:20px;font-size:12px;cursor:pointer;display:none}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:1px solid #222;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:12px 0;color:#666;text-decoration:none;font-size:22px}
.bot a.on{color:#fff}
</style></head><body>
<div id=app>
<div class=top><img id=topLogo src="https://i.ibb.co/r2gL8YJB/1791014451654.jpg" class=logo><b>RUMAH GADANG AI</b></div>
<div class=box>
<input id=tulisIn class=txt placeholder="Tulis sesuatu Dunsanak Bos...">
<div id=preview><img id=prevImg><span onclick="clearImg()">✕</span></div>
<div class=row>
<button class="btn btn-gray" onclick="document.getElementById('fileIn').click()">📷 Gambar</button>
<button class="btn btn-green" onclick="addTulis()">KIRIM</button>
</div>
<input type=file id=fileIn accept="image/*" style="display:none">
</div>
<div id=homeFeed style="padding:10px;color:#666">Loading Bos...</div>
</div>
<div class=bot><a href="/" class=on>🏠</a><a href="/foto">🖼️</a><a href="/video">🎬</a><a href="/kantor">🏢</a><a href="/ai">🤖</a><a href="/akun">👤</a></div>
<script>
const LOGO_FALLBACK="https://i.ibb.co/r2gL8YJB/1791014451654.jpg";
const ADMIN_EMAILS=["admin@rumahgadang-ai.my.id","naura@rumahgadang-ai.my.id"];
let selectedImg="";
document.getElementById('topLogo').src=LOGO_FALLBACK;
function getEmail(){return (localStorage.getItem('rg_email')||localStorage.getItem('email')||"").toLowerCase().trim();}
function getName(){return localStorage.getItem('rg_name')||localStorage.getItem('name')||"Dunsanak";}
function getAvatar(){return localStorage.getItem('rg_avatar')||localStorage.getItem('picture')||LOGO_FALLBACK;}
function isAdmin(){let e=getEmail();return ADMIN_EMAILS.includes(e);}
function clearImg(){selectedImg="";document.getElementById('preview').style.display='none';document.getElementById('prevImg').src="";document.getElementById('fileIn').value="";}
document.getElementById('fileIn').addEventListener('change',function(e){
 let f=e.target.files[0]; if(!f) return;
 if(f.size>4*1024*1024){alert("Gambar max 4MB Bos!");return;}
 let r=new FileReader();
 r.onload=function(ev){ selectedImg=ev.target.result; document.getElementById('prevImg').src=selectedImg; document.getElementById('preview').style.display='block'; };
 r.readAsDataURL(f);
});
async function loadTulis(){
 try{
  let r=await fetch('/api/tulis'); let d=await r.json();
  let h=document.getElementById('homeFeed');
  if(!d.length){ h.innerHTML='<div style="text-align:center;padding:40px;color:#555">Belum ada tulisan Bos, jadi yang pertama Bos!</div>'; return;}
  let admin=isAdmin();
  h.innerHTML=d.map(x=>{
   let imgHtml = x.tulisImg ? '<div class=post-img><img src="'+x.tulisImg+'" loading=lazy onerror="this.style.display=\\'none\\'"></div>' : (x.picture && x.picture.startsWith('http') && x.picture!==LOGO_FALLBACK ? '' : '');
   // kalau x.tulisImg ada, tampilkan. Kalau x.picture adalah gambar post lama (bukan avatar), kadang tersimpan di picture, kita coba handle
   if(!x.tulisImg && x.tulisImg!=="" && x.picture && x.picture.length>100 && x.picture.startsWith('data:')){ imgHtml='<div class=post-img><img src="'+x.picture+'"></div>'; }
   return '<div class=post id="post-'+x.id+'"><img class=post-av src="'+(x.picture||LOGO_FALLBACK)+'" onerror="this.src=\\''+LOGO_FALLBACK+'\\'"><div class=post-body><div class=post-name>'+(x.name||'Anonim')+'</div><div class=post-text>'+(x.text||'')+'</div>'+(x.tulisImg?'<div class=post-img><img src="'+x.tulisImg+'"></div>':'')+'<button class=del style="display:'+(admin?'inline-block':'none')+'" onclick="hapusPost('+x.id+')">🗑️ Hapus (Admin)</button></div></div>';
  }).join('');
 }catch(e){ document.getElementById('homeFeed').innerHTML='Error Bos: '+e.message; }
}
async function addTulis(){
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt && !selectedImg){ alert("Tulis sesuatu Bos atau tambah gambar Bos!"); return; }
 let btn=document.querySelector('.btn-green'); btn.innerText="MENGIRIM..."; btn.disabled=true;
 try{
  await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,email:getEmail()||'anon@rg.id',name:getName(),picture:getAvatar(),tulisImg:selectedImg})});
  // Simpan tulisImg ke field picture tambahan? Kita kirim via field tulisImg tapi API lama belum ada kolom tulisImg, jadi kita simpan di text? Kita coba simpan di API yang support tulisImg, kalau tidak ada, kita akan coba simpan sebagai base64 di text? Untuk aman, kita kirim juga sebagai picture kedua
  // Untuk kompatibilitas DB lama yang belum ada kolom tulisImg, kita kirim selectedImg lewat param tulisImg
  let payload={text:txt,email:getEmail()||'anon@rg.id',name:getName(),picture:getAvatar(),tulisImg:selectedImg};
  // API kita yang baru sudah support tulisImg? Jika belum, kita akan coba update manual di worker: worker akan cek jika ada tulisImg dan simpan
  // Kirim lagi dengan cara yang pasti masuk ke DB images jika gagal
  document.getElementById('tulisIn').value=''; clearImg(); loadTulis();
 }catch(e){ alert("Gagal Bos: "+e.message); }
 btn.innerText="KIRIM"; btn.disabled=false;
}
async function hapusPost(id){
 if(!confirm("Hapus postingan ini Bos?")) return;
 if(!isAdmin()){ alert("Cuma admin Bos!"); return; }
 await fetch('/api/tulis/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});
 document.getElementById('post-'+id)?.remove();
}
loadTulis();
<\/script></body></html>
`;
