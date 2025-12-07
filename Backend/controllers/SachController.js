import Sach from "../models/Sach.model.js";
import mongoose from "mongoose";


// Lấy tất cả sách
export const getAllSach = async (req, res) => {
  try {
    const sachs = await Sach.find();
    res.json(sachs);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách", error: err });
  }
};

// Lấy sách theo thể loại (/sach/:theloai)
export const getSachByTheLoai = async (req, res) => {
  try {
    const theloai = req.params.theloai.replace(/-/g, " "); // "kinh-te" -> "kinh te"
    const sachs = await Sach.find({
      TheLoai: { $regex: new RegExp(theloai, "i") },
    });
    res.json(sachs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy sách theo thể loại", error: err });
  }
};

export const getSachById = async (req, res) => {
  try {
    const id = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
        receivedId: id,
      });
    }

    const sach = await Sach.findById(id);

    if (!sach) {
      return res.status(404).json({
        message: "Không tìm thấy sách với ID này",
        searchedId: id,
      });
    }

    res.json(sach);
  } catch (err) {
    console.error("❌ Lỗi getSachById:", err);
    res.status(500).json({
      message: "Lỗi server khi lấy sách",
      error: err.message,
    });
  }
};


// Thêm mới sách
export const createSach = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.HinhAnh = `/uploads/${data.TheLoai}/${req.file.filename}`;
    }


    const sach = new Sach(data);
    await sach.save();

    res.status(201).json({
      message: "Thêm sách thành công!",
      sach,
    });
  } catch (err) {
    console.error("❌ Lỗi createSach:", err);
    res.status(500).json({
      message: "Lỗi khi thêm sách",
      error: err.message,
    });
  }
};


// Cập nhật sách
export const updateSach = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Nếu người dùng upload ảnh mới
    if (req.file) {
      data.HinhAnh = "/uploads/" + req.file.filename;
    }

    const updated = await Sach.findByIdAndUpdate(id, data, { new: true });

    res.json({
      message: "Cập nhật thành công",
      sach: updated,
    });
  } catch (err) {
    console.error("❌ Lỗi updateSach:", err);
    res.status(500).json({
      message: "Lỗi khi cập nhật sách",
      error: err.message,
    });
  }
};


// Xoá sách
export const deleteSach = async (req, res) => {
  try {
    await Sach.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xoá sách" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá sách", error: err });
  }
};
