<template>
    <div class="container-fluid">
        <h2> Phiếu phạt của bạn </h2>

        <div v-if="loading" class="loading">Đang tải dữ liệu...</div>

        <div v-else>
            <div v-if="fines.length === 0" class="empty">Bạn không có phiếu phạt nào.</div>

            <div class="borrow-list">
                <div v-for="f in fines" :key="f._id" class="borrow-card">
                    <div class="book-info">
                        <h2>Phiếu phạt #{{ f._id.substring(0, 6).toUpperCase() }}</h2>
                        <h4><strong>Tên sách:</strong> {{ f.MaSach?.TenSach || 'Không rõ' }}</h4>
                        <p><strong>Số tiền:</strong> {{ f.soTien }} đ</p>
                        <p><strong>Lý do:</strong> {{ f.lyDo }}</p>
                        <p><strong>Ngày tạo:</strong> {{ formatDate(f.createdAt) }}</p>

                        <p>
                            <strong>Trạng thái:</strong>
                            <span :class="[
                                'status',
                                f.trangThai === 'Đã thanh toán' ? 'done' : 'pending'
                            ]">
                                {{ f.trangThai }}
                            </span>
                        </p>

                        <div class="actions" v-if="f.trangThai === 'Chưa thanh toán'">
                            <button class="btn btn-success btn-sm px-4 py-2 fw-bold" @click="payFine(f)">
                                💳 Thanh toán
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- Popup QR -->
        <div v-if="showQR" class="qr-overlay">
            <div class="qr-box">
                <h3>🔰 Thanh toán phiếu phạt</h3>

                <p><strong>Mã độc giả:</strong> {{ selectedFine.MaDocGia }}</p>
                <p><strong>Số tiền:</strong> {{ selectedFine.soTien.toLocaleString() }} đ</p>

                <div class="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                    <img :src="vnpayQR" class="qr-img" alt="QR VNPAY" />
                    <img :src="bankQR" class="qr-img" alt="QR Bank" />
                    <img :src="zaloQR" class="qr-img" alt="QR ZaloPay" />
                </div>



                <button class="btn btn-success w-100 mt-3 fw-bold" @click="confirmPayment(selectedFine._id)">
                    Xác nhận thanh toán
                </button>

                <button class="btn btn-secondary w-100 mt-2" @click="showQR = false">
                    ❌ Đóng
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api.js';
import vnpayQR from '../../assets/img/QR/vnpay.png';
import bankQR from '../../assets/img/QR/bank.png';
import zaloQR from '../../assets/img/QR/zalopay.png';

const fines = ref([]);
const loading = ref(true);
const showQR = ref(false);
const selectedFine = ref(null);

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

const loadUserFines = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await api.get(`/phieuphat/user/${user.id}`);
    fines.value = res.data;
};

const confirmPayment = async (id) => {
    try {
        await api.put(`/phieuphat/thanhtoan/${id}`);
        alert("Thanh toán thành công!");
        showQR.value = false;
        loadUserFines();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi thanh toán!");
    }
};

const payFine = (fine) => {
    selectedFine.value = fine;
    showQR.value = true;
};


onMounted(async () => {
    await loadUserFines();
    loading.value = false;
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
    padding: 4px 12px;
    border-radius: 8px;
    font-weight: 600;
    color: white;
    display: inline-block;
}

.status.pending {
    background-color: #e67e22;
    /* Chưa thanh toán - cam */
}

.status.done {
    background-color: #27ae60;
    /* Đã thanh toán - xanh */
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
.qr-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.qr-box {
    background: white;
    padding: 25px;
    border-radius: 12px;
    width: 600px;
    text-align: center;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.qr-img {
    width: 150px;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}
</style>