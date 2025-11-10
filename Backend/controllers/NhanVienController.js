import NhanVien from "../models/Nhanvien.model.js";

// Lấy tất cả nhân viên
export const getAllNhanVien = async (req, res) => {
  try {
    const nhanviens = await NhanVien.find();
    res.status(200).json(nhanviens);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên", error });
  }
};

// Lấy nhân viên theo ID
export const getNhanVienById = async (req, res) => {
  try {
    const nv = await NhanVien.findById(req.params.id);
    if (!nv)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.status(200).json(nv);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin nhân viên", error });
  }
};

// Thêm nhân viên mới
export const createNhanVien = async (req, res) => {
  try {
    const nv = new NhanVien(req.body);
    await nv.save();
    res.status(201).json(nv);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm nhân viên", error });
  }
};

// Cập nhật nhân viên
export const updateNhanVien = async (req, res) => {
  try {
    const nv = await NhanVien.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!nv)
      return res
        .status(404)
        .json({ message: "Không tìm thấy nhân viên để cập nhật" });
    res.status(200).json(nv);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật nhân viên", error });
  }
};

// Xóa nhân viên
export const deleteNhanVien = async (req, res) => {
  try {
    const nv = await NhanVien.findByIdAndDelete(req.params.id);
    if (!nv)
      return res
        .status(404)
        .json({ message: "Không tìm thấy nhân viên để xóa" });
    res.status(200).json({ message: "Đã xóa nhân viên thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa nhân viên", error });
  }
};
