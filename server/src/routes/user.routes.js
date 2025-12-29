// server/src/routes/user.routes.js
import express from "express";
import prisma from "../prisma.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================
   GET ALL USERS (ADMIN ONLY)
============================ */
router.get("/", authMiddleware, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        student: {
          include: {
            course: true,
          },
        },
        faculty: {
          include: {
            subjects: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

/* ============================
   GET USER BY ID
============================ */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can view their own profile, admins can view any
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            course: true,
            attendances: {
              take: 10,
              orderBy: { date: "desc" },
              include: { subject: true },
            },
            results: {
              take: 10,
              orderBy: { createdAt: "desc" },
              include: { subject: true },
            },
          },
        },
        faculty: {
          include: {
            subjects: {
              include: {
                course: true,
                _count: {
                  select: { students: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

/* ============================
   UPDATE USER PROFILE
============================ */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, profilePic } = req.body;

    // Users can only update their own profile
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "Can only update your own profile",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        profilePic: profilePic || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePic: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

/* ============================
   DELETE USER (ADMIN ONLY)
============================ */
router.delete("/:id", authMiddleware, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});

/* ============================
   CHANGE PASSWORD
============================ */
router.post("/:id/change-password", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Users can only change their own password
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password (in production, use bcrypt)
    // For now, we'll assume a simple check - you should implement proper bcrypt comparison
    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    await prisma.user.update({
      where: { id },
      data: { password: newPassword }, // In production, hash this password
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
});

/* ============================
   GET USER STATISTICS (ADMIN)
============================ */
router.get("/stats/overview", authMiddleware, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      studentsCount,
      facultyCount,
      adminCount,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "FACULTY" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    res.json({
      success: true,
      data: {
        totals: {
          all: totalUsers,
          active: activeUsers,
          activePercentage,
          students: studentsCount,
          faculty: facultyCount,
          admins: adminCount,
        },
        recentUsers,
        distribution: {
          students: totalUsers > 0 ? Math.round((studentsCount / totalUsers) * 100) : 0,
          faculty: totalUsers > 0 ? Math.round((facultyCount / totalUsers) * 100) : 0,
          admins: totalUsers > 0 ? Math.round((adminCount / totalUsers) * 100) : 0,
        },
      },
    });
  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
    });
  }
});

export default router;