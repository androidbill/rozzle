/* =====================================================
   The Legend of Rozzle — HD Game Engine
   Full gradient/arc/glow rendering — premium look
   ===================================================== */

'use strict';

const APP_VERSION = '2026.06.27.02';

// ── Constants ──────────────────────────────────────────
const TILE = 64;       // HD: 64px per tile
const COLS = 11;
const ROWS = 10;
const W    = COLS * TILE;   // 704
const H    = ROWS * TILE;   // 640

const T = {
  EMPTY: 0, WALL: 1, WATER: 2,
  HEART: 3, CHEST: 4,
  EMERALD: 5,
  ARROW_R: 6, ARROW_L: 7, ARROW_U: 8, ARROW_D: 9,
  BRIDGE: 10, TREE: 11,
};

const E = {
  ROZZLE: 'rozzle', EGG: 'egg',
  LEEPER: 'leeper',
  SNAKEY: 'snakey',
  GOLS:   'gols',
  DON:    'don',
  ALMA:   'alma',
  ROCKY:  'rocky',
  SHOT:   'shot',
};

// ── HD Palette ─────────────────────────────────────────
const C = {
  floorA:  '#111428', floorB: '#181e3a',
  wallA:   '#1a3080', wallB: '#0d1a55', wallTop: '#3a5acc', wallEdge: '#0a1040',
  waterA:  '#0055cc', waterB: '#0033aa', waterFoam: '#55bbff', waterGlow: '#33aaff',
  heartA:  '#ff2255', heartB: '#cc0033', heartGlow: '#ff6699',
  chestA:  '#c87800', chestB: '#7a4800', chestLid: '#f0a020', chestLock: '#ffe066',
  emerA:   '#00cc55', emerB:  '#005520', emerGlow: '#44ffaa', emerFacet: '#88ffcc',
  treeA:   '#1a5a1a', treeB:  '#0d300d', treeTrunk:'#6b3e1e', treeLit: '#2a8a2a',
  bridgeA: '#8b5e2a', bridgeB: '#5a3a10',
  rozzleA:   '#3377ff', rozzleB:  '#1144cc', rozzleGlow: '#88bbff', rozzleEye: '#ffffff', rozzleMouth: '#ff2244',
  eggA:    '#fff4e0', eggB:   '#ddb870', eggGlow: '#ffffaa',
  shotA:   '#ff9900', shotB:  '#ff5500', shotGlow: '#ffdd00',
  leeperA: '#9933ee', leeperB:'#551199', leeperGlow:'#cc88ff',
  snakeyA: '#ff5500', snakeyB:'#992200', snakeyGlow:'#ff9955',
  golsA:   '#778899', golsB:  '#334455', golsGlow: '#aabbcc',
  donA:    '#ee1133', donB:   '#770011', donGlow:  '#ff6688',
  almaA:   '#ffcc00', almaB:  '#886600', almaGlow: '#ffee66',
  rockyA:  '#aa7733', rockyB: '#5a3a10', rockyGlow:'#ddaa55',
  frozenA: '#88ddff', frozenB:'#2266aa', frozenGlow:'#bbefff',
};

// ── Level Definitions — all verified solvable ──────────
const LEVELS = [
  // ── Room 1: Tutorial — open field, one sleeping Leeper ──
  // Solution: collect 4 hearts freely, watch for waking Leeper, open chest
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,3,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,4,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,3,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[{ type:E.LEEPER, col:5, row:4 }],
    rozzle:{ col:1, row:1 },
  },
  // ── Room 2: Snakeys patrol center, emerald blocks flank chest ──
  // Solution: freeze Snakeys, collect hearts around the open room, reach chest
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,1,0,0,0,1,0,0,1],
      [1,3,0,1,0,0,0,1,0,3,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,5,0,5,0,0,0,1],
      [1,0,0,0,0,4,0,0,0,0,1],
      [1,0,0,0,5,0,5,0,0,0,1],
      [1,3,0,0,0,0,0,0,0,3,1],
      [1,0,0,1,0,0,0,1,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.SNAKEY, col:5, row:2, dir:0 },
      { type:E.SNAKEY, col:5, row:7, dir:2 },
    ],
    rozzle:{ col:1, row:4 },
  },
  // ── Room 3: Gols guard fire lanes, water moat around center ──
  // Hearts reachable via col5 gap. Chest at (5,5) is open (not in water).
  // Solution: freeze left Gols from (1,3) shooting DOWN, freeze right Gols
  // from (9,4) shooting DOWN, then collect hearts and reach chest.
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,3,0,0,0,3,1,0,1],
      [1,0,1,0,0,2,0,0,1,0,1],
      [1,0,0,0,0,4,2,0,0,0,1],
      [1,0,1,0,0,2,0,0,1,0,1],
      [1,0,1,3,0,0,0,3,1,0,1],
      [1,0,1,1,1,0,1,1,1,0,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.GOLS, col:1, row:4, dir:0 },
      { type:E.GOLS, col:9, row:5, dir:2 },
    ],
    rozzle:{ col:1, row:1 },
  },
  // ── Room 4: Wall corridors, Alma bounces, Don chases ──
  // All 5 hearts and chest fully open and reachable
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,3,0,0,0,0,1],
      [1,0,5,0,0,0,0,0,5,0,1],
      [1,0,0,1,1,0,1,1,0,0,1],
      [1,3,0,1,0,0,0,1,0,3,1],
      [1,0,0,0,0,4,0,0,0,0,1],
      [1,3,0,1,0,0,0,1,0,3,1],
      [1,0,0,1,1,0,1,1,0,0,1],
      [1,0,5,0,0,0,0,0,5,0,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.ALMA, col:3, row:3, dir:0 },
      { type:E.ALMA, col:7, row:6, dir:2 },
      { type:E.DON,  col:5, row:2, dir:1 },
    ],
    rozzle:{ col:1, row:1 },
  },
  // ── Room 5: Emerald ring around water moat — push to bridge ──
  // Solution: push emeralds into water to create bridges to chest.
  // Push (4,3) DOWN → bridge (4,4). Push (3,4) RIGHT → (4,4) already bridge.
  // Push (3,5) RIGHT → bridge (4,5). Now path: open→(4,5)bridge→(5,5)chest.
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,3,0,3,0,0,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,0,0,0,5,5,5,0,0,0,1],
      [1,3,0,5,2,2,2,5,0,3,1],
      [1,0,0,5,2,4,2,5,0,0,1],
      [1,3,0,5,2,2,2,5,0,3,1],
      [1,0,0,0,5,5,5,0,0,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.ROCKY,  col:1, row:2, dir:0 },
      { type:E.ROCKY,  col:9, row:7, dir:2 },
      { type:E.SNAKEY, col:5, row:1, dir:1 },
      { type:E.LEEPER, col:5, row:8 },
    ],
    rozzle:{ col:1, row:1 },
  },
  // ── Room 6: Push emerald down col5 to bridge water, reach chest ──
  // Solution: push emerald at (5,2) DOWN to (5,3), push again to (5,4)=bridge,
  // then walk (5,3)→(5,4)bridge→(5,5)chest. Collect hearts first.
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,0,0,0,0,0,3,1],
      [1,0,1,1,0,5,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,0,0,0,2,2,2,0,0,0,1],
      [1,0,5,2,2,4,2,2,5,0,1],
      [1,0,0,0,2,2,2,0,0,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,3,0,1,1,0,1,1,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.DON,    col:2, row:4, dir:0 },
      { type:E.DON,    col:8, row:5, dir:2 },
      { type:E.GOLS,   col:5, row:1, dir:1 },
      { type:E.GOLS,   col:5, row:8, dir:3 },
      { type:E.LEEPER, col:1, row:8 },
      { type:E.LEEPER, col:9, row:1 },
    ],
    rozzle:{ col:1, row:1 },
  },
  // ── Room 7: Four-quadrant layout — all corners reachable, chest in open center-bottom ──
  // Fixed: open row1 so all 4 corner hearts accessible, chest placed at (5,7) in open area
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,0,0,0,0,0,3,1],
      [1,0,1,1,0,5,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,0,0,0,0,2,0,0,0,0,1],
      [1,0,5,0,2,0,2,0,5,0,1],
      [1,0,0,0,0,2,0,0,0,0,1],
      [1,0,1,0,0,4,0,0,1,0,1],
      [1,3,0,1,1,0,1,1,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.ALMA,   col:2, row:5, dir:0 },
      { type:E.ALMA,   col:8, row:4, dir:2 },
      { type:E.ROCKY,  col:5, row:3, dir:1 },
      { type:E.SNAKEY, col:2, row:3, dir:0 },
      { type:E.SNAKEY, col:8, row:6, dir:2 },
    ],
    rozzle:{ col:1, row:1 },
  },
  // ── Room 8: Final — wall fortress with gaps, water moat inside ──
  // Fixed: gaps at col5 in top/bottom wall rows so Rozzle can enter fortress.
  // Chest at (5,5) reachable via (3,5) or (7,5) open corridor.
  {
    tiles:[
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,3,0,3,0,0,3,1],
      [1,0,5,0,0,0,0,0,5,0,1],
      [1,0,0,1,1,0,1,1,0,0,1],
      [1,3,0,1,2,2,2,1,0,3,1],
      [1,0,0,0,0,4,0,0,0,0,1],
      [1,3,0,1,2,2,2,1,0,3,1],
      [1,0,0,1,1,0,1,1,0,0,1],
      [1,0,5,0,0,0,0,0,5,0,1],
      [1,1,1,1,1,1,1,1,1,1,1],
    ],
    entities:[
      { type:E.DON,    col:3, row:2, dir:0 },
      { type:E.DON,    col:7, row:7, dir:2 },
      { type:E.ROCKY,  col:1, row:5, dir:0 },
      { type:E.ROCKY,  col:9, row:4, dir:2 },
      { type:E.GOLS,   col:5, row:1, dir:1 },
      { type:E.GOLS,   col:5, row:8, dir:3 },
      { type:E.LEEPER, col:9, row:8 },
      { type:E.LEEPER, col:1, row:1 },
    ],
    rozzle:{ col:1, row:8 },
  },
];

// ── Game State ─────────────────────────────────────────
const GS = {
  screen:'title', room:0, lives:3, score:0,
  tiles:null, entities:[], rozzle:null, egg:null,
  hearts:0, heartsTotal:0, chestOpen:false,
  phase:'play', phaseTimer:0,
  moveTimer:0, enemyTimer:0, shotTimer:0,
  keys:{}, mobileDir:null, mobileFire:false, fireHeld:false,
};
const SAVE_KEY = 'legend-of-rozzle-save-v1';

function getSavedGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const save = JSON.parse(raw);
    if (!Number.isInteger(save.room) || save.room < 0 || save.room >= LEVELS.length) return null;
    if (!Number.isInteger(save.lives) || save.lives <= 0) return null;
    if (!Number.isInteger(save.score) || save.score < 0) return null;
    return save;
  } catch (_) {
    return null;
  }
}

function saveProgress() {
  if (GS.phase === 'gameover' || GS.phase === 'win') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      room: GS.room,
      lives: GS.lives,
      score: GS.score,
      savedAt: Date.now(),
    }));
  } catch (_) {}
  updateContinueButton();
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
  updateContinueButton();
}

function updateVersionLabels() {
  const badge = document.getElementById('app-version-badge');
  const about = document.getElementById('about-version');
  if (badge) {
    badge.textContent = 'v' + APP_VERSION;
    badge.setAttribute('aria-label', 'Version ' + APP_VERSION);
  }
  if (about) about.textContent = APP_VERSION;
}

function updateContinueButton() {
  const btn = document.getElementById('btn-continue');
  if (!btn) return;
  const save = getSavedGame();
  btn.disabled = !save;
  btn.textContent = save ? `Continue Room ${save.room + 1}` : 'Continue';
}

// ── Canvas Setup ───────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  const wrapper = document.getElementById('canvas-wrapper');
  const ww = wrapper.clientWidth;
  const wh = wrapper.clientHeight;
  const scale = Math.min(ww / W, wh / H);
  canvas.width  = W;
  canvas.height = H;
  canvas.style.width  = Math.floor(W * scale) + 'px';
  canvas.style.height = Math.floor(H * scale) + 'px';
}

// ── HD Drawing Helpers ─────────────────────────────────

function px(c) { return c * TILE; }

function radialGrad(x, y, r0, r1, colIn, colOut) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  g.addColorStop(0, colIn);
  g.addColorStop(1, colOut);
  return g;
}

function linearGrad(x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r);
  ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h);
  ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r);
  ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}

function glow(color, blur) {
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
}
function noGlow() {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur  = 0;
}

// ── Pre-baked floor canvas (generated once) ────────────
let floorCanvas = null;
function buildFloorCanvas() {
  floorCanvas = document.createElement('canvas');
  floorCanvas.width  = W;
  floorCanvas.height = H;
  const fc = floorCanvas.getContext('2d');

  // base gradient
  const bg = fc.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   '#14193a');
  bg.addColorStop(0.5, '#0e1228');
  bg.addColorStop(1,   '#141930');
  fc.fillStyle = bg;
  fc.fillRect(0, 0, W, H);

  // subtle tile grid
  fc.strokeStyle = 'rgba(60,80,160,0.18)';
  fc.lineWidth = 1;
  for(let c = 0; c <= COLS; c++) {
    fc.beginPath(); fc.moveTo(c*TILE, 0); fc.lineTo(c*TILE, H); fc.stroke();
  }
  for(let r = 0; r <= ROWS; r++) {
    fc.beginPath(); fc.moveTo(0, r*TILE); fc.lineTo(W, r*TILE); fc.stroke();
  }

  // tile inner glow spots
  for(let r = 0; r < ROWS; r++) {
    for(let c = 0; c < COLS; c++) {
      const cx = c*TILE + TILE/2, cy = r*TILE + TILE/2;
      const g = fc.createRadialGradient(cx, cy, 0, cx, cy, TILE*0.5);
      g.addColorStop(0, 'rgba(80,110,200,0.07)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      fc.fillStyle = g;
      fc.fillRect(c*TILE, r*TILE, TILE, TILE);
    }
  }
}

// ── Tile Rendering ─────────────────────────────────────

function drawWall(x, y) {
  const T2 = TILE;
  // Base stone with gradient
  const g = linearGrad(x, y, x, y+T2, [
    [0,   '#2a40a0'],
    [0.4, '#1a2e80'],
    [1,   '#0e1a55'],
  ]);
  roundRect(x+1, y+1, T2-2, T2-2, 4);
  ctx.fillStyle = g;
  ctx.fill();

  // Beveled edges — top/left light
  ctx.fillStyle = 'rgba(100,140,255,0.35)';
  ctx.fillRect(x+1, y+1, T2-2, 3);
  ctx.fillRect(x+1, y+1, 3, T2-2);
  // bottom/right dark
  ctx.fillStyle = 'rgba(0,0,20,0.5)';
  ctx.fillRect(x+1, y+T2-4, T2-2, 3);
  ctx.fillRect(x+T2-4, y+1, 3, T2-2);

  // Mortar lines (brick pattern)
  const row = Math.floor(y/T2);
  const offset = (row % 2 === 0) ? 0 : T2/2;
  ctx.strokeStyle = 'rgba(8,12,40,0.8)';
  ctx.lineWidth = 1.5;
  // horizontal
  ctx.beginPath(); ctx.moveTo(x, y+T2/2); ctx.lineTo(x+T2, y+T2/2); ctx.stroke();
  // vertical (staggered)
  ctx.beginPath(); ctx.moveTo(x+offset, y); ctx.lineTo(x+offset, y+T2/2); ctx.stroke();
  const v2 = (offset + T2/2) % T2;
  ctx.beginPath(); ctx.moveTo(x+v2, y+T2/2); ctx.lineTo(x+v2, y+T2); ctx.stroke();

  // Subtle inner glow
  const ig = radialGrad(x+T2/2, y+T2/2, T2*0.1, T2*0.7, 'rgba(80,120,255,0.1)', 'rgba(0,0,0,0)');
  ctx.fillStyle = ig;
  ctx.fillRect(x, y, T2, T2);
}

function drawWater(x, y, tick) {
  const T2 = TILE;
  // Deep base
  ctx.fillStyle = linearGrad(x, y, x, y+T2, [
    [0,   '#0044bb'],
    [0.5, '#0033aa'],
    [1,   '#002288'],
  ]);
  ctx.fillRect(x, y, T2, T2);

  // Animated sine-wave foam lines
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, T2, T2); ctx.clip();
  const t = tick * 0.04;
  for(let wave = 0; wave < 3; wave++) {
    const yOff = y + 14 + wave * 18;
    const phase = t + wave * 1.2 + x * 0.015;
    ctx.beginPath();
    for(let px2 = 0; px2 <= T2; px2 += 2) {
      const wy = yOff + Math.sin(phase + px2 * 0.18) * 3;
      px2 === 0 ? ctx.moveTo(x+px2, wy) : ctx.lineTo(x+px2, wy);
    }
    ctx.strokeStyle = `rgba(120,200,255,${0.25 - wave*0.06})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Shimmer spot
  const sx = x + T2/2 + Math.sin(t*1.3 + x) * 10;
  const sy = y + T2/2 + Math.cos(t + y*0.01) * 8;
  const sg = radialGrad(sx, sy, 0, 12, 'rgba(150,220,255,0.5)', 'rgba(0,80,200,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(x, y, T2, T2);
  ctx.restore();

  // Glow border
  glow(C.waterGlow, 10);
  ctx.strokeStyle = 'rgba(60,160,255,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x+0.5, y+0.5, T2-1, T2-1);
  noGlow();
}

function drawHeart(x, y, tick) {
  const cx = x + TILE/2, cy = y + TILE/2;
  const pulse = 1 + Math.sin(tick * 0.08) * 0.06;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);

  // Glow
  glow(C.heartGlow, 18);
  ctx.fillStyle = radialGrad(0, -4, 0, 20, C.heartA, C.heartB);

  // Heart path
  ctx.beginPath();
  const s = 16;
  ctx.moveTo(0, s*0.4);
  ctx.bezierCurveTo(-s*1.1, -s*0.3, -s*1.3, s*0.7, 0, s*1.1);
  ctx.bezierCurveTo(s*1.3, s*0.7, s*1.1, -s*0.3, 0, s*0.4);
  ctx.closePath();
  ctx.fill();
  noGlow();

  // Shine
  ctx.fillStyle = 'rgba(255,200,220,0.5)';
  ctx.beginPath();
  ctx.ellipse(-5, -4, 5, 3, -0.5, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawChest(x, y, open, tick) {
  const T2 = TILE, pad = 6, r = 6;
  const bx = x+pad, by = y+pad+4, bw = T2-pad*2, bh = T2-pad*2-4;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  roundRect(bx+3, by+3, bw, bh, r);
  ctx.fill();

  // Body
  ctx.fillStyle = linearGrad(bx, by, bx, by+bh, [
    [0,   open ? '#d08800' : '#a86000'],
    [1,   C.chestB],
  ]);
  roundRect(bx, by, bw, bh, r);
  ctx.fill();

  // Lid (top half)
  const lidGrad = linearGrad(bx, by, bx, by+bh*0.45, [
    [0,   open ? '#ffe066' : C.chestLid],
    [1,   open ? '#cc9900' : '#c87800'],
  ]);
  ctx.fillStyle = lidGrad;
  roundRect(bx, by, bw, bh*0.45, r);
  ctx.fill();

  // Rim stripe
  ctx.fillStyle = open ? '#ffee88' : '#ffbb44';
  ctx.fillRect(bx, by+bh*0.42, bw, 3);

  // Lock / keyhole
  if (!open) {
    glow('#ffee00', 8);
    ctx.fillStyle = C.chestLock;
    ctx.beginPath();
    ctx.arc(x+T2/2, by+bh*0.5+2, 7, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = C.chestB;
    ctx.fillRect(x+T2/2-3, by+bh*0.5+2, 6, 7);
    noGlow();
  } else {
    // Open glow
    glow('#ffff88', 20);
    ctx.fillStyle = 'rgba(255,240,100,0.7)';
    ctx.beginPath();
    ctx.arc(x+T2/2, by+bh*0.5, 10, 0, Math.PI*2);
    ctx.fill();
    noGlow();
    // Sparkles
    for(let i=0; i<4; i++) {
      const ang = (tick*0.1 + i*Math.PI/2);
      const sx = x+T2/2 + Math.cos(ang)*14;
      const sy = by+bh*0.5 + Math.sin(ang)*10;
      ctx.fillStyle = 'rgba(255,240,80,0.8)';
      ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI*2); ctx.fill();
    }
  }

  // Bevel
  ctx.strokeStyle = 'rgba(255,180,80,0.5)';
  ctx.lineWidth = 1.5;
  roundRect(bx+1, by+1, bw-2, bh-2, r);
  ctx.stroke();
}

function drawEmerald(x, y, tick) {
  const T2 = TILE, pad = 8, r = 6;
  const ex = x+pad, ey = y+pad, ew = T2-pad*2, eh = T2-pad*2;
  const cx = x+T2/2, cy = y+T2/2;
  const pulse = 1 + Math.sin(tick*0.07)*0.04;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);
  ctx.translate(-cx, -cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  roundRect(ex+3, ey+3, ew, eh, r);
  ctx.fill();

  // Body gradient
  glow(C.emerGlow, 14);
  ctx.fillStyle = linearGrad(ex, ey, ex+ew, ey+eh, [
    [0,   C.emerA],
    [0.5, '#009944'],
    [1,   C.emerB],
  ]);
  roundRect(ex, ey, ew, eh, r);
  ctx.fill();
  noGlow();

  // Facet lines (gem cut)
  ctx.strokeStyle = 'rgba(100,255,160,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, ey); ctx.lineTo(cx, ey+eh);
  ctx.moveTo(ex, cy); ctx.lineTo(ex+ew, cy);
  ctx.moveTo(ex, ey); ctx.lineTo(ex+ew, ey+eh);
  ctx.moveTo(ex+ew, ey); ctx.lineTo(ex, ey+eh);
  ctx.stroke();

  // Highlight
  ctx.fillStyle = 'rgba(180,255,210,0.5)';
  ctx.beginPath(); ctx.ellipse(cx-4, cy-4, 7, 4, -0.4, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

function drawTree(x, y) {
  const T2 = TILE;
  // Trunk
  ctx.fillStyle = linearGrad(x+T2/2-6, y+T2*0.55, x+T2/2+6, y+T2, [
    [0, '#8b5e2a'], [1, '#5a3a10']
  ]);
  ctx.fillRect(x+T2/2-8, y+T2*0.55, 16, T2*0.45);

  // Shadow under canopy
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(x+T2/2, y+T2*0.62, T2*0.38, 6, 0, 0, Math.PI*2); ctx.fill();

  // Canopy layers (3 circles, depth)
  const layers = [
    { oy: T2*0.44, r: T2*0.34, col: C.treeB },
    { oy: T2*0.32, r: T2*0.38, col: C.treeA },
    { oy: T2*0.22, r: T2*0.30, col: C.treeLit },
  ];
  for(const l of layers) {
    const g = radialGrad(x+T2/2-4, y+l.oy, 0, T2*0.4, l.col, C.treeB);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x+T2/2, y+l.oy, l.r, 0, Math.PI*2); ctx.fill();
  }
  // Highlight
  ctx.fillStyle = 'rgba(100,200,100,0.3)';
  ctx.beginPath(); ctx.ellipse(x+T2/2-6, y+T2*0.16, 8, 5, -0.3, 0, Math.PI*2); ctx.fill();
}

function drawBridge(x, y) {
  const T2 = TILE;
  // Planks
  for(let i = 0; i < 4; i++) {
    const px2 = x + i*(T2/4);
    ctx.fillStyle = linearGrad(px2, y, px2+T2/4, y+T2, [
      [0, '#a0703a'], [0.5,'#8b5e2a'], [1,'#5a3a10']
    ]);
    ctx.fillRect(px2+1, y+2, T2/4-2, T2-4);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1;
    ctx.strokeRect(px2+1, y+2, T2/4-2, T2-4);
  }
  // Rails
  ctx.fillStyle = '#c08040';
  ctx.fillRect(x+2, y+2, T2-4, 4);
  ctx.fillRect(x+2, y+T2-6, T2-4, 4);
}

// ── Entity Rendering ───────────────────────────────────

function drawShadow(cx, cy, rx, ry) {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.fill();
}

function drawRozzle(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2;
  const bob = Math.sin(tick*0.12) * (ent.moving ? 2 : 1);

  // Ground shadow
  drawShadow(cx, y+TILE-6, 20, 6);

  ctx.save();
  ctx.translate(cx, cy + bob - 2);

  // Body glow
  glow(C.rozzleGlow, 20);

  // Main body — big round blob
  const bodyGrad = radialGrad(-6, -8, 4, 26, '#88bbff', C.rozzleB);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI*2); ctx.fill();
  noGlow();

  // Highlight
  ctx.fillStyle = 'rgba(200,220,255,0.45)';
  ctx.beginPath(); ctx.ellipse(-7, -10, 9, 6, -0.3, 0, Math.PI*2); ctx.fill();

  // Eyes
  const blink = (tick % 90 > 86);
  if (!blink) {
    // Eye whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(-9, -4, 6, 7, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(9,  -4, 6, 7, 0, 0, Math.PI*2); ctx.fill();
    // Pupils (follow direction subtly)
    const dp = [2,0,-2,0,0,2,0,-2][ent.dir*2];
    const dr2 = [2,0,-2,0,0,2,0,-2][ent.dir*2+1];
    ctx.fillStyle = '#001a66';
    ctx.beginPath(); ctx.arc(-9+dp*0.5, -4+dr2*0.5, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( 9+dp*0.5, -4+dr2*0.5, 3, 0, Math.PI*2); ctx.fill();
    // Glint
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(-11, -6, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(  7, -6, 1.5, 0, Math.PI*2); ctx.fill();
  } else {
    ctx.strokeStyle = '#001a66'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-13,-4); ctx.lineTo(-5,-4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5,-4);  ctx.lineTo(13,-4); ctx.stroke();
  }

  // Mouth
  ctx.strokeStyle = GS.egg ? '#440000' : C.rozzleMouth;
  ctx.lineWidth   = GS.egg ? 3 : 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if(GS.egg) {
    ctx.arc(0, 8, 8, 0.2, Math.PI-0.2);
  } else {
    ctx.arc(0, 10, 7, Math.PI+0.3, -0.3);
  }
  ctx.stroke();

  // Feet
  const footOff = ent.moving ? Math.sin(tick*0.25)*5 : 0;
  ctx.fillStyle = C.rozzleB;
  ctx.beginPath(); ctx.ellipse(-9, 20+footOff, 6, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse( 9, 20-footOff, 6, 4, 0, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

function drawEgg(ent) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2;

  drawShadow(cx, y+TILE-4, 16, 5);

  ctx.save();
  ctx.translate(cx, cy);

  glow(C.eggGlow, 16);
  // Egg oval
  const eg = radialGrad(-4, -6, 2, 18, '#fffef0', C.eggB);
  ctx.fillStyle = eg;
  ctx.beginPath(); ctx.ellipse(0, 2, 14, 18, 0, 0, Math.PI*2); ctx.fill();
  noGlow();

  // Crack lines
  ctx.strokeStyle = C.eggB; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(-2,0); ctx.lineTo(3,4); ctx.stroke();

  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.ellipse(-4, -6, 4, 3, -0.4, 0, Math.PI*2); ctx.fill();

  ctx.restore();
}

function drawFrozenOverlay(cx, cy, r) {
  glow(C.frozenGlow, 16);
  const fg = radialGrad(cx-r*0.3, cy-r*0.3, 0, r*1.1, 'rgba(150,230,255,0.55)', 'rgba(30,100,200,0.3)');
  ctx.fillStyle = fg;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  noGlow();
  // Ice crystal lines
  ctx.strokeStyle = 'rgba(180,240,255,0.7)'; ctx.lineWidth = 1.5;
  for(let i=0; i<6; i++) {
    const a = i*Math.PI/3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx+Math.cos(a)*r*0.8, cy+Math.sin(a)*r*0.8);
    ctx.stroke();
  }
}

function drawEnemyBody(cx, cy, r, gradA, gradB, glowCol, glowAmt) {
  drawShadow(cx, cy+r*0.85, r*0.85, r*0.25);
  glow(glowCol, glowAmt);
  const g = radialGrad(cx-r*0.3, cy-r*0.4, r*0.05, r*1.1, gradA, gradB);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  noGlow();
  // Rim light
  ctx.strokeStyle = `${gradA}44`; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, r-1, 0, Math.PI*2); ctx.stroke();
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath(); ctx.ellipse(cx-r*0.28, cy-r*0.32, r*0.28, r*0.18, -0.3, 0, Math.PI*2); ctx.fill();
}

function drawEyes(cx, cy, eyeCol, pupilCol, spacing, size, offsetX, offsetY) {
  [-1,1].forEach(side => {
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.ellipse(cx+side*spacing+offsetX, cy+offsetY, size, size*1.2, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = pupilCol;
    ctx.beginPath(); ctx.arc(cx+side*spacing+offsetX+side*1, cy+offsetY+1, size*0.55, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.arc(cx+side*spacing+offsetX-size*0.3, cy+offsetY-size*0.4, size*0.28, 0, Math.PI*2); ctx.fill();
  });
}

function drawLeeper(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2-2;
  const r = 22;
  if(ent.frozen) {
    drawEnemyBody(cx, cy, r, C.frozenA, C.frozenB, C.frozenGlow, 18);
    drawFrozenOverlay(cx, cy, r);
    return;
  }
  drawEnemyBody(cx, cy, r, C.leeperA, C.leeperB, C.leeperGlow, 16);
  if(!ent.awake) {
    // Sleeping: closed eyes + ZZZ
    ctx.fillStyle = '#cc88ff'; ctx.lineWidth = 2.5; ctx.lineCap='round';
    ctx.strokeStyle = '#330066';
    ctx.beginPath(); ctx.moveTo(cx-12,cy-2); ctx.lineTo(cx-4,cy-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+4,cy-2);  ctx.lineTo(cx+12,cy-2); ctx.stroke();
    // ZZZ
    for(let i=0;i<3;i++){
      const sz = 6+i*2, zx = cx+r*0.6+i*4, zy = cy-r*0.5-i*6;
      ctx.fillStyle = `rgba(220,180,255,${0.5+i*0.2})`;
      ctx.font = `bold ${sz}px sans-serif`; ctx.textAlign='center';
      ctx.fillText('z', zx, zy);
    }
  } else {
    drawEyes(cx, cy, '#ffff66','#330033', 9, 6, 0, -2);
    // Angry brow
    ctx.strokeStyle='#330033'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(cx-16,cy-12); ctx.lineTo(cx-6,cy-8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+6,cy-8);   ctx.lineTo(cx+16,cy-12); ctx.stroke();
  }
}

function drawSnakey(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2-2;
  const r = 22;
  if(ent.frozen) {
    drawEnemyBody(cx, cy, r, C.frozenA, C.frozenB, C.frozenGlow, 18);
    drawFrozenOverlay(cx, cy, r); return;
  }
  drawEnemyBody(cx, cy, r, C.snakeyA, C.snakeyB, C.snakeyGlow, 16);
  drawEyes(cx, cy, '#ffff44','#220000', 9, 6, 0, -2);
  // Forked tongue
  const DVEC = [[1,0],[0,1],[-1,0],[0,-1]];
  const [dx,dy] = DVEC[ent.dir||0];
  const tx = cx+dx*r, ty = cy+dy*r;
  ctx.strokeStyle='#ff3300'; ctx.lineWidth=2.5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx+dx*18,cy+dy*18); ctx.lineTo(tx,ty); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+dy*5+dx*4,ty-dx*5+dy*4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-dy*5+dx*4,ty+dx*5+dy*4); ctx.stroke();
}

function drawGols(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2-2;
  const r = 22;
  if(ent.frozen) {
    drawEnemyBody(cx, cy, r, C.frozenA, C.frozenB, C.frozenGlow, 18);
    drawFrozenOverlay(cx, cy, r); return;
  }
  drawEnemyBody(cx, cy, r, C.golsA, C.golsB, C.golsGlow, 12);
  // Visor slit
  ctx.fillStyle='#001a1a';
  ctx.beginPath(); ctx.ellipse(cx, cy-2, 14, 5, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(0,220,200,0.6)';
  ctx.beginPath(); ctx.ellipse(cx, cy-2, 12, 3.5, 0, 0, Math.PI*2); ctx.fill();
  // Cannon barrel
  const DVEC = [[1,0],[0,1],[-1,0],[0,-1]];
  const [dx,dy] = DVEC[ent.dir||0];
  const pulsed = (tick%30<15) ? 1 : 0.85;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.atan2(dy,dx));
  ctx.fillStyle = linearGrad(0,-4,20,-4,[[0,'#445566'],[1,'#223344']]);
  ctx.fillRect(14, -5, 14, 10);
  glow('#00ffcc', 10*pulsed);
  ctx.fillStyle=`rgba(0,240,200,${0.7*pulsed})`;
  ctx.beginPath(); ctx.arc(27, 0, 4, 0, Math.PI*2); ctx.fill();
  noGlow();
  ctx.restore();
}

function drawDon(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2-2;
  const r = 22;
  if(ent.frozen) {
    drawEnemyBody(cx, cy, r, C.frozenA, C.frozenB, C.frozenGlow, 18);
    drawFrozenOverlay(cx, cy, r); return;
  }
  drawEnemyBody(cx, cy, r, C.donA, C.donB, C.donGlow, 18);
  // Flashing angry eyes
  const flash = (tick%8<4);
  drawEyes(cx, cy, flash?'#ffffff':'#ffdd00','#330000', 9, 6.5, 0, -2);
  // Speed lines
  const DVEC = [[1,0],[0,1],[-1,0],[0,-1]];
  const [dx,dy] = DVEC[ent.dir||0];
  ctx.strokeStyle='rgba(255,80,80,0.4)'; ctx.lineWidth=1.5;
  for(let i=0;i<3;i++){
    const off = (i-1)*8;
    const px2=cx-dx*18+dy*off, py2=cy-dy*18+dx*off;
    ctx.beginPath(); ctx.moveTo(px2,py2); ctx.lineTo(px2-dx*10,py2-dy*10); ctx.stroke();
  }
}

function drawAlma(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2-2;
  const r = 22;
  if(ent.frozen) {
    drawEnemyBody(cx, cy, r, C.frozenA, C.frozenB, C.frozenGlow, 18);
    drawFrozenOverlay(cx, cy, r); return;
  }
  const bob = Math.sin(tick*0.15)*3;
  drawEnemyBody(cx, cy+bob, r, C.almaA, C.almaB, C.almaGlow, 16);
  drawEyes(cx, cy+bob, '#ffee00','#332200', 9, 6, 0, -2);
  // Antennae
  ctx.strokeStyle='#ffaa00'; ctx.lineWidth=2.5; ctx.lineCap='round';
  const wig = Math.sin(tick*0.2)*6;
  ctx.beginPath(); ctx.moveTo(cx-7,cy+bob-r+2); ctx.quadraticCurveTo(cx-14+wig,cy+bob-r-10,cx-10+wig,cy+bob-r-16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+7,cy+bob-r+2); ctx.quadraticCurveTo(cx+14-wig,cy+bob-r-10,cx+10-wig,cy+bob-r-16); ctx.stroke();
  glow(C.almaGlow,8);
  ctx.fillStyle=C.almaA;
  ctx.beginPath(); ctx.arc(cx-10+wig,cy+bob-r-16,3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+10-wig,cy+bob-r-16,3,0,Math.PI*2); ctx.fill();
  noGlow();
}

function drawRocky(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2-2;
  const r = 22;
  if(ent.frozen) {
    drawEnemyBody(cx, cy, r, C.frozenA, C.frozenB, C.frozenGlow, 18);
    drawFrozenOverlay(cx, cy, r); return;
  }
  drawEnemyBody(cx, cy, r, C.rockyA, C.rockyB, C.rockyGlow, 12);
  drawEyes(cx, cy, '#ffffff','#331100', 9, 5.5, 0, -2);
  // Rocky texture — pebble dots
  ctx.fillStyle='rgba(90,60,20,0.5)';
  [[cx-5,cy+6,4],[cx+8,cy+2,3],[cx-10,cy+2,3.5],[cx+2,cy+10,2.5]].forEach(([rx,ry,rr])=>{
    ctx.beginPath(); ctx.arc(rx,ry,rr,0,Math.PI*2); ctx.fill();
  });
  // Shooter glow
  const DVEC = [[1,0],[0,1],[-1,0],[0,-1]];
  const [dx,dy] = DVEC[ent.dir||0];
  glow(C.rockyGlow, (tick%80<10)?16:0);
  ctx.fillStyle='rgba(220,160,80,0.6)';
  ctx.beginPath(); ctx.arc(cx+dx*r,cy+dy*r,5,0,Math.PI*2); ctx.fill();
  noGlow();
}

function drawShot(ent, tick) {
  const x = Math.round(ent.px), y = Math.round(ent.py);
  const cx = x+TILE/2, cy = y+TILE/2;
  const pulse = 0.8 + Math.sin(tick*0.3)*0.2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);

  // Outer glow ring
  glow(C.shotGlow, 22);
  ctx.fillStyle = C.shotA;
  ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
  noGlow();

  // Inner bright core
  const sg = radialGrad(0, 0, 0, 10, '#ffffff', C.shotB);
  ctx.fillStyle = sg;
  ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI*2); ctx.fill();

  // Trail
  const DVEC = [[1,0],[0,1],[-1,0],[0,-1]];
  const [dx,dy] = DVEC[ent.dir||0];
  for(let i=1;i<=4;i++){
    ctx.fillStyle = `rgba(255,${120+i*20},0,${0.15+i*0.04})`;
    ctx.beginPath(); ctx.arc(-dx*i*6,-dy*i*6, 8-i, 0, Math.PI*2); ctx.fill();
  }

  ctx.restore();
}

// ── Room Loading (unchanged logic) ────────────────────

function countHearts(tiles) {
  let n=0; for(const row of tiles) for(const t of row) if(t===T.HEART)n++; return n;
}

function loadRoom(roomIdx) {
  const lvl = LEVELS[roomIdx];
  GS.tiles = lvl.tiles.map(r=>[...r]);
  GS.heartsTotal = countHearts(GS.tiles);
  GS.hearts = 0; GS.chestOpen = false;
  GS.phase = 'play'; GS.phaseTimer = 0; GS.egg = null;
  const lp = lvl.rozzle;
  GS.rozzle = {
    type:E.ROZZLE, col:lp.col, row:lp.row,
    px:px(lp.col), py:px(lp.row),
    targetPx:px(lp.col), targetPy:px(lp.row),
    moving:false, dir:0, invincible:0,
  };
  GS.entities = [];
  for(const ed of lvl.entities) {
    GS.entities.push({
      type:ed.type, col:ed.col, row:ed.row,
      px:px(ed.col), py:px(ed.row),
      targetPx:px(ed.col), targetPy:px(ed.row),
      moving:false, dir:ed.dir??0,
      frozen:false, frozenTimer:0,
      awake:(ed.type!==E.LEEPER),
      shotCooldown:0, moveCounter:0,
    });
  }
}

// ── Pathfinding ────────────────────────────────────────

function bfsNext(fromCol, fromRow, toCol, toRow, tiles) {
  const visited = Array.from({length:ROWS},()=>new Array(COLS).fill(false));
  const parent  = Array.from({length:ROWS},()=>new Array(COLS).fill(null));
  const queue   = [{c:fromCol,r:fromRow}];
  visited[fromRow][fromCol] = true;
  function passable(c,r) {
    if(c<0||c>=COLS||r<0||r>=ROWS) return false;
    const t=tiles[r][c];
    return t!==T.WALL&&t!==T.WATER&&t!==T.TREE;
  }
  const DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
  while(queue.length) {
    const {c,r}=queue.shift();
    if(c===toCol&&r===toRow){
      let cur={c,r}, prev=parent[r][c];
      while(prev&&!(prev.c===fromCol&&prev.r===fromRow)){cur=prev;prev=parent[cur.r][cur.c];}
      return {c:cur.c,r:cur.r};
    }
    for(const [dc,dr] of DIRS){
      const nc=c+dc,nr=r+dr;
      if(!visited[nr]?.[nc]&&passable(nc,nr)){visited[nr][nc]=true;parent[nr][nc]={c,r};queue.push({c:nc,r:nr});}
    }
  }
  return null;
}

// ── Collision Helpers ──────────────────────────────────

function tileSolid(col, row, forEnemy) {
  if(col<0||col>=COLS||row<0||row>=ROWS) return true;
  const t=GS.tiles[row][col];
  if(t===T.WALL||t===T.TREE) return true;
  if(!forEnemy&&t===T.WATER) return true;
  if(t===T.EMERALD) return true;
  return false;
}
function tileKillsEnemy(col, row) {
  if(col<0||col>=COLS||row<0||row>=ROWS) return true;
  const t=GS.tiles[row][col];
  return t===T.WATER||t===T.WALL;
}

// ── Rozzle Movement ─────────────────────────────────────

const MOVE_SPEED = 10;

function tryMoveRozzle(dc, dr) {
  if(GS.rozzle.moving) return;
  const nc=GS.rozzle.col+dc, nr=GS.rozzle.row+dr;
  if(nc<0||nc>=COLS||nr<0||nr>=ROWS) return;
  const t=GS.tiles[nr][nc];
  if(t===T.WATER) return;
  if(t===T.EMERALD){
    const nc2=nc+dc,nr2=nr+dr;
    if(nc2<0||nc2>=COLS||nr2<0||nr2>=ROWS) return;
    const t2=GS.tiles[nr2][nc2];
    if(t2===T.WALL||t2===T.EMERALD||t2===T.TREE) return;
    GS.tiles[nr2][nc2]=(t2===T.WATER)?T.BRIDGE:T.EMERALD;
    GS.tiles[nr][nc]=T.EMPTY;
    crushEnemiesAt(nc2,nr2);
    Audio.sfxPush();
  }
  if(t===T.WALL||t===T.TREE) return;
  const frozenHere=GS.entities.find(e=>e.col===nc&&e.row===nr&&e.frozen&&e.type!==E.SHOT);
  if(frozenHere){
    const nc2=nc+dc,nr2=nr+dr;
    if(nc2<0||nc2>=COLS||nr2<0||nr2>=ROWS) return;
    if(tileSolid(nc2,nr2,false)) return;
    const blocking2=GS.entities.find(e=>e.col===nc2&&e.row===nr2);
    if(blocking2) return;
    if(tileKillsEnemy(nc2,nr2)){removeEntity(frozenHere);GS.score+=100;}
    else{frozenHere.col=nc2;frozenHere.row=nr2;frozenHere.px=px(nc2);frozenHere.py=px(nr2);frozenHere.targetPx=frozenHere.px;frozenHere.targetPy=frozenHere.py;}
  }
  if(t===T.HEART){GS.tiles[nr][nc]=T.EMPTY;GS.hearts++;GS.score+=50;updateHUD();if(GS.hearts>=GS.heartsTotal){Audio.playLastHeart();}else{Audio.sfxCollectHeart();}}
  if(t===T.CHEST&&GS.hearts>=GS.heartsTotal){GS.chestOpen=true;GS.score+=200;Audio.sfxOpenChest();setTimeout(()=>triggerRoomClear(),300);return;}
  GS.rozzle.col=nc;GS.rozzle.row=nr;
  GS.rozzle.targetPx=px(nc);GS.rozzle.targetPy=px(nr);
  GS.rozzle.moving=true;
  for(const e of GS.entities){
    if(e.type===E.LEEPER&&!e.frozen){
      const dist=Math.abs(e.col-GS.rozzle.col)+Math.abs(e.row-GS.rozzle.row);
      if(dist<=2) e.awake=true;
    }
  }
}

function crushEnemiesAt(col,row){
  for(let i=GS.entities.length-1;i>=0;i--){
    if(GS.entities[i].col===col&&GS.entities[i].row===row){GS.entities.splice(i,1);GS.score+=150;}
  }
}
function removeEntity(ent){const i=GS.entities.indexOf(ent);if(i!==-1)GS.entities.splice(i,1);}

// ── Firing ─────────────────────────────────────────────

const DIRS_VEC=[[1,0],[0,1],[-1,0],[0,-1]];

function fireRozzle(){
  if(GS.egg) return;
  const dir=GS.rozzle.dir;
  const [dc,dr]=DIRS_VEC[dir];
  const nc=GS.rozzle.col+dc,nr=GS.rozzle.row+dr;
  if(nc<0||nc>=COLS||nr<0||nr>=ROWS) return;
  if(tileSolid(nc,nr,false)) return;
  GS.egg={type:E.EGG,col:nc,row:nr,px:px(nc),py:px(nr),targetPx:px(nc),targetPy:px(nr),dir,dc,dr,moving:false,age:0,frozenTarget:null};
  Audio.sfxFire();
  const hit=GS.entities.find(e=>e.col===nc&&e.row===nr&&!e.frozen&&e.type!==E.SHOT);
  if(hit){freezeEnemy(hit);GS.egg.frozenTarget=hit;}
}

function freezeEnemy(ent){
  ent.frozen=true;ent.frozenTimer=300;ent.moving=false;
  ent.targetPx=ent.px=px(ent.col);ent.targetPy=ent.py=px(ent.row);
  GS.score+=50;
  Audio.sfxFreeze();
}

// ── Enemy AI (unchanged) ───────────────────────────────

let enemyTick=0;

function updateEnemies(){
  enemyTick++;
  const lc=GS.rozzle.col,lr=GS.rozzle.row;
  for(const e of GS.entities){
    if(e.frozen){e.frozenTimer--;if(e.frozenTimer<=0){e.frozen=false;if(GS.egg&&GS.egg.frozenTarget===e)GS.egg=null;}continue;}
    if(e.type===E.SHOT){updateShot(e);continue;}
    if(e.moving){
      const spd=(e.type===E.DON)?6:4;
      const _edx=e.targetPx-e.px,_edy=e.targetPy-e.py,_ed=Math.sqrt(_edx*_edx+_edy*_edy);
      if(_ed<=spd){e.px=e.targetPx;e.py=e.targetPy;e.moving=false;}
      else{e.px+=_edx/_ed*spd;e.py+=_edy/_ed*spd;}
      continue;
    }
    switch(e.type){
      case E.LEEPER: updateLeeper(e,lc,lr); break;
      case E.SNAKEY: updateSnakey(e,lc,lr); break;
      case E.GOLS:   updateGols(e,lc,lr);   break;
      case E.DON:    updateDon(e,lc,lr);    break;
      case E.ALMA:   updateAlma(e);          break;
      case E.ROCKY:  updateRocky(e,lc,lr);  break;
    }
  }
}

function lerp(a,b,t){const v=a+(b-a)*t;return(Math.abs(v-b)<0.5)?b:v;}

function moveEntityTo(e,nc,nr){
  if(nc<0||nc>=COLS||nr<0||nr>=ROWS) return false;
  if(tileSolid(nc,nr,true)) return false;
  const other=GS.entities.find(o=>o!==e&&o.col===nc&&o.row===nr);
  if(other) return false;
  e.col=nc;e.row=nr;e.targetPx=px(nc);e.targetPy=px(nr);e.moving=true;return true;
}

function getDirTo(fc,fr,tc,tr){const dc=tc-fc,dr=tr-fr;if(Math.abs(dc)>=Math.abs(dr))return dc>0?0:2;return dr>0?1:3;}

function updateLeeper(e,lc,lr){
  if(!e.awake){const dist=Math.abs(e.col-lc)+Math.abs(e.row-lr);if(dist<=1)e.awake=true;else return;}
  if(enemyTick%30!==0)return;
  const next=bfsNext(e.col,e.row,lc,lr,GS.tiles);
  if(next){e.dir=getDirTo(e.col,e.row,next.c,next.r);moveEntityTo(e,next.c,next.r);}
}
function updateSnakey(e,lc,lr){
  if(enemyTick%26!==0)return;
  const next=bfsNext(e.col,e.row,lc,lr,GS.tiles);
  if(next){e.dir=getDirTo(e.col,e.row,next.c,next.r);moveEntityTo(e,next.c,next.r);}
}
function updateGols(e,lc,lr){
  if(enemyTick%60!==0)return;
  const [dc,dr]=DIRS_VEC[e.dir];
  let c=e.col+dc,r=e.row+dr;
  while(c>=0&&c<COLS&&r>=0&&r<ROWS){
    if(tileSolid(c,r,false))break;
    if(c===lc&&r===lr){spawnShot(e.col+dc,e.row+dr,e.dir);break;}
    c+=dc;r+=dr;
  }
}
function updateDon(e,lc,lr){
  if(enemyTick%18!==0)return;
  const next=bfsNext(e.col,e.row,lc,lr,GS.tiles);
  if(next){e.dir=getDirTo(e.col,e.row,next.c,next.r);moveEntityTo(e,next.c,next.r);}
}
function updateAlma(e){
  if(enemyTick%18!==0)return;
  const [dc,dr]=DIRS_VEC[e.dir];
  if(!moveEntityTo(e,e.col+dc,e.row+dr)){
    for(const d of [(e.dir+1)%4,(e.dir+3)%4,(e.dir+2)%4]){
      const [dc2,dr2]=DIRS_VEC[d];
      if(moveEntityTo(e,e.col+dc2,e.row+dr2)){e.dir=d;break;}
    }
  }
}
function updateRocky(e,lc,lr){
  if(enemyTick%80===0){const [dc,dr]=DIRS_VEC[e.dir];spawnShot(e.col+dc,e.row+dr,e.dir);}
  if(enemyTick%40===0){const [dc,dr]=DIRS_VEC[e.dir];if(!moveEntityTo(e,e.col+dc,e.row+dr))e.dir=(e.dir+1)%4;}
}
function spawnShot(col,row,dir){
  if(col<0||col>=COLS||row<0||row>=ROWS) return;
  if(tileSolid(col,row,false)) return;
  GS.entities.push({type:E.SHOT,col,row,px:px(col),py:px(row),targetPx:px(col),targetPy:px(row),dir,moving:false,frozen:false,frozenTimer:0,awake:true,shotCooldown:0,moveCounter:0,age:0});
}
function updateShot(e){
  if(e.moving){
    const _sdx=e.targetPx-e.px,_sdy=e.targetPy-e.py,_sd=Math.sqrt(_sdx*_sdx+_sdy*_sdy);
    if(_sd<=10){e.px=e.targetPx;e.py=e.targetPy;e.moving=false;}
    else{e.px+=_sdx/_sd*10;e.py+=_sdy/_sd*10;}
    return;
  }
  e.age++;if(e.age%3!==0)return;
  const [dc,dr]=DIRS_VEC[e.dir];
  const nc=e.col+dc,nr=e.row+dr;
  if(nc<0||nc>=COLS||nr<0||nr>=ROWS||tileSolid(nc,nr,true)){removeEntity(e);return;}
  e.col=nc;e.row=nr;e.targetPx=px(nc);e.targetPy=px(nr);e.moving=true;
}

// ── Collision Detection ────────────────────────────────

function checkRozzleDeath(){
  if(GS.rozzle.invincible>0){GS.rozzle.invincible--;return;}
  const lc=GS.rozzle.col,lr=GS.rozzle.row;
  for(const e of GS.entities){
    if(!e.frozen&&e.col===lc&&e.row===lr){killRozzle();return;}
  }
}
function checkEggCollision(){
  if(!GS.egg)return;
  const ec=GS.egg.col,er=GS.egg.row;
  for(const e of GS.entities){
    if(!e.frozen&&e.col===ec&&e.row===er&&e.type!==E.SHOT){freezeEnemy(e);GS.egg.frozenTarget=e;return;}
  }
}

function killRozzle(){if(GS.phase!=='play')return;GS.phase='dead';GS.phaseTimer=90;GS.rozzle.invincible=999;Audio.sfxDie();Audio.stopMusic();setTimeout(()=>{if(GS.lives<=1)Audio.playGameOver();else Audio.playGameplay();},1800);}
function triggerRoomClear(){if(GS.phase!=='play')return;GS.phase='clear';GS.phaseTimer=150;GS.score+=(GS.room+1)*100;Audio.playRoomClear();}

function updateHUD(){
  document.getElementById('hud-room').textContent=GS.room+1;
  document.getElementById('hud-lives').textContent=GS.lives;
  document.getElementById('hud-score').textContent=GS.score;
  document.getElementById('hud-hearts').textContent=`${GS.hearts}/${GS.heartsTotal}`;
}

// ── Main Loop ──────────────────────────────────────────

let tick=0, lastTime=0, animId=null;

function gameLoop(ts){
  const dt=Math.min(ts-lastTime,50);lastTime=ts;tick++;
  update(tick);render(tick);
  animId=requestAnimationFrame(gameLoop);
}

let inputCooldown=0;

function update(tick){
  if(GS.phase==='dead'){
    GS.phaseTimer--;
    if(GS.phaseTimer<=0){
      GS.lives--;
      if(GS.lives<=0){clearSave();showScreen('gameover-screen');document.getElementById('final-score').textContent=GS.score;GS.phase='gameover';return;}
      saveProgress();
      loadRoom(GS.room);updateHUD();
    }
    return;
  }
  if(GS.phase==='clear'){
    GS.phaseTimer--;
    if(GS.phaseTimer<=0){
      GS.room++;
      if(GS.room>=LEVELS.length){clearSave();showScreen('win-screen');document.getElementById('win-score').textContent=GS.score;GS.phase='win';Audio.playWin();return;}
      saveProgress();
      loadRoom(GS.room);updateHUD();GS.phase='play';Audio.playGameplay();
    }
    return;
  }
  if(GS.phase!=='play') return;

  handleInput();

  // Bizzle smooth movement
  if(GS.rozzle.moving){
    const dx=GS.rozzle.targetPx-GS.rozzle.px, dy=GS.rozzle.targetPy-GS.rozzle.py;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<=MOVE_SPEED){GS.rozzle.px=GS.rozzle.targetPx;GS.rozzle.py=GS.rozzle.targetPy;GS.rozzle.moving=false;}
    else{GS.rozzle.px+=dx/dist*MOVE_SPEED;GS.rozzle.py+=dy/dist*MOVE_SPEED;}
  }

  if(GS.egg&&!GS.egg.frozenTarget){GS.egg.age++;if(GS.egg.age>240)GS.egg=null;}

  updateEnemies();
  checkRozzleDeath();
  checkEggCollision();
  updateHUD();
}

function handleInput(){
  if(inputCooldown>0){inputCooldown--;return;}
  if(GS.rozzle.moving) return;
  let dc=0,dr=0,fire=false;
  if(GS.keys['ArrowRight']||GS.keys['d'])dc=1;
  else if(GS.keys['ArrowLeft']||GS.keys['a'])dc=-1;
  else if(GS.keys['ArrowDown']||GS.keys['s'])dr=1;
  else if(GS.keys['ArrowUp']||GS.keys['w'])dr=-1;
  if(GS.mobileDir==='right')dc=1;
  else if(GS.mobileDir==='left')dc=-1;
  else if(GS.mobileDir==='down')dr=1;
  else if(GS.mobileDir==='up')dr=-1;
  if(GS.keys[' ']||GS.keys['z']||GS.mobileFire)fire=true;
  if(dc!==0||dr!==0){
    GS.rozzle.dir=dc>0?0:(dc<0?2:(dr>0?1:3));
    tryMoveRozzle(dc,dr);inputCooldown=0;
  }
  if(fire&&!GS.fireHeld){GS.fireHeld=true;fireRozzle();}
  if(!fire)GS.fireHeld=false;
  if(GS.keys['r']||GS.keys['R']){GS.keys['r']=GS.keys['R']=false;loadRoom(GS.room);updateHUD();}
}

// ── HD Render ──────────────────────────────────────────

function render(tick){
  ctx.clearRect(0,0,W,H);

  // Pre-baked floor
  if(floorCanvas) ctx.drawImage(floorCanvas, 0, 0);

  // Tiles
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const x=c*TILE,y=r*TILE,t=GS.tiles[r][c];
      switch(t){
        case T.WALL:    drawWall(x,y); break;
        case T.WATER:   drawWater(x,y,tick); break;
        case T.HEART:   drawHeart(x,y,tick); break;
        case T.CHEST:   drawChest(x,y,GS.chestOpen,tick); break;
        case T.EMERALD: drawEmerald(x,y,tick); break;
        case T.TREE:    drawTree(x,y); break;
        case T.BRIDGE:  drawBridge(x,y); break;
      }
    }
  }

  // Entities
  const shots=GS.entities.filter(e=>e.type===E.SHOT);
  const enemies=GS.entities.filter(e=>e.type!==E.SHOT);
  for(const e of shots)   drawEntity(e,tick);
  for(const e of enemies) drawEntity(e,tick);

  // Bizzle
  const rozzleVisible=(GS.rozzle.invincible===0)||(tick%6<3);
  if(rozzleVisible) drawRozzle(GS.rozzle,tick);
  if(GS.egg) drawEgg(GS.egg);

  // Phase overlays
  if(GS.phase==='dead'){
    ctx.fillStyle='rgba(30,0,0,0.6)';ctx.fillRect(0,0,W,H);
    ctx.save();
    ctx.textAlign='center';
    ctx.font='bold 36px "Press Start 2P",monospace';
    glow('#ff2244',30);
    ctx.fillStyle='#ff2244';ctx.fillText('YOU DIED',W/2,H/2);
    noGlow();ctx.restore();
  }
  if(GS.phase==='clear'){
    ctx.fillStyle='rgba(0,10,30,0.65)';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.textAlign='center';
    ctx.font='bold 36px "Press Start 2P",monospace';
    glow('#44ffaa',30);
    ctx.fillStyle='#44ffaa';ctx.fillText('ROOM CLEAR!',W/2,H/2);
    noGlow();ctx.restore();
  }
}

function drawEntity(e,tick){
  switch(e.type){
    case E.LEEPER: drawLeeper(e,tick); break;
    case E.SNAKEY: drawSnakey(e,tick); break;
    case E.GOLS:   drawGols(e,tick);   break;
    case E.DON:    drawDon(e,tick);    break;
    case E.ALMA:   drawAlma(e,tick);   break;
    case E.ROCKY:  drawRocky(e,tick);  break;
    case E.SHOT:   drawShot(e,tick);   break;
  }
}

// ── Screen Management ──────────────────────────────────


function closeTitleOptions() {
  const btn = document.getElementById('btn-title-options');
  const menu = document.getElementById('title-options-menu');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (menu) menu.hidden = true;
}

function toggleTitleOptions() {
  const btn = document.getElementById('btn-title-options');
  const menu = document.getElementById('title-options-menu');
  if (!btn || !menu) return;
  const willOpen = menu.hidden;
  menu.hidden = !willOpen;
  btn.setAttribute('aria-expanded', String(willOpen));
}

function openAboutDialog() {
  closeTitleOptions();
  const dialog = document.getElementById('about-dialog');
  updateVersionLabels();
  if (dialog) dialog.hidden = false;
}

function closeAboutDialog() {
  const dialog = document.getElementById('about-dialog');
  if (dialog) dialog.hidden = true;
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id === 'title-screen') updateContinueButton();
  else { closeTitleOptions(); closeAboutDialog(); }
}

function startRun(room, lives, score) {
  GS.room = room;
  GS.lives = lives;
  GS.score = score;
  buildFloorCanvas();
  loadRoom(GS.room);updateHUD();
  showScreen('game-screen');resizeCanvas();
  GS.phase='play';
  if(animId)cancelAnimationFrame(animId);
  tick=0;lastTime=performance.now();
  animId=requestAnimationFrame(gameLoop);
  saveProgress();
  Audio.playGameplay();
}

function startGame(){
  clearSave();
  startRun(0, 3, 0);
}

function continueGame(){
  const save = getSavedGame();
  if(!save) return;
  startRun(save.room, save.lives, save.score);
}

// ── Title Rozzle (HD) ────────────────────────────────────

function drawTitleRozzle(){
  const c=document.getElementById('title-rozzle');
  if(!c)return;
  c.width=128;c.height=128;
  const ct=c.getContext('2d');
  let t=0;
  function frame(){
    ct.clearRect(0,0,128,128);
    const cx=64,cy=64;
    // Shadow
    ct.fillStyle='rgba(0,0,0,0.3)';
    ct.beginPath();ct.ellipse(cx,110,28,8,0,0,Math.PI*2);ct.fill();
    // Body glow
    ct.shadowColor='#88bbff';ct.shadowBlur=30;
    const g=ct.createRadialGradient(cx-10,cy-14,6,cx,cy,40);
    g.addColorStop(0,'#88bbff');g.addColorStop(0.5,'#3377ff');g.addColorStop(1,'#1144cc');
    ct.fillStyle=g;
    ct.beginPath();ct.arc(cx,cy,40,0,Math.PI*2);ct.fill();
    ct.shadowBlur=0;
    // Highlight
    ct.fillStyle='rgba(200,220,255,0.4)';
    ct.beginPath();ct.ellipse(cx-12,cy-18,14,9,-0.3,0,Math.PI*2);ct.fill();
    // Eyes
    const blink=(t%90>86);
    if(!blink){
      ct.fillStyle='#ffffff';
      ct.beginPath();ct.ellipse(cx-14,cy-6,9,11,0,0,Math.PI*2);ct.fill();
      ct.beginPath();ct.ellipse(cx+14,cy-6,9,11,0,0,Math.PI*2);ct.fill();
      ct.fillStyle='#001a66';
      ct.beginPath();ct.arc(cx-13,cy-5,5,0,Math.PI*2);ct.fill();
      ct.beginPath();ct.arc(cx+14,cy-5,5,0,Math.PI*2);ct.fill();
      ct.fillStyle='rgba(255,255,255,0.9)';
      ct.beginPath();ct.arc(cx-17,cy-9,2.5,0,Math.PI*2);ct.fill();
      ct.beginPath();ct.arc(cx+10,cy-9,2.5,0,Math.PI*2);ct.fill();
    } else {
      ct.strokeStyle='#001a66';ct.lineWidth=3;ct.lineCap='round';
      ct.beginPath();ct.moveTo(cx-21,cy-6);ct.lineTo(cx-7,cy-6);ct.stroke();
      ct.beginPath();ct.moveTo(cx+7,cy-6);ct.lineTo(cx+21,cy-6);ct.stroke();
    }
    // Mouth
    ct.strokeStyle='#ff2244';ct.lineWidth=3;ct.lineCap='round';
    ct.beginPath();ct.arc(cx,cy+14,11,Math.PI+0.3,-0.3);ct.stroke();
    // Feet bob
    const fo=(t%16<8)?3:-3;
    ct.fillStyle='#1144cc';
    ct.beginPath();ct.ellipse(cx-14,cy+36+fo,8,6,0,0,Math.PI*2);ct.fill();
    ct.beginPath();ct.ellipse(cx+14,cy+36-fo,8,6,0,0,Math.PI*2);ct.fill();
    t++;requestAnimationFrame(frame);
  }
  frame();
}

// ── Input ──────────────────────────────────────────────

document.addEventListener('keydown',e=>{
  GS.keys[e.key]=true;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
});
document.addEventListener('keyup',e=>{
  GS.keys[e.key]=false;
  if(e.key===' '||e.key==='z')GS.fireHeld=false;
});

function setupDpad(){
  const dpad={up:'up',down:'down',left:'left',right:'right'};
  for(const [id,dir] of Object.entries(dpad)){
    const btn=document.getElementById('dpad-'+id);if(!btn)continue;
    btn.addEventListener('pointerdown',e=>{GS.mobileDir=dir;e.preventDefault();});
    btn.addEventListener('pointerup',e=>{if(GS.mobileDir===dir)GS.mobileDir=null;e.preventDefault();});
    btn.addEventListener('pointerleave',e=>{if(GS.mobileDir===dir)GS.mobileDir=null;});
  }
  const fireBtn=document.getElementById('btn-fire');
  if(fireBtn){
    fireBtn.addEventListener('pointerdown',e=>{GS.mobileFire=true;e.preventDefault();});
    fireBtn.addEventListener('pointerup',e=>{GS.mobileFire=false;GS.fireHeld=false;e.preventDefault();});
  }
  const restartBtn=document.getElementById('btn-restart');
  if(restartBtn){
    restartBtn.addEventListener('pointerdown',e=>{if(GS.phase==='play'){loadRoom(GS.room);updateHUD();}e.preventDefault();});
  }
}

let touchStart=null;
canvas.addEventListener('touchstart',e=>{touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};e.preventDefault();},{passive:false});
canvas.addEventListener('touchend',e=>{
  if(!touchStart)return;
  const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
  const adx=Math.abs(dx),ady=Math.abs(dy);
  if(Math.max(adx,ady)<10)fireRozzle();
  else if(adx>ady)GS.mobileDir=dx>0?'right':'left';
  else GS.mobileDir=dy>0?'down':'up';
  setTimeout(()=>{GS.mobileDir=null;},120);
  touchStart=null;e.preventDefault();
},{passive:false});

// ── Buttons ────────────────────────────────────────────

document.getElementById('btn-title-options').addEventListener('click',e=>{e.stopPropagation();toggleTitleOptions();});
document.getElementById('btn-about').addEventListener('click',()=>openAboutDialog());
document.getElementById('btn-about-close').addEventListener('click',()=>closeAboutDialog());
document.getElementById('about-dialog').addEventListener('click',e=>{if(e.target.id==='about-dialog')closeAboutDialog();});
document.addEventListener('click',e=>{
  const menu=document.getElementById('title-options-menu');
  const btn=document.getElementById('btn-title-options');
  if(menu && btn && !menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) closeTitleOptions();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTitleOptions();closeAboutDialog();}});

document.getElementById('btn-new-game').addEventListener('click',()=>startGame());
document.getElementById('btn-continue').addEventListener('click',()=>continueGame());
document.getElementById('btn-how-to').addEventListener('click',()=>showScreen('howto-screen'));
document.getElementById('btn-back').addEventListener('click',()=>showScreen('title-screen'));
document.getElementById('btn-retry').addEventListener('click',()=>startGame());
document.getElementById('btn-title').addEventListener('click',()=>{if(animId)cancelAnimationFrame(animId);showScreen('title-screen');Audio.stopMusic();Audio.playTitle();});
document.getElementById('btn-play-again').addEventListener('click',()=>startGame());
document.getElementById('btn-title2').addEventListener('click',()=>{if(animId)cancelAnimationFrame(animId);showScreen('title-screen');Audio.stopMusic();Audio.playTitle();});

// ══════════════════════════════════════════════════════
// ── Audio Engine — The Legend of Rozzle ──────────────
// MP3 background music via HTML5 Audio.
// Sound effects via Web Audio API (square wave SFX).
// ══════════════════════════════════════════════════════

const Audio = (() => {
  // ── MP3 player ─────────────────────────────────────
  const bgm = new window.Audio('music.mp3');
  bgm.loop    = true;
  bgm.volume  = 0.55;
  bgm.preload = 'auto';

  let musicStarted = false;
  let musicPaused  = false;

  function playMusic() {
    if (musicPaused) {
      bgm.play().catch(()=>{});
      musicPaused = false;
    } else {
      bgm.currentTime = 0;
      bgm.play().catch(()=>{});
    }
    musicStarted = true;
  }

  function pauseMusic() {
    if (!bgm.paused) { bgm.pause(); musicPaused = true; }
  }

  function stopMusic() {
    bgm.pause();
    bgm.currentTime = 0;
    musicPaused = false;
  }

  // ── Web Audio for SFX ──────────────────────────────
  let AC = null;
  let master = null;

  function boot() {
    if (AC) return;
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    master.gain.value = 0.22;
    master.connect(AC.destination);
  }

  function resume() {
    if (AC && AC.state === 'suspended') AC.resume();
    bgm.play().catch(()=>{});
  }

  function note(freq, when, dur, vol, shape) {
    if (!AC || !freq || freq <= 0) return;
    const g = AC.createGain();
    g.connect(master);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.008);
    g.gain.setValueAtTime(vol, when + dur * 0.78);
    g.gain.linearRampToValueAtTime(0, when + dur);
    const o = AC.createOscillator();
    o.type = shape || 'square';
    o.frequency.value = freq;
    o.connect(g);
    o.start(when);
    o.stop(when + dur + 0.02);
  }

  // Frequency table
  const F = {};
  const NS = ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'];
  for (let oct = 1; oct <= 7; oct++)
    for (let i = 0; i < 12; i++)
      F[NS[i]+oct] = 440 * Math.pow(2, ((oct+1)*12 + i - 69) / 12);

  // ── Music state hooks ───────────────────────────────
  // Title, gameplay, and last-heart all use the same
  // looping MP3. Room clear / game over pause it briefly
  // then resume. Win screen fades it out.

  function playTitle()    { playMusic(); }
  function playGameplay() { playMusic(); }

  function playLastHeart() {
    // Duck music briefly, play rising SFX, resume
    const prev = bgm.volume;
    bgm.volume = 0.18;
    boot(); resume();
    const t = AC.currentTime + 0.03;
    const run = [F.D5,F.E5,F.Fs5,F.G5,F.A5,F.B5,F.Cs6,F.D6];
    run.forEach((f,i) => note(f, t+i*0.055, 0.08, 0.30, 'square'));
    const land = t + run.length * 0.055;
    note(F.D5, land, 0.55, 0.26, 'triangle');
    note(F.Fs5,land, 0.55, 0.20, 'square');
    note(F.A5, land, 0.55, 0.18, 'square');
    note(F.D6, land, 0.55, 0.16, 'square');
    setTimeout(() => { bgm.volume = prev; }, 900);
  }

  function playRoomClear() {
    // Pause MP3, play fanfare SFX, then resume MP3
    pauseMusic();
    boot(); resume();
    const bpm = 152, B = 60/bpm;
    const t0 = AC.currentTime + 0.04;
    const seq = [
      [F.C5,0.25],[F.E5,0.25],[F.G5,0.25],[F.C6,0.5],[0,0.25],
      [F.E6,0.25],[F.D6,0.25],[F.C6,0.25],[F.B5,0.5],[0,0.5],
      [F.G5,0.5],[F.A5,0.5],[F.B5,0.5],[F.C6,1],[0,0.5],
      [F.E5,0.25],[F.G5,0.25],[F.A5,0.25],[F.G5,0.5],[0,0.25],
      [F.C6,0.5],[F.G5,0.25],[F.E5,0.25],[F.G5,0.5],[F.C6,0.5],
      [F.E6,0.5],[F.D6,0.5],[F.C6,2],
    ];
    const seqH = [
      [F.A4,0.25],[F.C5,0.25],[F.E5,0.25],[F.A5,0.5],[0,0.25],
      [F.C6,0.25],[F.B5,0.25],[F.A5,0.25],[F.G5,0.5],[0,0.5],
      [F.E5,0.5],[F.F5,0.5],[F.G5,0.5],[F.A5,1],[0,0.5],
      [F.C5,0.25],[F.E5,0.25],[F.F5,0.25],[F.E5,0.5],[0,0.25],
      [F.A5,0.5],[F.E5,0.25],[F.C5,0.25],[F.E5,0.5],[F.A5,0.5],
      [F.C6,0.5],[F.B5,0.5],[F.A5,2],
    ];
    const bassSeq = [
      [F.C3,1],[F.G3,1],[F.G2,1],[F.C3,1],
      [F.C3,1],[F.E3,1],[F.F3,0.5],[F.G3,0.5],[F.C3,2],
    ];
    let len = 0;
    let t = t0;
    for (const [f,b] of seq)  { if(f>0) note(f,t,b*B*0.88,0.36,'square');   t+=b*B; }
    len = t - t0;
    t = t0;
    for (const [f,b] of seqH) { if(f>0) note(f,t,b*B*0.88,0.20,'square');   t+=b*B; }
    t = t0;
    for (const [f,b] of bassSeq){ if(f>0) note(f,t,b*B*0.88,0.46,'triangle'); t+=b*B; }
    setTimeout(() => { bgm.volume = 0.55; bgm.play().catch(()=>{}); }, (len + 0.3) * 1000);
  }

  function playGameOver() {
    pauseMusic();
    boot(); resume();
    const B = 60/90;
    const t0 = AC.currentTime + 0.04;
    const seq = [
      [F.A5,0.5],[F.G5,0.5],[F.F5,0.5],[F.E5,0.5],
      [F.D5,0.5],[F.C5,0.5],[F.B4,0.5],[F.A4,0.5],
      [F.G4,1],[F.F4,1],[F.E4,2],
    ];
    let t = t0;
    for (const [f,b] of seq) { if(f>0) note(f,t,b*B*0.9,0.30,'square'); t+=b*B; }
    t = t0;
    [[F.A2,1],[F.E2,1],[F.D2,1],[F.A2,1],[F.G2,2],[F.A2,2]]
      .forEach(([f,b])=>{ if(f>0) note(f,t,b*B*0.9,0.40,'triangle'); t+=b*B; });
  }

  function playWin() {
    // Fade out music over 2s then stop
    const step = bgm.volume / 40;
    const fade = setInterval(() => {
      bgm.volume = Math.max(0, bgm.volume - step);
      if (bgm.volume <= 0) { clearInterval(fade); bgm.pause(); bgm.currentTime=0; bgm.volume=0.55; }
    }, 50);

    boot(); resume();
    const bpm=148, B=60/bpm, t0=AC.currentTime+0.5;
    const mel=[[F.D5,0.5],[F.Fs5,0.5],[F.A5,0.5],[F.D6,1],[0,0.5],[F.E6,0.5],[F.D6,0.5],[F.C6,0.5],[F.B5,0.5],
               [F.A5,0.5],[F.G5,0.5],[F.Fs5,0.5],[F.E5,0.5],[F.D5,2],[0,1],
               [F.Fs5,0.5],[F.G5,0.5],[F.A5,0.5],[F.B5,0.5],[F.A5,0.5],[F.G5,0.5],[F.Fs5,1],
               [F.E5,0.5],[F.Fs5,0.5],[F.G5,0.5],[F.A5,0.5],[F.D6,3]];
    const har=[[F.A4,0.5],[F.D5,0.5],[F.Fs5,0.5],[F.A5,1],[0,0.5],[F.C6,0.5],[F.B5,0.5],[F.A5,0.5],[F.G5,0.5],
               [F.Fs5,0.5],[F.E5,0.5],[F.D5,0.5],[F.C5,0.5],[F.D5,2],[0,1],
               [F.D5,0.5],[F.E5,0.5],[F.Fs5,0.5],[F.G5,0.5],[F.Fs5,0.5],[F.E5,0.5],[F.D5,1],
               [F.C5,0.5],[F.D5,0.5],[F.E5,0.5],[F.Fs5,0.5],[F.A5,3]];
    const bas=[[F.D3,1],[F.A2,1],[F.G3,1],[F.D3,1],[F.G2,1],[F.E3,1],[F.D3,1],[F.A3,1],[F.D3,2],[0,1],
               [F.B2,1],[F.E3,1],[F.Fs3,1],[F.G3,1],[F.A2,1],[F.D3,1],[F.G3,1],[F.A3,1],
               [F.E3,1],[F.A2,1],[F.D3,1],[F.G3,1],[F.D3,3]];
    let tt=t0; for(const[f,b]of mel){if(f>0)note(f,tt,b*B*0.88,0.34,'square');tt+=b*B;}
    tt=t0; for(const[f,b]of har){if(f>0)note(f,tt,b*B*0.88,0.18,'square');tt+=b*B;}
    tt=t0; for(const[f,b]of bas){if(f>0)note(f,tt,b*B*0.88,0.46,'triangle');tt+=b*B;}
  }

  // ── Sound effects ───────────────────────────────────
  function sfxFire() {
    boot(); resume();
    const t = AC.currentTime;
    note(F.D5, t,      0.04, 0.24, 'square');
    note(F.Fs5,t+0.04, 0.04, 0.24, 'square');
    note(F.A5, t+0.08, 0.05, 0.26, 'square');
  }
  function sfxFreeze() {
    boot(); resume();
    const t = AC.currentTime;
    [F.D6,F.A5,F.F5,F.D5,F.A4,F.F4].forEach((f,i) =>
      note(f, t+i*0.05, 0.06, 0.20, 'square'));
  }
  function sfxCollectHeart() {
    boot(); resume();
    const t = AC.currentTime;
    [F.G4,F.B4,F.D5,F.G5].forEach((f,i) =>
      note(f, t+i*0.06, 0.07, 0.22, 'square'));
  }
  function sfxDie() {
    boot(); resume();
    const t = AC.currentTime;
    [F.A5,F.G5,F.F5,F.Ds5,F.D5,F.C5,F.B4,F.A4].forEach((f,i) =>
      note(f, t+i*0.065, 0.08, 0.26, 'square'));
  }
  function sfxPush() {
    boot(); resume();
    const t = AC.currentTime;
    note(F.G3, t,      0.05, 0.22, 'square');
    note(F.F3, t+0.05, 0.06, 0.16, 'square');
  }
  function sfxOpenChest() {
    boot(); resume();
    const t = AC.currentTime;
    [F.C5,F.E5,F.G5,F.C6,F.E6,F.G6].forEach((f,i) =>
      note(f, t+i*0.055, 0.09, 0.24, 'square'));
  }

  return {
    init:boot, resume, stopMusic,
    playTitle, playGameplay, playLastHeart, playRoomClear, playGameOver, playWin,
    sfxFire, sfxFreeze, sfxCollectHeart, sfxDie, sfxPush, sfxOpenChest,
  };
})();

// ── Init ───────────────────────────────────────────────

window.addEventListener('resize',resizeCanvas);
drawTitleRozzle();
setupDpad();
resizeCanvas();
showScreen('title-screen');
updateContinueButton();

// Start title music on first user interaction
document.addEventListener('pointerdown', function startAudio() {
  Audio.init();
  Audio.resume();
  Audio.playTitle();
  document.removeEventListener('pointerdown', startAudio);
}, { once: true });

window.addEventListener('beforeunload',()=>{if(GS.phase==='play'||GS.phase==='clear'||GS.phase==='dead')saveProgress();});

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}




