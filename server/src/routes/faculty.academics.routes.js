// server\src\routes\faculty.academics.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { loadFaculty, requireFacultyLevel } from "../middleware/faculty.middleware.js";

const router = express.Router();

// Apply auth to all faculty routes
router.use(requireAuth);
router.use(loadFaculty);

/* ============================
   MY SUBJECTS (ALL FACULTY)
============================ */
router.get("/my-subjects", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { facultyId: req.faculty.id },
      include: { 
        course: true,
        faculty: {
          include: { user: true }
        }
      },
    });

    res.json({ success: true, data: subjects });
  } catch (error) {
    console.error("My subjects error:", error);
    res.status(500).json({ success: false, message: "Failed to load subjects" });
  }
});

/* ============================
   STUDENTS OF MY SUBJECT
============================ */
router.get("/subjects/:subjectId/students", async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Check if faculty owns this subject (unless HOD/DEAN)
    if (req.faculty.level === "PROFESSOR" && subject.facultyId !== req.faculty.id) {
      return res.status(403).json({ success: false, message: "Not your subject" });
    }

    const students = await prisma.student.findMany({
      where: { 
        courseId: subject.courseId,
        semester: subject.semester 
      },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        course: true 
      },
    });

    res.json({ success: true, data: students });
  } catch (error) {
    console.error("Subject students error:", error);
    res.status(500).json({ success: false, message: "Failed to load students" });
  }
});

/* ============================
   MARK ATTENDANCE (PROFESSOR+)
============================ */
router.post("/attendance", async (req, res) => {
  try {
    const { subjectId, date, records } = req.body;

    if (!subjectId || !date || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Authorization check
    if (req.faculty.level === "PROFESSOR" && subject.facultyId !== req.faculty.id) {
      return res.status(403).json({ success: false, message: "Unauthorized subject" });
    }

    // Process attendance records
    const attendancePromises = records.map(async (record) => {
      return prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: record.studentId,
            subjectId,
            date: new Date(date),
          },
        },
        update: { status: record.status },
        create: {
          studentId: record.studentId,
          subjectId,
          date: new Date(date),
          status: record.status,
        },
      });
    });

    await Promise.all(attendancePromises);

    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ success: false, message: "Failed to mark attendance" });
  }
});

/* ============================
   ENTER RESULTS (PROFESSOR+)
============================ */
router.post("/results", async (req, res) => {
  try {
    const { subjectId, studentId, marks, grade } = req.body;

    if (!subjectId || !studentId || marks === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Authorization check
    if (req.faculty.level === "PROFESSOR" && subject.facultyId !== req.faculty.id) {
      return res.status(403).json({ success: false, message: "Unauthorized subject" });
    }

    // Auto-calculate grade if not provided
    const finalGrade = grade || calculateGrade(marks);

    const result = await prisma.result.upsert({
      where: {
        studentId_subjectId: { studentId, subjectId },
      },
      update: { marks, grade: finalGrade },
      create: { 
        studentId, 
        subjectId, 
        marks, 
        grade: finalGrade 
      },
    });

    res.json({ success: true, data: result, message: "Result saved successfully" });
  } catch (error) {
    console.error("Enter result error:", error);
    res.status(500).json({ success: false, message: "Failed to save result" });
  }
});

/* ============================
   DEPARTMENT OVERVIEW (HOD+)
============================ */
router.get("/department-overview", 
  requireFacultyLevel(["HOD", "DEAN"]),
  async (req, res) => {
    try {
      const students = await prisma.student.findMany({
        where: {
          course: {
            department: req.faculty.department,
          },
        },
        include: { 
          user: { select: { name: true, email: true } },
          course: true 
        },
      });

      // Get attendance summary
      const attendanceSummary = await prisma.attendance.groupBy({
        by: ['studentId'],
        where: {
          student: {
            course: {
              department: req.faculty.department,
            },
          },
        },
        _count: {
          status: true,
        },
        _sum: {
          status: true, // This counts true as 1, false as 0
        },
      });

      const studentsWithStats = students.map(student => {
        const stats = attendanceSummary.find(s => s.studentId === student.id);
        const percentage = stats ? (stats._sum.status / stats._count.status * 100).toFixed(1) : 0;
        
        return {
          ...student,
          attendancePercentage: percentage,
        };
      });

      res.json({ success: true, data: studentsWithStats });
    } catch (error) {
      console.error("Department overview error:", error);
      res.status(500).json({ success: false, message: "Failed to load department overview" });
    }
  }
);

/* ============================
   UNIVERSITY OVERVIEW (DEAN)
============================ */
router.get("/university-overview", 
  requireFacultyLevel(["DEAN"]),
  async (req, res) => {
    try {
      const [students, faculty, courses, subjects] = await Promise.all([
        prisma.student.findMany({
          include: { 
            user: { select: { name: true, email: true } },
            course: true 
          },
        }),
        prisma.faculty.findMany({
          include: { 
            user: { select: { name: true, email: true } }
          },
        }),
        prisma.course.findMany(),
        prisma.subject.findMany({
          include: {
            faculty: {
              include: { user: true }
            }
          }
        }),
      ]);

      // Calculate statistics
      const totalStudents = students.length;
      const totalFaculty = faculty.length;
      const totalCourses = courses.length;
      const totalSubjects = subjects.length;

      // Get attendance rate
      const attendanceStats = await prisma.attendance.aggregate({
        _count: true,
        _sum: { status: true },
      });

      const attendanceRate = attendanceStats._count > 0 
        ? (attendanceStats._sum.status / attendanceStats._count * 100).toFixed(1)
        : 0;

      res.json({
        success: true,
        data: {
          students,
          faculty,
          courses,
          subjects,
          statistics: {
            totalStudents,
            totalFaculty,
            totalCourses,
            totalSubjects,
            attendanceRate,
          },
        },
      });
    } catch (error) {
      console.error("University overview error:", error);
      res.status(500).json({ success: false, message: "Failed to load university overview" });
    }
  }
);

/* ============================
   GET ATTENDANCE FOR SUBJECT
============================ */
router.get("/subjects/:subjectId/attendance", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date } = req.query;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Authorization check
    if (req.faculty.level === "PROFESSOR" && subject.facultyId !== req.faculty.id) {
      return res.status(403).json({ success: false, message: "Unauthorized subject" });
    }

    const whereClause = { subjectId };
    if (date) {
      whereClause.date = new Date(date);
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: { select: { name: true } }
          }
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance" });
  }
});

// Helper function to calculate grade
function calculateGrade(marks) {
  if (marks >= 85) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 55) return "B";
  if (marks >= 40) return "C";
  return "F";
}

export default router;