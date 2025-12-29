// server\src\routes\report.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireRole(["ADMIN"]));

/* ============================
   DASHBOARD STATS (HOME)
============================ */
router.get("/stats", async (_, res) => {
  const [
    studentCount,
    facultyCount,
    courseCount,
    subjectCount,
    attendanceStats,
    resultStats,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.faculty.count(),
    prisma.course.count(),
    prisma.subject.count(),
    prisma.attendance.findMany(),
    prisma.result.findMany(),
  ]);

  /* Attendance average */
  let attendancePercentage = 0;
  if (attendanceStats.length > 0) {
    const presentCount = attendanceStats.filter(a => a.status).length;
    attendancePercentage = Math.round(
      (presentCount / attendanceStats.length) * 100
    );
  }

  /* Result pass/fail */
  const passCount = resultStats.filter(r => r.marks >= 40).length;
  const failCount = resultStats.filter(r => r.marks < 40).length;

  res.json({
    success: true,
    data: {
      totals: {
        students: studentCount,
        faculty: facultyCount,
        courses: courseCount,
        subjects: subjectCount,
      },
      academics: {
        attendancePercentage,
        results: {
          pass: passCount,
          fail: failCount,
        },
      },
    },
  });
});

/* ============================
   DETAILED REPORTS PAGE
============================ */
router.get("/overview", async (_, res) => {
  const courses = await prisma.course.findMany({
    include: {
      subjects: {
        include: {
          faculty: {
            include: { user: true },
          },
        },
      },
      students: true,
    },
  });

  const formatted = courses.map(course => ({
    courseName: course.name,
    totalStudents: course.students.length,
    totalSubjects: course.subjects.length,
    subjects: course.subjects.map(sub => ({
      subjectName: sub.name,
      semester: sub.semester,
      faculty: sub.faculty
        ? sub.faculty.user.name
        : "Not Assigned",
    })),
  }));

  res.json({
    success: true,
    data: formatted,
  });
});

export default router;
