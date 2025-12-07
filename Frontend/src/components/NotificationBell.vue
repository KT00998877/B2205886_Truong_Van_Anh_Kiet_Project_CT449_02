<template>
    <div class="noti-wrapper">
        <!-- Nút chuông -->
        <div class="bell" @click="toggleDropdown" :title="userId ? 'Thông báo' : 'Vui lòng đăng nhập'">
            <i class="fa-solid fa-bell" :class="{ 'text-muted': !userId }"></i>

            <!-- Badge -->
            <span v-if="unreadCount > 0" class="badge-noti">{{ unreadCount }}</span>

            <!-- Icon khi chưa đăng nhập -->
            <span v-if="!userId" class="login-hint">🔒</span>
        </div>

        <!-- Popup danh sách -->
        <transition name="fade">
            <div v-if="showList" class="noti-box">
                <div class="noti-header">
                    <h4>Thông báo</h4>
                    <button v-if="userId" class="mark-all" @click="markAllAsRead">Đánh dấu tất cả đã đọc</button>
                </div>

                <div class="noti-content">
                    <!-- Hiển thị thông báo khi đã đăng nhập -->
                    <div v-if="userId">
                        <div v-for="noti in notifications" :key="noti._id" class="noti-item"
                            :class="{ unread: !noti.isRead }" @click="markAsRead(noti)">
                            <div class="noti-title">{{ noti.title }}</div>
                            <div class="noti-msg">{{ noti.message }}</div>
                            <div class="noti-time">{{ formatTime(noti.createdAt) }}</div>
                        </div>

                        <div v-if="notifications.length === 0" class="no-data">
                            Không có thông báo
                        </div>
                    </div>

                    <!-- Hiển thị khi chưa đăng nhập -->
                    <div v-else class="no-data">
                        <p>Vui lòng đăng nhập để xem thông báo</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import axios from "../services/api.js";
import socket from "../socket.js";
import "../assets/css/notification.css";
export default {
    name: "NotificationBell",

    data() {
        return {
            showList: false,
            notifications: [],
            userId: null,
            role: null,
        };
    },

    computed: {
        unreadCount() {
            return this.notifications.filter((n) => !n.isRead).length;
        }
    },

    methods: {
        async checkUserLogin() {
            try {
                const userStr = localStorage.getItem("user");
                if (userStr && userStr !== "null" && userStr !== "undefined") {
                    const user = JSON.parse(userStr);
                    this.userId = user._id || user.id || user.userId;
                    this.role = user.role;

                    if (this.userId) {
                        return true;
                    }
                }
                this.userId = null;
                this.role = null;
                return false;
            } catch (error) {
                this.userId = null;
                this.role = null;
                return false;
            }
        },

        async setupNotifications() {

            socket.emit("join-user", this.userId);
            await this.loadNotifications();


            socket.on("notification", (noti) => {

                if ((noti.userId && noti.userId.toString() === this.userId.toString()) ||
                    (!noti.userId && this.role === 'admin')) {
                    this.notifications.unshift(noti);
                }
            });
        },

        async loadNotifications() {
            if (!this.userId) return;

            try {
                const res = await axios.get(`/notifications/${this.userId}`);
                this.notifications = res.data;
            } catch (e) {
                console.error("Lỗi load thông báo:", e);
            }
        },

        toggleDropdown() {
            this.showList = !this.showList;
        },

        async markAsRead(noti) {
            if (noti.isRead) return;

            try {
                await axios.put(`/notifications/read/${noti._id}`);
                noti.isRead = true;
            } catch (e) {
                console.error("Lỗi mark read:", e);
            }
        },

        async markAllAsRead() {
            for (const n of this.notifications) {
                if (!n.isRead) await this.markAsRead(n);
            }
        },

        formatTime(time) {
            return new Date(time).toLocaleString("vi-VN");
        },
    },

    async mounted() {
        await this.checkUserLogin();
        if (this.userId) {
            await this.setupNotifications();
        }
    },
};
</script>

