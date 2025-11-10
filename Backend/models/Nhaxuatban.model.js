import mongoose from "mongoose";
const nhaxuatbanSchema = new mongoose.Schema(
  {
    MaNXB: { type: String, required: true, unique: true },
    TenNXB: { type: String, required: true },
    DiaChi: { type: String, required: true },
    SoDienThoai: { type: String, required: true },
  },
  { collection: "nhaxuatban" }
);
const NhaXuatBan = mongoose.model("NhaXuatBan", nhaxuatbanSchema);
export default NhaXuatBan;
