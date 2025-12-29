// server\src\routes\faculty.routes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";


const prisma = new PrismaClient();
const router = express.Router();

/**
 * ===============================
 * FACULTY – MY SUBJECTS
 * ===============================
 */
router.get(
  "/my-subjects",
  requireAuth,
  requireFaculty,
  async (req, res) => {
    try {
      const facultyId = req.faculty.id;

      const subjects = await prisma.subject.findMany({
        where: { facultyId },
        include: {
          course: true,
        },
      });

      res.json({ success: true, data: subjects });
    } catch (err) {
      console.error("My subjects error:", err);
      res.status(500).json({ message: "Failed to load subjects" });
    }
  }
);

/**
 * ===============================
 * FACULTY – SUBJECT STUDENTS
 * (Attendance & Results)
 * ===============================
 */
router.get(
  "/subjects/:subjectId/students",
  requireAuth,
  requireFaculty,
  async (req, res) => {
    try {
      const { subjectId } = req.params;

      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: { course: true },
      });

      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      // PROFESSOR can only access own subject
      if (
        req.faculty.level === "PROFESSOR" &&
        subject.facultyId !== req.faculty.id
      ) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const students = await prisma.student.findMany({
        where: {
          courseId: subject.courseId,
          semester: subject.semester,
        },
        include: {
          user: true,
        },
      });

      res.json({ success: true, data: students });
    } catch (err) {
      console.error("Subject students error:", err);
      res.status(500).json({ message: "Failed to load students" });
    }
  }
);

/**
 * ===============================
 * FACULTY – DEPARTMENT OVERVIEW (HOD)
 * ===============================
 */
router.get(
  "/department-overview",
  requireAuth,
  requireFaculty,
  async (req, res) => {
    if (req.faculty.level !== "HOD" && req.faculty.level !== "DEAN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await prisma.student.findMany({
      where: {
        course: {
          department: req.faculty.department,
        },
      },
      include: {
        user: true,
        course: true,
      },
    });

    res.json({ success: true, data: students });
  }
);

/**
 * ===============================
 * FACULTY – UNIVERSITY OVERVIEW (DEAN)
 * ===============================
 */
router.get(
  "/university-overview",
  requireAuth,
  requireFaculty,
  async (req, res) => {
    if (req.faculty.level !== "DEAN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await prisma.student.findMany({
      include: {
        user: true,
        course: true,
      },
    });

    const faculty = await prisma.faculty.findMany();

    res.json({
      success: true,
      data: { students, faculty },
    });
  }
);

export default router;
