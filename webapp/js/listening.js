// listening.js

// ==================== DỮ LIỆU 50 CÂU ====================
const listeningData = [
    {
        audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        options: ["What about you?", "I like playing soccer.", "I don't know.", "Me too!"],
        correct: "D",
        transcript: "A: What do you like to do in your free time?<br>B: I like playing soccer and reading books.<br>A: What about you?<br>B: <strong>Me too!</strong> I also enjoy playing soccer."
    },
    {
        audio: "https://www.soundjay.com/buttons/sounds/button-09.mp3",
        options: ["Yes, I do.", "No, I don't.", "Maybe.", "Good night."],
        correct: "A",
        transcript: "Question: Do you like coffee?<br>Answer: <strong>Yes, I do.</strong>"
    },
    // 48 câu mẫu còn lại
].concat(Array.from({length: 48}, (_, i) => ({
    audio: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    options: [
        `Choice A - Question ${i+3}`,
        `Choice B - Question ${i+3}`,
        `Choice C - Question ${i+3}`,
        `Choice D - Question ${i+3}`
    ],
    correct: ["A","B","C","D"][Math.floor(Math.random()*4)],
    transcript: `This is sample transcript for question ${i+3}.<br>The correct answer is <strong>${["A","B","C","D"][Math.floor(Math.random()*4)]}</strong>.`
})));

// ==================== BIẾN TOÀN CỤC ====================
const TOTAL = 50;
const PER_PAGE = 10;
let currentPage = 1;
let currentIndex = 0;

// Các phần tử DOM
const audio = document.querySelector('.audio')
const buttons = document.querySelectorAll('.answers button');
const transcriptText = document.querySelector('.transcript-text');
const showBtn = document.querySelector('.transcript-btn');
const pagination = document.querySelector('.list-vocabulary');
const leftArrow = document.querySelector('.icon-left');
const rightArrow = document.querySelector('.icon-right');



// ==================== DROPDOWN MENU ====================
document.getElementById('extension-icon')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const list = this.parentElement.querySelector('.list');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', () => {
    document.querySelectorAll('.list').forEach(l => l.style.display = 'none');
});

// ==================== LOAD CÂU HỎI ====================
function loadQuestion(idx) {
    currentIndex = idx;
    const q = listeningData[idx];

    audio.src = q.audio;
    audio.load();

    buttons.forEach((btn, i) => {
        btn.querySelector('.text').textContent = q.options[i];
        btn.classList.remove('active', 'correct', 'wrong');
    });

    transcriptText.innerHTML = 'Click "Show Answer" để xem transcript và đáp án.';
    showBtn.textContent = 'Show Answer';
    showBtn.disabled = false;

    updatePagination();
}

// ==================== CHỌN ĐÁP ÁN ====================
buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// ==================== SHOW ANSWER ====================
showBtn.addEventListener('click', function() {
    const q = listeningData[currentIndex];
    transcriptText.innerHTML = q.transcript;

    buttons.forEach(btn => {
        const choice = btn.dataset.choice;
        if (choice === q.correct) {
            btn.classList.add('correct');
        } else if (btn.classList.contains('active')) {
            btn.classList.add('wrong');
        }
    });

    this.textContent = 'Đã hiện';
    this.disabled = true;
});

// ==================== PHÂN TRANG ====================
function updatePagination() {
    // Xóa các nút số cũ (trừ mũi tên)
    document.querySelectorAll('.list-vocabulary button:not(.icon-left):not(.icon-right)')
            .forEach(b => b.remove());

    const start = (currentPage - 1) * PER_PAGE + 1;
    const end = Math.min(start + PER_PAGE - 1, TOTAL);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentIndex + 1 ? 'active' : '';
        btn.addEventListener('click', () => {
            loadQuestion(i - 1);
            currentPage = Math.ceil(i / PER_PAGE);
        });
        pagination.insertBefore(btn, rightArrow);
    }

    leftArrow.disabled = currentPage === 1;
    leftArrow.style.opacity = currentPage === 1 ? '0.4' : '1';
    rightArrow.disabled = currentPage === Math.ceil(TOTAL / PER_PAGE);
    rightArrow.style.opacity = rightArrow.disabled ? '0.4' : '1';
}

leftArrow.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
});

rightArrow.addEventListener('click', () => {
    if (currentPage < Math.ceil(TOTAL / PER_PAGE)) {
        currentPage++;
        updatePagination();
    }
});

// ==================== KHỞI ĐỘNG ====================
updatePagination();
loadQuestion(0);

