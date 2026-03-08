const questions = [
    { q: "Dans quel restaurant on a mangé la première fois qu’on s’est vu ?", options: ["Pitaya", "Quick", "Twilson", "Warmer"], correct: 3 },
    { q: "Ta bague de promesse, où est-ce que je l’ai achetée ?", options: ["Evry", "Gare de Lyon", "Carré Sénart", "Châtelet"], correct: 3 },
    { q: "De quelle couleur j’étais habillé à notre première rencontre ?", options: ["Beige", "Noir", "Bleu", "Vert"], correct: 0 },
    { q: "Qui a offert un bouquet en premier entre nous deux ?", options: ["Virush", "Angavi"], correct: 1 },
    { q: "Qui aime l’autre le plus ?", options: ["Virush", "Virush"], correct: 0 }, 
    { q: "Quel jour avons-nous décidé d’appeler continuellement tous les jours ?", options: ["7 juillet 2024", "5 juin 2024", "6 juillet 2024", "1er août 2024"], correct: 2 },
    { q: "Quel temps faisait-il lors de notre premier jour de couple ?", options: ["Ensoleillé", "Pluvieux", "Dégagé", "Nuageux"], correct: 1 },
    { q: "Qui dit le + je t’aime ?", options: ["Angavi", "Virush"], correct: 1 },
    { q: "Dans quel ciné on a vu un film pour la première fois ?", options: ["Châtelet", "Evry", "Carré Sénart", "Paris"], correct: 1 },
    { q: "Notre duo porte-clés Lego c’était ?", options: ["Duo Spiderman", "Duo Marvel", "Duo Harry Potter", "Duo One Piece"], correct: 0 }
];

let currentIndex = 0;
let userChoices = [];

// Initialise ou réinitialise le quiz
function initQuiz() {
    currentIndex = 0;
    userChoices = [];
    
    const startScreen = document.getElementById('quiz-start-screen');
    const container = document.getElementById('quiz-container');
    
    if (startScreen) startScreen.classList.remove('hidden');
    if (container) {
        container.classList.add('hidden');
        // On remet la structure propre pour pouvoir rejouer sans bug
        container.innerHTML = `
            <div id="quiz-bar" class="bg-white h-1 rounded-full mb-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style="width: 0%"></div>
            <h2 id="quiz-question" class="text-2xl font-bold mb-6 text-white drop-shadow-md"></h2>
            <div id="quiz-options" class="grid grid-cols-1 gap-3 mt-auto"></div>
        `;
    }
}

function startQuizNow() {
    document.getElementById('quiz-start-screen').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentIndex];
    const questionEl = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    const bar = document.getElementById('quiz-bar');

    if (questionEl) questionEl.innerText = q.q;
    
    if (optionsDiv) {
        optionsDiv.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = "w-full bg-white/10 border border-white/20 p-4 rounded-2xl shadow-lg font-bold text-white hover:bg-white/30 transition-all active:scale-95 text-left flex justify-between items-center group";
            btn.innerHTML = `<span>${opt}</span><span class="opacity-0 group-hover:opacity-100 transition-opacity">❤️</span>`;
            btn.onclick = () => next(index);
            optionsDiv.appendChild(btn);
        });
    }

    if (bar) {
        const progress = (currentIndex / questions.length) * 100;
        bar.style.width = progress + "%";
    }
}

function next(choice) {
    userChoices.push(choice);
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const container = document.getElementById('quiz-container');
    
    let score = 0;
    questions.forEach((q, i) => {
        if (userChoices[i] === q.correct) score++;
    });

    let message = "";
    if (score === 10) {
        message = "Incroyable ! Tu me connais par cœur, je suis l'homme le plus chanceux ❤️";
    } else if (score >= 7) {
        message = "Presque parfait ! Je t'aime plus que tout ❤️";
    } else {
        message = "L'important c'est qu'on s'aime et qu'on crée encore plus de souvenirs ❤️";
    }
    
    // Affichage propre du score max (10 / 10)
    container.innerHTML = `
        <div class="text-center py-8 animate-[fadeIn_0.5s_ease-in]">
            <div class="mb-6 relative inline-block">
                <span class="text-7xl">❤️</span>
                <span class="absolute -top-2 -right-2 animate-ping text-2xl">✨</span>
            </div>
            <h2 class="text-3xl font-black uppercase mb-2 text-white tracking-tighter">Quiz Terminé</h2>
            <div class="bg-white/20 rounded-3xl py-4 px-8 mb-6 inline-block border border-white/30 shadow-inner">
                <p class="text-5xl font-black text-white">${score} <span class="text-2xl opacity-60">/ ${questions.length}</span></p>
            </div>
            <p class="text-lg opacity-90 mb-10 italic text-white px-4 leading-relaxed">${message}</p>
            <button onclick="goBack()" class="w-full bg-white text-black font-extrabold py-5 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95">Retour au menu</button>
        </div>
    `;
}   