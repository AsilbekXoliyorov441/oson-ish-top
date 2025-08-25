// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // o'zingning backend manzilingni qo'y
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


import axios from "axios";


