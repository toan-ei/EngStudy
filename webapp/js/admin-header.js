document.addEventListener("DOMContentLoaded", function () {
// 1. Load Header
fetch("./components/AdminHeader.html")
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML("afterbegin", html);

    // Sau khi header được chèn thì mới chạy các hàm sau
    highlightActiveMenu();
    setupMobileHeader();
  })
  .catch(err => console.error("Lỗi load header:", err));

// 2. Highlight menu trang hiện tại
function highlightActiveMenu() {
  const current = location.href.split("/").pop() || "AdminIndex.html";
  document.querySelectorAll(".header-nav .nav-link").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

// 3. Mobile menu toggle
function setupMobileHeader() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const nav = document.querySelector(".header-nav");
  const overlay = document.getElementById("header-overlay");

  if (toggle && nav && overlay) {
    toggle.onclick = () => {
      nav.classList.toggle("active");
      overlay.classList.toggle("active");
    };
    overlay.onclick = () => {
      nav.classList.remove("active");
      overlay.classList.remove("active");
    };
  }
}
});