// Lấy topicId từ URL
const params = new URLSearchParams(window.location.search);
const topicId = params.get("topicId") || 3;   // Mặc định = 3 nếu thiếu

// API theo topicId
const API_URL = `http://localhost:5001/listening/questions/grouped/${topicId}`;

let exercises = [];               // Danh sách 5 bài
let flatQuestions = [];           // Array chứa 10 câu hỏi
let currentIndex = 0;             // Đang ở câu số mấy (0 → 9)
let userAnswers = {};             // { questionId: "A" }
let answeredCount = 0;

// DOM elements
const audioEl = document.querySelector(".conversation-audio");
const titleEl = document.getElementById('question-title');
const optionButtons = document.querySelectorAll(".answers button");
const transcriptBox = document.querySelector(".transcript-content");
const answeredCountEl = document.getElementById("answered-count");
const prevBtn = document.querySelector(".icon-left");
const nextBtn = document.querySelector(".icon-right");
const paginationContainer = document.querySelector('.list-vocabulary');


// ========================
// FETCH DATA
// ========================
document.addEventListener("DOMContentLoaded", async () => {
    await loadExercises();
    setupEvents();
});


async function loadExercises() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();

        exercises = result.data;                 // Mỗi phần tử là 1 exercise
        flatQuestions = exercises.flatMap(ex => ex.questions);

        if (flatQuestions.length === 0) {
            transcriptBox.innerHTML =
                `<p style="text-align:center;color:red;margin-top:40px;">Không có dữ liệu cho topicId = ${topicId}</p>`;
            return;
        }

        // setup pagination first (create numeric buttons), then load first question
        setupPagination();
        loadQuestion(0);
        // set page header similar to listening-picture flow
        document.querySelector('.name-feature').textContent =
            `Listening - ${exercises[0]?.exerciseTitle || 'Conversation'}`;

    } catch (error) {
        console.error("Lỗi khi fetch data:", error);
        transcriptBox.innerHTML =
            `<p style="text-align:center;color:red;">Không tải được dữ liệu</p>`;
    }
}


// ========================
// LOAD QUESTION
// ========================
function loadQuestion(index) {
    currentIndex = index;
    const question = flatQuestions[index];

    // Xác định exercise tương ứng
    const exerciseIndex = Math.floor(index / 2);
    const exercise = exercises[exerciseIndex];

    // Lấy question text
    const questionText =
        question.questionText ||
        question.text ||
        question.question ||
        "";

    // Set audio
    audioEl.src = exercise.audioUrl;

    // Set header Listening name
    document.querySelector(".name-feature").textContent =
        `Listening - ${exercise.exerciseTitle || "Conversation"}`;

    // ⭐ Tiêu đề chính
    titleEl.textContent = `Câu ${index + 1}: ${questionText}`;

    const questionDesc =
        question.description || question.explain || question.hint || "";

    // Hiển thị phần transcript/hình ảnh
    transcriptBox.innerHTML = `
        ${exercise.imageUrl? `<div class="conversation-image"><img src="${exercise.imageUrl}" alt="Hình minh họa"></div>`: ""}
        ${questionDesc ? `<h2 style="margin:14px 0 6px;color:#1b3a57;font-family:Poppins, sans-serif;">${questionDesc}</h2>` : ''}
        ${question.transcript? `<div class="conversation-text">${question.transcript}</div>`: ""}
    `;

    // Render options
    optionButtons.forEach((btn) => {
        const choice = btn.dataset.choice;
        btn.querySelector(".text").textContent = question[`option${choice}`];

        btn.classList.remove("selected");

        if (userAnswers[question.questionId] === choice) {
            btn.classList.add("selected");
        }
    });

    updateAnsweredCount();
    updatePagination();
}


function setupPagination() {
    // remove old numeric buttons
    const oldBtns = paginationContainer.querySelectorAll('button:not(.icon-left):not(.icon-right)');
    oldBtns.forEach(b => b.remove());

    // create numeric page buttons (1..N) similar to listening-picture — one button per question
    const total = Math.min(flatQuestions.length, 10);
    for (let i = 1; i <= total; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => loadQuestion(i - 1));
        paginationContainer.insertBefore(btn, paginationContainer.querySelector('.icon-right'));
    }
}

function updatePagination() {
    const nums = paginationContainer.querySelectorAll('button:not(.icon-left):not(.icon-right)');
    nums.forEach((b, i) => b.classList.toggle('active', i === currentIndex));

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === flatQuestions.length - 1;
}


// ========================
// SELECT ANSWER
// ========================
function setupEvents() {
    // Chọn đáp án
    optionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const choice = btn.dataset.choice;
            const questionId = flatQuestions[currentIndex].questionId;

            userAnswers[questionId] = choice;

            optionButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");

            updateAnsweredCount();
        });
    });

    // Next / Prev
    nextBtn.addEventListener("click", () => {
        if (currentIndex < flatQuestions.length - 1) {
            loadQuestion(currentIndex + 1);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            loadQuestion(currentIndex - 1);
        }
    });

    // Submit
    document.getElementById("submit-btn").addEventListener("click", () => {
        if (answeredCount < 10) {
            alert("Bạn chưa trả lời đủ 10 câu!");
            return;
        }

        alert("Nộp bài thành công!");
    });
}


// ========================
// COUNT ANSWERED
// ========================
function updateAnsweredCount() {
    answeredCount = Object.keys(userAnswers).length;
    answeredCountEl.textContent = answeredCount;
}
