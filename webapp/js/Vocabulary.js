

window.addEventListener("DOMContentLoaded", () => {
    const btnA1 = document.getElementById('A1');
    const btnA2 = document.getElementById('A2');
    const btnB1 = document.getElementById('B1');
    const btnB2 = document.getElementById('B2');
    const btnC1 = document.getElementById('C1');
    const btnC2 = document.getElementById('C2');

    btnA1.onclick = () => {
        
    }
    btnA2.onclick = () => {

    }
    btnB1.onclick = () => {

    }
    btnB2.onclick = () => {

    }
    btnC1.onclick = () => {

    }
    btnC2.onclick = () => {

    }
})

 // ==================== DROPDOWN MENU ====================
        document.addEventListener('DOMContentLoaded', function() {
            const extensionIcon = document.getElementById('extension-icon');
            extensionIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const list = this.parentElement.querySelector('.list');
                list.style.display = list.style.display === 'block' ? 'none' : 'block';
            });
            document.addEventListener('click', function() {
                document.querySelectorAll('.list').forEach(list => list.style.display = 'none');
            });
        });

        // ==================== DỮ LIỆU 50 CÂU (bạn thay bằng thật sau) ====================
        const vocabularyData = Array.from({length: 50}, (_, i) => ({
            word: `WORD ${i + 1}`,
            hint: `Đây là gợi ý ngữ cảnh cho từ vựng số ${i + 1}. Ví dụ: bạn dùng từ này khi...`
        }));
        // Ví dụ thật (bạn có thể thay toàn bộ mảng này):
        // vocabularyData[0] = { word: "APPLE", hint: "Trái cây màu đỏ hoặc xanh, ăn ngon." };

        // ==================== CÁC BIẾN TOÀN CỤC ====================
        const TOTAL_QUESTIONS = 50;
        const PER_PAGE = 10;
        let currentPage = 1;
        let currentIndex = 0; // từ 0 đến 49

        const wordDisplay = document.querySelector('.word p');
        const inputField = document.querySelector('.vocabulary input');
        const frameAnswer = document.querySelector('.frame-answer p');
        const helpMeBtn = document.querySelector('.help-me button');
        const listVocabulary = document.querySelector('.list-vocabulary');
        const btnLeft = document.querySelector('.icon-left');
        const btnRight = document.querySelector('.icon-right');

        // ==================== TẢI CÂU HIỆN TẠI ====================
        function loadQuestion(index) {
            currentIndex = index;
            const data = vocabularyData[index];
            wordDisplay.textContent = data.word;
            wordDisplay.dataset.index = index;
            inputField.value = '';
            inputField.focus();

            // Reset gợi ý
            frameAnswer.textContent = "Gợi ý ngữ cảnh để bạn tự nhận biết được nghĩa từ vựng. không gợi ý từ khóa chính xác!";
            helpMeBtn.disabled = false;
            helpMeBtn.textContent = "Help Me";

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

        // ==================== NÚT HELP ME ====================
        helpMeBtn.addEventListener('click', function() {
            frameAnswer.textContent = vocabularyData[currentIndex].hint;
            this.disabled = true;
            this.textContent = "Đã hiện gợi ý";
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

        // ==================== NÚT TRÁI/PHẢI DƯỚI TỪ VỰNG ====================
        document.querySelector('.prev-btn').addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + TOTAL_QUESTIONS) % TOTAL_QUESTIONS;
            loadQuestion(newIndex);
        });

        document.querySelector('.next-btn').addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % TOTAL_QUESTIONS;
            loadQuestion(newIndex);
        });

        // ==================== KHỞI ĐỘNG ====================
        updatePagination();
        loadQuestion(0);

          const params = new URLSearchParams(window.location.search);
    const level = params.get("level");

    if (level) {
        document.querySelector(".name-feature").textContent = "Vocabulary - " + level;
    }