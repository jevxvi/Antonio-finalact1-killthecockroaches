const config = {
    gameDuration: 90,
    initialSpawnRate: 2000,
    spawnRateIncreaseInterval: 10000,
    spawnRateDecrease: 500,
    minSpawnRate: 500
};

let kills = 0;
let timeLeft = config.gameDuration;
let spawnRate = config.initialSpawnRate;
let gameStarted = false;
let isMuted = false;
let spawnInterval;

const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');
const killsDisplay = document.getElementById('kills');
const timerDisplay = document.getElementById('timer');
const bgMusic = document.getElementById('bg-music');
const killSound = document.getElementById('kill-sound');
const gameOverModal = document.getElementById('game-over-modal');
const gameOverMessage = document.getElementById('game-over-message');
const speedPromptModal = document.getElementById('speed-prompt-modal');
const speedPromptMessage = document.getElementById('speed-prompt-message');

window.addEventListener('online', () => alert('Back online!'));
window.addEventListener('offline', () => alert('No internet connection!'));

function toggleMute() {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    killSound.muted = isMuted;
    document.getElementById('mute-btn').textContent = isMuted ? '🔇' : '🔊';
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startScreen.style.display = 'none';
    header.style.display = 'flex';
    gameArea.style.display = 'block';
    footer.style.display = 'block';
    bgMusic.play();
    
    spawnCockroach();
    spawnInterval = setInterval(spawnCockroach, spawnRate);
    setInterval(increaseSpawnRate, config.spawnRateIncreaseInterval);
    startTimer();
}

function spawnCockroach() {
    const cockroach = document.createElement('div');
    cockroach.classList.add('cockroach');
    const maxX = gameArea.clientWidth - 60;
    const maxY = gameArea.clientHeight - 60;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    cockroach.style.left = `${x}px`;
    cockroach.style.top = `${y}px`;

    cockroach.addEventListener('click', () => killCockroach(cockroach));
    gameArea.appendChild(cockroach);

    setTimeout(() => {
        if (!cockroach.classList.contains('dead')) {
            cockroach.remove();
        }
    }, 5000);
}

function killCockroach(cockroach) {
    if (cockroach.classList.contains('dead')) return;
    cockroach.classList.add('dead');
    kills++;
    killsDisplay.textContent = `${kills} kills`;
    if (!isMuted) killSound.play();
    setTimeout(() => cockroach.remove(), 1000);
}

function increaseSpawnRate() {
    spawnRate = Math.max(config.minSpawnRate, spawnRate - config.spawnRateDecrease);
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnCockroach, spawnRate);
}

function showSpeedPrompt(message) {
    speedPromptMessage.textContent = message;
    speedPromptModal.style.display = 'block';
    setTimeout(() => {
        speedPromptModal.style.display = 'none';
    }, 2000);
}

function startTimer() {
    const timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft} sec`;

        if (timeLeft === 60) {
            showSpeedPrompt('60 seconds left! Speed up!');
        } else if (timeLeft === 30) {
            showSpeedPrompt('30 seconds remaining! Hurry!');
        } else if (timeLeft === 10) {
            showSpeedPrompt('Only 10 seconds left! Go fast!');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(spawnInterval);
            gameOverModal.style.display = 'block';
            gameOverMessage.textContent = `You killed ${kills} cockroaches!`;
        }
    }, 1000);
}

function restartGame() {
    location.reload();
}