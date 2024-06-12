const categories = {
    things: [
        "pes", "kočka", "křeček", "králík", "papoušek", "rybička", "želva", "kanárek",
        "slon", "žirafa", "lev", "tygr", "opice", "medvěd", "vlk", "liška", "zebra",
        "auto", "kolo", "motorka", "vlak", "letadlo", "loď", "tramvaj", "autobus",
        "kniha", "noviny", "časopis", "mapa", "sešit", "diář", "obraz", "fotografie",
        "notebook", "tablet", "telefon", "klávesnice", "myš", "monitor", "televize", "rádio",
        "deštník", "kabát", "boty", "tričko", "kalhoty", "sukně", "šaty", "bunda",
        "fotbal", "basketbal", "tenis", "hokej", "volejbal", "běh", "plavání", "cyklistika",
        "doktor", "učitel", "policista", "hasič", "kuchař", "zahradník", "inženýr", "architekt",
        "kladivo", "šroubovák", "klíč", "pila", "vrtačka", "sekačka", "lopata", "hrábě",
        "stůl", "židle", "skříň", "postel", "gauč", "koberec", "police", "lampa",
        "letadlová loď", "ponorka", "raketoplán", "helikoptéra", "tanker", "jachta", "balón",
        "sluchátka", "mikrofon", "reproduktor", "kamera", "projektor", "anténa", "dron", "robot",
        "lednička", "pračka", "mikrovlnka", "trouba", "mixér", "vysavač", "fén", "žehlička"
    ],
    places: [
        "kavárna", "restaurace", "kino", "divadlo", "muzeum", "park", "zoo", "hřiště",
        "pláž", "hora", "les", "řeka", "jezero", "město", "vesnice", "stadion",
        "sauna", "banka", "knihovna", "školka", "škola", "univerzita", "nemocnice", "poliklinika",
        "obchod", "supermarket", "nádraží", "letiště", "hřiště", "bazén", "posilovna", "kostel",
        "radnice", "pošta", "restaurace", "hotel", "hostel", "penzion", "motel", "kemp",
        "parkoviště", "garáž", "autobusová zastávka", "tramvajová zastávka", "vlakové nádraží", "letiště"
    ]
};

let selectedWord = "";
let spyIndex = -1;
let flippedCardsCount = 0;
let totalCards = 0;
let countdownActive = false; // Přidána proměnná pro sledování aktivního odpočtu
let isMobile = false; // Přidána proměnná pro sledování, zda je zařízení mobilní

function startForPC() {
    isMobile = false;
    startSettings();
}

function startForMobile() {
    isMobile = true;
    startSettings();
}

function startSettings() {
    document.getElementById("introScreen").style.display = "none";
    document.getElementById("settingsScreen").style.display = "block";
    if (isMobile) {
        document.body.classList.add("mobile");
    } else {
        document.body.classList.remove("mobile");
    }
}

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
    gameBoard.innerHTML = ""; // Vyčistí herní plochu
    countdownDiv.innerHTML = ""; // Vyčistí odpočet

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
    if (countdownActive) return; // Zabrání otočení dalších karet během odpočtu

    const index = parseInt(card.dataset.index);
    const countdownDiv = document.getElementById("countdown"); // Najdeme div pro odpočet
    if (index === spyIndex) {
        card.innerHTML = "SPY";
    } else {
        card.innerHTML = selectedWord;
    }
    card.onclick = null; // Zabraňuje opakovanému kliknutí

    countdownActive = true; // Nastaví odpočet jako aktivní
    flippedCardsCount++;
    
    // Přidáme odpočet 5 sekund
    let countdown = 5;
    if (flippedCardsCount < totalCards) {
        countdownDiv.innerHTML = `Předej telefon dalšímu hráči za: ${countdown}`;
    } else {
        countdownDiv.innerHTML = `Hra začíná za: ${countdown}`;
    }
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            if (flippedCardsCount < totalCards) {
                countdownDiv.innerHTML = `Předej telefon dalšímu hráči za: ${countdown}`;
            } else {
                countdownDiv.innerHTML = `Hra začíná za: ${countdown}`;
            }
        } else {
            clearInterval(countdownInterval);
            countdownDiv.innerHTML = "";
            card.classList.add('revealed');
            card.innerHTML = "";
            card.onclick = null; // Zabrání dalšímu kliknutí
            countdownActive = false; // Uvolní odpočet, povolí otočení dalších karet
            
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
    
    let finalCountdown = playerCount * 60; // 1 minuta za každého hráče
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
