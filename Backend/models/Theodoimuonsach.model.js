import mongoose from "mongoose";
const theodoimuonsachSchema = new mongoose.Schema(
    {
        MaDocGia: { type: String, required: true },
        MaSach: { type: String, required: true },
        MSNV : { type: String, required: true },
        NgayMuon: { type: Date, required: true },
        HanTra: { type: Date, required: true },
        TrangThai: { type: String, required: true },
    },
    { collection: "theodoimuonsach" }
);
const TheoDoiMuonSach = mongoose.model("TheoDoiMuonSach", theodoimuonsachSchema);
export default TheoDoiMuonSach;
