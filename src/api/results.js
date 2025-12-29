// src\api\results.js
import api from "../services/api";

/* ADMIN RESULTS */
export const fetchAdminResults = async () => {
  const res = await api.get("/admin/results/admin");
  return res.data;
};

export const fetchFailedStudents = async () => {
  const res = await api.get("/admin/results/admin/failures");
  return res.data;
};
