const Product = require("../../models/product.model.js");
const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/product.js");
const { getAvailableQty } = require("../../helpers/inventory.js");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  if (!cart) {
    return res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cartDetail: { products: [], totalPrice: 0 },
    });
  }

  // Tổng tiền mỗi dòng
  if (Array.isArray(cart.products) && cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfor = await Product.findOne({ _id: productId });

      if (!productInfor) {
        // Sản phẩm đã bị xóa: bỏ khỏi giỏ để tránh lỗi
        item.productInfor = null;
        item.totalPrice = 0;
        continue;
      }

      productInfor.priceNew = productHelper.priceNewProduct(productInfor);
      item.productInfor = productInfor;
      item.totalPrice = Number(item.quantity) * Number(productInfor.priceNew || 0);
    }
  }

  // Tổng tiền giỏ
  cart.totalPrice = (cart.products || []).reduce((sum, it) => sum + Number(it.totalPrice || 0), 0);

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const incQty = Math.max(1, parseInt(req.body.quantity || "1", 10)); // tối thiểu 1

  const [cart, product] = await Promise.all([
    Cart.findOne({ _id: cartId }),
    Product.findOne({ _id: productId }),
  ]);

  if (!cart) {
    req.flash("error", "Không tìm thấy giỏ hàng.");
    return res.redirect("back");
  }
  if (!product) {
    req.flash("error", "Sản phẩm không tồn tại.");
    return res.redirect("back");
  }

  const available = getAvailableQty(product); // tồn kho khả dụng
  const exist = cart.products.find((it) => String(it.product_id) === String(productId));
  const currentQty = exist ? Number(exist.quantity) : 0;

  // Tổng sau cộng
  const requestedTotal = currentQty + incQty;
  const cappedTotal = Math.min(requestedTotal, available);

  if (cappedTotal <= 0) {
    // Hết hàng
    if (exist) {
      // nếu đang có trong giỏ thì đưa về 0 (xóa)
      cart.products = cart.products.filter((it) => String(it.product_id) !== String(productId));
      await cart.save();
    }
    req.flash("error", "Sản phẩm đã hết hàng.");
    return res.redirect("back");
  }

  if (exist) {
    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId },
      { $set: { "products.$.quantity": cappedTotal } }
    );
  } else {
    await Cart.updateOne(
      { _id: cartId },
      { $push: { products: { product_id: productId, quantity: cappedTotal } } }
    );
  }

  if (requestedTotal > available) {
    req.flash("warning", `Chỉ còn ${available} sản phẩm trong kho. Số lượng đã được điều chỉnh.`);
  } else {
    req.flash("success", "Thêm sản phẩm thành công.");
  }
  res.redirect("back");
};

// [GET] /cart/update/:productId/:quantity
module.exports.updateProduct = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const reqQty = parseInt(req.params.quantity, 10);

  const [cart, product] = await Promise.all([
    Cart.findOne({ _id: cartId }),
    Product.findOne({ _id: productId }),
  ]);

  if (!cart) {
    req.flash("error", "Không tìm thấy giỏ hàng.");
    return res.redirect("back");
  }
  if (!product) {
    // nếu product không tồn tại, xóa khỏi giỏ
    await Cart.updateOne(
      { _id: cartId },
      { $pull: { products: { product_id: productId } } }
    );
    req.flash("warning", "Sản phẩm không còn tồn tại và đã được xóa khỏi giỏ.");
    return res.redirect("back");
  }

  const available = getAvailableQty(product);

  // Các case UX hay gặp
  if (isNaN(reqQty)) {
    req.flash("error", "Số lượng không hợp lệ.");
    return res.redirect("back");
  }
  if (reqQty <= 0) {
    // 0 hoặc âm → coi như xóa
    await Cart.updateOne(
      { _id: cartId },
      { $pull: { products: { product_id: productId } } }
    );
    req.flash("success", "Đã xóa sản phẩm khỏi giỏ.");
    return res.redirect("back");
  }

  const newQty = Math.min(reqQty, available);
  await Cart.updateOne(
    { _id: cartId, "products.product_id": productId },
    { $set: { "products.$.quantity": newQty } }
  );

  if (reqQty > available) {
    req.flash("warning", `Chỉ còn ${available} sản phẩm trong kho. Số lượng đã được điều chỉnh.`);
  } else {
    req.flash("success", "Cập nhập số lượng thành công.");
  }
  res.redirect("back");
};


module.exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });
  if (cart) {
    cart.products = (cart.products || []).filter(
      (it) => String(it.product_id) !== String(productId)
    );
    await cart.save();
    req.flash('success', 'Xóa sản phẩm thành công');
  } else {
    req.flash('error', 'Không tìm thấy giỏ hàng');
  }
  res.redirect('back');
};
