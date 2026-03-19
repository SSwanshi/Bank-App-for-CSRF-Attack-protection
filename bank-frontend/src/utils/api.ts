import axios from "axios";

const API = axios.create({
  baseURL: "https://bank-app-for-csrf-attack-protection.onrender.com",
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default API;