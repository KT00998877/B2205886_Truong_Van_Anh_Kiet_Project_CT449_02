<template>
    <div class="container">
        <h1 class="text-center">Quản lí Sách</h1>

        <!-- Thanh lọc và sắp xếp -->
        <div class="filter-bar">
            <select v-model="selectedTheLoai" @change="applyFilters">
                <option value="">Tất cả thể loại</option>
                <option v-for="theloai in theloais" :key="theloai" :value="theloai">
                    {{ theloai }}
                </option>
            </select>

            <select v-model="selectedNXB" @change="applyFilters">
                <option value="">Tất cả NXB</option>
                <option v-for="nxb in nhaxuatbans" :key="nxb.MaNXB" :value="nxb.MaNXB">
                    {{ nxb.TenNXB }}
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

            <button @click="$router.push('/admin/sach/add')" class="btn-add">
                ➕ Thêm sách
            </button>
        </div>

        <!-- Danh sách sách -->
        <div class="book-grid">
            <div v-for="(s, idx) in paginatedSachs" :key="s._id" class="book-card">
                <!-- Click vào ảnh hoặc tên để xem chi tiết -->
                <div class="book-click" @click="viewDetail(s)">
                    <img :src="getBookImage(s, idx)" alt="Bìa sách" class="book-img" />
                    <div class="book-info">
                        <h4 class="book-title">{{ s.TenSach }}</h4>
                        <p class="book-author">{{ s.TacGia }}</p>
                        <p class="book-publisher">Nhà xuất bản: {{ getNXBName(s.MaNXB) }}</p>
                        <p class="book-number">Số sách còn lại: {{ s.SoQuyen }}</p>
                        <p class="book-price">{{ s.DonGia.toLocaleString() }}₫</p>
                    </div>
                </div>

                <!-- Nút thao tác -->
                <div class="book-actions">
                    <button class="btn update" @click.stop="updateSach(s)">✏️ Cập nhật</button>
                    <button class="btn delete" @click.stop="deleteSach(s._id)">🗑️ Xoá</button>
                </div>
            </div>
        </div>

        <!-- PHÂN TRANG -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">‹ Trước</button>
            <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Sau ›</button>
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
            nhaxuatbans: [],
            theloais: [],
            selectedTheLoai: "",
            selectedNXB: "",
            searchQuery: "",
            searchAuthor: "",
            sortBy: "",
            currentPage: 1,
            pageSize: 8,
            defaultImage: "https://via.placeholder.com/200x280?text=No+Image",
        };
    },

    // ✅ Hook này chạy mỗi khi quay lại trang
    async beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            await vm.loadData();
        });
    },

    // ✅ CHỈ GIỮ 1 mounted() duy nhất
    async mounted() {
        await this.loadData();
    },

    computed: {
        paginatedSachs() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredSachs.slice(start, start + this.pageSize);
        },
        totalPages() {
            return Math.ceil(this.filteredSachs.length / this.pageSize);
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
        // ✅ Tách logic load data thành method riêng
        async loadData() {
            try {
                const res = await api.get("/sach");
                this.sachs = res.data;
                this.filteredSachs = res.data;

                // Lấy danh sách thể loại duy nhất
                this.theloais = [...new Set(this.sachs.map((s) => s.TheLoai))];

                const resNXB = await api.get("/nhaxuatban");
                this.nhaxuatbans = resNXB.data;
            } catch (err) {
                console.error("❌ Lỗi khi tải dữ liệu sách:", err);
            }
        },

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
                return `http://localhost:3000${s.HinhAnh}`;
            }
            const allImages = Object.values(this.sach).flat();
            return allImages[idx % allImages.length] || this.defaultImage;
        },

        getNXBName(code) {
            if (!code) return "Chưa rõ";
            const nxb = this.nhaxuatbans.find(x => x.MaNXB === code);
            return nxb ? nxb.TenNXB : code;
        },

        applyFilters() {
            let filtered = [...this.sachs];

            // Lọc theo thể loại
            if (this.selectedTheLoai)
                filtered = filtered.filter((s) => s.TheLoai === this.selectedTheLoai);

            // Lọc theo tên
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (s) =>
                        s.TenSach.toLowerCase().includes(q) ||
                        s.TacGia.toLowerCase().includes(q)
                );
            }

            // lọc theo nhà xuất bản
            if (this.selectedNXB) {
                filtered = filtered.filter((s) => s.MaNXB === this.selectedNXB);
            }

            // Lọc theo tác giả
            if (this.searchAuthor) {
                const a = this.searchAuthor.toLowerCase();
                filtered = filtered.filter((s) =>
                    s.TacGia.toLowerCase().includes(a)
                );
            }

            // Sắp xếp
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
            this.currentPage = 1;
        },

        // 👁 Xem chi tiết
        viewDetail(s) {
            this.$router.push(`/admin/sach/id/${s._id}`);
        },

        // ✏️ Cập nhật
        updateSach(s) {
            this.$router.push(`/admin/sach/edit/${s._id}`);
        },

        // 🗑 Xoá
        async deleteSach(id) {
            if (!confirm("⚠️ Bạn có chắc muốn xoá sách này không?")) return;
            try {
                // ✅ Sửa endpoint - bỏ /admin/
                await api.delete(`/sach/${id}`);

                // Cập nhật lại danh sách
                this.sachs = this.sachs.filter((item) => item._id !== id);
                this.applyFilters();

                alert("✅ Đã xoá thành công!");
            } catch (err) {
                console.error("❌ Lỗi khi xoá:", err);
                alert("❌ Không thể xoá sách này!");
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    },
};
</script>

<style scoped>
.container {
    background-color: #f8f9fc;
    padding: 40px;
    min-height: 100vh;
}

h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
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

.btn-add {
    padding: 8px 16px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-add:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.book-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
}

@media (max-width: 992px) {
    .book-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .book-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .book-grid {
        grid-template-columns: repeat(1, 1fr);
    }
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

.book-click {
    cursor: pointer;
    width: 100%;
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

.book-author,
.book-publisher,
.book-number {
    font-size: 13px;
    color: #666;
    margin: 4px 0;
}

.book-price {
    font-size: 14px;
    color: #1565c0;
    font-weight: 600;
    margin-top: 5px;
}

.book-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 0 12px 16px;
    width: 100%;
}

.btn {
    flex: 1;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn.update {
    background-color: #1976d2;
    color: white;
}

.btn.update:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
}

.btn.delete {
    background-color: #e53935;
    color: white;
}

.btn.delete:hover {
    background-color: #c62828;
    transform: translateY(-2px);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin: 25px 0;
}

.pagination button {
    padding: 8px 14px;
    border-radius: 6px;
    background: #1976d2;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background: #1565c0;
    transform: translateY(-2px);
}

.pagination button:disabled {
    background: #b0b0b0;
    cursor: not-allowed;
}

.pagination span {
    font-weight: bold;
    font-size: 15px;
}
</style>