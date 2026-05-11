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

const state = {
  players: [],
  currentIndex: 0,
  started: false,
};

const setupScreen = document.querySelector("#setupScreen");
const gameScreen = document.querySelector("#gameScreen");
const playerList = document.querySelector("#playerList");
const addPlayerForm = document.querySelector("#addPlayerForm");
const playerNameInput = document.querySelector("#playerName");
const startGameButton = document.querySelector("#startGameButton");
const currentPlayerName = document.querySelector("#currentPlayerName");
const currentPlayerScore = document.querySelector("#currentPlayerScore");
const scoreInput = document.querySelector("#scoreInput");
const addScoreButton = document.querySelector("#addScoreButton");
const farkleButton = document.querySelector("#farkleButton");
const scorecard = document.querySelector("#scorecard");
const rulesGrid = document.querySelector("#rulesGrid");
const installButton = document.querySelector("#installButton");
const newGameButton = document.querySelector("#newGameButton");
const menuButton = document.querySelector("#menuButton");
const appMenu = document.querySelector("#appMenu");
const dialogBackdrop = document.querySelector("#dialogBackdrop");
const dialogs = Array.from(document.querySelectorAll(".info-dialog"));
const themeGrid = document.querySelector("#themeGrid");
const shareButton = document.querySelector("#shareButton");
const installMenuButton = document.querySelector("#installMenuButton");
const installDialog = document.querySelector("#installDialog");
const installHelpText = document.querySelector("#installHelpText");
const installNudge = document.querySelector("#installNudge");
const installNudgeButton = document.querySelector("#installNudgeButton");
const dismissInstallNudge = document.querySelector("#dismissInstallNudge");
const toast = document.querySelector("#toast");

const themes = [
  { id: "rozzle-classic", name: "Rozzle Classic", note: "Teal, ivory, and dice gold", colors: ["#143d3a", "#e7b648", "#d85b4a", "#276d99"], ink: "#17211f", muted: "#596966", panel: "#fffdf6" },
  { id: "midnight-table", name: "Evergreen Brass", note: "Deep green with warm metal", colors: ["#18443b", "#c49a3a", "#d56945", "#2f6f73"], ink: "#17211d", muted: "#607068", panel: "#fbf8ee" },
  { id: "ruby-roll", name: "Cranberry Oak", note: "Red, tan, and warm wood", colors: ["#8d2638", "#d6a94f", "#b7583f", "#4c7c82"], ink: "#241414", muted: "#705a55", panel: "#fff9f4" },
  { id: "lakehouse", name: "Harbor Slate", note: "Blue-green and soft coral", colors: ["#1d5b6c", "#d3a94d", "#cf765e", "#3c7fac"], ink: "#10202b", muted: "#526673", panel: "#fbfeff" },
  { id: "arcade", name: "Amethyst Dusk", note: "Purple, mauve, and blue", colors: ["#4b3b8f", "#c7a451", "#b85f82", "#4d89ad"], ink: "#16142a", muted: "#5d5972", panel: "#fffaff" },
  { id: "forest-gold", name: "Moss Linen", note: "Soft greens and old gold", colors: ["#315d36", "#c9a33a", "#b96a4d", "#497c78"], ink: "#172016", muted: "#5c6b55", panel: "#fffff7" },
  { id: "black-ice", name: "Polar Night", note: "Dark navy and ice blue", colors: ["#7eb6d9", "#d8c76a", "#d98274", "#5f9fc8"], ink: "#eef5fb", muted: "#a9b9c6", panel: "#151d25" },
  { id: "sunset", name: "Ember Clay", note: "Terracotta and honey", colors: ["#8a4629", "#e0a43a", "#c75c45", "#3f7781"], ink: "#251815", muted: "#725d55", panel: "#fff9f1" },
  { id: "mint-chip", name: "Sage Mint", note: "Fresh greens and blue", colors: ["#16725f", "#cbbd4a", "#c96b60", "#347fa0"], ink: "#10231e", muted: "#4f6b61", panel: "#fbfffc" },
  { id: "royal-dice", name: "Royal Plum", note: "Plum, gold, and berry", colors: ["#3c2b72", "#c9a046", "#b85b77", "#3e78a8"], ink: "#18162a", muted: "#5c5875", panel: "#fffaff" },
  { id: "neon-night", name: "Teal Nocturne", note: "Dark teal with aqua glow", colors: ["#2dd4bf", "#f4c95d", "#ef7d66", "#5eb3c7"], ink: "#eafaf7", muted: "#a8c8c1", panel: "#102723" },
  { id: "laser-lime", name: "Citrus Grove", note: "Lime, leaf, and lemon", colors: ["#3b8c46", "#c9d94a", "#df8b4f", "#4c9a7d"], ink: "#08140d", muted: "#3d5b49", panel: "#fbfff7" },
  { id: "cyber-grape", name: "Violet Dusk", note: "Dark violet and orchid", colors: ["#9b6fe8", "#d8b95a", "#d66e9d", "#6aa6c9"], ink: "#f6efff", muted: "#c9b8df", panel: "#251b36" },
  { id: "electric-blue", name: "Cobalt Night", note: "Dark blue and cyan", colors: ["#44b3d8", "#d8bd5b", "#d97373", "#5e9fca"], ink: "#eef9ff", muted: "#a9c8d9", panel: "#0d2438" },
  { id: "hot-pink", name: "Rose Quartz", note: "Pink, cream, and berry", colors: ["#b84f82", "#d7b85a", "#d46673", "#5c93b5"], ink: "#2a0920", muted: "#7a4c69", panel: "#fff9fd" },
  { id: "toxic-arcade", name: "Emerald Night", note: "Dark green and chartreuse", colors: ["#78c95f", "#d6d85b", "#d9795c", "#5ab8a5"], ink: "#f4ffe8", muted: "#bdd3b0", panel: "#142313" },
  { id: "vaporwave", name: "Lavender Mist", note: "Soft violet and rose", colors: ["#7a5cc7", "#d6b85a", "#d474ad", "#58a7c7"], ink: "#1f1532", muted: "#65527e", panel: "#fff8ff" },
  { id: "solar-flare", name: "Desert Sun", note: "Ochre, clay, and sky", colors: ["#a85f2a", "#d8a735", "#c96a4d", "#4e87a5"], ink: "#24160a", muted: "#70533a", panel: "#fffdf2" },
  { id: "matrix", name: "Jade Terminal", note: "Dark jade monochrome", colors: ["#54c982", "#b8d96a", "#d57966", "#64b6a6"], ink: "#eaffef", muted: "#9bc6a4", panel: "#07150c" },
  { id: "candy-pop", name: "Sky Candy", note: "Soft cyan and violet", colors: ["#36a9c9", "#d8c75c", "#c970a6", "#7d73c9"], ink: "#20213d", muted: "#65678b", panel: "#ffffff" },
];

let currentTheme = localStorage.getItem("rozzle-theme") || "rozzle-classic";

let installPrompt = null;
let toastTimer = null;

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function saveState() {
  localStorage.setItem("rozzle-state", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("rozzle-state");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.players)) {
      state.players = parsed.players.map((player) => ({
        name: String(player.name || "").slice(0, 24),
        score: Number(player.score) || 0,
        turns: Array.isArray(player.turns) ? player.turns.map(Number).filter(Number.isFinite) : [],
      })).filter((player) => player.name);
      state.currentIndex = Number(parsed.currentIndex) || 0;
      state.started = Boolean(parsed.started && state.players.length);
    }
  } catch {
    localStorage.removeItem("rozzle-state");
  }
}

function renderRules() {
  rulesGrid.innerHTML = rules.map(([name, points]) => `
    <div class="rule-row">
      <span class="rule-name">${name}</span>
      <span class="rule-points">${points}</span>
    </div>
  `).join("");
}

function applyTheme(themeId) {
  const theme = themes.some((item) => item.id === themeId) ? themeId : "rozzle-classic";
  currentTheme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem("rozzle-theme", theme);
  renderThemes();
}

function renderThemes() {
  if (!themeGrid) return;

  themeGrid.innerHTML = themes.map((theme) => `
    <button
      class="theme-choice"
      type="button"
      data-theme="${theme.id}"
      aria-pressed="${theme.id === currentTheme}"
      style="--theme-ink: ${theme.ink}; --theme-muted: ${theme.muted}; --theme-panel: ${theme.panel};"
    >
      <span>
        <span class="theme-name">${theme.name}</span>
        <span class="theme-note">${theme.note}</span>
      </span>
      <span class="theme-swatches" aria-hidden="true">
        ${theme.colors.map((color) => `<span style="background: ${color};"></span>`).join("")}
      </span>
    </button>
  `).join("");
}

function renderSetup() {
  if (!state.players.length) {
    playerList.innerHTML = '<li class="empty">Add players in the order they will roll.</li>';
    startGameButton.disabled = true;
    return;
  }

  startGameButton.disabled = false;
  playerList.innerHTML = state.players.map((player, index) => `
    <li class="player-item">
      <span class="order-number">${index + 1}</span>
      <span class="player-name">${player.name}</span>
      <span class="player-controls">
        <button class="mini-button" type="button" data-action="up" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Move ${player.name} earlier">↑</button>
        <button class="mini-button" type="button" data-action="down" data-index="${index}" ${index === state.players.length - 1 ? "disabled" : ""} aria-label="Move ${player.name} later">↓</button>
        <button class="mini-button" type="button" data-action="remove" data-index="${index}" aria-label="Remove ${player.name}">×</button>
      </span>
    </li>
  `).join("");
}

function renderScorecard() {
  scorecard.innerHTML = state.players.map((player, index) => {
    const recentTurns = player.turns.slice(-3).reverse();
    const history = recentTurns.length ? `Last: ${recentTurns.join(", ")}` : "No turns yet";
    return `
      <div class="player-score ${index === state.currentIndex ? "active" : ""}">
        <span class="order-number">${index + 1}</span>
        <span class="player-name">${player.name}</span>
        <span class="score-stack">
          <strong>${player.score.toLocaleString()}</strong>
          <span class="history">${history}</span>
        </span>
      </div>
    `;
  }).join("");
}

function renderGame() {
  const currentPlayer = state.players[state.currentIndex];
  if (!currentPlayer) return;

  currentPlayerName.textContent = currentPlayer.name;
  currentPlayerScore.textContent = currentPlayer.score.toLocaleString();
  renderScorecard();
}

function render() {
  setupScreen.classList.toggle("is-hidden", state.started);
  gameScreen.classList.toggle("is-hidden", !state.started);
  setupScreen.hidden = state.started;
  gameScreen.hidden = !state.started;
  renderRules();
  renderSetup();
  if (state.started) renderGame();
  updateInstallUI();
}

function closeMenu() {
  appMenu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
}

function openDialog(dialog) {
  closeMenu();
  dialogBackdrop.hidden = false;
  dialog.showModal();
}

function closeDialogs() {
  dialogBackdrop.hidden = true;
  dialogs.forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function updateInstallUI() {
  const dismissed = sessionStorage.getItem("rozzle-install-dismissed") === "true";
  const shouldShow = !state.started && !isStandalone() && !dismissed;
  installNudge.hidden = !shouldShow;
  installMenuButton.hidden = isStandalone();
}

async function shareApp() {
  closeMenu();
  const shareData = {
    title: "Rozzle",
    text: "Rozzle is a Farkle / 10000 dice scorekeeper.",
    url: window.location.origin + window.location.pathname,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    showToast("Rozzle link copied");
  } catch {
    showToast("Share is not available here");
  }
}

function getInstallHelp() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    return "On iPhone or iPad: tap the Safari Share button, then choose Add to Home Screen.";
  }
  if (/android/.test(ua)) {
    return "On Android: open Chrome's menu, then choose Install app or Add to Home screen.";
  }
  return "Open your browser menu and choose Install app or Add to Home Screen.";
}

async function installApp() {
  closeMenu();
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
    updateInstallUI();
    return;
  }

  installHelpText.textContent = getInstallHelp();
  openDialog(installDialog);
}

function addPlayer(name) {
  const cleanName = name.trim();
  if (!cleanName) return;

  state.players.push({ name: cleanName, score: 0, turns: [] });
  saveState();
  renderSetup();
}

function movePlayer(from, to) {
  if (to < 0 || to >= state.players.length) return;
  const [player] = state.players.splice(from, 1);
  state.players.splice(to, 0, player);
  saveState();
  renderSetup();
}

function nextPlayer() {
  state.currentIndex = (state.currentIndex + 1) % state.players.length;
  scoreInput.value = "";
  saveState();
  renderGame();
}

function recordTurn(points) {
  const currentPlayer = state.players[state.currentIndex];
  const score = Number(points) || 0;
  currentPlayer.score += score;
  currentPlayer.turns.push(score);
  nextPlayer();
}

addPlayerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addPlayer(playerNameInput.value);
  playerNameInput.value = "";
  playerNameInput.focus();
});

playerList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  if (button.dataset.action === "remove") {
    state.players.splice(index, 1);
    saveState();
    renderSetup();
  }
  if (button.dataset.action === "up") movePlayer(index, index - 1);
  if (button.dataset.action === "down") movePlayer(index, index + 1);
});

startGameButton.addEventListener("click", () => {
  if (!state.players.length) return;
  state.started = true;
  state.currentIndex = 0;
  saveState();
  render();
});

addScoreButton.addEventListener("click", () => {
  recordTurn(scoreInput.value);
});

farkleButton.addEventListener("click", () => {
  recordTurn(0);
});

newGameButton.addEventListener("click", () => {
  state.started = false;
  state.currentIndex = 0;
  state.players = state.players.map((player) => ({
    name: player.name,
    score: 0,
    turns: [],
  }));
  scoreInput.value = "";
  saveState();
  render();
});

document.querySelector(".quick-scores").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-score]");
  if (!button) return;
  const current = Number(scoreInput.value) || 0;
  scoreInput.value = current + Number(button.dataset.score);
});

themeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-theme]");
  if (!button) return;
  applyTheme(button.dataset.theme);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
  updateInstallUI();
});

installButton.addEventListener("click", async () => {
  installApp();
});

installNudgeButton.addEventListener("click", installApp);

dismissInstallNudge.addEventListener("click", () => {
  sessionStorage.setItem("rozzle-install-dismissed", "true");
  updateInstallUI();
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installButton.hidden = true;
  sessionStorage.setItem("rozzle-install-dismissed", "true");
  updateInstallUI();
});

menuButton.addEventListener("click", () => {
  const isOpen = !appMenu.hidden;
  appMenu.hidden = isOpen;
  menuButton.setAttribute("aria-expanded", String(!isOpen));
});

appMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-dialog]");
  if (!button) return;
  const dialog = document.querySelector(`#${button.dataset.dialog}`);
  if (dialog) openDialog(dialog);
});

shareButton.addEventListener("click", shareApp);
installMenuButton.addEventListener("click", installApp);

dialogBackdrop.addEventListener("click", closeDialogs);

dialogs.forEach((dialog) => {
  dialog.addEventListener("close", () => {
    dialogBackdrop.hidden = true;
  });
});

document.addEventListener("click", (event) => {
  if (appMenu.hidden) return;
  if (event.target.closest(".menu-wrap")) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    dialogBackdrop.hidden = true;
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

loadState();
applyTheme(currentTheme);
render();
updateInstallUI();
