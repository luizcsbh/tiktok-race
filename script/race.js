// ═══════════════════════════════════════════════════════
//  12 BAIAS — Presentes TikTok custo 1 coin
// ═══════════════════════════════════════════════════════
const CARS = [
  { id:0,  name:'Rose',               emoji:'🌹', color:'#e84040', jColor:'#7a0000', giftId:'5655'  },
  { id:1,  name:'TikTok',             emoji:'🎵', color:'#010101', jColor:'#222',    giftId:'6829'  },
  { id:2,  name:'GG',                 emoji:'👍', color:'#f5a623', jColor:'#7a5000', giftId:'7625'  },
  { id:3,  name:'Ice Cream',          emoji:'🍦', color:'#f7cac9', jColor:'#c47a7a', giftId:'8076'  },
  { id:4,  name:'Heart',              emoji:'❤️', color:'#e91e63', jColor:'#880e4f', giftId:'5650'  },
  { id:5,  name:'Glow Stick',         emoji:'✨', color:'#aeea00', jColor:'#517700', giftId:'5817'  },
  { id:6,  name:'Cake Slice',         emoji:'🍰', color:'#ff9cbb', jColor:'#9b3060', giftId:'5855'  },
  { id:7,  name:'Thumbs Up',          emoji:'👍', color:'#ff9800', jColor:'#7a4500', giftId:'7631'  },
  { id:8,  name:'Fluffy Heart',       emoji:'💕', color:'#e040fb', jColor:'#6a0080', giftId:'6001'  },
  { id:9,  name:'Birthday Cake',      emoji:'🎂', color:'#00bcd4', jColor:'#006064', giftId:'6002'  },
  { id:10, name:'Sneakers',           emoji:'👟', color:'#8bc34a', jColor:'#33691e', giftId:'6003'  },
  { id:11, name:'Dino Footprint',     emoji:'🦖', color:'#78909c', jColor:'#263238', giftId:'6004'  },
];

const HORSES = [
  { id:0,  name:'Rose',               horse_name:'Trovão Vermelho',    emoji:'🌹', color:'#e84040', jColor:'#7a0000', giftId:'5655'  },
  { id:1,  name:'TikTok',             horse_name:'Sombra Veloz',       emoji:'🎵', color:'#010101', jColor:'#222',    giftId:'6829'  },
  { id:2,  name:'GG',                 horse_name:'Relâmpago Dourado',  emoji:'👍', color:'#f5a623', jColor:'#7a5000', giftId:'7625'  },
  { id:3,  name:'Ice Cream',          horse_name:'Furacão Gelado',     emoji:'🍦', color:'#f7cac9', jColor:'#c47a7a', giftId:'8076'  },
  { id:4,  name:'Heart',              horse_name:'Coração Selvagem',   emoji:'❤️', color:'#e91e63', jColor:'#880e4f', giftId:'5650'  },
  { id:5,  name:'Glow Stick',         horse_name:'Neon Flamejante',    emoji:'✨', color:'#aeea00', jColor:'#517700', giftId:'5817'  },
  { id:6,  name:'Cake Slice',         horse_name:'Doce Cometa',        emoji:'🍰', color:'#ff9cbb', jColor:'#9b3060', giftId:'5855'  },
  { id:7,  name:'Thumbs Up',          horse_name:'Pé de Fogo',         emoji:'👍', color:'#ff9800', jColor:'#7a4500', giftId:'7631'  },
  { id:8,  name:'Fluffy Heart',       horse_name:'Paixão Mística',     emoji:'💕', color:'#e040fb', jColor:'#6a0080', giftId:'6001'  },
  { id:9,  name:'Birthday Cake',      horse_name:'Estrela Azul',       emoji:'🎂', color:'#00bcd4', jColor:'#006064', giftId:'6002'  },
  { id:10, name:'Sneakers',           horse_name:'Vento Livre',        emoji:'👟', color:'#8bc34a', jColor:'#33691e', giftId:'6003'  },
  { id:11, name:'Dino Footprint',     horse_name:'Gigante Jurássico',  emoji:'🦖', color:'#78909c', jColor:'#263238', giftId:'6004'  },
];

const ENTRANTS = window.RACE_TYPE === 'f1' ? CARS : HORSES;
const IS_F1 = window.RACE_TYPE === 'f1';

// Inverte uma cor hex (#rrggbb) para o seu contrário (255 - rgb)
function invertHex(hex){
  if(!hex) return '#00ffff';
  let h = hex.replace('#','');
  if(h.length===3) h = h.split('').map(c=>c+c).join('');
  if(h.length!==6) return '#00ffff';
  const r = 255 - parseInt(h.slice(0,2),16);
  const g = 255 - parseInt(h.slice(2,4),16);
  const b = 255 - parseInt(h.slice(4,6),16);
  const toHex = n=>('0'+n.toString(16)).slice(-2);
  return '#'+toHex(r)+toHex(g)+toHex(b);
}

let GOAL = 1000;
const LABEL_W   = 108;  
const PAD_RIGHT = 30;   
let SCENE_W   = window.innerWidth || 960;
const RACER_W   = 68;
const START_X   = LABEL_W + 4;           
let FINISH_X  = SCENE_W - PAD_RIGHT - RACER_W; 
let USABLE    = FINISH_X - START_X;

window.addEventListener('resize', () => {
  SCENE_W = window.innerWidth || 960;
  FINISH_X = SCENE_W - PAD_RIGHT - RACER_W;
  USABLE = FINISH_X - START_X;
  updatePositions();
});

// ── Estado ──
let raceState = { running:true, winner:null, entrants:[] };
let demoTimer=null, giftTimer=null, tiktokConn=null, connectingTikTok=false, animTick=0, adminOn=true;
let likeWheelTimer = null, likeWheelOn = false;

// ── Áudio ──
const bgMusic = new Audio('audio/background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;
const winSound = new Audio('audio/winner.mp3');
winSound.volume = 0.8;
let audioEnabled = false;

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const btn = document.getElementById('btn-audio');
  if(audioEnabled) {
    btn.textContent = '🔊 Áudio On';
    btn.classList.add('active');
    bgMusic.play().catch(()=>{ audioEnabled = false; btn.textContent = '🔇 Áudio Off'; btn.classList.remove('active'); });
  } else {
    btn.textContent = '🔇 Áudio Off';
    btn.classList.remove('active');
    bgMusic.pause();
    winSound.pause();
  }
}

// ═══════════════════════════════════════════════════════
//  SVG DO CARRO F1
// ═══════════════════════════════════════════════════════
function carSVG(car) {
  const c = car.color || '#ff0000';
  const j = car.jColor || '#ffffff';

  return `
  <svg 
    class="car-svg"
    width="120"
    height="52"
    viewBox="0 0 120 52"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bodyGradient${car.id}" x1="0" x2="1">
        <stop offset="0%" stop-color="${c}" />
        <stop offset="100%" stop-color="#111" />
      </linearGradient>

      <linearGradient id="wheelGradient${car.id}" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#444"/>
        <stop offset="100%" stop-color="#000"/>
      </linearGradient>
    </defs>

    <!-- SOMBRA -->
    <ellipse cx="60" cy="44" rx="48" ry="5" fill="rgba(0,0,0,.25)" />

    <!-- ASA TRASEIRA -->
    <g>
      <rect x="8" y="12" width="14" height="4" rx="1" fill="${j}" />
      <rect x="8" y="16" width="14" height="10" rx="1" fill="${c}" />
      <rect x="18" y="18" width="4" height="16" fill="#222"/>
    </g>

    <!-- PNEU TRASEIRO -->
    <g>
      <circle cx="26" cy="34" r="12" fill="url(#wheelGradient${car.id})" stroke="#111" stroke-width="2" />
      <circle cx="26" cy="34" r="5" fill="#777" />
    </g>

    <!-- PNEU DIANTEIRO -->
    <g>
      <circle cx="92" cy="34" r="10" fill="url(#wheelGradient${car.id})" stroke="#111" stroke-width="2" />
      <circle cx="92" cy="34" r="4" fill="#777" />
    </g>

    <!-- DIFUSOR -->
    <path d="M20 38 L38 38 L34 42 L18 42 Z" fill="#1a1a1a" />

    <!-- CORPO PRINCIPAL -->
    <path d="M24 30 L36 20 L52 18 L68 18 L82 22 L98 26 L112 30 L112 35 L20 35 Z" fill="url(#bodyGradient${car.id})" stroke="#111" stroke-width="1.5" />

    <!-- SIDEPOD -->
    <path d="M44 26 L64 24 L72 30 L60 34 L40 34 Z" fill="${c}" opacity=".9" />

    <!-- COCKPIT -->
    <ellipse cx="56" cy="16" rx="9" ry="7" fill="${j}" stroke="#111" stroke-width="1.5" />

    <!-- HALO -->
    <path d="M48 16 Q56 8 68 14" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" />

    <!-- BICO -->
    <path d="M98 26 L118 30 L118 34 L96 34 Z" fill="${c}" stroke="#111" stroke-width="1" />

    <!-- ASA DIANTEIRA -->
    <g>
      <rect x="110" y="33" width="10" height="3" rx="1" fill="${j}" />
      <rect x="108" y="36" width="12" height="2" rx="1" fill="#222" />
    </g>

    <!-- DETALHES -->
    <line x1="38" y1="20" x2="54" y2="18" stroke="#ffffff55" stroke-width="1" />

    <!-- NUMERO -->
    <circle cx="72" cy="27" r="6" fill="#fff" opacity=".95" />
    <text x="72" y="29" text-anchor="middle" font-size="7" font-weight="bold" font-family="Arial" fill="#000">${car.id + 1}</text>
  </svg>`;
}

// ═══════════════════════════════════════════════════════
//  SVG DO CAVALO
// ═══════════════════════════════════════════════════════
function horseSVG(h) {
  const c = h.color, j = h.jColor;
  return `<svg class="horse-svg" width="68" height="38" viewBox="0 0 68 38" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale(-1, 1) translate(-68, 0)">
  <!-- CORPO PRINCIPAL -->
  <ellipse cx="34" cy="24" rx="22" ry="10" fill="${c}"/>
  <ellipse cx="54" cy="21" rx="10" ry="9" fill="${c}"/>
  <path d="M44 18 Q50 14 58 18 Q62 22 55 28 Q48 30 44 28 Z" fill="${c}"/>

  <!-- PESCOÇO ESTICADO PARA FRENTE -->
  <path d="M14 22 Q10 14 14 8 Q18 4 22 6 Q26 8 22 18 Z" fill="${c}"/>

  <!-- CABEÇA INCLINADA PARA FRENTE -->
  <ellipse cx="9" cy="9" rx="7" ry="4.5" fill="${c}" transform="rotate(-15 9 9)"/>
  <ellipse cx="4" cy="8" rx="3.5" ry="2.5" fill="${c}"/>
  <ellipse cx="3" cy="9" rx="1.8" ry="1.2" fill="#c8a07a"/>
  <ellipse cx="2.5" cy="9.5" rx=".9" ry=".5" fill="${j}" opacity=".6"/>
  <circle cx="8" cy="6" r="1.6" fill="#111"/>
  <circle cx="8.5" cy="5.5" r=".5" fill="#fff"/>
  <polygon points="12,3 15,0 17,4" fill="${c}"/>
  <polygon points="13,3 15,1 16,4" fill="${j}" opacity=".4"/>

  <!-- CRINAS AO VENTO -->
  <path d="M14,6 Q8,3 6,7" stroke="#111" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M17,9 Q12,6 10,10" stroke="#111" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M19,13 Q14,10 12,14" stroke="#111" stroke-width="1.4" fill="none" stroke-linecap="round"/>

  <!-- CAUDA AO VENTO -->
  <path d="M63,18 Q70,12 68,5 Q66,1 70,-2" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M63,20 Q72,15 70,8" stroke="#1a1a1a" stroke-width="1.5" fill="none" stroke-linecap="round"/>

  <!-- PERNAS EM GALOPE -->
  <line class="leg" data-i="0" x1="18" y1="30" x2="10" y2="37" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>
  <line class="leg" data-i="1" x1="24" y1="31" x2="22" y2="37" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>
  <line class="leg" data-i="2" x1="46" y1="29" x2="40" y2="37" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>
  <line class="leg" data-i="3" x1="52" y1="27" x2="58" y2="37" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>

  <!-- JÓQUEI AGACHADO -->
  <path d="M20 20 Q18 12 24 10 Q30 8 32 14 Q34 20 28 22 Z" fill="${j}"/>
  <path d="M30 20 Q34 24 32 28 Q28 26 26 22 Z" fill="${j}"/>
  <path d="M19 16 Q18 8 25 7 Q32 6 33 13 Z" fill="${j}"/>
  <rect x="18" y="15" width="16" height="3" rx="1.5" fill="${j}" opacity=".85"/>
  <ellipse cx="25" cy="12" rx="4" ry="3.8" fill="#f5cba7"/>
  <circle  cx="23" cy="11" r=".7" fill="#333"/>
  <circle  cx="27" cy="11" r=".7" fill="#333"/>
  <line x1="20" y1="17" x2="10" y2="12" stroke="${j}"  stroke-width="2.5" stroke-linecap="round"/>
  <line x1="10" y1="12" x2="6"  y2="9"  stroke="#8B6914" stroke-width="1.4"/>
  </g>
  <!-- Número no dorso -->
  <circle cx="41" cy="18" r="4.5" fill="#fff" opacity=".88"/>
  <text x="41" y="21" text-anchor="middle" font-size="5.5" font-weight="bold" font-family="sans-serif" fill="${j}">${h.id+1}</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════
//  CONSTRUIR PISTA
// ═══════════════════════════════════════════════════════
function buildTrack() {
  const wrap = document.getElementById('track-wrap');
  wrap.querySelectorAll('.lane').forEach(l=>l.remove());

  ENTRANTS.forEach((entrant,i) => {
    const lane = document.createElement('div');
    lane.className = 'lane'; lane.id = `lane-${i}`;

    // Label
    const lbl = document.createElement('div');
    lbl.className = 'lane-label';
    lbl.innerHTML = `
      <div class="lane-num" style="background:${entrant.color}">${i+1}</div>
      <span class="lane-emoji">${entrant.emoji}</span>
      <span class="lane-name">${entrant.name}</span>`;
    lane.appendChild(lbl);

    const sm = document.createElement('div'); sm.className='start-mark'; lane.appendChild(sm);

    // Racer
    const wrap2 = document.createElement('div');
    wrap2.className = 'racer-wrap'; wrap2.id = `rw-${i}`;
    wrap2.style.left = START_X + 'px';
    
    let innerHTML = '';
    let nameAdd = IS_F1 ? '' : ` ${entrant.horse_name}`;

    if (IS_F1) {
      innerHTML = `<div class="exhaust"></div>${carSVG(entrant)}<div class="htip">${entrant.emoji} ${entrant.name} — 0/${GOAL}</div>`;
    } else {
      innerHTML = `${horseSVG(entrant)}<div class="htip">${entrant.emoji} ${entrant.name}${nameAdd} — 0/${GOAL}</div>`;
    }
    wrap2.innerHTML = innerHTML;
    
    // aplicar cor neon invertida por cavalo como variável CSS (usada apenas no tema neon)
    if (!IS_F1) {
      const svgEl = wrap2.querySelector('.horse-svg');
      if(svgEl){ svgEl.style.setProperty('--neon-color', invertHex(entrant.color)); }
    }

    // Atualiza tooltip dinâmico
    wrap2.addEventListener('mouseenter', ()=>{
      const tip = wrap2.querySelector('.htip');
      if(tip) tip.textContent = `${entrant.emoji} ${entrant.name}${nameAdd} — 0/${GOAL}`;
    });
    wrap2.addEventListener('mouseleave', ()=>{
      const tip = wrap2.querySelector('.htip');
      if(tip) tip.textContent = `${entrant.emoji} ${entrant.name}${nameAdd} — ${entrant.gifts||0}/${GOAL}`;
    });

    lane.appendChild(wrap2);
    wrap.appendChild(lane);
  });
}

function racerLeft(gifts) {
  return START_X + Math.min(gifts / GOAL, 1) * USABLE;
}

function updatePositions() {
  raceState.entrants.forEach((e,i) => {
    const w = document.getElementById(`rw-${i}`);
    if (!w) return;
    w.style.left = racerLeft(e.gifts) + 'px';
    const tip = w.querySelector('.htip');
    let nameAdd = IS_F1 ? '' : ` ${e.horse_name}`;
    if (tip) tip.textContent = `${e.emoji} ${e.name}${nameAdd} — ${e.gifts}/${GOAL} (${Math.round(e.gifts/GOAL*100)}%)`;
  });
}

function processGift(giftId, user, count) {
  if (!raceState.running) return;
  const e = raceState.entrants.find(x => x.giftId === String(giftId));
  if (!e) return;
  e.gifts += count;

  const w = document.getElementById(`rw-${e.id}`);
  if (w) { 
    if (IS_F1) {
      w.classList.add('speeding'); setTimeout(()=>w.classList.remove('speeding'),400); 
    } else {
      w.classList.add('jumping'); setTimeout(()=>w.classList.remove('jumping'),560); 
    }
  }

  showNotif(user, e, count);
  updatePositions();

  if (e.gifts >= GOAL && !raceState.winner) {
    raceState.winner = e; raceState.running = false;
    if (demoTimer) { clearInterval(demoTimer); demoTimer=null; }
    setTimeout(()=>showWinner(e,user), 350);
  }
}

// ── Notificação ──
function showNotif(user, e, count) {
  document.getElementById('notif-user').textContent = `@${user}`;
  document.getElementById('notif-msg').textContent  = `${e.emoji} ${count}x ${e.name}`;
  document.getElementById('notif-h').textContent    = `${e.name} → ${e.gifts}/${GOAL} (${Math.round(e.gifts/GOAL*100)}%)`;
  const el = document.getElementById('gift-notif');
  el.classList.add('show');
  if (giftTimer) clearTimeout(giftTimer);
  giftTimer = setTimeout(()=>el.classList.remove('show'), 2400);
}

// ── Vencedor ──
function showWinner(e, user) {
  if (IS_F1) {
    document.getElementById('we').textContent = '🏎️';
    document.getElementById('wh').textContent = `🏎️ ${e.name} VENCEU!`;
    document.getElementById('ws').textContent = user ? `Impulsionado por @${user} e muito mais!` : '';
  } else {
    document.getElementById('we').textContent = e.emoji;
    document.getElementById('wh').textContent = `${e.horse_name}`;
    document.getElementById('ws').textContent = user ? `🏇 Impulsionado por @${user} • ${e.gifts}/${GOAL}` : `🏇 ${e.gifts}/${GOAL}`;
  }
  document.getElementById('winner-overlay').classList.add('show');
  
  if(audioEnabled) {
    bgMusic.pause();
    winSound.currentTime = 0;
    winSound.play();
  }
  
  doConfetti();
}

function doConfetti() {
  const cols=['#FFD700','#e74c3c','#2ecc71','#3498db','#9b59b6','#f39c12','#1abc9c'];
  for(let i=0;i<60;i++) setTimeout(()=>{
    const d=document.createElement('div'); d.className='confetti';
    d.style.cssText=`left:${Math.random()*window.innerWidth}px;top:-10px;background:${cols[Math.random()*cols.length|0]};transform:rotate(${Math.random()*360}deg);animation-duration:${1.4+Math.random()*2}s;animation-delay:${Math.random()*.4}s`;
    document.getElementById('scene').appendChild(d);
    setTimeout(()=>d.remove(),3500);
  },i*36);
}

// ── Demo ──
function simulateGift() {
  const e = ENTRANTS[Math.random()*ENTRANTS.length|0];
  processGift(e.giftId,'viewer'+(Math.random()*9999|0),(Math.random()*18|0)+1);
}
function startDemo() {
  if(demoTimer) clearInterval(demoTimer);
  demoTimer = setInterval(()=>{ if(raceState.running) simulateGift(); }, 500+Math.random()*800);
  const pill = document.getElementById('conn-pill');
  if(pill && !tiktokConn) {
    pill.className = 'demo demo-mode';
    pill.textContent = '🟣 MODO DEMO';
  }
}

// ── PLATEIA / LIKES (Somente Cavalos) ──
function createAudience(count = 28) {
  const aud = document.getElementById('audience');
  if(!aud) return;
  aud.innerHTML = '';
  const w = aud.clientWidth || 880;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'spectator';
    const left = Math.round((i / count) * (w - 18));
    el.style.left = left + 'px';
    el.innerHTML = `<div class="head"></div><div class="torso"></div><div class="arm"></div><div class="heart"></div>`;
    aud.appendChild(el);
  }
}

function processLike(count = 1) {
  const aud = document.getElementById('audience');
  if(!aud) return;
  const specs = Array.from(aud.querySelectorAll('.spectator'));
  if(specs.length===0) return;
  const picks = [];
  for(let i=0;i<Math.min(count, specs.length);i++){
    let idx = Math.floor(Math.random()*specs.length);
    while(picks.includes(idx)) idx = Math.floor(Math.random()*specs.length);
    picks.push(idx);
  }
  picks.forEach((pi, n)=>{
    const s = specs[pi];
    setTimeout(()=>{
      s.classList.add('cheer');
      setTimeout(()=>s.classList.remove('cheer'), 1000);
    }, n*120);
  });
}

function simulateLike(){ processLike((Math.random()*4|0)+1); }

// Roda de likes offline
function startLikeWheel(){
  if(likeWheelTimer) clearInterval(likeWheelTimer);
  likeWheelOn = true;
  likeWheelTimer = setInterval(()=>{
    if(raceState.running) processLike(1 + (Math.random()*3|0));
  }, 300 + Math.random()*700);
  const btn = document.getElementById('spin-likes'); if(btn) btn.textContent='⏸ Parar';
}
function stopLikeWheel(){
  likeWheelOn = false;
  if(likeWheelTimer){ clearInterval(likeWheelTimer); likeWheelTimer = null; }
  const btn = document.getElementById('spin-likes'); if(btn) btn.textContent='▶️ Iniciar';
}
function toggleLikeWheel(){ if(likeWheelOn) stopLikeWheel(); else startLikeWheel(); }


// ── TikTok ──
function connectTikTok(){
  const user=document.getElementById('tik-id').value.replace('@','').trim();
  if(!user){alert('Digite o @ do TikTok!');return;}

  connectingTikTok = true;
  resetRace();

  const pill=document.getElementById('conn-pill');
  if(typeof io!=='undefined'){
    const s = io('http://localhost:3001', { transports: ['websocket'] });
    s.emit('connect-tiktok',user);
    s.on('connected',()=>{
      connectingTikTok = false;
      pill.className='live ok';
      pill.textContent='🟢 LIVE — @'+user;
    });
    s.on('gift',d=>processGift(String(d.giftId),d.uniqueId||d.nickname,d.repeatCount||1));
    s.on('like',d=>processLike((d && d.count) || (typeof d === 'number' ? d : 1)));
    s.on('disconnect',()=>{
      connectingTikTok = false;
      pill.className='demo';
      pill.textContent='🟣 MODO DEMO';
      tiktokConn = null;
      startDemo();
    });
    tiktokConn = s; return;
  }

  if(typeof WebcastPushConnection!=='undefined'){
    if(tiktokConn && typeof tiktokConn.disconnect === 'function')try{tiktokConn.disconnect()}catch(e){}
    tiktokConn = new WebcastPushConnection(user,{processInitialData:false,enableExtendedGiftInfo:true});
    tiktokConn.connect().then(()=>{
      connectingTikTok = false;
      pill.className='live ok';
      pill.textContent='🟢 LIVE — @'+user;
    }).catch(e=>{
      connectingTikTok = false;
      pill.className='demo';
      pill.textContent='🟣 MODO DEMO';
      tiktokConn = null;
      startDemo();
    });
    tiktokConn.on('gift',d=>{if(d.repeatEnd||d.giftType===1)processGift(String(d.giftId),d.uniqueId,d.repeatCount||1);});
    if(typeof tiktokConn.on === 'function') try{ tiktokConn.on('like',d=>processLike((d && d.likeCount) || (d && d.count) || (typeof d === 'number' ? d : 1))); }catch(e){}
    tiktokConn.on('disconnected',()=>{connectingTikTok=false; pill.className='demo'; pill.textContent='🟣 MODO DEMO'; tiktokConn=null; startDemo();});
    return;
  }

  connectingTikTok = false;
  pill.className='demo';
  pill.textContent='🟣 MODO DEMO';
  tiktokConn = null;
  startDemo();
}
function disconnectTikTok(){
  if(tiktokConn && typeof tiktokConn.disconnect === 'function')try{tiktokConn.disconnect()}catch(e){}
  tiktokConn = null;
  connectingTikTok = false;
  const pill = document.getElementById('conn-pill');
  if(pill){ pill.className='demo'; pill.textContent='🟣 MODO DEMO'; }
  resetRace();
}

// ── Meta ──
function applyGoal(){
  const v=parseInt(document.getElementById('goal-in').value);
  if(!isNaN(v)&&v>=10){
    GOAL=v;
    document.getElementById('goal-disp').textContent=v;
    document.getElementById('sub-label').textContent = IS_F1 ? ' 1º a chegar vence!' : `${v} presentes = 1 volta • 12 baias • 1ª a chegar vence!`;
    updatePositions();
  }
}

// ── Reiniciar ──
function resetRace(){
  if(demoTimer){clearInterval(demoTimer);demoTimer=null;}
  raceState={running:true,winner:null,entrants:ENTRANTS.map(e=>({...e,gifts:0}))};
  document.getElementById('winner-overlay').classList.remove('show');
  buildTrack();
  updatePositions();
  
  if(audioEnabled) {
    winSound.pause();
    winSound.currentTime = 0;
    bgMusic.play().catch(()=>{});
  }
  
  if(!tiktokConn) {
    startDemo();
  }
}

// ── Temas ──
function setTheme(t){
  document.body.className = `theme-${t} ${IS_F1 ? 'f1-race' : 'horse-race'}`;
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));
  const btn = document.querySelector(`[onclick="setTheme('${t}')"]`);
  if (btn) btn.classList.add('active');

  // remove previous decorations
  document.querySelectorAll('#sky .sun,#sky .moon').forEach(e=>e.remove());
  document.querySelectorAll('.star').forEach(s=>s.remove());

  const sky = document.getElementById('sky');
  const audience = document.getElementById('audience');
  if(audience) audience.style.zIndex = '10';

  if (!IS_F1) {
    if(t === 'day'){
      const s = document.createElement('div'); s.id='theme-sun'; s.className='sun'; 
      sky.appendChild(s);
    } else if(t === 'sunset'){
      const s = document.createElement('div'); s.id='theme-sun'; s.className='sun sunset'; 
      sky.appendChild(s);
    } else if(t === 'night'){
      const m = document.createElement('div'); m.id='theme-moon'; m.className='moon'; 
      m.style.background = 'transparent';
      m.style.boxShadow = 'none';
      m.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 100 100" style="overflow:visible">
        <path d="M 50 10 A 40 40 0 1 0 90 50 A 30 30 0 0 1 50 10 Z" fill="#dfefff" style="filter: drop-shadow(0px 0px 8px rgba(200,220,255,0.8))"/>
      </svg>`;
      sky.appendChild(m);
    }
  }

  // stars for night/neon themes
  if(t==='night'||t==='neon'){
    for(let i=0;i<55;i++){
      const s=document.createElement('div');s.className='star';
      const sz=Math.random()*2.4+.8;
      s.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*window.innerWidth}px;top:${Math.random()*78}px;animation-delay:${Math.random()*3}s`;
      document.getElementById('scene').appendChild(s);
    }
  }
}

// ── Toggle Admin ──
function toggleAdmin(){
  adminOn=!adminOn;
  document.getElementById('admin-bar').classList.toggle('hidden',!adminOn);
  let fb=document.getElementById('fab');
  if(!adminOn){
    if(!fb){fb=document.createElement('button');fb.id='fab';fb.className='btn btn-gold';
      fb.style.cssText='position:absolute;bottom:8px;right:8px;z-index:45;font-size:10px';
      fb.textContent='⚙️ Admin';fb.onclick=toggleAdmin;
      document.getElementById('scene').appendChild(fb);}
  } else {if(fb)fb.remove();}
}

// ── Animação de pernas (Cavalos) ──
function animLegs(){
  animTick++;
  document.querySelectorAll('.racer-wrap').forEach((wrap,i)=>{
    const e = raceState.entrants[i];
    if(!e || e.gifts===0) return;
    const ph=(animTick*.16+i*.7)%(2*Math.PI);
    const offs=[0,Math.PI,.45,Math.PI+.45];
    wrap.querySelectorAll('.leg').forEach((leg,li)=>{
      const swing=Math.sin(ph+offs[li])*7;
      const x1=parseFloat(leg.getAttribute('x1'));
      const y1=parseFloat(leg.getAttribute('y1'));
      leg.setAttribute('x2',String(x1+(li%2===0?-swing:swing)));
      leg.setAttribute('y2',String(y1+7+Math.abs(swing*.4)));
    });
  });
  requestAnimationFrame(animLegs);
}

// ── Boot ──
window.addEventListener('load',()=>{
  raceState.entrants=ENTRANTS.map(e=>({...e,gifts:0}));
  buildTrack();
  updatePositions();
  setTheme('day');
  if(!IS_F1) {
    createAudience(28);
    animLegs();
  }
  startDemo();
});
