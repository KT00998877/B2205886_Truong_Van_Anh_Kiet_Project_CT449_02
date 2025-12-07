<template>
    <div class="container-fluid">
        <div class="profile-wrapper">
            <!-- Card Thông tin độc giả -->
            <div class="profile-card">
                <h2>Thông tin độc giả</h2>

                <div v-if="loading" class="loading">Đang tải...</div>
                <div v-else-if="error" class="error">{{ error }}</div>

                <div v-else class="info-list">
                    <div class="info-row"><strong>Mã độc giả:</strong> {{ profile.MaDocGia }}</div>
                    <div class="info-row"><strong>Họ tên:</strong> {{ profile.HoLot }} {{ profile.Ten }}</div>
                    <div class="info-row"><strong>Giới tính:</strong> {{ profile.Phai }}</div>
                    <div class="info-row"><strong>Ngày sinh:</strong> {{ formatDate(profile.NgaySinh) }}</div>
                    <div class="info-row"><strong>Địa chỉ:</strong> {{ profile.DiaChi }}</div>
                    <div class="info-row"><strong>Số điện thoại:</strong> {{ profile.SoDienThoai }}</div>
                </div>

                <div class="button-wrapper">
                    <button class="edit-btn" @click="openEdit">Chỉnh sửa</button>
                </div>
            </div>

            <!-- Card thông tin người dùng -->
            <div class="profile-card">
                <h2>Thông tin người dùng</h2>

                <div v-if="loading" class="loading">Đang tải...</div>
                <div v-else class="info-list">
                    <div class="info-row"><strong>Username:</strong> {{ profile.userId.username }}</div>
                    <div class="info-row"><strong>Email:</strong> {{ profile.userId.email }}</div>
                </div>
                <div class="button-wrapper">
                    <button class="edit-btn" @click="openUserEdit">Chỉnh sửa tài khoản</button>
                    <button class="edit-btn change-pass-btn" @click="openPasswordEdit">Đổi mật khẩu</button>
                </div>
            </div>
        </div>

        <!-- Popup chỉnh sửa thông tin độc giả -->
        <div v-if="editing" class="modal-overlay">
            <div class="modal-card">
                <h3>Chỉnh sửa thông tin độc giả</h3>

                <label>Họ lót:</label>
                <input v-model="form.HoLot" />

                <label>Tên:</label>
                <input v-model="form.Ten" />

                <label>Giới tính:</label>
                <select v-model="form.Phai">
                    <option>Nam</option>
                    <option>Nữ</option>
                </select>

                <label>Địa chỉ:</label>
                <input v-model="form.DiaChi" />

                <label>Số điện thoại:</label>
                <input v-model="form.SoDienThoai" />

                <div class="modal-buttons">
                    <button class="save-btn" @click="updateProfile">Lưu lại</button>
                    <button class="cancel-btn" @click="editing = false">Hủy</button>
                </div>
            </div>
        </div>

        <!-- Popup chỉnh sửa tài khoản (username, email) -->
        <div v-if="editingUser" class="modal-overlay">
            <div class="modal-card">
                <h3>Chỉnh sửa tài khoản</h3>

                <label>Username:</label>
                <input v-model="userForm.username" />

                <label>Email:</label>
                <input v-model="userForm.email" />

                <div class="modal-buttons">
                    <button class="save-btn" @click="updateUser">Lưu lại</button>
                    <button class="cancel-btn" @click="editingUser = false">Hủy</button>
                </div>
            </div>
        </div>

        <!-- Popup đổi mật khẩu (TÁCH RIÊNG) -->
        <div v-if="editingPassword" class="modal-overlay">
            <div class="modal-card">
                <h3>Đổi mật khẩu</h3>

                <label>Mật khẩu cũ:</label>
                <input type="password" v-model="passwordForm.oldPassword" placeholder="Nhập mật khẩu cũ" />

                <label>Mật khẩu mới:</label>
                <input type="password" v-model="passwordForm.newPassword" placeholder="Nhập mật khẩu mới" />

                <div class="modal-buttons">
                    <button class="save-btn" @click="changePassword">Đổi mật khẩu</button>
                    <button class="cancel-btn" @click="closePasswordEdit">Hủy</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const profile = ref(null);
const loading = ref(true);
const error = ref(null);
const form = ref({});
const editing = ref(false);
const editingUser = ref(false);
const editingPassword = ref(false);  // ✅ THÊM state riêng cho popup đổi mật khẩu
const userForm = ref({});

const passwordForm = ref({
    oldPassword: "",
    newPassword: "",
});

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
};

// ✅ Mở popup chỉnh sửa tài khoản
const openUserEdit = () => {
    userForm.value = { ...profile.value.userId };
    editingUser.value = true;
};

// ✅ Mở popup đổi mật khẩu
const openPasswordEdit = () => {
    passwordForm.value = { oldPassword: "", newPassword: "" };  // Reset form
    editingPassword.value = true;
};

// ✅ Đóng popup đổi mật khẩu
const closePasswordEdit = () => {
    passwordForm.value = { oldPassword: "", newPassword: "" };  // Reset form
    editingPassword.value = false;
};

// ✅ Hàm đổi mật khẩu
const changePassword = async () => {
    // Kiểm tra đầu vào
    if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword) {
        alert("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới!");
        return;
    }

    if (passwordForm.value.newPassword.length < 6) {
        alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await axios.put(
            "http://localhost:3000/api/users/change-password",
            passwordForm.value,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Đổi mật khẩu thành công!");
        closePasswordEdit();  // Đóng popup sau khi thành công
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi đổi mật khẩu!");
    }
};

onMounted(async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/docgia/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        profile.value = res.data;
        form.value = { ...res.data };
    } catch (err) {
        error.value = err.response?.data?.message || "Không thể tải thông tin độc giả!";
    } finally {
        loading.value = false;
    }
});

const openEdit = () => {
    form.value = { ...profile.value };
    editing.value = true;
};

const updateProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
            "http://localhost:3000/api/docgia/profile",
            form.value,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        alert("Cập nhật thành công!");

        profile.value = {
            ...profile.value,
            ...res.data.data
        };

        editing.value = false;
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi cập nhật!");
    }
};

const updateUser = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await axios.put(
            "http://localhost:3000/api/users/profile/update",
            userForm.value,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        alert("Cập nhật tài khoản thành công!");

        profile.value.userId = {
            ...profile.value.userId,
            ...res.data.data
        };

        editingUser.value = false;

    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi cập nhật người dùng!");
    }
};

</script>


<style scoped>
.container-fluid {
    padding: 40px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
    min-height: 100vh;
}

.profile-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    max-width: 1100px;
    margin: 0 auto;
}

.profile-card {
    flex: 1;
    min-width: 320px;
    max-width: 500px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}

.profile-card>h2 {
    font-size: 21px;
    font-weight: 700;
    color: white;
    margin: 0;
    padding: 20px 30px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    letter-spacing: 0.5px;
}

.info-list {
    padding: 10px 0;
}

.info-row {
    display: flex;
    align-items: center;
    padding: 16px 30px;
    font-size: 16px;
    border-bottom: 1px solid #eef2f6;
    transition: background 0.25s ease;
}

.info-row:hover {
    background: #f8fbff;
}

.info-row strong {
    min-width: 140px;
    color: #44476a;
    font-weight: 600;
}

.info-row:last-child {
    border-bottom: none;
}

.loading {
    text-align: center;
    padding: 80px 20px;
    font-size: 18px;
    color: #667eea;
}

.loading::after {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 3px solid #667eea;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-left: 12px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error {
    text-align: center;
    padding: 60px 20px;
    color: #e63946;
    font-size: 17px;
    font-weight: 500;
}

.button-wrapper {
    text-align: center;
    padding: 20px 0;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.edit-btn {
    background: #667eea;
    color: white;
    padding: 10px 22px;
    font-size: 15px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: 0.3s;
}

.edit-btn:hover {
    background: #5564c8;
}

.change-pass-btn {
    background: #f59e0b;
}

.change-pass-btn:hover {
    background: #d97706;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-card {
    width: 420px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}

.modal-card h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.modal-card label {
    display: block;
    margin-top: 15px;
    font-weight: 600;
    color: #555;
}

.modal-card input,
.modal-card select {
    width: 100%;
    padding: 10px;
    margin-top: 6px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
}

.modal-card input:focus,
.modal-card select:focus {
    outline: none;
    border-color: #667eea;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
    gap: 10px;
}

.save-btn {
    flex: 1;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: 0.3s;
}

.save-btn:hover {
    background: #218838;
}

.cancel-btn {
    flex: 1;
    background: #dc3545;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: 0.3s;
}

.cancel-btn:hover {
    background: #c82333;
}

@media (max-width: 768px) {
    .profile-wrapper {
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }

    .profile-card {
        width: 100%;
        max-width: 460px;
    }

    .modal-card {
        width: 90%;
        max-width: 400px;
    }
}
</style>