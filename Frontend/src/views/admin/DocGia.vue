<template>
    <div class="docgia-container">
        <h2>📚 Danh sách độc giả</h2>

        <!-- Nút mở form thêm -->
        <button class="open-form-btn" @click="showAddForm = true">➕ Thêm Độc Giả</button>

        <!-- 🟢 Form thêm độc giả -->
        <div v-if="showAddForm" class="overlay">
            <div class="add-form">
                <h3>➕ Thêm Độc Giả</h3>
                <form @submit.prevent="addDocGia">
                    <label>Mã Độc Giả:</label>
                    <input v-model="newDocGia.MaDocGia" required />
                    <label>Họ Lót:</label>
                    <input v-model="newDocGia.HoLot" required />
                    <label>Tên:</label>
                    <input v-model="newDocGia.Ten" required />
                    <label>Phái:</label>
                    <select v-model="newDocGia.Phai" required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <label>Ngày Sinh:</label>
                    <input type="date" v-model="newDocGia.NgaySinh" required />
                    <label>Địa Chỉ:</label>
                    <input v-model="newDocGia.DiaChi" required />
                    <label>SĐT:</label>
                    <input v-model="newDocGia.SoDienThoai" required />
                    <div class="form-actions">
                        <button type="submit" class="save-btn">💾 Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeForm">❌ Huỷ</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 🟡 Form sửa độc giả -->
        <div v-if="showEditForm" class="overlay">
            <div class="add-form">
                <h3>✏️ Cập Nhật Độc Giả</h3>
                <form @submit.prevent="updateDocGia">
                    <label>Mã Độc Giả:</label>
                    <input v-model="editingDocGia.MaDocGia" disabled />
                    <label>Họ Lót:</label>
                    <input v-model="editingDocGia.HoLot" required />
                    <label>Tên:</label>
                    <input v-model="editingDocGia.Ten" required />
                    <label>Phái:</label>
                    <select v-model="editingDocGia.Phai" required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <label>Ngày Sinh:</label>
                    <input type="date" v-model="editingDocGia.NgaySinh" required />
                    <label>Địa Chỉ:</label>
                    <input v-model="editingDocGia.DiaChi" required />
                    <label>SĐT:</label>
                    <input v-model="editingDocGia.SoDienThoai" required />
                    <div class="form-actions">
                        <button type="submit" class="save-btn">💾 Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeEditForm">❌ Huỷ</button>
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
                        <button class="edit-btn" @click="editDocGia(dg)">✏️ Sửa</button>
                        <button class="delete-btn" @click="deleteDocGia(dg._id)">🗑️ Xoá</button>
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
