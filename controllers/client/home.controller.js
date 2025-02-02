const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

module.exports.index =  async(req, res)=>{ //Cái này là cú pháp đặt tên hàm trong Nodejs, cụ thẻ ở đây ta đặt tên hàm là "index"
    let find = {
        deleted: false,
        featured: "1",
        status: "active"
    };

    const productsFeatured = await Product.find(find).limit(6)

    // const productCategory = await ProductCategory.find(find)
    // const newProductCategory = createTreeHelper.tree(productCategory)
    const newProducts = productHelper.priceNewProducts(productsFeatured)

    // console.log(productsFeatured)
    res.render("client/pages/home/index.pug", {
        pageTitle: "Tranh chủ",
        productsFeatured: newProducts
        //layoutProductCategory: newProductCategory
    })
};
