import express from "express";
import {
  createNotification,
  getNotificationsByUser,
  markAsRead,
} from "../controllers/NotificationController.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/", AuthController.verifyToken, createNotification); 
router.get("/:userId", AuthController.verifyToken, getNotificationsByUser); 
router.put("/read/:id", AuthController.verifyToken, markAsRead); 

export default router;
