// src\api\faculty.js
import api from "../services/api";

export const getMySubjects = async () => {
  const res = await api.get("/faculty/my-subjects");
  return res.data;
};

export const getSubjectStudents = async (subjectId) => {
  const res = await api.get(`/faculty/subjects/${subjectId}/students`);
  return res.data;
};

export const submitAttendance = async (data) => {
  const res = await api.post("/faculty/attendance", data);
  return res.data;
};

export const submitResult = async (data) => {
  const res = await api.post("/faculty/results", data);
  return res.data;
};

export const getDepartmentOverview = async () => {
  const res = await api.get("/faculty/department");
  return res.data;
};

export const getUniversityOverview = async () => {
  const res = await api.get("/faculty/university");
  return res.data;
};
