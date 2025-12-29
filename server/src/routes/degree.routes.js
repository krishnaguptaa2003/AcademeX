// server\src\routes\degree.routes.js
import express from "express";
import { prisma } from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const degree = await prisma.degree.create({ data: req.body });
  res.json(degree);
});

router.get("/", requireAuth, async (req, res) => {
  res.json(await prisma.degree.findMany());
});

export default router;
