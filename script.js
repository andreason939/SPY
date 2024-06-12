const categories = {
    things: [
        "pes", "koèka", "køeèek", "králík", "papoušek", "rybièka", "želva", "kanárek",
        "slon", "žirafa", "lev", "tygr", "opice", "medvìd", "vlk", "liška", "zebra",
        "auto", "kolo", "motorka", "vlak", "letadlo", "loï", "tramvaj", "autobus",
        "kniha", "noviny", "èasopis", "mapa", "sešit", "diáø", "obraz", "fotografie",
        "notebook", "tablet", "telefon", "klávesnice", "myš", "monitor", "televize", "rádio",
        "deštník", "kabát", "boty", "trièko", "kalhoty", "suknì", "šaty", "bunda",
        "fotbal", "basketbal", "tenis", "hokej", "volejbal", "bìh", "plavání", "cyklistika",
        "doktor", "uèitel", "policista", "hasiè", "kuchaø", "zahradník", "inženýr", "architekt",
        "kladivo", "šroubovák", "klíè", "pila", "vrtaèka", "sekaèka", "lopata", "hrábì",
        "stùl", "židle", "skøíò", "postel", "gauè", "koberec", "police", "lampa",
        "letadlová loï", "ponorka", "raketoplán", "helikoptéra", "tanker", "jachta", "balón",
        "sluchátka", "mikrofon", "reproduktor", "kamera", "projektor", "anténa", "dron", "robot",
        "lednièka", "praèka", "mikrovlnka", "trouba", "mixér", "vysavaè", "fén", "žehlièka"
    ],
    places: [
        "kavárna", "restaurace", "kino", "divadlo", "muzeum", "park", "zoo", "høištì",
        "pláž", "hora", "les", "øeka", "jezero", "mìsto", "vesnice", "stadion",
        "sauna", "banka", "knihovna", "školka", "škola", "univerzita", "nemocnice", "poliklinika",
        "obchod", "supermarket", "nádraží", "letištì", "høištì", "bazén", "posilovna", "kostel",
        "radnice", "pošta", "restaurace", "hotel", "hostel", "penzion", "motel", "kemp",
        "parkovištì", "garáž", "autobusová zastávka", "tramvajová zastávka", "vlakové nádraží", "letištì"
    ]
};

let selectedWord = "";
let spyIndex = -1;
let flippedCardsCount = 0;
let totalCards = 0;
let countdownActive = false; // Pøidána promìnná pro sledování aktivního odpoètu

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
    gameBoard.innerHTML = ""; // Vyèistí herní plochu
    countdownDiv.innerHTML = ""; // Vyèistí odpoèet

    for (let i = 0; i < playerCount; i++) {
        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="back">Klikni</div>`;
        card.dataset.index = i; // Uloží index karty do data atributu
        card.onclick = () => revealCard(card);

        cardContainer.appendChild(card);
        gameBoard.appendChild(cardContainer);
    }
}

function revealCard(card) {
    if (countdownActive) return; // Zabrání otoèení dalších karet bìhem odpoètu

    const index = parseInt(card.dataset.index);
    const countdownDiv = document.getElementById("countdown"); // Najdeme div pro odpoèet
    if (index === spyIndex) {
        card.innerHTML = "SPY";
    } else {
        card.innerHTML = selectedWord;
    }
    card.onclick = null; // Zabraòuje opakovanému kliknutí

    countdownActive = true; // Nastaví odpoèet jako aktivní
    flippedCardsCount++;
    
    // Pøidáme odpoèet 5 sekund
    let countdown = 5;
    if (flippedCardsCount < totalCards) {
        countdownDiv.innerHTML = `Pøedej telefon dalšímu hráèi za: ${countdown}`;
    } else {
        countdownDiv.innerHTML = `Hra zaèíná za: ${countdown}`;
    }
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            if (flippedCardsCount < totalCards) {
                countdownDiv.innerHTML = `Pøedej telefon dalšímu hráèi za: ${countdown}`;
            } else {
                countdownDiv.innerHTML = `Hra zaèíná za: ${countdown}`;
            }
        } else {
            clearInterval(countdownInterval);
            countdownDiv.innerHTML = "";
            card.classList.add('revealed');
            card.innerHTML = "";
            card.onclick = null; // Zabrání dalšímu kliknutí
            countdownActive = false; // Uvolní odpoèet, povolí otoèení dalších karet
            
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
    
    let finalCountdown = playerCount * 60; // 1 minuta za každého hráèe
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

