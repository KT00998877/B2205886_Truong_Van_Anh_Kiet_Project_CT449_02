import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "muon_sach",
        "duyet_muon",
        "tu_choi_muon",
        "tra_sach",
        "sap_het_han",
        "qua_han",
        "mat_sach",
        "yeu_cau_muon_moi", // Cho admin
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      MaSach: mongoose.Schema.Types.ObjectId,
      MaDocGia: String,
      muonSachId: mongoose.Schema.Types.ObjectId,
      tenSach: String,
      tenDocGia: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

// Index để tăng tốc truy vấn
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
