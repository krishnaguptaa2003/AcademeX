// server\prisma\seed.js
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AcademeX database...");

  // Clean database
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  /* ============================
     ADMIN
  ============================ */
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@academex.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "ADMIN",
    },
  });

  /* ============================
     COURSES
  ============================ */
  const btech = await prisma.course.create({
    data: {
      name: "B.Tech Computer Engineering",
      code: "BTCE",
      duration: 4,
    },
  });

  const bsc = await prisma.course.create({
    data: {
      name: "B.Sc Information Technology",
      code: "BSIT",
      duration: 3,
    },
  });

  /* ============================
     FACULTY
  ============================ */
  const facultyUser = await prisma.user.create({
    data: {
      email: "faculty@academex.com",
      password: await bcrypt.hash("faculty123", 10),
      name: "Dr. Jane Smith",
      role: "FACULTY",
    },
  });

  const faculty = await prisma.faculty.create({
    data: {
      userId: facultyUser.id,
      employeeId: "EMP001",
      department: "Computer Engineering",
      qualification: "Ph.D. in Computer Science",
      specialization: "Machine Learning",
      joiningDate: new Date("2020-01-15"),
    },
  });

  /* ============================
     SUBJECTS
  ============================ */
  const cs101 = await prisma.subject.create({
    data: {
      name: "Introduction to Programming",
      code: "CS101",
      credits: 4,
      semester: 1,
      courseId: btech.id,
      facultyId: faculty.id,
    },
  });

  /* ============================
     STUDENTS
  ============================ */
  const studentUser1 = await prisma.user.create({
    data: {
      name: "Rahul Mehta",
      email: "rahul@student.academex.com",
      password: await bcrypt.hash("Student@123", 10),
      role: "STUDENT",
    },
  });

  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      rollNo: "BTCE2024001",
      enrollmentNo: "ENR001",
      courseId: btech.id,
      semester: 1,
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      name: "Priya Verma",
      email: "priya@student.academex.com",
      password: await bcrypt.hash("Student@123", 10),
      role: "STUDENT",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: studentUser2.id,
      rollNo: "BSIT2024001",
      enrollmentNo: "ENR002",
      courseId: bsc.id,
      semester: 3,
    },
  });

  /* ============================
     FEE STRUCTURE
  ============================ */
  const feeStructure1 = await prisma.feeStructure.create({
    data: {
      name: "Semester 1 Fee",
      description: "B.Tech Semester 1 Complete Fee",
      amount: 60000,
      courseId: btech.id,
    },
  });

  const feeStructure2 = await prisma.feeStructure.create({
    data: {
      name: "Semester 3 Fee",
      description: "B.Sc Semester 3 Complete Fee",
      amount: 45000,
      courseId: bsc.id,
    },
  });

  /* ============================
     FEES (PAID & UNPAID)
  ============================ */
  await prisma.feePayment.create({
    data: {
      studentId: student1.id,
      feeStructureId: feeStructure1.id,
      amountPaid: feeStructure1.amount,
      paymentStatus: "PAID",
      paymentMethod: "Online",
      receiptNumber: "REC001",
    },
  });

  await prisma.feePayment.create({
    data: {
      studentId: student2.id,
      feeStructureId: feeStructure2.id,
      amountPaid: 0,
      paymentStatus: "PENDING",
    },
  });

  /* ============================
     ANNOUNCEMENTS
  ============================ */
  await prisma.announcement.create({
    data: {
      title: "Fee Payment Notice",
      content: "Please clear pending semester fees before due date.",
      category: "Academic",
      authorId: admin.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Welcome to New Academic Year",
      content: "Welcome all students to the new academic year 2024-25.",
      category: "General",
      authorId: facultyUser.id,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });