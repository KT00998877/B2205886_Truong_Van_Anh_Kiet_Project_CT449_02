<template>
    <div class="profile-page">
        <div class="profile-card">
            <h2>Thông tin độc giả</h2>
            <div v-if="loading" class="loading">Đang tải...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else>
                <div class="info-row"><strong>Mã độc giả:</strong> {{ profile.MaDocGia }}</div>
                <div class="info-row"><strong>Họ tên:</strong> {{ profile.HoLot }} {{ profile.Ten }}</div>
                <div class="info-row"><strong>Giới tính:</strong> {{ profile.Phai }}</div>
                <div class="info-row"><strong>Ngày sinh:</strong> {{ formatDate(profile.NgaySinh) }}</div>
                <div class="info-row"><strong>Địa chỉ:</strong> {{ profile.DiaChi }}</div>
                <div class="info-row"><strong>Số điện thoại:</strong> {{ profile.SoDienThoai }}</div>
            </div>
            <hr></hr>
            <h2>Thông tin người dùng</h2>
            <div v-if="loading" class="loading">Đang tải...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else>
                <div class="info-row"><strong>Username:</strong> {{ profile.userId.username }}</div>
                <div class="info-row"><strong>Email:</strong> {{ profile.userId.email }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const profile = ref(null);
const loading = ref(true);
const error = ref(null);

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
};

onMounted(async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/docgia/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });
        profile.value = res.data;
    } catch (err) {
        error.value = err.response?.data?.message || "Không thể tải thông tin độc giả!";
    } finally {
        loading.value = false;
    }
});
</script>

