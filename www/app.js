const menuBtns = document.querySelectorAll('.menu-btn');
const sections = document.querySelectorAll('.section');
const modBtns = document.querySelectorAll('.mod-btn');
const connectBtn = document.getElementById('connect-btn');
const statusText = document.getElementById('status-text');
const notification = document.getElementById('notification');
const autoInjectToggle = document.getElementById('auto-inject');

let gameConnected = false;
let gameInterval = null;
let gameWindow = null;

function findGameWindow() {
  try {
    // Busca la ventana del juego en todos los frames
    const frames = window.frames;
    for (let i = 0; i < frames.length; i++) {
      try {
        if (frames[i].window && frames[i].window.DL26) {
          return frames[i].window;
        }
      } catch (e) {
        continue;
      }
    }

    // Busca en el contexto actual
    if (window.DL26) {
      return window;
    }

    // Busca en el padre si existe
    if (window.parent && window.parent !== window && window.parent.DL26) {
      return window.parent;
    }

    return null;
  } catch (e) {
    return null;
  }
}

function injectMod(modName) {
  gameWindow = findGameWindow();

  if (!gameWindow) {
    showNotification("No se encontró el juego DL26", "error");
    return false;
  }

  try {
    if (typeof gameWindow.DL26 === 'undefined') {
      gameWindow.DL26 = {};
    }

    switch(modName) {
      case 'infmoney':
        gameWindow.DL26.money = 999999999;
        if (gameWindow.DL26.getMoney) {
          gameWindow.DL26.getMoney = function() { return 999999999; };
        }
        if (gameWindow.DL26.setMoney) {
          gameWindow.DL26.setMoney(999999999);
        }
        break;
      case 'unlockall':
        gameWindow.DL26.unlockedAll = true;
        if (gameWindow.DL26.isUnlocked) {
          gameWindow.DL26.isUnlocked = function() { return true; };
        }
        if (gameWindow.DL26.unlockAll) {
          gameWindow.DL26.unlockAll();
        }
        break;
      case 'godmode':
        gameWindow.DL26.godMode = true;
        if (gameWindow.DL26.canTakeDamage) {
          gameWindow.DL26.canTakeDamage = function() { return false; };
        }
        if (gameWindow.DL26.setGodMode) {
          gameWindow.DL26.setGodMode(true);
        }
        break;
      case 'speed':
        gameWindow.DL26.speedMultiplier = 2.0;
        if (gameWindow.DL26.getSpeed) {
          gameWindow.DL26.getSpeed = function() { return 2.0; };
        }
        if (gameWindow.DL26.setSpeed) {
          gameWindow.DL26.setSpeed(2.0);
        }
        break;
      case 'stamina':
        gameWindow.DL26.stamina = 9999;
        if (gameWindow.DL26.getStamina) {
          gameWindow.DL26.getStamina = function() { return 9999; };
        }
        if (gameWindow.DL26.setStamina) {
          gameWindow.DL26.setStamina(9999);
        }
        break;
      case 'skill':
        gameWindow.DL26.skillLevel = 99;
        if (gameWindow.DL26.getSkill) {
          gameWindow.DL26.getSkill = function() { return 99; };
        }
        if (gameWindow.DL26.setSkill) {
          gameWindow.DL26.setSkill(99);
        }
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
  gameWindow = findGameWindow();

  if (gameWindow) {
    gameConnected = true;
    statusText.textContent = "Conectado";
    statusText.style.color = "#00ff00";
    showNotification("Juego DL26 conectado", "success");

    if (autoInjectToggle.checked) {
      modBtns.forEach(btn => injectMod(btn.dataset.mod));
    }

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      const currentWindow = findGameWindow();
      if (currentWindow && currentWindow.DL26) {
        statusText.textContent = "Conectado";
        statusText.style.color = "#00ff00";
        gameConnected = true;
      } else {
        statusText.textContent = "Desconectado";
        statusText.style.color = "#ff0000";
        gameConnected = false;
      }
    }, 1000);
  } else {
    showNotification("No se encontró el juego. Ábrelo primero.", "error");
    gameConnected = false;
    statusText.textContent = "Desconectado";
    statusText.style.color = "#ff0000";
  }
}

menuBtns.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});

modBtns.forEach(btn => {
  btn.addEventListener('click', () => injectMod(btn.dataset.mod));
});

connectBtn.addEventListener('click', connectGame);

showSection('inicio');