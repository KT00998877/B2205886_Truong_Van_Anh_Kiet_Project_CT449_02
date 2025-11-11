<template>
    <div class="layout">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="logo-section">
                <img src="../assets/img/logo.jpg" class="logo-image" alt="Library Logo" />
                <h2 class="logo-text">Quản lí thư viện</h2>
            </div>
            <hr></hr>
            <ul class="menu">
                <li @click="goTo('/admin/docgia')" :class="{ active: isActive('/admin/docgia') }">Quản lí Độc Giả</li>
                <li @click="goTo('/admin/sach')" :class="{ active: isActive('/admin/sach') }">Quản lí Sách</li>
                <li @click="goTo('/admin/muonsach')" :class="{ active: isActive('/admin/muonsach') }">Theo
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
<style scoped>
.logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
}
.logo-text {
    font-size: 1.6rem;
    font-weight: 700;
    color: white;
}
.logo-image {
    width: 70px;
    height: 70px;
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
.layout {
    display: flex;
    min-height: 100vh;
}
</style>

