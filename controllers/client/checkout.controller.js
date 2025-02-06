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

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    })
}