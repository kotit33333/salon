// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Настройки главной кнопки (скрыта по умолчанию)
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#FF85A1";

let selectedService = null; 

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

function showServices(cat, el) {
    // Подсветка активной категории
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const container = document.getElementById('services-container');
    container.innerHTML = '';
    
    data[cat].forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-item';
        
        // Логика выбора услуги
        div.onclick = () => {
            selectedService = item; 
            tg.MainButton.text = `ВЫБРАТЬ: ${item.name.toUpperCase()}`;
            tg.MainButton.show(); // Показываем кнопку только после выбора услуги
        };

        div.innerHTML = `
            <span class="service-name">${item.name}</span>
            <span class="service-price">${item.price}</span>
        `;
        container.appendChild(div);
    });
}

// Обработка нажатия на главную кнопку внизу Telegram
tg.onEvent('mainButtonClicked', function(){
    if (selectedService) {
        // Отправляем объект услуги боту в формате JSON
        tg.sendData(JSON.stringify(selectedService)); 
    }
    tg.close();
});