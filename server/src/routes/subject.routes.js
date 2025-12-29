// server\src\routes\subject.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireRole(["ADMIN"]));

/* ============================
   GET SUBJECTS
============================ */
router.get("/", async (_, res) => {
  const subjects = await prisma.subject.findMany({
    include: {
      course: true,
      faculty: {
        include: { user: true },
      },
    },
  });

  res.json({ success: true, data: subjects });
});

/* ============================
   CREATE SUBJECT
============================ */
router.post("/", async (req, res) => {
  const { name, code, semester, courseId, facultyId } = req.body;

  const subject = await prisma.subject.create({
    data: {
      name,
      code,
      semester,
      courseId,
      facultyId: facultyId || null,
    },
  });

  res.json({ success: true, subject });
});

/* ============================
   UPDATE SUBJECT
============================ */
router.put("/:id", async (req, res) => {
  const { name, semester, facultyId } = req.body;

  const subject = await prisma.subject.update({
    where: { id: req.params.id },
    data: {
      name,
      semester,
      facultyId: facultyId || null,
    },
  });

  res.json({ success: true, subject });
});

/* ============================
   DELETE SUBJECT
============================ */
router.delete("/:id", async (req, res) => {
  await prisma.subject.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
