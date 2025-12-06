

        // Dropdown menu
        document.getElementById('extension-icon').addEventListener('click', function(e) {
            e.stopPropagation();
            const list = this.parentElement.querySelector('.list');
            list.style.display = list.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function() {
            const lists = document.querySelectorAll('.list');
            lists.forEach(list => list.style.display = 'none');
        });

        // Language button click (demo)
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('Selected:', this.querySelector('h3').textContent);
            });
        });


    // Lấy level đã chọn từ trang trước
    const level = localStorage.getItem("selectedLevel");

    // Thay đổi tiêu đề Translate → Translate - A1
    if (level) {
        document.querySelector(".name-feature").textContent = "Translate - " + level;
    }

    // Dropdown menu
    document.getElementById('extension-icon').addEventListener('click', function(e) {
        e.stopPropagation();
        const list = this.parentElement.querySelector('.list');
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function() {
        const lists = document.querySelectorAll('.list');
        lists.forEach(list => list.style.display = 'none');
    });

    // Language button click
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    