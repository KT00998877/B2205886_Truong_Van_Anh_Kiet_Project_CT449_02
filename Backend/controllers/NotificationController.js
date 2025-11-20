import Notification from "../models/Notification.model.js";
import { io } from "../server.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;

    const newNotify = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
    });

    // Emit realtime đến đúng user
    io.emit("notification", newNotify);

    res.status(201).json({
      status: "success",
      notification: newNotify,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi tạo thông báo" });
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy thông báo" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật" });
  }
};
