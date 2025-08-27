import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, User, Camera } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectImg, setSelectImg] = useState(null);

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
    <div className="min-h-screen grid place-items-center bg-base-200 p-6">
      <div className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-lg p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-base-content/60">Your profile information</p>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-primary hover:scale-105 
                p-2 rounded-full cursor-pointer transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera className="w-5 h-5 text-primary-content" />
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
          <p className="text-sm text-base-content/60">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </span>
            </label>
            <input
              type="text"
              value={authUser?.fullName || ""}
              disabled
              className="input input-bordered w-full bg-base-200"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </span>
            </label>
            <input
              type="text"
              value={authUser?.email || ""}
              disabled
              className="input input-bordered w-full bg-base-200"
            />
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-base-200 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-medium mb-2">Account Information</h2>
          <div className="flex items-center justify-between border-b border-base-300 py-2">
            <span>Member Since</span>
            <span>
              {authUser?.createdAt
                ? new Date(authUser.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Account Status</span>
            <span className="text-success font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
