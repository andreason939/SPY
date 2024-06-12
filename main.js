document.addEventListener('DOMContentLoaded', () => {
  showNewEventForm();
});

function showNewEventForm() {
  document.getElementById('content').innerHTML = `
    <h2>Nová akce</h2>
    <form id="newEventForm">
      <label for="eventName">Název akce:</label>
      <input type="text" id="eventName" name="eventName" required>
      <button type="submit">Vytvoøit</button>
    </form>
  `;

  document.getElementById('newEventForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const eventName = document.getElementById('eventName').value;
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const newEvent = { id: Date.now(), name: eventName, status: 'ongoing', participants: [], drinks: [] };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    alert('Akce vytvoøena!');
    showOngoingEvents();
  });
}

function showOngoingEvents() {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const ongoingEvents = events.filter(event => event.status === 'ongoing');
  const eventList = ongoingEvents.map(event => `
    <li><button onclick="selectOngoingEvent(${event.id})">${event.name}</button></li>
  `).join('');
  document.getElementById('content').innerHTML = `
    <h2>Probíhající akce</h2>
    <ul class="event-list">${eventList}</ul>
  `;
}

function selectOngoingEvent(eventId) {
  document.getElementById('content').innerHTML = `
    <h2>Spravovat akci</h2>
    <div class="action-buttons">
      <button class="register-button" onclick="registerParticipant(${eventId})">Registrovat úèastníka</button>
      <button class="center-button add-drink-button" onclick="showAddDrinkForm(${eventId})">Pøidat drink</button>
      <button class="end-event-button" onclick="endEvent(${eventId})">Ukonèit akci</button>
    </div>
    <div class="back-container"><button class="back-button" onclick="showOngoingEvents()">Zpìt</button></div>
  `;
}

function registerParticipant(eventId) {
  const name = prompt('Zadejte své jméno:');
  if (name) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(event => event.id === eventId);
    event.participants.push({ name, id: Date.now() });
    localStorage.setItem('events', JSON.stringify(events));
    alert('Úèastník zaregistrován!');
  }
  selectOngoingEvent(eventId); // Aktualizuje stránku pro správu akce
}

function showAddDrinkForm(eventId) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events.find(event => event.id === eventId);
  const participantOptions = event.participants.map(participant => `<option value="${participant.id}">${participant.name}</option>`).join('');

  document.getElementById('content').innerHTML = `
    <h2>Pøidat drink</h2>
    <form id="addDrinkForm">
      <label for="participantId">Úèastník:</label>
      <select id="participantId" name="participantId" required>
        ${participantOptions}
      </select>
      <label for="drinkType">Typ drinku:</label>
      <select id="drinkType" name="drinkType" required>
        <option value="Pivo">Pivo 0,5l</option>
        <option value="Víno">Víno 0,2l</option>
        <option value="Drink">Drink 0,3l</option>
        <option value="Panák velký">Panák velký 40%</option>
        <option value="Panák malý">Panák malý 40%</option>
      </select>
      <label for="price">Cena (Kè):</label>
      <input type="number" id="price" name="price" required>
      <button type="submit">Pøidat</button>
    </form>
    <div id="message" class="message"></div>
    <div class="back-container"><button class="back-button" onclick="selectOngoingEvent(${eventId})">Zpìt</button></div>
  `;

  document.getElementById('addDrinkForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addDrink(eventId);
  });
}

function addDrink(eventId) {
  const participantId = document.getElementById('participantId').value;
  const drinkType = document.getElementById('drinkType').value;
  const price = parseFloat(document.getElementById('price').value);
  const volumeMap = {
    "Pivo": 0.5,
    "Víno": 0.2,
    "Drink": 0.3,
    "Panák velký": 0.04,
    "Panák malý": 0.02
  };
  const volume = volumeMap[drinkType];
  const time = new Date().toISOString();

  const messageElement = document.getElementById('message');

  if (participantId && drinkType && volume && !isNaN(price)) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(event => event.id === eventId);
    event.drinks.push({ type: drinkType, volume, price, time, participantId: parseInt(participantId) });
    localStorage.setItem('events', JSON.stringify(events));
    messageElement.innerHTML = `<p class="success">Drink pøidán!</p>`;
    messageElement.style.display = 'block';
    setTimeout(() => {
      messageElement.innerHTML = '';
      messageElement.style.display = 'none';
    }, 3000);
  } else {
    messageElement.innerHTML = `<p class="error">Prosím, vyplòte všechna pole!</p>`;
    messageElement.style.display = 'block';
  }
}

function endEvent(eventId) {
  if (confirm('Opravdu chcete akci ukonèit?')) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(event => event.id === eventId);
    event.status = 'ended';
    localStorage.setItem('events', JSON.stringify(events));
    alert('Akce ukonèena!');
    showOngoingEvents();
  }
}

function showEndedEvents() {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const endedEvents = events.filter(event => event.status === 'ended');
  const eventList = endedEvents.map(event => `
    <li>
      <button onclick="showEventOptions(${event.id})">${event.name}</button>
      <button class="delete-button" onclick="deleteEvent(${event.id})">Smazat</button>
    </li>
  `).join('');
  document.getElementById('content').innerHTML = `
    <h2>Ukonèené akce</h2>
    <ul class="event-list">${eventList}</ul>
  `;
}

function showEventOptions(eventId) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events.find(event => event.id === eventId);
  const participantOptions = event.participants.map(participant => `<option value="${participant.id}">${participant.name}</option>`).join('');

  document.getElementById('content').innerHTML = `
    <h2>Možnosti zobrazení</h2>
    <label for="participantFilter">Zvolit úèastníka:</label>
    <select id="participantFilter" name="participantFilter">
      <option value="all">Všichni</option>
      ${participantOptions}
    </select>
    <div class="option-buttons">
      <button onclick="showEventDetails(${event.id}, 'timeline')">Prùbìžná tabulka v èase</button>
      <button onclick="showEventDetails(${event.id}, 'summary')">Celkové výsledky</button>
      <button onclick="showMVP(${event.id})">MVP</button>
    </div>
    <div class="back-container"><button class="back-button" onclick="showEndedEvents()">Zpìt</button></div>
  `;
}

function showEventDetails(eventId, viewType) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events.find(event => event.id === eventId);
  const participantFilter = document.getElementById('participantFilter').value;

  if (event) {
    let participantList;

    if (viewType === 'timeline') {
      participantList = event.participants.filter(participant => participantFilter === 'all' || participant.id == participantFilter).map(participant => {
        const drinks = event.drinks.filter(drink => drink.participantId === participant.id);
        return drinks.map(drink => `
          <tr>
            <td>${participant.name}</td>
            <td>${drink.type}</td>
            <td>${drink.volume}</td>
            <td>${formatDate(drink.time)}</td>
          </tr>
        `).join('');
      }).join('');
    } else if (viewType === 'summary') {
      const summaryMap = {};
      event.participants.forEach(participant => {
        if (participantFilter === 'all' || participant.id == participantFilter) {
          summaryMap[participant.id] = { name: participant.name, drinks: {} };
        }
      });
      event.drinks.forEach(drink => {
        if (summaryMap[drink.participantId]) {
          if (!summaryMap[drink.participantId].drinks[drink.type]) {
            summaryMap[drink.participantId].drinks[drink.type] = { volume: 0, count: 0, price: 0 };
          }
          summaryMap[drink.participantId].drinks[drink.type].volume += drink.volume;
          summaryMap[drink.participantId].drinks[drink.type].count += 1;
          summaryMap[drink.participantId].drinks[drink.type].price += drink.price;
        }
      });
      participantList = Object.values(summaryMap).map(summary => {
        const drinkDetails = Object.entries(summary.drinks).map(([type, data]) => `
          <tr>
            <td>${summary.name}</td>
            <td>${type}</td>
            <td>${data.volume.toFixed(2)}</td>
            <td>${data.count}</td>
            <td>${data.price.toFixed(2)} Kè</td>
          </tr>
        `).join('');
        return drinkDetails;
      }).join('');
    }

    document.getElementById('content').innerHTML = `
      <h2>Detaily akce: ${event.name}</h2>
      <table>
        <thead>
          <tr>
            ${viewType === 'timeline' ? `
              <th>Úèastník</th>
              <th>Typ drinku</th>
              <th>Objem (l)</th>
              <th>Èas</th>
            ` : `
              <th>Úèastník</th>
              <th>Typ drinku</th>
              <th>Celkový objem (l)</th>
              <th>Poèet</th>
              <th>Celková cena (Kè)</th>
            `}
          </tr>
        </thead>
        <tbody>
          ${participantList}
        </tbody>
      </table>
      <div class="back-container"><button class="back-button" onclick="showEventOptions(${eventId})">Zpìt</button></div>
    `;
  }
}

function showMVP(eventId) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events.find(event => event.id === eventId);

  if (event) {
    const drinkTypes = ["Pivo", "Víno", "Drink", "Panák velký", "Panák malý"];
    const mvpList = drinkTypes.map(type => {
      let maxVolume = 0;
      let maxCount = 0;
      let maxPrice = 0;
      let mvp = null;
      event.participants.forEach(participant => {
        const totalVolume = event.drinks
          .filter(drink => drink.participantId === participant.id && drink.type === type)
          .reduce((sum, drink) => sum + drink.volume, 0);
        const totalCount = event.drinks
          .filter(drink => drink.participantId === participant.id && drink.type === type)
          .reduce((sum, drink) => sum + 1, 0);
        const totalPrice = event.drinks
          .filter(drink => drink.participantId === participant.id && drink.type === type)
          .reduce((sum, drink) => sum + drink.price, 0);
        if (totalVolume > maxVolume) {
          maxVolume = totalVolume;
          maxCount = totalCount;
          maxPrice = totalPrice;
          mvp = participant.name;
        }
      });
      return { type, mvp, maxVolume, maxCount, maxPrice };
    });

    const mvpDetails = mvpList.map(mvp => `
      <tr>
        <td>${mvp.type}</td>
        <td>${mvp.mvp}</td>
        <td>${mvp.maxVolume.toFixed(2)}</td>
        <td>${mvp.maxCount}</td>
        <td>${mvp.maxPrice.toFixed(2)} Kè</td>
      </tr>
    `).join('');

    const totalDrinks = event.drinks.length;
    const totalVolume = event.drinks.reduce((sum, drink) => sum + drink.volume, 0);
    const totalPrice = event.drinks.reduce((sum, drink) => sum + drink.price, 0);

    document.getElementById('content').innerHTML = `
      <h2>MVP akce: ${event.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Typ drinku</th>
            <th>Úèastník</th>
            <th>Celkový objem (l)</th>
            <th>Poèet</th>
            <th>Celková cena (Kè)</th>
          </tr>
        </thead>
        <tbody>
          ${mvpDetails}
        </tbody>
      </table>
      <div class="summary-table">
        <h3>Souhrn</h3>
        <p>Poèet drinkù celkem: ${totalDrinks}</p>
        <p>Objem celkem: ${totalVolume.toFixed(2)} l</p>
        <p>Cena celkem: ${totalPrice.toFixed(2)} Kè</p>
      </div>
      <div class="back-container"><button class="back-button" onclick="showEventOptions(${eventId})">Zpìt</button></div>
    `;
  }
}

function deleteEvent(eventId) {
  if (confirm('Opravdu chcete smazat tuto akci?')) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem('events', JSON.stringify(events));
    alert('Akce smazána!');
    showEndedEvents();
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

