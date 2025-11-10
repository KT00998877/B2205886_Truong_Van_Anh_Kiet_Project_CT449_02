<template>
    <div class="user-view">
        <h1>👥 Quản lý Người Dùng</h1>

        <!-- Nút mở form thêm -->
        <button class="open-form-btn" @click="showAddForm = true">➕ Thêm Người Dùng</button>

        <!-- Form thêm -->
        <div v-if="showAddForm" class="overlay">
            <div class="add-form">
                <h3>➕ Thêm Người Dùng</h3>
                <form @submit.prevent="createUser">
                    <label>Username:</label>
                    <input v-model="newUser.username" required />

                    <label>Email:</label>
                    <input v-model="newUser.email" type="email" required />

                    <label>Password:</label>
                    <input v-model="newUser.password" type="password" required />

                    <label>Vai trò:</label>
                    <input v-model="newUser.role" placeholder="admin hoặc user" required />

                    <div class="form-actions">
                        <button type="submit" class="save-btn">💾 Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeForm">❌ Hủy</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Form chỉnh sửa -->
        <div v-if="showEditForm" class="overlay">
            <div class="form-box">
                <h3>✏️ Cập nhật Người Dùng</h3>
                <form @submit.prevent="updateUser">
                    <label>Username:</label>
                    <input v-model="editingUser.username" required />

                    <label>Email:</label>
                    <input v-model="editingUser.email" type="email" required />

                    <label>Vai trò:</label>
                    <input v-model="editingUser.role" required />

                    <div class="form-actions">
                        <button type="submit" class="save-btn">💾 Lưu</button>
                        <button type="button" class="cancel-btn" @click="closeEditForm">❌ Hủy</button>
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
                        <button @click="editUser(user)">✏️ Sửa</button>
                        <button @click="deleteUser(user._id)">🗑️ Xóa</button>
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

