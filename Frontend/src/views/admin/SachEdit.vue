<template>
    <div class="edit-container">
        <h2>✏️ Cập Nhật Sách</h2>

        <form @submit.prevent="updateSach" class="edit-form">
            <div class="form-group">
                <label>Mã Sách</label>
                <input type="text" v-model="form.MaSach" disabled />
            </div>

            <div class="form-group">
                <label>Tên Sách</label>
                <input type="text" v-model="form.TenSach" required />
            </div>

            <div class="form-group">
                <label>Tác Giả</label>
                <input type="text" v-model="form.TacGia" />
            </div>

            <div class="form-group">
                <label>Năm Xuất Bản</label>
                <input type="number" v-model="form.NamXuatBan" />
            </div>

            <div class="form-group">
                <label>Thể Loại</label>
                <input type="text" v-model="form.TheLoai" />
            </div>

            <div class="form-group">
                <label>Đơn Giá</label>
                <input type="number" v-model="form.DonGia" />
            </div>

            <div class="form-group">
                <label>Số Quyển</label>
                <input type="number" v-model="form.SoQuyen" />
            </div>

            <div class="form-group">
                <label>Hình Ảnh (đường dẫn)</label>
                <input type="text" v-model="form.HinhAnh" />
            </div>

            <div class="button-group">
                <button type="submit" class="btn btn-update">💾 Lưu Thay Đổi</button>
                <button type="button" class="btn btn-delete" @click="deleteSach">🗑️ Xóa Sách</button>
            </div>
        </form>
    </div>
</template>

<script>
import api from "../../services/api.js";

export default {
    name: "SachEdit",
    data() {
        return {
            form: {},
        };
    },
    async mounted() {
        const id = this.$route.params.id;
        try {
            const res = await api.get(`/sach`);
            // Tìm sách theo _id
            const sach = res.data.find((item) => item._id === id);
            if (!sach) {
                alert("❌ Không tìm thấy sách!");
                this.$router.push("/sach");
            } else {
                this.form = sach;
            }
        } catch (err) {
            console.error("❌ Lỗi khi tải dữ liệu sách:", err);
        }
    },
    methods: {
        async updateSach() {
            try {
                await api.put(`/sach/${this.form._id}`, this.form);
                alert("✅ Cập nhật thành công!");
                this.$router.push("/sach");
            } catch (err) {
                console.error("❌ Lỗi khi cập nhật sách:", err);
                alert("Không thể cập nhật sách!");
            }
        },
        async deleteSach() {
            if (!confirm("Bạn có chắc muốn xóa sách này không?")) return;
            try {
                await api.delete(`/sach/${this.form._id}`);
                alert("🗑️ Đã xóa sách!");
                this.$router.push("/sach");
            } catch (err) {
                console.error("❌ Lỗi khi xóa sách:", err);
                alert("Không thể xóa sách!");
            }
        },
    },
};
</script>

<style scoped>
.edit-container {
    background: #f9fafc;
    padding: 40px;
    max-width: 600px;
    margin: 40px auto;
    border-radius: 14px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 24px;
    font-weight: 700;
    color: #0d47a1;
    margin-bottom: 20px;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group label {
    font-weight: 600;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn {
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.2s;
}

.btn-update {
    background-color: #1565c0;
    color: white;
}

.btn-update:hover {
    background-color: #0d47a1;
}

.btn-delete {
    background-color: #e53935;
    color: white;
}

.btn-delete:hover {
    background-color: #c62828;
}
</style>
