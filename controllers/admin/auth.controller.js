const md5 = require('md5');
//1. [GET] admin/auth/login
module.exports.login = async (req, res)=>{
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Trang đăng nhập",
    })
}
