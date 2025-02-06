const Product = require("../../models/product.model.js")
const Cart = require("../../models/cart.model")
const productHelper = require("../../helpers/product.js")

// [GET] /cart
module.exports.index = async(req, res)=>{
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({
        _id: cartId
    })

    //tổng tiền mỗi đơn hàng

    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id

            const productInfor = await Product.findOne({
                _id: productId
            })

            productInfor.priceNew = productHelper.priceNewProduct(productInfor)

            item.productInfor = productInfor

            item.totalPrice = item.quantity * productInfor.priceNew
        }
    }

    //Tổng tiền của all đơnhàng
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}



module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    let cart = await Cart.findOne({ _id: cartId });

    if (cart) {
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        let existProductInCart = cart.products.find(item => item.product_id == productId);

        if (existProductInCart) {
            // Nếu có, cập nhật số lượng
            await Cart.updateOne(
                { _id: cartId, 'products.product_id': productId },
                { $inc: { 'products.$.quantity': quantity } } // Dùng $inc để tăng số lượng
            );
            req.flash("success", "Thêm sản phẩm thành công");
        } else {
            // Nếu chưa có, thêm sản phẩm vào giỏ hàng
            await Cart.updateOne(
                { _id: cartId },
                { $push: { products: { product_id: productId, quantity: quantity } } }
            );
            req.flash("success", "Thêm sản phẩm thành công");
        }
    } else {
        // Nếu giỏ hàng chưa tồn tại, tạo mới
        await Cart.create({
            _id: cartId,
            products: [{ product_id: productId, quantity: quantity }]
        });
        req.flash("success", "Thêm sản phẩm thành công");
    }
    res.redirect("back");
};
