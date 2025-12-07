<template>
    <div>
        <!-- NAVBAR -->
        <nav class="navbar">
            <div class="nav-left">
                <img src="../assets/img/logo.jpg" class="navbar-logo" />
                <span class="nav-title">Quản Lí Thư Viện</span>
            </div>

            <div class="nav-right">

                <span class="text-white align-items-center fs-5 me-5">
                    <i class="fa-solid fa-user me-2"></i> Xin chào {{ HoLot }} {{ Ten }}
                </span>

                <NotificationBell class="me-3" />

                <button class="btn-cart btn btn-warning me-3" @click="goTo('/user/cart')">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>


                <button @click="goTo('/user/login')" class="btn btn-danger me-5">Đăng xuất</button>
            </div>
        </nav>
        <div class="main-wrapper">


            <div class="sidebar">
                <ul class="menu">
                    <li @click="goTo('/user/sach')" :class="{ active: isActive('/user/sach') }"> Thư viện sách</li>
                    <li @click="goTo('/user/sachnew')" :class="{ active: isActive('/user/sachnew') }"> Sách mới</li>
                    <li @click="goTo('/user/cart')" :class="{ active: isActive('/user/cart') }"> Xem sách trong giỏ</li>
                    
                    <li @click="goTo('/user/muonsach')" :class="{ active: isActive('/user/muonsach') }"> Lịch Sử Mượn
                        Sách</li>
                    <li @click="goTo('/user/profile')" :class="{ active: isActive('/user/profile') }"> Hồ sơ cá nhân
                    </li>

                    <li @click="goTo('/user/phieuphat')" :class="{ active: isActive('/user/phieuphat') }"> Phiếu phạt
                        của tôi
                    </li>
                </ul>
            </div>
            <!-- CONTENT -->
            <main class="content">
                <router-view />
            </main>

        </div>

    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import NotificationBell from "./NotificationBell.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const userName = ref("");
const HoLot = ref("");
const Ten = ref("");

// 🔥 Lấy tên user từ API /docgia/profile
onMounted(async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3000/api/docgia/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // backend trả userId.username
        userName.value = res.data.userId.username;
        HoLot.value = res.data.HoLot;
        Ten.value = res.data.Ten;

    } catch (err) {
        console.error("Lỗi lấy username:", err);
    }
});

const goTo = (path) => router.push(path);
const isActive = (path) => route && route.path === path;
</script>

<style scoped>
.logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
}

.logo-text {
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
}
.logo-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 12px;
    margin-left: 12px;
}
.menu li.active {
    background-color: #2563eb;
}
.hr {
    border: none;
    border-top: 1px solid #fff9f9f9;
    margin: 0 12px 1rem 12px;
}
.menu li {
    cursor: pointer;
}
.menu li:hover {
    background-color: #3b82f6;
}

.content {
    flex: 1;
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
}
</style>
