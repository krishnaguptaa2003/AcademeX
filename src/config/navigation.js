// src/config/navigation.js

export const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: "/",
    roles: ["ADMIN", "FACULTY", "STUDENT"],
  },
  {
    id: "attendance",
    label: "Attendance",
    to: "/attendance",
    roles: ["ADMIN", "FACULTY"],
  },
  {
    id: "courses",
    label: "Courses",
    to: "/courses",
    roles: ["ADMIN", "FACULTY", "STUDENT"],
  },
  {
    id: "students",
    label: "Students",
    to: "/students",
    roles: ["ADMIN", "FACULTY"],
  },
  {
    id: "fees",
    label: "Fees",
    to: "/fees",
    roles: ["ADMIN", "FACULTY"],
  },
  {
    id: "profile",
    label: "Profile",
    to: "/profile",
    roles: ["ADMIN", "FACULTY", "STUDENT"],
  },
];
