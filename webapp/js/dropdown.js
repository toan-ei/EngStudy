document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('extension-icon');
    const menu = btn.parentElement.querySelector('.list'); // lấy đúng <ul class="list">

    // Click vào nút ba chấm
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // quan trọng!

        // Toggle hiển thị bằng cách thêm/xóa đúng 3 thuộc tính bạn đã dùng trong :hover
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-12px)';
            document.body.classList.remove('menu-open');
        } else {
            menu.style.display = 'block';
            // Dùng requestAnimationFrame để transition chạy mượt
            requestAnimationFrame(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            });
            document.body.classList.add('menu-open');
        }
    });

    // Click ra ngoài anywhere → đóng menu
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-12px)';
            document.body.classList.remove('menu-open');
        }
    });

    // Bonus: nhấn ESC cũng đóng
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menu.style.display = 'none';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-12px)';
            document.body.classList.remove('menu-open');
        }
    });
});


