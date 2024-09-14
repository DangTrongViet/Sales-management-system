const mongoose = require("mongoose")
const productSchema = new mongoose.Schema(
    { 
    title: String,
    description:String,
    price:Number,
    discountPercentage:Number,
    stock:Number,
    thumbnail:String,
    status:String,
    position:Number,
    deleted:{ type: Boolean, default: false},
    deletedAt: Date
    }, 
    {
    timestamps: true //Thêm cái này để nó tự động ghi lại thời gian thêm mới và thời gian update sản phẩm đó
    }
);

const Product = mongoose.model('Product', productSchema, "products")

module.exports = Product