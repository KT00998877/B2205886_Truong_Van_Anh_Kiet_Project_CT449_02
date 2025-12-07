<template>
  <div class="container">
    <h1>Quản lí Nhân Viên</h1>
    <button class="open-form-btn" @click="showAddForm = true">
       Thêm Nhân Viên
    </button>
    <!-- Form thêm nhân viên -->
    <div v-if="showAddForm" class="overlay">
      <div class="add-form">
        <h3> Thêm Nhân Viên</h3>
        <form @submit.prevent="addNhanVien">
          <label>Mã Nhân Viên:</label>
          <input v-model="newNhanVien.MSNV" required /> <label>Họ Tên:</label>
          <input v-model="newNhanVien.HoTenNV" required />
          <label>Email:</label> <input v-model="newNhanVien.Email" required />
          <label>Password:</label>
          <input v-model="newNhanVien.Password" type="password" required />
          <label>Chức Vụ:</label>
          <input v-model="newNhanVien.ChucVu" required />
          <label>Địa Chỉ:</label>
          <input v-model="newNhanVien.DiaChi" required /> <label>SĐT:</label>
          <input v-model="newNhanVien.SoDienThoai" required />
          <div class="form-actions">
            <button type="submit" class="save-btn"> Lưu</button>
            <button type="button" class="cancel-btn" @click="closeForm">
               Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Form sửa nhân viên -->
    <div v-if="showEditForm" class="overlay">
      <div class="add-form">
        <h3> Cập Nhật Nhân Viên</h3>
        <form @submit.prevent="updateNhanVien">
          <label>Mã Nhân Viên:</label>
          <input v-model="editingNhanVien.MSNV" disabled />
          <label>Họ Tên:</label>
          <input v-model="editingNhanVien.HoTenNV" required />
          <label>Email:</label>
          <input v-model="editingNhanVien.Email" required />
          <label>Chức Vụ:</label>
          <input v-model="editingNhanVien.ChucVu" required />
          <label>Địa Chỉ:</label>
          <input v-model="editingNhanVien.DiaChi" required />
          <label>SĐT:</label>
          <input v-model="editingNhanVien.SoDienThoai" required />
          <div class="form-actions">
            <button type="submit" class="save-btn"> Lưu</button>
            <button type="button" class="cancel-btn" @click="closeEditForm">
               Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Bảng danh sách -->
    <table>
      <thead>
        <tr>
          <th>Mã Nhân Viên</th>
          <th>Họ Tên</th>
          <th>Email</th>
          <th>Chức vụ</th>
          <th>Địa Chỉ</th>
          <th>SĐT</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nv in nhanviens" :key="nv._id">
          <td>{{ nv.MSNV }}</td>
          <td>{{ nv.HoTenNV }}</td>
          <td>{{ nv.Email }}</td>
          <td>{{ nv.ChucVu }}</td>
          <td>{{ nv.DiaChi }}</td>
          <td>{{ nv.SoDienThoai }}</td>
          <td>
            <button class="edit-btn" @click="editNhanVien(nv)"> Sửa</button>
            <button class="delete-btn" @click="deleteNhanVien(nv._id)">
               Xoá
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="loading">Đang tải dữ liệu...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
<script>
import axios from "../../services/api.js";
export default {
  data() {
    return {
      nhanviens: [],
      newNhanVien: {
        MSNV: "",
        HoTenNV: "",
        Email: "",
        Password: "",
        ChucVu: "",
        DiaChi: "",
        SoDienThoai: "",
      },
      editingNhanVien: null,
      showAddForm: false,
      showEditForm: false,
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchNhanViens() {
      this.loading = true;
      try {
        const response = await axios.get("/nhanvien");
        this.nhanviens = response.data;
      } catch (err) {
        this.error = "Lỗi khi tải dữ liệu nhân viên.";
      } finally {
        this.loading = false;
      }
    },
    async hashPassword(password) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    },
    async addNhanVien() {
      try {
        const hashedPassword = await this.hashPassword(
          this.newNhanVien.Password
        );
        const payload = { ...this.newNhanVien, Password: hashedPassword };
        await axios.post("/nhanvien", payload);
        this.closeForm();
        this.fetchNhanViens();
      } catch (err) {
        console.error(err);
        this.error = "Lỗi khi thêm nhân viên.";
      }
    },
    async updateNhanVien() {
      try {
        await axios.put(
          `/nhanvien/${this.editingNhanVien._id}`,
          this.editingNhanVien
        );
        this.fetchNhanViens();
        this.closeEditForm();
      } catch (err) {
        this.error = "Lỗi khi cập nhật nhân viên.";
      }
    },
    async deleteNhanVien(id) {
      try {
        await axios.delete(`/nhanvien/${id}`);
        this.fetchNhanViens();
      } catch (err) {
        this.error = "Lỗi khi xoá nhân viên.";
      }
    },
    editNhanVien(nv) {
      this.editingNhanVien = { ...nv };
      this.showEditForm = true;
    },
    closeForm() {
      this.showAddForm = false;
      this.newNhanVien = {
        MSNV: "",
        HoTenNV: "",
        Email: "",
        Password: "",
        ChucVu: "",
        DiaChi: "",
        SoDienThoai: "",
      };
    },
    closeEditForm() {
      this.showEditForm = false;
      this.editingNhanVien = null;
    },
  },
  mounted() {
    this.fetchNhanViens();
  },
};
</script>

