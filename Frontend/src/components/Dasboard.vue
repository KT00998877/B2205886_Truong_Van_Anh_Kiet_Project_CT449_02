<template>
    <div class="auth-page">
        <div class="content-wrapper">
            <div class="select-container d-flex flex-column align-items-center justify-content-center text-center">
                <h1 class="text-light mb-4 display-4 fw-bold">Chào mừng bạn đến với Thư viện Văn Hiến</h1>
                <div class="btn-group btn-group-lg">
                    <button @click="goAdmin" class="btn btn-outline-warning me-2 rounded-pill text-light fs-4 px-4 py-2">Đăng nhập
                        Admin</button>
                    <button @click="goUser" class="btn btn-outline-warning rounded-pill text-light fs-4 px-4 py-2">Đăng nhập
                        User</button>
                </div>
            </div>
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
