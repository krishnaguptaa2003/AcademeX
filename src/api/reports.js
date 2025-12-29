// src\api\reports.js
import api from "../services/api";

/* ============================
   DASHBOARD STATS
============================ */
export const fetchAdminStats = async () => {
  const res = await api.get("/admin/reports/stats");
  return res.data;
};

/* ============================
   REPORTS PAGE
============================ */
export const fetchAdminOverview = async () => {
  const res = await api.get("/admin/reports/overview");
  return res.data;
};
