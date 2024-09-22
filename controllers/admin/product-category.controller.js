const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")

//1. [GET] /admin/products-category
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find)

    res.render("admin/pages/products-category/index.pug", {
        pageTitle: "Danh mục sản phẩm",
        records: records
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
    if(req.body.position == ""){
        const countProducts = await ProductCategory.countDocuments()
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }

    const record = new ProductCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}