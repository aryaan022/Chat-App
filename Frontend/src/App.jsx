import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const App = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />}></Route>
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />}></Route>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />}></Route>
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />}></Route>
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />}></Route>
      </Routes>
    </div>
  );
};

export default App;
