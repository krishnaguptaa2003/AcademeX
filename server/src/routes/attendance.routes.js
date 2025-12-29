// server\src\routes\attendance.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { z } from "zod";

const router = express.Router();

// Zod validation schemas
const MarkAttendanceSchema = z.object({
  subjectId: z.string().cuid(),
  date: z.string().datetime(),
  records: z.array(z.object({
    studentId: z.string().cuid(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "HOLIDAY"]),
    remarks: z.string().optional()
  }))
});

/* ============================
   MARK ATTENDANCE (FACULTY/ADMIN)
============================ */
router.post("/mark", requireAuth, requireRole(["FACULTY", "ADMIN"]), async (req, res) => {
  try {
    // Validate request body
    const validatedData = MarkAttendanceSchema.parse(req.body);
    const { subjectId, date, records } = validatedData;

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { course: true }
    });

    if (!subject) {
      return res.status(404).json({ 
        success: false, 
        message: "Subject not found" 
      });
    }

    // Check if faculty owns this subject (unless admin)
    if (req.user.role === "FACULTY") {
      const faculty = await prisma.faculty.findUnique({
        where: { userId: req.user.id }
      });
      
      if (subject.facultyId !== faculty?.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Not authorized for this subject" 
        });
      }
    }

    // Process attendance records with upsert to prevent duplicates
    const attendancePromises = records.map(async (record) => {
      // Check if student exists and is in the same course/semester
      const student = await prisma.student.findUnique({
        where: { id: record.studentId },
        include: { course: true }
      });

      if (!student || student.courseId !== subject.courseId || student.semester !== subject.semester) {
        throw new Error(`Student ${record.studentId} not enrolled in subject ${subjectId}`);
      }

      // Use upsert with unique constraint (studentId, subjectId, date)
      return prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: record.studentId,
            subjectId: subjectId,
            date: new Date(date),
          },
        },
        update: { 
          status: record.status,
          remarks: record.remarks || null
        },
        create: {
          studentId: record.studentId,
          subjectId: subjectId,
          date: new Date(date),
          status: record.status,
          remarks: record.remarks || null,
        },
      });
    });

    const results = await Promise.allSettled(attendancePromises);
    
    // Check for any failures
    const failedRecords = results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason.message);

    if (failedRecords.length > 0) {
      console.warn("Some attendance records failed:", failedRecords);
    }

    res.json({ 
      success: true, 
      message: "Attendance marked successfully",
      failedRecords: failedRecords.length > 0 ? failedRecords : undefined
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation error",
        errors: error.errors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark attendance",
      error: error.message 
    });
  }
});

/* ============================
   GET ATTENDANCE BY SUBJECT (FACULTY/ADMIN)
============================ */
router.get("/subject/:subjectId", requireAuth, requireRole(["FACULTY", "ADMIN"]), async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date, startDate, endDate } = req.query;

    // Verify subject access for faculty
    if (req.user.role === "FACULTY") {
      const faculty = await prisma.faculty.findUnique({
        where: { userId: req.user.id }
      });
      
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      });
      
      if (subject?.facultyId !== faculty?.id) {
        return res.status(403).json({ 
          success: false, 
          message: "Not authorized for this subject" 
        });
      }
    }

    const whereClause = { subjectId };

    if (date) {
      whereClause.date = new Date(date);
    } else if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        subject: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch attendance" 
    });
  }
});

/* ============================
   GET STUDENT ATTENDANCE (STUDENT)
============================ */
router.get("/student/:studentId", requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, startDate, endDate } = req.query;

    // Authorization check - students can only view their own attendance
    if (req.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!student || student.id !== studentId) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
    }

    const whereClause = { studentId };
    
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        subject: true,
      },
      orderBy: { date: 'desc' },
    });

    // Calculate attendance statistics with ENUM status
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === "PRESENT").length;
    const absentClasses = attendance.filter(a => a.status === "ABSENT").length;
    const lateClasses = attendance.filter(a => a.status === "LATE").length;
    const holidayClasses = attendance.filter(a => a.status === "HOLIDAY").length;
    
    const percentage = totalClasses > 0 
      ? Math.round((presentClasses / totalClasses) * 100) 
      : 0;

    res.json({ 
      success: true, 
      data: {
        records: attendance,
        summary: {
          totalClasses,
          presentClasses,
          absentClasses,
          lateClasses,
          holidayClasses,
          percentage,
          status: percentage >= 75 ? "SATISFACTORY" : percentage >= 60 ? "WARNING" : "CRITICAL"
        },
      },
    });
  } catch (error) {
    console.error("Get student attendance error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch attendance" 
    });
  }
});

/* ============================
   GET ATTENDANCE REPORT (ADMIN)
============================ */
router.get("/report", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { courseId, subjectId, startDate, endDate, studentId } = req.query;

    const whereClause = {};

    if (studentId) {
      whereClause.studentId = studentId;
    } else if (subjectId) {
      whereClause.subjectId = subjectId;
    } else if (courseId) {
      whereClause.subject = { courseId };
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        subject: true,
      },
      orderBy: { date: 'desc' },
    });

    // Group by student and calculate statistics
    const studentStats = {};
    attendance.forEach(record => {
      const studentId = record.studentId;
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.student,
          totalClasses: 0,
          presentClasses: 0,
          absentClasses: 0,
          lateClasses: 0,
          holidayClasses: 0,
          records: [],
        };
      }
      
      studentStats[studentId].totalClasses++;
      studentStats[studentId][`${record.status.toLowerCase()}Classes`]++;
      studentStats[studentId].records.push(record);
    });

    // Calculate percentages and generate report
    const report = Object.values(studentStats).map(stat => {
      const percentage = stat.totalClasses > 0 
        ? Math.round((stat.presentClasses / stat.totalClasses) * 100) 
        : 0;
      
      return {
        student: stat.student,
        totalClasses: stat.totalClasses,
        presentClasses: stat.presentClasses,
        absentClasses: stat.absentClasses,
        lateClasses: stat.lateClasses,
        holidayClasses: stat.holidayClasses,
        percentage,
        status: percentage >= 75 ? "SATISFACTORY" : percentage >= 60 ? "WARNING" : "CRITICAL",
        trend: stat.records.length > 1 ? 
          (stat.records.slice(-5).filter(r => r.status === "PRESENT").length >= 4 ? "IMPROVING" : "DECLINING") 
          : "STABLE"
      };
    });

    res.json({ 
      success: true, 
      data: report,
      filters: { courseId, subjectId, startDate, endDate, studentId }
    });
  } catch (error) {
    console.error("Attendance report error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate report" 
    });
  }
});

/* ============================
   BULK ATTENDANCE UPDATE (ADMIN)
============================ */
router.put("/bulk", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ 
        success: false, 
        message: "Updates array required" 
      });
    }

    const updatePromises = updates.map(async (update) => {
      const { id, status, remarks } = update;
      
      return prisma.attendance.update({
        where: { id },
        data: { 
          status: status || undefined,
          remarks: remarks || undefined
        }
      });
    });

    await Promise.all(updatePromises);

    res.json({ 
      success: true, 
      message: "Attendance updated successfully" 
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update attendance" 
    });
  }
});

/* ============================
   ATTENDANCE STATISTICS DASHBOARD
============================ */
router.get("/statistics", requireAuth, async (req, res) => {
  try {
    let whereClause = {};

    // Role-based filtering
    if (req.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.id }
      });
      whereClause.studentId = student?.id;
    } else if (req.user.role === "FACULTY") {
      const faculty = await prisma.faculty.findUnique({
        where: { userId: req.user.id }
      });
      const subjects = await prisma.subject.findMany({
        where: { facultyId: faculty?.id },
        select: { id: true }
      });
      whereClause.subjectId = { in: subjects.map(s => s.id) };
    }

    // Get statistics grouped by status
    const stats = await prisma.attendance.groupBy({
      by: ['status'],
      where: whereClause,
      _count: true,
    });

    // Get daily trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrend = await prisma.attendance.groupBy({
      by: ['date'],
      where: {
        ...whereClause,
        date: { gte: thirtyDaysAgo }
      },
      _count: true,
    });

    // Get subject-wise statistics
    const subjectStats = await prisma.attendance.groupBy({
      by: ['subjectId', 'status'],
      where: whereClause,
      _count: true,
    });

    res.json({
      success: true,
      data: {
        summary: stats.reduce((acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        }, {}),
        dailyTrend: dailyTrend.sort((a, b) => a.date.getTime() - b.date.getTime()),
        subjectStats,
        totalRecords: stats.reduce((sum, curr) => sum + curr._count, 0)
      }
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch statistics" 
    });
  }
});

export default router;