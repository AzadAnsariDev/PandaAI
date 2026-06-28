import { Server } from "socket.io";

let io;

export function initServer(httpServer){

    io = new Server(httpServer,{
        cors :{
            origin : "http://localhost:5173",
            credentials : true
        }
    })

    console.log("Connected to serverIO")

    io.on("connection", (socket)=>{
        console.log(`user connected : ${socket.id}`)
    })
}

export function getIO(){
    if(!io){
        throw new Error("Socket io not initialize")
    }

    return io
}