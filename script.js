const tg = window.Telegram.WebApp;
tg.expand();

// Настройки кнопки
tg.MainButton.setParams({
    color: '#FF85A1',
    text_color: '#FFFFFF'
});

let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentStep = 'services'; // 'services' или 'datetime'

const data = {
    nails: [
        { name: "Маникюр б/п", price: "1500₽" },
        { name: "Покрытие гель-лак", price: "2200₽" },
        { name: "Наращивание", price: "3500₽" }
    ],
    lashes: [
        { name: "Классика", price: "2000₽" },
        { name: "2D Объем", price: "2500₽" },
        { name: "Ламинирование", price: "1800₽" }
    ],
    pedi: [
        { name: "Педикюр б/п", price: "2000₽" },
        { name: "Педикюр с покрытием", price: "2800₽" }
    ],
    face: [
        { name: "Чистка лица", price: "3000₽" },
        { name: "Пилинг", price: "2500₽" },
        { name: "Массаж лица", price: "1500₽" }
    ]
};

// 1. Инициализация кликов по категориям
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-cat');
            
            // Визуальный актив
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            renderServices(cat);
        });
    });
});

// 2. Отрисовка списка услуг
function renderServices(cat) {
    const container = document.getElementById('services-container');
    container.innerHTML = ''; // Чистим старое
    
    data[cat].forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <span class="service-name">${item.name}</span>
            <span class="service-price">${item.price}</span>
        `;
        
        div.onclick = () => {
            selectedService = item;
            tg.MainButton.setText(`ВЫБРАТЬ: ${item.name.toUpperCase()}`);
            tg.MainButton.show();
        };
        
        container.appendChild(div);
    });
}

// 3. Переход к календарю
function openCalendar() {
    currentStep = 'datetime';
    
    // Скрываем выбор услуг
    document.getElementById('categories').style.display = 'none';
    document.getElementById('services-container').style.display = 'none';
    document.querySelector('h1').innerText = 'Дата и время';
    
    // Показываем календарь
    const bookingSection = document.getElementById('booking-section');
    bookingSection.style.display = 'block';
    
    tg.MainButton.hide(); 
    renderDays();
}

// 4. Генерация дней
function renderDays() {
    const container = document.getElementById('days-container');
    container.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        let d = new Date();
        d.setDate(d.getDate() + i);
        let dayStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        
        let div = document.createElement('div');
        div.className = 'day-item';
        div.innerText = dayStr;
        
        div.onclick = () => {
            // Находим все элементы с классом day-item и убираем selected
    document.querySelectorAll('.day-item').forEach(el => el.classList.remove('selected'));
    div.classList.add('selected'); // Ставим розовый цвет
    selectedDate = dayStr;
    renderTime();
        };
        container.appendChild(div);
    }
}

// 5. Генерация времени
async function renderTime() {
    const container = document.getElementById('time-container');
    container.innerHTML = 'Загрузка...';
    
    const url = `https://script.google.com/macros/s/AKfycbwNnVblllOcfHRsrV9tJtChJsgfOySXBT0KJARAg_zsS9oIwRSkq9okmNfmxejMf67B/exec?date=${encodeURIComponent(selectedDate)}`;
    
    try {
        const response = await fetch(url);
        const busySlots = await response.json(); 
        
        // Очищаем массив от лишних пробелов, если они есть в таблице
        const cleanedBusySlots = busySlots.map(s => s.toString().trim());

        container.innerHTML = '';
        const allSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

        allSlots.forEach(slot => {
            const isBusy = cleanedBusySlots.includes(slot);
            let div = document.createElement('div');
            // Применяем классы
            div.className = isBusy ? 'time-item busy' : 'time-item';
            div.innerText = slot;
            
            if (!isBusy) {
                div.onclick = () => {
                    // Удаляем selected у всех и ставим текущему
                    document.querySelectorAll('.time-item').forEach(el => el.classList.remove('selected'));
                    div.classList.add('selected');
                    selectedTime = slot;
                    tg.MainButton.setText(`ЗАПИСАТЬСЯ: ${selectedDate}, ${selectedTime}`);
                    tg.MainButton.show();
                };
            } else {
                // Если занято, клик не вешаем
                div.style.pointerEvents = 'none'; 
            }
            container.appendChild(div);
        });
    } catch (e) {
        container.innerHTML = 'Ошибка загрузки времени';
        console.error(e);
    }
}

// 6. Обработка кнопки Telegram
tg.onEvent('mainButtonClicked', () => {
    if (currentStep === 'services') {
        openCalendar();
    } else {
        const finalData = {
            service: selectedService.name,
            price: selectedService.price,
            date: selectedDate,
            time: selectedTime
        };
        tg.sendData(JSON.stringify(finalData));
        tg.close();
    }
});