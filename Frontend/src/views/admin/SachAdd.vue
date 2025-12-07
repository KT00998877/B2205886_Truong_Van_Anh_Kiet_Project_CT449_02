<template>
    <div class="add-container">
        <h2>➕ Thêm sách mới</h2>

        <form @submit.prevent="submitBook" class="add-form">

            <label>Mã sách</label>
            <input v-model="form.MaSach" required />

            <label>Tên sách</label>
            <input v-model="form.TenSach" required />

            <label>Chi tiết</label>
            <input v-model="form.ChiTiet" />

            <label>Tác giả</label>
            <input v-model="form.TacGia" required />

            <label>Giá</label>
            <input type="number" v-model="form.DonGia" required />

            <label>Số lượng</label>
            <input type="number" v-model="form.SoQuyen" required />

            <label>Năm xuất bản</label>
            <input type="number" v-model="form.NamXuatBan" required />

            <label>Thể loại</label>
            <select v-model="form.TheLoai" required>
                <option disabled value="">-- Chọn thể loại --</option>
                <option v-for="tl in theloais" :key="tl" :value="tl">
                    {{ tl }}
                </option>
            </select>
            <label>Nhà xuất bản</label>
            <select v-model="form.MaNXB" required>
                <option disabled value="">-- Chọn nhà xuất bản --</option>
                <option v-for="nxb in nhaxuatbans" :key="nxb.MaNXB" :value="nxb.MaNXB">
                    {{ nxb.TenNXB }}
                </option>
            </select>

            <label>Ảnh bìa</label>
            <input type="file" @change="onFileChange" required />

            <button class="btn-add">Thêm sách</button>

        </form>
    </div>
</template>

<script>
import api from "../../services/api.js";

export default {
    name: "SachAdd",

    data() {
        return {
            form: {
                MaSach: "",
                TenSach: "",
                ChiTiet: "",
                TacGia: "",
                DonGia: "",
                SoQuyen: "",
                NamXuatBan: "",
                TheLoai: "",
                MaNXB: "",
            },
            file: null,
            nhaxuatbans: [],
            theloais: [
                "Khoa học",
                "Kinh tế",
                "Ngoại ngữ",
                "Tâm lý - Kỹ năng",
                "Thiếu nhi",
                "Văn học",
            ],
        };
    },
    
    async created() {
        const res = await api.get("/nhaxuatban");
        this.nhaxuatbans = res.data;
    },

    methods: {
        onFileChange(e) {
            this.file = e.target.files[0];
        },

        

        async submitBook() {
            try {
                const fd = new FormData();

                Object.entries(this.form).forEach(([k, v]) => fd.append(k, v));
                fd.append("HinhAnh", this.file);

                await api.post("/sach", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                alert("🎉 Thêm sách thành công!");
                this.$router.push("/admin/sach");

            } catch (err) {
                console.error("❌ Lỗi thêm sách:", err);
                alert("Không thể thêm sách!");
            }
        },
    },
};
</script>

<style scoped>
.add-container {
    width: 500px;
    margin: 30px auto;
    padding: 25px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 2 cột */
    gap: 15px;
}

.add-form input,
.add-form select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
}

.btn-add {
    grid-column: span 2;
    /* kéo nút ra full hàng */
    padding: 10px;
    border: none;
    background: #1976d2;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
}
</style>
