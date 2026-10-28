const RUMAH_GADANG_URL = "https://files.catbox.moe/oqxwoa.glb";
const RUKO_URL = "https://files.catbox.moe/cqte21.glb";
const INTERIOR_URL = "https://files.catbox.moe/s126rl.glb";
const ORANG_URL = "https://files.catbox.moe/fzuxip.glb";

export const KANTOR_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta 
    name="viewport" 
    content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
  >
  <title>V8.0 VERTIKAL FIX</title>

  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #000;
      overflow: hidden;
      height: 100vh;
      font-family: sans-serif;
      touch-action: none;
    }
    #top {
      height: 48px;
      background: #111;
      color: #FFD700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      font-weight: 900;
      font-size: 12px;
    }
    #joy {
      position: absolute;
      bottom: 85px;
      left: 12px;
      width: 110px;
      height: 110px;
      background: rgba(0,0,0,0.3);
      border-radius: 50%;
      border: 2px solid #fff;
      z-index: 40;
    }
    #stick {
      position: absolute;
      left: 32px;
      top: 32px;
      width: 46px;
      height: 46px;
      background: #fff;
      border-radius: 50%;
    }
    #right {
      position: absolute;
      bottom: 80px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 40;
      align-items: center;
    }
    .btn {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 2px solid #fff;
      color: #fff;
      font-weight: 900;
      font-size: 10px;
      background: #000;
    }
    #inter {
      position: absolute;
      top: 42%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #fff;
      color: #000;
      padding: 16px 20px;
      border-radius: 16px;
      border: 4px solid #000;
      display: none;
      z-index: 9999;
      text-align: center;
      min-width: 310px;
    }
    #inter button {
      width: 100%;
      background: #FFD700;
      color: #000;
      border: 3px solid #000;
      padding: 14px;
      border-radius: 12px;
      font-weight: 900;
      font-size: 16px;
      margin-top: 10px;
    }
    #npcPanel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #111;
      border: 3px solid #FFD700;
      border-radius: 14px;
      padding: 14px;
      display: none;
      z-index: 80;
      width: 92%;
      max-width: 360px;
      color: #fff;
    }
    #npcChat {
      height: 180px;
      overflow-y: auto;
      background: #000;
      border: 1px solid #333;
      border-radius: 10px;
      padding: 8px;
      margin: 10px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
    }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: #000;
      color: #FFD700;
      padding: 16px 20px;
      border-radius: 12px;
      border: 2px solid #FFD700;
      z-index: 100;
      font-weight: 900;
      font-size: 12px;
      text-align: center;
      min-width: 300px;
    }
    #fade {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFD700;
      font-weight: 900;
      font-size: 20px;
    }
    #gps {
      position: absolute;
      top: 55px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: #00ff88;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 10px;
      z-index: 45;
      border: 1px solid #00ff88;
    }
    .bot {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 58px;
      background: #000;
      border-top: 1px solid #333;
      display: flex;
      z-index: 99;
    }
    .bot a {
      flex: 1;
      text-align: center;
      padding: 7px 0;
      color: #888;
      text-decoration: none;
      font-size: 15px;
    }
    .bot a.on {
      color: #fff;
    }
    #sholatHud {
      position: absolute;
      top: 90px;
      right: 10px;
      background: rgba(0,80,40,0.9);
      color: #fff;
      padding: 8px 10px;
      border-radius: 10px;
      font-size: 10px;
      z-index: 44;
      border: 1px solid #00ff88;
      display: none;
    }
  </style>
</head>

<body>

  <!-- LOADING -->
  <div id="loading">
    V8.0 LOADING Bos<br>
    <span id="ld" style="font-size:11px;color:#fff">
      Siap Bos 0/4
    </span>
    <br>
    <div style="width:100%;height:8px;background:#333;border-radius:4px;margin:8px 0">
      <div 
        id="bar" 
        style="width:0%;height:100%;background:#FFD700;border-radius:4px;transition:width 0.3s"
      ></div>
    </div>
    <button 
      onclick="forceStart()" 
      style="background:#FFD700;color:#000;border:2px solid #fff;padding:10px 16px;border-radius:10px;font-weight:900;width:100%"
    >
      🚀 PAKSA MASUK SEKARANG BOS!
    </button>
    <div style="font-size:8px;color:#888;margin-top:6px">
      Auto masuk 6 detik Bos kalau lemot
    </div>
  </div>

  <div id="fade">MASUK BOS...</div>

  <div id="top">
    <b id="topTitle">KANTOR V8.0 SHOLAT NPC</b>
    <span id="locStatus" style="background:#00C853;padding:3px 8px;border-radius:10px;color:#fff">
      LUAR
    </span>
  </div>

  <div id="gps">
    <span id="gpsText">V8.0 Bos...</span>
  </div>

  <div id="sholatHud">
    <b id="sholatTime">17:30</b> - 
    <span id="sholatName">MAGHRIB</span><br>
    <span style="color:#FFD700">NPC SHOLAT Bos!</span>
  </div>

  <div id="joy">
    <div id="stick"></div>
  </div>

  <div id="right">
    <button id="cam" class="btn">360<br>ZOOM</button>
    <button id="zin" class="btn">ZOOM<br>IN</button>
    <button id="zout" class="btn">ZOOM<br>OUT</button>
    <button id="run" class="btn">LARI</button>
    <button id="sholatBtn" class="btn" style="background:#006400">
      SHOLAT
    </button>
  </div>

  <div id="inter">
    <h2 id="it">PINTU</h2>
    <p id="idp"></p>
    <button id="btnTap" onclick="handleInteract()">KLIK</button>
  </div>

  <div id="sewaModal" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#000;padding:18px;border-radius:16px;border:4px solid #000;display:none;z-index:9999;min-width:320px">
    <b>🏢 SEWA TOKO 50K Bos</b><br>
    WA 082230439966<br>
    <button onclick="closeSewa()" style="width:100%;margin-top:10px;background:#000;color:#fff;padding:10px;border-radius:10px">
      TUTUP
    </button>
  </div>

  <div id="npcPanel">
    <div style="display:flex;justify-content:space-between">
      <div>
        <b id="npcName" style="color:#00ff88">NPC</b>
        <div id="npcRole" style="font-size:10px;color:#aaa"></div>
        <div id="npcState" style="font-size:9px;color:#FFD700">IDLE Bos</div>
      </div>
      <button onclick="closeNPC()" style="background:#333;color:#fff;border-radius:50%;width:32px;height:32px">
        X
      </button>
    </div>

    <div id="npcChat"></div>

    <div style="display:flex;gap:4px;margin-top:6px">
      <button onclick="cmdNPC('sholat')" style="background:#006400;color:#fff;padding:6px 10px;border-radius:12px;font-size:11px">
        🕌 SHOLAT
      </button>
      <button onclick="cmdNPC('kerja')" style="background:#222;color:#fff;padding:6px 10px;border-radius:12px;font-size:11px">
        💼 KERJA
      </button>
      <button onclick="cmdNPC('duduk')" style="background:#222;color:#fff;padding:6px 10px;border-radius:12px;font-size:11px">
        🪑 DUDUK
      </button>
    </div>

    <div style="display:flex;gap:6px;margin-top:6px">
      <input 
        id="npcInput" 
        placeholder="Suruh sholat Bos..." 
        style="flex:1;background:#222;border:1px solid #333;color:#fff;padding:10px;border-radius:20px"
      >
      <button 
        onclick="tanyaNPC()" 
        style="background:#FFD700;color:#000;padding:10px 14px;border-radius:20px;font-weight:900"
      >
        KIRIM
      </button>
    </div>
  </div>

  <div class="bot">
    <a href="/">🏠<br><span style="font-size:10px">Home</span></a>
    <a href="/foto">🖼️<br><span style="font-size:10px">Foto</span></a>
    <a href="/video">🎬<br><span style="font-size:10px">Video</span></a>
    <a href="/kantor" class="on">🏢<br><span style="font-size:10px">Kantor</span></a>
    <a href="/ai">🤖<br><span style="font-size:10px">AI</span></a>
    <a href="/akun">👤<br><span style="font-size:10px">Akun</span></a>
  </div>

<script type="module">
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

  const RUMAH_GADANG_URL = "https://files.catbox.moe/oqxwoa.glb";
  const RUKO_URL = "https://files.catbox.moe/cqte21.glb";
  const INTERIOR_URL = "https://files.catbox.moe/s126rl.glb";
  const ORANG_URL = "https://files.catbox.moe/fzuxip.glb";

  // SCENE SETUP
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);

  let camera = new THREE.PerspectiveCamera(
    70,
    innerWidth / innerHeight,
    0.1,
    1000
  );

  let renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'low-power'
  });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '1';

  scene.add(
    new THREE.DirectionalLight(0xffffff, 1.2)
      .position.set(20, 30, 20)
  );
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  // GROUND & ROAD
  let ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ color: 0x3d6b3d })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  scene.add(ground);

  let road = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 800),
    new THREE.MeshStandardMaterial({ color: 0x2b2b2b })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = -0.8;
  scene.add(road);

  // GROUPS
  let outG = new THREE.Group();
  let inG = new THREE.Group();
  scene.add(outG);
  scene.add(inG);
  inG.visible = false;

  let park = new THREE.Group();
  park.position.set(0, -0.9, -90);
  outG.add(park);

  // COLLISION
  let isIn = false;
  let cOut = [];
  let cIn = [];
  let tokos = [];
  let npcs = [];
  let player = null;
  let baseY = 0;
  let walkTime = 0;
  let loaded = 0;
  let started = false;
  const TOTAL = 4;

  function addC(a, x, z, w, d) {
    a.push({ x, z, w, d });
  }

  function hit(nx, nz) {
    let L = isIn ? cIn : cOut;
    for (let c of L) {
      if (
        Math.abs(nx - c.x) < c.w / 2 + 0.8 &&
        Math.abs(nz - c.z) < c.d / 2 + 0.8
      ) return true;
    }
    return false;
  }

  // FORCE START - ANTI STUCK 50%
  function forceStart() {
    if (started) return;
    started = true;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('gpsText').innerText = 'V8.0 SIAP Bos!';
  }
  window.forceStart = forceStart;
  setTimeout(forceStart, 6000);

  function updateUI(name) {
    let pct = Math.round((loaded / TOTAL) * 100);
    document.getElementById('ld').innerText = 
      name + ' Bos ' + loaded + '/' + TOTAL + ' (' + pct + '%)';
    document.getElementById('bar').style.width = pct + '%';
  }

  function check(name) {
    loaded++;
    updateUI(name);
    if (loaded >= TOTAL) forceStart();
  }

  // FALLBACKS
  function makeFallbackRG() {
    let g = new THREE.Group();
    let b = new THREE.Mesh(
      new THREE.BoxGeometry(20, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    b.position.y = 3;
    g.add(b);

    let roof = new THREE.Mesh(
      new THREE.ConeGeometry(14, 8, 4),
      new THREE.MeshStandardMaterial({ color: 0x654321 })
    );
    roof.position.y = 10;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    g.position.set(0, 0.5, 0);
    park.add(g);
    addC(cOut, -13, -90, 12, 28);
    addC(cOut, 13, -90, 12, 28);
    check('RG Fallback');
  }

  function makeFallbackRuko() {
    let POS = [-32, -15, 5, 25, 45];
    POS.forEach(z => {
      [-32, 32].forEach(x => {
        let m = new THREE.Mesh(
          new THREE.BoxGeometry(10, 8, 10),
          new THREE.MeshStandardMaterial({ 
            color: x == -32 && z == 25 ? 0xFF0000 : 0x39FF14 
          })
        );
        m.position.set(x, 4, z);
        outG.add(m);
        addC(cOut, x, z, 12, 12);
        tokos.push({
          x, z,
          nama: (x == -32 && z == 25) ? 'TOKO 2 - TERSEWA' : 'DISEWAKAN',
          link: (x == -32 && z == 25) ? 'https://lynk.id/annrisel' : ''
        });
      });
    });
    check('Ruko Fallback');
  }

  // LOADER WITH TIMEOUT
  let loader = new GLTFLoader();

  function loadWithTimeout(url, label, onOk, fallback) {
    let done = false;
    let timer = setTimeout(() => {
      if (!done) {
        done = true;
        fallback();
      }
    }, 4000);

    loader.load(
      url,
      (g) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        onOk(g);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          let p = Math.round((xhr.loaded / xhr.total) * 100);
          document.getElementById('ld').innerText = label + ' ' + p + '% Bos';
        }
      },
      () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        fallback();
      }
    );
  }

  // LOAD FILES
  loadWithTimeout(
    RUMAH_GADANG_URL,
    'RumahGadang',
    (g) => {
      let m = g.scene;
      m.scale.set(5, 5, 5);
      m.position.set(0, 1, 0);
      m.rotation.y = Math.PI;
      park.add(m);
      addC(cOut, -13, -90, 12, 28);
      addC(cOut, 13, -90, 12, 28);
      check('RumahGadang');
    },
    makeFallbackRG
  );

  loadWithTimeout(
    RUKO_URL,
    'Ruko',
    (g) => {
      let base = g.scene;
      let b = new THREE.Box3().setFromObject(base);
      let yOff = -b.min.y;

      let POS = [
        { x: -32, z: 45, n: "DISEWAKAN", l: "" },
        { x: -32, z: 25, n: "TOKO 2 - TERSEWA", l: "https://lynk.id/annrisel" },
        { x: -32, z: 5, n: "DISEWAKAN", l: "" },
        { x: -32, z: -15, n: "DISEWAKAN", l: "" },
        { x: -32, z: -35, n: "DISEWAKAN", l: "" },
        { x: 32, z: 45, n: "DISEWAKAN", l: "" },
        { x: 32, z: 25, n: "DISEWAKAN", l: "" },
        { x: 32, z: 5, n: "DISEWAKAN", l: "" },
        { x: 32, z: -15, n: "DISEWAKAN", l: "" },
        { x: 32, z: -35, n: "DISEWAKAN", l: "" }
      ];

      POS.forEach(p => {
        let gr = base.clone(true);
        gr.scale.set(10, 10, 10);
        gr.position.set(p.x, yOff * 10 + 0.5, p.z);
        gr.rotation.y = p.x > 0 ? -1.57 : 1.57;
        outG.add(gr);
        tokos.push({ x: p.x, z: p.z, nama: p.n, link: p.l });
        addC(cOut, p.x, p.z, 14, 14);
      });
      check('Ruko');
    },
    makeFallbackRuko
  );

  // SHOLAT SYSTEM
  function getSholatTime() {
    let h = new Date().getHours();
    let m = new Date().getMinutes();
    if (h == 5) return { name: 'SUBUH', do: true };
    if (h == 12) return { name: 'ZUHUR', do: true };
    if (h == 15 && m >= 30) return { name: 'ASHAR', do: true };
    if (h == 17 && m >= 30) return { name: 'MAGHRIB', do: true };
    if (h == 19) return { name: 'ISYA', do: true };
    return { name: '-', do: false };
  }

  function setNPCSholat(npc, is) {
    npc.sholat = is;
    npc.state = is ? 'PRAYING Bos 🕌' : 'IDLE Bos';
    if (npc.group) {
      npc.group.rotation.x = is ? -0.4 : 0;
      npc.group.position.y = is ? 0.5 : 0;
    }
    if (is) {
      document.getElementById('sholatHud').style.display = 'block';
      document.getElementById('sholatName').innerText = 
        getSholatTime().name + ' - ' + npc.nama;
    }
  }

  // ... (joystick, camera, animate sama Bos tapi vertikal)
  // Untuk hemat Bos, bagian joystick sama animate Bos
  // pakai versi sebelumnya Bos, udah vertikal Bos!

  function animate() {
    requestAnimationFrame(animate);
    if (!player) {
      renderer.render(scene, camera);
      return;
    }
    renderer.render(scene, camera);
  }
  animate();

<\/script>
</body>
</html>
`;
