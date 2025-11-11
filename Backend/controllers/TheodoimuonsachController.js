import TheoDoiMuonSach from "../models/Theodoimuonsach.model.js";
import DocGia from "../models/Docgia.model.js";
import Sach from "../models/Sach.model.js";

// 🟢 Người dùng gửi yêu cầu mượn
export const muonSach = async (req, res) => {
  try {
    const userId = req.user.id;
    const docGia = await DocGia.findOne({ userId });
    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    const { MaSach, NgayMuon, HanTra } = req.body;
    if (!MaSach || !NgayMuon || !HanTra)
      return res.status(400).json({ message: "Thiếu thông tin mượn sách!" });

    const newRecord = new TheoDoiMuonSach({
      MaDocGia: docGia.MaDocGia,
      MaSach,
      NgayMuon,
      HanTra,
      TrangThai: "Chờ duyệt",
    });

    await newRecord.save();
    res.status(201).json({
      message: "Yêu cầu mượn sách đã được gửi, vui lòng chờ duyệt.",
      record: newRecord,
    });
  } catch (error) {
    console.error("❌ Lỗi gửi yêu cầu mượn:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 🟡 Quản lý duyệt mượn
export const duyetMuonSach = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findById(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });

    if (record.TrangThai !== "Chờ duyệt")
      return res.status(400).json({ message: "Phiếu này đã được xử lý rồi!" });

    record.TrangThai = "Đã duyệt - Đã mượn";
    await record.save();

    await Sach.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: -1 } });
    res.json({ message: "✅ Đã duyệt phiếu mượn thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi duyệt phiếu", error: err.message });
  }
};

// 🔴 Hủy / từ chối phiếu mượn
export const huyMuonSach = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findById(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn!" });

    if (record.TrangThai !== "Chờ duyệt")
      return res
        .status(400)
        .json({ message: "Chỉ có thể từ chối phiếu đang chờ duyệt!" });

    record.TrangThai = "Từ chối";
    await record.save();

    res.json({ message: "❌ Đã từ chối yêu cầu mượn sách!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi hủy phiếu mượn", error: err.message });
  }
};

// 🔵 Trả sách
export const traSach = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findById(req.params.id);
    if (!record)
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi mượn sách!" });

    if (record.TrangThai !== "Đang mượn")
      return res
        .status(400)
        .json({ message: "Chỉ có thể trả sách khi đang mượn!" });

    record.TrangThai = "Đã trả";
    await record.save();

    await Sach.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: 1 } });
    res.json({ message: "📗 Trả sách thành công!", record });
  } catch (err) {
    console.error("❌ Lỗi khi trả sách:", err);
    res.status(500).json({ message: "Lỗi khi trả sách", error: err.message });
  }
};

// 🟠 Lấy toàn bộ danh sách (Admin)
export const getAllMuonSach = async (req, res) => {
  try {
    const muons = await TheoDoiMuonSach.find()
      .populate("MaSach", "TenSach TacGia TheLoai SoQuyen")
      .populate("MaDocGia", "HoLot Ten MaDocGia");
    res.json(muons);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách mượn:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách mượn", error: err.message });
  }
};

// 🟣 Lấy danh sách mượn theo độc giả
export const getMuonByDocGia = async (req, res) => {
  try {
    const { MaDocGia } = req.params;
    const muons = await TheoDoiMuonSach.find({ MaDocGia }).populate(
      "MaSach",
      "TenSach TacGia TheLoai DonGia SoQuyen"
    );
    res.json(muons);
  } catch (err) {
    console.error("❌ Lỗi lấy mượn theo độc giả:", err);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách mượn theo độc giả",
        error: err.message,
      });
  }
};

// 🟢 Admin thêm mới phiếu mượn thủ công
export const createMuonSach = async (req, res) => {
  try {
    const { MaDocGia, MaSach, NgayMuon, HanTra, TrangThai } = req.body;
    const newRecord = new TheoDoiMuonSach({
      MaDocGia,
      MaSach,
      NgayMuon,
      HanTra,
      TrangThai: TrangThai || "Chờ duyệt",
    });

    await newRecord.save();
    res
      .status(201)
      .json({ message: "Thêm phiếu mượn thành công", record: newRecord });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm phiếu mượn", error: err.message });
  }
};

// 🟣 Cập nhật phiếu mượn
export const updateMuonSach = async (req, res) => {
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
    res.json({ message: "Cập nhật thành công", record: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật phiếu", error: err.message });
  }
};

// 🔴 Xóa phiếu mượn
export const deleteMuonSach = async (req, res) => {
  try {
    const deleted = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy phiếu để xóa" });
    res.json({ message: "Đã xóa phiếu mượn thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phiếu mượn", error: err.message });
  }
};
