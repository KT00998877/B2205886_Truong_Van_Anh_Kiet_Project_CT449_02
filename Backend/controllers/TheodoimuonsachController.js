import TheoDoiMuonSach from "../models/Theodoimuonsach.model.js";

// 📘 Lấy tất cả phiếu mượn
export const getAllPhieuMuon = async (req, res) => {
  try {
    const dsPhieu = await TheoDoiMuonSach.find();
    res.status(200).json(dsPhieu);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách phiếu mượn", error });
  }
};

// 📗 Lấy 1 phiếu mượn theo ID
export const getPhieuMuonById = async (req, res) => {
  try {
    const phieu = await TheoDoiMuonSach.findById(req.params.id);
    if (!phieu)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
    res.status(200).json(phieu);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin phiếu mượn", error });
  }
};

// 📒 Thêm mới phiếu mượn
export const createPhieuMuon = async (req, res) => {
  try {
    const newPhieu = new TheoDoiMuonSach(req.body);
    await newPhieu.save();
    res.status(201).json(newPhieu);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm phiếu mượn", error });
  }
};

// 📘 Cập nhật phiếu mượn
export const updatePhieuMuon = async (req, res) => {
  try {
    const updated = await TheoDoiMuonSach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiếu để cập nhật" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật phiếu mượn", error });
  }
};

// 📕 Xoá phiếu mượn
export const deletePhieuMuon = async (req, res) => {
  try {
    const deleted = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy phiếu để xoá" });
    res.status(200).json({ message: "Đã xoá phiếu mượn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá phiếu mượn", error });
  }
};
