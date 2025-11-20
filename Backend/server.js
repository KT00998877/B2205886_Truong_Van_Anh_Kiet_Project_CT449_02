import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

import docgiaRoutes from "./routes/Docgia.route.js";
import nhanvienRoutes from "./routes/Nhanvien.route.js";
import NhaxuatbanRoutes from "./routes/Nhaxuatban.route.js";
import sachRoutes from "./routes/Sach.route.js";
import muonSachRoutes from "./routes/Theodoimuonsach.route.js";
import userRoutes from "./routes/User.route.js";
import CartRoutes from "./routes/Cart.route.js";
import authRoutes from "./routes/Auth.route.js";
import notificationRoutes from "./routes/Notification.route.js";

// Tạo app và server HTTP
const app = express();
const httpServer = createServer(app);

// Tạo IO server
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Bắt socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docgia", docgiaRoutes);
app.use("/api/nhanvien", nhanvienRoutes);
app.use("/api/nhaxuatban", NhaxuatbanRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/theodoimuonsach", muonSachRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/notifications", notificationRoutes);

// Run server
const PORT = 3000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
