import express from "express";
import {
  getAllPhieuMuon,
  getPhieuMuonById,
  createPhieuMuon,
  updatePhieuMuon,
  deletePhieuMuon,
} from "../controllers/TheodoimuonsachController.js";

const router = express.Router();

// Định nghĩa các route
router.get("/", getAllPhieuMuon); // Lấy danh sách phiếu
router.get("/:id", getPhieuMuonById); // Lấy 1 phiếu theo ID
router.post("/", createPhieuMuon); // Thêm phiếu mượn
router.put("/:id", updatePhieuMuon); // Cập nhật phiếu
router.delete("/:id", deletePhieuMuon); // Xoá phiếu

export default router; 
