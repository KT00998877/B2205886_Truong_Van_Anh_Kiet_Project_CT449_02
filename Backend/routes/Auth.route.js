import express from "express";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

router.post("/user/login", AuthController.loginUser);
router.post("/user/register", AuthController.registerUser);
router.post("/admin/login", AuthController.loginAdmin);

export default router;
