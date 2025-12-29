// src/api/facultyAcademics.js
import api from "../services/api";

export function fetchMySubjects() {
  return api.get("/faculty/my-subjects");
}

export function fetchSubjectStudents(subjectId) {
  return api.get(`/faculty/subjects/${subjectId}/students`);
}

export function fetchSubjectAttendance(subjectId, date) {
  const params = date ? { date } : {};
  return api.get(`/faculty/subjects/${subjectId}/attendance`, { params });
}

export function submitAttendance(data) {
  return api.post("/faculty/attendance", data);
}

export function submitResult(data) {
  return api.post("/faculty/results", data);
}

export function fetchDepartmentOverview() {
  return api.get("/faculty/department-overview");
}

export function fetchUniversityOverview() {
  return api.get("/faculty/university-overview");
}