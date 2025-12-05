// translate.js – giống hệt logic Listening

const TOTAL = 50;
const PER_PAGE = 10;
let currentPage = 1;
let currentIndex = 0;

// DOM
const pagination   = document.querySelector('.list-vocabulary');
const leftArrow    = document.querySelector('.icon-left');
const rightArrow   = document.querySelector('.icon-right');
const submitBtn    = document.querySelector('.submit button');
const vietnameseText = document.querySelector('.vietnamese-text');

// Dữ liệu 50 đoạn dịch (ở đây mình tạo mẫu)
const translateData = Array.from({length: 50}, (_, i) => ({
    english: `Paragraph ${i+1}. The quick brown fox jumps over the lazy dog. This is a sample English text for translation practice.`,
    correct: `Đoạn ${i+1}. Con cáo nâu nhanh nhẹn nhảy qua con chó lười biếng. Đây là đoạn văn tiếng Anh mẫu để luyện dịch.`
}));

function loadQuestion(idx) {
    currentIndex = idx;
    const q = translateData[idx];

    // Load đoạn tiếng Anh
    document.querySelector('.english-text').innerHTML = 
        q.english.split('. ').map(s => `<p>${s.trim()}${s.trim() ? '.' : ''}</p>`).join('');

    // Xóa nội dung dịch cũ
    vietnameseText.textContent = '';
    vietnameseText.focus();

    updatePagination();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
}

function updatePagination() {
    // Xóa nút số cũ (giữ lại 2 mũi tên)
    document.querySelectorAll('.list-vocabulary button:not(.icon-left):not(.icon-right)')
            .forEach(b => b.remove());

    const start = (currentPage - 1) * PER_PAGE + 1;
    const end   = Math.min(start + PER_PAGE - 1, TOTAL);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentIndex + 1) btn.classList.add('active');
        btn.addEventListener('click', () => {
            loadQuestion(i - 1);
            currentPage = Math.ceil(i / PER_PAGE);
        });
        pagination.insertBefore(btn, rightArrow);
    }

    leftArrow.disabled  = currentPage === 1;
    rightArrow.disabled = currentPage === Math.ceil(TOTAL / PER_PAGE);
    leftArrow.style.opacity  = currentPage === 1 ? '0.4' : '1';
    rightArrow.style.opacity = rightArrow.disabled ? '0.4' : '1';
}

// Sự kiện mũi tên
leftArrow.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; updatePagination(); loadQuestion((currentPage-1)*PER_PAGE); }
});

rightArrow.addEventListener('click', () => {
    if (currentPage < Math.ceil(TOTAL/PER_PAGE)) { currentPage++; updatePagination(); loadQuestion((currentPage-1)*PER_PAGE); }
});

// Submit
submitBtn.addEventListener('click', () => {
    const userText = vietnameseText.textContent.trim();
    const correct  = translateData[currentIndex].correct;

    vietnameseText.innerHTML = `<p class="correct-answer">${correct}</p>`;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đã nộp';
});

// Khởi động
updatePagination();
loadQuestion(0);