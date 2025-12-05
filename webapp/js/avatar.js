// js/avatar.js - Avatar đẹp, lưu localStorage, chạy mọi trang
document.addEventListener("DOMContentLoaded", function () {
    // Tìm tất cả avatar trên trang (hỗ trợ nhiều trang có nhiều avatar)
    document.querySelectorAll('.avatar-wrapper').forEach(wrapper => {
        const preview = wrapper.querySelector('.avatar-preview') || wrapper.querySelector('.avatar');
        const input = wrapper.querySelector('input[type="file"]');

        if (!input) {
            // Nếu chưa có input → tự tạo ẩn
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            wrapper.appendChild(fileInput);
            input = fileInput;
        }

        const avatarEl = preview || wrapper.querySelector('.avatar');
        if (!avatarEl) return;

        // Load avatar đã lưu
        const saved = localStorage.getItem('engstudy_avatar');
        if (saved) {
            avatarEl.style.backgroundImage = `url(${saved})`;
        }

        // Click avatar → chọn ảnh
        avatarEl.addEventListener('click', () => input.click());

        // Khi chọn ảnh mới
        input.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = ev => {
                const url = ev.target.result;
                avatarEl.style.backgroundImage = `url(${url})`;
                localStorage.setItem('engstudy_avatar', url);

                // Hiệu ứng vui
                avatarEl.style.transform = 'scale(0.8) rotate(15deg)';
                setTimeout(() => avatarEl.style.transform = '', 300);
            };
            reader.readAsDataURL(file);
        });
    });
});