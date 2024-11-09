const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")

module.exports.index =  async(req, res)=>{ //Cái này là cú pháp đặt tên hàm trong Nodejs, cụ thẻ ở đây ta đặt tên hàm là "index"
    let find = {
        deleted: false
    };
    const productCategory = await ProductCategory.find(find)
    const newProductCategory = createTreeHelper.tree(productCategory)

    res.render("client/pages/home/index.pug", {
        pageTitle: "Tranh chủ",
        layoutProductCategory: newProductCategory
    })
};
