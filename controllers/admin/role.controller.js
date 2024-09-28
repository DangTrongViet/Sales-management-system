const Roles = require("../../models/role.model")
// const ProductCategory = require("../../models/product-category.model")
// const filterStatusHelper = require("../../helpers/filterStatus.js")
// const searchHelper = require("../../helpers/search.js")
// const paginationHelper = require("../../helpers/pagination.js")
const systemConfig = require("../../config/system.js")
// const createTreeHelper = require("../../helpers/createTree")

//1. [GET] admin/roles
module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Roles.find(find)
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

//2. 
// [GET] admin/roles/create
module.exports.create = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Roles.find(find)
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
        records: records
    })
}

//[POST] admin/roles/create
module.exports.createPost = async (req, res)=>{
    const userRole =  new Roles(req.body)
    await userRole.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

//3. Chi tiết, xóa, sửa
//[GET] admin/roles/detail
module.exports.detail = async (req, res)=>{
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const records = await Roles.findOne(find)
    res.render("admin/pages/roles/detail.pug", {
        pageTitle: "Chi tiết nhóm quyền",
        records: records
    })
}

//[GET] admin/roles/edit
module.exports.edit = async (req, res)=>{
    const find = {
        _id: req.params.id,
        deleted: false
    }
    const records = await Roles.findOne(find)
    res.render("admin/pages/roles/edit.pug", {
        pageTitle: "Sửa nhóm quyền",
        records: records
    })
}

//[PATCH] admin/roles/editPatch
module.exports.editPatch = async (req, res)=>{
    try {
        await Roles.updateOne({_id: req.params.id}, req.body);
        req.flash('success', 'Cập nhập thành công');
    } catch (error){
        req.flash('error', 'Lỗi cập nhập!');
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
