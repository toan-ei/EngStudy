// admin-questions.js - Quản lý Câu hỏi Nghe
const API_QUESTIONS = 'http://localhost:5001/listening/questions';
const API_EXERCISES = 'http://localhost:5001/listening/exercises';

const els = {
  modal: document.getElementById('question-modal'),
  form: document.getElementById('question-form'),
  tbody: document.querySelector('#questions-table tbody'),
  filterExercise: document.getElementById('filter-exercise'),
  exerciseSelect: document.getElementById('exercise-id'),
  modalTitle: document.getElementById('modal-title'),
  submitText: document.getElementById('submit-text'),
};

// Cache
let exercisesMap = {};

async function loadExercises() {
  try {
    const res = await fetch(API_EXERCISES);
    const exercises = await res.json();

    // Đổ vào filter và modal
    [els.filterExercise, els.exerciseSelect].forEach(select => {
      select.innerHTML = '<option value="">Tất cả / -- Chọn bài tập --</option>';
      exercises.forEach(ex => {
        exercisesMap[ex.exerciseId] = ex.title;
        const opt = document.createElement('option');
        opt.value = ex.exerciseId;
        opt.textContent = `${ex.exerciseId}. ${ex.title}`;
        select.appendChild(opt);
      });
    });
  } catch (err) {
    console.error('Không tải được bài tập', err);
  }
}

async function loadQuestions(exerciseId = '') {
  try {
    const url = new URL(API_QUESTIONS);
    if (exerciseId) url.searchParams.append('exerciseId', exerciseId);

    const res = await fetch(url);
    const questions = await res.json();

    els.tbody.innerHTML = '';

    questions.forEach(q => {
      const tr = document.createElement('tr');
        tr.innerHTML = `
          <td data-label="ID"><strong>#${q.questionId}</strong></td>
          <td data-label="Câu hỏi">${q.questionText}</td>
          <td data-label="Bài tập"><span class="topic-badge">${exercisesMap[q.exerciseId] || 'N/A'}</span></td>
          <td data-label="File ID">${q.fileId}</td>
          <td data-label="Đáp án"><span class="correct-badge">${q.correctOption}</span></td>
          <td data-label="Điểm">${q.score || 1}</td>
          <td data-label="Hành động">
            <div class="action-buttons">
              <button class="action-btn edit-btn" onclick="openEdit(${q.questionId})" title="Sửa">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn delete-btn" onclick="deleteQuestion(${q.questionId})" title="Xóa">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        `;
      els.tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Lỗi tải câu hỏi');
  }
}

// Lọc khi đổi select
els.filterExercise.onchange = (e) => loadQuestions(e.target.value);

// Mở modal thêm
document.getElementById('open-modal').onclick = () => {
  els.form.reset();
  document.querySelectorAll('input[name="correct"]').forEach(r => r.checked = false);
  document.getElementById('question-id').value = '';
  els.modalTitle.textContent = 'Thêm câu hỏi mới';
  els.submitText.textContent = 'Thêm câu hỏi';
  els.modal.classList.add('active');
};

// Mở modal sửa
window.openEdit = async (id) => {
  try {
    const res = await fetch(`${API_QUESTIONS}/${id}`, {
        cache: "no-store"
    });
    const q = await res.json();

    document.getElementById('question-id').value = q.questionId;
    document.getElementById('exercise-id').value = q.exerciseId;
    document.getElementById('question-text').value = q.questionText;
    document.getElementById('optionA').value = q.optionA;
    document.getElementById('optionB').value = q.optionB;
    document.getElementById('optionC').value = q.optionC;
    document.getElementById('optionD').value = q.optionD;
    document.querySelector(`input[name="correct"][value="${q.correctOption}"]`).checked = true;
    document.getElementById('file-id').value = q.fileId;
    document.getElementById('description').value = q.description || '';
    document.getElementById('score').value = q.score || '';
    document.getElementById('order-index').value = q.orderIndex || '';
    els.modalTitle.textContent = 'Chỉnh sửa câu hỏi';
    els.submitText.textContent = 'Cập nhật';
    els.modal.classList.add('active');
  } catch (err) {
    alert('Không tải được câu hỏi');
  }
};

// Submit form
els.form.onsubmit = async (e) => {
  e.preventDefault();

  const id = document.getElementById('question-id').value;
  const correct = document.querySelector('input[name="correct"]:checked')?.value;

  if (!correct) {
    alert('Vui lòng chọn đáp án đúng!');
    return;
  }

  const payload = {
    exerciseId: parseInt(document.getElementById('exercise-id').value),
    questionText: document.getElementById('question-text').value.trim(),
    optionA: document.getElementById('optionA').value.trim(),
    optionB: document.getElementById('optionB').value.trim(),
    optionC: document.getElementById('optionC').value.trim(),
    optionD: document.getElementById('optionD').value.trim(),
    correctOption: correct,
    fileId: parseInt(document.getElementById('file-id').value),
    description: document.getElementById('description').value.trim(),
    score: document.getElementById('score').value ? parseInt(document.getElementById('score').value) : undefined,
    orderIndex: document.getElementById('order-index').value ? parseInt(document.getElementById('order-index').value) : undefined,
  };

  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_QUESTIONS}/${id}` : API_QUESTIONS;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(id ? 'Cập nhật thành công!' : 'Thêm câu hỏi thành công!');
      els.modal.classList.remove('active');
      loadQuestions(els.filterExercise.value);
    } else {
      const txt = await res.text();
      alert('Lỗi: ' + txt);
    }
  } catch (err) {
    alert('Lỗi kết nối!');
  }
};

// Xóa câu hỏi
window.deleteQuestion = async (id) => {
  if (!confirm('Xóa câu hỏi này? Không thể hoàn tác!')) return;
  try {
    await fetch(`${API_QUESTIONS}/${id}`, { method: 'DELETE' });
    alert('Xóa thành công!');
    loadQuestions(els.filterExercise.value);
  } catch {
    alert('Xóa thất bại');
  }
};

// Đóng modal
document.querySelector('.close-modal').onclick = () => els.modal.classList.remove('active');
window.onclick = (e) => { if (e.target === els.modal) els.modal.classList.remove('active'); };

// Khởi động
loadExercises().then(() => loadQuestions());