import express from "express";
import {
  taoPhieuPhat,
  getPhieuPhatByUser,
  thanhToanPhieuPhat,
  getAllPhieuPhat,
  updatePhieuPhat,
  deletePhieuPhat,
} from "../controllers/PhieuPhatController.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

//ADMIN ROUTES



router.get("/all", AuthController.verifyToken, getAllPhieuPhat);

router.post("/", AuthController.verifyToken, taoPhieuPhat);

router.put("/:id", AuthController.verifyToken, updatePhieuPhat);

router.delete("/:id", AuthController.verifyToken, deletePhieuPhat);


//  👤 USER ROUTES


router.get("/user/:userId", AuthController.verifyToken, getPhieuPhatByUser);


router.put("/thanhtoan/:id", AuthController.verifyToken, thanhToanPhieuPhat);

export default router;
