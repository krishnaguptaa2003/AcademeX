// server\src\routes\course.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireRole(["ADMIN"]));

/* ============================
   GET COURSES
============================ */
router.get("/", async (_, res) => {
  const courses = await prisma.course.findMany();
  res.json({ success: true, data: courses });
});

/* ============================
   CREATE COURSE
============================ */
router.post("/", async (req, res) => {
  const course = await prisma.course.create({
    data: req.body,
  });

  res.json({ success: true, course });
});

/* ============================
   UPDATE COURSE
============================ */
router.put("/:id", async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json({ success: true, course });
});

/* ============================
   DELETE COURSE
============================ */
router.delete("/:id", async (req, res) => {
  await prisma.course.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
