const tg = window.Telegram.WebApp;
tg.expand();

// Настройки кнопки
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#FF85A1";

let selectedService = null; 

// ОБЯЗАТЕЛЬНО: Данные должны быть в этом файле, если ты их используешь в showServices
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
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const container = document.getElementById('services-container');
    container.innerHTML = '';
    
    data[cat].forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-item';
        
        div.onclick = () => {
            selectedService = item; 
            tg.MainButton.text = `ВЫБРАТЬ: ${item.name.toUpperCase()}`;
            tg.MainButton.show();
        };

        div.innerHTML = `
            <span class="service-name">${item.name}</span>
            <span class="service-price">${item.price}</span>
        `;
        container.appendChild(div);
    });
}

tg.onEvent('mainButtonClicked', function(){
    if (selectedService) {
        tg.sendData(JSON.stringify(selectedService)); 
    }
    tg.close();
});