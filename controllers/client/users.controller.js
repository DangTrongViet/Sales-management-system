const User = require("../../models/user.model")
const usersSocket = require("../../sockets/client/users.socket")

//Mai cần làm
//1. //dung usserId này chỉnh cho trang infoUser
//2. làm tính năng upload ảnh cho user để hiển thị ra 

module.exports.notFriend = async(req, res) =>{
    //Socket 
    usersSocket(res)
    //End socket

    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId,
    })

    const requestFriends = myUser.requestFriends
    const acceptFriends = myUser.acceptFriends

    const users = await User.find({
        $and: [
            {_id: {$ne: userId}},
            {_id: { $nin: requestFriends }},
            {_id: { $nin: acceptFriends }}
        ],
        status: "active",
        deleted: false
    }).select("avatar fullName")

    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}