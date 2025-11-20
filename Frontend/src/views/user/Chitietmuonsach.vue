<template>
    <div class="container-fluid">
        <h2> Lịch sử mượn sách của bạn</h2>

        <div v-if="loading" class="loading"> Đang tải dữ liệu...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else>
            <div v-if="records.length === 0" class="empty">Bạn chưa mượn quyển sách nào.</div>

            <div class="borrow-list">
                <div v-for="(item, index) in records" :key="item?._id || index" class="borrow-card">

                    <!-- BOX STT + HÌNH -->
                    <div class="book-left">
                        <div class="stt">{{ index + 1 }}</div>

                        <img class="book-img" :src="getBookImageCart(item.MaSach)" alt="ảnh sách" />
                    </div>

                    <!-- THÔNG TIN SÁCH -->
                    <div class="book-info">
                        <h3>{{ item?.MaSach?.TenSach || "Không rõ tên sách" }}</h3>
                        <p><strong>Tác giả:</strong> {{ item?.MaSach?.TacGia || "N/A" }}</p>
                        <p><strong>Thể loại:</strong> {{ item?.MaSach?.TheLoai || "N/A" }}</p>
                    </div>

                    <!-- CHI TIẾT MƯỢN — ĐÃ SỬA -->
                    <div class="borrow-details">
                        <p><strong>Ngày mượn:</strong> {{ formatDate(item?.NgayMuon) }}</p>
                        <p><strong>Hạn trả:</strong> {{ formatDate(item?.HanTra) }}</p>

                        <p>
                            <strong>Trạng thái:</strong>
                            <span :class="['status', getStatusClass(item?.TrangThai)]">
                                {{ item?.TrangThai }}
                            </span>
                        </p>

                        <p v-if="item?.TrangThai === 'Từ chối'">
                            <strong>Lý do từ chối: </strong>
                            <span class="reject-reason">{{ item?.Lydo || "Không có lý do" }}</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api.js";
import axios from "axios";

const records = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

const defaultImage = "https://via.placeholder.com/200x280?text=No+Image";
const allImages = import.meta.glob("../../assets/img/**/*.{jpg,jpeg,png,webp}", { eager: true });
const groupedImages = {};

Object.entries(allImages).forEach(([path, mod]) => {
    const parts = path.split("/");
    const folder = parts[parts.length - 2];
    if (!groupedImages[folder]) groupedImages[folder] = [];
    groupedImages[folder].push(mod.default);
});

const getBookImageCart = (s) => {
    if (!s || !s.HinhAnh) return defaultImage;

    if (s.HinhAnh.startsWith("http")) return s.HinhAnh;

    if (s.HinhAnh.startsWith("./img/")) {
        const relativePath = s.HinhAnh.replace("./", "../assets/");
        const found = Object.values(groupedImages)
            .flat()
            .find((imgPath) => imgPath.includes(relativePath.split("/").pop()));
        return found || defaultImage;
    }

    if (s.HinhAnh.startsWith("/uploads/")) {
        return `http://localhost:5000${s.HinhAnh}`;
    }

    return defaultImage;
};

const getStatusClass = (status) => {
    switch (status) {
        case "Chờ duyệt":
            return "pending";
        case "Đã duyệt - Đang mượn":
            return "active";
        case "Đã trả":
            return "done";
        case "Quá hạn":
            return "overdue";
        case "Từ chối":
            return "rejected";
        default:
            return "";
    }
};



onMounted(async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            error.value = "Bạn chưa đăng nhập!";
            return;
        }

        // 🟢 Cập nhật trạng thái Quá hạn trong DB
        await api.put("/theodoimuonsach/capnhat-quahan");

        // 🟢 Lấy profile
        const profileRes = await axios.get("http://localhost:3000/api/docgia/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const maDocGia = profileRes.data.MaDocGia;

        // 🟢 Lấy danh sách mượn theo độc giả
        const res = await api.get(`/theodoimuonsach/docgia/${maDocGia}`);
        records.value = res.data || [];

    } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
    } finally {
        loading.value = false;
    }
});

</script>
<style scoped>
.borrow-page {
    max-width: 900px;
    margin: 40px auto;
    background: #fffaf4;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(160, 82, 45, 0.15);
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    animation: fadeIn 0.5s ease-out;
}

h2 {
    text-align: center;
    color: #4a2c0b;
    margin-bottom: 20px;
}

.loading,
.error,
.empty {
    text-align: center;
    margin-top: 30px;
    color: #8b4513;
    font-weight: 500;
}

.error {
    color: red;
}

.borrow-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.borrow-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.borrow-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(160, 82, 45, 0.2);
}

.book-info {
    flex: 1;
    min-width: 250px;
}

.book-info h3 {
    margin-bottom: 5px;
    color: #a0522d;
}

.borrow-details {
    flex: 1;
    min-width: 250px;
}

.status {
    padding: 4px 10px;
    border-radius: 8px;
    font-weight: 600;
    color: white;
}

.status.pending {
    background-color: #ff9800;
}

.status.active {
    background-color: #2196f3;
}

.status.done {
    background-color: #4caf50;
}

.status.overdue {
    background-color: #d32f2f;
}

.status.rejected {
    background-color: #9c27b0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.book-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 15px;
}

.stt {
    background: #8b4513;
    color: white;
    padding: 4px 10px;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 14px;
}

.book-img {
    width: 90px;
    height: 120px;
    border-radius: 6px;
    object-fit: cover;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}
</style>