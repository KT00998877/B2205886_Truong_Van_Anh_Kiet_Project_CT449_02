import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getAllSach,
  getSachByTheLoai,
  createSach,
  updateSach,
  deleteSach,
  getSachById,
} from "../controllers/SachController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const theloai = req.body.TheLoai;
    const folder = `uploads/${theloai}`;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});


const upload = multer({ storage });


router.get("/", getAllSach);

router.get("/id/:id", getSachById);

router.get("/:theloai", getSachByTheLoai);

router.post("/", upload.single("HinhAnh"), createSach);


router.put("/:id", upload.single("HinhAnh"), updateSach);

router.delete("/:id", deleteSach);

export default router;
