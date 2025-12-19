import axiosInstance from "../lib/axios.js";

// Auth APIs
export const signup = (fullName, email, password) =>
  axiosInstance.post("/auth/signup", { fullName, email, password });

export const login = (email, password) =>
  axiosInstance.post("/auth/login", { email, password });

export const logout = () =>
  axiosInstance.post("/auth/logout");

export const checkAuth = () =>
  axiosInstance.get("/auth/check");

export const updateProfile = (profilePic) =>
  axiosInstance.put("/auth/update", { profilePic });

// Message APIs
export const getUsersForSidebar = () =>
  axiosInstance.get("/messages/users");

export const getMessages = (userId) =>
  axiosInstance.get(`/messages/${userId}`);

export const sendMessage = (userId, text, image) =>
  axiosInstance.post(`/messages/send/${userId}`, { text, image });

// New feature APIs
export const deleteMessage = (messageId) =>
  axiosInstance.delete(`/messages/${messageId}`);

export const addReaction = (messageId, emoji) =>
  axiosInstance.put(`/messages/${messageId}/react`, { emoji });

export const markAsRead = (messageId) =>
  axiosInstance.put(`/messages/${messageId}/read`);

export const getAISuggestions = (context) =>
  axiosInstance.get(`/messages/ai/suggestions?context=${context}`);

export const translateMessage = (messageId, targetLanguage) =>
  axiosInstance.post(`/messages/ai/translate`, { messageId, targetLanguage });

export const searchMessages = (query, sentiment, from, to) =>
  axiosInstance.get(`/messages/search/messages`, {
    params: { query, sentiment, from, to },
  });

export const getMessageStats = () =>
  axiosInstance.get(`/messages/stats/analytics`);
