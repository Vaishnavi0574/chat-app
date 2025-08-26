import { generateToken } from "../lib/util.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const login =async (req, res) =>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        const user =await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        generateToken(user._id,res);

        res.status(200).json({
            message:"Login successful",
            user:{
                _id:user._id,
                email:user.email,
                fullName:user.fullName,
                profile:user.profile,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log("error in login controller");
        res.status(500).json({message:"Server error"});
    }
    
}


export const signup =async (req, res) =>{
    const {email,password,fullName}=req.body;
    try {
        if(!email || !password || !fullName){
            return res.status(400).json({message:"all fiels are required"});
        }
        if(!password || password.length<6)
            return res.status(400).json({message:"Password must be at least 6 characters long"});

        const user=await User.findOne({email}) 

        if(user)return res.status(400).json({message:"User already exists"});

        const salt=await bcrypt.genSalt(10);

        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({email,password:hashedPassword,fullName});
        
        if(newUser){
            await newUser.save();
            generateToken(newUser._id,res)
            
            

            res.status(201).json({
                message:"User created successfully",
                user:{
                    _id:newUser._id,
                    email:newUser.email,
                    fullName:newUser.fullName,
                    profile:newUser.profile,
                    createdAt: user.createdAt,
                }
            })
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }

    } catch (error) {
        console.log("error in sigup controller");
        res.status(500).json({message:"Server error"});
    }
}


export const logout = (req, res) =>{
    try {
       res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: "strict" });
        res.status(200).json({message:"Logout successful"});
    } catch (error) {
        console.log("error in logout controller");
        res.status(500).json({message:"Server error"});
    }

}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("error in check auth controller");
    res.status(500).json({ message: "Server error" });
  }
}


