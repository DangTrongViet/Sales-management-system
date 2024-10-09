const Account = require("../../models/account.model.js")
const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system.js")

//1. [GET] admin/accounts
module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Account.find(find)
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}
//2.
//[GET] admin/accounts/create
module.exports.create = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Account.find(find)
    const roles = await Roles.find(find)
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles
    })
}
//[POST] admin/accounts/create
module.exports.createPost = async (req, res)=>{
    const records = new Account(req.body)
    await records.save()
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
}
