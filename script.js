const tg = window.Telegram.WebApp;
tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#FF85A1";

let selectedService = null; 
let selectedDate = null;
let selectedTime = null;
let currentStep = 'services'; // Шаги: 'services' или 'datetime'

const data = {
    nails: [{ name: "Маникюр б/п", price: "1500₽" }, { name: "Покрытие гель-лак", price: "2200₽" }, { name: "Наращивание", price: "3500₽" }],
    lashes: [{ name: "Классика", price: "2000₽" }, { name: "2D Объем", price: "2500₽" }, { name: "Ламинирование", price: "1800₽" }],
    pedi: [{ name: "Педикюр б/п", price: "2000₽" }, { name: "Педикюр с покрытием", price: "2800₽" }],
    face: [{ name: "Чистка лица", price: "3000₽" }, { name: "Пилинг", price: "2500₽" }, { name: "Массаж лица", price: "1500₽" }]
};

function showServices(cat, el) {
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const container = document.getElementById('services-container');
    container.innerHTML = '';
    
    data[cat].forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.onclick = () => {
            selectedService = item; 
            tg.MainButton.text = `ПРОДОЛЖИТЬ: ${item.name.toUpperCase()}`;
            tg.MainButton.show();
        };
        div.innerHTML = `<span class="service-name">${item.name}</span><span class="service-price">${item.price}</span>`;
        container.appendChild(div);
    });
}

// ФУНКЦИЯ ПЕРЕХОДА К КАЛЕНДАРЮ
function openCalendar() {
    currentStep = 'datetime';
    document.getElementById('categories').style.display = 'none';
    document.getElementById('services-container').style.display = 'none';
    
    const bookingSection = document.getElementById('booking-section');
    bookingSection.style.display = 'block';
    
    tg.MainButton.hide(); // Прячем, пока не выберут время
    renderDays();
}

function renderDays() {
    const container = document.getElementById('days-container');
    container.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        let dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        
        let div = document.createElement('div');
        div.className = 'day-item';
        div.innerText = dateStr;
        div.onclick = () => {
            document.querySelectorAll('.day-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedDate = dateStr;
            renderTime();
        };
        container.appendChild(div);
    }
}

function renderTime() {
    const container = document.getElementById('time-container');
    container.innerHTML = '';
    const slots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    
    slots.forEach(slot => {
        let div = document.createElement('div');
        div.className = 'time-item';
        div.innerText = slot;
        div.onclick = () => {
            document.querySelectorAll('.time-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedTime = slot;
            
            tg.MainButton.text = `ЗАПИСАТЬСЯ: ${selectedDate} В ${selectedTime}`;
            tg.MainButton.show();
        };
        container.appendChild(div);
    });
}

// ГЛАВНАЯ ЛОГИКА НАЖАТИЯ КНОПКИ
tg.onEvent('mainButtonClicked', function(){
    if (currentStep === 'services') {
        openCalendar(); // Если на этапе услуг — идем к датам
    } else {
        // Если на этапе дат — отправляем всё боту
        const result = {
            ...selectedService,
            date: selectedDate,
            time: selectedTime
        };
        tg.sendData(JSON.stringify(result));
        tg.close();
    }
});