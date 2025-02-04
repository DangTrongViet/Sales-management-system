const Product = require("../../models/product.model.js")
const productHelper = require("../../helpers/product")
const ProductCategory = require("../../models/product-category.model.js")
const productCategoryHelper = require("../../helpers/products-category.js")

//1. Hiển thị kết quả tìm kiếm
module.exports.index = async (req, res)=>{
    res.render("client/pages/search/index.pug", {
        pageTitle: "Kết quả tìm kiếm",
    })
}