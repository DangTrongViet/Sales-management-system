const Account = require("../../models/account.model.js")
const systemConfig = require("../../config/system.js")

//1. [GET] admin/roles
module.exports.index = async (req, res)=>{
    // const find = {
    //     deleted: false
    // }
    // const records = await Roles.find(find)
    // res.render("admin/pages/roles/index.pug", {
    //     pageTitle: "Nhóm quyền",
    //     records: records
    // })
    res.send("oke")
}
