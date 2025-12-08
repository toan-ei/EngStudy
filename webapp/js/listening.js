let questions = [];                    // 10 câu hỏi từ /study/:topicId
let userAnswers = {};                  // { questionId: 'A'|'B'|'C'|'D'|null }
let currentIndex = 0;
let hasSubmitted = false;
let correctAnswers = {};               // mapping returned from server: { questionId: 'A' }

// DOM Elements
const audio = document.querySelector('.audio');
const buttons = document.querySelectorAll('.answers button');
const transcriptContent = document.querySelector('.transcript-content');
const leftArrow = document.querySelector('.icon-left');
const rightArrow = document.querySelector('.icon-right');
const paginationContainer = document.querySelector('.list-vocabulary');
const submitBtn = document.getElementById('submit-btn');
const answeredCountEl = document.getElementById('answered-count');

// ==================== LẤY 10 CÂU HỎI ====================
async function fetchQuestions() {
    const params = new URLSearchParams(window.location.search);
    const topicId = params.get('topicId');

    if (!topicId) {
        showError('Không tìm thấy topicId trong URL');
        return;
    }

    try {
        const res = await fetch(`http://localhost:5001/listening/questions/study/${topicId}`);
        if (!res.ok) throw new Error('Lỗi tải câu hỏi');
        questions = await res.json();

        if (questions.length === 0) {
            showError('Không có câu hỏi cho chủ đề này');
            return;
        }

        document.querySelector('.name-feature').textContent =
            `Listening - ${questions[0].exerciseTitle || 'Practice'}`;

        setupPagination();
        loadQuestion(0);
    } catch (err) {
        console.error(err);
        showError('Không thể kết nối server');
    }
}

function showError(msg) {
    transcriptContent.innerHTML = `<p style="color:#e74c3c;text-align:center;margin-top:50px;">${msg}</p>`;
}

// ==================== TẢI CÂU HỎI ====================
function loadQuestion(idx) {
    // allow viewing questions after submission, but prevent changes
    currentIndex = idx;
    const q = questions[idx];

    // Audio
    if (q.audioUrl) {
        audio.innerHTML = `<source src="${q.audioUrl}" type="audio/mpeg">`;
        audio.load();
    } else {
        audio.innerHTML = '<p style="color:#e74c3c;">Không có audio</p>';
    }

    // Hình ảnh minh họa
    transcriptContent.innerHTML = q.imageUrl
        ? `<img src="${q.imageUrl}" alt="Hình minh họa" style="max-width:100%;border-radius:16px;box-shadow:0 8px 25px rgba(0,0,0,.15);">`
        : '<p style="color:#95a5a6;text-align:center;margin-top:40px;">Không có hình minh họa</p>';

    // Options A-D
    buttons.forEach(btn => {
        const choice = btn.dataset.choice;
        btn.querySelector('.text').textContent = q[`option${choice}`] || '—';

        // clear previous state but keep 'active' if user had selected this
        btn.classList.remove('active', 'correct', 'wrong');

        // if already submitted, disable buttons to prevent changes
        btn.disabled = hasSubmitted ? true : false;

        if (userAnswers[q.questionId] === choice) {
            btn.classList.add('active');
        }

        // if the quiz has been submitted and we have correct answers, mark correct/wrong
        if (hasSubmitted && correctAnswers && correctAnswers[q.questionId] != null) {
            const correctChoice = correctAnswers[q.questionId];
            if (choice === correctChoice) {
                btn.classList.add('correct');
            } else if (userAnswers[q.questionId] === choice && userAnswers[q.questionId] !== correctChoice) {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        }
    });

    updatePagination();
    updateAnsweredCount();
}

// ==================== CHỌN ĐÁP ÁN ====================
buttons.forEach(btn => {
    btn.addEventListener('click', function () {
        if (hasSubmitted) return;

        const choice = this.dataset.choice;
        const questionId = questions[currentIndex].questionId;

        if (this.classList.contains('active')) {
            this.classList.remove('active');
            userAnswers[questionId] = null;
        } else {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            userAnswers[questionId] = choice;
        }

        updateAnsweredCount();
    });
});

function updateAnsweredCount() {
    const answered = Object.values(userAnswers).filter(a => a != null).length;
    answeredCountEl.textContent = answered;
    submitBtn.disabled = answered < questions.length;
}

// ==================== NỘP BÀI ====================
submitBtn.addEventListener('click', async () => {
    if (hasSubmitted || submitBtn.disabled) return;

    const payload = {
        exerciseId: questions[0].exerciseId,
        userId: "current-user-id", // ← thay bằng userId thật khi có auth
        answers: questions.map(q => ({
            questionId: q.questionId,
            selectedOption: userAnswers[q.questionId] || null
        }))
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang chấm...';

        const res = await fetch('http://localhost:5001/listening-submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Nộp bài thất bại');

        const data = await res.json();

        hasSubmitted = true;

        showResult(data);

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> ĐÃ NỘP';

        loadQuestion(currentIndex);

    } catch (err) {
        console.error(err);
        alert('Có lỗi khi nộp bài. Vui lòng thử lại.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> NỘP BÀI';
    }
});

function showResult(data) {
    const message = data.totalScore >= 8 ? 'Xuất sắc!' 
                  : data.totalScore >= 6 ? 'Tốt lắm!' 
                  : 'Cố gắng hơn nhé!';

    transcriptContent.innerHTML = `
        <div style="text-align:center;padding:30px;background:rgba(15,166,166,0.1);border-radius:20px;">
            <h2 style="color:#0FA6A6;margin-bottom:16px;font-size:28px;">KẾT QUẢ</h2>
            <p style="font-size:56px;font-weight:900;color:#12448A;margin:20px 0;">
                ${data.totalScore} / ${data.maxScore}
            </p>
            <p style="font-size:26px;color:#2c3e50;">
                Đúng ${data.percent.toFixed(1)}%
            </p>
            <p style="margin-top:24px;font-size:18px;color:#7f8c8d;">
                ${message}
            </p>
        </div>
    `;
}

// ==================== PHÂN TRANG ====================
function setupPagination() {
    const oldBtns = paginationContainer.querySelectorAll('button:not(.icon-left):not(.icon-right)');
    oldBtns.forEach(b => b.remove());

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => loadQuestion(i - 1));
        paginationContainer.insertBefore(btn, rightArrow);
    }
}

function updatePagination() {
    const nums = paginationContainer.querySelectorAll('button:not(.icon-left):not(.icon-right)');
    nums.forEach((b, i) => b.classList.toggle('active', i === currentIndex));

    leftArrow.disabled = currentIndex === 0;
    rightArrow.disabled = currentIndex === 9;
}

leftArrow.onclick = () => currentIndex > 0 && loadQuestion(currentIndex - 1);
rightArrow.onclick = () => currentIndex < 9 && loadQuestion(currentIndex + 1);

// ==================== KHỞI ĐỘNG ====================
fetchQuestions();