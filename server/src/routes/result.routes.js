// server/src/routes/result.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================
   ADMIN RESULT OVERVIEW
============================ */
router.get(
  "/admin",
  requireAuth,
  requireRole(["ADMIN"]),
  async (_, res) => {
    const results = await prisma.result.findMany({
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        subject: true,
      },
    });

    res.json({
      success: true,
      data: results,
    });
  }
);

/* ============================
   FAILED STUDENTS REPORT
============================ */
router.get(
  "/admin/failures",
  requireAuth,
  requireRole(["ADMIN"]),
  async (_, res) => {
    const failed = await prisma.result.findMany({
      where: { marks: { lt: 40 } },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
            course: true,
          },
        },
        subject: true,
      },
    });

    res.json({
      success: true,
      data: failed,
    });
  }
);

export default router;
