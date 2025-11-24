import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Simulated authentication status
const authUser = false; // Change to 'true' to simulate an authenticated user

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to = "/login" />}></Route>
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to = "/" />}></Route>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to = "/" />}></Route>
        <Route path="settings" element={<SettingsPage />}></Route>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to = "/login" />}></Route>
      </Routes>
    </div>
  );
};

export default App;
