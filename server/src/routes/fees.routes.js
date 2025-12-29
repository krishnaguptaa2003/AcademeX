// server\src\routes\fees.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import fs from "fs";
import path from "path";

const router = express.Router();

/* ============================
   RAZORPAY INSTANCE
============================ */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_put_your_key_here",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_test_secret_key_here",
});

/* ============================
   VALIDATION SCHEMAS
============================ */
const FeePaymentSchema = z.object({
  studentId: z.string().cuid(),
  feeStructureId: z.string().cuid(),
  amount: z.number().positive(),
  paymentMethod: z.enum(["ONLINE", "CASH", "CHEQUE", "BANK_TRANSFER", "UPI"]).optional(),
  semester: z.number().int().min(1).max(8).optional(),
  dueDate: z.string().datetime().optional(),
});

const RazorpayWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
        order_id: z.string(),
        method: z.string(),
        created_at: z.number(),
        captured: z.boolean(),
        email: z.string().optional(),
        contact: z.string().optional(),
      })
    })
  })
});

/* ============================
   GET ALL FEE PAYMENTS (with filters)
============================ */
router.get("/", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { 
      status, 
      courseId, 
      startDate, 
      endDate,
      search,
      studentId,
      paymentMethod
    } = req.query;

    const whereClause = {};

    if (status && status !== 'All Statuses') {
      whereClause.paymentStatus = status;
    }

    if (studentId) {
      whereClause.studentId = studentId;
    } else if (courseId) {
      whereClause.student = { courseId };
    }

    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    if (startDate && endDate) {
      whereClause.paymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (search) {
      whereClause.OR = [
        {
          student: {
            user: {
              name: { contains: search, mode: 'insensitive' }
            }
          }
        },
        {
          student: {
            enrollmentNo: { contains: search, mode: 'insensitive' }
          }
        },
        {
          receiptNumber: { contains: search, mode: 'insensitive' }
        },
        {
          razorpayOrderId: { contains: search, mode: 'insensitive' }
        }
      ];
    }

    const payments = await prisma.feePayment.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        feeStructure: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate summary statistics
    const summary = {
      totalAmount: payments.reduce((sum, p) => sum + p.amountPaid, 0),
      paidAmount: payments
        .filter(p => p.paymentStatus === "PAID")
        .reduce((sum, p) => sum + p.amountPaid, 0),
      pendingAmount: payments
        .filter(p => p.paymentStatus === "PENDING")
        .reduce((sum, p) => sum + p.amountPaid, 0),
      failedAmount: payments
        .filter(p => p.paymentStatus === "FAILED")
        .reduce((sum, p) => sum + p.amountPaid, 0),
      totalPayments: payments.length,
    };

    res.json({ 
      success: true, 
      data: payments,
      summary
    });
  } catch (error) {
    console.error("Get fee payments error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch fee payments" 
    });
  }
});

/* ============================
   CREATE RAZORPAY ORDER (STUDENT/FACULTY/ADMIN)
============================ */
router.post("/create-order", requireAuth, async (req, res) => {
  try {
    const { feePaymentId } = req.body;

    if (!feePaymentId) {
      return res.status(400).json({
        success: false,
        message: "Fee payment ID is required"
      });
    }

    // Get fee payment details
    const feePayment = await prisma.feePayment.findUnique({
      where: { id: feePaymentId },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        feeStructure: true,
      },
    });

    if (!feePayment) {
      return res.status(404).json({
        success: false,
        message: "Fee payment not found"
      });
    }

    // Check if already paid
    if (feePayment.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Fee already paid"
      });
    }

    // Check authorization
    if (req.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.id }
      });
      if (feePayment.studentId !== student?.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to pay this fee"
        });
      }
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(feePayment.amountPaid * 100), // Convert to paise
      currency: "INR",
      receipt: `FEE_${feePayment.id}_${Date.now()}`,
      notes: {
        feePaymentId: feePayment.id,
        studentId: feePayment.studentId,
        studentName: feePayment.student.user.name,
        feeStructure: feePayment.feeStructure.name,
        enrollmentNo: feePayment.student.enrollmentNo,
      },
      payment_capture: 1, // Auto-capture payment
    });

    // Update fee payment with order ID
    await prisma.feePayment.update({
      where: { id: feePaymentId },
      data: {
        razorpayOrderId: order.id,
        paymentStatus: "PENDING",
      },
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID || razorpay.key_id,
        student: feePayment.student.user.name,
        feeStructure: feePayment.feeStructure.name,
        receiptNumber: feePayment.receiptNumber,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message
    });
  }
});

/* ============================
   VERIFY RAZORPAY PAYMENT (FRONTEND CALLBACK)
============================ */
router.post("/verify-payment", requireAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      feePaymentId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details"
      });
    }

    // Get fee payment
    const feePayment = await prisma.feePayment.findUnique({
      where: { id: feePaymentId || undefined },
      include: { student: { include: { user: true } } },
    });

    if (!feePayment) {
      return res.status(404).json({
        success: false,
        message: "Fee payment not found"
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || razorpay.key_secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark as failed if signature doesn't match
      await prisma.feePayment.update({
        where: { id: feePayment.id },
        data: {
          paymentStatus: "FAILED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Update fee payment as PAID
    const updatedPayment = await prisma.feePayment.update({
      where: { id: feePayment.id },
      data: {
        paymentStatus: "PAID",
        paymentDate: new Date(),
        paymentMethod: "ONLINE",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        transactionId: razorpay_payment_id,
      },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        feeStructure: true,
      },
    });

    // Generate receipt number if not exists
    if (!updatedPayment.receiptNumber) {
      const receiptNumber = `REC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
      await prisma.feePayment.update({
        where: { id: updatedPayment.id },
        data: { receiptNumber },
      });
      updatedPayment.receiptNumber = receiptNumber;
    }

    res.json({
      success: true,
      message: "Payment verified and fee marked as PAID",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message
    });
  }
});

/* ============================
   RAZORPAY WEBHOOK (SERVER-TO-SERVER)
============================ */
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    
    if (!webhookSignature) {
      return res.status(400).json({ success: false, message: "No signature" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || razorpay.key_secret)
      .update(req.body)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error("Webhook signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const webhookData = JSON.parse(req.body.toString());
    const validatedData = RazorpayWebhookSchema.parse(webhookData);
    
    const { event, payload } = validatedData;
    const payment = payload.payment.entity;

    // Find fee payment by razorpay order ID
    const feePayment = await prisma.feePayment.findFirst({
      where: { razorpayOrderId: payment.order_id },
      include: { student: { include: { user: true } } },
    });

    if (!feePayment) {
      console.error(`Fee payment not found for order: ${payment.order_id}`);
      return res.status(404).json({ success: false, message: "Fee payment not found" });
    }

    // Handle different payment events
    switch (event) {
      case 'payment.captured':
        await prisma.feePayment.update({
          where: { id: feePayment.id },
          data: {
            paymentStatus: "PAID",
            paymentDate: new Date(payment.created_at * 1000),
            paymentMethod: payment.method.toUpperCase(),
            razorpayPaymentId: payment.id,
            transactionId: payment.id,
          },
        });
        
        // Generate receipt if not exists
        if (!feePayment.receiptNumber) {
          const receiptNumber = `REC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
          await prisma.feePayment.update({
            where: { id: feePayment.id },
            data: { receiptNumber },
          });
        }
        break;

      case 'payment.failed':
        await prisma.feePayment.update({
          where: { id: feePayment.id },
          data: {
            paymentStatus: "FAILED",
            razorpayPaymentId: payment.id,
          },
        });
        break;

      case 'payment.refunded':
        await prisma.feePayment.update({
          where: { id: feePayment.id },
          data: {
            paymentStatus: "REFUNDED",
          },
        });
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
});

/* ============================
   CREATE FEE PAYMENT (ADMIN)
============================ */
router.post("/", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const validatedData = FeePaymentSchema.parse(req.body);
    const { studentId, feeStructureId, amount, paymentMethod, semester, dueDate } = validatedData;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { course: true },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Check if fee structure exists
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found"
      });
    }

    // Generate receipt number
    const receiptNumber = `REC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Create fee payment
    const feePayment = await prisma.feePayment.create({
      data: {
        studentId,
        feeStructureId,
        amountPaid: amount,
        paymentMethod: paymentMethod || (paymentMethod === "ONLINE" ? "ONLINE" : "CASH"),
        paymentStatus: paymentMethod === "ONLINE" ? "PENDING" : 
                      paymentMethod === "PENDING" ? "PENDING" : "PAID",
        paymentDate: paymentMethod === "ONLINE" || paymentMethod === "PENDING" ? null : new Date(),
        receiptNumber,
        semester: semester || student.semester,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            course: true,
          },
        },
        feeStructure: true,
      },
    });

    res.json({
      success: true,
      message: "Fee payment created successfully",
      data: feePayment,
    });
  } catch (error) {
    console.error("Create fee payment error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create fee payment",
      error: error.message
    });
  }
});

/* ============================
   GENERATE RECEIPT (PDF)
============================ */
router.get("/:id/receipt", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
            course: true,
          },
        },
        feeStructure: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Fee payment not found"
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      info: {
        Title: 'Fee Payment Receipt',
        Author: 'AcademeX University',
        Subject: `Receipt for ${payment.student.user.name}`,
        Keywords: 'fee, payment, receipt, academic',
        Creator: 'AcademeX University Management System',
        CreationDate: new Date(),
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="receipt-${payment.receiptNumber || payment.id}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Header with logo and university info
    doc.fontSize(20).fillColor('#1E40AF').text('ACADEMEX UNIVERSITY', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#666666').text('Official Fee Receipt', { align: 'center' });
    doc.moveDown(1);
    
    // Receipt details header
    doc.fontSize(14).fillColor('#000000').text('FEE PAYMENT RECEIPT', { align: 'center', underline: true });
    doc.moveDown(1.5);

    const leftColumn = 50;
    const rightColumn = 300;
    let y = doc.y;

    // Receipt Number and Date
    doc.fontSize(11).fillColor('#000000');
    doc.text('Receipt Number:', leftColumn, y);
    doc.text(payment.receiptNumber || 'N/A', rightColumn, y);
    y += 20;
    
    doc.text('Receipt Date:', leftColumn, y);
    doc.text(new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }), rightColumn, y);
    y += 30;

    // Student Information
    doc.fontSize(12).text('Student Information:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    
    doc.text('Student Name:', leftColumn, y);
    doc.text(payment.student.user.name, rightColumn, y);
    y += 20;
    
    doc.text('Enrollment No:', leftColumn, y);
    doc.text(payment.student.enrollmentNo, rightColumn, y);
    y += 20;
    
    doc.text('Course:', leftColumn, y);
    doc.text(payment.student.course.name, rightColumn, y);
    y += 20;
    
    doc.text('Semester:', leftColumn, y);
    doc.text((payment.semester || payment.student.semester).toString(), rightColumn, y);
    y += 20;
    
    doc.text('Email:', leftColumn, y);
    doc.text(payment.student.user.email, rightColumn, y);
    y += 30;

    // Payment Details
    doc.fontSize(12).text('Payment Details:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    
    doc.text('Fee Structure:', leftColumn, y);
    doc.text(payment.feeStructure?.name || 'General Fee', rightColumn, y);
    y += 20;
    
    doc.text('Payment Method:', leftColumn, y);
    doc.text(payment.paymentMethod || 'N/A', rightColumn, y);
    y += 20;
    
    doc.text('Transaction ID:', leftColumn, y);
    doc.text(payment.transactionId || payment.razorpayPaymentId || 'N/A', rightColumn, y);
    y += 20;
    
    doc.text('Payment Status:', leftColumn, y);
    doc.text(payment.paymentStatus, rightColumn, y, { 
      fillColor: payment.paymentStatus === 'PAID' ? '#10B981' : 
                payment.paymentStatus === 'PENDING' ? '#F59E0B' : 
                '#EF4444' 
    });
    y += 30;

    // Amount Box
    doc.rect(50, y, 500, 70).stroke('#1E40AF');
    doc.fontSize(16).fillColor('#1E40AF').text('Amount Paid:', 60, y + 10);
    doc.fontSize(28).fillColor('#000000').text(`₹${payment.amountPaid.toFixed(2)}`, 60, y + 35);
    y += 90;

    // Payment Notes
    doc.fontSize(10).fillColor('#666666').text('Payment Notes:', { underline: true });
    doc.moveDown(0.3);
    doc.text('• This is a computer generated receipt.', 60, y);
    y += 15;
    doc.text('• Please retain this receipt for future reference.', 60, y);
    y += 15;
    doc.text('• For any queries, contact: accounts@academex.edu', 60, y);
    y += 30;

    // Footer with signatures
    doc.fontSize(10).fillColor('#000000');
    doc.text('_________________________', leftColumn, y);
    doc.text('Student Signature', leftColumn + 10, y + 15);
    
    doc.text('_________________________', 350, y);
    doc.text('Authorized Signature', 360, y + 15);
    
    // University Seal
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#999999').text('AcademeX University Management System v1.0', { align: 'center' });
    doc.text('Generated on: ' + new Date().toLocaleString('en-IN'), { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Generate receipt error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate receipt"
    });
  }
});

/* ============================
   GET PAYMENT STATUS
============================ */
router.get("/:id/status", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.feePayment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Fee payment not found"
      });
    }

    // If it's an online payment, check with Razorpay
    if (payment.paymentMethod === "ONLINE" && payment.razorpayOrderId) {
      try {
        const order = await razorpay.orders.fetch(payment.razorpayOrderId);
        
        res.json({
          success: true,
          data: {
            ...payment,
            razorpayOrderStatus: order.status,
            razorpayOrderAmount: order.amount / 100,
            razorpayOrderCurrency: order.currency,
          },
        });
      } catch (razorpayError) {
        console.error("Razorpay fetch error:", razorpayError);
        res.json({
          success: true,
          data: payment,
        });
      }
    } else {
      res.json({
        success: true,
        data: payment,
      });
    }
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status"
    });
  }
});

/* ============================
   REFUND PAYMENT (ADMIN)
============================ */
router.post("/:id/refund", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const payment = await prisma.feePayment.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Fee payment not found"
      });
    }

    if (payment.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Only paid payments can be refunded"
      });
    }

    // If it's a Razorpay payment, process refund through Razorpay
    if (payment.paymentMethod === "ONLINE" && payment.razorpayPaymentId) {
      try {
        const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
          amount: Math.round((amount || payment.amountPaid) * 100),
          speed: "normal",
          notes: {
            reason: reason || "Refund requested",
            feePaymentId: payment.id,
          },
        });

        // Update payment status
        await prisma.feePayment.update({
          where: { id },
          data: {
            paymentStatus: "REFUNDED",
          },
        });

        res.json({
          success: true,
          message: "Refund processed successfully",
          data: {
            refundId: refund.id,
            refundAmount: refund.amount / 100,
            status: refund.status,
            feePayment: payment,
          },
        });
      } catch (razorpayError) {
        console.error("Razorpay refund error:", razorpayError);
        throw new Error(`Razorpay refund failed: ${razorpayError.message}`);
      }
    } else {
      // For offline payments, just mark as refunded
      await prisma.feePayment.update({
        where: { id },
        data: {
          paymentStatus: "REFUNDED",
        },
      });

      res.json({
        success: true,
        message: "Payment marked as refunded",
        data: payment,
      });
    }
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message
    });
  }
});

/* ============================
   GET PAYMENT HISTORY FOR STUDENT
============================ */
router.get("/student/:studentId", requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, startDate, endDate } = req.query;

    // Authorization check
    if (req.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: req.user.id }
      });
      if (student?.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this student's payments"
        });
      }
    }

    const whereClause = { studentId };

    if (status && status !== 'All Statuses') {
      whereClause.paymentStatus = status;
    }

    if (startDate && endDate) {
      whereClause.paymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const payments = await prisma.feePayment.findMany({
      where: whereClause,
      include: {
        feeStructure: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const summary = {
      totalAmount: payments.reduce((sum, p) => sum + p.amountPaid, 0),
      paidAmount: payments
        .filter(p => p.paymentStatus === "PAID")
        .reduce((sum, p) => sum + p.amountPaid, 0),
      pendingAmount: payments
        .filter(p => p.paymentStatus === "PENDING")
        .reduce((sum, p) => sum + p.amountPaid, 0),
      refundedAmount: payments
        .filter(p => p.paymentStatus === "REFUNDED")
        .reduce((sum, p) => sum + p.amountPaid, 0),
      totalPayments: payments.length,
    };

    res.json({
      success: true,
      data: {
        payments,
        summary,
        studentId,
      },
    });
  } catch (error) {
    console.error("Get student payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student payments"
    });
  }
});

export default router;