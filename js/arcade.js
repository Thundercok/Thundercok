// ==========================================
// js/arcade.js - ARCADE MINIGAMES
// ==========================================

const gcvs = document.getElementById("game-canvas");
const gctx = gcvs ? gcvs.getContext("2d") : null;
const block = 20;
let score = 0,
  isGameOver = false;

function gc() {
  return {
    main: getComputedStyle(document.body).getPropertyValue("--sage").trim(),
    main2: getComputedStyle(document.body).getPropertyValue("--sage2").trim(),
    bg: "#000",
  };
}
function backToMenu() {
  if (window.currentGameInterval) clearInterval(window.currentGameInterval);
  window.currentGame = null;
  isGameOver = false;
  document.getElementById("go-screen").classList.remove("show");
  gcvs.style.display = "none";
  document.getElementById("arcade-menu").style.display = "flex";
  document.getElementById("game-title").textContent = "onc_arcade";
  document.getElementById("score-display").textContent = "0";
}
function triggerGO() {
  clearInterval(window.currentGameInterval);
  window.currentGameInterval = null;
  isGameOver = true;
  document.getElementById("final-score").textContent = score;
  document.getElementById("go-screen").classList.add("show");
}
function retryGame() {
  document.getElementById("go-screen").classList.remove("show");
  if (window.currentGame === "snake") startSnake();
  else if (window.currentGame === "doom") startDoom();
  else startTetris();
}

// --- SNAKE ---
let snake, food, sDir;
function startSnake() {
  document.getElementById("arcade-menu").style.display = "none";
  gcvs.style.display = "block";
  document.getElementById("game-title").textContent = "snake.exe";
  window.currentGame = "snake";
  score = 0;
  document.getElementById("score-display").textContent = score;
  isGameOver = false;
  snake = [{ x: 5 * block, y: 10 * block }];
  food = {
    x: Math.floor(Math.random() * (gcvs.width / block)) * block,
    y: Math.floor(Math.random() * (gcvs.height / block)) * block,
  };
  sDir = "RIGHT";
  if (window.currentGameInterval) clearInterval(window.currentGameInterval);
  window.currentGameInterval = setInterval(updateSnake, 100);
}
function updateSnake() {
  const c = gc();
  gctx.fillStyle = c.bg;
  gctx.fillRect(0, 0, gcvs.width, gcvs.height);
  for (let i = 0; i < snake.length; i++) {
    gctx.fillStyle = i === 0 ? c.main : c.main2;
    gctx.fillRect(snake[i].x, snake[i].y, block, block);
    gctx.strokeStyle = c.bg;
    gctx.strokeRect(snake[i].x, snake[i].y, block, block);
  }
  gctx.fillStyle = c.main;
  gctx.beginPath();
  gctx.arc(
    food.x + block / 2,
    food.y + block / 2,
    block / 2 - 2,
    0,
    Math.PI * 2,
  );
  gctx.fill();
  let hX = snake[0].x,
    hY = snake[0].y;
  if (sDir === "LEFT") hX -= block;
  if (sDir === "UP") hY -= block;
  if (sDir === "RIGHT") hX += block;
  if (sDir === "DOWN") hY += block;
  if (hX < 0) hX = gcvs.width - block;
  else if (hX >= gcvs.width) hX = 0;
  if (hY < 0) hY = gcvs.height - block;
  else if (hY >= gcvs.height) hY = 0;
  if (hX === food.x && hY === food.y) {
    score += 10;
    document.getElementById("score-display").textContent = score;
    food = {
      x: Math.floor(Math.random() * (gcvs.width / block)) * block,
      y: Math.floor(Math.random() * (gcvs.height / block)) * block,
    };
  } else {
    snake.pop();
  }
  let nh = { x: hX, y: hY };
  for (let i = 0; i < snake.length; i++) {
    if (hX === snake[i].x && hY === snake[i].y) {
      triggerGO();
      return;
    }
  }
  snake.unshift(nh);
}

// --- TETRIS ---
const COLS = 12,
  ROWS = 20;
let board = [],
  piece;
const TETS = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];
function newPiece() {
  const t = Math.floor(Math.random() * 7) + 1;
  piece = { matrix: TETS[t], x: Math.floor(COLS / 2) - 1, y: 0 };
}
function collide(m, px, py) {
  for (let r = 0; r < m.length; r++)
    for (let c = 0; c < m[r].length; c++)
      if (m[r][c] !== 0 && (board[py + r] && board[py + r][px + c]) !== 0)
        return true;
  return false;
}
function merge() {
  piece.matrix.forEach((row, y) =>
    row.forEach((v, x) => {
      if (v !== 0) board[piece.y + y][piece.x + x] = v;
    }),
  );
}
function clearLines() {
  let cl = 0;
  outer: for (let y = ROWS - 1; y >= 0; y--) {
    for (let x = 0; x < COLS; x++) if (board[y][x] === 0) continue outer;
    board.splice(y, 1)[0].fill(0);
    board.unshift(new Array(COLS).fill(0));
    y++;
    cl++;
  }
  if (cl > 0) {
    score += cl * 100;
    document.getElementById("score-display").textContent = score;
  }
}
function dropPiece() {
  piece.y++;
  if (collide(piece.matrix, piece.x, piece.y)) {
    piece.y--;
    merge();
    clearLines();
    newPiece();
    if (collide(piece.matrix, piece.x, piece.y)) triggerGO();
  }
}
function rotMat(m) {
  const r = [];
  for (let i = 0; i < m[0].length; i++) r.push(m.map((e) => e[i]).reverse());
  return r;
}
function startTetris() {
  document.getElementById("arcade-menu").style.display = "none";
  gcvs.style.display = "block";
  document.getElementById("game-title").textContent = "tetris.exe";
  window.currentGame = "tetris";
  score = 0;
  document.getElementById("score-display").textContent = score;
  isGameOver = false;
  board = [];
  for (let r = 0; r < ROWS; r++) board.push(new Array(COLS).fill(0));
  newPiece();
  if (window.currentGameInterval) clearInterval(window.currentGameInterval);
  window.currentGameInterval = setInterval(() => {
    drawTetris();
    dropPiece();
  }, 400);
  requestAnimationFrame(drawTetris);
}
function drawTetris() {
  if (window.currentGame !== "tetris") return;
  const c = gc();
  gctx.fillStyle = c.bg;
  gctx.fillRect(0, 0, gcvs.width, gcvs.height);
  for (let r = 0; r < ROWS; r++)
    for (let cc = 0; cc < COLS; cc++)
      if (board[r][cc] !== 0) {
        gctx.fillStyle = c.main2;
        gctx.fillRect(cc * block, r * block, block, block);
        gctx.strokeStyle = c.bg;
        gctx.strokeRect(cc * block, r * block, block, block);
      }
  if (piece)
    piece.matrix.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v !== 0) {
          gctx.fillStyle = c.main;
          gctx.fillRect(
            (piece.x + x) * block,
            (piece.y + y) * block,
            block,
            block,
          );
          gctx.strokeStyle = c.bg;
          gctx.strokeRect(
            (piece.x + x) * block,
            (piece.y + y) * block,
            block,
            block,
          );
        }
      }),
    );
}

// --- DOOM ---
const DOOM_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const DM_W = 16,
  DM_H = 16;
let dPlayer,
  dEnemies,
  dKeys = {},
  dShootCD = 0,
  dFlash = 0,
  dWave = 1;
function dmap(y, x) {
  return y < 0 || y >= DM_H || x < 0 || x >= DM_W ? 1 : DOOM_MAP[y][x];
}
function spawnWave(wave) {
  const pos = [
    [8, 8],
    [12, 3],
    [3, 12],
    [10, 10],
    [6, 11],
    [13, 7],
    [7, 13],
    [4, 4],
    [11, 5],
    [5, 11],
    [13, 2],
    [2, 13],
  ];
  const count = Math.min(3 + wave * 2, pos.length);
  return pos
    .slice(0, count)
    .map((p, i) => ({
      x: p[0] + 0.5,
      y: p[1] + 0.5,
      health: 2 + Math.floor(wave / 2),
      alive: true,
      type: i % 2,
    }));
}
function startDoom() {
  document.getElementById("arcade-menu").style.display = "none";
  gcvs.style.display = "block";
  document.getElementById("game-title").textContent = "doom.exe";
  window.currentGame = "doom";
  score = 0;
  dWave = 1;
  document.getElementById("score-display").textContent = 0;
  isGameOver = false;
  dPlayer = { x: 1.5, y: 1.5, angle: 0.6, health: 100 };
  dEnemies = spawnWave(1);
  dKeys = {};
  dShootCD = 0;
  dFlash = 0;
  if (window.currentGameInterval) clearInterval(window.currentGameInterval);
  window.currentGameInterval = setInterval(updateDoom, 33);
}
function updateDoom() {
  if (window.currentGame !== "doom") return;
  const SPEED = 0.065,
    ROTSPD = 0.058;
  const ca = Math.cos(dPlayer.angle),
    sa = Math.sin(dPlayer.angle);
  if (dKeys["w"] || dKeys["arrowup"]) {
    const nx = dPlayer.x + ca * SPEED,
      ny = dPlayer.y + sa * SPEED;
    if (!dmap(Math.floor(dPlayer.y), Math.floor(nx))) dPlayer.x = nx;
    if (!dmap(Math.floor(ny), Math.floor(dPlayer.x))) dPlayer.y = ny;
  }
  if (dKeys["s"] || dKeys["arrowdown"]) {
    const nx = dPlayer.x - ca * SPEED,
      ny = dPlayer.y - sa * SPEED;
    if (!dmap(Math.floor(dPlayer.y), Math.floor(nx))) dPlayer.x = nx;
    if (!dmap(Math.floor(ny), Math.floor(dPlayer.x))) dPlayer.y = ny;
  }
  if (dKeys["a"] || dKeys["arrowleft"]) dPlayer.angle -= ROTSPD;
  if (dKeys["d"] || dKeys["arrowright"]) dPlayer.angle += ROTSPD;
  if (dKeys[" "]) doomShoot();
  dEnemies.forEach((e) => {
    if (!e.alive) return;
    const dx = dPlayer.x - e.x,
      dy = dPlayer.y - e.y,
      dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.65 && dist < 13) {
      const spd = 0.013 + dWave * 0.002;
      const nx = e.x + (dx / dist) * spd,
        ny = e.y + (dy / dist) * spd;
      if (!dmap(Math.floor(e.y), Math.floor(nx))) e.x = nx;
      if (!dmap(Math.floor(ny), Math.floor(e.x))) e.y = ny;
    }
    if (dist < 0.65 && Math.random() < 0.025) {
      dPlayer.health -= 8;
      if (dPlayer.health <= 0) {
        dPlayer.health = 0;
        triggerGO();
      }
    }
  });
  if (dEnemies.every((e) => !e.alive)) {
    score += dWave * 200;
    dWave++;
    dEnemies = spawnWave(dWave);
    dPlayer.health = Math.min(100, dPlayer.health + 25);
    document.getElementById("score-display").textContent = score;
  }
  if (dShootCD > 0) dShootCD--;
  if (dFlash > 0) dFlash--;
  drawDoom();
}
function doomShoot() {
  if (dShootCD > 0) return;
  dShootCD = 13;
  dFlash = 4;
  let hit = false;
  dEnemies.forEach((e) => {
    if (!e.alive || hit) return;
    const dx = e.x - dPlayer.x,
      dy = e.y - dPlayer.y,
      dist = Math.sqrt(dx * dx + dy * dy);
    let ang = Math.atan2(dy, dx) - dPlayer.angle;
    while (ang > Math.PI) ang -= Math.PI * 2;
    while (ang < -Math.PI) ang += Math.PI * 2;
    if (Math.abs(ang) < 0.1 + 0.07 / dist && dist < 15) {
      hit = true;
      e.health--;
      if (e.health <= 0) {
        e.alive = false;
        score += 100;
        document.getElementById("score-display").textContent = score;
      }
    }
  });
}
function drawDoom() {
  const W = gcvs.width,
    H = gcvs.height,
    FOV = Math.PI / 3,
    HF = FOV / 2,
    zBuf = new Array(W);
  for (let y = 0; y < H / 2; y++) {
    const t = y / (H / 2),
      v = Math.floor(8 + t * 7);
    gctx.fillStyle = `rgb(${Math.floor(v * 0.4)},${v},${Math.floor(v * 0.4)})`;
    gctx.fillRect(0, y, W, 1);
  }
  for (let y = H / 2; y < H; y++) {
    const t = (y - H / 2) / (H / 2),
      v = Math.floor(10 - t * 4);
    gctx.fillStyle = `rgb(${Math.floor(v * 0.3)},${v},${Math.floor(v * 0.3)})`;
    gctx.fillRect(0, y, W, 1);
  }
  for (let col = 0; col < W; col++) {
    const ra = dPlayer.angle - HF + (col / W) * FOV,
      cosA = Math.cos(ra),
      sinA = Math.sin(ra);
    let mx = Math.floor(dPlayer.x),
      my = Math.floor(dPlayer.y);
    const ddx = Math.abs(1 / cosA),
      ddy = Math.abs(1 / sinA);
    let sx, sy, sdx, sdy;
    if (cosA < 0) {
      sx = -1;
      sdx = (dPlayer.x - mx) * ddx;
    } else {
      sx = 1;
      sdx = (mx + 1 - dPlayer.x) * ddx;
    }
    if (sinA < 0) {
      sy = -1;
      sdy = (dPlayer.y - my) * ddy;
    } else {
      sy = 1;
      sdy = (my + 1 - dPlayer.y) * ddy;
    }
    let hit = false,
      side = 0,
      iter = 0;
    while (!hit && iter++ < 32) {
      if (sdx < sdy) {
        sdx += ddx;
        mx += sx;
        side = 0;
      } else {
        sdy += ddy;
        my += sy;
        side = 1;
      }
      if (dmap(my, mx)) hit = true;
    }
    const perp = Math.max(0.001, side === 0 ? sdx - ddx : sdy - ddy);
    zBuf[col] = perp;
    const wh = Math.min(H * 2, Math.floor(H / perp)),
      wt = (H - wh) >> 1,
      br =
        Math.max(0.05, Math.min(1, 1 / (perp * 0.3 + 0.18))) *
        (side ? 0.5 : 1.0);
    const r = Math.floor(br * 50),
      g = Math.floor(br * 115),
      b = Math.floor(br * 50);
    gctx.fillStyle = `rgb(${r},${g},${b})`;
    gctx.fillRect(col, wt, 1, wh);
    if (wh > 4) {
      gctx.fillStyle = "rgba(0,0,0,0.07)";
      for (let sy2 = wt; sy2 < wt + wh; sy2 += 6) gctx.fillRect(col, sy2, 1, 1);
    }
  }
  dEnemies
    .filter((e) => e.alive)
    .map((e) => {
      const dx = e.x - dPlayer.x,
        dy = e.y - dPlayer.y;
      return { ...e, dx, dy, dist2: dx * dx + dy * dy };
    })
    .sort((a, b) => b.dist2 - a.dist2)
    .forEach((e) => {
      const dist = Math.sqrt(e.dist2);
      let sa = Math.atan2(e.dy, e.dx) - dPlayer.angle;
      while (sa > Math.PI) sa -= Math.PI * 2;
      while (sa < -Math.PI) sa += Math.PI * 2;
      if (Math.abs(sa) > HF + 0.5) return;
      const scx = Math.floor((W / 2) * (1 + sa / HF)),
        sh = Math.min(H * 1.5, Math.floor(H / Math.max(0.25, dist))),
        sw = Math.floor(sh * 0.75),
        st = (H - sh) >> 1,
        sl = scx - (sw >> 1);
      const body = e.type ? [155, 45, 15] : [175, 30, 30],
        dark = e.type ? [80, 22, 8] : [90, 15, 15];
      for (let c = 0; c < sw; c++) {
        const sc = sl + c;
        if (sc < 0 || sc >= W || dist >= zBuf[sc]) continue;
        const tx = c / sw;
        if (tx < 0.08 || tx > 0.92) continue;
        const bodyH = Math.floor(sh * 0.84),
          bodyY = st + Math.floor(sh * 0.08),
          col2 = tx < 0.15 || tx > 0.85 ? dark : body;
        gctx.fillStyle = `rgb(${col2[0]},${col2[1]},${col2[2]})`;
        gctx.fillRect(sc, bodyY, 1, bodyH);
        const ey = bodyY + Math.floor(sh * 0.18),
          eh = Math.max(1, Math.floor(sh * 0.16));
        if ((tx > 0.18 && tx < 0.36) || (tx > 0.64 && tx < 0.82)) {
          gctx.fillStyle = "#ffdd00";
          gctx.fillRect(sc, ey, 1, eh);
        }
        if (sh > 30 && c / sw > 0.78) {
          gctx.fillStyle = `rgb(${Math.floor(col2[0] * 0.7)},${Math.floor(col2[1] * 0.7)},${Math.floor(col2[2] * 0.7)})`;
          gctx.fillRect(
            sc,
            bodyY + bodyH - Math.floor(sh * 0.14),
            1,
            Math.floor(sh * 0.14),
          );
        }
      }
    });
  const now = Date.now(),
    bob =
      dKeys["w"] || dKeys["arrowup"] || dKeys["s"] || dKeys["arrowdown"]
        ? Math.sin(now / 140) * 3
        : 0;
  const gx = W / 2 - 8,
    gy = H - 52 + bob;
  gctx.fillStyle = "#344834";
  gctx.fillRect(gx, gy + 4, 16, 42);
  gctx.fillStyle = "#253425";
  gctx.fillRect(gx + 2, gy, 12, 7);
  gctx.fillStyle = "#1a2a1a";
  gctx.fillRect(gx + 5, gy - 2, 6, 3);
  if (dFlash > 0) {
    const fi = dFlash / 4;
    gctx.fillStyle = `rgba(255,180,50,${fi * 0.35})`;
    gctx.fillRect(0, H * 0.45, W, H * 0.55);
    gctx.fillStyle = "#ffcc44";
    gctx.fillRect(gx + 4, gy - 8, 8, 7);
    gctx.fillStyle = `rgba(255,220,100,${fi * 0.5})`;
    gctx.beginPath();
    gctx.arc(W / 2, H / 2, 12 * fi, 0, Math.PI * 2);
    gctx.fill();
  }
  gctx.strokeStyle = dFlash > 0 ? "#ffaa00" : "rgba(180,220,180,0.75)";
  gctx.lineWidth = 1;
  gctx.beginPath();
  gctx.moveTo(W / 2 - 7, H / 2);
  gctx.lineTo(W / 2 - 2, H / 2);
  gctx.moveTo(W / 2 + 2, H / 2);
  gctx.lineTo(W / 2 + 7, H / 2);
  gctx.moveTo(W / 2, H / 2 - 7);
  gctx.lineTo(W / 2, H / 2 - 2);
  gctx.moveTo(W / 2, H / 2 + 2);
  gctx.lineTo(W / 2, H / 2 + 7);
  gctx.stroke();
  gctx.fillStyle = "rgba(0,0,0,0.7)";
  gctx.fillRect(0, H - 17, W, 17);
  const hp = Math.max(0, dPlayer.health) / 100;
  gctx.fillStyle = hp > 0.5 ? "#2a7a3a" : hp > 0.25 ? "#7a7a20" : "#8a2020";
  gctx.fillRect(3, H - 13, Math.floor(W * 0.38 * hp), 9);
  gctx.strokeStyle = "#2a3a2a";
  gctx.lineWidth = 1;
  gctx.strokeRect(3, H - 13, W * 0.38, 9);
  gctx.fillStyle = "#7a9e7e";
  gctx.font = "8px DM Mono";
  gctx.textAlign = "left";
  gctx.fillText(`♥ ${dPlayer.health}`, 5, H - 4);
  gctx.fillStyle = "#5a7a5a";
  gctx.textAlign = "right";
  const alive = dEnemies.filter((e) => e.alive).length;
  gctx.fillText(`w${dWave} · ${alive} ☠`, W - 4, H - 4);
  gctx.textAlign = "left";
  const ms = 3,
    mo = 4,
    mmx = W - DM_W * ms - mo,
    mmy = mo;
  gctx.fillStyle = "rgba(0,0,0,0.45)";
  gctx.fillRect(mmx - 1, mmy - 1, DM_W * ms + 2, DM_H * ms + 2);
  DOOM_MAP.forEach((row, y) =>
    row.forEach((cell, x) => {
      gctx.fillStyle = cell ? "rgba(90,120,90,0.7)" : "rgba(20,30,20,0.5)";
      gctx.fillRect(mmx + x * ms, mmy + y * ms, ms - 1, ms - 1);
    }),
  );
  const fL = dPlayer.angle - HF,
    fR = dPlayer.angle + HF;
  gctx.strokeStyle = "rgba(212,148,74,0.4)";
  gctx.lineWidth = 1;
  gctx.beginPath();
  gctx.moveTo(mmx + dPlayer.x * ms, mmy + dPlayer.y * ms);
  gctx.lineTo(
    mmx + (dPlayer.x + Math.cos(fL) * 5) * ms,
    mmy + (dPlayer.y + Math.sin(fL) * 5) * ms,
  );
  gctx.moveTo(mmx + dPlayer.x * ms, mmy + dPlayer.y * ms);
  gctx.lineTo(
    mmx + (dPlayer.x + Math.cos(fR) * 5) * ms,
    mmy + (dPlayer.y + Math.sin(fR) * 5) * ms,
  );
  gctx.stroke();
  gctx.fillStyle = "#d4944a";
  gctx.fillRect(mmx + dPlayer.x * ms - 1, mmy + dPlayer.y * ms - 1, 3, 3);
  dEnemies
    .filter((e) => e.alive)
    .forEach((e) => {
      gctx.fillStyle = "#c47a7a";
      gctx.fillRect(mmx + e.x * ms - 1, mmy + e.y * ms - 1, 2, 2);
    });
}

document.addEventListener("keydown", (e) => {
  if (
    window.currentTab !== "arcade" ||
    isGameOver ||
    !window.currentGame ||
    document.activeElement.id === "cmd-input"
  )
    return;
  const k = e.key.toLowerCase();
  dKeys[k] = true;
  if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k))
    e.preventDefault();
  if (window.currentGame === "snake") {
    if ((k === "arrowleft" || k === "a") && sDir !== "RIGHT") sDir = "LEFT";
    else if ((k === "arrowup" || k === "w") && sDir !== "DOWN") sDir = "UP";
    else if ((k === "arrowright" || k === "d") && sDir !== "LEFT")
      sDir = "RIGHT";
    else if ((k === "arrowdown" || k === "s") && sDir !== "UP") sDir = "DOWN";
  } else if (window.currentGame === "tetris") {
    if (k === "arrowleft" || k === "a") {
      piece.x--;
      if (collide(piece.matrix, piece.x, piece.y)) piece.x++;
    } else if (k === "arrowright" || k === "d") {
      piece.x++;
      if (collide(piece.matrix, piece.x, piece.y)) piece.x--;
    } else if (k === "arrowdown" || k === "s") dropPiece();
    else if (k === "arrowup" || k === "w") {
      const rot = rotMat(piece.matrix);
      if (!collide(rot, piece.x, piece.y)) piece.matrix = rot;
    } else if (k === " ") {
      e.preventDefault();
      while (!collide(piece.matrix, piece.x, piece.y)) piece.y++;
      piece.y--;
      dropPiece();
    }
  }
});
document.addEventListener("keyup", (e) => {
  if (window.currentGame === "doom") dKeys[e.key.toLowerCase()] = false;
});
