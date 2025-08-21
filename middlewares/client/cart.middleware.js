const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    let cart;

    // Chưa có cookie -> tạo giỏ mới
    if (!req.cookies?.cartId) {
      cart = await Cart.create({
        products: [],
        totalQuantity: 0,
        totalPrice: 0
      });

      const oneYear = 1000 * 60 * 60 * 24 * 365;
      res.cookie("cartId", cart._id.toString(), {
        expires: new Date(Date.now() + oneYear),
        httpOnly: true,
        sameSite: "lax"
        // secure: true, // bật khi chạy HTTPS
      });
    } else {
      // Có cookie -> tìm theo id
      cart = await Cart.findById(req.cookies.cartId);
      // Cookie cũ nhưng cart đã mất -> tạo mới
      if (!cart) {
        cart = await Cart.create({
          products: [],
          totalQuantity: 0,
          totalPrice: 0
        });
        const oneYear = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart._id.toString(), {
          expires: new Date(Date.now() + oneYear),
          httpOnly: true,
          sameSite: "lax"
        });
      }
    }

    // Tính lại an toàn
    const products = Array.isArray(cart.products) ? cart.products : [];
    cart.totalQuantity = products.reduce((sum, i) => sum + (i.quantity || 0), 0);
    cart.totalPrice = products.reduce((sum, i) => {
      const qty = i.quantity || 0;
      const price = i.price ?? i.product?.price ?? 0;
      return sum + qty * price;
    }, 0);

    // Xuất ra view (mini-cart)
    res.locals.miniCart = cart;

    next();
  } catch (err) {
    console.error("cart.middleware error:", err);
    // Fallback để view không vỡ
    res.locals.miniCart = { products: [], totalQuantity: 0, totalPrice: 0 };
    next(err);
  }
};
