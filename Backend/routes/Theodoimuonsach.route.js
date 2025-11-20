import express from "express";
import {
  muonSach,
  traSach,
  getAllMuonSach,
  getMuonByDocGia,
  duyetMuonSach,
  huyMuonSach,
  createMuonSach,
  updateMuonSach,
  deleteMuonSach,
  capNhatQuaHan,
  matSach,
} from "../controllers/TheodoimuonsachController.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.put("/capnhat-quahan", capNhatQuaHan);
router.post("/muon", AuthController.verifyToken, muonSach);
router.put("/mat/:id", AuthController.verifyToken, matSach);
router.put("/tra/:id", AuthController.verifyToken, traSach);
router.get("/", AuthController.verifyToken, getAllMuonSach);
router.put("/duyet/:id", AuthController.verifyToken, duyetMuonSach);
router.put("/tuchoi/:id", AuthController.verifyToken, huyMuonSach);
router.get("/docgia/:MaDocGia", AuthController.verifyToken, getMuonByDocGia);
router.get("/", getAllMuonSach);
router.post("/", createMuonSach);
router.put("/:id", updateMuonSach);
router.delete("/:id", deleteMuonSach);


export default router;
