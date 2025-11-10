import express from "express";
import {
  getAllDocGia,
  getDocGiaById,
  createDocGia,
  updateDocGia,
  deleteDocGia,
} from "../controllers/DocgiaController.js";

const router = express.Router();

router.get("/", getAllDocGia); // Lấy tất cả
router.get("/:id", getDocGiaById); // Lấy 1 độc giả
router.post("/", createDocGia); // Thêm mới
router.put("/:id", updateDocGia); // Cập nhật
router.delete("/:id", deleteDocGia); // Xoá độc giả

export default router;
