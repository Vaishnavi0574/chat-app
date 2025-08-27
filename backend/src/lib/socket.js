import {Server} from  "socket.io";
import http from "http"

import express from "express";
import { Socket } from "dgram";

const app=express();

const server=http.createServer(app);
//socketio server 
const io = new Server(server, {
  cors: {
    origin: true,          // allow any origin dynamically
    credentials: true,
    methods: ["GET", "POST"]
  }
});


const userSocketMap={}//to storeonline ones <---map


io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userId=socket.handshake.query.userId;

    if(userId)userSocketMap[userId]=socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))//to telll everyone who is online.

    socket.on("disconnect",()=>{

        delete userSocketMap[userId]
        
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
        console.log("A user disconnected",socket.id)
    })
})

export function getReceiverSocketID(userId) {
    return userSocketMap[userId];
}


export {io, app,server};