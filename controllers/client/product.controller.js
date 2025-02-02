const Product = require("../../models/product.model.js")
const productHelper = require("../../helpers/product")

//1. Hiển thị trang client
module.exports.index = async (req, res)=>{
    const products = await Product.find({//Lọc data muốn lấy ra
        status: "active",
        deleted: false
    }).sort({position: "desc"})

    const newProducts = productHelper.priceNewProducts(products)

    // console.log(products)
    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

//2. Hiển thị chi tiết sản phẩm
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false, 
            slug: req.params.slug,
            status: "active"
        };
        const product = await Product.findOne(find);

        res.render("client/pages/products/detail", {
            pageTitle: product.title, 
            product: product, 
        });

    } catch (error) {
        console.error(error);
        res.redirect(`/products`);
    }
};
