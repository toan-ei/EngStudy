// translate.js

// ĐÁP ÁN CHUẨN (có thể thay đổi dễ dàng)
const correctAnswer = `
    Liên Hợp Quốc đã yêu cầu các cuộc điều tra của Israel về những vụ giết người trái pháp luật ở Gaza, bao gồm vụ đánh bom kiểu "double tap" vào bệnh viện Nasser khiến 20 người thiệt mạng, trong đó có 5 nhà báo, phải có kết quả và đảm bảo trách nhiệm giải trình.

    "Cần phải có công lý," ông Thameen Al-Kheetan, người phát ngôn của Văn phòng Cao ủy Nhân quyền Liên Hợp Quốc, nói với các phóng viên hôm thứ Ba tại Geneva. Ông cho biết số lượng nhà báo bị sát hại ở Gaza đặt ra nhiều câu hỏi về việc cố tình nhắm mục tiêu vào các nhân viên truyền thông.
`.trim();

const correctParagraphs = correctAnswer.split(/\n\s*\n/).map(p => p.trim());

// DOM Elements
const submitBtn = document.querySelector('.submit button');
const vnDiv = document.querySelector('.vietnamese-text');

// ==================== ĐỒNG HỒ + MENU ====================
function updateClock() {
    const now = new Date();
    const time = String(now.getHours()).padStart(2,"0") + ":" +
                 String(now.getMinutes()).padStart(2,"0") + ":" +
                 String(now.getSeconds()).padStart(2,"0");
    document.querySelector('.clock').textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

document.getElementById('extension-icon')?.addEventListener('click', e => {
    e.stopPropagation();
    const list = e.target.parentElement.querySelector('.list');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', () => {
    document.querySelectorAll('.list').forEach(l => l.style.display = 'none');
});

// ==================== SUBMIT & KIỂM TRA ====================
submitBtn.addEventListener('click', () => {
    if (submitBtn.disabled) return;

    const userText = vnDiv.innerText.trim();
    if (!userText) {
        alert("Vui lòng nhập bản dịch của bạn trước nhé!");
        return;
    }

    const userParagraphs = userText.split(/\n\s*\n/).map(p => p.trim());

    let resultHTML = '';
    let allCorrect = true;

    for (let i = 0; i < Math.max(userParagraphs.length, correctParagraphs.length); i++) {
        const userP = userParagraphs[i] || '';
        const correctP = correctParagraphs[i] || '';

        if (userP && normalizeText(userP) === normalizeText(correctP)) {
            resultHTML += `<p class="correct">${userP}</p>`;
        } else {
            allCorrect = false;
            if (userP) {
                resultHTML += `<p class="wrong">${userP}</p>`;
            }
            resultHTML += `<div class="correct-answer">Đáp án đúng: ${correctP}</div>`;
        }
    }

    vnDiv.innerHTML = resultHTML;

    // Thay nút Submit thành "Đã kiểm tra" + thêm nút Làm lại
    submitBtn.textContent = allCorrect ? 'Hoàn hảo!' : 'Đã kiểm tra';
    submitBtn.disabled = true;

    if (!allCorrect) {
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Làm lại';
        retryBtn.className = 'retry-btn';
        retryBtn.onclick = () => location.reload();
        document.querySelector('.submit').appendChild(retryBtn);
    }
});

// Hàm chuẩn hóa văn bản (bỏ dấu, lowercase) để so sánh linh hoạt hơn
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// Focus vào ô dịch ngay khi load trang
document.addEventListener('DOMContentLoaded', () => {
    vnDiv.focus();
});


