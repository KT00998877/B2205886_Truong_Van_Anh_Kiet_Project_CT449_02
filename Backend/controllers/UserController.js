import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

// Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();    
    res.status(200).json(users);
    } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
    }
};
// Lấy người dùng theo ID
export const getUserById = async (req, res) => {
    try {
    const user = await User.findById
    (req.params.id);
    if (!user)
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
    } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error });
    }
};
// Thêm người dùng mới
export const createUser = async (req, res) => {
    try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
    } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm người dùng", error });
    }       
};
// Cập nhật người dùng
export const updateUser = async (req, res) => {
    try {
    const user = await
    User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    }); 
    if (!user)
    return res
    .status(404)
    .json({ message: "Không tìm thấy người dùng để cập nhật" });
    res.status(200).json(user);
    } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật người dùng", error });
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ token

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user!" });
    }

    res.status(200).json({
      message: "Cập nhật tài khoản thành công!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật người dùng", error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ mật khẩu!" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });
    }

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
    try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
    return res
    .status(404)
    .json({ message: "Không tìm thấy người dùng để xóa" });
    res.status(200).json(user);
    } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa người dùng", error });
    }
};