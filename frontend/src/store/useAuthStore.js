import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000/api"
  :"/"
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,  
    isLoggingIn: false,
    isUpdatingSettings: false,
    isCheckingAuth: true,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,

  // check if user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null, isCheckingAuth: false });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async(formData) => {
        try {
            set({ isSigningUp: true }); 
            const res = await axiosInstance.post('/auth/signup', formData);
            set({ authUser: res.data.user });
            toast.success("Signup successful");
            get().connectSocket();
        } catch (error) {
            console.log(error.response?.data?.message);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });   
        }
    },

    logout:async()=>{
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logout successful");
        get().disconnectSocket();
      } catch (error) {
        console.log(error);
        console.log("Logout failed");
        toast.error("something went wrong");
      }
    },

    login:async(formdata)=>{
      try {
        set({isLoggingIn:true})
        const res= await axiosInstance.post("/auth/login",formdata);
        set({authUser:res.data.user});
        toast.success("Login successful");
        
        set({isLoggingIn:false})
        get().connectSocket();
      } catch (error) {
        console.log(error.response?.data?.message);
        toast.error(error.response?.data?.message || "Login failed");
      }
      finally{
        set({isLoggingIn:false})
      }
    },

    
    updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
    },

    connectSocket:()=>{
      const {authUser}=get()
      if(!authUser|| get().socket?.connected)return 

      const socket=io(BASE_URL,{
        query:{
          userId:authUser._id
        },
        
      });
      socket.connect()
      console.log("user connected")
      set({socket:socket});

      socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds})//userIds is a array of all online users
      })
  },

     disconnectSocket:()=>{
      console.log("user disconnected")
      if(get().socket?.connected) get().socket.disconnect();
  }


}));
