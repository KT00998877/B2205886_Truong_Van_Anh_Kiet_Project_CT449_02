<template>
    <div class="container">
        <h1> Quản lý Người Dùng</h1>

        <!-- Nút mở form thêm -->
        <button class="open-form-btn" @click="showAddForm = true"> Thêm Người Dùng</button>

        <!-- Form thêm -->
        <div v-if="showAddForm" class="overlay">
            <div class="form-box">
                <h3> Thêm Người Dùng</h3>
                <form @submit.prevent="createUser" class="user-form">

                    <div class="form-grid">

                        <div class="form-group">
                            <label>Username:</label>
                            <input v-model="newUser.username" required />
                        </div>

                        <div class="form-group">
                            <label>Email:</label>
                            <input v-model="newUser.email" type="email" required />
                        </div>

                        <div class="form-group">
                            <label>Password:</label>
                            <input v-model="newUser.password" type="password" required />
                        </div>

                        <div class="form-group">
                            <label>Vai trò:</label>
                            <select v-model="newUser.role" required>
                                <option value="">-- Chọn vai trò --</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                    </div>

                    <div class="form-actions">
                        <button type="submit" class="save-btn">Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeForm">Hủy</button>
                    </div>
                </form>
            </div>
        </div>


        <!-- Form chỉnh sửa -->
        <div v-if="showEditForm" class="overlay">
            <div class="form-box">
                <h3>Cập nhật Người Dùng</h3>
                <form @submit.prevent="updateUser" class="user-form">

                    <div class="form-grid">

                        <div class="form-group">
                            <label>Username:</label>
                            <input v-model="editingUser.username" required />
                        </div>

                        <div class="form-group">
                            <label>Email:</label>
                            <input v-model="editingUser.email" type="email" required />
                        </div>

                        <div class="form-group">
                            <label>Vai trò:</label>
                            <select v-model="editingUser.role" required>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>

                    </div>

                    <div class="form-actions">
                        <button type="submit" class="save-btn">Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeEditForm">Hủy</button>
                    </div>
                </form>
            </div>
        </div>


        <!-- Bảng danh sách -->
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Vai Trò</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user._id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                        <button @click="editUser(user)"> Sửa</button>
                        <button @click="deleteUser(user._id)"> Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="loading">⏳ Đang tải dữ liệu...</p>
        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<script>
import axios from "../../services/api.js";

export default {
    data() {
        return {
            users: [],
            loading: false,
            error: null,
            showAddForm: false,
            showEditForm: false,
            newUser: {
                username: "",
                email: "",
                password: "",
                role: "",
            },
            editingUser: null,
        };
    },
    methods: {
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await axios.get("/users");
                this.users = response.data;
            } catch (err) {
                this.error = "❌ Lỗi khi tải danh sách người dùng.";
            } finally {
                this.loading = false;
            }
        },

        async hashPassword(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        },

        // ➕ Thêm user mới (hash password trước khi lưu)
        async createUser() {
            try {
                // Hash password trước khi gửi
                this.newUser.password = await this.hashPassword(this.newUser.password);
                await axios.post("/users", this.newUser);
                this.closeForm();
                this.fetchUsers();
            } catch (err) {
                console.error(err);
                this.error = "❌ Lỗi khi thêm người dùng.";
            }
        },

        // ✏️ Cập nhật user
        async updateUser() {
            try {
                await axios.put(`/users/${this.editingUser._id}`, this.editingUser);
                this.fetchUsers();
                this.closeEditForm();
            } catch (err) {
                this.error = "❌ Lỗi khi cập nhật người dùng.";
            }
        },

        // 🗑️ Xóa user
        async deleteUser(id) {
            try {
                await axios.delete(`/users/${id}`);
                this.fetchUsers();
            } catch (err) {
                this.error = "❌ Lỗi khi xóa người dùng.";
            }
        },

        // Mở form sửa
        editUser(user) {
            this.editingUser = { ...user };
            this.showEditForm = true;
        },

        // Đóng form thêm
        closeForm() {
            this.showAddForm = false;
            this.newUser = { username: "", email: "", password: "", role: "" };
        },

        // Đóng form sửa
        closeEditForm() {
            this.showEditForm = false;
            this.editingUser = null;
        },
    },
    mounted() {
        this.fetchUsers();
    },
};
</script>
<style scoped>
/* Overlay che nền */
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
}

.form-box {
    background: #fff;
    padding: 28px 36px;
    border-radius: 14px;
    width: 600px;
    max-width: 90%;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
}

.form-box h3 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 22px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 22px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 6px;
}

.form-group input,
.form-group select {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 15px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 20px;
}

.save-btn,
.cancel-btn {
    padding: 9px 18px;
    font-size: 15px;
}

/* Mobile responsive */
@media (max-width: 500px) {
    .form-box {
        width: 90%;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
