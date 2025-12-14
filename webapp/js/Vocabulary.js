import { loadConfig } from "./configloader.js";
const config = await loadConfig();

const vocabularyData = JSON.parse(localStorage.getItem("questions")) || [];
console.log("questions: \n", vocabularyData);

// ==================== CÁC BIẾN TOÀN CỤC ====================
const TOTAL_QUESTIONS = 50;
const PER_PAGE = 10;
let currentPage = 1;
let currentIndex = 0; 

const wordDisplay = document.querySelector('.word p');
const inputField = document.querySelector('.vocabulary input');
const frameAnswer = document.querySelector('.frame-answer p');
const helpMeBtn = document.querySelector('.help-me button');
const listVocabulary = document.querySelector('.list-vocabulary');
const btnLeft = document.querySelector('.icon-left');
const btnRight = document.querySelector('.icon-right');
const btnSubmit = document.getElementById('submit');
const resultSection = document.getElementById('resultSection');
const resultStatus = document.getElementById('resultStatus');
const resultWord = document.getElementById('resultWord');
const userAnswerSpan = document.getElementById('userAnswer');
const nextWordBtn = document.getElementById('nextWordBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');

function loadQuestion(index) {
    currentIndex = index;
    const data = vocabularyData[index];
    wordDisplay.textContent = data.word;
    wordDisplay.dataset.index = index;
    inputField.value = data.answer;
    inputField.focus();
    // Cập nhật phân trang
    updatePagination();
}

// ==================== CẬP NHẬT PHÂN TRANG ====================
function updatePagination() {
    // Xóa các nút số cũ
    document.querySelectorAll('.list-vocabulary button.number-btn').forEach(btn => btn.remove());

    const start = (currentPage - 1) * PER_PAGE + 1;
    const end = Math.min(start + PER_PAGE - 1, TOTAL_QUESTIONS);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('number-btn');
        btn.dataset.index = i - 1;

        if (i === currentIndex + 1) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            loadQuestion(i - 1);
            currentPage = Math.ceil(i / PER_PAGE);
        });

        listVocabulary.insertBefore(btn, btnRight);
    }

    // Ẩn/hiện nút mũi tên
    btnLeft.style.opacity = currentPage === 1 ? '0.4' : '1';
    btnLeft.disabled = currentPage === 1;
    btnRight.style.opacity = currentPage === Math.ceil(TOTAL_QUESTIONS / PER_PAGE) ? '0.4' : '1';
    btnRight.disabled = currentPage === Math.ceil(TOTAL_QUESTIONS / PER_PAGE);
}

function suggestVocabulary(word){
    const dataSuggest = {
        "word": word
    }
    const token = localStorage.getItem('token');
    fetch(config.api.suggestVocabulary, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSuggest)
    })
    .then((response) => {
        return response.json()
    })
    .then((response) => {
        console.log("response form AI: \n",response.result.message);
        const contentSuggest = document.getElementById("content-suggest");
        contentSuggest.innerHTML = marked.parse(response.result.message);
    })
    .catch((err) => {
        alert("error when call suggest from AI");
        console.log("err: \n", err);
    })
}

function submit(){
    let correctCount = 0;
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    for(let i = 0; i < 50; i++){
        const vocabulary = vocabularyData[i];
        const word = vocabulary.word;
        const answer = (vocabulary.answer || "").trim().toLowerCase();
        
        const meanings = Array.isArray(vocabulary.meanings)
            ? vocabulary.meanings.map(m => {
                  // m might be a string or object {meaning:...}
                  const raw = (typeof m === 'string') ? m : (m && (m.meaning || m.value || '')) ;
                  return (raw || '').toString().trim().toLowerCase();
              }).filter(Boolean) // remove '' and falsy values
            : [];

        console.log(`meanings: ${i} \n`, meanings);

        let isCorrect = false;
        if (answer !== "") {
            isCorrect = meanings.some(m => answer === m);
        } else {
            isCorrect = false;
        }

        if (isCorrect) correctCount++;

        const answerDiv = document.createElement('div');
        answerDiv.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
        answerDiv.innerHTML = `
            <div class="answer-number">#${i + 1}</div>
            <div class="answer-word">${word}</div>
            <div class="answer-user">
                <span class="answer-user-label">Your Answer:</span>
                <span class="answer-user-text">${answer || '(No answer)'}</span>
            </div>
            ${!isCorrect ? `
            <div class="answer-correct">
                <span class="answer-correct-label">Correct Answer:</span>
                <span class="answer-correct-text">${meanings.join(', ')}</span>
            </div>
            ` : '<div></div>'}
        `;
        answersContainer.appendChild(answerDiv);
    }

    // result header
    const percentage = Math.round((correctCount / vocabularyData.length) * 100);
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('resultPercentage').textContent = percentage + '%';
    
    const percentageEl = document.getElementById('resultPercentage');
    const messageEl = document.getElementById('resultMessage');
    
    if (percentage >= 80) {
        percentageEl.className = 'result-percentage pass';
        messageEl.textContent = 'Excellent! You did great! 🎉';
    } else if (percentage >= 60) {
        percentageEl.className = 'result-percentage pass';
        messageEl.textContent = 'Good job! Keep practicing! 👍';
    } else {
        percentageEl.className = 'result-percentage fail';
        messageEl.textContent = 'Keep studying and try again! 💪';
    }


    // Show result section
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.add('show');
    
    // Add class to container-content to make it clickable
    const containerContent = document.querySelector('.container-content');
    containerContent.classList.add('result-shown')


    setTimeout(() => {
        resultSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}


function showLevel(){
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level");

    if (level) {
        document.querySelector(".name-feature").textContent = "Vocabulary - " + level;
    }
}

// ==================== DROPDOWN MENU ====================
const extensionIcon = document.getElementById('extension-icon');
extensionIcon.addEventListener('click', function (e) {
    e.stopPropagation();
    const list = this.parentElement.querySelector('.list');
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', function () {
    document.querySelectorAll('.list').forEach(list => list.style.display = 'none');
});


// main
updatePagination();
loadQuestion(0);
showLevel();

// ==================== NÚT TRÁI/PHẢI DƯỚI TỪ VỰNG ====================
document.querySelector('.prev-btn').addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + TOTAL_QUESTIONS) % TOTAL_QUESTIONS;
    loadQuestion(newIndex);
});

document.querySelector('.next-btn').addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % TOTAL_QUESTIONS;
    loadQuestion(newIndex);
});

// ==================== NÚT MŨI TÊN TRÁI/PHẢI TRONG PHÂN TRANG ====================
btnLeft.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
});

btnRight.addEventListener('click', () => {
    if (currentPage < Math.ceil(TOTAL_QUESTIONS / PER_PAGE)) {
        currentPage++;
        updatePagination();
    }
});

inputField.addEventListener("blur", () => {
    const data = vocabularyData[currentIndex];
        if(inputField.value.trim().length > 0){
        data.answer = inputField.value.trim();
    }
})

// ==================== NÚT HELP ME ====================
helpMeBtn.addEventListener('click', function () {
    const wordSuggest = document.getElementById('word-suggest');
    const data = vocabularyData[currentIndex];
    wordSuggest.innerHTML = `<strong>Từ vựng:</strong> ${data.word}`;
    overlay.classList.add('active');
    suggestVocabulary(data.word);
});

const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');
const contentSuggest = document.getElementById("content-suggest");

closeBtn.addEventListener('click', function() {
    overlay.classList.remove('active');
    contentSuggest.textContent = "đang loading từ AI, vui vòng đợi trong vài giây ..................";
});

overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
        overlay.classList.remove('active');
        contentSuggest.textContent = "đang loading từ AI, vui vòng đợi trong vài giây ..................";
    }
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        contentSuggest.textContent = "đang loading từ AI, vui vòng đợi trong vài giây ..................";
    }
});

// submit 
btnSubmit.onclick = () => {
    const unanswered = vocabularyData.filter(vocabulary => vocabulary.answer === '').length;
    if(unanswered > 0){
        if (!confirm(`Bạn có ${unanswered} từ vựng chưa trả lời. Gửi bài ngay?`)) {
            return;
        }
    }
    submit();
}

document.addEventListener('dblclick', function(e) {
    const containerContent = document.querySelector('.container-content');
    
    if (!containerContent.classList.contains('result-shown')) return;

    const confirmBack = confirm('Bạn có muốn quay lại trang chọn level không?');
    if (confirmBack) {
        window.location.href = 'VocabularyChooseLevel.html';
        
        containerContent.classList.remove('result-shown');
        document.getElementById('resultSection').classList.remove('show');
    }
});

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = ""; 
});