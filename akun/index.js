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
* { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
body { background: #000; color: #fff; display: flex; justify-content: center; }

#app {
  width: 100%;
  max-width: 500px;
  background: #000;
  min-height: 100vh;
  padding-bottom: 90px;
  border-left: 2px solid #00ff88;
  border-right: 2px solid #00ff88;
  border-bottom: 2px solid #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}

/* Header Navbar */
.top-nav {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #111;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #00ff88;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.8);
  object-fit: cover;
}
.brand span {
  font-weight: 900;
  font-size: 16px;
  letter-spacing: 0.5px;
}
.btn-login {
  background: #fff;
  color: #000;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
}

/* Input Form Box */
.create-box {
  padding: 14px;
  border-bottom: 2px solid #00ff88;
  background: #000;
}
.input-row {
  display: flex;
  gap: 10px;
}
.input-txt {
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
.input-txt::placeholder { color: #888; }
.btn-add-file {
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
.btn-submit {
  width: 100%;
  margin-top: 10px;
  background: #00ff88;
  color: #000;
  border: none;
  padding: 12px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.6);
}
#preview {
  margin-top: 10px;
  display: none;
  position: relative;
}
#preview img {
  width: 100%;
  border-radius: 12px;
  max-height: 250px;
  object-fit: cover;
  border: 1px solid #00ff88;
}
#preview .close-prev {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.8);
  color: #fff;
  padding: 4px 10px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #444;
}

/* Post Cards */
.feed-container {
  padding: 10px;
}
.post-card {
  background: #080808;
  border: 2px solid #00ff88;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 14px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.post-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid #00ff88;
  object-fit: cover;
}
.post-author {
  font-weight: 800;
  font-size: 15px;
  color: #fff;
}
.post-date {
  font-size: 12px;
  color: #888;
  font-weight: normal;
  margin-left: 6px;
}
.post-content {
  font-size: 14px;
  line-height: 1.5;
  color: #eee;
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 10px;
}
.post-image-box {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #222;
  margin-bottom: 12px;
}
.post-image-box img {
  width: 100%;
  display: block;
  max-height: 380px;
  object-fit: cover;
}

/* Post Actions Bar */
.post-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.btn-action {
  background: #121212;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.btn-delete {
  background: #ff1a1a;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  margin-left: auto;
}

/* Bottom Nav Bar */
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: #000;
  border-top: 2px solid #00ff88;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 999;
  box-shadow: 0 -4px 12px rgba(0,255,136,0.3);
}
.bottom-nav a {
  color: #777;
  text-decoration: none;
  text-align: center;
  font-size: 18px;
  flex: 1;
}
.bottom-nav a.active { color: #fff; }
.bottom-nav span { display: block; font-size: 10px; margin-top: 2px; }
</style>
</head>
<body>

<div id="app">
  <!-- Top Bar -->
  <div class="top-nav">
    <div class="brand">
      <img src="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png" alt="Logo">
      <span>RUMAH GADANG AI</span>
    </div>
    <button class="btn-login" onclick="location.href='/akun'">LOGIN</button>
  </div>

  <!-- Create Post Box -->
  <div class="create-box">
    <div class="input-row">
      <input type="text" id="postInput" class="input-txt" placeholder="Tulis disini...">
      <button class="btn-add-file" onclick="document.getElementById('fileInput').click()">+</button>
    </div>
    <div id="preview">
      <img id="prevImg">
      <span class="close-prev" onclick="clearImage()">✕</span>
    </div>
    <button class="btn-submit" onclick="submitPost()">KIRIM</button>
    <input type="file" id="fileInput" accept="image/*" style="display:none">
  </div>

  <!-- Feed D1 Stream -->
  <div id="feedList" class="feed-container">
    <div style="text-align:center; padding:30px; color:#888;">Memuat postingan...</div>
  </div>
</div>

<!-- Bottom Navigation Bar -->
<div class="bottom-nav">
  <a href="/" class="active">🏠<span>Home</span></a>
  <a href="/foto">🖼️<span>Foto</span></a>
  <a href="/video">🎬<span>Video</span></a>
  <a href="/kantor">🏢<span>Kantor</span></a>
  <a href="/ai">🤖<span>AI</span></a>
  <a href="/akun">👤<span>Akun</span></a>
</div>

<script>
const DEFAULT_LOGO = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png";
let selectedImageBase64 = "";

// Cek Akun Login dari LocalStorage
function getUserSession() {
  return {
    email: (localStorage.getItem('rg_email') || "").toLowerCase().trim(),
    name: localStorage.getItem('rg_name') || "Dunsanak",
    avatar: localStorage.getItem('rg_avatar') || DEFAULT_LOGO
  };
}

// Reset pilihan gambar
function clearImage() {
  selectedImageBase64 = "";
  document.getElementById('preview').style.display = 'none';
  document.getElementById('prevImg').src = "";
  document.getElementById('fileInput').value = "";
}

// Handler Pilih File Gambar
document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    alert("Ukuran gambar maksimal 4MB!");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(ev) {
    selectedImageBase64 = ev.target.result;
    document.getElementById('prevImg').src = selectedImageBase64;
    document.getElementById('preview').style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Load Feed dari Database D1
async function loadFeed() {
  const feedContainer = document.getElementById('feedList');
  try {
    const res = await fetch('/api/tulis');
    if (!res.ok) throw new Error("Gagal terhubung ke database D1");
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      feedContainer.innerHTML = '<div style="text-align:center; padding:40px; color:#666;">Belum ada postingan D1</div>';
      return;
    }

    const session = getUserSession();
    feedContainer.innerHTML = posts.map(item => {
      const avatar = item.picture || DEFAULT_LOGO;
      const authorName = item.name || "Anonim";
      const postDate = item.time ? new Date(item.time).toLocaleString('id-ID') : '';
      const contentText = item.text || '';
      const imageTag = item.tulisImg ? '<div class="post-image-box"><img src="' + item.tulisImg + '" loading="lazy"></div>' : '';
      
      // Tombol hapus jika milik user login atau admin
      const isOwner = session.email && (session.email === (item.email || '').toLowerCase().trim());
      const deleteBtn = isOwner ? '<button class="btn-delete" onclick="deletePost(' + item.id + ')">HAPUS</button>' : '';

      return '<div class="post-card" id="post-' + item.id + '">' +
        '<div class="post-header">' +
          '<img class="post-avatar" src="' + avatar + '" onerror="this.src=\\'' + DEFAULT_LOGO + '\\'">' +
          '<div>' +
            '<span class="post-author">' + authorName + '</span>' +
            '<span class="post-date">• ' + postDate + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="post-content">' + contentText + '</div>' +
        imageTag +
        '<div class="post-actions">' +
          '<button class="btn-action">❤️ ' + (item.likes || 0) + '</button>' +
          '<button class="btn-action">💬 Komen</button>' +
          deleteBtn +
        '</div>' +
      '</div>';
    }).join('');

  } catch (err) {
    feedContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#ff4444;">Error: ' + err.message + '</div>';
  }
}

// Kirim Postingan Baru ke Database D1
async function submitPost() {
  const session = getUserSession();
  
  if (!session.email) {
    alert("Silakan login akun Anda terlebih dahulu untuk membuat postingan!");
    location.href = '/akun';
    return;
  }

  const textInput = document.getElementById('postInput');
  const textContent = textInput.value.trim();

  if (!textContent && !selectedImageBase64) {
    alert("Tulis sesuatu atau pilih gambar terlebih dahulu!");
    return;
  }

  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.innerText = "MENGIRIM...";
  btnSubmit.disabled = true;

  try {
    const res = await fetch('/api/tulis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: textContent,
        email: session.email,
        name: session.name,
        picture: session.avatar,
        tulisImg: selectedImageBase64
      })
    });

    const result = await res.json().catch(() => ({}));

    if (res.ok && (result.ok || result.success || !result.error)) {
      textInput.value = '';
      clearImage();
      await loadFeed();
    } else {
      alert("Gagal posting: " + (result.error || result.message || "Gagal menyimpan ke D1"));
    }
  } catch (err) {
    alert("Kesalahan jaringan: " + err.message);
  } finally {
    btnSubmit.innerText = "KIRIM";
    btnSubmit.disabled = false;
  }
}

// Hapus Postingan dari D1
async function deletePost(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) return;
  const session = getUserSession();
  try {
    const res = await fetch('/api/tulis/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, email: session.email })
    });
    if (!res.ok) throw new Error("Gagal menghapus postingan");
    document.getElementById('post-' + id)?.remove();
  } catch (err) {
    alert("Gagal menghapus: " + err.message);
  }
}

// Load data awal
loadFeed();
<\/script>
</body>
</html>
`;
