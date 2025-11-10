import NhaXuatBan from "../models/Nhaxuatban.model.js";

// Lấy tất cả nhà xuất bản
export const getAllNXB = async (req, res) => {
  try {
    const dsNXB = await NhaXuatBan.find();
    res.status(200).json(dsNXB);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách NXB", error });
  }
};

// Lấy 1 NXB theo ID
export const getNXBById = async (req, res) => {
  try {
    const nxb = await NhaXuatBan.findById(req.params.id);
    if (!nxb) return res.status(404).json({ message: "Không tìm thấy NXB" });
    res.status(200).json(nxb);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin NXB", error });
  }
};

// Thêm NXB
export const createNXB = async (req, res) => {
  try {
    const nxb = new NhaXuatBan(req.body);
    await nxb.save();
    res.status(201).json(nxb);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm NXB", error });
  }
};

// Cập nhật NXB
export const updateNXB = async (req, res) => {
  try {
    const nxb = await NhaXuatBan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!nxb)
      return res
        .status(404)
        .json({ message: "Không tìm thấy NXB để cập nhật" });
    res.status(200).json(nxb);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật NXB", error });
  }
};

// Xoá NXB
export const deleteNXB = async (req, res) => {
  try {
    const nxb = await NhaXuatBan.findByIdAndDelete(req.params.id);
    if (!nxb)
      return res.status(404).json({ message: "Không tìm thấy NXB để xoá" });
    res.status(200).json({ message: "Đã xoá NXB thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá NXB", error });
  }
};
