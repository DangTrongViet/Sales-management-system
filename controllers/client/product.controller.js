const Product = require("../../models/product.model.js")

//1. Hiển thị trang client
module.exports.index = async (req, res)=>{
    const products = await Product.find({//Lọc data muốn lấy ra
        status: "active",
        deleted: false
    }).sort({position: "desc"})

    const newProducts = products.map((item)=>{
        item.priceNew = (item.price - item.price * item.discountPercentage * 0.01).toFixed(0)//Thêm 1 thuộc tính priceNew cho mảng products
        return item;
    })
    console.log(products)
    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

//2. Hiển thị chi tiết sản phẩm
module.exports.detail = async (req, res)=>{
    res.send("oke")
}