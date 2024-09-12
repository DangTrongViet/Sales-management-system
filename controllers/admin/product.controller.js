const Product = require("../../models/product.model.js")
const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js")
const paginationHelper = require("../../helpers/pagination.js")

//1. [GET] /admin/products
module.exports.index = async (req, res)=>{
    //1. Xử lý lọc sản phẩm
    let filterStatus = filterStatusHelper(req.query)//Trả về mảng nút bấm đã được xử lý logic

    //console.log(req.query.status)//người dùng truy cập vào paragam http://localhost:3000/admin/products?status=active
    // nó sẽ lấy status: "active" gán cho biến query trong object req
    let find = {
        deleted: false
    };
    if(req.query.status){
        find.status = req.query.status//Add thêm 1 key=value vô object find{} là status: "Trạng thái...vv"
    }
    
    //2. Xử lý tìm kiếm sản phẩm
    let objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    //3. Phân trang (Pagination)
    const countProducts = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
        curentPage: 1,
        limitItem: 4
    }, req.query, countProducts)

    //Render ra giao diện
    const products = await Product.find(find)
                                  .sort({position: "desc"})//Sắp xếp giảm gần
                                  .limit(objectPagination.limitItem)
                                  .skip(objectPagination.skip) //limit: giới hạn SL sản phẩm mỗi trang, skip: số sản phẩm bỏ qua 

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    })
}

//---------------------------------------------------------------------
//1. [PATCH] /admin/products/change-status/:status/:id  (Thay đổi trạng thái hoạt động của 1 sản phẩm)
module.exports.changeStatus = async (req, res) =>{
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({_id: id}, {status: status})//Cập nhập thay đổi vào database
    res.redirect('back')// được sử dụng để chuyển hướng người dùng trở lại trang trước đó mà họ vừa truy cập.
}

//2. [PATCH] /admin/products/change-multi/:status/:id  (Thay đổi trạng thái hoạt động/dừng hoạt động/xóa sản phẩm/ Thay đổi vị trí -> của nhiều sản phẩm)
module.exports.changeMulti = async (req, res) =>{
    console.log(req.body)
    let type = req.body.type
    let ids = (req.body.ids).split(",")

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {status: "active"})
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, {status: "inactive"})
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date(),
            });
            break;
        case "change-position":
            for (const element of ids) {
                const [id, position] = element.split("-"); //destructering
                await Product.updateOne(
                    { _id: id },  
                    { position: parseInt(position) }
                );
            }
            break
        default:
            break;
    }
    res.redirect('back')
}


//---------------------------------------------------------------------
//3. [DELETE] /admin/products/delete/:id (Xóa 1 sản phẩm)
module.exports.deleteItem = async (req, res)=>{
    const id = req.params.id

    //Xóa mềm (thay đổi thuộc tính delete = true/false để hiển thị lên giao diện)
    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()//Thời gian xóa sản phẩm
    })

    //Xóa cứng (xóa luôn trong database)
    //await Product.deleteOne({_id: id})
    res.redirect('back')
}

//---------------------------------------------------------------------
//4. [PATCH] /admin/products/trash  (Thùng rác)
module.exports.trash = async (req, res)=>{
    const deletedProducts = await Product.find({deleted: true})
    console.log(deletedProducts)
    res.render("admin/pages/products/trash.pug", {
        pageTitle: "Danh sách sản phẩm bị xóa",
        deletedProducts: deletedProducts || []
    })
}
// "/admin/products/trash/:require/:id" (Khôi phục hoặc xóa vĩnh viễn trong thùng rác)
module.exports.requireTrash = async (req, res)=>{
    const deletedProducts = await Product.find({deleted: true})

    const require = req.params.require
    const id = req.params.id

    if(require=="restore"){
        await Product.updateOne({_id: id}, {deleted: false})
    }
    else if(require=="delete"){
        await Product.deleteOne({_id: id})
    }
    res.redirect('back')
}
