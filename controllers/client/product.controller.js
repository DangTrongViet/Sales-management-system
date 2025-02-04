const Product = require("../../models/product.model.js")
const productHelper = require("../../helpers/product")
const ProductCategory = require("../../models/product-category.model.js")

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
// module.exports.detail = async (req, res) => {
//     try {
//         const find = {
//             deleted: false, 
//             slug: req.params.slug,
//             status: "active"
//         };
//         const product = await Product.findOne(find);

//         res.render("client/pages/products/detail", {
//             pageTitle: product.title, 
//             product: product, 
//         });

//     } catch (error) {
//         console.error(error);
//         res.redirect(`/products`);
//     }
// };


module.exports.category = async(req, res)=>{
    //console.log(req.params.slugCategory)
    const category = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugCategory
    });

    const getSubCategory = async(parentID)=>{
        const subs = await ProductCategory.find({
            parent_id: parentID,
            status: "active",
            deleted: false
        })
        let allSub = [...subs]

        for (const sub of subs){
            const childs = await getSubCategory(sub.id)
            allSub = allSub.concat(childs)
        }
        return allSub
    }

    const lisSubCategory = await getSubCategory(category.id)

    const lisSubCategoryID = lisSubCategory.map(item=>item.id)

    const products = await Product.find({    
        product_category_id: {$in: [category.id, ...lisSubCategoryID]},
            deleted: false
        }).sort({position: "desc"})

    // console.log(products)
    const newProducts = productHelper.priceNewProducts(products)
    res.render("client/pages/products/index.pug", {
        pageTitle: category.ti,
        products: newProducts
    })
}