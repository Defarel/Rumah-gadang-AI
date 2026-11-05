const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png"

export const CHAT_HTML = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chat - Rumah Gadang AI</title>
<link rel="icon" href="${LOGO_DEFAULT}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0b141a;color:#fff;font-family:sans-serif;height:100vh;display:flex;flex-direction:column}
.chat-header{display:flex;align-items:center;justify-content:space-between;background:#202c33;padding:10px 16px;position:sticky;top:0;z-index:10;border-bottom:1px solid #222}
.chat-header-left{display:flex;align-items:center;gap:12px}
.chat-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #00ff88}
.chat-title{font-size:16px;font-weight:700;color:#e9edef}
.chat-subtitle{font-size:11px;color:#8696a0}
.chat-header-right{display:flex;gap:20px;font-size:20px;color:#aebac1;align-items:center}
.chat-body{flex:1;background-color:#0b141a;background-image:radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);background-size:20px 20px;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.encryption-badge{background:#182229;color:#ffd279;font-size:11px;padding:8px 12px;border-radius:8px;text-align:center;max-width:320px;margin:0 auto 12px;line-height:1.4;box-shadow:0 1px 0.5px rgba(0,0,0,0.3)}
.date-divider{background:#182229;color:#8696a0;font-size:11px;padding:6px 12px;border-radius:6px;align-self:center;margin:8px 0;box-shadow:0 1px 0.5px rgba(0,0,0,0.3)}
.message{max-width:75%;padding:8px 12px;border-radius:8px;font-size:14px;line-height:1.4;position:relative;word-wrap:break-word}
.message.incoming{background:#202c33;color:#e9edef;align-self:flex-start;border-top-left-radius:0}
.message.outgoing{background:#005c4b;color:#e9edef;align-self:flex-end;border-top-right-radius:0}
.chat-footer{display:flex;align-items:center;gap:8px;background:#202c33;padding:10px 16px;position:sticky;bottom:0}
.chat-input-wrap{flex:1;background:#2a3942;display:flex;align-items:center;border-radius:24px;padding:8px 16px;gap:12px}
.chat-input{flex:1;background:transparent;border:0;color:#fff;font-size:14px;outline:none}
.chat-input::placeholder{color:#8696a0}
.chat-tools{display:flex;gap:16px;font-size:20px;color:#8696a0;cursor:pointer}
.btn-send{background:#00a884;color:#000;border:0;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;flex-shrink:0}
#toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#00ff88;color:#000;padding:10px 16px;border-radius:20px;font-weight:900;display:none;z-index:9999;box-shadow:0 0 15px #00ff88}
</style></head><body>

<div class="chat-header">
  <div class="chat-header-left">
    <button onclick="history.back()" style="background:transparent;color:#aebac1;border:0;font-size:20px;cursor:pointer">⬅</button>
    <img id="chatHeaderAvatar" src="${LOGO_DEFAULT}" class="chat-avatar" onerror="this.src='${LOGO_DEFAULT}'">
    <div>
      <div id="chatHeaderName" class="chat-title">Memuat...</div>
      <div class="chat-subtitle">terakhir dilihat baru saja</div>
    </div>
  </div>
  <div class="chat-header-right">
    <span style="cursor:pointer" onclick="toast('Video call segera hadir')">📹</span>
    <span style="cursor:pointer" onclick="toast('Telepon segera hadir')">📞</span>
    <span style="cursor:pointer" onclick="toast('Opsi lainnya')">⋮</span>
  </div>
</div>

<div class="chat-body" id="chatBody">
  <div class="encryption-badge">
    🔒 Pesan dan telepon terenkripsi secara end-to-end. Hanya orang di obrolan ini yang bisa membaca, mendengar, atau membagikannya.
  </div>
  <div class="date-divider">Hari ini</div>
  <div class="message incoming">Halo Dunsanak! Ada yang bisa dibantu terkait Rumah Gadang AI?</div>
</div>

<div class="chat-footer">
  <div class="chat-input-wrap">
    <span style="cursor:pointer;font-size:20px">😊</span>
    <input id="messageInput" class="chat-input" placeholder="Ketik pesan..." onkeypress="handleKeyPress(event)">
    <span class="chat-tools" onclick="toast('Lampiran')">📎</span>
    <span class="chat-tools" onclick="toast('Kamera')">📷</span>
  </div>
  <button class="btn-send" onclick="sendMessage()">🎤</button>
</div>

<div id="toast"></div>

<script>
const LOGO_FALLBACK = "${LOGO_DEFAULT}";
const urlParams = new URLSearchParams(window.location.search);
let targetEmail = urlParams.get('email') || urlParams.get('profil') || '';

function toast(m){let t=document.getElementById('toast');t.innerText=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500);}

async function initChatHeader() {
  if(!targetEmail) {
    document.getElementById('chatHeaderName').innerText = "Dunsanak";
    return;
  }
  document.getElementById('chatHeaderName').innerText = targetEmail.split('@')[0];
  try {
    let r = await fetch('/api/akun/profile?email=' + encodeURIComponent(targetEmail) + '&me=' + encodeURIComponent(localStorage.getItem('rg_email')||''));
    if(r.ok) {
      let d = await r.json();
      if(d.name) document.getElementById('chatHeaderName').innerText = d.name;
      if(d.picture) document.getElementById('chatHeaderAvatar').src = d.picture;
    }
  } catch(e){}
}

function handleKeyPress(e){
  if(e.key === 'Enter') sendMessage();
}

function sendMessage(){
  let inp = document.getElementById('messageInput');
  let text = inp.value.trim();
  if(!text) return;
  
  let body = document.getElementById('chatBody');
  let msgDiv = document.createElement('div');
  msgDiv.className = 'message outgoing';
  msgDiv.innerText = text;
  body.appendChild(msgDiv);
  
  inp.value = '';
  body.scrollTop = body.scrollHeight;
  toast('Pesan terkirim');
}

initChatHeader();
</script>
</body></html>
`;

export default CHAT_HTML;
