// server\src\routes\payment.routes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================
   RAZORPAY INSTANCE
============================ */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ============================
   CREATE ORDER (STUDENT)
============================ */
router.post("/create-order", requireAuth, async (req, res) => {
  const { feeId } = req.body;

  const fee = await prisma.feePayment.findUnique({
    where: { id: feeId },
    include: {
      student: {
        include: { user: true },
      },
    },
  });

  if (!fee || fee.status === "PAID") {
    return res.status(400).json({ message: "Invalid fee payment" });
  }

  const order = await razorpay.orders.create({
    amount: fee.amount * 100, // paise
    currency: "INR",
    receipt: `fee_${fee.id}`,
  });

  res.json({
    success: true,
    order,
    key: process.env.RAZORPAY_KEY_ID,
    student: fee.student.user.name,
  });
});

/* ============================
   VERIFY PAYMENT
============================ */
router.post("/verify", requireAuth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    feeId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  /* MARK FEE AS PAID */
  await prisma.feePayment.update({
    where: { id: feeId },
    data: {
      status: "PAID",
      paidAt: new Date(),
    },
  });

  res.json({
    success: true,
    message: "Payment verified & fee marked as PAID",
  });
});

export default router;
