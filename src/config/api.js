// src/config/api.js
import api, { API_BASE as BASE_FROM_SERVICE } from "../services/api";

// src/config/api.js
export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// If you ever want the shared axios instance:
export default api;
