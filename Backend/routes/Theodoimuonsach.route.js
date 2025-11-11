import express from "express";
import {
  muonSach,
  traSach,
  getAllMuonSach,
  getMuonByDocGia,
  duyetMuonSach,
  createMuonSach,
  updateMuonSach,
  deleteMuonSach,
} from "../controllers/TheodoimuonsachController.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/muon", AuthController.verifyToken, muonSach);
router.put("/tra/:id", AuthController.verifyToken, traSach);
router.get("/", AuthController.verifyToken, getAllMuonSach);
router.put("/duyet/:id", AuthController.verifyToken, duyetMuonSach);
router.get("/docgia/:MaDocGia", AuthController.verifyToken, getMuonByDocGia);
router.get("/", getAllMuonSach);
router.post("/", createMuonSach);
router.put("/:id", updateMuonSach);
router.delete("/:id", deleteMuonSach);

export default router;
