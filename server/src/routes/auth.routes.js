// server\src\routes\auth.routes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { authConfig } from "../config/auth.config.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================
   LOGIN
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        student: true,
        faculty: true 
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        email: user.email,
        name: user.name 
      },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiry }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Prepare user response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.student?.id || null,
      facultyId: user.faculty?.id || null,
      facultyLevel: user.faculty?.level || null,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token, // Also send token in response for localStorage
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

/* ============================
   CURRENT USER (/me)
============================ */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        student: true,
        faculty: true 
      },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.student?.id || null,
      facultyId: user.faculty?.id || null,
      facultyLevel: user.faculty?.level || null,
    };

    res.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

/* ============================
   LOGOUT
============================ */
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
});

/* ============================
   FORGOT PASSWORD
============================ */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal email existence
      return res.json({ 
        success: true, 
        message: "If email exists, OTP will be sent" 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + authConfig.otpExpiryMinutes);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    // In production, send email here
    console.log(`OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp, // Remove in production
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

/* ============================
   VERIFY OTP
============================ */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required" 
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP" 
      });
    }

    const record = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    res.json({ 
      success: true, 
      message: "OTP verified successfully" 
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

/* ============================
   RESET PASSWORD
============================ */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters" 
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid request" 
      });
    }

    const record = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and mark OTP as used
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

export default router;