import api from "./api.js";

// --- USER --- //
export const registerUser = (data) => api.post("/auth/user/register", data);

export const loginUser = async (data) => {
  const res = await api.post("/auth/user/login", data);

  // ✅ Lưu token vào localStorage nếu đăng nhập thành công
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res;
};

// --- ADMIN --- //
export const registerAdmin = (data) => api.post("/auth/admin/register", data);

export const loginAdmin = async (data) => {
  const res = await api.post("/auth/admin/login", data);

  // ✅ Lưu token của admin
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res;
};
