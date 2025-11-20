import express from "express";
import {
  addToCart,
  getCart,
  removeItem,
  borrowSelectedBooks,
  updateQuantity,
} from "../controllers/CartController.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();
router.post("/add", AuthController.verifyToken, addToCart);
router.get("/", AuthController.verifyToken, getCart);
router.post(
  "/borrow-selected",
  AuthController.verifyToken,
  borrowSelectedBooks
);
router.delete("/remove/:id", AuthController.verifyToken, removeItem);
router.put("/update-qty/:id", AuthController.verifyToken, updateQuantity);
export default router;
