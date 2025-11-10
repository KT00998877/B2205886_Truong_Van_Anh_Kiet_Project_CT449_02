import api from "./api.js";

// --- USER --- //
export const registerUser = (data) => api.post("/auth/user/register", data);
export const loginUser = (data) => api.post("/auth/user/login", data);

// --- ADMIN --- //
export const registerAdmin = (data) => api.post("/auth/admin/register", data);
export const loginAdmin = (data) => api.post("/auth/admin/login", data);
