// src\components\chat\Chat.jsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { 
  PaperAirplaneIcon,
  UserCircleIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  CreditCardIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

// Initialize socket connection
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4001", {
  withCredentials: true,
});

export default function Chat({ isFloating = false }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [context, setContext] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Join user room
    socket.emit("join-user", user.id);

    // Load user context for AI
    loadUserContext();

    // Listen for incoming messages
    socket.on("new-message", (msg) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: msg.content,
        sender: "system",
        timestamp: new Date(),
        type: "message"
      }]);
    });

    // Listen for AI responses
    socket.on("ai-response", (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(data.timestamp),
        type: "ai"
      }]);
      setAiThinking(false);
    });

    // Listen for notifications
    socket.on("notification", (notification) => {
      addToast(notification.message, "info");
    });

    // Listen for errors
    socket.on("error", (error) => {
      addToast(error.message, "error");
    });

    // Load initial messages
    loadInitialMessages();

    // Cleanup on unmount
    return () => {
      socket.off("new-message");
      socket.off("ai-response");
      socket.off("notification");
      socket.off("error");
    };
  }, [user]);

  const loadUserContext = async () => {
    try {
      // In a real implementation, fetch user context from API
      const userContext = {
        role: user.role,
        name: user.name,
        email: user.email,
        // Add more context based on role
        ...(user.role === "STUDENT" && {
          studentInfo: {
            course: "B.Tech Computer Engineering",
            semester: 4,
            cgpa: 8.7,
            attendance: 92,
            pendingFees: 0
          }
        }),
        ...(user.role === "FACULTY" && {
          facultyInfo: {
            department: "Computer Science",
            subjects: ["Data Structures", "Algorithms"],
            totalStudents: 45
          }
        })
      };
      
      setContext(userContext);
    } catch (error) {
      console.error("Failed to load user context:", error);
    }
  };

  const loadInitialMessages = () => {
    // Initial welcome message
    const welcomeMessage = getWelcomeMessage(user.role, context);
    setMessages([{
      id: 1,
      content: welcomeMessage,
      sender: "ai",
      timestamp: new Date(),
      type: "welcome"
    }]);
  };

  const getWelcomeMessage = (role, context) => {
    const roleMessages = {
      ADMIN: `Welcome, System Administrator! I'm your AI assistant for AcademeX. I can help you manage students, faculty, courses, and generate reports. How can I assist you today?`,
      FACULTY: `Hello Professor ${context?.name || ""}! I'm your teaching assistant. I can help you with attendance, grades, student queries, and course management. What would you like to know?`,
      STUDENT: `Hi ${context?.name || "Student"}! I'm your academic advisor. I can help you with your courses, grades, attendance, fees, and campus resources. How can I help you today?`
    };

    let message = roleMessages[role] || roleMessages.STUDENT;
    
    // Add personalized context
    if (context?.studentInfo) {
      message += `\n\nI see you're in ${context.studentInfo.course}, Semester ${context.studentInfo.semester} with ${context.studentInfo.attendance}% attendance.`;
    }
    
    if (context?.facultyInfo) {
      message += `\n\nYou're teaching ${context.facultyInfo.subjects.join(", ")} in the ${context.facultyInfo.department} department.`;
    }

    return message;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || aiThinking) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      type: "message"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAiThinking(true);

    try {
      // Send to AI via socket
      socket.emit("ai-chat", {
        userId: user.id,
        message: input,
        threadId: "main",
        context: context
      });
    } catch (error) {
      console.error("Error sending message:", error);
      addToast("Failed to send message", "error");
      setAiThinking(false);
    }
  };

  const getQuickQuestions = () => {
    const questions = {
      ADMIN: [
        "Show me student statistics",
        "Generate attendance report",
        "Add new faculty member",
        "Check fee collection status"
      ],
      FACULTY: [
        "Mark today's attendance",
        "Enter student grades",
        "View my class schedule",
        "Check student performance"
      ],
      STUDENT: [
        "Check my attendance",
        "View my grades",
        "Pay semester fees",
        "See upcoming exams"
      ]
    };

    return questions[user.role] || questions.STUDENT;
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    // Auto-submit after 100ms
    setTimeout(() => {
      if (!aiThinking) {
        const e = { preventDefault: () => {} };
        handleSend(e);
      }
    }, 100);
  };

  const getSenderIcon = (sender) => {
    switch (sender) {
      case "user":
        return <UserCircleIcon className="h-8 w-8 text-primary" />;
      case "ai":
        return <SparklesIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <InformationCircleIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getMessageColor = (sender) => {
    switch (sender) {
      case "user":
        return "bg-primary text-white";
      case "ai":
        return "bg-gray-100 text-gray-900";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className={`${isFloating ? 'h-full flex flex-col' : 'px-4 sm:px-6 lg:px-8 py-8'}`}>
      {!isFloating && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">AI Chat Assistant</h1>
          <p className="mt-1 text-sm text-gray-500">
            Context-aware assistant for {user?.role.toLowerCase()} queries
          </p>
        </div>
      )}

      <div className={`${isFloating ? 'flex-1 flex flex-col' : 'grid grid-cols-1 lg:grid-cols-4 gap-6'}`}>
        {/* Main Chat Area */}
        <div className={`${isFloating ? 'flex-1 flex flex-col' : 'lg:col-span-3'}`}>
          <div className={`${isFloating ? 'flex-1 flex flex-col border-0 rounded-none' : 'h-[600px] flex flex-col'}`}>
            {/* Messages Container */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isFloating ? 'max-h-[400px]' : ''}`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {getSenderIcon(msg.sender)}
                    </div>
                    
                    {/* Message */}
                    <div className={`mx-3 rounded-lg px-4 py-3 ${getMessageColor(msg.sender)}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-primary-100" : "text-gray-500"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {aiThinking && (
                <div className="flex justify-start">
                  <div className="flex">
                    <SparklesIcon className="h-8 w-8 text-purple-500" />
                    <div className="ml-3 rounded-lg bg-gray-100 px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary"
                  disabled={aiThinking}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || aiThinking}
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Hide in floating mode */}
        {!isFloating && (
          <div className="space-y-6">
            {/* User Context Card */}
            <Card>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <UserCircleIcon className="h-6 w-6 text-primary mr-2" />
                  <h3 className="font-semibold text-gray-900">Your Context</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Role: </span>
                    <span className="ml-1 font-medium capitalize">{user.role.toLowerCase()}</span>
                  </div>
                  
                  {context?.studentInfo && (
                    <>
                      <div className="flex items-center text-sm">
                        <ChartBarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">CGPA: </span>
                        <span className="ml-1 font-medium">{context.studentInfo.cgpa}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Attendance: </span>
                        <span className="ml-1 font-medium">{context.studentInfo.attendance}%</span>
                      </div>
                    </>
                  )}
                  
                  {context?.facultyInfo && (
                    <>
                      <div className="flex items-center text-sm">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Department: </span>
                        <span className="ml-1 font-medium">{context.facultyInfo.department}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UserCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Students: </span>
                        <span className="ml-1 font-medium">{context.facultyInfo.totalStudents}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Questions Card */}
            <Card>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">Quick Questions</h3>
                </div>
                
                <div className="space-y-2">
                  {getQuickQuestions().map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Help Card */}
            <Card>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">How to use</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Ask about your academic information</li>
                  <li>• Request reports and analytics</li>
                  <li>• Get help with system features</li>
                  <li>• Ask for guidance on procedures</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Questions for Floating Mode */}
        {isFloating && (
          <div className="mt-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2 text-purple-500" />
                Quick Questions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {getQuickQuestions().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left px-3 py-2 text-xs bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}