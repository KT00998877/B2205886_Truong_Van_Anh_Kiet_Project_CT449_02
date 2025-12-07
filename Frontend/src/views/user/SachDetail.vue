<template>
    <div class="detail-container" v-if="book">
        <div class="detail-content">
            <img :src="getBookImage(book)" class="detail-img" />

            <div class="detail-info">
                <h2>{{ book.TenSach }}</h2>
                <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
                <p><strong>Thể loại:</strong> {{ book.TheLoai }}</p>
                <p><strong>Nhà xuất bản:</strong> {{ getNXBName(book.MaNXB) }}</p>
                <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
                <p><strong>Giá:</strong> {{ book.DonGia.toLocaleString() }}₫</p>
                <p><strong>Số quyển còn lại:</strong> {{ book.SoQuyen }}</p>

                <h3> Mô tả</h3>
                <p class="desc">{{ book.ChiTiet || "Không có mô tả." }}</p>

                <button class="btn-back" @click="goBack()">⬅ Quay lại</button>
            </div>
        </div>
    </div>

    <div v-else class="loading">Đang tải dữ liệu...</div>
</template>

<script>
import api from "../../services/api";

export default {
    name: "SachDetail",

    data() {
        return {
            book: null,
            nhaxuatbans: [],
            defaultImage: "https://via.placeholder.com/250x350?text=No+Image",
            allImages: {},
        };
    },

    // ⚡ Lấy ảnh khi component được khởi tạo
    created() {
        const all = import.meta.glob("../../assets/img/**/*.{jpg,jpeg,png,webp}", {
            eager: true,
        });
        this.allImages = all;

        this.loadBook();
        this.loadNXB();
    },

    methods: {
        // 🟢 Load thông tin 1 quyển sách
        async loadBook() {
            try {
                const id = this.$route.params.id;
                const res = await api.get(`/sach/id/${id}`);
                this.book = res.data;
            } catch (err) {
                console.error("❌ Lỗi khi tải chi tiết sách:", err);
            }
        },

        async loadNXB() {
            try {
                const res = await api.get("/nhaxuatban");
                this.nhaxuatbans = res.data;
            } catch (err) {
                console.error("❌ Lỗi khi tải danh sách NXB:", err);
            }
        },

        getNXBName(code) {
            const nxb = this.nhaxuatbans.find(x => x.MaNXB === code);
            return nxb ? nxb.TenNXB : code || "Chưa rõ";
        },


        // 🟢 Quay lại danh sách — ép router chuyển trang để reload dữ liệu
        goBack() {
            this.$router.back();
        },

        // 🟢 Xử lý ảnh sách
        getBookImage(book) {
            if (!book || !book.HinhAnh) return this.defaultImage;

            if (book.HinhAnh.startsWith("http"))
                return book.HinhAnh;

            if (book.HinhAnh.startsWith("./img/")) {
                const fileName = book.HinhAnh.split("/").pop();
                const found = Object.values(this.allImages)
                    .map((img) => img.default)
                    .find((imgPath) => imgPath.includes(fileName));
                return found || this.defaultImage;
            }

            if (book.HinhAnh.startsWith("/uploads/")) {
                return "http://localhost:3000" + book.HinhAnh;
            }

            return this.defaultImage;
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
</style>
