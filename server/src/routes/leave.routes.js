// server/src/routes/leave.routes.js
import express from "express";
import { prisma } from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/leave-applications
router.get("/", requireAuth, async (req, res) => {
  try {
    const rows = await prisma.leaveApplication.findMany({
      include: { applicant: true },
      orderBy: { appliedOn: "desc" },
    });

    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        applicantId: r.applicantId,
        applicantName: r.applicant.name,
        leaveType: r.leaveType,
        reason: r.reason,
        dates: `${r.startDate.toISOString().slice(0, 10)} to ${r.endDate
          .toISOString()
          .slice(0, 10)}`,
        appliedOn: r.appliedOn.toISOString().slice(0, 10),
        status: r.status,
      })),
    });
  } catch (err) {
    console.error("GET /leave-applications error", err);
    res.status(500).json({ success: false });
  }
});

// POST /api/leave-applications/:id/decision (admin/faculty)
router.post(
  "/:id/decision",
  requireAuth,
  requireRole(["ADMIN", "FACULTY"]),
  async (req, res) => {
    const id = Number(req.params.id);
    const { decision } = req.body; // "APPROVED" or "REJECTED"

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid decision" });
    }

    try {
      const updated = await prisma.leaveApplication.update({
        where: { id },
        data: {
          status: decision,
          decidedById: req.user.id,
          decidedAt: new Date(),
        },
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      console.error("POST /leave-applications/:id/decision error", err);
      res.status(500).json({ success: false });
    }
  }
);

export default router;
