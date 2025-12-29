// src/services/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("academex_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.removeItem("academex_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE };