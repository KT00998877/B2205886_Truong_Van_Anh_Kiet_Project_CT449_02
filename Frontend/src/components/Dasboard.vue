<template>
    <div class="select-container">
        <h1>Chào mừng bạn đến với Thư viện Văn Hiến</h1>

        <div class="btn-group">
            <button @click="goAdmin">Đăng nhập Admin</button>
            <button @click="goUser">Đăng nhập User</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goAdmin = () => {
    router.push("/admin/login");
};

const goUser = () => {
    router.push("/user/login");
};
</script>

<style>
.select-container {
    text-align: center;
    margin-top: 100px;
}

.btn-group button {
    margin: 10px;
    padding: 15px 25px;
    font-size: 18px;
    cursor: pointer;
}
</style>
