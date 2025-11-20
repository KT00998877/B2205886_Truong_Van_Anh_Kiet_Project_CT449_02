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
                <p class="detail-year"><strong>Năm xuất bản:</strong> {{ sach.NamXuatBan }}</p>
                <p class="detail-quantity"><strong>Số quyển còn:</strong> {{ sach.SoQuyen }}</p>
                <p class="detail-price"><strong>Giá:</strong> {{ sach.DonGia.toLocaleString() }}₫</p>

                <div class="desc" v-if="sach.ChiTiet">
                    <h3>Mô tả</h3>
                    <p>{{ sach.ChiTiet }}</p>
                </div>


                <div class="detail-actions">
                    <button class="btn update" @click="updateSach">Cập nhật</button>
                    <button class="btn delete" @click="deleteSach">Xoá</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../services/api.js";

export default {
    name: "SachDetail",
    data() {
        return {
            sach: null,
            defaultImage: "https://via.placeholder.com/300x400?text=No+Image",
            allImages: {},
        };
    },

    async mounted() {
        const id = this.$route.params.id;
        try {
            const res = await api.get(`/sach/id/${id}`);
            this.sach = res.data;
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
                return `http://localhost:5000${s.HinhAnh}`;
            }
            return this.defaultImage;
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
            if (!confirm("Bạn có chắc muốn xoá sách này không?")) return;
            try {
                await api.delete(`/sach/${this.sach._id}`);
                alert("Đã xoá thành công ✅");
                this.$router.push("/sach");
            } catch (err) {
                console.error("❌ Lỗi khi xoá sách:", err);
                alert("Không thể xoá sách này!");
            }
        },
    },
};
</script>

<style scoped>

.detail-container {
    padding: 20px;
    max-width: 900px;
    margin: auto;
}

.detail-content {
    display: flex;
    gap: 30px;
}

.detail-img {
    width: 280px;
    height: 380px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.detail-info {
    flex: 1;
    font-size: 18px;
}

.desc {
    margin-top: 10px;
    line-height: 1.6;
}

.btn-back {
    margin-top: 20px;
    padding: 10px 18px;
    background: #8b4513;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.back-btn {
    background: none;
    border: none;
    color: #1565c0;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
}



.detail-left {
    flex: 1 1 300px;
    text-align: center;
}


.detail-right {
    flex: 2 1 400px;
}

.detail-title {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 10px;
}

.detail-author,
.detail-category,
.detail-year,
.detail-quantity,
.detail-price {
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;
}

.detail-desc {
    font-size: 15px;
    color: #555;
    margin-top: 10px;
    line-height: 1.6;
}

.detail-actions {
    margin-top: 20px;
    display: flex;
    gap: 12px;
}

.btn {
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 14px;
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
</style>
