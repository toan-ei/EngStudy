
// Điều hướng sang trang chọn ngôn ngữ sau khi chọn level
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

levels.forEach(level => {
    document.getElementById(level).addEventListener("click", function () {
        // Lưu level vào localStorage (nếu bạn cần dùng lại)
        localStorage.setItem("selectedLevel", level);

        // Điều hướng sang trang chọn ngôn ngữ
        window.location.href = "TranslateChooseLanguage.html";
    });
});
