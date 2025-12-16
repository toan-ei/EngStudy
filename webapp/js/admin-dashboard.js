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

let currentPage = 1;
const pageSize = 20;
let totalPage = 0;
let totalElement = 0;


const userTableBody = document.getElementById('userTableBody');
const userSearch = document.getElementById('userSearch');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');

console.log('User Table initialized');
getAllProfile();
setupEventListeners();

// Setup Event Listeners
function setupEventListeners() {
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => changePage(-1));
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => changePage(1));
  }
}

async function getUser(userId) {
  const response = await fetch(`${config.api.getUser}${userId}`, {
    method: "GET",
    headers:{
      'Authorization': `Bearer ${tokenAdmin}`,
      "Content-Type": "application/json"
    }
  })
  const data = await response.json();
  return data.result.gmail;
}


async function getAllProfile() {
  const response = await fetch(
    `${config.api.getAllProfile}?page=${currentPage}&size=${pageSize}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  console.log("data users\n", data);

  const rows = await Promise.all(
    data.result.data.map(async (profile) => {
      const gmail = await getUser(profile.userId);

      return `
        <tr data-user-id="${profile.profileId}">
          <td>
            <img src="${profile.avatar || 'https://i.pravatar.cc/150?img=1'}" 
                 alt="${profile.fullName}" 
                 class="esadmin-user-avatar"
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=8b5cf6&color=fff&size=150'">
          </td>
          <td>
            <strong class="esadmin-user-name">
              ${escapeHtml(profile.fullName || "vô danh")}
            </strong>
          </td>
          <td>
            <span class="esadmin-user-gmail">
              ${escapeHtml(gmail)}
            </span>
          </td>
          <td>${getRoleBadge("User")}</td>
          <td>
            <div class="esadmin-action-btns">
              <button class="esadmin-btn-icon esadmin-btn-delete"
                      onclick="deleteUser('${profile.profileId}')"
                      title="Xóa"
                      aria-label="Xóa ${profile.fullName}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
  );

  userTableBody.innerHTML = rows.join("");

  totalPage = data.result.totalPage;
  totalElement = data.result.totalElement;
  updatePagination(totalPage);
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

function getRoleBadge(role) {
  const roleMap = {
    student: { class: 'esadmin-role-student', text: 'User' }
  };
  const roleInfo = roleMap[role] || roleMap.student;
  return `<span class="esadmin-role ${roleInfo.class}">${roleInfo.text}</span>`;
}
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


/*function handleSearch(e) {
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
}*/

function changePage(direction) {
  const newPage = currentPage + direction;

  if (newPage >= 1 && newPage <= totalPage) {
    currentPage = newPage;
    getAllProfile();

    const tableContainer = document.querySelector('.esadmin-table-container');
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

window.deleteUser = async function (profileId) {
  const confirmDelete = confirm("Bạn có chắc chắn muốn xóa người dùng này?");
  if (!confirmDelete) return;

  const response = await fetch(`${config.api.deleteProfile}${profileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${tokenAdmin}`,
      "Content-Type": "application/json",
    }
  });

  const data = await response.json();
  alert("Xóa thành công");
  getAllProfile();
};

console.log('User Table JS loaded successfully');

