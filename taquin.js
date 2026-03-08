let puzzleTiles = [];
const boardSize = 3; 
let gameStarted = false;
const tileElements = []; // On garde les éléments en mémoire

function initTaquin() {
    const board = document.getElementById('puzzle-board');
    board.classList.add('puzzle-blur');
    board.innerHTML = '';
    tileElements.length = 0;
    gameStarted = false;
    
    puzzleTiles = [...Array(boardSize * boardSize).keys()];
    // Mélange initial
    puzzleTiles.sort(() => Math.random() - 0.5);
    
    // Création unique des éléments
    for (let i = 0; i < boardSize * boardSize; i++) {
        const tileValue = i;
        const tile = document.createElement('div');
        
        if (tileValue === 8) {
            tile.style.display = "none"; // La case vide
        } else {
            tile.className = 'puzzle-tile cursor-pointer rounded-md overflow-hidden border border-white/20 shadow-md';
            tile.style.backgroundImage = "url('img/puzzle.jpg')";
            tile.style.backgroundSize = "300% 300%";
            
            const row = Math.floor(tileValue / boardSize);
            const col = tileValue % boardSize;
            tile.style.backgroundPosition = `${(col * 50)}% ${(row * 50)}%`;
            
            tile.onclick = () => {
                const currentIndex = puzzleTiles.indexOf(tileValue);
                if(gameStarted) moveTaquinTile(currentIndex);
            };
        }
        tileElements[tileValue] = tile;
        board.appendChild(tile);
    }
    
    updateTilePositions();
}

function startPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.classList.remove('puzzle-blur');
    gameStarted = true;
    const btn = document.querySelector('#game-taquin button:last-child');
    if(btn) btn.innerText = "Re-mélanger";
}

// Fonction magique qui déplace les carrés sans les recréer
function updateTilePositions() {
    puzzleTiles.forEach((tileValue, index) => {
        if (tileValue !== 8) {
            const row = Math.floor(index / boardSize);
            const col = index % boardSize;
            
            // On calcule la position en % pour que ça s'adapte à la taille du board
            const x = col * 100 + (col * 1.5); // 1.5 pour compenser le gap
            const y = row * 100 + (row * 1.5);
            
            tileElements[tileValue].style.transform = `translate(${x}%, ${y}%)`;
        }
    });
}

function moveTaquinTile(index) {
    const emptyIndex = puzzleTiles.indexOf(8);
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const emptyRow = Math.floor(emptyIndex / boardSize);
    const emptyCol = emptyIndex % boardSize;

    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
        [puzzleTiles[index], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[index]];
        updateTilePositions(); // On met juste à jour les positions (l'animation CSS fait le reste)
        checkTaquinWin();
    }
}

function checkTaquinWin() {
    const win = puzzleTiles.every((tile, index) => tile === index);
    if (win && gameStarted) {
        setTimeout(() => {
            alert("T'es trop forte mon cœur ! ❤️");
            gameStarted = false;
        }, 400);
    }
}

initTaquin();