import express from "express";
import {
  createNotification,
  getNotificationsByUser,
  markAsRead,
} from "../controllers/NotificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getNotificationsByUser);
router.put("/read/:id", markAsRead);

export default router;
