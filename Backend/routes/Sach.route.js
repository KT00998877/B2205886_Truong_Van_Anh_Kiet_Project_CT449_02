import express from "express";
import {
  getAllSach,
  getSachByTheLoai,
  createSach,
  updateSach,
  deleteSach,
} from "../controllers/SachController.js";

const router = express.Router();

// Danh sách tổng
router.get("/", getAllSach);

// Theo thể loại
router.get("/:theloai", getSachByTheLoai);

// Thêm, sửa, xóa
router.post("/", createSach);
router.put("/:id", updateSach);
router.delete("/:id", deleteSach);

export default router;
