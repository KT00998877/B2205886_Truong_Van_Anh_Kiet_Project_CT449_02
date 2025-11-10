<template>
    <div class="auth-page">
        <div class="content-wrapper">
            <div class="login-container">
                <img src="../../assets/img/logo.jpg" alt="Admin Login">
                <h2>Đăng nhập quản lý</h2>
                <form @submit.prevent="handleLogin">
                    <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
                    <input v-model="email" type="email" placeholder="Email" required />
                    <input v-model="password" type="password" placeholder="Mật khẩu" required />
                    <button type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { loginAdmin } from "../../services/authService.js";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");

const handleLogin = async () => {
    try {
        const res = await loginAdmin({ username: username.value, email: email.value, password: password.value });
        localStorage.setItem("adminToken", res.data.token);
        alert("Đăng nhập thành công!");
        router.push("/admin/docgia");
    } catch (err) {
        alert(err.response?.data?.message || "Đăng nhập thất bại!");
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 80px auto;
    text-align: center;
}
</style>
