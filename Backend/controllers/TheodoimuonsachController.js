import TheoDoiMuonSach from "../models/Theodoimuonsach.model.js";
import DocGia from "../models/Docgia.model.js";
import Sach from "../models/Sach.model.js";
import Notification from "../models/Notification.model.js";
import { io } from "../server.js";
import PhieuPhat from "../models/PhieuPhat.model.js";

// 🟢 Người dùng gửi yêu cầu mượn
export const muonSach = async (req, res) => {
  try {
    const userId = req.user.id;
    const docGia = await DocGia.findOne({ userId });
    // 🔎 Kiểm tra phiếu phạt chưa thanh toán
    const phieuPhatChuaTT = await PhieuPhat.findOne({
      MaDocGia: docGia.MaDocGia,
      trangThai: { $ne: "Đã thanh toán" },
    });

    if (phieuPhatChuaTT) {
      return res.status(400).json({
        message: "Bạn còn phiếu phạt chưa thanh toán. Không thể mượn sách!",
        phieuPhatId: phieuPhatChuaTT._id,
      });
    }

    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    const { MaSach, NgayMuon, HanTra } = req.body;
    if (!MaSach || !NgayMuon || !HanTra)
      return res.status(400).json({ message: "Thiếu thông tin mượn sách!" });

    // 🔎 Kiểm tra số sách đang mượn
    const soSachDangMuon = await TheoDoiMuonSach.countDocuments({
      MaDocGia: docGia.MaDocGia,
      TrangThai: { $ne: "Đã trả" },
    });

    if (soSachDangMuon >= 3) {
      return res.status(400).json({
        message: "Bạn chỉ được mượn tối đa 3 cuốn sách!",
      });
    }

    const daMuon = await TheoDoiMuonSach.findOne({
      MaDocGia: docGia.MaDocGia,
      MaSach: MaSach,
      TrangThai: { $ne: "Đã trả" },
    });

    if (daMuon) {
      return res.status(400).json({
        message: "Bạn đang mượn cuốn sách này rồi, hãy trả trước khi mượn lại!",
      });
    }

    const newRecord = new TheoDoiMuonSach({
      MaDocGia: docGia.MaDocGia,
      MaSach,
      NgayMuon,
      HanTra,
      TrangThai: "Chờ duyệt",
    });

    await newRecord.save();

    const notify = await Notification.create({
      userId: null, // admin xem tất cả
      type: "yeu_cau_muon_moi",
      title: "Có yêu cầu mượn sách mới",
      message: `${docGia.HoLot} ${docGia.Ten} yêu cầu mượn sách.`,
      data: {
        muonSachId: newRecord._id,
        MaSach,
        MaDocGia: docGia.MaDocGia,
      },
    });

    io.emit("notification", notify);

    // 🔔 Thông báo cho chính người dùng
    const notifyUser = await Notification.create({
      userId: userId,
      type: "muon_sach",
      title: "Gửi yêu cầu mượn sách thành công",
      message: `Yêu cầu mượn sách của bạn đang chờ duyệt.`,
      data: {
        muonSachId: newRecord._id,
        MaSach,
      },
    });

    io.emit("notification", notifyUser);

    res.status(201).json({
      message: "Yêu cầu mượn sách đã được gửi, vui lòng chờ duyệt.",
      record: newRecord,
    });
  } catch (error) {
    console.error("❌ Lỗi gửi yêu cầu mượn:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 🔥 Đánh dấu mất sách
export const matSach = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findById(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn!" });

    if (
      record.TrangThai !== "Đã duyệt - Đang mượn" &&
      record.TrangThai !== "Quá hạn"
    ) {
      return res.status(400).json({
        message:
          "Chỉ có thể đánh dấu mất sách khi sách đang mượn hoặc quá hạn!",
      });
    }

    const docGia = await DocGia.findOne({ MaDocGia: record.MaDocGia });
    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    const sach = await Sach.findById(record.MaSach);
    if (!sach) return res.status(404).json({ message: "Không tìm thấy sách!" });

    // Lý do mất + tiền phạt nhập từ admin
    const { Lydo, soTienPhat } = req.body;

    // Lưu lý do mất vào record
    if (Lydo) record.Lydo = Lydo;

    // ✔ Tính tiền phạt: nhập tay -> ưu tiên
    let tienPhat = soTienPhat
      ? Number(soTienPhat)
      : Math.ceil(sach.DonGia * 1.5);

    record.TrangThai = "Mất sách";
    await record.save();

    // Tạo phiếu phạt
    const phieu = await PhieuPhat.create({
      MaDocGia: record.MaDocGia,
      muonSachId: record._id,
      MaSach: record.MaSach,
      soTien: tienPhat,
      lyDo: Lydo || "Làm mất sách",
    });

    // Trừ số lượng sách
    await Sach.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: -1 } });

    // Gửi thông báo
    await Notification.create({
      userId: docGia.userId,
      type: "mat_sach",
      title: "📕 Phiếu phạt mới",
      message: `Bạn bị phạt ${tienPhat.toLocaleString()}đ vì làm mất sách.`,
    });

    res.json({
      message: "⚠️ Đã đánh dấu mất sách!",
      tienPhat,
      phieu,
      record,
    });
  } catch (err) {
    console.error("❌ Lỗi khi đánh dấu mất sách:", err);
    res.status(500).json({
      message: "Lỗi khi đánh dấu mất sách",
      error: err.message,
    });
  }
};


// 🟡 Quản lý duyệt mượn
export const duyetMuonSach = async (req, res) => {
  try {
    const record = await TheoDoiMuonSach.findById(req.params.id).populate(
      "MaSach"
    );
    if (!record)
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });

    if (record.TrangThai !== "Chờ duyệt")
      return res.status(400).json({ message: "Phiếu này đã được xử lý rồi!" });

    // 🔥 Lấy DocGia từ MaDocGia
    const docGia = await DocGia.findOne({ MaDocGia: record.MaDocGia });

    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    // Lấy sách
    const sach = await Sach.findById(record.MaSach);
    if (!sach) return res.status(404).json({ message: "Không tìm thấy sách!" });

    // 🚫 NGĂN SÁCH ÂM
    if (sach.SoQuyen <= 0) {
      return res.status(400).json({ message: "Sách đã hết, không thể duyệt!" });
    }
    record.TrangThai = "Đã duyệt - Đang mượn";
    await record.save();

    await Sach.findByIdAndUpdate(record.MaSach, { $inc: { SoQuyen: -1 } });

    const notify = await Notification.create({
      userId: docGia.userId,
      type: "duyet_muon",
      title: "Yêu cầu mượn sách đã được duyệt",
      message: `Bạn đã được duyệt mượn sách: ${record.MaSach.TenSach}`,
      data: {
        muonSachId: record._id,
        MaSach: record.MaSach._id,
        tenSach: record.MaSach.TenSach,
      },
    });

    io.emit("notification", notify);

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

    const { Lydo } = req.body;
    if (!Lydo)
      return res.status(400).json({ message: "Vui lòng nhập lý do từ chối!" });

    // 🔥 Lấy DocGia từ MaDocGia
    const docGia = await DocGia.findOne({ MaDocGia: record.MaDocGia });

    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    record.TrangThai = "Từ chối";
    record.Lydo = Lydo;
    await record.save();

    // 🔔 Gửi thông báo cho độc giả
    const notify = await Notification.create({
      userId: docGia.userId,
      type: "tu_choi_muon",
      title: "Yêu cầu mượn sách bị từ chối",
      message: `Sách "${record.MaSach.TenSach}" đã bị từ chối. Lý do: ${Lydo}`,
      data: { muonSachId: record._id },
    });

    io.emit("notification", notify);

    res.json({ message: "❌ Đã từ chối yêu cầu mượn sách!", data: record });
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

    if (record.TrangThai !== "Đã duyệt - Đang mượn")
      return res
        .status(400)
        .json({ message: "Chỉ có thể trả sách khi đang mượn!" });
    // 🔥 Lấy DocGia từ MaDocGia
    const docGia = await DocGia.findOne({ MaDocGia: record.MaDocGia });

    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    record.TrangThai = "Đã trả";
    await record.save();

    await Sach.findByIdAndUpdate(record.MaSach._id || record.MaSach, {
      $inc: { SoQuyen: 1 },
    });

    // 🔔 Gửi thông báo cho độc giả
    const notify = await Notification.create({
      userId: docGia.userId,
      type: "tra_sach",
      title: "Trả sách thành công",
      message: `Bạn đã trả: ${record.MaSach.TenSach}`,
      data: { muonSachId: record._id },
    });

    io.emit("notification", notify);

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
      .populate("MaSach", "TenSach TacGia TheLoai SoQuyen HinhAnh")
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
      "TenSach TacGia TheLoai DonGia SoQuyen HinhAnh"
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

export const capNhatQuaHan = async (req, res) => {
  try {
    const today = new Date();

    const result = await TheoDoiMuonSach.updateMany(
      {
        TrangThai: { $ne: "Đã trả" },
        HanTra: { $lt: today },
      },
      { $set: { TrangThai: "Quá hạn" } }
    );

    res.json({ message: "Đã cập nhật quá hạn", updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái quá hạn",
      error: err.message,
    });
  }
};



