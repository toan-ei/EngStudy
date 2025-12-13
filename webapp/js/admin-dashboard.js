const API_BASE = 'http://localhost:5001/stats';
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
}


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
