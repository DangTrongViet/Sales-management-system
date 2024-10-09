const Account = require("../../models/account.model.js")
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
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản"
    })
}