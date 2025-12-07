import PhieuPhat from "../models/PhieuPhat.model.js";
import DocGia from "../models/Docgia.model.js";
import Notification from "../models/Notification.model.js";
import { io } from "../server.js";

export const taoPhieuPhat = async (req, res) => {
  try {
    const { MaDocGia, muonSachId, MaSach, soTien, lyDo } = req.body;

    const phieu = await PhieuPhat.create({
      MaDocGia,
      muonSachId,
      MaSach,
      soTien,
      lyDo,
    });

    // 🔔 Gửi thông báo cho độc giả
    const docGia = await DocGia.findOne({ MaDocGia });

    await Notification.create({
      userId: docGia.userId,
      type: "mat_sach",
      title: "Bạn có phiếu phạt mới",
      message: `Bạn bị phạt: ${soTien.toLocaleString()} VNĐ. Lý do: ${lyDo}.`,
    });

    io.emit("notification", phieu);

    res.json({ message: "Tạo phiếu phạt thành công", phieu });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo phiếu phạt", error: err.message });
  }
};

export const getPhieuPhatByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const docGia = await DocGia.findOne({ userId });

    if (!docGia) {
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });
    }

    const phieus = await PhieuPhat.find({
      MaDocGia: docGia.MaDocGia,
    }).populate("MaSach", "TenSach");

    res.json(phieus);
  } catch (e) {
    res.status(500).json({ message: "Lỗi lấy phiếu phạt", error: e.message });
  }
};



export const thanhToanPhieuPhat = async (req, res) => {
  try {
    const phieu = await PhieuPhat.findByIdAndUpdate(
      req.params.id,
      { trangThai: "Đã thanh toán" },
      { new: true }
    );

    res.json({ message: "Thanh toán thành công", phieu });
  } catch (e) {
    res.status(500).json({ message: "Lỗi thanh toán" });
  }
};

export const getAllPhieuPhat = async (req, res) => {
  try {
    const phieus = await PhieuPhat.find().populate("MaSach", "TenSach");
    res.json(phieus);
  } catch (err) {
    res.status(500).json({ message: "Lỗi load phiếu phạt" });
  }
};


// ADMIN CẬP NHẬT
export const updatePhieuPhat = async (req, res) => {
  try {

    // Lấy lại phiếu phạt kèm độc giả
    const phieu = await PhieuPhat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const docGia = await DocGia.findOne({ MaDocGia: phieu.MaDocGia });

    // 🔔 Thông báo cho user
    await Notification.create({
      userId: docGia.userId,
      type: "phieu_phat_update",
      title: "🔧 Phiếu phạt được cập nhật",
      message: `Phiếu phạt của bạn đã được admin chỉnh sửa.`,
    });

    io.emit("notification", {
      userId: docGia.userId,
      title: "Phiếu phạt được cập nhật",
      message: "Phiếu phạt của bạn vừa được admin chỉnh sửa.",
    });

    res.json({ message: "Cập nhật thành công", phieu });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật phiếu phạt" });
  }
};

// ADMIN XOÁ
export const deletePhieuPhat = async (req, res) => {
  try {
    // Lấy phiếu trước khi xoá để gửi thông báo
    const phieu = await PhieuPhat.findById(req.params.id);
    const docGia = await DocGia.findOne({ MaDocGia: phieu.MaDocGia });

    await PhieuPhat.findByIdAndDelete(req.params.id);

    // 🔔 Thông báo cho user
    await Notification.create({
      userId: docGia.userId,
      type: "phieu_phat_delete",
      title: "⚠️ Phiếu phạt bị xoá",
      message: `Phiếu phạt của bạn đã bị admin xoá.`,
    });

    io.emit("notification", {
      userId: docGia.userId,
      title: "Phiếu phạt bị xoá",
      message: "Phiếu phạt của bạn đã bị xoá khỏi hệ thống.",
    });

    res.json({ message: "Xoá phiếu phạt thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá phiếu phạt" });
  }
};