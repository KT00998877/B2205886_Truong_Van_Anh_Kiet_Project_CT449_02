import express from "express";
import {
  getAllNXB,
  getNXBById,
  createNXB,
  updateNXB,
  deleteNXB,
} from "../controllers/NhaXuatBanController.js";

const router = express.Router();

// Lấy tất cả nhà xuất bản
router.get("/", getAllNXB);

// Lấy 1 NXB theo _id
router.get("/:id", getNXBById);

// Thêm NXB
router.post("/", createNXB);

// Cập nhật NXB
router.put("/:id", updateNXB);

// Xoá NXB
router.delete("/:id", deleteNXB);

export default router;
