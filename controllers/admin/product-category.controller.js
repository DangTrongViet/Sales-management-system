const Product = require("../../models/product.model.js")

//[GET] /admin/products-category
module.exports.index = async (req, res)=>{
    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm"
    })
}