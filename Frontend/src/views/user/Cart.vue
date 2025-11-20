<template>
    <div class="cart-container">

        <h2 class="title">
            <i class="fa-solid fa-cart-shopping"></i>
            Giỏ sách của bạn
        </h2>

        <!-- Nếu giỏ trống -->
        <div v-if="cart.length === 0" class="empty-cart">
            <p>Giỏ sách đang trống.</p>
            <button class="btn-back" @click="goTo('/user/sach')">
                ← Quay lại danh sách sách
            </button>
        </div>

        <!-- Danh sách sách trong giỏ -->
        <div v-else class="cart-list">

            <div class="cart-item" v-for="item in cart" :key="item.MaSach._id">
                <input type="checkbox" v-model="selectedBooks" :value="item.MaSach._id" class="book-checkbox" />

                <img :src="getBookImageCart(item.MaSach)" class="cart-img" />


                <div class="cart-info">
                    <h3>{{ item.MaSach.TenSach }}</h3>
                    <p>Tác giả: {{ item.MaSach.TacGia }}</p>
                    <p>Số lượng: {{ item.SoLuong }}</p>
                </div>

                <div class="qty-box me-2">
                    <button class="qty-btn me-2" @click="decreaseQty(item.MaSach._id)">−</button>
                    <span class="qty-number me-2">{{ item.SoLuong }}</span>
                    <button class="qty-btn me-2" @click="increaseQty(item.MaSach._id)">+</button>
                </div>

                <button class="btn-remove" @click="removeItem(item.MaSach._id)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>

            <!-- Form mượn tất cả -->
            <div class="borrow-box">
                <label>Ngày mượn</label>
                <input type="date" v-model="borrowDate" />

                <label>Hạn trả</label>
                <input type="date" v-model="returnDate" />

                <button class="btn-borrow" @click="borrowSelected">
                    Mượn sách đã chọn
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";

const router = useRouter();
const goTo = (path) => router.push(path);

const cart = ref([]);
const borrowDate = ref("");
const returnDate = ref("");
const defaultImage = "https://via.placeholder.com/200x280?text=No+Image";
const allImages = import.meta.glob("../../assets/img/**/*.{jpg,jpeg,png,webp}", { eager: true });
const groupedImages = {};
const selectedBooks = ref([]);

Object.entries(allImages).forEach(([path, mod]) => {
    const parts = path.split("/");
    const folder = parts[parts.length - 2];
    if (!groupedImages[folder]) groupedImages[folder] = [];
    groupedImages[folder].push(mod.default);
});

// Hàm lấy ảnh giống Sach.vue
const getBookImageCart = (s) => {
    if (!s || !s.HinhAnh) return defaultImage;

    // Nếu là link HTTP
    if (s.HinhAnh.startsWith("http")) return s.HinhAnh;

    // Nếu là ảnh trong assets dùng "./img/"
    if (s.HinhAnh.startsWith("./img/")) {
        const relativePath = s.HinhAnh.replace("./", "../assets/");
        const found = Object.values(groupedImages)
            .flat()
            .find((imgPath) => imgPath.includes(relativePath.split("/").pop()));
        return found || defaultImage;
    }

    // Nếu là ảnh upload
    if (s.HinhAnh.startsWith("/uploads/")) {
        return `http://localhost:5000${s.HinhAnh}`;
    }

    return defaultImage;
};


onMounted(async () => {
    const token = localStorage.getItem("token");

    try {
        const res = await api.get("/cart", {
            headers: { Authorization: `Bearer ${token}` }
        });

        cart.value = res.data?.Items || [];
    } catch (err) {
        console.error("Lỗi tải giỏ hàng:", err);
    }
});

// ❌ Xóa 1 sách trong giỏ
const removeItem = async (id) => {
    const token = localStorage.getItem("token");

    try {
        await api.delete(`/cart/remove/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        cart.value = cart.value.filter((item) => item.MaSach._id !== id);
    } catch (err) {
        console.error("Lỗi xóa sách:", err);
    }
};

// Mượn sách đã chọn
const borrowSelected = async () => {
    if (selectedBooks.value.length === 0) {
        alert("Vui lòng chọn ít nhất 1 quyển sách!");
        return;
    }

    if (!borrowDate.value || !returnDate.value) {
        alert("Vui lòng chọn ngày mượn và hạn trả!");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        await api.post(
            "/cart/borrow-selected",
            {
                Books: selectedBooks.value,
                NgayMuon: borrowDate.value,
                HanTra: returnDate.value
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Mượn sách thành công!");
        cart.value = cart.value.filter(
            item => !selectedBooks.value.includes(item.MaSach._id)
        );
        selectedBooks.value = [];
    } catch (err) {
        console.error("Lỗi khi mượn:", err);
        alert(err.response?.data?.message || "Không thể mượn sách!");
    }
};

// Tăng số lượng
const increaseQty = async (id) => {
    try {
        await api.put(`/cart/update-qty/${id}`, {
            type: "increase"
        });

        const item = cart.value.find(i => i.MaSach._id === id);
        if (item) item.SoLuong++;
    } catch (err) {
        console.error(err);
    }
};
// Giảm
const decreaseQty = async (id) => {
    try {
        await api.put(`/cart/update-qty/${id}`, {
            type: "decrease"
        });

        const item = cart.value.find(i => i.MaSach._id === id);
        if (item && item.SoLuong > 1) item.SoLuong--;
    } catch (err) {
        console.error(err);
    }
};


</script>

<style scoped>
.cart-container {
    width: 90%;
    margin: auto;
    padding-top: 20px;
}

.book-checkbox {
    width: 18px;
    height: 18px;
    margin-right: 12px;
}
.title {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.empty-cart {
    text-align: center;
    padding: 40px;
}

.btn-back {
    padding: 10px 20px;
    background-color: #1565c0;
    color: white;
    border-radius: 6px;
    cursor: pointer;
}

.cart-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cart-item {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 12px;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.cart-img {
    width: 90px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
}

.cart-info {
    flex: 1;
    margin-left: 15px;
}

.btn-remove {
    background: #e53935;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
}

.borrow-box {
    margin-top: 30px;
    padding: 20px;
    background: #f0f4ff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.btn-borrow {
    padding: 12px;
    background-color: #28a745;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
}
</style>
