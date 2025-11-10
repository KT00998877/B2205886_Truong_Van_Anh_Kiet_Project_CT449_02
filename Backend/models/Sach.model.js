import mongoose from "mongoose";

const sachSchema = new mongoose.Schema(
  {
    MaSach: { type: String, required: true, unique: true },
    TenSach: { type: String, required: true },
    DonGia: { type: Number, required: true },
    SoQuyen: { type: Number, required: true },
    ChiTiet: { type: String },
    NamXuatBan: { type: Number },
    MaNXB: { type: String },
    TacGia: { type: String },
    TheLoai: { type: String, required: true }, 
    HinhAnh: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Sach", sachSchema,"sach");
