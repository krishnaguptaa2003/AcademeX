// src\api\attendance.js
import api from "../services/api";

/* ADMIN ATTENDANCE */
export const fetchAdminAttendance = async (params = {}) => {
  const res = await api.get("/admin/attendance/admin", { params });
  return res.data;
};

export const fetchLowAttendance = async () => {
  const res = await api.get("/admin/attendance/admin/low-attendance");
  return res.data;
};
