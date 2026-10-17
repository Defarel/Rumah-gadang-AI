export default {
async fetch(req, env) {
const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0a0a0a">
<style>
body{margin:0;min-height:100vh;background:#000 url('https://rumahgadang-ai.my.id/rumahgadangAI1.jpg') center/cover no-repeat;display:flex;align-items:center;justify-content:center;font-family:sans-serif}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px)}
.card{position:relative;width:90%;max-width:380px;background:#111;border:1px solid #00FF88;border-radius:20px;padding:28px 20px;box-shadow:0 0 20px rgba(0,255,136,0.25),0 0 60px rgba(0,255,136,0.1)}
.card h1{text-align:center;color:#fff;margin:0 0 22px 0;font-size:24px}
.card h1 span{color:#00FF88}
.inp{width:100%;box-sizing:border-box;background:#222;border:1px solid #333;border-radius:14px;padding:14px 16px;color:#fff;font-size:15px;margin-bottom:14px;outline:none}
.inp:focus{border-color:#00FF88;box-shadow:0 0 8px rgba(0,255,136,0.5)}
.btnLogin{width:100%;background:#fff;color:#000;border:0;padding:14px;border-radius:14px;font-weight:900;font-size:16px;margin-top:6px;cursor:pointer}
.bot2{display:flex;gap:12px;margin-top:16px}
.bot2 button{flex:1;background:transparent;color:#fff;border:1px solid #00FF88;border-radius:14px;padding:12px;font-weight:800;font-size:13px;box-shadow:0 0 10px rgba(0,255,136,0.2);cursor:pointer}
.bot2 button:hover{background:rgba(0,255,136,0.1)}
.logo{width:56px;height:56px;border-radius:50%;display:block;margin:0 auto 14px auto;border:2px solid #00FF88;box-shadow:0 0 15px #00FF88}
</style>
</head>
<body>
<div class=overlay></div>
<div class=card>
<img src="https://rumahgadang-ai.my.id/rumahgadangAI1.jpg" class=logo>
<h1><span>R</span>umah <span>G</span>adang <span>AI</span></h1>
<input class=inp id=email placeholder="Email">
<input class=inp id=pass type=password placeholder="Masukan Password">
<button class=btnLogin onclick="doLogin()">LOGIN</button>
<div class=bot2>
<button onclick="location.href='/'">MASUK</button>
<button onclick="googleLogin()">GOOGLE</button>
</div>
</div>
<script>
function doLogin(){ const e=document.getElementById('email').value; localStorage.setItem('rg_email',e); location.href='/'; }
function googleLogin(){ alert('Login Google Bos segera Bos!'); }
<\/script>
</body>
</html>
`;
return new Response(html, {headers:{'content-type':'text/html;charset=utf-8'}});
}
}
`;
