// server\src\routes\announcement.routes.js
import { Router } from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { title, body, audience } = req.body;
    const announcement = await prisma.announcement.create({
      data: { title, body, audience },
    });
    res.json(announcement);
  }
);
/*
|--------------------------------------------------------------------------
| CREATE ANNOUNCEMENT (ADMIN + FACULTY)
|--------------------------------------------------------------------------
*/
router.post("/", requireAuth, requireRole(["ADMIN", "FACULTY"]), async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required",
      });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        authorId: req.user.id,
      },
    });

    res.json({ success: true, data: announcement });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL ANNOUNCEMENTS (PUBLIC)
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const list = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: list });
  } catch (error) {
    console.error("GET announcements error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET SINGLE ANNOUNCEMENT
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({ success: true, data: announcement });
  } catch (error) {
    console.error("Get announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcement",
    });
  }
});

router.get("/", requireAuth, async (req, res) => {
  const data = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

export default router;
