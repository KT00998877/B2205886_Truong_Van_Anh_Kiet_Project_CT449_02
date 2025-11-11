<template>
    <div class="theodoimuonsach-container">
        <h2>📘 Quản lý mượn sách</h2>

        <!-- Nút thêm -->
        <div class="toolbar">
            <button class="btn-add" @click="openAddForm">➕ Thêm phiếu mượn</button>
        </div>

        <!-- Bảng danh sách -->
        <table class="borrow-table">
            <thead>
                <tr>
                    <th>Độc giả</th>
                    <th>Mã sách</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record._id">
                    <td>{{ record.MaDocGia }}</td>
                    <td>{{ record.MaSach?.TenSach || record.MaSach }}</td>
                    <td>{{ formatDate(record.NgayMuon) }}</td>
                    <td>{{ formatDate(record.HanTra) }}</td>
                    <td>
                        <span class="btn btn-sm" :class="{
                            'btn-warning': record.TrangThai === 'Chờ duyệt',
                            'btn-info': record.TrangThai === 'Đã duyệt - Đã mượn',
                            'btn-success': record.TrangThai === 'Đã trả',
                            'btn-danger': record.TrangThai === 'Từ chối'
                        }">
                            {{ record.TrangThai }}
                        </span>
                    </td>
                    <td>
                        <button class="btn-edit" @click="openEditForm(record)">✏️</button>
                        <button class="btn-approve" @click="duyetMuon(record)">✅</button>
                        <button class="btn-delete" @click="xoaRecord(record._id)">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Form thêm/sửa -->
        <div v-if="showForm" class="popup-overlay">
            <div class="popup-form">
                <h3>{{ editing ? "Sửa phiếu mượn" : "Thêm phiếu mượn" }}</h3>

                <label>Mã độc giả</label>
                <input v-model="form.MaDocGia" type="text" />

                <label>Mã sách</label>
                <input v-model="form.MaSach" type="text" />

                <label>Ngày mượn</label>
                <input v-model="form.NgayMuon" type="date" />

                <label>Hạn trả</label>
                <input v-model="form.HanTra" type="date" />

                <label>Trạng thái</label>
                <select v-model="form.TrangThai">
                    <option>Chờ duyệt</option>
                    <option>Đã duyệt - Đã mượn</option>
                    <option>Đã trả</option>
                    <option>Từ chối</option>
                </select>

                <div class="form-buttons">
                    <button @click="saveForm" class="btn-save">💾 Lưu</button>
                    <button @click="closeForm" class="btn-cancel">❌ Hủy</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api.js";

const records = ref([]);
const showForm = ref(false);
const editing = ref(false);
const form = ref({
    MaDocGia: "",
    MaSach: "",
    NgayMuon: "",
    HanTra: "",
    TrangThai: "Chờ duyệt",
});
const selectedId = ref(null);

const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");

// 🟢 Lấy danh sách
const loadRecords = async () => {
    try {
        const res = await api.get("/theodoimuonsach");
        records.value = res.data;
    } catch (err) {
        console.error("❌ Lỗi tải danh sách:", err);
    }
};

// 🟢 Duyệt phiếu mượn
const duyetMuon = async (record) => {
    try {
        await api.put(`/theodoimuonsach/duyet/${record._id}`);
        alert("✅ Đã duyệt mượn sách!");
        loadRecords();
    } catch (err) {
        console.error("❌ Lỗi duyệt:", err);
        alert("Lỗi khi duyệt mượn sách!");
    }
};

// 🟢 Thêm / sửa phiếu
const openAddForm = () => {
    form.value = { MaDocGia: "", MaSach: "", NgayMuon: "", HanTra: "", TrangThai: "Chờ duyệt" };
    editing.value = false;
    showForm.value = true;
};

const openEditForm = (record) => {
    form.value = { ...record };
    selectedId.value = record._id;
    editing.value = true;
    showForm.value = true;
};

const closeForm = () => {
    showForm.value = false;
};

const saveForm = async () => {
    try {
        if (editing.value) {
            await api.put(`/theodoimuonsach/${selectedId.value}`, form.value);
            alert("📝 Cập nhật thành công!");
        } else {
            await api.post("/theodoimuonsach", form.value);
            alert("✅ Thêm mới thành công!");
        }
        closeForm();
        loadRecords();
    } catch (err) {
        console.error("❌ Lỗi lưu:", err);
        alert("Không thể lưu phiếu mượn!");
    }
};

// 🟢 Xóa phiếu
const xoaRecord = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu này?")) return;
    try {
        await api.delete(`/theodoimuonsach/${id}`);
        alert("🗑️ Xóa thành công!");
        loadRecords();
    } catch (err) {
        console.error("❌ Lỗi xóa:", err);
        alert("Không thể xóa phiếu!");
    }
};

onMounted(() => loadRecords());
</script>

<style scoped>
.theodoimuonsach-container {
    padding: 2rem;
    background: #f8fafc;
    border-radius: 12px;
}

.toolbar {
    margin-bottom: 1rem;
}

.borrow-table {
    width: 100%;
    border-collapse: collapse;
}

.borrow-table th,
.borrow-table td {
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

.borrow-table th {
    background-color: #f3f4f6;
}

.btn-add {
    background: #007bff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-edit,
.btn-delete,
.btn-approve {
    border: none;
    cursor: pointer;
    margin: 0 4px;
    padding: 4px 8px;
    border-radius: 4px;
}

.btn-edit {
    background: #ffc107;
}

.btn-approve {
    background: #28a745;
    color: white;
}

.btn-delete {
    background: #dc3545;
    color: white;
}


.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-form {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
}

.popup-form input,
.popup-form select {
    width: 100%;
    margin-bottom: 10px;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.form-buttons {
    display: flex;
    justify-content: space-between;
}
</style>
