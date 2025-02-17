const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const uploadToClouddinary = require("../../helpers/uploadToClouddinary")
const chatSocket = require("../../sockets/client/chat.socket")

//[GET] /rooms-chat
module.exports.index = async(req, res)=>{
    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Danh sách phòng",
    })
}