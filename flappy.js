// === CONFIGURATION DU JEU ===
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('flappy-score');
const statusEl = document.getElementById('flappy-status');
const overlayEl = document.getElementById('flappy-overlay');

// Dimensions du Canvas (doivent correspondre au HTML)
const CV_WIDTH = 320;
const CV_HEIGHT = 480;

// Physique et Gameplay
const GRAVITY = 0.25;
const FLAP_STRENGTH = -5;
const PIPE_SPEED = 2;
const PIPE_GAP = 120; // Espace vertical entre les tuyaux
const PIPE_WIDTH = 52;  // Largeur standard d'un tuyau Flappy

// === CHARGEMENT DES IMAGES ===
let imagesLoaded = 0;
const totalImages = 3;

// 1. Fond personnalisé
const imgBack = new Image();
imgBack.src = 'img/flappy-back.jpg';
imgBack.onload = checkImagesLoaded;

// 2. Avatar personnalisé (ta photo)
const imgAvatar = new Image();
imgAvatar.src = 'img/flappy-avatar.jpg'; // Changé en .jpg
imgAvatar.onload = checkImagesLoaded;

// 3. Tuyau vert original
const imgPipe = new Image();
imgPipe.src = 'img/pipe-green.jpg'; // Changé en .jpg
imgPipe.onload = checkImagesLoaded;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        console.log("✅ Toutes les images Flappy sont chargées.");
    }
}

// === ÉTATS ET VARIABLES DU JEU ===
let gameState = 'standby'; // standby, playing, gameover
let bird = { x: 50, y: CV_HEIGHT / 2, vy: 0, radius: 15 };
let pipes = [];
let score = 0;
let loopId;

// === FONCTIONS PRINCIPALES ===

// Lance une nouvelle partie
function startFlappy() {
    if (gameState === 'playing') return;
    
    resetGame();
    gameState = 'playing';
    overlayEl.classList.add('opacity-0', 'pointer-events-none'); // Cache l'overlay
    canvas.focus(); // Donne le focus pour capter les clics/touches
    
    loopId = requestAnimationFrame(gameLoop);
}

// Réinitialise les variables
function resetGame() {
    bird = { x: 50, y: CV_HEIGHT / 2, vy: 0, radius: 18 }; // Légèrement plus grand pour la photo
    pipes = [];
    score = 0;
    scoreEl.innerText = score;
    cancelAnimationFrame(loopId);
}

// Game Over
function gameOver() {
    gameState = 'gameover';
    statusEl.innerText = 'Game Over !';
    overlayEl.querySelector('button').innerText = 'Rejouer';
    overlayEl.classList.remove('opacity-0', 'pointer-events-none'); // Affiche l'overlay
}

// Boucle principale de dessin et mise à jour
function gameLoop() {
    if (gameState !== 'playing') return;

    updatePhysics();
    drawAll();

    loopId = requestAnimationFrame(gameLoop);
}

// === MISE À JOUR DE LA LOGIQUE (PHYSIQUE & COLLISIONS) ===
function updatePhysics() {
    // Gravité sur l'oiseau
    bird.vy += GRAVITY;
    bird.y += bird.vy;

    // Gestion des tuyaux
    if (pipes.length === 0 || pipes[pipes.length - 1].x < CV_WIDTH - 150) {
        spawnPipe();
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= PIPE_SPEED; // Déplacement vers la gauche

        // Collision avec les tuyaux
        if (checkCollision(bird, pipe)) {
            gameOver();
        }

        // Incrémentation du score
        if (!pipe.passed && bird.x > pipe.x + PIPE_WIDTH) {
            score++;
            scoreEl.innerText = score;
            pipe.passed = true;
        }

        // Supprime les tuyaux hors écran
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.splice(index, 1);
        }
    });

    // Collision avec le sol ou le plafond
    if (bird.y + bird.radius > CV_HEIGHT || bird.y - bird.radius < 0) {
        gameOver();
    }
}

// === DESSIN SUR LE CANVAS ===
function drawAll() {
    // Nettoie le canvas
    ctx.clearRect(0, 0, CV_WIDTH, CV_HEIGHT);

    // 1. Dessine le Fond personnalisé
    if (imgBack.complete) {
        ctx.drawImage(imgBack, 0, 0, CV_WIDTH, CV_HEIGHT);
    } else {
        ctx.fillStyle = '#87CEEB'; // Ciel bleu par défaut si l'image charge pas
        ctx.fillRect(0, 0, CV_WIDTH, CV_HEIGHT);
    }

    // 2. Dessine les Tuyaux (img/pipe-green.png)
    if (imgPipe.complete) {
        pipes.forEach(pipe => {
            // Tuyau du HAUT (retourné)
            ctx.save();
            ctx.translate(pipe.x + PIPE_WIDTH / 2, pipe.top);
            ctx.scale(1, -1); // Retourne l'image verticalement
            ctx.drawImage(imgPipe, -PIPE_WIDTH / 2, 0, PIPE_WIDTH, pipe.top);
            ctx.restore();

            // Tuyau du BAS (normal)
            ctx.drawImage(imgPipe, pipe.x, pipe.bottom, PIPE_WIDTH, CV_HEIGHT - pipe.bottom);
        });
    }

    // 3. Dessine l'Oiseau / Avatar (img/flappy-avatar.png)
    if (imgAvatar.complete) {
        // Dessine la photo dans un cercle pour le style
        ctx.save();
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip(); // Coupe tout ce qui dépasse du cercle
        
        // Dessine l'image centrée sur la position de l'oiseau
        ctx.drawImage(imgAvatar, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
        ctx.restore();
        
        // Optionnel : Ajoute une petite bordure blanche autour de la photo
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// === FONCTIONS UTILITAIRES ===

// Fait sauter l'oiseau
function flap() {
    if (gameState === 'playing') {
        bird.vy = FLAP_STRENGTH;
    }
}

// Crée une nouvelle paire de tuyaux
function spawnPipe() {
    const minTop = 50;
    const maxTop = CV_HEIGHT - PIPE_GAP - 50;
    const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    pipes.push({
        x: CV_WIDTH,
        top: topHeight,
        bottom: topHeight + PIPE_GAP,
        passed: false
    });
}

// Vérifie les collisions (AABB modifiée pour le cercle)
function checkCollision(bird, pipe) {
    // Collision tuyau du haut
    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + PIPE_WIDTH &&
        bird.y - bird.radius < pipe.top) {
        return true;
    }
    // Collision tuyau du bas
    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + PIPE_WIDTH &&
        bird.y + bird.radius > pipe.bottom) {
        return true;
    }
    return false;
}

// === CONTRÔLES (CLIC ET TOUCHE ESPACE) ===
canvas.addEventListener('mousedown', flap);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        flap();
        e.preventDefault(); // Empêche de scroller la page
    }
});
// Support tactile pour mobile
canvas.addEventListener('touchstart', (e) => {
    flap();
    e.preventDefault();
});