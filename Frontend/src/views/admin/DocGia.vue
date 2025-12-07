<template>
    <div class="container-fluid">
        <h2> Danh sách độc giả</h2>

        <!-- Nút mở form thêm -->
        <button class="open-form-btn" @click="showAddForm = true"> Thêm Độc Giả</button>

        <!-- 🟢 Form thêm độc giả -->
        <div v-if="showAddForm" class="overlay">
            <div class="add-form">
                <h3>➕ Thêm Độc Giả</h3>
                <form @submit.prevent="addDocGia" class="dg-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Mã Độc Giả:</label>
                            <input v-model="newDocGia.MaDocGia" required />
                        </div>

                        <div class="form-group">
                            <label>Họ Lót:</label>
                            <input v-model="newDocGia.HoLot" required />
                        </div>

                        <div class="form-group">
                            <label>Tên:</label>
                            <input v-model="newDocGia.Ten" required />
                        </div>

                        <div class="form-group">
                            <label>Phái:</label>
                            <select v-model="newDocGia.Phai" required>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Ngày Sinh:</label>
                            <input type="date" v-model="newDocGia.NgaySinh" required />
                        </div>

                        <div class="form-group">
                            <label>Địa Chỉ:</label>
                            <input v-model="newDocGia.DiaChi" required />
                        </div>

                        <div class="form-group">
                            <label>SĐT:</label>
                            <input v-model="newDocGia.SoDienThoai" required />
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="save-btn"> Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeForm"> Huỷ</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 🟡 Form sửa độc giả -->
        <div v-if="showEditForm" class="overlay">
            <div class="add-form">
                <h3> Cập Nhật Độc Giả</h3>
                <form @submit.prevent="updateDocGia" class="dg-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Mã Độc Giả:</label>
                            <input v-model="editingDocGia.MaDocGia" disabled />
                        </div>

                        <div class="form-group">
                            <label>Họ Lót:</label>
                            <input v-model="editingDocGia.HoLot" required />
                        </div>

                        <div class="form-group">
                            <label>Tên:</label>
                            <input v-model="editingDocGia.Ten" required />
                        </div>

                        <div class="form-group">
                            <label>Phái:</label>
                            <select v-model="editingDocGia.Phai" required>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Ngày Sinh:</label>
                            <input type="date" v-model="editingDocGia.NgaySinh" required />
                        </div>

                        <div class="form-group">
                            <label>Địa Chỉ:</label>
                            <input v-model="editingDocGia.DiaChi" required />
                        </div>

                        <div class="form-group">
                            <label>SĐT:</label>
                            <input v-model="editingDocGia.SoDienThoai" required />
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="save-btn"> Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeEditForm"> Huỷ</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 🔵 Bảng danh sách -->
        <table class="docgia-table">
            <thead>
                <tr>
                    <th>Mã Độc Giả</th>
                    <th>Họ Lót</th>
                    <th>Tên</th>
                    <th>Phái</th>
                    <th>Ngày Sinh</th>
                    <th>Địa Chỉ</th>
                    <th>SĐT</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dg in docgias" :key="dg._id">
                    <td>{{ dg.MaDocGia }}</td>
                    <td>{{ dg.HoLot }}</td>
                    <td>{{ dg.Ten }}</td>
                    <td>{{ dg.Phai }}</td>
                    <td>{{ formatDate(dg.NgaySinh) }}</td>
                    <td>{{ dg.DiaChi }}</td>
                    <td>{{ dg.SoDienThoai }}</td>
                    <td>
                        <button class="edit-btn" @click="editDocGia(dg)"> Sửa</button>
                        <button class="delete-btn" @click="deleteDocGia(dg._id)"> Xoá</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="loading">Đang tải dữ liệu...</p>
        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<script>
import api from "../../services/api.js";

export default {
    name: "DocGiaView",
    data() {
        return {
            docgias: [],
            loading: true,
            error: null,
            showAddForm: false,
            showEditForm: false,
            newDocGia: {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                Phai: "Nam",
                NgaySinh: "",
                DiaChi: "",
                SoDienThoai: "",
            },
            editingDocGia: null,
        };
    },
    methods: {
        async fetchDocGia() {
            try {
                const res = await api.get("/docgia");
                this.docgias = res.data;
            } catch (err) {
                this.error = "Không thể tải dữ liệu từ backend.";
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return "";
            return new Date(dateStr).toLocaleDateString("vi-VN");
        },

        /* ----------------- THÊM ----------------- */
        async addDocGia() {
            try {
                await api.post("/docgia", this.newDocGia);
                alert("✅ Thêm độc giả thành công!");
                this.newDocGia = { MaDocGia: "", HoLot: "", Ten: "", Phai: "Nam", NgaySinh: "", DiaChi: "", SoDienThoai: "" };
                this.showAddForm = false;
                this.fetchDocGia();
            } catch (err) {
                alert("❌ Lỗi khi thêm độc giả!");
            }
        },

        /* ----------------- SỬA ----------------- */
        editDocGia(dg) {
            this.editingDocGia = { ...dg };
            // Chuyển ngày sinh thành định dạng yyyy-MM-dd cho input type="date"
            if (dg.NgaySinh) {
                this.editingDocGia.NgaySinh = new Date(dg.NgaySinh).toISOString().substring(0, 10);
            }
            this.showEditForm = true;
        },

        async updateDocGia() {
            try {
                await api.put(`/docgia/${this.editingDocGia._id}`, this.editingDocGia);
                alert("✅ Cập nhật thành công!");
                this.showEditForm = false;
                this.fetchDocGia();
            } catch (err) {
                alert("❌ Lỗi khi cập nhật độc giả!");
            }
        },

        closeEditForm() {
            this.showEditForm = false;
            this.editingDocGia = null;
        },

        /* ----------------- XOÁ ----------------- */
        async deleteDocGia(id) {
            if (!confirm("Bạn có chắc muốn xoá độc giả này không?")) return;
            try {
                await api.delete(`/docgia/${id}`);
                this.docgias = this.docgias.filter(d => d._id !== id);
            } catch (err) {
                alert("❌ Lỗi khi xoá độc giả!");
            }
        },

        closeForm() {
            this.showAddForm = false;
        },
    },
    mounted() {
        this.fetchDocGia();
    },
};
</script>
<style scoped>
/* Nền mờ full màn hình khi mở form */
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

/* Hộp form ở giữa */
.add-form {
    background: #fff;
    padding: 24px 28px;
    border-radius: 12px;
    min-width: 480px;
    max-width: 650px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.add-form h3 {
    margin-top: 0;
    margin-bottom: 16px;
    text-align: center;
}

/* Form tổng */
.dg-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Lưới các ô nhập: 2 cột */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 16px;
}

/* Mỗi group gồm label + input/select */
.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
}

.form-group input,
.form-group select {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
}

/* Hàng nút */
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
}

.save-btn,
.cancel-btn {
    min-width: 80px;
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: 500;
}

.save-btn {
    background: #1976d2;
    color: #fff;
}

.save-btn:hover {
    background: #115293;
}

.cancel-btn {
    background: #e0e0e0;
}

.cancel-btn:hover {
    background: #c2c2c2;
}

/* Responsive: màn nhỏ thì về 1 cột */
@media (max-width: 600px) {
    .add-form {
        min-width: 90%;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>