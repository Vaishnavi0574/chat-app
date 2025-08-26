import React, { useEffect, useState } from 'react';
import "./index.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { VscLoading } from "react-icons/vsc";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, isCheckingAuth, checkAuth,onlineUsers} = useAuthStore();
     const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  
  // console.log(onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col justify-center items-center z-50">
        <VscLoading className="text-white w-16 h-16 animate-spin" />
      </div>
    );
    

  return (
    <div data-theme={!theme?"":"dark"}> 
      <Navbar theme={theme} setTheme={setTheme} />

      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} /> 
        <Route path="/profile" element={!authUser ? <Navigate to="/login" /> : <ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
