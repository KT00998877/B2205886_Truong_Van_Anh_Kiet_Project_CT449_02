import api from "./api.js";

// --- USER --- //
export const registerUser = (data) => api.post("/auth/user/register", data);

export const loginUser = async (data) => {
  const res = await api.post("/auth/user/login", data);

  if (res.data.token && res.data.user) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res;
};
// --- ADMIN --- //
export const registerAdmin = (data) => api.post("/auth/admin/register", data);

// --- ADMIN --- //
export const loginAdmin = async (data) => {
  const res = await api.post("/auth/admin/login", data);

  
  if (res.data.token && res.data.user) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res;
};
