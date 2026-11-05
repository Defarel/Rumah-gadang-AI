const LOGO_DEFAULT = "https://raw.githubusercontent.com/Defarel/Rumah-gadang-AI/main/icon.png"

export const CHAT_HTML = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chat - Rumah Gadang AI</title>
<link rel="icon" href="${LOGO_DEFAULT}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#fff;font-family:sans-serif;height:100vh;display:flex;flex-direction:column}
.chat-header{display:flex;align-items:center;justify-content:space-between;background:#050505;padding:12px 16px;position:sticky;top:0;z-index:10;border-bottom:1.5px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,0.3)}
.chat-header-left{display:flex;align-items:center;gap:12px}
.chat-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #00ff88;box-shadow:0 0 10px #00ff88}
.chat-title{font-size:16px;font-weight:900;color:#fff}
.chat-subtitle{font-size:11px;color:#00ff88}
.chat-header-right{display:flex;gap:16px;font-size:20px;color:#00ff88;align-items:center;position:relative}
.chat-body{flex:1;background-color:#000;background-image:radial-gradient(circle, rgba(0,255,136,0.06) 1px, transparent 1px);background-size:24px 24px;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.encryption-badge{background:#0a0a0a;color:#00ff88;font-size:11px;padding:10px 14px;border-radius:12px;text-align:center;max-width:340px;margin:0 auto 12px;line-height:1.4;border:1px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.25)}
.date-divider{background:#0a0a0a;color:#00ff88;font-size:11px;padding:6px 14px;border-radius:12px;align-self:center;margin:8px 0;border:1px solid #00ff88;box-shadow:0 0 8px rgba(0,255,136,0.2)}
.message{max-width:75%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.4;position:relative;word-wrap:break-word}
.message.incoming{background:#111;color:#fff;align-self:flex-start;border:1.5px solid #00ff88;box-shadow:0 0 10px rgba(0,255,136,0.25);border-top-left-radius:4px}
.message.outgoing{background:#00331f;color:#fff;align-self:flex-end;border:1.5px solid #00ff88;box-shadow:0 0 12px rgba(0,255,136,0.4);border-top-right-radius:4px}
.chat-footer{display:flex;align-items:center;gap:8px;background:#050505;padding:12px 16px;position:sticky;bottom:0;border-top:1.5px solid #00ff88;box-shadow:0 0 15px rgba(0,255,136,0.3)}
.chat-input-wrap{flex:1;background:#0a0a0a;display:flex;align-items:center;border-radius:24px;padding:8px 16px;gap:12px;border:1.5px solid #00ff88;box-shadow:0 0 10px rgba(0,255,136,0.2)}
.chat-input{flex:1;background:transparent;border:0;color:#fff;font-size:14px;outline:none}
.chat-input::placeholder{color:#666}
.chat-tools{display:flex;gap:14px;font-size:20px;color:#00ff88;cursor:pointer}
.btn-send{background:#00ff88;color:#000;border:0;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;cursor:pointer;flex-shrink:0;box-shadow:0 0 15px #00ff88}
.dropdown-menu{display:none;position:absolute;right:0;top:36px;background:#111;border:1.5px solid #00ff88;border-radius:12px;box-shadow:0 0 20px rgba(0,255,136,0.4);z-index:999;width:160px;overflow:hidden}
.dropdown-item{padding:12px 16px;font-size:13px;color:#fff;cursor:pointer;border-bottom:1px solid #222;font-weight:700}
.dropdown-item:hover{background:#00ff88;color:#000}
#toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);background:#00ff88;color:#000;padding:10px 18px;border-radius:22px;font-weight:900;display:none;z-index:9999;box-shadow:0 0 20px #00ff88}
</style></head><body>

<div class="chat-header">
  <div class="chat-header-left">
    <button onclick="history.back()" style="background:transparent;color:#00ff88;border:0;font-size:20px;cursor:pointer;font-weight:900">⬅</button>
    <img id="chatHeaderAvatar" src="${LOGO_DEFAULT}" class="chat-avatar" onerror="this.src='${LOGO_DEFAULT}'">
    <div>
      <div id="chatHeaderName" class="chat-title">Memuat...</div>
      <div class="chat-subtitle">terakhir dilihat baru saja</div>
    </div>
  </div>
  <div class="chat-header-right">
    <span style="cursor:pointer;font-size:18px" onclick="toast('Video call segera hadir')">📹</span>
    <span style="cursor:pointer;font-size:18px" onclick="toast('Telepon segera hadir')">📞</span>
    <span style="cursor:pointer;font-size:20px;padding:0 4px" onclick="toggleMenu(event)">⋮</span>
    <div id="chatDropdown" class="dropdown-menu">
      <div class="dropdown-item" onclick="clearAllChat()">Hapus semua chat</div>
      <div class="dropdown-item" onclick="blockUser()" style="color:#ff6b6b">Blokir</div>
    </div>
  </div>
</div>

<div class="chat-body" id="chatBody">
  <div class="encryption-badge">
    🔒 Pesan dan telepon terenkripsi secara end-to-end. Hanya orang di obrolan ini yang bisa membaca, mendengar, atau membagikannya.
  </div>
  <div class="date-divider">Hari ini</div>
</div>

<div class="chat-footer">
  <div class="chat-input-wrap">
    <span style="cursor:pointer;font-size:20px">😊</span>
    <input id="messageInput" class="chat-input" placeholder="Ketik pesan..." onkeypress="handleKeyPress(event)">
    <span class="chat-tools" onclick="toast('Lampiran')">📎</span>
    <span class="chat-tools" onclick="toast('Kamera')">📷</span>
  </div>
  <button class="btn-send" onclick="sendMessage()">➤</button>
</div>

<div id="toast"></div>

<script>
const LOGO_FALLBACK = "${LOGO_DEFAULT}";
const urlParams = new URLSearchParams(window.location.search);
let targetEmail = (urlParams.get('email') || urlParams.get('profil') || '').toLowerCase().trim();
let myEmail = (localStorage.getItem('rg_email') || '').toLowerCase().trim();

if(targetEmail && !targetEmail.includes('@')) targetEmail += '@rumahgadang-ai.my.id';
if(myEmail && !myEmail.includes('@')) myEmail += '@rumahgadang-ai.my.id';

function toast(m){let t=document.getElementById('toast');t.innerText=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500);}

function toggleMenu(e){
  e.stopPropagation();
  let menu = document.getElementById('chatDropdown');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

window.addEventListener('click', () => {
  let menu = document.getElementById('chatDropdown');
  if(menu) menu.style.display = 'none';
});

function clearAllChat(){
  if(confirm("Hapus semua riwayat chat ini?")){
    toast("Semua chat dihapus");
    document.getElementById('chatBody').innerHTML = \`
      <div class="encryption-badge">
        🔒 Pesan dan telepon terenkripsi secara end-to-end. Hanya orang di obrolan ini yang bisa membaca, mendengar, atau membagikannya.
      </div>
      <div class="date-divider">Hari ini</div>
    \`;
  }
}

function blockUser(){
  if(confirm("Blokir pengguna ini?")){
    toast("Pengguna diblokir");
    setTimeout(() => history.back(), 1500);
  }
}

async function initChat() {
  if(!targetEmail) {
    document.getElementById('chatHeaderName').innerText = "Dunsanak";
    return;
  }
  document.getElementById('chatHeaderName').innerText = targetEmail.split('@')[0];
  try {
    let r = await fetch('/api/akun/profile?email=' + encodeURIComponent(targetEmail) + '&me=' + encodeURIComponent(myEmail));
    if(r.ok) {
      let d = await r.json();
      if(d.name) document.getElementById('chatHeaderName').innerText = d.name;
      if(d.picture) document.getElementById('chatHeaderAvatar').src = d.picture;
    }
  } catch(e){}
  
  loadMessages();
  setInterval(loadMessages, 3000);
}

async function loadMessages(){
  if(!myEmail || !targetEmail) return;
  try {
    let res = await fetch(\`/api/chat/get?user1=\${encodeURIComponent(myEmail)}&user2=\${encodeURIComponent(targetEmail)}\`);
    let data = await res.json();
    if(data.ok && Array.isArray(data.messages)){
      let body = document.getElementById('chatBody');
      let topHtml = \`
        <div class="encryption-badge">
          🔒 Pesan dan telepon terenkripsi secara end-to-end. Hanya orang di obrolan ini yang bisa membaca, mendengar, atau membagikannya.
        </div>
        <div class="date-divider">Hari ini</div>
      \`;
      let msgsHtml = data.messages.map(m => {
        let isOutgoing = (m.sender || '').toLowerCase().trim() === myEmail;
        return \`<div class="message \${isOutgoing ? 'outgoing' : 'incoming'}">\${m.message}</div>\`;
      }).join('');
      
      let isAtBottom = body.scrollHeight - body.scrollTop <= body.clientHeight + 100;
      body.innerHTML = topHtml + msgsHtml;
      if(isAtBottom) { body.scrollTop = body.scrollHeight; }
    }
  } catch(e){}
}

function handleKeyPress(e){
  if(e.key === 'Enter') sendMessage();
}

async function sendMessage(){
  let inp = document.getElementById('messageInput');
  let text = inp.value.trim();
  if(!text) return;
  if(!myEmail) { toast('Login dulu Bos!'); return; }
  if(!targetEmail) { toast('Penerima tidak valid!'); return; }

  try {
    let r = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: myEmail, receiver: targetEmail, message: text })
    });
    let j = await r.json();
    if(j.ok){
      inp.value = '';
      loadMessages();
    } else {
      toast('Gagal kirim pesan');
    }
  } catch(e){
    toast('Error: ' + e.message);
  }
}

initChat();
</script>
</body></html>
`;

export default CHAT_HTML;
