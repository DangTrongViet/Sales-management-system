const Account = require("../../models/account.model.js")
const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system.js")
const md5 = require('md5');
//1. [GET] admin/accounts
module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token")
    
    //Thêm role cho các record
    for (const record of records) {
        const role = await Roles.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }    

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
    const roles = await Roles.find(find)
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles
    })
}
//[POST] admin/accounts/create
module.exports.createPost = async (req, res)=>{
    const emailExit = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if(emailExit){
        req.flash("error", `Email ${req.body.email} đã tồn tại!`)
        res.redirect(`back`)
    }else{
        req.body.password = md5(req.body.password)
        const records = new Account(req.body)
        await records.save()
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}
