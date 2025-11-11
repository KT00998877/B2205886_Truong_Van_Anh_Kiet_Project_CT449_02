import mongoose from "mongoose";
const docgiaSchema = new mongoose.Schema(
  {
    MaDocGia: { type: String, required: true, unique: true },
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    Phai: { type: String, required: true },
    NgaySinh: { type: Date, required: true },
    DiaChi: { type: String, required: true },
    SoDienThoai: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "docgia" }
);

const DocGia = mongoose.model("DocGia", docgiaSchema);

export default DocGia;
