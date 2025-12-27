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
function adjustArcadeSize(w, h) {
  const screen = document.querySelector(".arcade-screen");
  const header = document.querySelector(".arcade-header");
  if (screen) {
    screen.style.width = w + "px";
    screen.style.height = h + "px";
  }
  if (header) {
    header.style.width = w + "px";
  }
  if (gcvs) {
    gcvs.width = w;
    gcvs.height = h;
  }
}
function backToMenu() {
  if (window.currentGameInterval) clearInterval(window.currentGameInterval);
  window.currentGame = null;
  isGameOver = false;
  document.getElementById("go-screen").classList.remove("show");
  
  // Clean up DOS iframe
  const embed = document.getElementById("arcade-embed");
  if (embed) {
    embed.src = "";
    embed.style.display = "none";
  }
  
  gcvs.style.display = "none";
  document.getElementById("arcade-menu").style.display = "flex";
  document.getElementById("game-title").textContent = "onc_arcade";
  document.getElementById("score-display").textContent = "0";
  
  // Reset screen to menu size
  adjustArcadeSize(280, 460);
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
  else if (window.currentGame === "doom_shareware") startDoomShareware();
  else startTetris();
}

// --- SNAKE ---
let snake, food, sDir;
function startSnake() {
  adjustArcadeSize(240, 400);
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
  adjustArcadeSize(240, 400);
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
function startDoomShareware() {
  document.getElementById("arcade-menu").style.display = "none";
  gcvs.style.display = "none";
  const embed = document.getElementById("arcade-embed");
  if (embed) {
    embed.src = "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos&anonymous=1";
    embed.style.display = "block";
    embed.focus(); // Focus the iframe so the user can play immediately without clicking
  }
  document.getElementById("game-title").textContent = "doom_shareware.exe";
  window.currentGame = "doom_shareware";
  
  // Set aspect ratio for DOS Doom (widescreen retro 640x400)
  adjustArcadeSize(640, 400);
}

document.addEventListener("keydown", (e) => {
  if (
    window.currentTab !== "arcade" ||
    isGameOver ||
    !window.currentGame ||
    document.activeElement.id === "cmd-input"
  )
    return;
  if (window.currentGame === "doom_shareware") return;
  const k = e.key.toLowerCase();
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
