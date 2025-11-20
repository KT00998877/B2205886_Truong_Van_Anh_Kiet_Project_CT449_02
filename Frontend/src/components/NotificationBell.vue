<template>
    <div class="noti-wrapper">
        <!-- Nút chuông -->
        <div class="bell" @click="toggleDropdown">
            <i class="fa-solid fa-bell"></i>

            <!-- Badge -->
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </div>

        <!-- Popup danh sách -->
        <transition name="fade">
            <div v-if="showList" class="noti-box">
                <div class="noti-header">
                    <h4>Thông báo</h4>
                    <button class="mark-all" @click="markAllAsRead">Đánh dấu tất cả đã đọc</button>
                </div>

                <div class="noti-content">
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
            </div>
        </transition>
    </div>
</template>

<script>
import axios from "../services/api.js"; 
import socket from "../socket.js";
socket.on("notification", (noti) => {
    console.log("📢 REALTIME NOTIFICATION:", noti);
});
export default {
    name: "NotificationBell",

    data() {
        return {
            showList: false,
            notifications: [],
            userId: null,
        };
    },

    computed: {
        unreadCount() {
            return this.notifications.filter((n) => !n.isRead).length;
        }
    },

    methods: {
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
                if (!n.isRead) this.markAsRead(n);
            }
        },

        formatTime(time) {
            return new Date(time).toLocaleString("vi-VN");
        },
    },

    async mounted() {
        // Lấy userId từ token hoặc localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) this.userId = user.id;

        await this.loadNotifications();

        // Nhận thông báo realtime
        socket.on("notification", (noti) => {
            // Chỉ nhận thông báo đúng user
            if (!noti.userId || noti.userId === this.userId) {
                this.notifications.unshift(noti);
            }
        });
    },
};
</script>

<style scoped>
.noti-wrapper {
    position: relative;
    display: inline-block;
}

.bell {
    cursor: pointer;
    font-size: 24px;
    position: relative;
    color: #444;
}

.bell:hover {
    color: #000;
}

.badge {
    position: absolute;
    top: -6px;
    right: -8px;
    background: red;
    color: white;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 50%;
}

.noti-box {
    position: absolute;
    width: 340px;
    right: 0;
    top: 36px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
    z-index: 999;
    overflow: hidden;
}

.noti-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #eee;
}

.noti-content {
    max-height: 400px;
    overflow-y: auto;
}

.noti-item {
    padding: 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.noti-item:hover {
    background: #f7f7f7;
}

.unread {
    background: #e8f0ff;
    font-weight: 600;
}

.noti-title {
    font-size: 14px;
}

.noti-msg {
    font-size: 13px;
    color: #555;
}

.noti-time {
    margin-top: 6px;
    font-size: 11px;
    color: #888;
}

.no-data {
    text-align: center;
    padding: 20px;
    color: #888;
}

/* transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
