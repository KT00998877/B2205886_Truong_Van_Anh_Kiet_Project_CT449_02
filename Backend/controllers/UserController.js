import User from "../models/User.model.js";
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