<template>
    <div class="layout">
        <!-- Sidebar -->
        <div class="sidebar">
            <h2 class="logo">📚 Quản Lý Mượn Sách</h2>
            <ul class="menu">
                <li @click="goTo('/admin/docgia')" :class="{ active: isActive('/admin/docgia') }">Quản lí Độc Giả</li>
                <li @click="goTo('/admin/sach')" :class="{ active: isActive('/admin/sach') }">Quản lí Sách</li>
                <li @click="goTo('/admin/theodoimuonsach')" :class="{ active: isActive('/admin/theodoimuonsach') }">Theo
                    dõi mượn sách</li>
                <li @click="goTo('/admin/nhanvien')" :class="{ active: isActive('/admin/nhanvien') }">Quản lí nhân viên
                </li>
                <li @click="goTo('/admin/users')" :class="{ active: isActive('/admin/users') }">Quản lí người dùng</li>
            </ul>
        </div>

        <!-- Nội dung chính -->
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const goTo = (path) => {
    router.push(path);
};

const isActive = (path) => {
    
    return route && route.path === path;
};
</script>


