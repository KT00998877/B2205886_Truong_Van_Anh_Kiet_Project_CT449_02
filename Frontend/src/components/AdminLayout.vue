<template>
    <div>

        <!-- NAVBAR -->
        <nav class="navbar">
            <div class="nav-left">
                <img src="../assets/img/logo.jpg" class="navbar-logo" />
                <span class="nav-title">Quản Lí Thư Viện</span>
            </div>

            <div class="nav-right">
                <button @click="goTo('/admin/login')" class="btn btn-danger">Đăng xuất</button>
            </div>
        </nav>

        
        <div class="main-wrapper">

            <!-- SIDEBAR -->
            <aside class="sidebar">
                <ul class="menu">
                    <li @click="goTo('/admin/docgia')" :class="{ active: isActive('/admin/docgia') }">Quản lí Độc Giả
                    </li>
                    <li @click="goTo('/admin/sach')" :class="{ active: isActive('/admin/sach') }">Quản lí Sách</li>
                    <li @click="goTo('/admin/muonsach')" :class="{ active: isActive('/admin/muonsach') }">Theo dõi mượn
                        sách</li>
                    <li @click="goTo('/admin/nhanvien')" :class="{ active: isActive('/admin/nhanvien') }">Quản lí nhân
                        viên</li>
                    <li @click="goTo('/admin/users')" :class="{ active: isActive('/admin/users') }">Quản lí người dùng
                    </li>
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
const router = useRouter();
const route = useRoute();

const goTo = (path) => router.push(path);
const isActive = (path) => route.path === path;
</script>
