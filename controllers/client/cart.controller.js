const Product = require("../../models/product.model.js")
const Cart = require("../../models/cart.model")

//1. Thêm giỏ hàng
//[POST] /cart/add/:productId
module.exports.addPost = async (req, res)=>{
    const cartId = req.cookies.cartId;
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({
        _id: cartId
    })

    if(cart){
        const existProductInCart = cart.products.find(item => item.product_id == productId)
    }

    if(existProductInCart){
        const newQuantity = existProductInCart.quantity + quantity
        await Cart.updateOne(
            {
               _id: cartId,
               'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        )
    }else{
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
    
        await Cart.updateOne(
            {
               _id: cartId
            },
            {
                $push: {products: objectCart}
            }
        )
        req.flash("success", "Thêm sản phẩm thành công")
    }
    res.redirect("back")
}