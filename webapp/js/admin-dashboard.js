import { loadConfig } from "./configloader.js";
const config = await loadConfig();

/*const API_BASE = 'http://localhost:5001/stats';
const currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.esadmin-container');

  // ==============================
  // THÊM KHỐI CHART VÀO HTML
  // ==============================
  container.insertAdjacentHTML('beforeend', `
    <div class="esadmin-chart-container">
      <h3 class="esadmin-chart-title">
        Thống kê nội dung cho Listening năm 
        <span id="chartYear">${currentYear}</span>
        <select id="yearSelect" class="esadmin-year-select">
          ${[2022,2023,2024,2025,2026].map(y => 
            `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`
          ).join('')}
        </select>
      </h3>

      <canvas id="yearlyChart"></canvas>
      <div class="esadmin-loading" id="chartLoading">Đang tải biểu đồ...</div>
    </div>
  `);

  // Load tổng số liệu dashboard
  loadAllStats();

  // Chờ Chart.js load xong rồi mới vẽ chart
  waitForChartJs(() => {
    loadYearlyChart(currentYear);

    document.getElementById('yearSelect').addEventListener('change', (e) => {
      const newYear = Number(e.target.value);
      document.getElementById('chartYear').textContent = newYear;
      loadYearlyChart(newYear);
    });
  });
});


// =====================================================
// ANIMATION SỐ TỔNG
// =====================================================
function animateNumber(el, target) {
  let start = 0;
  const duration = 1800;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString('vi-VN');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString('vi-VN');
    }
  }, 16);
}


// =====================================================
// LOAD TỔNG SỐ TOPIC / EXERCISE / QUESTION / FILE
// =====================================================
async function loadAllStats() {
  const cards = document.querySelectorAll('.esadmin-stat-card .esadmin-stat-number');

  try {
    const [
      topicTotal,
      exerciseTotal,
      questionTotal,
      fileTotal
    ] = await Promise.all([
      fetch(`${API_BASE}/topic/total`).then(r => r.json()),
      fetch(`${API_BASE}/exercise/total`).then(r => r.json()),
      fetch(`${API_BASE}/question/total`).then(r => r.json()),
      fetch(`${API_BASE}/file/total`).then(r => r.json()),
    ]);

    animateNumber(cards[0], exerciseTotal);
    animateNumber(cards[1], questionTotal);
    animateNumber(cards[2], fileTotal);
    animateNumber(cards[3], topicTotal);

  } catch (err) {
    console.error('Lỗi tải stats:', err);
    cards.forEach(c => c.textContent = '—');
  }
}



// =====================================================
// LOAD BIỂU ĐỒ THEO NĂM
// =====================================================
async function loadYearlyChart(year) {
  const loading = document.getElementById('chartLoading');
  loading.style.display = 'block';

  try {
    const [topics, exercises, questions, files] = await Promise.all([
      fetch(`${API_BASE}/topic/month?year=${year}`).then(r => r.json()),
      fetch(`${API_BASE}/exercise/month?year=${year}`).then(r => r.json()),
      fetch(`${API_BASE}/question/month?year=${year}`).then(r => r.json()),
      fetch(`${API_BASE}/file/month?year=${year}`).then(r => r.json()),
    ]);

    if (!Array.isArray(topics) || topics.length !== 12) {
      console.warn("API không trả đúng 12 tháng cho topics:", topics);
    }

    const ctx = document.getElementById('yearlyChart').getContext('2d');

    // Destroy chart cũ để không bị lỗi overlay
    if (window.yearlyChart instanceof Chart) window.yearlyChart.destroy();

    window.yearlyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'],
        datasets: [
          { label: 'Chủ đề',       data: topics,    backgroundColor: 'rgba(139,92,246,0.8)',  borderRadius: 8 },
          { label: 'Bài tập nghe', data: exercises, backgroundColor: 'rgba(236,72,153,0.8)',  borderRadius: 8 },
          { label: 'Câu hỏi',      data: questions, backgroundColor: 'rgba(34,211,238,0.8)',  borderRadius: 8 },
          { label: 'File âm thanh',data: files,     backgroundColor: 'rgba(74,222,128,0.8)',  borderRadius: 8 }
        ]
      },
      options: {
        responsive: true,
          maintainAspectRatio: true, 
          aspectRatio: 3,  
        plugins: {
          legend: {
            labels: {
              color: '#e0e7ff',
              font: { size: 14 }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#c4b5fd' }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: { color: '#c4b5fd', stepSize: 10 }
          }
        },
        animation: { duration: 1800 }
      }
    });

  } catch (err) {
    console.error('Lỗi biểu đồ:', err);
    loading.textContent = 'Không tải được biểu đồ';
  } finally {
    loading.style.display = 'none';
  }
} */


// =====================================================
// ĐỢI CHART.JS LOAD XONG
// (tránh lỗi "Chart is not defined")
// =====================================================
function waitForChartJs(callback) {
  const check = setInterval(() => {
    if (window.Chart) {
      clearInterval(check);
      callback();
    }
  }, 50);
}

const tokenAdmin = localStorage.getItem('tokenAdmin');
console.log("token admin\n", tokenAdmin)

// Sample user data (replace with actual API call)
let usersData = [
  {
    id: 1,
    fullname: "Nguyễn Văn An",
    gmail: "nguyenvanan@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "student"
  },
  {
    id: 2,
    fullname: "Trần Thị Bình",
    gmail: "tranthibinh@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "teacher"
  },
  {
    id: 3,
    fullname: "Lê Văn Cường",
    gmail: "levancuong@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=33",
    role: "admin"
  },
  {
    id: 4,
    fullname: "Phạm Thị Diệu",
    gmail: "phamthidieu@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    role: "student"
  },
  {
    id: 5,
    fullname: "Hoàng Văn Em",
    gmail: "hoangvanem@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=68",
    role: "student"
  },
  {
    id: 6,
    fullname: "Đặng Thị Phương",
    gmail: "dangthiphuong@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    role: "teacher"
  },
  {
    id: 7,
    fullname: "Võ Văn Giang",
    gmail: "vovangiang@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=51",
    role: "student"
  },
  {
    id: 8,
    fullname: "Bùi Thị Hà",
    gmail: "buithiha@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=24",
    role: "student"
  },
  {
    id: 9,
    fullname: "Ngô Văn Hùng",
    gmail: "ngovanhung@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    role: "teacher"
  },
  {
    id: 10,
    fullname: "Phan Thị Lan",
    gmail: "phanthilan@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=44",
    role: "student"
  },
  {
    id: 11,
    fullname: "Trương Văn Minh",
    gmail: "truongvanminh@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    role: "admin"
  },
  {
    id: 12,
    fullname: "Lý Thị Nga",
    gmail: "lythinga@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    role: "student"
  }
];

function getAllProfile(){
  fetch(config.api.getAllProfile, {
    method: "GET",
    headers:{
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
  .then((respoonse) => {
    return respoonse.json()
  })
  .then((data) => {

  })
}

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredUsers = [...usersData];

const userTableBody = document.getElementById('userTableBody');
const userSearch = document.getElementById('userSearch');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
e
document.addEventListener('DOMContentLoaded', () => {
  console.log('User Table initialized');
  renderUsers();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  if (userSearch) {
    userSearch.addEventListener('input', handleSearch);
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => changePage(-1));
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => changePage(1));
  }
}

// Render Users Table
function renderUsers() {
  if (!userTableBody) return;

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

  if (usersToDisplay.length === 0) {
    userTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fas fa-user-slash" style="font-size: 3rem; margin-bottom: 16px; display: block; opacity: 0.5;"></i>
          <div style="font-size: 1.1rem; font-weight: 600;">Không tìm thấy người dùng</div>
          <div style="font-size: 0.9rem; opacity: 0.7; margin-top: 8px;">Thử tìm kiếm với từ khóa khác</div>
        </td>
      </tr>
    `;
  } else {
    userTableBody.innerHTML = usersToDisplay.map(user => `
      <tr data-user-id="${user.id}">
        <td>
          <img src="${user.avatar || 'https://i.pravatar.cc/150?img=1'}" 
               alt="${user.fullname}" 
               class="esadmin-user-avatar"
               onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=8b5cf6&color=fff&size=150'">
        </td>
        <td><strong class="esadmin-user-name">${escapeHtml(user.fullname)}</strong></td>
        <td><span class="esadmin-user-gmail">${escapeHtml(user.gmail)}</span></td>
        <td>${getRoleBadge(user.role)}</td>
        <td>
          <div class="esadmin-action-btns">
            <button class="esadmin-btn-icon esadmin-btn-edit" 
                    onclick="editUser(${user.id})" 
                    title="Chỉnh sửa"
                    aria-label="Chỉnh sửa ${user.fullname}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="esadmin-btn-icon esadmin-btn-delete" 
                    onclick="deleteUser(${user.id})" 
                    title="Xóa"
                    aria-label="Xóa ${user.fullname}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  updatePagination(totalPages);
}

function updatePagination(totalPages) {
  if (currentPageSpan) {
    currentPageSpan.textContent = currentPage;
  }

  if (totalPagesSpan) {
    totalPagesSpan.textContent = totalPages || 1;
  }

  if (prevPageBtn) {
    prevPageBtn.disabled = currentPage === 1;
  }

  if (nextPageBtn) {
    nextPageBtn.disabled = currentPage >= totalPages || totalPages === 0;
  }
}

// Get Role Badge HTML
function getRoleBadge(role) {
  const roleMap = {
    admin: { class: 'esadmin-role-admin', text: 'Quản trị viên' },
    teacher: { class: 'esadmin-role-teacher', text: 'Giáo viên' },
    student: { class: 'esadmin-role-student', text: 'Học viên' }
  };
  const roleInfo = roleMap[role] || roleMap.student;
  return `<span class="esadmin-role ${roleInfo.class}">${roleInfo.text}</span>`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handle Search
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();

  if (searchTerm === '') {
    filteredUsers = [...usersData];
  } else {
    filteredUsers = usersData.filter(user =>
      user.fullname.toLowerCase().includes(searchTerm) ||
      user.gmail.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  }

  currentPage = 1;
  renderUsers();
}

// Change Page
function changePage(direction) {
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const newPage = currentPage + direction;

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderUsers();

    // Smooth scroll to top of table
    const tableContainer = document.querySelector('.esadmin-table-container');
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Edit User (placeholder - implement your own logic)
function editUser(userId) {
  const user = usersData.find(u => u.id === userId);
  if (user) {
    console.log('Edit user:', user);
    alert(`Chỉnh sửa người dùng: ${user.fullname}\n\nChức năng này cần được implement.`);
    // TODO: Implement edit functionality
  }
}

// Delete User (placeholder - implement your own logic)
function deleteUser(userId) {
  const user = usersData.find(u => u.id === userId);
  if (!user) return;

  const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.fullname}"?`);

  if (confirmDelete) {
    // Remove from data arrays
    usersData = usersData.filter(u => u.id !== userId);
    filteredUsers = filteredUsers.filter(u => u.id !== userId);

    // Adjust page if needed
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }
    renderUsers();

    console.log('Deleted user:', user);
    alert(`Đã xóa người dùng: ${user.fullname}`);
  }
}

window.editUser = editUser;
window.deleteUser = deleteUser;

console.log('User Table JS loaded successfully');

