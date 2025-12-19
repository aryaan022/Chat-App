import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.checkAuth();
        if (res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Sign up
  const signup = async (fullName, email, password) => {
    setIsAuthenticating(true);
    try {
      const res = await api.signup(fullName, email, password);
      setUser(res.data);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setIsAuthenticating(true);
    try {
      const res = await api.login(email, password);
      setUser(res.data);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsAuthenticating(true);
    try {
      await api.logout();
      setUser(null);
      toast.success("Logged out successfully!");
      return true;
    } catch (error) {
      toast.error("Logout failed");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Update profile picture
  const updateProfilePic = async (profilePic) => {
    try {
      const res = await api.updateProfile(profilePic);
      setUser(res.data);
      toast.success("Profile picture updated!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticating,
        signup,
        login,
        logout,
        updateProfilePic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
