const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const uploadToClouddinary = require("../../helpers/uploadToClouddinary")
const chatSocket = require("../../sockets/client/chat.socket")

//Mai cần làm
//1. //dung usserId này chỉnh cho trang infoUser
//2. làm tính năng upload ảnh cho user để hiển thị ra 

module.exports.notFriend = async(req, res) =>{
    const userId = res.locals.user.id; 

    const users = await User.find({
        _id: {$ne: userId},
        status: "active",
        deleted: false
    }).select("avatar fullName")

    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}