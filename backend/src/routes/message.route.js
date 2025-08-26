import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controller.js';


const messageRoutes=express.Router();

messageRoutes.get('/users',protectRoute,getUserForSidebar)
messageRoutes.get('/:id',protectRoute,getMessages)

messageRoutes.post("/send/:id", protectRoute, sendMessage);
// messageRoutes.post('/signup',signup)
// messageRoutes.post('/logout',logout)




export default messageRoutes;