const menuBtns = document.querySelectorAll('.menu-btn');
const sections = document.querySelectorAll('.section');
const modBtns = document.querySelectorAll('.mod-btn');
const connectBtn = document.getElementById('connect-btn');
const statusText = document.getElementById('status-text');
const notification = document.getElementById('notification');
const autoInjectToggle = document.getElementById('auto-inject');

let gameConnected = false;
let gameInterval = null;

// Funciones de inyección de mods
function injectMod(modName) {
  if (!gameConnected) {
    showNotification("Conecta el juego primero", "error");
    return false;
  }

  try {
    // Simulación de inyección en el juego
    if (typeof window.DL26 === 'undefined') {
      window.DL26 = {};
    }

    switch(modName) {
      case 'infmoney':
        window.DL26.money = 999999999;
        window.DL26.getMoney = function() { return 999999999; };
        break;
      case 'unlockall':
        window.DL26.unlockedAll = true;
        window.DL26.isUnlocked = function() { return true; };
        break;
      case 'godmode':
        window.DL26.godMode = true;
        window.DL26.canTakeDamage = function() { return false; };
        break;
      case 'speed':
        window.DL26.speedMultiplier = 2.0;
        window.DL26.getSpeed = function() { return 2.0; };
        break;
      case 'stamina':
        window.DL26.stamina = 9999;
        window.DL26.getStamina = function() { return 9999; };
        break;
      case 'skill':
        window.DL26.skillLevel = 99;
        window.DL26.getSkill = function() { return 99; };
        break;
    }

    showNotification(`Mod "${modName}" activado`, "success");
    return true;
  } catch (e) {
    showNotification(`Error: ${e.message}`, "error");
    return false;
  }
}

function showNotification(message, type = "info") {
  notification.textContent = message;
  notification.className = type;
  notification.classList.remove('hidden');

  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

function showSection(sectionId) {
  sections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  menuBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.section === sectionId) {
      btn.classList.add('active');
    }
  });
}

function connectGame() {
  if (gameConnected) {
    showNotification("Juego ya conectado", "info");
    return;
  }

  // Simular conexión al juego
  gameConnected = true;
  statusText.textContent = "Conectado";
  statusText.style.color = "#00ff00";
  showNotification("Juego DL26 conectado", "success");

  // Verificar inyección automática
  if (autoInjectToggle.checked) {
    modBtns.forEach(btn => injectMod(btn.dataset.mod));
  }

  // Iniciar verificación periódica
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    if (typeof window.DL26 !== 'undefined') {
      statusText.textContent = "Conectado";
      statusText.style.color = "#00ff00";
    } else {
      statusText.textContent = "Desconectado";
      statusText.style.color = "#ff0000";
      gameConnected = false;
    }
  }, 1000);
}

// Event listeners
menuBtns.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});

modBtns.forEach(btn => {
  btn.addEventListener('click', () => injectMod(btn.dataset.mod));
});

connectBtn.addEventListener('click', connectGame);

// Inicializar
showSection('inicio');