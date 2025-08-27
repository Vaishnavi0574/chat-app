import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import {connectDb } from './lib/db.js';
import {io, app,server,} from './lib/socket.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";

import messageRoutes from './routes/message.route.js';
dotenv.config();

const _dirname=path.resolve()


//middleware
app.use(express.json({limit:"10mb"}));

//for connecting frontend and backend as have different ports
app.use(cors({
  origin: [
    "http://localhost:5173", 
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


//middleware to parse json data and cookies
app.use(express.urlencoded({ extended: true,limit:"10mb" }))
app.use(cookieParser())

//routes
app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.resolve(_dirname,"../frontend/dist")))

    app.get('*',(req,res)=>{
        res.sendFile(path.join(_dirname,"../frontend","dist","index.html"))
    })
}

const port=process.env.PORT||3000;
server.listen(port, () => {
    connectDb();
    console.log(`Server is running on port ${port}`);
})