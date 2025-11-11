<template>
    <div class="auth-page">
        <div class="content-wrapper">
            <div class="register-container">
                <img src="../../assets/img/logo.jpg" alt="User Register" />
                <h2>Đăng ký</h2>

                <form @submit.prevent="handleRegister">
                    <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
                    <input v-model="email" type="email" placeholder="Email" required />
                    <input v-model="password" type="password" placeholder="Mật khẩu" required />

                    <input v-model="HoLot" type="text" placeholder="Họ lót" required />
                    <input v-model="Ten" type="text" placeholder="Tên" required />

                    <select v-model="Phai" required>
                        <option disabled value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>

                    <label>Ngày sinh:</label>
                    <input v-model="NgaySinh" type="date" required />

                    <input v-model="DiaChi" type="text" placeholder="Địa chỉ" required />
                    <input v-model="SoDienThoai" type="text" placeholder="Số điện thoại" required />

                    <button type="submit">Đăng ký</button>
                </form>

                <p>Đã có tài khoản?
                    <router-link to="/user/login">Đăng nhập</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { registerUser } from "../../services/authService";
import { useRouter } from "vue-router";

const router = useRouter();

// 🧠 Khai báo các trường trong form
const username = ref("");
const email = ref("");
const password = ref("");
const HoLot = ref("");
const Ten = ref("");
const Phai = ref("");
const NgaySinh = ref("");
const DiaChi = ref("");
const SoDienThoai = ref("");


const handleRegister = async () => {
    try {
        await registerUser({
            username: username.value,
            email: email.value,
            password: password.value,
            HoLot: HoLot.value,
            Ten: Ten.value,
            Phai: Phai.value,
            NgaySinh: NgaySinh.value,
            DiaChi: DiaChi.value,
            SoDienThoai: SoDienThoai.value,
        });
        alert("Đăng ký thành công!");
        router.push("/user/login");
    } catch (err) {
        alert(err.response?.data?.message || "Đăng ký thất bại!");
    }
};
</script>