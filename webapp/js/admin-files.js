// admin-files.js - Quản lý Files (Audio + Image)
const API_URL = 'http://localhost:5001/files';

// Pagination state
let page = 1;
let limit = 10;
let totalPages = 1;

const els = {
  modal: document.getElementById('file-modal'),
  form: document.getElementById('file-form'),
  tbody: document.querySelector('#files-table tbody'),
  modalTitle: document.getElementById('modal-title'),
  submitText: document.getElementById('submit-text'),
  audioInput: document.getElementById('audio-input'),
  imageInput: document.getElementById('image-input'),
  currentAudio: document.getElementById('current-audio'),
  currentImage: document.getElementById('current-image'),
  pageInfo: document.getElementById('page-info'),
  prevBtn: document.getElementById('prev-page'),
  nextBtn: document.getElementById('next-page'),
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Load danh sách file có phân trang
async function loadFiles() {
  try {
    const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
    const result = await res.json();

    const files = result.data;
    totalPages = result.totalPages;

    els.tbody.innerHTML = '';

    files.forEach((file) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td data-label="ID"><strong>${file.fileId}</strong></td>
        <td data-label="Audio">
          ${
            file.audioUrl
              ? `
            <audio controls class="audio-player" src="${file.audioUrl}"></audio>
            <small>${file.audioFilename || 'audio.mp3'}</small>
          `
              : '<em>Không có audio</em>'
          }
        </td>
        <td data-label="Hình">
          ${
            file.imageUrl
              ? `<img src="${file.imageUrl}" alt="img" class="preview-img">`
              : '<em>Không có ảnh</em>'
          }
        </td>
        <td data-label="Ngày tạo">${formatDate(file.createdAt)}</td>
        <td data-label="Hành động">
          <button class="btn btn-primary" onclick="openEdit(${file.fileId})" style="padding:8px 16px;font-size:0.9rem;">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button class="btn btn-danger" onclick="deleteFile(${file.fileId})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      els.tbody.appendChild(tr);
    });

    updatePaginationUI();
  } catch (err) {
    alert('Lỗi tải file: ' + err.message);
  }
}

// Cập nhật UI phân trang
function updatePaginationUI() {
  els.pageInfo.textContent = `Trang ${page} / ${totalPages}`;
  els.prevBtn.disabled = page <= 1;
  els.nextBtn.disabled = page >= totalPages;
}

// Điều hướng phân trang
els.prevBtn.onclick = () => {
  if (page > 1) {
    page--;
    loadFiles();
  }
};

els.nextBtn.onclick = () => {
  if (page < totalPages) {
    page++;
    loadFiles();
  }
};

// Mở modal upload mới
document.getElementById('open-modal').onclick = () => {
  els.form.reset();
  els.form.removeAttribute('data-id');
  els.modalTitle.textContent = 'Upload file mới';
  els.submitText.textContent = 'Upload';
  els.currentAudio.textContent = '';
  els.currentImage.textContent = '';
  els.modal.classList.add('active');
};

// Mở modal sửa
window.openEdit = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const file = await res.json();

    els.form.setAttribute('data-id', id);
    els.modalTitle.textContent = 'Chỉnh sửa file';
    els.submitText.textContent = 'Cập nhật';

    els.currentAudio.textContent = file.audioFilename
      ? `Hiện tại: ${file.audioFilename}`
      : 'Không có audio';

    els.currentImage.textContent = file.imageFilename
      ? `Hiện tại: ${file.imageFilename}`
      : 'Không có ảnh';

    els.modal.classList.add('active');
  } catch (err) {
    alert('Không thể tải thông tin file');
  }
};

// Submit form upload/update
els.form.onsubmit = async (e) => {
  e.preventDefault();

  const id = els.form.getAttribute('data-id');
  const formData = new FormData();
  const submitBtn = document.getElementById('submit-btn');

  if (els.audioInput.files[0]) formData.append('audio', els.audioInput.files[0]);
  if (els.imageInput.files[0]) formData.append('image', els.imageInput.files[0]);

  if (!id && formData.entries().next().done) {
    alert('Vui lòng chọn ít nhất 1 file');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, { method, body: formData });

    if (res.ok) {
      alert(id ? 'Cập nhật thành công!' : 'Upload thành công!');
      els.modal.classList.remove('active');
      loadFiles();
    } else {
      alert('Lỗi: ' + (await res.text()));
    }
  } catch (err) {
    alert('Lỗi kết nối!');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
};

// Xóa file
window.deleteFile = async (id) => {
  if (!confirm('Xóa file này? Không thể hoàn tác!')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('Xóa thành công!');
    loadFiles();
  } catch {
    alert('Xóa thất bại');
  }
};

// Đóng modal
document.querySelector('.close-modal').onclick = () =>
  els.modal.classList.remove('active');
window.onclick = (e) => {
  if (e.target === els.modal) els.modal.classList.remove('active');
};

// Bắt đầu
loadFiles();
