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
                    <i class="fa-solid fa-user me-2"></i> Xin chào {{ userName }}</span>
                <NotificationBell class="me-3" />
                <button @click="goTo('/admin/login')" class="btn btn-danger me-5">Đăng xuất</button>
            </div>
        </nav>


        <div class="main-wrapper">

            <!-- SIDEBAR -->
            <aside class="sidebar">
                <ul class="menu">
                    <li @click="goTo('/admin/docgia')" :class="{ active: isActive('/admin/docgia') }">Quản lí Độc Giả
                    </li>
                    <li @click="goTo('/admin/sach')" :class="{ active: isActive('/admin/sach') }">Quản lí Sách</li>
                    <li @click="goTo('/admin/sach/new')" :class="{ active: isActive('/admin/sach/new') }"> Danh mục Sách mới</li>
                    <li @click="goTo('/admin/muonsach')" :class="{ active: isActive('/admin/muonsach') }">Theo dõi mượn
                        sách</li>
                    <li @click="goTo('/admin/nhanvien')" :class="{ active: isActive('/admin/nhanvien') }">Quản lí nhân
                        viên</li>
                    <li @click="goTo('/admin/users')" :class="{ active: isActive('/admin/users') }">Quản lí người dùng
                    </li>

                    <li @click="goTo('/admin/phieuphat')" :class="{ active: isActive('/admin/phieuphat') }"> Quản lí
                        phiếu phạt</li>
                </ul>
            </aside>

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
const router = useRouter();
const route = useRoute();
import { ref, onMounted } from "vue";

const userName = ref("");

onMounted(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.username) {
        userName.value = user.username;
    }
});


const goTo = (path) => router.push(path);
const isActive = (path) => route.path === path;
</script>
