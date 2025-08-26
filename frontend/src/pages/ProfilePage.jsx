import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Mail, User, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectImg,setSelectImg]=useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };



  return (
    <div className="min-h-screen pt-20 bg-[#F5F5DC]">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="rounded-xl bg-[#D2B48C]/30 p-6 shadow-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#4B3832]">Profile</h1>
            <p className="mt-2 text-[#6F4E37]">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectImg|| authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#CC7722]"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-[#CC7722] hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-[#F5F5DC]" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-500">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-[#F5F5DC] rounded-lg border border-[#D2B48C]">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-[#F5F5DC] rounded-lg border border-[#D2B48C]">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-amber-800/30 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-400">
                <span>Member Since</span>
                <span>
    {authUser?.createdAt
      ? new Date(authUser.createdAt).toLocaleDateString()
      : "N/A"}
  </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProfilePage
