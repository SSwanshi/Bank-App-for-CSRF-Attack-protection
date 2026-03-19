import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // 🔥 REQUIRED for cookies
});

export default API;