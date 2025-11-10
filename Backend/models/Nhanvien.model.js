import mongoose from "mongoose";
const nhanvienSchema = new mongoose.Schema(
    {
        MSNV : { type: String, required: true, unique: true },
        HoTenNV : { type: String, required: true },
        Email: { type: String, required: true, unique: true },
        Password : { type: String, required: true },
        ChucVu : { type: String, required: true },
        DiaChi : { type: String, required: true },
        SoDienThoai : { type: String, required: true },
    },
    { collection: "nhanvien" }
);
const NhanVien = mongoose.model("NhanVien", nhanvienSchema, "nhanvien");
export default NhanVien;
