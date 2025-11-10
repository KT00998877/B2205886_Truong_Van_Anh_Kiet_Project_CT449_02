import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

const AuthController = {
  // 🧍 Đăng ký người dùng
  registerUser: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });
      await newUser.save();

      res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔑 Đăng nhập người dùng
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, role: "user" });
      if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu!" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ message: "Đăng nhập thành công", token });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🧑‍💼 Đăng nhập admin
  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await User.findOne({ username, role: "admin" });
      if (!admin) return res.status(404).json({ message: "Không tìm thấy quản lý!" });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu!" });

      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ message: "Đăng nhập thành công", token });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // ✅ Kiểm tra token hợp lệ
  verifyToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Thiếu token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Token không hợp lệ" });
      req.user = user;
      next();
    });
  },
};

export default AuthController;