const photos = [1, 2, 3, 4, 5, 6, 7, 8];
let cards = [...photos, ...photos];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

function initMemory() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
    cards.sort(() => Math.random() - 0.5);

    cards.forEach((photoNum) => {
        const card = document.createElement('div');
        card.className = 'memory-card relative w-full aspect-square cursor-pointer';
        card.innerHTML = `
            <div class="card-inner shadow-xl w-full h-full">
                <div class="card-front bg-pink-500 flex items-center justify-center text-3xl border-2 border-white text-white">❤️</div>
                
                <div class="card-back bg-white border-2 border-white overflow-hidden relative">
                    <img src="img/${photoNum}.jpg" class="w-full h-full object-cover img-photo">
                    <div class="tick-overlay absolute inset-0 flex items-center justify-center bg-gray-900/40 opacity-0 transition-opacity duration-300">
                        <span class="text-4xl">✅</span>
                    </div>
                </div>
            </div>
        `;
        card.onclick = () => flipCard(card, photoNum);
        grid.appendChild(card);
    });
}

function flipCard(card, photoNum) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push({card, photoNum});

    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.photoNum === c2.photoNum) {
        // --- SI C'EST RÉUSSI ---
        [c1, c2].forEach(c => {
            c.card.classList.add('matched');
            // On affiche le filtre gris et le tick
            const overlay = c.card.querySelector('.tick-overlay');
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
            // On ajoute un filtre gris sur l'image elle-même pour le style
            c.card.querySelector('.img-photo').style.filter = "grayscale(100%) brightness(70%)";
        });
        
        matchedPairs++;
        if (matchedPairs === photos.length) {
            setTimeout(() => alert("Bravo mon cœur ! Tu as tout trouvé ! ✨"), 500);
        }
    } else {
        // --- SI C'EST RATÉ ---
        c1.card.classList.remove('flipped');
        c2.card.classList.remove('flipped');
    }
    flippedCards = [];
    canFlip = true;
}