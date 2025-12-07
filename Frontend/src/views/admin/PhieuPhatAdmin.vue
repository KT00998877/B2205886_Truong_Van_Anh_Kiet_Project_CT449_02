<!-- PhieuPhatAdmin.vue -->
<template>
  <div class="theodoimuonsach-container">
    <h2>Quản lý phiếu phạt</h2>

    <div class="toolbar">
      <button class="btn-add" @click="openAddForm"> Tạo phiếu phạt</button>
    </div>

    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Độc giả</th>
          <th>Lý do</th>
          <th>Tiền phạt</th>
          <th>Ngày tạo</th>
          <th>Trạng thái</th>
          <th class="text-end">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in fines" :key="f._id">
          <td>{{ f.MaDocGia }}</td>
          <td>{{ f.lyDo }}</td>
          <td>{{ f.soTien }} đ</td>
          <td>{{ formatDate(f.createdAt) }}</td>
          <td>
            <span class="status-badge" :class="{
              'status-pending': f.trangThai === 'Chưa thanh toán',
              'status-paid': f.trangThai === 'Đã thanh toán'
            }">
              {{ f.trangThai }}
            </span>

          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-primary me-1" @click="openEditForm(f)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="deleteFine(f._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popup -->
    <div v-if="showForm" class="popup-overlay">
      <div class="popup-form">
        <h3>{{ editing ? "Sửa phiếu phạt" : "Tạo phiếu phạt" }}</h3>

        <label>Mã độc giả</label>
        <input v-model="form.MaDocGia" type="text" />

        <select v-model="form.muonSachId">
          <option value="">-- Chọn phiếu mượn --</option>
          <option v-for="m in muonSachList" :key="m._id" :value="m._id">
            {{ m.MaDocGia }} - {{ m.MaSach.TenSach }} - {{ formatDate(m.NgayMuon) }}
          </option>
        </select>


        <label>Lý do</label>
        <input v-model="form.lyDo" type="text" />

        <label>Số tiền</label>
        <input v-model="form.soTien" type="number" />

        <label>Trạng thái</label>
        <select v-model="form.trangThai">
          <option>Chưa thanh toán</option>
          <option>Đã thanh toán</option>
        </select>

        <div class="form-buttons">
          <button @click="saveForm" class="btn-save"> Lưu</button>
          <button @click="closeForm" class="btn-cancel"> Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api.js';

const fines = ref([]);
const showForm = ref(false);
const editing = ref(false);
const selectedId = ref(null);
const form = ref({ MaDocGia: '', lyDo: '', soTien: 0, trangThai: 'Chưa thanh toán' });
const muonSachList = ref([]);
import { watch } from "vue";

watch(
  () => form.value.muonSachId,
  (id) => {
    const ms = muonSachList.value.find((m) => m._id === id);
    if (ms) {
      form.value.MaSach = ms.MaSach;   
    }
  }
);

watch(
  () => form.value.MaDocGia,
  async (madg) => {
    if (!madg) {
      muonSachList.value = [];
      return;
    }

    try {
      const res = await api.get(`/theodoimuonsach/docgia/${madg}`);
      muonSachList.value = res.data || [];
    } catch (err) {
      console.error("Lỗi lấy phiếu mượn theo độc giả:", err);
      muonSachList.value = [];
    }
  }
);


onMounted(async () => {
  const res = await api.get("/theodoimuonsach/all");
  muonSachList.value = res.data;
});

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

const loadFines = async () => {
  const res = await api.get("/phieuphat/all");
  fines.value = res.data;
};

const openAddForm = () => {
    editing.value = false;
  form.value = {
    MaDocGia: '',
    muonSachId: '',
    MaSach: '',        
    lyDo: '',
    soTien: 0,
    trangThai: 'Chưa thanh toán'
  };

    showForm.value = true;
};

const openEditForm = (f) => {
    editing.value = true;
    selectedId.value = f._id;
    form.value = { ...f };
    showForm.value = true;
};

const closeForm = () => (showForm.value = false);

const saveForm = async () => {
    if (editing.value) await api.put(`/phieuphat/${selectedId.value}`, form.value);
    else await api.post('/phieuphat', form.value);
    closeForm();
    loadFines();
};

const deleteFine = async (id) => {
    if (!confirm('Xóa phiếu phạt?')) return;
    await api.delete(`/phieuphat/${id}`);
    loadFines();
};

onMounted(loadFines);
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
.status-badge {
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  display: inline-block;
  color: white;
  min-width: 120px;
  text-align: center;
}

/* CHƯA THANH TOÁN */
.status-pending {
  background: #e67e22;
  box-shadow: 0 0 4px rgba(230, 126, 34, 0.4);
}

/* ĐÃ THANH TOÁN */
.status-paid {
  background: #27ae60;
  box-shadow: 0 0 4px rgba(39, 174, 96, 0.4);
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





