<template>
    <div class="auth-page">
        <div class="content-wrapper">
            <div class="register-container">
                <img src="../../assets/img/logo.jpg" alt="User Register">
                <h2>Đăng ký</h2>
                <form @submit.prevent="handleRegister">
                    <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
                    <input v-model="email" type="email" placeholder="Email" required />
                    <input v-model="password" type="password" placeholder="Mật khẩu" required />
                    <button type="submit">Đăng ký</button>
                </form>
                <p>Đã có tài khoản? <router-link to="/user/login">Đăng nhập</router-link></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { registerUser } from "../../services/authService";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
    try {
        await registerUser({ username: username.value, email: email.value, password: password.value });
        alert("Đăng ký thành công!");
        router.push("/user/login");
    } catch (err) {
        alert(err.response?.data?.message || "Đăng ký thất bại!");
    }
};
</script>


