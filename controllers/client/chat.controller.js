const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const uploadToClouddinary = require("../../helpers/uploadToClouddinary")


//[GET] chat/
module.exports.index = async(req, res)=>{
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName

    //SocketIo
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async(data)=>{

            let images = []
            for (const imageBuffer of data.images){
                const link = await uploadToClouddinary(imageBuffer)
                images.push(link)
            }

            //Lưu vào data base
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            })
            await chat.save()

            //Trả data về cho client
            _io.emit("SERVER_RETURN_MASSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type)=>{
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            })
        })
    })

    //End SocketIo

    const chats = await Chat.find({
        deleted: false
    })

    for (const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName")

        chat.infoUser = infoUser
    }


    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    })
}