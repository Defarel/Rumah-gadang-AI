export const AI_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rumah Gadang AI - AI Assistant</title>
<link rel="icon" href="https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
#app{max-width:520px;margin:0 auto;background:#000;min-height:100vh;position:relative;overflow:hidden;border-left:2px solid #00ff88;border-right:2px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.6)}

/* Background Image Layer */
.bg-container{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}
.bg-container img{width:100%;height:100%;object-fit:cover;display:block}
.overlay-dark{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);z-index:2}

/* Top Bar & Floating Buttons */
.top-bar{position:absolute;top:0;left:0;width:100%;padding:16px;display:flex;justify-content:space-between;align-items:center;z-index:10}
.app-title{font-size:18px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,0.8)}
.top-right-btns{display:flex;flex-direction:column;gap:8px;align-items:flex-end}
.floating-btn{background:rgba(0,0,0,0.7);color:#fff;border:1px solid #00ff88;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;backdrop-filter:blur(4px);box-shadow:0 0 8px rgba(0,255,136,0.4);text-decoration:none}
.floating-btn.green{background:#00ff88;color:#000;border:none;font-weight:900}

/* Chat Input Bar at Bottom */
.bottom-chat-bar{position:absolute;bottom:0;left:0;width:100%;padding:16px;display:flex;gap:10px;z-index:10;background:linear-gradient(to top, rgba(0,0,0,0.9), transparent)}
.chat-input{flex:1;background:rgba(20,20,20,0.85);border:1px solid #333;border-radius:16px;padding:14px 16px;color:#fff;font-size:14px;outline:none;backdrop-filter:blur(6px)}
.chat-input::placeholder{color:#aaa}
.btn-kirim{background:#00ff88;color:#000;border:none;padding:0 20px;border-radius:16px;font-weight:900;font-size:14px;cursor:pointer;box-shadow:0 0 10px rgba(0,255,136,0.6);display:grid;place-items:center;transition:0.2s}
.btn-kirim:active{transform:scale(0.95)}

/* Bottom Navigation */
.bot{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:520px;background:#000;border-top:2px solid #00ff88;display:flex;z-index:99}
.bot a{flex:1;text-align:center;padding:10px 0;color:#666;text-decoration:none;font-size:20px}
.bot a.on{color:#fff}
</style>
</head>
<body>
<div id="app">
  <!-- Latar Belakang Gambar Rumah Gadang AI -->
  <div class="bg-container">
    <img src="https://i.ibb.co/WQg0cwp/Rumah-Gadang-AI1.jpg" alt="Rumah Gadang AI Background">
    <div class="overlay-dark"></div>
  </div>

  <!-- Header & Tombol Melayang Atas -->
  <div class="top-bar">
    <div class="app-title">Rumah Gadang Al</div>
    <div class="top-right-btns">
      <button class="floating-btn" onclick="alert('Membuka RG Musik')">🎵 RG Musik</button>
      <button class="floating-btn green" onclick="alert('Membuka Tanyo Bundo')">💬 Tanyo Bundo</button>
    </div>
  </div>

  <!-- Area Input Pesan Bawah -->
  <div class="bottom-chat-bar" style="margin-bottom: 50px;">
    <input type="text" id="userInput" class="chat-input" placeholder="Tanya Rumah Gadang Al...">
    <button class="btn-kirim" onclick="handleSend()">KIRIM &rarr;</button>
  </div>
</div>

<!-- Navigasi Bawah -->
<div class="bot">
  <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
  <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
  <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
  <a href="/kantor">🏢<br><span style="font-size:10px">Kantor</span></a>
  <a href="/ai" class="on">🤖<br><span style="font-size:10px">AI</span></a>
  <a href="/akun">👤<br><span style="font-size:10px">Akun</span></a>
</div>

<script>
function handleSend(){
  const val = document.getElementById('userInput').value.trim();
  if(!val){ alert("Tuliskan sesuatu terlebih dahulu!"); return; }
  alert("Mengirim pesan ke AI: " + val);
  document.getElementById('userInput').value = '';
}
</script>
</body>
</html>`;
