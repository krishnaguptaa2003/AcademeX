// server\src\routes\chat.routes.js
import express from "express";
import prisma from "../prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import OpenAI from "openai";
import { z } from "zod";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation schemas
const ChatMessageSchema = z.object({
  threadId: z.string().cuid().optional(),
  content: z.string().min(1).max(2000),
  participantIds: z.array(z.string().cuid()).optional(),
  title: z.string().max(100).optional(),
});

const ThreadQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(20),
  cursor: z.string().datetime().optional(),
});

/* ============================
   GET USER CONTEXT FOR RAG SYSTEM
============================ */
router.get("/context", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: {
          include: {
            course: true,
            results: {
              include: { subject: true },
              take: 10,
              orderBy: { createdAt: "desc" },
            },
            attendances: {
              include: { subject: true },
              where: {
                date: {
                  gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                },
              },
              take: 30,
              orderBy: { date: "desc" },
            },
            feePayments: {
              include: { feeStructure: true },
              where: {
                paymentStatus: "PENDING",
                dueDate: {
                  lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in next 7 days
                },
              },
              take: 5,
            },
            leaveApplications: {
              where: {
                status: "PENDING",
                endDate: { gte: new Date() },
              },
              take: 5,
            },
          },
        },
        faculty: {
          include: {
            subjects: {
              include: {
                course: true,
                attendances: {
                  where: {
                    date: {
                      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                  },
                  take: 10,
                },
                _count: {
                  select: { students: true },
                },
              },
              take: 10,
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

    // Construct RAG context
    const context = {
      role: user.role,
      name: user.name,
      email: user.email,
      timestamp: new Date().toISOString(),
      system: "AcademeX University Management System",
    };

    // Student context for RAG
    if (user.role === "STUDENT" && user.student) {
      const student = user.student;
      
      // Calculate attendance statistics
      const attendanceStats = student.attendances.reduce((acc, attendance) => {
        const subjectName = attendance.subject?.name || "Unknown";
        if (!acc[subjectName]) {
          acc[subjectName] = { present: 0, total: 0, percentage: 0 };
        }
        acc[subjectName].total++;
        if (attendance.status === "PRESENT") acc[subjectName].present++;
        acc[subjectName].percentage = acc[subjectName].total > 0 
          ? Math.round((acc[subjectName].present / acc[subjectName].total) * 100)
          : 0;
        return acc;
      }, {});

      // Calculate CGPA from results
      const results = student.results.map(r => ({
        subject: r.subject?.name,
        marks: r.marksObtained,
        total: r.totalMarks,
        grade: r.grade,
        percentage: (r.marksObtained / r.totalMarks) * 100,
      }));

      const cgpa = results.length > 0
        ? results.reduce((sum, r) => sum + (r.percentage / 10), 0) / results.length
        : 0;

      context.student = {
        id: student.id,
        enrollmentNo: student.enrollmentNo,
        rollNo: student.rollNo,
        course: {
          name: student.course?.name,
          code: student.course?.code,
          duration: student.course?.duration,
        },
        semester: student.semester,
        currentCGPA: student.currentCGPA || cgpa,
        attendance: attendanceStats,
        recentResults: results.slice(0, 5),
        pendingFees: student.feePayments.map(fp => ({
          feeName: fp.feeStructure?.name,
          amount: fp.amountPaid,
          dueDate: fp.dueDate,
          status: fp.paymentStatus,
        })),
        pendingLeaves: student.leaveApplications.map(la => ({
          reason: la.reason,
          startDate: la.startDate,
          endDate: la.endDate,
          status: la.status,
        })),
        academicStanding: student.currentCGPA >= 7.0 ? "Good" : "Needs Improvement",
        attendanceWarning: Object.values(attendanceStats).some(s => s.percentage < 75)
          ? "Low attendance in some subjects"
          : "Attendance satisfactory",
      };
    }

    // Faculty context for RAG
    if (user.role === "FACULTY" && user.faculty) {
      const faculty = user.faculty;
      
      // Calculate subject statistics
      const subjectStats = faculty.subjects.map(subject => {
        const attendanceRate = subject.attendances.length > 0
          ? (subject.attendances.filter(a => a.status === "PRESENT").length / subject.attendances.length) * 100
          : 0;

        return {
          name: subject.name,
          code: subject.code,
          course: subject.course?.name,
          semester: subject.semester,
          studentCount: subject._count?.students || 0,
          recentAttendance: attendanceRate,
          attendanceHealth: attendanceRate >= 75 ? "Good" : "Needs Attention",
        };
      });

      context.faculty = {
        id: faculty.id,
        employeeId: faculty.employeeId,
        department: faculty.department,
        qualification: faculty.qualification,
        specialization: faculty.specialization,
        level: faculty.level,
        joiningDate: faculty.joiningDate,
        subjects: subjectStats,
        totalStudents: subjectStats.reduce((sum, s) => sum + s.studentCount, 0),
        averageAttendance: subjectStats.length > 0
          ? subjectStats.reduce((sum, s) => sum + s.recentAttendance, 0) / subjectStats.length
          : 0,
      };
    }

    res.json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error("Get user context error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user context",
      error: error.message,
    });
  }
});

/* ============================
   AI-ENHANCED CHAT COMPLETION WITH RAG
============================ */
router.post("/completion", requireAuth, async (req, res) => {
  try {
    const { message, threadId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Get user context for RAG
    const contextResponse = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: {
          include: {
            course: true,
            results: {
              include: { subject: true },
              take: 5,
            },
            attendances: {
              include: { subject: true },
              take: 10,
            },
          },
        },
        faculty: {
          include: {
            subjects: {
              include: { course: true },
              take: 5,
            },
          },
        },
      },
    });

    // Construct system prompt with RAG context
    let systemPrompt = `You are AcademeX AI Assistant, a helpful AI for AcademeX University Management System.`;

    if (contextResponse) {
      if (contextResponse.role === "STUDENT" && contextResponse.student) {
        const student = contextResponse.student;
        systemPrompt += `\n\nSTUDENT CONTEXT:
- Name: ${contextResponse.name}
- Enrollment: ${student.enrollmentNo}
- Course: ${student.course?.name} (Semester ${student.semester})
- Current CGPA: ${student.currentCGPA || "Not calculated"}
- Recent attendance available for: ${student.attendances.length} subjects`;

        if (student.results.length > 0) {
          systemPrompt += `\n- Recent results: ${student.results.map(r => 
            `${r.subject?.name}: ${r.marksObtained}/${r.totalMarks}`
          ).join(", ")}`;
        }
      } else if (contextResponse.role === "FACULTY" && contextResponse.faculty) {
        const faculty = contextResponse.faculty;
        systemPrompt += `\n\nFACULTY CONTEXT:
- Name: ${contextResponse.name}
- Department: ${faculty.department || "Not specified"}
- Level: ${faculty.level || "Professor"}
- Subjects: ${faculty.subjects.map(s => s.name).join(", ")}`;
      } else if (contextResponse.role === "ADMIN") {
        systemPrompt += `\n\nADMIN CONTEXT:
- You are assisting a system administrator with full system access.`;
      }
    }

    systemPrompt += `\n\nINSTRUCTIONS:
1. Provide accurate, helpful information based on the user's role and context
2. For academic queries, reference available data in context
3. For administrative queries, guide to appropriate system sections
4. Be concise but thorough
5. If you don't know something, say so and suggest contacting support
6. Never share sensitive personal information
7. Format responses clearly with markdown when helpful`;

    // Get or create thread
    let thread;
    if (threadId) {
      thread = await prisma.chatThread.findUnique({
        where: { id: threadId },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, role: true },
              },
            },
          },
          messages: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
              sender: {
                select: { id: true, name: true, role: true },
              },
            },
          },
        },
      });

      if (!thread) {
        return res.status(404).json({
          success: false,
          message: "Chat thread not found",
        });
      }
    } else {
      thread = await prisma.chatThread.create({
        data: {
          title: `Chat with ${contextResponse?.name || "User"}`,
          participants: {
            create: [{ userId: req.user.id }],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, role: true },
              },
            },
          },
        },
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        threadId: thread.id,
        content: message,
        senderId: req.user.id,
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Update thread timestamp
    await prisma.chatThread.update({
      where: { id: thread.id },
      data: { updatedAt: new Date() },
    });

    // Get conversation history for context
    const history = await prisma.message.findMany({
      where: { threadId: thread.id },
      orderBy: { createdAt: "asc" },
      take: 20,
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Format history for AI
    const formattedHistory = history.map(msg => ({
      role: msg.senderId === req.user.id ? "user" : "assistant",
      content: msg.content,
      name: msg.sender.name,
    }));

    // Call OpenAI with RAG context
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";

    // Save AI response
    const assistantMessage = await prisma.message.create({
      data: {
        threadId: thread.id,
        content: aiResponse,
        senderId: req.user.id, // In production, use a system user ID
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Update thread with AI response
    await prisma.chatThread.update({
      where: { id: thread.id },
      data: { 
        updatedAt: new Date(),
        title: thread.title || `Chat: ${message.substring(0, 50)}...`,
      },
    });

    res.json({
      success: true,
      data: {
        threadId: thread.id,
        message: assistantMessage,
        response: aiResponse,
        context: {
          role: contextResponse?.role,
          hasStudentData: !!contextResponse?.student,
          hasFacultyData: !!contextResponse?.faculty,
        },
      },
    });
  } catch (error) {
    console.error("AI completion error:", error);
    
    // Fallback response if AI fails
    const fallbackResponse = "I'm currently experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.";

    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error: error.message,
      fallback: fallbackResponse,
    });
  }
});

/* ============================
   GET CHAT THREADS WITH AI SUMMARY
============================ */
router.get("/threads", requireAuth, async (req, res) => {
  try {
    const { limit = 20, cursor } = ThreadQuerySchema.parse(req.query);

    const threads = await prisma.chatThread.findMany({
      where: {
        participants: {
          some: { userId: req.user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasMore = threads.length > limit;
    const items = hasMore ? threads.slice(0, -1) : threads;

    // Add AI-generated summaries for threads without titles
    const enhancedThreads = await Promise.all(
      items.map(async (thread) => {
        if (!thread.title && thread.messages.length > 0) {
          try {
            const firstMessage = thread.messages[0].content;
            const summary = firstMessage.length > 50 
              ? firstMessage.substring(0, 50) + "..."
              : firstMessage;
            
            await prisma.chatThread.update({
              where: { id: thread.id },
              data: { title: summary },
            });
            
            thread.title = summary;
          } catch (error) {
            console.error("Failed to generate thread title:", error);
          }
        }
        return thread;
      })
    );

    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    res.json({
      success: true,
      data: enhancedThreads,
      pagination: {
        hasMore,
        nextCursor,
        total: enhancedThreads.length,
      },
    });
  } catch (error) {
    console.error("Get chat threads error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat threads",
    });
  }
});

/* ============================
   GET THREAD MESSAGES WITH AI ENHANCEMENT
============================ */
router.get("/threads/:threadId/messages", requireAuth, async (req, res) => {
  try {
    const { threadId } = req.params;
    const { limit = 50, cursor } = req.query;

    // Verify user access
    const participant = await prisma.chatThreadParticipant.findFirst({
      where: {
        threadId,
        userId: req.user.id,
      },
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        threadId,
        ...(cursor && {
          createdAt: {
            lt: new Date(cursor),
          },
        }),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
    });

    const nextCursor = messages.length > 0 
      ? messages[messages.length - 1].createdAt.toISOString()
      : null;

    // Reverse to chronological order
    const orderedMessages = messages.reverse();

    res.json({
      success: true,
      data: orderedMessages,
      pagination: {
        nextCursor,
        hasMore: !!nextCursor,
        total: orderedMessages.length,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

/* ============================
   CREATE NEW CHAT THREAD WITH AI CONTEXT
============================ */
router.post("/threads", requireAuth, async (req, res) => {
  try {
    const validatedData = ChatMessageSchema.parse(req.body);
    const { title, participantIds } = validatedData;

    // Create thread with current user as first participant
    const thread = await prisma.chatThread.create({
      data: {
        title: title || `Chat with ${req.user.name}`,
        participants: {
          create: [
            { userId: req.user.id },
            ...(participantIds || []).map(id => ({ userId: id })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: { participants: true },
        },
      },
    });

    // Send welcome message with AI context
    const context = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true, name: true },
    });

    let welcomeMessage = `Hello ${context?.name || "there"}! I'm your AcademeX AI Assistant. `;
    
    switch (context?.role) {
      case "STUDENT":
        welcomeMessage += "I can help you with your course information, attendance, results, and fee payments. What would you like to know?";
        break;
      case "FACULTY":
        welcomeMessage += "I can assist you with student management, attendance tracking, result entry, and subject information. How can I help?";
        break;
      case "ADMIN":
        welcomeMessage += "I can help you manage the entire AcademeX system, including students, faculty, courses, and system administration. What do you need?";
        break;
      default:
        welcomeMessage += "How can I assist you today?";
    }

    await prisma.message.create({
      data: {
        threadId: thread.id,
        content: welcomeMessage,
        senderId: req.user.id,
      },
    });

    res.json({
      success: true,
      data: thread,
      welcomeMessage,
    });
  } catch (error) {
    console.error("Create thread error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create chat thread",
    });
  }
});

/* ============================
   SEND MESSAGE WITH AI PROCESSING
============================ */
router.post("/threads/:threadId/messages", requireAuth, async (req, res) => {
  try {
    const { threadId } = req.params;
    const validatedData = ChatMessageSchema.parse(req.body);
    const { content } = validatedData;

    // Verify user access
    const participant = await prisma.chatThreadParticipant.findFirst({
      where: {
        threadId,
        userId: req.user.id,
      },
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Create user message
    const message = await prisma.message.create({
      data: {
        threadId,
        content,
        senderId: req.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Update thread timestamp
    await prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    // Check if message needs AI processing
    const aiKeywords = ["help", "assist", "how", "what", "when", "where", "why", "explain", "guide"];
    const needsAI = aiKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );

    let aiResponse = null;
    if (needsAI) {
      try {
        // Get context for AI
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          include: {
            student: { select: { id: true } },
            faculty: { select: { id: true } },
          },
        });

        const aiCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are AcademeX Assistant. User role: ${user?.role}. Respond helpfully.`,
            },
            { role: "user", content },
          ],
          max_tokens: 500,
        });

        aiResponse = aiCompletion.choices[0]?.message?.content;

        if (aiResponse) {
          await prisma.message.create({
            data: {
              threadId,
              content: aiResponse,
              senderId: req.user.id, // In production, use system user
            },
          });
        }
      } catch (aiError) {
        console.error("AI processing error:", aiError);
        // Continue without AI response
      }
    }

    res.json({
      success: true,
      data: {
        message,
        aiResponse,
        needsAI,
        processed: true,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

/* ============================
   DELETE THREAD
============================ */
router.delete("/threads/:threadId", requireAuth, async (req, res) => {
  try {
    const { threadId } = req.params;

    // Verify ownership
    const participant = await prisma.chatThreadParticipant.findFirst({
      where: {
        threadId,
        userId: req.user.id,
      },
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Delete thread (cascade delete messages and participants)
    await prisma.chatThread.delete({
      where: { id: threadId },
    });

    res.json({
      success: true,
      message: "Chat thread deleted successfully",
    });
  } catch (error) {
    console.error("Delete thread error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete thread",
    });
  }
});

/* ============================
   GET AI CAPABILITIES BASED ON USER ROLE
============================ */
router.get("/capabilities", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: { select: { id: true } },
        faculty: { select: { id: true } },
      },
    });

    const capabilities = {
      student: [
        "Check attendance",
        "View results",
        "Check fee status",
        "Course information",
        "Leave application status",
        "Academic calendar",
        "Exam schedule",
        "Library access",
        "Campus resources",
      ],
      faculty: [
        "Mark attendance",
        "Enter results",
        "View student profiles",
        "Course management",
        "Leave approval",
        "Department overview",
        "Teaching schedule",
        "Student performance analytics",
      ],
      admin: [
        "System administration",
        "User management",
        "Course management",
        "Fee management",
        "Report generation",
        "System analytics",
        "Configuration",
        "Backup management",
      ],
    };

    const userCapabilities = capabilities[user?.role?.toLowerCase()] || [];

    res.json({
      success: true,
      data: {
        role: user?.role,
        capabilities: userCapabilities,
        aiEnabled: true,
        ragEnabled: true,
        contextAware: true,
      },
    });
  } catch (error) {
    console.error("Get capabilities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get AI capabilities",
    });
  }
});

export default router;
