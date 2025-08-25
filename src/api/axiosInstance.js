import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.osonishtop.uz/api/v1", // endi /api
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
