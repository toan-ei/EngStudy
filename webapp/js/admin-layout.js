document.addEventListener("DOMContentLoaded", function () {
  // Load sidebar
  fetch("./components/AdminSidebar.html")
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML("afterbegin", html);

      // Sau khi load xong thì xử lý active menu
      highlightActiveMenu();
      setupMobileMenu();
    })
    .catch(err => console.error("Lỗi load sidebar:", err));
});

function highlightActiveMenu() {
  const current = location.href.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  toggle.onclick = () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  };
  overlay.onclick = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  };
}