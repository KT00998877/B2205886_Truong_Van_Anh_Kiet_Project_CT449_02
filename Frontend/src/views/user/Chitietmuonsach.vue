<template>
    <div class="borrow-page">
        <h2>📚 Lịch sử mượn sách của bạn</h2>

        <div v-if="loading" class="loading">⏳ Đang tải dữ liệu...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else>
            <div v-if="records.length === 0" class="empty">Bạn chưa mượn quyển sách nào.</div>

            <div class="borrow-list">
                <div v-for="item in records" :key="item._id" class="borrow-card">
                    <div class="book-info">
                        <h3>{{ item.MaSach?.TenSach || "Không rõ tên sách" }}</h3>
                        <p><strong>Tác giả:</strong> {{ item.MaSach?.TacGia || "N/A" }}</p>
                        <p><strong>Thể loại:</strong> {{ item.MaSach?.TheLoai || "N/A" }}</p>
                    </div>

                    <div class="borrow-details">
                        <p><strong>Ngày mượn:</strong> {{ formatDate(item.NgayMuon) }}</p>
                        <p><strong>Hạn trả:</strong> {{ formatDate(item.HanTra) }}</p>
                        <p>
                            <strong>Trạng thái:</strong>
                            <span :class="['status', getStatusClass(item.TrangThai)]">
                                {{ item.TrangThai }}
                            </span>
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

const getStatusClass = (status) => {
    switch (status) {
        case "Chờ duyệt":
            return "pending";
        case "Đang mượn":
            return "active";
        case "Đã trả":
            return "done";
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

        // 🟢 Lấy thông tin độc giả hiện tại
        const profileRes = await axios.get("http://localhost:3000/api/docgia/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const maDocGia = profileRes.data.MaDocGia;

        // 🟢 Lấy danh sách mượn sách của độc giả
        const res = await api.get(`/theodoimuonsach/docgia/${maDocGia}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        records.value = res.data || [];
    } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu mượn:", err);
        error.value = err.response?.data?.message || "Không thể tải dữ liệu mượn sách.";
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
</style>