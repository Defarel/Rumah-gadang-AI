export const HOME_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rumah Gadang AI - Komunitas Minangkabau</title>
<meta name="description" content="Rumah Gadang AI - Komunitas digital Minangkabau, berbagi foto video dan AI karya anak Minang.">
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<link rel="canonical" href="https://www.rumahgadang-ai.my.id/">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: #000; color: #fff; display: flex; justify-content: center; }

#app {
  width: 100%;
  max-width: 520px;
  min-height: 100vh;
  padding-bottom: 90px;
  background: #000;
  border-left: 2px solid #00ff88;
  border-right: 2px solid #00ff88;
  border-bottom: 2px solid #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}

.top {
  position: sticky;
  top: 0;
  background: #000;
  z-index: 10;
  padding: 12px 16px;
  border-bottom: 1px solid #111;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #00ff88;
  object-fit: cover;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.8);
}

/* Form Input Postingan */
.create-box {
  padding: 14px;
  background: #000;
  border-bottom: 2px solid #00ff88;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
}
.input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.txt {
  flex: 1;
  background: #0a0a0a;
  border: 2px solid #00ff88;
  color: #fff;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 15px;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
}
.txt::placeholder { color: #888; }
.btnPlus {
  width: 46px;
  height: 46px;
  background: #181818;
  border: 1px solid #333;
  color: #fff;
  border-radius: 12px;
  font-size: 26px;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}
.btnKirim {
  width: 100%;
  margin-top: 10px;
  background: #00ff88;
  color: #000;
  border: 0;
  padding: 12px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.6);
}

/* Post Cards */
.post {
  padding: 14px;
  display: flex;
  gap: 10px;
  background: #080808;
  margin: 10px 8px;
  border-radius: 16px;
  border: 2px solid #00ff88;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}
.post-av {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #00ff88;
  flex-shrink: 0;
}
.post-body {
  flex: 1;
  min-width: 0;
}
.post-name {
  font-weight: 800;
  font-size: 14px;
  color: #fff;
}
.post-time {
  font-size: 11px;
  color: #888;
  margin-left: 6px;
}
.post-text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #eee;
  white-space: pre-wrap;
  word-break: break-word;
}
.post-img {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #222;
}
.post-img img {
  width: 100%;
  display: block;
  max-height: 360px;
  object-fit: cover;
}

.like-bar {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.btn-like {
  background: #121212;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
}
.del {
  background: #ff1a1a;
  color: #fff;
  border: 0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  cursor: pointer;
  font-weight: 800;
  margin-left: auto;
}

/* Bottom Navigation */
.bot {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 520px;
  background: #000;
  border-top: 2px solid #00ff88;
  display: flex;
  z-index: 99;
  box-shadow: 0 -4px 12px rgba(0,255,136,0.3);
}
.bot a {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  color: #777;
  text-decoration: none;
  font-size: 18px;
}
.bot a.on { color: #fff; }
.bot a span { display: block; font-size: 10px; margin-top: 2px; }
</style>
</head>
<body>

<div id="app">
  <div class="top">
    <div style="display:flex;gap:10px;align-items:center">
      <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" class="logo">
      <b>RUMAH GADANG AI</b>
    </div>
    <button onclick="location.href='/akun'" style="background:#fff;color:#000;border:0;padding:6px 16px;border-radius:20px;font-weight:800;font-size:12px;cursor:pointer">LOGIN</button>
  </div>

  <!-- Kotak Buat Postingan -->
  <div class="create-box">
    <div class="input-row">
      <input id="tulisIn" class="txt" placeholder="Tulis disini...">
      <button class="btnPlus" onclick="document.getElementById('tulisFile').click()">+</button>
    </div>
    <div id="tulisPreview" style="display:none;margin-top:10px;position:relative">
      <img id="tulisPreviewImg" style="width:100%;max-height:220px;border-radius:12px;object-fit:cover;border:1px solid #00ff88">
      <span onclick="clearPrev()" style="position:absolute;top:8px;right:8px;background:#000;color:#fff;padding:4px 10px;border-radius:50%;cursor:pointer;border:1px solid #333">✕</span>
    </div>
    <button class="btnKirim" onclick="addTulis()">KIRIM</button>
    <input id="tulisFile" type="file" accept="image/*" style="display:none">
  </div>

  <!-- Feed Postingan dari D1 -->
  <div id="homeFeed" style="padding:4px 0">Memuat postingan...</div>
</div>

<!-- Navigasi Bawah -->
<div class="bot">
  <a href="/" class="on">🏠<span>Home</span></a>
  <a href="/foto">🖼️<span>Foto</span></a>
  <a href="/video">🎬<span>Video</span></a>
  <a href="/kantor">🏢<span>Kantor</span></a>
  <a href="/ai">🤖<span>AI</span></a>
  <a href="/akun">👤<span>Akun</span></a>
</div>

<script>
const DEFAULT_LOGO = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
const ADMIN_EMAILS = ["admin@rumahgadang-ai.my.id", "naura@rumahgadang-ai.my.id", "defarel@gmail.com"];
let selectedImageBase64 = "";

function getEmail() { return (localStorage.getItem('rg_email') || '').toLowerCase().trim(); }
function getName() { return localStorage.getItem('rg_name') || 'Dunsanak'; }
function getAvatar() { return localStorage.getItem('rg_avatar') || DEFAULT_LOGO; }
function isAdminCheck() { return ADMIN_EMAILS.includes(getEmail()); }

function clearPrev() {
  selectedImageBase64 = '';
  document.getElementById('tulisPreview').style.display = 'none';
  document.getElementById('tulisPreviewImg').src = '';
  document.getElementById('tulisFile').value = '';
}

// Compress & Preview Image
document.getElementById('tulisFile')?.addEventListener('change', function(e) {
  let f = e.target.files[0];
  if(!f) return;
  if(f.size > 4 * 1024 * 1024){ alert("Maksimal ukuran gambar 4MB!"); return; }
  let rd = new FileReader();
  rd.onload = function(ev){
    let img = new Image();
    img.onload = function(){
      let c = document.createElement('canvas'); 
      c.width = 600; 
      c.height = 600 * img.height / img.width;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      selectedImageBase64 = c.toDataURL('image/jpeg', 0.6);
      document.getElementById('tulisPreviewImg').src = selectedImageBase64;
      document.getElementById('tulisPreview').style.display = 'block';
    };
    img.src = ev.target.result;
  };
  rd.readAsDataURL(f);
});

// Load Postingan D1
async function loadTulis() {
  try {
    let r = await fetch('/api/tulis');
    let d = await r.json();
    let h = document.getElementById('homeFeed');
    if(!h) return;
    
    if(!Array.isArray(d) || !d.length){
      h.innerHTML = '<div style="padding:30px;text-align:center;color:#666">Belum ada tulisan Bos, jadi yang pertama Bos!</div>';
      return;
    }
    
    let sessionEmail = getEmail();
    h.innerHTML = d.map(x => {
      let isOwner = sessionEmail && sessionEmail === (x.email || '').toLowerCase().trim();
      let deleteBtn = (isOwner || isAdminCheck()) ? '<button class="del" onclick="delPost(' + x.id + ')">HAPUS</button>' : '';
      let imgHtml = x.tulisImg ? '<div class="post-img"><img src="' + x.tulisImg + '" loading="lazy"></div>' : '';
      let postDate = x.time ? new Date(x.time).toLocaleString('id-ID') : '';
      
      return '<div class="post" id="post-' + x.id + '">' +
        '<img class="post-av" src="' + (x.picture || DEFAULT_LOGO) + '" onerror="this.src=\\'' + DEFAULT_LOGO + '\\'">' +
        '<div class="post-body">' +
          '<div><span class="post-name">' + (x.name || 'Anonim') + '</span><span class="post-time">• ' + postDate + '</span></div>' +
          '<div class="post-text">' + (x.text || '') + '</div>' +
          imgHtml +
          '<div class="like-bar">' +
            '<span class="btn-like">❤️ ' + (x.likes || 0) + '</span>' +
            '<span class="btn-like">💬 Komen</span>' +
            deleteBtn +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  } catch(e) {
    document.getElementById('homeFeed').innerHTML = '<div style="padding:20px;text-align:center;color:#ff4444">Gagal memuat feed D1</div>';
  }
}

// Kirim Postingan Baru ke /api/tulis
async function addTulis() {
  let sessionEmail = getEmail();
  if(!sessionEmail){
    alert('Silakan login akun Anda terlebih dahulu!');
    location.href = '/akun';
    return;
  }
  
  let txt = document.getElementById('tulisIn').value.trim();
  if(!txt && !selectedImageBase64){
    alert('Tulis sesuatu atau pilih gambar terlebih dahulu!');
    return;
  }
  
  let btn = document.querySelector('.btnKirim');
  if(btn){ btn.innerText = "MENGIRIM..."; btn.disabled = true; }

  try {
    let res = await fetch('/api/tulis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: txt,
        email: sessionEmail,
        name: getName(),
        picture: getAvatar(),
        tulisImg: selectedImageBase64
      })
    });
    
    let j = await res.json();
    if(res.ok && (j.ok || j.success || !j.error)){
      document.getElementById('tulisIn').value = '';
      clearPrev();
      await loadTulis();
    } else {
      alert('Gagal: ' + (j.error || 'Gagal menyimpan postingan'));
    }
  } catch(e) {
    alert('Kesalahan jaringan: ' + e.message);
  } finally {
    if(btn){ btn.innerText = "KIRIM"; btn.disabled = false; }
  }
}

// Hapus Postingan melalui /api/tulis/delete
async function delPost(id) {
  if(!confirm('Apakah Anda yakin ingin menghapus postingan ini?')) return;
  try {
    let res = await fetch('/api/tulis/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, email: getEmail() })
    });
    let j = await res.json();
    if(res.ok && (j.ok || j.success)){
      document.getElementById('post-' + id)?.remove();
    } else {
      alert('Gagal menghapus: ' + (j.error || 'Terjadi kesalahan'));
    }
  } catch(e) {
    alert('Kesalahan jaringan: ' + e.message);
  }
}

window.addEventListener('load', function() {
  loadTulis();
});
</script>
</body>
</html>
`;
