const User = require("../../models/user.model")
const RoomChat=require("../../models/rooms-chat.model");
module.exports = (res) => {

    _io.once('connection', (socket) => {
        // CHuc nang gui yeu cau
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            const myUserIdA = res.locals.user.id;

            // Thêm id A vào acceptFriends của B

            const existIdAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: myUserIdA
            });

            if (!existIdAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $push: { acceptFriends: myUserIdA }
                })
            }

            // Thêm id B vào requestFriends của A

            const existIdBInA = await User.findOne({
                _id: myUserIdA,
                requestFriends: userIdB
            });

            if (!existIdBInA) {
                await User.updateOne({
                    _id: myUserIdA
                }, {
                    $push: { requestFriends: userIdB }
                })
            }

            // Lay ra do dai acceptFriends cua B va tra ve cho B

            const infoUserB = await User.findOne({
                _id: userIdB
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lay info cua A tra ve cho B
            const infoUserA = await User.findOne({
                _id: myUserIdA
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userIdB,
                infoUserA: infoUserA
            })


        });
        // Chức năng hủy yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
            const myUserIdA = res.locals.user.id;
            // Xóa id A trong acceptFriends của B
            const existIdAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: myUserIdA
            });

            if (existIdAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $pull: { acceptFriends: myUserIdA }
                })
            }
            // Xóa id B trong requestFriends của A
            const existIdBInA = await User.findOne({
                _id: myUserIdA,
                requestFriends: userIdB
            });

            if (existIdBInA) {
                await User.updateOne({
                    _id: myUserIdA
                }, {
                    $pull: { requestFriends: userIdB }
                })
            }
            // Lay ra do dai acceptFriends cua B va tra ve cho B

            const infoUserB = await User.findOne({
                _id: userIdB
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriends
            });


            // Lay id cua A va tra ve cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{
                userIdB:userIdB,
                userIdA:myUserIdA
            })

        });

        // Chuc nang tu choi ket ban
        socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
            const myUserIdA = res.locals.user.id;

            // Xóa id A trong acceptFriends của B

            const existIdAInB = await User.findOne({
                _id: myUserIdA,
                acceptFriends: userIdB
            });

            if (existIdAInB) {
                await User.updateOne({
                    _id: myUserIdA
                }, {
                    $pull: { acceptFriends: userIdB }
                })
            }

            // Xóa id B trong requestFriends của A

            const existIdBInA = await User.findOne({
                _id: userIdB,
                requestFriends: myUserIdA
            });

            if (existIdBInA) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $pull: { requestFriends: myUserIdA }
                })
            }

        });
        // Chuc nang chap nhan ket ban
        socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
            const myUserIdA = res.locals.user.id;
            let roomChat;
            const existIdAInB = await User.findOne({
                _id: myUserIdA,
                acceptFriends: userIdB
            });

            const existIdBInA = await User.findOne({
                _id: userIdB,
                requestFriends: myUserIdA
            });

            if(existIdAInB && existIdBInA){
            // Tao phong chat chung cho 2 nguoi
            const dataRoom={
                typeRoom:"friend",
                users: [
                    {
                        user_id:myUserIdA,
                        role: "superAdmin"
                    },
                    {
                        user_id:userIdB,
                        role: "superAdmin"
                    }
                ]
            }
                roomChat=new RoomChat(dataRoom);
                await roomChat.save();
            }
            // Thêm {user_id, room_chat_id} của A vào trong friendList của B
            // Xóa id của A trong acceptFriends của B
            
            if (existIdAInB) {
                await User.updateOne({
                    _id: myUserIdA
                }, {
                    $push: {
                        friendList: {
                            user_id: userIdB,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { acceptFriends: userIdB }
                })
            }
            // Thêm {user_id, room_chat_id} của B vào trong friendList của A
            // Xóa id của B trong requestFriends của A

            if (existIdBInA) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserIdA,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { requestFriends: myUserIdA }
                })
            }

        });


    });
}