const Account = require("../../models/account.model.js")
const systemConfig = require("../../config/system.js")

//Tạo middleware để kiếm tra nếu có token thì mưới cho đăng nhập vô xem các trang
module.exports.requireAuth = async(req, res, next)=>{
    //Lấy token trong cookies
    if(!req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }else{
        const user = await Account.findOne({token: req.cookies.token})
        if(!user){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        }else{
            next()
        }
    }
}