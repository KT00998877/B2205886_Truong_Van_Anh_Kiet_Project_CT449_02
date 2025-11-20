import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    UserId: { type: String, required: true },
    Items: [
      {
        MaSach: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sach",
          required: true,
        },
        SoLuong: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
