import { createRouter, createWebHistory } from "vue-router";

import AdminLayout from "../components/AdminLayout.vue";
import UserLayout from "../components/UserLayout.vue";

// --- USER VIEWS ---
import UserLogin from "../views/user/Userlogin.vue";
import UserRegister from "../views/user/UserRegister.vue";
import SachUser from "../views/user/Sach.vue";
import Profile from "../views/user/Profile.vue";
import MuonSach from "../views/user/Chitietmuonsach.vue";

// --- ADMIN VIEWS ---
import AdminLogin from "../views/admin/Adminlogin.vue";
import DocGia from "../views/admin/DocGia.vue";
import Sach from "../views/admin/Sach.vue";
import SachDetail from "../views/admin/SachDetail.vue";
import SachEdit from "../views/admin/SachEdit.vue";
import NhanVien from "../views/admin/NhanVien.vue";
import User from "../views/admin/User.vue";
import MuonSachAdmin from "../views/admin/MuonSachAdmin.vue";

// --- ERROR VIEW ---
import NotFound from "../views/errors/NotFound.vue";

const routes = [
  /* =============================
     🔹 USER AUTH ROUTES (Login/Register)
  ============================== */
  {
    path: "/user/login",
    name: "UserLogin",
    component: UserLogin,
  },
  {
    path: "/user/register",
    name: "UserRegister",
    component: UserRegister,
  },

  /* =============================
     🔹 ADMIN AUTH ROUTE
  ============================== */
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
  },

  /* =============================
     🔹 ADMIN DASHBOARD ROUTES
  ============================== */
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "docgia", name: "DocGia", component: DocGia },
      { path: "sach", name: "Sach", component: Sach },
      { path: "sach/:id", name: "SachDetail", component: SachDetail },
      { path: "sach/edit/:id", name: "SachEdit", component: SachEdit },
      { path: "nhanvien", name: "NhanVien", component: NhanVien },
      { path: "users", name: "User", component: User },
      { path: "muonsach", name: "MuonSachAdmin", component: MuonSachAdmin },
    ],
  },
  {
    path: "/user",
    component: UserLayout,
    meta: { requiresUser: true },
    children: [
      { path: "sach", name: "SachUser", component: SachUser },
      { path: "profile", name: "Profile", component: Profile },
      { path: "muonsach", name: "MuonSach", component: MuonSach },
    ],
  },
  
  // Mặc định vào trang login của user
  { path: "/", redirect: "/user/login" },

  /* =============================
     🔹 404 PAGE
  ============================== */
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ========================================
   🧠 Middleware kiểm tra xác thực (beforeEach)
======================================== */
router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  // Nếu route yêu cầu admin login mà chưa có token
  if (to.meta.requiresAdmin && !adminToken) {
    return next("/admin/login");
  }

  // Nếu route yêu cầu user login mà chưa có token
  if (to.meta.requiresUser && !userToken) {
    return next("/user/login");
  }

  next();
});

export default router;
