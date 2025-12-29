// server\src\middleware\auth.middleware.js
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

export const authConfig = {
  jwtSecret:
    process.env.JWT_SECRET ||
    "academex-super-secret-key-change-in-production",
  cookieName: "token",
  tokenExpiry: "24h",
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch {
    return null;
  }
};

/**
 * Core authentication middleware
 * (this is the REAL implementation)
 */
export const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies?.[authConfig.cookieName] ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        student: {
          include: {
            course: true,
            attendances: { take: 10, include: { subject: true } },
            results: { take: 10, include: { subject: true } },
          },
        },
        faculty: {
          include: {
            subjects: { include: { course: true } },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account not found or inactive",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profilePic: user.profilePic,
      phone: user.phone,
      studentId: user.student?.id,
      facultyId: user.faculty?.id,
      facultyLevel: user.faculty?.level,
      studentData: user.student,
      facultyData: user.faculty,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ✅ ALIAS (CRITICAL FIX)
 * This makes `requireAuth` available everywhere
 * WITHOUT breaking existing code
 */
export const requireAuth = authMiddleware;

/**
 * Role-based access control
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
