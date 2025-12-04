// admin-exercises.js - Quản lý Bài tập nghe
const API_EXERCISES = 'http://localhost:5001/listening/exercises';
const API_TOPICS = 'http://localhost:5001/listening/topics';

const els = {
  modal: document.getElementById('exercise-modal'),
  form: document.getElementById('exercise-form'),
  tbody: document.querySelector('#exercises-table tbody'),
  topicSelect: document.getElementById('topic-id'),
  modalTitle: document.getElementById('modal-title'),
  submitText: document.getElementById('submit-text'),
};

// Cache danh sách topic
let topicsMap = {};

// Format thời lượng đẹp
const formatDuration = (sec) => {
  if (!sec) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

// Load danh sách topics vào select
async function loadTopics() {
  try {
    const res = await fetch(API_TOPICS);
    const topics = await res.json();
    topicsMap = {};
    topics.forEach(t => {
      topicsMap[t.topicId] = t.topicName;
      const opt = document.createElement('option');
      opt.value = t.topicId;
      opt.textContent = t.topicName;
      els.topicSelect.appendChild(opt);
    });
  } catch (err) {
    alert('Không tải được danh sách chủ đề');
  }
}

// Load danh sách bài tập
async function loadExercises() {
  try {
    const res = await fetch(API_EXERCISES);
    const exercises = await res.json();

    els.tbody.innerHTML = '';

    exercises.forEach(ex => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="ID"><strong>${ex.exerciseId}</strong></td>
        <td data-label="Tiêu đề"><strong>${ex.title}</strong></td>
        <td data-label="Chủ đề"><span class="topic-badge">${topicsMap[ex.topicId] || 'Không xác định'}</span></td>
        <td data-label="Thời lượng" class="duration">${formatDuration(ex.durationSeconds)}</td>
        <td data-label="Ngày tạo">${formatDate(ex.createdAt)}</td>
        <td data-label="Hành động">
          <button class="btn btn-primary" onclick="openEdit(${ex.exerciseId})" style="padding:8px 16px;font-size:0.9rem;">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="btn btn-danger" onclick="deleteExercise(${ex.exerciseId})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      els.tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Lỗi tải bài tập: ' + err.message);
  }
}

// Mở modal thêm
document.getElementById('open-modal').onclick = () => {
  els.form.reset();
  document.getElementById('exercise-id').value = '';
  els.modalTitle.textContent = 'Thêm bài tập nghe mới';
  els.submitText.textContent = 'Thêm bài tập';
  els.modal.classList.add('active');
};

// Mở modal sửa
window.openEdit = async (id) => {
  try {
    const res = await fetch(`${API_EXERCISES}/${id}`);
    const ex = await res.json();

    document.getElementById('exercise-id').value = ex.exerciseId;
    document.getElementById('topic-id').value = ex.topicId;
    document.getElementById('title').value = ex.title;
    document.getElementById('description').value = ex.description || '';
    document.getElementById('duration').value = ex.durationSeconds || '';

    els.modalTitle.textContent = 'Chỉnh sửa bài tập';
    els.submitText.textContent = 'Cập nhật';
    els.modal.classList.add('active');
  } catch (err) {
    alert('Không thể tải thông tin bài tập');
  }
};

// Submit form
els.form.onsubmit = async (e) => {
  e.preventDefault();

  const id = document.getElementById('exercise-id').value;
  const payload = {
    topicId: parseInt(document.getElementById('topic-id').value),
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim() || null,
    durationSeconds: document.getElementById('duration').value ? parseInt(document.getElementById('duration').value) : null
  };

  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_EXERCISES}/${id}` : API_EXERCISES;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(id ? 'Cập nhật thành công!' : 'Thêm bài tập thành công!');
      els.modal.classList.remove('active');
      loadExercises();
    } else {
      const txt = await res.text();
      alert('Lỗi: ' + txt);
    }
  } catch (err) {
    alert('Lỗi kết nối!');
  }
};

// Xóa bài tập
window.deleteExercise = async (id) => {
  if (!confirm('Xóa bài tập này? Không thể hoàn tác!')) return;
  try {
    await fetch(`${API_EXERCISES}/${id}`, { method: 'DELETE' });
    alert('Xóa thành công!');
    loadExercises();
  } catch {
    alert('Xóa thất bại');
  }
};

// Đóng modal
document.querySelector('.close-modal').onclick = () => els.modal.classList.remove('active');
window.onclick = (e) => { if (e.target === els.modal) els.modal.classList.remove('active'); };

// Khởi động
Promise.all([loadTopics(), loadExercises()]);