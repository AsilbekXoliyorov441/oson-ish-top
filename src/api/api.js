// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.osonishtop.uz", // o'zingning backend manzilingni qo'y
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
