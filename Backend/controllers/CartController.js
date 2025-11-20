import Cart from "../models/Cart.model.js";
import TheoDoiMuonSach from "../models/Theodoimuonsach.model.js";
import DocGia from "../models/Docgia.model.js";

// Thêm sách vào giỏ
export const addToCart = async (req, res) => {
  const UserId = req.user.id;
  const { MaSach, SoLuong } = req.body;

  let cart = await Cart.findOne({ UserId });

  if (!cart) {
    cart = await Cart.create({
      UserId,
      Items: [{ MaSach, SoLuong }],
    });
    return res.json({ message: "Đã thêm vào giỏ!" });
  }

  const item = cart.Items.find((i) => i.MaSach.toString() === MaSach);

  if (item) {
    item.SoLuong += SoLuong;
  } else {
    cart.Items.push({ MaSach, SoLuong });
  }

  await cart.save();
  res.json({ message: "Đã thêm vào giỏ!" });
};

// Lấy giỏ hàng
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ UserId: req.user.id }).populate(
      "Items.MaSach",
      "TenSach TacGia DonGia HinhAnh"
    );

    res.json(cart || { Items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa 1 sách khỏi giỏ
export const removeItem = async (req, res) => {
  const UserId = req.user.id;
  const { id } = req.params;

  await Cart.updateOne({ UserId }, { $pull: { Items: { MaSach: id } } });

  res.json({ message: "Đã xóa khỏi giỏ" });
};

// Mượn toàn bộ sách trong giỏ

export const borrowSelectedBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { Books, NgayMuon, HanTra } = req.body;

    if (!Books || Books.length === 0)
      return res.status(400).json({ message: "Không có sách nào được chọn!" });

    const docGia = await DocGia.findOne({ userId });
    if (!docGia)
      return res.status(404).json({ message: "Không tìm thấy độc giả!" });

    // Đếm sách user đang mượn (không tính Đã trả)
    const countBorrowing = await TheoDoiMuonSach.countDocuments({
      MaDocGia: docGia.MaDocGia,
      TrangThai: { $ne: "Đã trả" },
    });

    if (countBorrowing + Books.length > 3) {
      return res.status(400).json({
        message: "Bạn chỉ được mượn tối đa 3 cuốn. Hãy trả bớt sách trước!",
      });
    }

    // Kiểm tra không mượn lại sách đang mượn
    const alreadyBorrow = await TheoDoiMuonSach.find({
      MaDocGia: docGia.MaDocGia,
      MaSach: { $in: Books },
      TrangThai: { $ne: "Đã trả" },
    });

    if (alreadyBorrow.length > 0) {
      return res.status(400).json({
        message: "Có sách bạn đang mượn chưa trả!",
        books: alreadyBorrow.map((b) => b.MaSach),
      });
    }

    // Tạo phiếu mượn cho từng cuốn
    const created = [];
    for (const id of Books) {
      const record = new TheoDoiMuonSach({
        MaDocGia: docGia.MaDocGia,
        MaSach: id,
        NgayMuon,
        HanTra,
        TrangThai: "Chờ duyệt",
      });
      await record.save();
      created.push(record);
    }

    // Xóa các sách đã chọn khỏi giỏ
    await Cart.updateOne(
      { userId },
      { $pull: { Items: { MaSach: { $in: Books } } } }
    );

    res.json({
      message: "Tạo yêu cầu mượn thành công!",
      created,
    });
  } catch (err) {
    console.error("❌ Lỗi borrow-selected:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    // Sửa ở đây
    const cart = await Cart.findOne({ UserId: req.user.id });
    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const item = cart.Items.find((i) => i.MaSach.toString() === id);
    if (!item)
      return res.status(404).json({ message: "Không tìm thấy sách trong giỏ" });

    if (type === "increase") item.SoLuong += 1;
    if (type === "decrease" && item.SoLuong > 1) item.SoLuong -= 1;

    await cart.save();
    res.json({ message: "Cập nhật thành công", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



