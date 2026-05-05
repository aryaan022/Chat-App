import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`,
  withCredentials: true,
});

export default axiosInstance;
