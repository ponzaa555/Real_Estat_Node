import { Server } from "socket.io"

// port can reach this server
const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    }
});

let onlineuser = []

const addUser = (userId, socketId) => {
    const userExits = onlineuser.find(user => user.userId === userId);
    if (!userExits) {
        onlineuser.push({ userId, socketId });
    }
}
const removeUser = (socketId) => {
    // remove user 
    const socket = onlineuser.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    console.log(onlineuser)
    return onlineuser.find(user => user.userId === userId)
};
// ใน socket จะมี key id ที่มีค่าไม่เหมือนใคร
io.on("connection", (socket)=> {
    // get user id form client
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id),
        console.log(onlineuser)
    }) // .on mean recieve message
    socket.on("sendMessage", ({ reciverId, data }) =>{
        // console.log(reciverId)
        // console.log(data)
        // reciverId = socket.id
        const reciver = getUser(reciverId);
        // // but data we want to send from server so clint have to socket.on() to listen
        io.to(reciver.socketId).emit("getMessage",data);
    })
    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
})
// port for listen client
io.listen("4000")