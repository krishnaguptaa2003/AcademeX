// src/routes/assignments.routes.js
// server/src/routes/assignment.routes.js
import express from "express";
import prisma from "../prisma.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";
import { z } from "zod";

const router = express.Router();

const AssignmentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  courseId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
});

/* ============================
   GET ASSIGNMENTS
============================ */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        course: true,
        subject: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
    });
  }
});

/* ============================
   CREATE ASSIGNMENT (FACULTY/ADMIN)
============================ */
router.post("/", authMiddleware, requireRole(["FACULTY", "ADMIN"]), async (req, res) => {
  try {
    const validatedData = AssignmentSchema.parse(req.body);
    
    const assignment = await prisma.assignment.create({
      data: {
        ...validatedData,
        dueDate: new Date(validatedData.dueDate),
        createdById: req.user.id,
      },
      include: {
        course: true,
        subject: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
    });
  }
});

/* ============================
   UPDATE ASSIGNMENT (OWNER/ADMIN)
============================ */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = AssignmentSchema.partial().parse(req.body);

    // Check if assignment exists and user has permission
    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only owner or admin can update
    if (assignment.createdById !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this assignment",
      });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        ...validatedData,
        ...(validatedData.dueDate && { dueDate: new Date(validatedData.dueDate) }),
      },
      include: {
        course: true,
        subject: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update assignment",
    });
  }
});

/* ============================
   DELETE ASSIGNMENT (OWNER/ADMIN)
============================ */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if assignment exists and user has permission
    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only owner or admin can delete
    if (assignment.createdById !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this assignment",
      });
    }

    await prisma.assignment.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete assignment",
    });
  }
});

export default router;