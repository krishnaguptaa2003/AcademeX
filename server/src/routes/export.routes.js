// server\src\routes\export.routes.js
import express from "express";
import PDFDocument from "pdfkit";
import { createObjectCsvStringifier } from "csv-writer";
import prisma from "../prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(requireAuth, requireRole(["ADMIN"]));

/* ============================
   EXPORT FEES (CSV)
============================ */
router.get("/fees/csv", async (_, res) => {
  const fees = await prisma.feePayment.findMany({
    include: {
      student: {
        include: {
          user: true,
          course: true,
        },
      },
    },
  });

  const csv = createObjectCsvStringifier({
    header: [
      { id: "name", title: "Student Name" },
      { id: "course", title: "Course" },
      { id: "amount", title: "Amount" },
      { id: "status", title: "Status" },
      { id: "paidAt", title: "Paid At" },
    ],
  });

  const records = fees.map((f) => ({
    name: f.student.user.name,
    course: f.student.course.name,
    amount: f.amount,
    status: f.status,
    paidAt: f.paidAt || "N/A",
  }));

  res.header("Content-Type", "text/csv");
  res.attachment("fees-report.csv");
  res.send(csv.getHeaderString() + csv.stringifyRecords(records));
});

/* ============================
   EXPORT RESULTS (PDF)
============================ */
router.get("/results/pdf", async (_, res) => {
  const results = await prisma.result.findMany({
    include: {
      student: {
        include: {
          user: true,
          course: true,
        },
      },
      subject: true,
    },
  });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=results-report.pdf");

  doc.pipe(res);
  doc.fontSize(18).text("AcademeX – Results Report", { align: "center" });
  doc.moveDown();

  results.forEach((r) => {
    doc
      .fontSize(12)
      .text(
        `${r.student.user.name} | ${r.subject.name} | Marks: ${r.marks} | Grade: ${r.grade}`
      );
  });

  doc.end();
});

/* ============================
   EXPORT ATTENDANCE (CSV)
============================ */
router.get("/attendance/csv", async (_, res) => {
  const attendance = await prisma.attendance.findMany({
    include: {
      student: {
        include: {
          user: true,
        },
      },
      subject: true,
    },
  });

  const csv = createObjectCsvStringifier({
    header: [
      { id: "student", title: "Student" },
      { id: "subject", title: "Subject" },
      { id: "date", title: "Date" },
      { id: "status", title: "Status" },
    ],
  });

  const records = attendance.map((a) => ({
    student: a.student.user.name,
    subject: a.subject.name,
    date: a.date.toISOString().split("T")[0],
    status: a.status ? "Present" : "Absent",
  }));

  res.header("Content-Type", "text/csv");
  res.attachment("attendance-report.csv");
  res.send(csv.getHeaderString() + csv.stringifyRecords(records));
});

export default router;
