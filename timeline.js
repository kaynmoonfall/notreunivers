const timelineData = [
    { id: 'A', text: "Ce jour, au McDo ✨" },
    { id: 'B', text: "La petite maisonette ❤️" },
    { id: 'C', text: "Photobooth 💐" },
    { id: 'D', text: "Première sortie avec Arusan🌙" },
    { id: 'E', text: "Ce bon vieu clair de lune.. ✈️" },
    { id: 'F', text: "Shopping 😂" },
    { id: 'G', text: "Oh ce musée !! 😍" },
    { id: 'H', text: "Tout premier pic-nic 📸" },
    { id: 'I', text: "Il était pas mal ce restau non ? 🤝" },
    { id: 'J', text: "Faut sourire rohh ❤️" },
    { id: 'K', text: "Ton amour me rechauffe plus que ce feu ✨" },
    { id: 'L', text: "Nous hihi 💍" }
];

function initTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Mélange aléatoire des photos au début
    const shuffled = [...timelineData].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {
        const div = document.createElement('div');
        div.className = "bg-white/10 p-2 rounded-2xl border border-white/20 flex items-center gap-3 cursor-move touch-none active:scale-95 transition-transform shadow-lg mb-2";
        div.draggable = true;
        div.dataset.id = item.id;
        
        div.innerHTML = `
            <div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/30">
                <img src="img/${item.id}.jpg" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <p class="text-white font-bold text-[11px] uppercase tracking-tighter">${item.text}</p>
            </div>
            <div class="text-white/20 text-xl pr-1">≡</div>
        `;
        
        setupDragAndDrop(div);
        container.appendChild(div);
    });
}

function setupDragAndDrop(el) {
    el.addEventListener('dragstart', () => el.classList.add('opacity-40'));
    el.addEventListener('dragend', () => el.classList.remove('opacity-40'));
    
    const container = document.getElementById('timeline-container');
    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.opacity-40');
        if (draggable) {
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.opacity-40)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function checkTimeline() {
    const container = document.getElementById('timeline-container');
    const statusEl = document.getElementById('timeline-status');
    const currentOrder = Array.from(container.children).map(child => child.dataset.id).join('');
    
    // L'ordre gagnant est la suite alphabétique
    const winningOrder = "ABCDEFGHIJKL";

    if (currentOrder === winningOrder) {
        showTimelineVictory();
    } else {
        // --- NOUVELLE GESTION DE L'ERREUR ---
        if (statusEl) {
            statusEl.innerText = "Ce n'est pas encore le bon ordre ! Réessaie mon amour ❤️";
            statusEl.className = "mb-6 p-4 rounded-2xl font-bold uppercase text-xs shadow-2xl bg-red-500/80 text-white border border-red-400 animate-bounce block";
            statusEl.classList.remove('hidden');

            // Le message disparaît après 3 secondes
            setTimeout(() => {
                statusEl.classList.add('hidden');
                statusEl.classList.remove('animate-bounce');
            }, 3000);
        }
    }
}

function showTimelineVictory() {
    const container = document.getElementById('timeline-container').parentElement;
    container.innerHTML = `
        <div class="text-center py-10 animate-[fadeIn_0.5s_ease-in]">
            <span class="text-7xl mb-6 block animate-bounce">🏆</span>
            <h2 class="text-3xl font-black text-white uppercase mb-4 tracking-tighter">Bravo mon amour !</h2>
            <p class="text-white opacity-90 mb-10 italic px-6 leading-relaxed">Tu connais notre histoire sur le bout des doigts. Chaque moment avec toi est mon préféré ❤️</p>
            <button onclick="goBack()" class="w-full bg-white text-black font-extrabold py-5 rounded-2xl shadow-xl uppercase tracking-widest active:scale-95 transition-transform">Retour au menu</button>
        </div>
    `;
}