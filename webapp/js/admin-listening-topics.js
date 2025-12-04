const API_URL = 'http://localhost:5001/listening/topics';
const modal = document.getElementById('topic-modal');
const form = document.getElementById('topic-form');
const tbody = document.querySelector('#topics-table tbody');
const modalTitle = document.getElementById('modal-title');
const submitText = document.getElementById('submit-text');

// Format ngày đẹp
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

// Load danh sách
async function loadTopics() {
    try {
    const res = await fetch(API_URL);
    const topics = await res.json();
    topics.reverse();

    tbody.innerHTML = '';
    topics.forEach(topic => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
        <td data-label="ID">${topic.topicId}</td>
        <td data-label="Tên chủ đề" class="topic-name">${topic.topicName}</td>
        <td data-label="Mô tả" class="topic-desc">${topic.description || '<em>Không có</em>'}</td>
        <td data-label="Ngày tạo">${formatDate(topic.createdAt)}</td>
        <td data-label="Hành động" class="actions">
            <button class="btn btn-edit" onclick="openEditModal(${topic.topicId})">
            <i class="fas fa-edit"></i> Sửa
            </button>
            <button class="btn btn-danger" onclick="deleteTopic(${topic.topicId})">
            <i class="fas fa-trash"></i> Xóa
            </button>
        </td>
        `;
        tbody.appendChild(tr);
    });
    } catch (err) {
    alert('Không thể tải dữ liệu. Kiểm tra backend đang chạy chưa?');
    console.error(err);
    }
}

// Mở modal thêm
document.getElementById('open-modal').onclick = () => {
    form.reset();
    document.getElementById('topic-id').value = '';
    modalTitle.textContent = 'Thêm chủ đề mới';
    submitText.textContent = 'Thêm chủ đề';
    modal.classList.add('active');
};

// Đóng modal
document.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
window.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

// Submit form (thêm hoặc sửa)
form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('topic-id').value;
    const data = {
    topicName: document.getElementById('topic-name').value,
    description: document.getElementById('topic-desc').value || null
    };

    try {
    let res;
    if (id) {
        // Cập nhật
        res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });
    } else {
        // Thêm mới
        res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });
    }

    if (res.ok) {
        alert(id ? 'Cập nhật thành công!' : 'Thêm chủ đề thành công!');
        modal.classList.remove('active');
        loadTopics();
    } else {
        const err = await res.text();
        alert('Lỗi: ' + err);
    }
    } catch (err) {
    alert('Lỗi kết nối!');
    console.error(err);
    }
};

// Mở modal sửa
window.openEditModal = async (id) => {
    try {
    const res = await fetch(`${API_URL}/${id}`);
    const topic = await res.json();

    document.getElementById('topic-id').value = topic.topicId;
    document.getElementById('topic-name').value = topic.topicName;
    document.getElementById('topic-desc').value = topic.description || '';
    modalTitle.textContent = 'Chỉnh sửa chủ đề';
    submitText.textContent = 'Cập nhật';
    modal.classList.add('active');
    } catch (err) {
    alert('Không thể tải thông tin chủ đề');
    }
};

// Xóa chủ đề
window.deleteTopic = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa chủ đề này?')) return;

    try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
        alert('Xóa thành công!');
        loadTopics();
    } else {
        alert('Xóa thất bại');
    }
    } catch (err) {
    alert('Lỗi kết nối');
    }
};

// Load khi mở trang
loadTopics();