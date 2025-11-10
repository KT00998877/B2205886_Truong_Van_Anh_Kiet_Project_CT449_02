import express from "express";
const router = express.Router();
import {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
} from "../controllers/NhanvienController.js";

router.get("/", getAllNhanVien);
router.get("/:id", getNhanVienById);
router.post("/", createNhanVien);
router.put("/:id", updateNhanVien);
router.delete("/:id", deleteNhanVien);

export default router; 
