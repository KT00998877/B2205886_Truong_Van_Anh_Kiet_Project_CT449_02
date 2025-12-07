import DocGia from "../models/Docgia.model.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ token đã decode trong verifyToken
    const docGia = await DocGia.findOne({ userId }).populate(
      "userId",
      "username email"
    );
    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });
    res.json(docGia);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
//update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updated = await DocGia.findOneAndUpdate(
      { userId: userId }, // Tìm theo userId
      req.body, // Dữ liệu gửi lên
      { new: true } // Trả về bản cập nhật
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });
    }

    res.json({
  message: "Cập nhật thành công!",
  data: await DocGia.findOne({ userId }).populate("userId", "username email")
});
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// 📘 Lấy tất cả độc giả
export const getAllDocGia = async (req, res) => {
  try {
    const docgias = await DocGia.find();
    res.status(200).json(docgias);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách độc giả", error });
  }
};

// 📗 Lấy độc giả theo ID (Mongo _id)
export const getDocGiaById = async (req, res) => {
  try {
    const docgia = await DocGia.findById(req.params.id);
    if (!docgia)
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    res.status(200).json(docgia);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin độc giả", error });
  }
};

// 📒 Thêm mới độc giả
export const createDocGia = async (req, res) => {
  try {
    const newDocGia = new DocGia(req.body);
    await newDocGia.save();
    res.status(201).json(newDocGia);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm độc giả", error });
  }
};

// 📘 Cập nhật độc giả
export const updateDocGia = async (req, res) => {
  try {
    const updated = await DocGia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ message: "Không tìm thấy độc giả để cập nhật" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật độc giả", error });
  }
};

// 📕 Xoá độc giả
export const deleteDocGia = async (req, res) => {
  try {
    const deleted = await DocGia.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy độc giả để xoá" });
    res.status(200).json({ message: "Đã xoá độc giả thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá độc giả", error });
  }
};
