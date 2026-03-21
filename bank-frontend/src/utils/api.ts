import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000", // Local development
  baseURL: "https://bank-app-for-csrf-attack-protection.onrender.com", // Production
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default API;