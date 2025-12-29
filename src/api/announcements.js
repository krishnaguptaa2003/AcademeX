// src\api\announcements.js
import api from "../services/api";

export const fetchAnnouncements = async () => {
  try {
    const res = await api.get("/announcements");
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Fetch announcements failed", error);
    return { success: false, data: [] };
  }
};
