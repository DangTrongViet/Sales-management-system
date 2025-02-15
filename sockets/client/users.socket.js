const User = require("../../models/user.model")

module.exports = async(res)=>{
    //SocketIo
    _io.once('connection', (socket) => {
        //NGƯỜI DÙNG GỬI YÊU CẦU KẾT BẠN
        socket.on("CLIENT_ADD_FRIEND", async(userId)=>{
            const myUserId = res.locals.user.id; 

            //Thêm id của A vào aceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(!existUserAInB){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {acceptFriends: myUserId}
                })
            }
            //Thêm id của B vào aceptFriends của A
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(!existUserBInA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {requestFriends: userId}
                })
            }

            //Lấy độ dài accept friend của B để trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })
        })

        //NGƯỜI DÙNG HUWYR GỬI YÊU CẦU KẾT BẠN
        socket.on("CLIENT_CANCEL_FRIEND", async(userId)=>{
            const myUserId = res.locals.user.id; 

            //Xóa id của A vào aceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(existUserAInB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {acceptFriends: myUserId}
                })
            }
            //Xóa id của B vào requestFriends của A
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(existUserBInA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {requestFriends: userId}
                })
            }
        })

        //NGƯỜI DÙNG TỪ CHỐI KẾT BẠN
        socket.on("CLIENT_REFUSE_FRIEND", async(userId)=>{
            const myUserId = res.locals.user.id; 

            //Xóa id của A vào aceptFriends của B
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if(existUserAInB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {acceptFriends: userId}
                })
            }
            //Xóa id của B vào requestFriends của A
            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if(existUserBInA){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {requestFriends: myUserId}
                })
            }
        })

        //NGƯỜI DÙNG CHẤP NHẬN KẾT BẠN
        socket.on("CLIENT_ACCEPT_FRIEND", async(userId)=>{
            const myUserId = res.locals.user.id; 

            //Xóa id của A vào aceptFriends của B
            //Thêm {user_id, room_chat_id} của A vào friendList của B
            const existUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if(existUserAInB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },
                    $pull: {acceptFriends: userId}
                })
            }

            //Xóa id của B vào requestFriends của A
            //Thêm {user_id, room_chat_id} của B vào friendList của A
            const existUserBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if(existUserBInA){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: {requestFriends: myUserId}
                })
            }
        })
    })
}