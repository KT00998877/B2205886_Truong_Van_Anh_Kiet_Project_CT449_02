import mongoose from "mongoose";

const phieuPhatSchema = new mongoose.Schema(
  {
    MaDocGia: { type: String, required: true },

    muonSachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TheoDoiMuonSach",
      required: true,
    },

    MaSach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      required: true,
    },

    soTien: { type: Number, required: true }, 

    lyDo: { type: String, required: true },

    trangThai: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },
  },
  { timestamps: true, collection: "phieuphat" }
);

const PhieuPhat = mongoose.model("PhieuPhat", phieuPhatSchema);
export default PhieuPhat;
