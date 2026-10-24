<!DOCTYPE html>
<html><head><style>
@font-face {
  font-family: "Optimistic";
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url("/fonts/OptimisticAI_VF_Optimized.woff2") format("woff2");
}
@font-face {
  font-family: "Optimistic Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/OptimisticMono_W_TextRegular.woff2") format("woff2");
}
:where(html) {
  font-family: "Optimistic", system-ui, sans-serif;
}
:where(code, pre, kbd, samp) {
  font-family: "Optimistic Mono", ui-monospace, monospace;
}
</style>
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
.post-av{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;flex-shrink:0;cursor:pointer;transition:0.2s}
.post-av:active{transform:scale(0.9);box-shadow:0 0 15px #00ff88}
.post-body{flex:1;min-width:0}
.post-name{font-weight:800;font-size:14px;color:#fff;cursor:pointer}
.post-name:active{color:#00ff88}
.post-email{font-size:11px;color:#00ff88;margin-left:4px;pointer-events:none}
.post-time{font-size:11px;color:#777;margin-left:6px}
.post-text{margin-top:7px;font-size:14.5px;line-height:1.55;color:#f0f0f0;white-space:pre-wrap;word-break:break-word}
.post-img{margin-top:11px;border-radius:12px;overflow:hidden;border:1.5px solid #222;background:#111}
.post-img img{width:100%;display:block}
.post-badge{font-size:10px;font-weight:800;padding:3px 8px;border-radius:20px;margin-left:6px;display:inline-block;vertical-align:middle}
.badge-tulis{background:#00ff88;color:#000}
.badge-foto{background:#ffcc00;color:#000}
.badge-video{background:#ff3b82;color:#fff}
.like-bar{margin-top:11px;display:flex;gap:8px}
.btn-like{background:#161616;border:1px solid #2a2a2a;color:#ddd;padding:7px 13px;border-radius:22px;font-size:12px}
.del{background:#ff1a1a;color:#fff;border:0;padding:7px 13px;border-radius:22px;font-size:11px;margin-left:auto;cursor:pointer}
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:525px;background:#000;border-top:2.5px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#00ff88}
.bot a span{font-size:10px;display:block;margin-top:2px;font-weight:700}
.empty{text-align:center;padding:50px 20px;color:#666}
</style></head><body>
<div id=app>
<div class=top><div style="display:flex;gap:10px;align-items:center"><img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class=logo><div class=brand>RUMAH GADANG AI</div></div><button class=btnLogin onclick="location.href='/akun'">LOGIN</button></div>
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
<script>
const LOGO_FALLBACK="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
const ADMIN_EMAILS=["admin@rumahgadang-ai.my.id","naura@rumahgadang-ai.my.id","defarel@rumahgadang-ai.my.id"];
let selectedImg="";
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

function fmtTime(t){let d=new Date(Number(t)||Date.now()); return d.toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}

async function safeFetchJson(url){
  try{
    let r = await fetch(url,{cache:'no-store'});
    if(!r.ok) return [];
    let d = await r.json();
    return Array.isArray(d) ? d : (d.results || d.data || []);
  }catch{ return []; }
}

async function loadTulis(){
 try{
  let h=document.getElementById('homeFeed');
  h.innerHTML='<div class=empty>Tunggu sanak...</div>';

  // FETCH 3 ENDPOINT - JANGAN UBAH YANG LAIN, CUMA HOME YANG DIGABUNG
  let [listTulisRaw, listFotoRaw, listVideoRaw] = await Promise.all([
    safeFetchJson('/api/tulis'),
    safeFetchJson('/api/foto'),
    safeFetchJson('/api/video')
  ]);

  let normalize = (arr, tipe) => arr.map(x=>{
    // cover semua kemungkinan nama field di API kamu
    let img = x.tulisImg || x.fotoImg || x.foto_img || x.videoImg || x.thumbnail || x.thumb || x.img || x.image || x.url || x.link || '';
    let videoUrl = x.videoUrl || x.video_url || x.video || x.urlVideo || '';
    // kalau img masih base64 kepanjangan, tetap tampil
    return {
      id: x.id,
      type: tipe,
      text: x.text || x.isi || x.caption || x.deskripsi || x.judul || '',
      img: img,
      videoUrl: videoUrl,
      name: x.name || (x.email||'').split('@')[0] || 'Dunsanak',
      email: x.user_email || x.email || '',
      picture: x.picture || x.avatar || LOGO_FALLBACK,
      time: x.time || x.created_at || x.timestamp || Date.now(),
      likes: x.likes || 0,
      raw: x
    };
  });

  let all = [
    ...normalize(listTulisRaw, 'tulis'),
    ...normalize(listFotoRaw, 'foto'),
    ...normalize(listVideoRaw, 'video')
  ];

  // sort terbaru dulu
  all.sort((a,b)=> Number(b.time) - Number(a.time));

  if(!all.length){h.innerHTML='<div class=empty>Belum ada tulisan Bos</div>';return;}
  let admin=isAdmin();

  h.innerHTML = all.map(x=>{
   let badge = x.type==='foto' ? '<span class="post-badge badge-foto">FOTO</span>' : x.type==='video' ? '<span class="post-badge badge-video">VIDEO</span>' : '<span class="post-badge badge-tulis">TULIS</span>';
   let mediaHtml = '';
   if(x.videoUrl){
     mediaHtml = `<div class="post-img"><video src="${x.videoUrl}" controls playsinline style="width:100%;display:block"></video></div>`;
   } else if(x.img){
     mediaHtml = `<div class="post-img"><img src="${x.img}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`;
   }
   let safeEmail = (x.email||'').replace(/'/g,"");
   let safeText = (x.text||'').replace(/</g,'&lt;');
   return `<div class="post">
     <img class="post-av" src="${x.picture}" onclick="openProfil('${safeEmail}')" onerror="this.src='${LOGO_FALLBACK}'">
     <div class="post-body">
       <div><span class="post-name" onclick="openProfil('${safeEmail}')">${x.name}</span><span class="post-email">${x.email}</span><span class="post-time"> • ${fmtTime(x.time)}</span>${badge}</div>
       <div class="post-text">${safeText}</div>
       ${mediaHtml}
       <div class="like-bar"><button class="btn-like">❤️ ${x.likes}</button><button class="btn-like">💬 Komen</button>${admin?`<button class="del" onclick="hapusPost(${x.id},'${x.type}')">HAPUS</button>`:''}</div>
     </div>
   </div>`;
  }).join('');

 }catch(e){document.getElementById('homeFeed').innerHTML='<div class=empty>Error: '+e.message+'</div>';}
}

async function addTulis(){
 let txt=document.getElementById('tulisIn').value.trim();
 if(!txt&&!selectedImg){alert("Tulis dulu sanak!");return;}
 let btn=document.querySelector('.btnKirim');btn.innerText="MENGIRIM...";btn.disabled=true;
 try{
  let email=getEmail()||'anon@rumahgadang-ai.my.id';
  if(!email.includes('@'))email=email+'@rumahgadang-ai.my.id';
  let payload={text:txt,email:email,user_email:email,name:getName(),picture:getAvatar(),tulisImg:selectedImg,isi:txt,img:selectedImg};
  let r=await fetch('/api/tulis/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  let j=await r.json(); if(j.ok===false)throw new Error(j.error||'Gagal');
  document.getElementById('tulisIn').value='';clearImg();await loadTulis();
 }catch(e){alert("Gagal Bos: "+e.message);}
 btn.innerText="KIRIM";btn.disabled=false;
}

async function hapusPost(id,type){
 if(!confirm("Hapus Bos?"))return;
 let endpoint = type==='foto' ? '/api/foto/delete' : type==='video' ? '/api/video/delete' : '/api/tulis/delete';
 try{
   await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});
 }catch{}
 location.reload();
}

loadTulis();
</script><script>(function(){var loc=location.href.replace(/#.*$/,"");var ATTR_NAMES=["data-product-id","data-productid","data-product_id","product-id","productid","product_id","data-source-entity-id","source-entity-id","source_entity_id","data-product","data-metadata","data-meta"];var DATASET_KEYS=["productId","productid","product_id","sourceEntityId","sourceentityid","source_entity_id","product","metadata","meta"];function readProductId(value){if(typeof value!=="string"||value.length===0)return null;if(/^[0-9]{6,}$/.test(value))return value;var match=value.match(/(?:product(?:_|-)?id|source(?:_|-)?entity(?:_|-)?id)["'=:\s]+([0-9]{6,})/i);return match?match[1]:null}function extractProductId(start){for(var node=start;node&&node!==document.body;node=node.parentElement){for(var i=0;i<ATTR_NAMES.length;i++){var attrValue=node.getAttribute&&node.getAttribute(ATTR_NAMES[i]);var attrProductId=readProductId(attrValue);if(attrProductId)return attrProductId}var dataset=node.dataset||null;if(dataset){for(var j=0;j<DATASET_KEYS.length;j++){var dataValue=dataset[DATASET_KEYS[j]];var dataProductId=readProductId(dataValue);if(dataProductId)return dataProductId}}}return null}function isInlineMediaSlotElement(node){return !!(node&&node.getAttribute&&node.getAttribute("data-clippy-inline-media-slot")!==null)}function findInlineMediaSlot(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(isInlineMediaSlotElement(node))return node}return null}function readInlineMediaUrl(node){if(!node)return null;return node.getAttribute&&((node.getAttribute("data-clippy-inline-media-url")||node.getAttribute("data-url")||node.getAttribute("data_url")))||node.href||null}function stripHash(url){return String(url).replace(/#.*$/,"")}function urlsMatch(a,b){if(!a||!b)return false;try{return stripHash(new URL(a,loc).href)===stripHash(new URL(b,loc).href)}catch(_){return stripHash(a)===stripHash(b)}}function isFirstPartyReelUrl(value){try{var url=new URL(value,loc);if(url.protocol!=="https:")return false;var host=url.hostname.toLowerCase();var supported=host==="instagram.com"||host.endsWith(".instagram.com")||host==="facebook.com"||host.endsWith(".facebook.com");return supported&&/\/reels?\//i.test(url.pathname)}catch(_){return false}}function isInlineMediaUrlClick(node,href){var slot=findInlineMediaSlot(node);if(!slot)return false;var slotUrl=readInlineMediaUrl(slot);if(slotUrl)return urlsMatch(href,slotUrl);return isFirstPartyReelUrl(href)}function findDataHref(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(node.getAttribute){var href=node.getAttribute("data-href")||node.getAttribute("data-url");if(href)return{href:href,node:node}}}return null}var nativeOpen=window.open;window.open=function(url){if(parent!==window&&typeof url==="string"&&/^https?:\/\//.test(url)){parent.postMessage({type:"ecto:usercontent-link-click",href:url},"*");return null}return nativeOpen?nativeOpen.apply(window,arguments):null};document.addEventListener("click",function(e){var target=e.target instanceof Element?e.target:null;if(!target)return;if(parent===window)return;var a=target.closest?target.closest("a[href]"):null;if(a&&a.href&&/^https?:\/\//.test(a.href)&&a.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(a,a.href))return;var productId=extractProductId(target)||extractProductId(a);if(productId){e.preventDefault();parent.postMessage({type:"ecto-artifact-link-click",productId:productId},"*");return}e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:a.href},"*");return}var dataHref=findDataHref(target);if(dataHref&&/^https?:\/\//.test(dataHref.href)&&dataHref.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(dataHref.node,dataHref.href))return;e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:dataHref.href},"*")}},true)})();</script><script>(function(){var FOCUS_TYPE="ecto:artifact-focus-request";var CLOSE_TYPE="ecto:artifact-close-request";function focusArtifactDocument(){var body=document.body;if(!body)return;try{window.focus();}catch(e){}if(!body.hasAttribute("tabindex"))body.setAttribute("tabindex","-1");try{body.focus({preventScroll:true});}catch(e){try{body.focus();}catch(e2){}}}window.addEventListener("message",function(event){if(event.source!==window.parent)return;var data=event.data;if(!data||typeof data!=="object"||data.type!==FOCUS_TYPE)return;if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",focusArtifactDocument,{once:true});return;}focusArtifactDocument();});window.addEventListener("keydown",function(event){if(event.key!=="Escape")return;window.setTimeout(function(){if(event.defaultPrevented)return;window.parent.postMessage({type:CLOSE_TYPE},"*");},0);});})();</script></body></html>
