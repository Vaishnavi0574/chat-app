import express from 'express';
import { login, signup, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const authRoutes=express.Router();

authRoutes.post('/login',login)
authRoutes.post('/signup',signup)
authRoutes.post('/logout',logout)

authRoutes.put('/update-profile',protectRoute,updateProfile )
authRoutes.get('/check',protectRoute,checkAuth)


export default authRoutes;