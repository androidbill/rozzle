const rules = [
  ["Single 1", "100"],
  ["Single 5", "50"],
  ["Three 1s", "1,000"],
  ["Three 2s", "200"],
  ["Three 3s", "300"],
  ["Three 4s", "400"],
  ["Three 5s", "500"],
  ["Three 6s", "600"],
  ["Four, Five, or Six of a Kind", "Double each extra die"],
  ["Straight (1-2-3-4-5-6)", "1,500"],
  ["Three Pairs", "1,500"],
  ["Four of a Kind + Pair", "1,500"],
  ["Two Triplets", "2,500"],
];

const themes = [
  { group: "Table Classics", items: [
    ["classic", "Rozzle Classic", "Teal, ivory, and dice gold", ["#123c38", "#d9aa43", "#c85d49", "#2d7697"], "#17211f", "#596966", "#fffdf7"],
    ["evergreen", "Evergreen Brass", "Deep green with warm metal", ["#18443b", "#c49a3a", "#d56945", "#2f6f73"], "#17211d", "#607068", "#fbf8ee"],
    ["cranberry", "Cranberry Oak", "Red, tan, and warm wood", ["#8d2638", "#d6a94f", "#b7583f", "#4c7c82"], "#241414", "#705a55", "#fff9f4"],
    ["harbor", "Harbor Slate", "Blue-green and soft coral", ["#1d5b6c", "#d3a94d", "#cf765e", "#3c7fac"], "#10202b", "#526673", "#fbfeff"],
    ["moss", "Moss Linen", "Soft greens and old gold", ["#315d36", "#c9a33a", "#b96a4d", "#497c78"], "#172016", "#5c6b55", "#fffff7"],
  ]},
  { group: "Soft Color", items: [
    ["amethyst", "Amethyst Dusk", "Purple, mauve, and blue", ["#4b3b8f", "#c7a451", "#b85f82", "#4d89ad"], "#16142a", "#5d5972", "#fffaff"],
    ["ember", "Ember Clay", "Terracotta and honey", ["#8a4629", "#e0a43a", "#c75c45", "#3f7781"], "#251815", "#725d55", "#fff9f1"],
    ["sage", "Sage Mint", "Fresh greens and blue", ["#16725f", "#cbbd4a", "#c96b60", "#347fa0"], "#10231e", "#4f6b61", "#fbfffc"],
    ["plum", "Royal Plum", "Plum, gold, and berry", ["#3c2b72", "#c9a046", "#b85b77", "#3e78a8"], "#18162a", "#5c5875", "#fffaff"],
    ["rose", "Rose Quartz", "Pink, cream, and berry", ["#b84f82", "#d7b85a", "#d46673", "#5c93b5"], "#2a0920", "#7a4c69", "#fff9fd"],
    ["lavender", "Lavender Mist", "Soft violet and rose", ["#7a5cc7", "#d6b85a", "#d474ad", "#58a7c7"], "#1f1532", "#65527e", "#fff8ff"],
    ["desert", "Desert Sun", "Ochre, clay, and sky", ["#a85f2a", "#d8a735", "#c96a4d", "#4e87a5"], "#24160a", "#70533a", "#fffdf2"],
    ["sky", "Sky Candy", "Soft cyan and violet", ["#36a9c9", "#d8c75c", "#c970a6", "#7d73c9"], "#20213d", "#65678b", "#ffffff"],
  ]},
  { group: "Dark Tables", items: [
    ["polar", "Polar Night", "Dark navy and ice blue", ["#7eb6d9", "#d8c76a", "#d98274", "#5f9fc8"], "#eef5fb", "#a9b9c6", "#151d25"],
    ["teal-night", "Teal Nocturne", "Dark teal with aqua glow", ["#2dd4bf", "#f4c95d", "#ef7d66", "#5eb3c7"], "#eafaf7", "#a8c8c1", "#102723"],
    ["violet-night", "Violet Dusk", "Dark violet and orchid", ["#9b6fe8", "#d8b95a", "#d66e9d", "#6aa6c9"], "#f6efff", "#c9b8df", "#251b36"],
    ["cobalt", "Cobalt Night", "Dark blue and cyan", ["#44b3d8", "#d8bd5b", "#d97373", "#5e9fca"], "#eef9ff", "#a9c8d9", "#0d2438"],
    ["emerald-night", "Emerald Night", "Dark green and chartreuse", ["#78c95f", "#d6d85b", "#d9795c", "#5ab8a5"], "#f4ffe8", "#bdd3b0", "#142313"],
    ["jade", "Jade Terminal", "Dark jade monochrome", ["#54c982", "#b8d96a", "#d57966", "#64b6a6"], "#eaffef", "#9bc6a4", "#07150c"],
    ["citrus", "Citrus Grove", "Lime, leaf, and lemon", ["#3b8c46", "#c9d94a", "#df8b4f", "#4c9a7d"], "#08140d", "#3d5b49", "#fbfff7"],
  ]},
];

const flatThemes = themes.flatMap((group) => group.items.map(([id, name, note, colors, ink, muted, panel]) => ({ id, name, note, colors, ink, muted, panel, group: group.group })));
const defaultState = { players: [], current: 0, started: false };
const state = loadState();
let installPrompt = null;
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const setupScreen = $("#setupScreen");
const gameScreen = $("#gameScreen");
const playerList = $("#playerList");
const playerForm = $("#playerForm");
const playerName = $("#playerName");
const startGame = $("#startGame");
const turnName = $("#turnName");
const turnScore = $("#turnScore");
const scoreInput = $("#scoreInput");
const scoreboard = $("#scoreboard");
const rulesGrid = $("#rulesGrid");
const fullRulesList = $("#fullRulesList");
const quickScores = $("#quickScores");
const themeSections = $("#themeSections");
const menuButton = $("#menuButton");
const appMenu = $("#appMenu");
const modalShade = $("#modalShade");
const toast = $("#toast");
const installCard = $("#installCard");
const installShortcut = $("#installShortcut");
const installMenuButton = $('[data-action="install"]');
const installHelp = $("#installHelp");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("rozzle-state") || "null");
    if (!saved || !Array.isArray(saved.players)) return structuredClone(defaultState);
    return {
      players: saved.players.map((p) => ({
        name: String(p.name || "").slice(0, 24),
        score: Number(p.score) || 0,
        turns: Array.isArray(p.turns) ? p.turns.map(Number).filter(Number.isFinite) : [],
      })).filter((p) => p.name),
      current: Number(saved.current) || 0,
      started: Boolean(saved.started && saved.players.length),
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem("rozzle-state", JSON.stringify(state));
}

function themeId() {
  const saved = localStorage.getItem("rozzle-theme") || "classic";
  return flatThemes.some((theme) => theme.id === saved) ? saved : "classic";
}

function applyTheme(id) {
  const next = flatThemes.some((theme) => theme.id === id) ? id : "classic";
  document.body.dataset.theme = next;
  localStorage.setItem("rozzle-theme", next);
  renderThemes();
}

function renderRules() {
  rulesGrid.innerHTML = rules.map(([name, points]) => `<div class="rule"><b>${name}</b><span>${points}</span></div>`).join("");
  fullRulesList.innerHTML = rules.map(([name, points]) => `<li>${name}: ${points} points</li>`).join("");
}

function renderQuickScores() {
  quickScores.innerHTML = [50, 100, 200, 300, 500, 1000, 1500, 2500]
    .map((score) => `<button type="button" data-score="${score}">+${score}</button>`)
    .join("");
}

function renderThemes() {
  const selected = themeId();
  themeSections.innerHTML = themes.map((group) => `
    <section class="theme-section">
      <h3>${group.group}</h3>
      <div class="theme-grid">
        ${group.items.map(([id, name, note, colors, ink, muted, panel]) => `
          <button class="theme-choice" type="button" data-theme="${id}" aria-pressed="${id === selected}" style="--choice-text:${ink};--choice-muted:${muted};--choice-panel:${panel};--choice-border:${colors[0]}55;">
            <span><strong>${name}</strong><small>${note}</small></span>
            <span class="swatches" aria-hidden="true">${colors.map((color) => `<span style="background:${color}"></span>`).join("")}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function renderSetup() {
  startGame.disabled = state.players.length === 0;
  if (!state.players.length) {
    playerList.innerHTML = `<li class="empty">Add players in the order they will roll.</li>`;
    return;
  }
  playerList.innerHTML = state.players.map((player, index) => `
    <li class="setup-player">
      <span class="badge">${index + 1}</span>
      <span class="name">${player.name}</span>
      <span class="row-actions">
        <button class="mini" type="button" data-move="up" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Move ${player.name} earlier">↑</button>
        <button class="mini" type="button" data-move="down" data-index="${index}" ${index === state.players.length - 1 ? "disabled" : ""} aria-label="Move ${player.name} later">↓</button>
        <button class="mini" type="button" data-remove="${index}" aria-label="Remove ${player.name}">x</button>
      </span>
    </li>
  `).join("");
}

function renderScoreboard() {
  scoreboard.innerHTML = state.players.map((player, index) => `
    <article class="score-card ${index === state.current ? "active" : ""}">
      <span class="badge">${index + 1}</span>
      <span class="name">${player.name}</span>
      <div class="score-line">
        <strong>${player.score.toLocaleString()}</strong>
        <span>${player.turns.length ? `Last: ${player.turns.slice(-2).reverse().join(", ")}` : "No turns yet"}</span>
      </div>
    </article>
  `).join("");
}

function renderGame() {
  const player = state.players[state.current];
  if (!player) return;
  turnName.textContent = player.name;
  turnScore.textContent = player.score.toLocaleString();
  renderScoreboard();
}

function render() {
  setupScreen.hidden = state.started;
  gameScreen.hidden = !state.started;
  setupScreen.classList.toggle("is-hidden", state.started);
  gameScreen.classList.toggle("is-hidden", !state.started);
  renderSetup();
  if (state.started) renderGame();
  updateInstallUI();
}

function addPlayer(name) {
  const clean = name.trim();
  if (!clean) return;
  state.players.push({ name: clean, score: 0, turns: [] });
  saveState();
  render();
}

function recordTurn(points) {
  const player = state.players[state.current];
  const score = Number(points) || 0;
  player.score += score;
  player.turns.push(score);
  state.current = (state.current + 1) % state.players.length;
  scoreInput.value = "";
  saveState();
  render();
}

function resetGame() {
  state.started = false;
  state.current = 0;
  state.players = state.players.map((p) => ({ name: p.name, score: 0, turns: [] }));
  scoreInput.value = "";
  saveState();
  render();
}

function closeMenu() {
  appMenu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
}

function openDialog(dialog) {
  closeMenu();
  modalShade.hidden = false;
  dialog.showModal();
}

function closeDialogs() {
  modalShade.hidden = true;
  document.querySelectorAll("dialog").forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function updateInstallUI() {
  const dismissed = sessionStorage.getItem("rozzle-install-dismissed") === "true";
  const show = !state.started && !isStandalone() && !dismissed;
  installCard.hidden = !show;
  installMenuButton.hidden = isStandalone();
}

function installHelpText() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "On iPhone or iPad: tap the Safari Share button, then choose Add to Home Screen.";
  if (/android/.test(ua)) return "On Android: open Chrome's menu, then choose Install app or Add to Home screen.";
  return "Open your browser menu and choose Install app or Add to Home Screen.";
}

async function installApp() {
  closeMenu();
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installShortcut.hidden = true;
    updateInstallUI();
    return;
  }
  installHelp.textContent = installHelpText();
  openDialog($("#installDialog"));
}

async function shareApp() {
  closeMenu();
  const url = `${window.location.origin}${window.location.pathname}`;
  const data = { title: "Rozzle", text: "Rozzle is a Farkle / 10000 dice scorekeeper.", url };
  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast("Rozzle link copied");
  } catch {
    showToast("Share is not available here");
  }
}

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addPlayer(playerName.value);
  playerName.value = "";
  playerName.focus();
});

playerList.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  const move = event.target.closest("[data-move]");
  if (remove) {
    state.players.splice(Number(remove.dataset.remove), 1);
  }
  if (move) {
    const from = Number(move.dataset.index);
    const to = move.dataset.move === "up" ? from - 1 : from + 1;
    if (to >= 0 && to < state.players.length) {
      const [player] = state.players.splice(from, 1);
      state.players.splice(to, 0, player);
    }
  }
  saveState();
  render();
});

startGame.addEventListener("click", () => {
  if (!state.players.length) return;
  state.started = true;
  state.current = 0;
  saveState();
  render();
});

$("#newGame").addEventListener("click", resetGame);
$("#addScore").addEventListener("click", () => recordTurn(scoreInput.value));
$("#nextPlayer").addEventListener("click", () => recordTurn(0));
quickScores.addEventListener("click", (event) => {
  const button = event.target.closest("[data-score]");
  if (!button) return;
  scoreInput.value = (Number(scoreInput.value) || 0) + Number(button.dataset.score);
});

menuButton.addEventListener("click", () => {
  appMenu.hidden = !appMenu.hidden;
  menuButton.setAttribute("aria-expanded", String(!appMenu.hidden));
});

appMenu.addEventListener("click", (event) => {
  const dialogButton = event.target.closest("[data-dialog]");
  const actionButton = event.target.closest("[data-action]");
  if (dialogButton) openDialog($(`#${dialogButton.dataset.dialog}`));
  if (actionButton?.dataset.action === "share") shareApp();
});

themeSections.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme]");
  if (!button) return;
  applyTheme(button.dataset.theme);
});

document.addEventListener("click", (event) => {
  if (!appMenu.hidden && !event.target.closest(".menu-shell")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    modalShade.hidden = true;
  }
});
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", closeDialogs));
document.querySelectorAll("[data-action='install']").forEach((button) => button.addEventListener("click", installApp));
$("#dismissInstall").addEventListener("click", () => {
  sessionStorage.setItem("rozzle-install-dismissed", "true");
  updateInstallUI();
});
modalShade.addEventListener("click", closeDialogs);
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("close", () => { modalShade.hidden = true; }));

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installShortcut.hidden = false;
  updateInstallUI();
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installShortcut.hidden = true;
  sessionStorage.setItem("rozzle-install-dismissed", "true");
  updateInstallUI();
});
installShortcut.addEventListener("click", installApp);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}

renderRules();
renderQuickScores();
applyTheme(themeId());
render();
