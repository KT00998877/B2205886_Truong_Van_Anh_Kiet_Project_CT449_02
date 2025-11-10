import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config(); 


import docgiaRoutes from "./routes/Docgia.route.js";
import nhanvienRoutes from "./routes/Nhanvien.route.js";
import NhaxuatbanRoutes from "./routes/Nhaxuatban.route.js";
import sachRoutes from "./routes/Sach.route.js";
import muonSachRoutes from "./routes/Theodoimuonsach.route.js";
import userRoutes from "./routes/User.route.js";
import authRoutes from "./routes/Auth.route.js";



const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Kết nối DB
connectDB();

// Auth Routes
app.use('/api/auth', authRoutes);

// Routes
app.use("/api/docgia", docgiaRoutes);
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/nhaxuatban", NhaxuatbanRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/muon-sach", muonSachRoutes);
app.use("/api/users", userRoutes);

// Server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
