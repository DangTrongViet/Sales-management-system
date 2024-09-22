const Product = require("../../models/product.model.js")

//1. [GET] /admin/products-category
module.exports.index = async (req, res)=>{
    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm"
    })
}

//2. Tạo danh mục
//[GET] /admin/products-category/create
module.exports.create = async (req, res)=>{
    res.render("admin/pages/products-category/create.pug", {
        pageTitle: "Danh mục sản phẩm"
    })
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res)=>{
    res.send("oke")
}