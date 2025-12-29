// server\src\routes\student.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================
   STUDENT DASHBOARD
============================ */
router.get("/dashboard", requireAuth, async (req, res) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ message: "Access denied" });
  }

  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
    include: {
      course: true,
    },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const totalSubjects = await prisma.subject.count({
    where: { courseId: student.courseId },
  });

  const attendanceRecords = await prisma.attendance.findMany({
    where: { studentId: student.id },
  });

  const presentCount = attendanceRecords.filter(a => a.status).length;
  const attendancePercent = attendanceRecords.length
    ? Math.round((presentCount / attendanceRecords.length) * 100)
    : 0;

  const resultsCount = await prisma.result.count({
    where: { studentId: student.id },
  });

  const unpaidFees = await prisma.feePayment.count({
    where: {
      studentId: student.id,
      status: "UNPAID",
    },
  });

  res.json({
    success: true,
    data: {
      name: req.user.name,
      course: student.course.name,
      semester: student.semester,
      subjects: totalSubjects,
      attendancePercent,
      resultsPublished: resultsCount,
      pendingFees: unpaidFees,
    },
  });
});

/* ============================
   MY SUBJECTS
============================ */
router.get("/subjects", requireAuth, async (req, res) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ message: "Access denied" });
  }

  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
  });

  const subjects = await prisma.subject.findMany({
    where: {
      courseId: student.courseId,
      semester: student.semester,
    },
    include: {
      faculty: {
        include: { user: true },
      },
    },
  });

  res.json({ success: true, data: subjects });
});

/* ============================
   MY ATTENDANCE
============================ */
router.get("/attendance", requireAuth, async (req, res) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ message: "Access denied" });
  }

  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
  });

  const records = await prisma.attendance.findMany({
    where: { studentId: student.id },
    include: {
      subject: true,
    },
    orderBy: { date: "desc" },
  });

  res.json({ success: true, data: records });
});

/* ============================
   MY RESULTS
============================ */
router.get("/results", requireAuth, async (req, res) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ message: "Access denied" });
  }

  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
  });

  const results = await prisma.result.findMany({
    where: { studentId: student.id },
    include: {
      subject: true,
    },
  });

  res.json({ success: true, data: results });
});

/* ============================
   MY FEES
============================ */
router.get("/fees", requireAuth, async (req, res) => {
  if (req.user.role !== "STUDENT") {
    return res.status(403).json({ message: "Access denied" });
  }

  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
  });

  const fees = await prisma.feePayment.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: fees });
});

export default router;
