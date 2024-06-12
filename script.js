const categories = {
    things: [
        "pes", "ko�ka", "k�e�ek", "kr�l�k", "papou�ek", "rybi�ka", "�elva", "kan�rek",
        "slon", "�irafa", "lev", "tygr", "opice", "medv�d", "vlk", "li�ka", "zebra",
        "auto", "kolo", "motorka", "vlak", "letadlo", "lo�", "tramvaj", "autobus",
        "kniha", "noviny", "�asopis", "mapa", "se�it", "di��", "obraz", "fotografie",
        "notebook", "tablet", "telefon", "kl�vesnice", "my�", "monitor", "televize", "r�dio",
        "de�tn�k", "kab�t", "boty", "tri�ko", "kalhoty", "sukn�", "�aty", "bunda",
        "fotbal", "basketbal", "tenis", "hokej", "volejbal", "b�h", "plav�n�", "cyklistika",
        "doktor", "u�itel", "policista", "hasi�", "kucha�", "zahradn�k", "in�en�r", "architekt",
        "kladivo", "�roubov�k", "kl��", "pila", "vrta�ka", "seka�ka", "lopata", "hr�b�",
        "st�l", "�idle", "sk���", "postel", "gau�", "koberec", "police", "lampa",
        "letadlov� lo�", "ponorka", "raketopl�n", "helikopt�ra", "tanker", "jachta", "bal�n",
        "sluch�tka", "mikrofon", "reproduktor", "kamera", "projektor", "ant�na", "dron", "robot",
        "ledni�ka", "pra�ka", "mikrovlnka", "trouba", "mix�r", "vysava�", "f�n", "�ehli�ka"
    ],
    places: [
        "kav�rna", "restaurace", "kino", "divadlo", "muzeum", "park", "zoo", "h�i�t�",
        "pl�", "hora", "les", "�eka", "jezero", "m�sto", "vesnice", "stadion",
        "sauna", "banka", "knihovna", "�kolka", "�kola", "univerzita", "nemocnice", "poliklinika",
        "obchod", "supermarket", "n�dra��", "leti�t�", "h�i�t�", "baz�n", "posilovna", "kostel",
        "radnice", "po�ta", "restaurace", "hotel", "hostel", "penzion", "motel", "kemp",
        "parkovi�t�", "gar�", "autobusov� zast�vka", "tramvajov� zast�vka", "vlakov� n�dra��", "leti�t�"
    ]
};

let selectedWord = "";
let spyIndex = -1;
let flippedCardsCount = 0;
let totalCards = 0;
let countdownActive = false; // P�id�na prom�nn� pro sledov�n� aktivn�ho odpo�tu

function startGame() {
    const playerCount = parseInt(document.getElementById("playerCount").value);
    const selectedCategory = document.getElementById("category").value;
    const words = categories[selectedCategory];
    
    selectedWord = words[Math.floor(Math.random() * words.length)];
    spyIndex = Math.floor(Math.random() * playerCount);
    flippedCardsCount = 0;
    totalCards = playerCount;
    countdownActive = false;
    
    const gameBoard = document.getElementById("gameBoard");
    const countdownDiv = document.getElementById("countdown");
    gameBoard.innerHTML = ""; // Vy�ist� hern� plochu
    countdownDiv.innerHTML = ""; // Vy�ist� odpo�et

    for (let i = 0; i < playerCount; i++) {
        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="back">Klikni</div>`;
        card.dataset.index = i; // Ulo�� index karty do data atributu
        card.onclick = () => revealCard(card);

        cardContainer.appendChild(card);
        gameBoard.appendChild(cardContainer);
    }
}

function revealCard(card) {
    if (countdownActive) return; // Zabr�n� oto�en� dal��ch karet b�hem odpo�tu

    const index = parseInt(card.dataset.index);
    const countdownDiv = document.getElementById("countdown"); // Najdeme div pro odpo�et
    if (index === spyIndex) {
        card.innerHTML = "SPY";
    } else {
        card.innerHTML = selectedWord;
    }
    card.onclick = null; // Zabra�uje opakovan�mu kliknut�

    countdownActive = true; // Nastav� odpo�et jako aktivn�
    flippedCardsCount++;
    
    // P�id�me odpo�et 5 sekund
    let countdown = 5;
    if (flippedCardsCount < totalCards) {
        countdownDiv.innerHTML = `P�edej telefon dal��mu hr��i za: ${countdown}`;
    } else {
        countdownDiv.innerHTML = `Hra za��n� za: ${countdown}`;
    }
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            if (flippedCardsCount < totalCards) {
                countdownDiv.innerHTML = `P�edej telefon dal��mu hr��i za: ${countdown}`;
            } else {
                countdownDiv.innerHTML = `Hra za��n� za: ${countdown}`;
            }
        } else {
            clearInterval(countdownInterval);
            countdownDiv.innerHTML = "";
            card.classList.add('revealed');
            card.innerHTML = "";
            card.onclick = null; // Zabr�n� dal��mu kliknut�
            countdownActive = false; // Uvoln� odpo�et, povol� oto�en� dal��ch karet
            
            if (flippedCardsCount === totalCards) {
                startFinalCountdown(totalCards);
            }
        }
    }, 1000);
}

function startFinalCountdown(playerCount) {
    const gameBoard = document.getElementById("gameBoard");
    const countdownDiv = document.getElementById("countdown");

    // Skryjeme karty
    gameBoard.innerHTML = "";
    
    let finalCountdown = playerCount * 60; // 1 minuta za ka�d�ho hr��e
    const finalCountdownInterval = setInterval(() => {
        const minutes = Math.floor(finalCountdown / 60);
        const seconds = finalCountdown % 60;
        countdownDiv.innerHTML = `Konec hry za: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        finalCountdown--;
        if (finalCountdown < 0) {
            clearInterval(finalCountdownInterval);
            countdownDiv.innerHTML = "Konec Hry";
        }
    }, 1000);
}

