<template>
    <div class="container">
        <h2> Danh Sách </h2>

        <!-- Thanh lọc và sắp xếp -->
        <div class="filter-bar">
            <select v-model="selectedTheLoai" @change="applyFilters">
                <option value="">Tất cả thể loại</option>
                <option v-for="theloai in theloais" :key="theloai" :value="theloai">
                    {{ (theloai) }}
                </option>
            </select>

            <input type="text" v-model="searchQuery" placeholder="🔍 Tìm kiếm sách..." @input="applyFilters" />
            <input type="text" v-model="searchAuthor" placeholder="✍️ Tìm theo tác giả..." @input="applyFilters" />

            <select v-model="sortBy" @change="applyFilters">
                <option value="">Sắp xếp</option>
                <option value="tenAsc">Tên A → Z</option>
                <option value="tenDesc">Tên Z → A</option>
                <option value="giaAsc">Giá thấp → cao</option>
                <option value="giaDesc">Giá cao → thấp</option>
                <option value="namDesc">Năm mới nhất</option>
                <option value="namAsc">Năm cũ nhất</option>
            </select>
        </div>

        <!-- Danh sách sách -->
        <div class="book-grid">
            <div v-for="(s, idx) in filteredSachs" :key="s._id" class="book-card">
                <!-- Click vào ảnh hoặc tên để xem chi tiết -->
                <div class="book-click" @click="viewDetail(s)">
                    <img :src="getBookImage(s, idx)" alt="Bìa sách" class="book-img" />
                    <div class="book-info">
                        <h4 class="book-title">{{ s.TenSach }}</h4>
                        <p class="book-author">{{ s.TacGia }}</p>
                        <p class="book-number"> Số sách còn lại: {{ s.SoQuyen }}</p>
                        <p class="book-price">{{ s.DonGia.toLocaleString() }}₫</p>
                    </div>
                </div>

                <!-- Nút thao tác -->
                <div class="book-actions">
                    <button class="btn-borrow" @click.stop="openBorrowForm(s)">
                        Mượn ngay
                    </button>

                    <button class="btn-cart" @click.stop="addToCart(s)">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>

            </div>
        </div>
        <div v-if="selectedBook" class="borrow-popup">
            <div class="borrow-form">
                <h3> Mượn: {{ selectedBook.TenSach }}</h3>

                <label>Ngày mượn</label>
                <input type="date" v-model="borrowForm.NgayMuon" />

                <label>Hạn trả</label>
                <input type="date" v-model="borrowForm.HanTra" />

                <div class="form-buttons">
                    <button @click="submitBorrow" class="btn-confirm"> Xác nhận</button>
                    <button @click="closeBorrowForm" class="btn-cancel"> Hủy</button>
                </div>

                <p v-if="message" class="status-msg">{{ message }}</p>
            </div>
        </div>
    </div>

</template>


<script>
import api from "../../services/api.js";

export default {
    name: "SachView",
    data() {
        return {
            sach: {},
            sachs: [],
            filteredSachs: [],
            theloais: [],
            selectedTheLoai: "",
            searchQuery: "",
            searchAuthor: "",
            sortBy: "",
            defaultImage: "https://via.placeholder.com/200x280?text=No+Image",
            selectedBook: null, 
            borrowForm: {
                MaDocGia: "",
                MaSach: "",
                MSNV: "",
                NgayMuon: "", 
                HanTra: "",
            },
            message: "",
        };
    },

    async mounted() {
        try {
            const res = await api.get("/sach");
            this.sachs = res.data;
            this.filteredSachs = res.data;

            // Lấy danh sách thể loại duy nhất
            this.theloais = [...new Set(this.sachs.map((s) => s.TheLoai))];
        } catch (err) {
            console.error("❌ Lỗi khi tải dữ liệu sách:", err);
        }
    },

    created() {
        const allImages = import.meta.glob("../../assets/img/**/*.{jpg,jpeg,png,webp}", { eager: true });
        const grouped = {};
        Object.entries(allImages).forEach(([path, mod]) => {
            const parts = path.split("/");
            const folder = parts[parts.length - 2];
            if (!grouped[folder]) grouped[folder] = [];
            grouped[folder].push(mod.default);
        });
        this.sach = grouped;
    },

    methods: {
        getBookImage(s, idx) {
            if (s.HinhAnh && s.HinhAnh.startsWith("http")) return s.HinhAnh;
            if (s.HinhAnh && s.HinhAnh.startsWith("./img/")) {
                const relativePath = s.HinhAnh.replace("./", "../assets/");
                const found = Object.values(this.sach)
                    .flat()
                    .find((imgPath) => imgPath.includes(relativePath.split("/").pop()));
                return found || this.defaultImage;
            }
            if (s.HinhAnh && s.HinhAnh.startsWith("/uploads/")) {
                return `http://localhost:5000${s.HinhAnh}`;
            }
            const allImages = Object.values(this.sach).flat();
            return allImages[idx % allImages.length] || this.defaultImage;
        },

        applyFilters() {
            let filtered = [...this.sachs];
            // loc theo the loai
            if (this.selectedTheLoai)
                filtered = filtered.filter((s) => s.TheLoai === this.selectedTheLoai);
            // loc theo ten
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (s) =>
                        s.TenSach.toLowerCase().includes(q) ||
                        s.TacGia.toLowerCase().includes(q)
                );
            }
            // loc theo tac gia
            if (this.searchAuthor) {
                const a = this.searchAuthor.toLowerCase();
                filtered = filtered.filter((s) =>
                    s.TacGia.toLowerCase().includes(a)
                );
            }
            // sap xep
            switch (this.sortBy) {
                case "tenAsc":
                    filtered.sort((a, b) => a.TenSach.localeCompare(b.TenSach));
                    break;
                case "tenDesc":
                    filtered.sort((a, b) => b.TenSach.localeCompare(a.TenSach));
                    break;
                case "giaAsc":
                    filtered.sort((a, b) => a.DonGia - b.DonGia);
                    break;
                case "giaDesc":
                    filtered.sort((a, b) => b.DonGia - a.DonGia);
                    break;
                case "namDesc":
                    filtered.sort((a, b) => b.NamXuatBan - a.NamXuatBan);
                    break;
                case "namAsc":
                    filtered.sort((a, b) => a.NamXuatBan - b.NamXuatBan);
                    break;
            }
            this.filteredSachs = filtered;
        },

        // 👁 Xem chi tiết
        viewDetail(s) {
            this.$router.push(`/user/sach/id/${s._id}`);
        },

        openBorrowForm(s) {
            this.selectedBook = s;
            const today = new Date().toISOString().split('T')[0];
            this.borrowForm = {
                MaSach: s._id, 
                MSNV: "",
                NgayMuon: today, 
                HanTra: "",
            };

            this.message = "";
        },

        closeBorrowForm() {
            this.selectedBook = null;
            this.borrowForm = {
                MaDocGia: "",
                MaSach: "",
                MSNV: "",
                NgayMuon: "", 
                HanTra: ""
            };
        },

        async submitBorrow() {
            try {
                const token = localStorage.getItem("token");
                const res = await api.post(
                    "/theodoimuonsach/muon",
                    this.borrowForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                this.message = res.data.message || "Mượn sách thành công!";
                setTimeout(() => {
                    this.closeBorrowForm();
                }, 1500);
            } catch (err) {
                console.error("❌ Lỗi khi mượn sách:", err);
                this.message =
                    err.response?.data?.message || "Không thể mượn sách. Vui lòng thử lại.";
            }
        },

        async addToCart(s) {
            try {
                const token = localStorage.getItem("token");

                await api.post(
                    "/cart/add",
                    { MaSach: s._id, SoLuong: 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert("📚 Đã thêm vào giỏ sách!");
            } catch (err) {
                console.error("❌ Lỗi khi thêm vào giỏ:", err);
                alert("Không thể thêm vào giỏ!");
            }
        },


    },
};
</script>

<style scoped>


h2 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 25px;
}

.book-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.book-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

.book-img {
    width: 100%;
    height: 260px;
    object-fit: cover;
}

.book-info {
    padding: 12px;
    text-align: center;
}

.book-title {
    font-size: 15px;
    font-weight: 600;
    color: #222;
    margin-bottom: 6px;
}

.book-author {
    font-size: 14px;
    color: #666;
}

.book-price {
    font-size: 14px;
    color: #1565c0;
    font-weight: 600;
    margin-top: 5px;
}


.filter-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.filter-bar select,
.filter-bar input {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
    outline: none;
    background-color: #fff;
    transition: 0.2s;
}

.filter-bar select:focus,
.filter-bar input:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.book-click {
    cursor: pointer;
    width: 100%;
}

.book-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 12px;
}

.btn {
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;
}

.btn.update {
    background-color: #1976d2;
    color: white;
}

.btn.update:hover {
    background-color: #1565c0;
}

.btn.delete {
    background-color: #e53935;
    color: white;
}

.btn.delete:hover {
    background-color: #c62828;
}

.borrow-popup {
    /* 1. Lớp phủ toàn màn hình */
    position: fixed;
    /* Đứng yên so với viewport */
    top: 0;
    left: 0;
    width: 100vw;
    /* 100% chiều rộng màn hình */
    height: 100vh;
    /* 100% chiều cao màn hình */
    background-color: rgba(0, 0, 0, 0.6);
    /* Lớp nền mờ */

    /* 2. Căn giữa nội dung (cái form) */
    display: flex;
    justify-content: center;
    align-items: center;

    /* 3. Đảm bảo nó nổi lên trên cùng */
    z-index: 9999;
}

.borrow-form {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 450px;
    /* Giới hạn chiều rộng của form */

    /* CSS cho các phần tử bên trong form */
    display: flex;
    flex-direction: column;
    gap: 12px;
    /* Khoảng cách giữa các phần tử */
}

.borrow-form h3 {
    margin-top: 0;
    text-align: center;
}

.borrow-form label {
    font-weight: bold;
    margin-bottom: -5px;
    /* Gần input hơn */
}

.borrow-form input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    /* Căn nút sang phải */
    gap: 10px;
    margin-top: 15px;
}

.btn-confirm,
.btn-cancel {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.btn-confirm {
    background-color: #28a745;
    color: white;
}

.btn-cancel {
    background-color: #dc3545;
    color: white;
}

.status-msg {
    text-align: center;
    font-weight: bold;
    color: #28a745;
    /* Màu xanh lá */
}

.status-msg:not(:empty) {
    margin-top: 10px;
}

/* Kế thừa style từ template cho các nút trong card (nếu cần) */
.btn-borrow {
    cursor: pointer;
    /* (Thêm các style khác nếu bạn chưa có) */
}
</style>
