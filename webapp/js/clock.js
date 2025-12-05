// js/clock.js - Đồng hồ chạy realtime trên mọi trang
function startClock() {
    function update() {
        const now = new Date();
        const time = now.toLocaleTimeString('vi-VN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.querySelectorAll('.clock').forEach(el => {
            el.textContent = time;
        });
    }
    update();
    setInterval(update, 1000);
}

document.addEventListener('DOMContentLoaded', startClock);