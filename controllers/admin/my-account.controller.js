const Roles = require("../../models/role.model")
const systemConfig = require("../../config/system.js")

//1. [GET] admin/roles
module.exports.index = async (req, res)=>{
    res.send("oke nha bà")
}