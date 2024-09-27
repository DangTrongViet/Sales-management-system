const Roles = require("../../models/role.model")
// const ProductCategory = require("../../models/product-category.model")
// const filterStatusHelper = require("../../helpers/filterStatus.js")
// const searchHelper = require("../../helpers/search.js")
// const paginationHelper = require("../../helpers/pagination.js")
// const systemConfig = require("../../config/system.js")
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
