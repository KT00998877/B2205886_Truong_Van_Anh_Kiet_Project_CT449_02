<template>
    <div class="detail-container" v-if="sach">
        <button class="back-btn" @click="$router.back()">⬅ Quay lại</button>

        <div class="detail-content">
            <div class="detail-left">
                <img :src="getBookImage(sach)" alt="Bìa sách" class="detail-img" />
            </div>

            <div class="detail-right">
                <h2 class="detail-title">{{ sach.TenSach }}</h2>
                <p class="detail-author"><strong>Tác giả:</strong> {{ sach.TacGia }}</p>
                <p class="detail-category"><strong>Thể loại:</strong> {{ formatTheLoai(sach.TheLoai) }}</p>
                <p class="book-publisher"><strong>Nhà xuất bản:</strong> {{ getNXBName(sach.MaNXB) }}</p>
                <p class="detail-year"><strong>Năm xuất bản:</strong> {{ sach.NamXuatBan }}</p>
                <p class="detail-quantity"><strong>Số quyển còn:</strong> {{ sach.SoQuyen }}</p>
                <p class="detail-price"><strong>Giá:</strong> {{ sach.DonGia.toLocaleString() }}₫</p>

                <div class="desc" v-if="sach.ChiTiet">
                    <h3>📖 Mô tả</h3>
                    <p>{{ sach.ChiTiet }}</p>
                </div>

                <div class="detail-actions">
                    <button class="btn update" @click="updateSach">✏️ Cập nhật</button>
                    <button class="btn delete" @click="deleteSach">🗑️ Xoá</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading">⏳ Đang tải dữ liệu...</div>
</template>

<script>
import api from "../../services/api.js";

export default {
    name: "SachDetail",
    data() {
        return {
            sach: null,
            nhaxuatbans: [],
            defaultImage: "https://via.placeholder.com/300x400?text=No+Image",
            allImages: {},
        };
    },

    async mounted() {
        const id = this.$route.params.id;
        try {
            const res = await api.get(`/sach/id/${id}`);
            this.sach = res.data;

            const resNXB = await api.get("/nhaxuatban");
            this.nhaxuatbans = resNXB.data;
        } catch (err) {
            console.error("❌ Lỗi khi tải chi tiết sách:", err);
        }

        const imgs = import.meta.glob("../../assets/img/**/*.{jpg,jpeg,png,webp}", { eager: true });
        this.allImages = Object.values(imgs);
    },

    methods: {
        getBookImage(s) {
            if (s.HinhAnh && s.HinhAnh.startsWith("http")) return s.HinhAnh;
            if (s.HinhAnh && s.HinhAnh.startsWith("./img/")) {
                const name = s.HinhAnh.split("/").pop();
                const found = this.allImages.find((imgPath) => imgPath.default?.includes(name));
                return found?.default || this.defaultImage;
            }
            if (s.HinhAnh && s.HinhAnh.startsWith("/uploads/")) {
                return `http://localhost:3000${s.HinhAnh}`;
            }
            return this.defaultImage;
        },

        getNXBName(code) {
            if (!code) return "Chưa rõ";
            const nxb = this.nhaxuatbans.find(x => x.MaNXB === code);
            return nxb ? nxb.TenNXB : code;
        },

        formatTheLoai(slug) {
            return slug
                ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                : "Không rõ";
        },

        updateSach() {
            this.$router.push(`/sach/edit/${this.sach._id}`);
        },

        async deleteSach() {
            if (!confirm("⚠️ Bạn có chắc muốn xoá sách này không?")) return;
            try {
                await api.delete(`/sach/${this.sach._id}`);
                alert("✅ Đã xoá thành công!");
                this.$router.push("/sach");
            } catch (err) {
                console.error("❌ Lỗi khi xoá sách:", err);
                alert("❌ Không thể xoá sách này!");
            }
        },
    },
};
</script>

<style scoped>
.detail-container {
    padding: 20px;
    max-width: 1000px;
    margin: auto;
}

.back-btn {
    background: none;
    border: none;
    color: #1565c0;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 16px;
    transition: color 0.2s;
}

.back-btn:hover {
    color: #0d47a1;
}

.detail-content {
    display: flex;
    gap: 40px;
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-left {
    flex: 0 0 300px;
    text-align: center;
}

.detail-img {
    width: 100%;
    max-width: 300px;
    height: 400px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.detail-right {
    flex: 1;
}

.detail-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 15px;
    color: #222;
}

.detail-author,
.detail-category,
.book-publisher,
.detail-year,
.detail-quantity,
.detail-price {
    font-size: 16px;
    margin-bottom: 10px;
    color: #444;
    line-height: 1.6;
}

.detail-price {
    font-size: 18px;
    color: #1565c0;
    font-weight: 600;
}

.desc {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.desc h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
}

.desc p {
    font-size: 15px;
    color: #555;
    line-height: 1.8;
}

.detail-actions {
    margin-top: 25px;
    display: flex;
    gap: 12px;
}

.btn {
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 15px;
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
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
}

.btn.delete {
    background-color: #e53935;
    color: white;
}

.btn.delete:hover {
    background-color: #c62828;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(229, 57, 53, 0.3);
}

.loading {
    text-align: center;
    padding: 60px;
    font-size: 18px;
    color: #666;
}

/* Responsive */
@media (max-width: 768px) {
    .detail-content {
        flex-direction: column;
        padding: 20px;
    }

    .detail-left {
        flex: none;
    }

    .detail-img {
        max-width: 100%;
        height: auto;
    }

    .detail-title {
        font-size: 24px;
    }

    .detail-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>