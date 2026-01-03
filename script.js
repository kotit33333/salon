let tg = window.Telegram.WebApp;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;

tg.expand(); // Раскрываем на всё окно

// 1. ФУНКЦИЯ ВЫБОРА УСЛУГИ (Обнови свою старую)
function selectService(name, price) {
    selectedService = { name, price };
    
    // Скрываем список услуг, показываем блок даты
    document.getElementById('services-list').style.display = 'none';
    document.getElementById('booking-section').style.display = 'block';
    
    renderDays(); // Запускаем генерацию дней
}

// 2. ГЕНЕРАЦИЯ ДНЕЙ
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
            renderTime(); // Когда выбрали дату, показываем время
        };
        container.appendChild(div);
    }
}

// 3. ГЕНЕРАЦИЯ ВРЕМЕНИ
function renderTime() {
    const container = document.getElementById('time-container');
    container.innerHTML = '';
    const slots = ['10:00', '12:00', '14:00', '16:00', '18:00'];
    
    slots.forEach(slot => {
        let div = document.createElement('div');
        div.className = 'time-item';
        div.innerText = slot;
        div.onclick = () => {
            document.querySelectorAll('.time-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedTime = slot;
            
            // Настраиваем и показываем главную кнопку ТГ
            tg.MainButton.setText(`Записаться на ${selectedDate}, ${selectedTime}`);
            tg.MainButton.show();
        };
        container.appendChild(div);
    });
}

// 4. КНОПКА "НАЗАД"
function backToServices() {
    document.getElementById('booking-section').style.display = 'none';
    document.getElementById('services-list').style.display = 'block';
    tg.MainButton.hide();
}

// 5. ОТПРАВКА ДАННЫХ (Обнови обработчик клика MainButton)
tg.onEvent('mainButtonClicked', function(){
    const data = {
        service: selectedService.name,
        price: selectedService.price,
        date: selectedDate,
        time: selectedTime
    };
    tg.sendData(JSON.stringify(data));
});