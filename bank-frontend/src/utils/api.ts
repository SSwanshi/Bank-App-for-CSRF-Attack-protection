import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000", // Local development
  baseURL: "https://csrf.swanshi.me", // Production
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default API;