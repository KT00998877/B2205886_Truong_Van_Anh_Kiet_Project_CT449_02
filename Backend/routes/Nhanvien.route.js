import express from "express";
import {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
} from "../controllers/NhanvienController.js";

const router = express.Router();

// Định nghĩa các route
router.get("/", getAllNhanVien);
router.get("/:id", getNhanVienById);
router.post("/", createNhanVien);
router.put("/:id", updateNhanVien);
router.delete("/:id", deleteNhanVien);

export default router; 