let leafletMap;
let userMarker;
let currentMapIndex = 0;
const mapData = [
    { 
        q: "Où on s'est vu et parlé pour la première fois ?", 
        lat: 48.618237662152175, 
        lng: 2.438611061576004, 
        radius: 150, 
        img: "img/geo1.jpg", 
        msg: "Le début de notre histoire était au Parc Coquibus... ❤️" 
    },
    { 
        q: "Où est-ce que je t'ai offert le tout premier bracelet ?", 
        lat: 48.846649055067104, 
        lng: 2.3374741976252493, 
        radius: 150, 
        img: "img/geo2.jpg", 
        msg: "Ce bracelet dont j'ai flashé au premier regard... ❤️" 
    },
    { 
        q: "Tu te rappelles du lieu de notre premier calin ?", 
        lat: 48.61713121307707, 
        lng: 2.416635422674319, 
        radius: 150, 
        img: "img/geo3.jpg", 
        msg: "Un moment que je n'oublierai jamais... 🫂❤️" 
    },
    { 
        q: "Notre premier rencard après le 1er août ?", 
        lat: 48.60694506840639, 
        lng: 2.4707121947241095, 
        radius: 150, 
        img: "img/geo4.jpg", 
        msg: "On était tout excité hihi... ✨❤️" 
    },
    { 
        q: "Où habite Virush ?", 
        lat: 48.95255082563822, 
        lng: 2.4430793110371556, 
        radius: 150, 
        img: "img/geo5.jpg", 
        msg: "Beaugosse hein ?? 🏠🦠" 
    },
    { 
        q: "Tu te rappelle de notre première fois en bateau ?", 
        lat: 48.76872646364826, 
        lng: 2.298290002928938, 
        radius: 150, 
        img: "img/geo6.jpg", 
        msg: "Capitaine de mon cœur sur l'eau... ⛵❤️" 
    },
    { 
        q: "Où Virush a écrit Chellam dans le sable la toute première fois ?", 
        lat: 44.095771613292285, 
        lng: -1.3215967524864671, 
        radius: 1000, 
        img: "img/geo7.jpg", 
        msg: "Gravé dans le sable, puis dans mon cœur... 🏝️❤️" 
    },
    { 
        q: "Dans quelle école étions-nous en Inde ?", 
        lat: 13.053258675138846, 
        lng: 80.21411379969423, 
        radius: 1000, 
        img: "img/geo8.jpg", 
        msg: "Sans le savoir, on était si proche... 🎓" 
    },
    { 
        q: "Où est né Virush ?", 
        lat: 9.66611069090418, 
        lng: 80.01233165167669, 
        radius: 1000, 
        img: "img/geo9.jpg", 
        msg: "Naissance d'un ROI 🍼✨" 
    }
];
function initMap() {
    if (!leafletMap) {
        leafletMap = L.map('leaflet-map').setView([48.75, 2.38], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

        leafletMap.on('zoomend', function() {
            updateCirclesRadius();
        });

        const modal = document.getElementById('map-modal');
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeMapModal();
        });

        refreshBlueZones();
    }
    
    currentMapIndex = 0;
    updateMapQuestion();
    setTimeout(() => { 
        leafletMap.invalidateSize(); 
        updateCirclesRadius(); 
    }, 400);
}
function updateCirclesRadius() {
    const zoom = leafletMap.getZoom();
    let dynamicRadius;

    // On augmente massivement le rayon selon le niveau de zoom
    if (zoom <= 3) dynamicRadius = 150000;      // Vue Monde (très large)
    else if (zoom <= 5) dynamicRadius = 50000;  // Vue Pays
    else if (zoom <= 8) dynamicRadius = 15000;  // Vue Région
    else if (zoom <= 10) dynamicRadius = 5000;  // Vue Ville éloignée
    else if (zoom === 11) dynamicRadius = 2500;
    else if (zoom === 12) dynamicRadius = 1500;
    else if (zoom === 13) dynamicRadius = 800;
    else if (zoom === 14) dynamicRadius = 500;
    else dynamicRadius = 400;                   // Vue très proche

    leafletMap.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
            layer.setRadius(dynamicRadius);
        }
    });
}
function refreshBlueZones() {
    mapData.forEach((zone, index) => {
        let circle = L.circle([zone.lat, zone.lng], {
            stroke: false,
            fillColor: '#3b82f6',
            fillOpacity: 0.4,
            radius: zone.radius,
            interactive: true 
        }).addTo(leafletMap);

        circle.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            checkZoneSelection(e.latlng, index);
        });
    });
}

function checkZoneSelection(clickedLatLng, zoneIndex) {
    if (zoneIndex > currentMapIndex) {
        showFeedbackModal(false, zoneIndex);
        return;
    }
    const isHistory = (zoneIndex < currentMapIndex);
    showFeedbackModal(true, zoneIndex, isHistory);
}

function showFeedbackModal(isCorrect, index, isHistory = false) {
    const data = mapData[index];
    const modal = document.getElementById('map-modal');
    const modalContent = modal.querySelector('div > div'); 
    const btnNext = document.getElementById('btn-next');
    const btnRetry = document.getElementById('btn-retry');

    document.getElementById('map-modal-img').src = data.img;

    if (isCorrect) {
        modalContent.style.backgroundColor = isHistory ? "#f3f4f6" : "#86efac";
        document.getElementById('map-modal-text').innerHTML = isHistory 
            ? `<span style="color: #374151; font-weight: 900;">SOUVENIR RETROUVÉ ✨</span><br>${data.msg}`
            : `<span style="color: #166534; font-weight: 900;">BRAVO ! ✅</span><br>${data.msg}`;
        
        btnNext.classList.remove('hidden');
        btnRetry.classList.add('hidden');

        if (isHistory) {
            btnNext.innerText = "Fermer";
            btnNext.onclick = closeMapModal;
        } else {
            btnNext.innerText = "Continuer →";
            btnNext.onclick = nextMapQuestion;
        }
    } else {
        modalContent.style.backgroundColor = "#fca5a5"; 
        document.getElementById('map-modal-text').innerHTML = `<span style="color: #991b1b; font-weight: 900;">RÉESSAYE... ❌</span><br>Ce n'est pas le bon souvenir !`;
        btnNext.classList.add('hidden');
        btnRetry.classList.remove('hidden');
    }
    modal.classList.remove('hidden');
}

function nextMapQuestion() {
    const data = mapData[currentMapIndex];
    
    L.circle([data.lat, data.lng], {
        stroke: false,
        fillColor: '#000000',
        fillOpacity: 0.4,
        radius: data.radius,
        interactive: false
    }).addTo(leafletMap);

    closeMapModal();
    currentMapIndex++;
    updateMapQuestion();
    updateCirclesRadius();
}

function updateMapQuestion() {
    const qEl = document.getElementById('map-question');
    if (mapData[currentMapIndex]) {
        qEl.innerText = mapData[currentMapIndex].q;
    } else {
        qEl.innerText = "Félicitations ! Tu as débloqué tous nos souvenirs ❤️";
    }
}

function closeMapModal() {
    document.getElementById('map-modal').classList.add('hidden');
}