import mongoose from "mongoose";
const theodoimuonsachSchema = new mongoose.Schema(
  {
    MaDocGia: { type: String, required: true },
    MaSach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      required: true,
    },
    MSNV: { type: String },
    NgayMuon: { type: Date, required: true },
    HanTra: { type: Date, required: true },
    TrangThai: { type: String, required: true },
    Lydo: {type: String},
  },
  { collection: "theodoimuonsach" }
);
const TheoDoiMuonSach = mongoose.model("TheoDoiMuonSach", theodoimuonsachSchema);
export default TheoDoiMuonSach;
