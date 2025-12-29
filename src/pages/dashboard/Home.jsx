// src/pages/dashboard/Home.jsx (UPDATED - Universal Dashboard with Role Hierarchy)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  BellIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  ChartPieIcon,
  BanknotesIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  UsersIcon,
  BuildingLibraryIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  DocumentCheckIcon,
  AcademicCapIcon as AcademicCapSolid,
} from "@heroicons/react/24/outline";
import {
  SparklesIcon as SparklesSolid,
} from "@heroicons/react/24/solid";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { fetchAnnouncements } from "../../api/announcements";
import { useToast } from "../../contexts/ToastContext";

function Home() {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Get user role and faculty level
  const role = user?.role ?? "STUDENT";
  const facultyLevel = user?.facultyLevel || "PROFESSOR";

  const isAdmin = role === "ADMIN";
  const isFaculty = role === "FACULTY";
  const isStudent = role === "STUDENT";

  // Faculty hierarchy checks
  const isProfessor = isFaculty && facultyLevel === "PROFESSOR";
  const isHOD = isFaculty && facultyLevel === "HOD";
  const isDean = isFaculty && facultyLevel === "DEAN";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState("");

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting("Good morning");
    else if (hour < 18) setTimeGreeting("Good afternoon");
    else setTimeGreeting("Good evening");
  }, []);

  // ========== ROLE-SPECIFIC DATA ==========

  // STUDENT Dashboard Data
  const studentData = {
    stats: [
      { title: "CGPA", value: "8.7", change: "+0.2", icon: TrophyIcon, color: "blue" },
      { title: "Attendance", value: "92%", change: "+3%", icon: CalendarDaysIcon, color: "green" },
      { title: "Pending Fees", value: "₹0", icon: CreditCardIcon, color: "amber" },
      { title: "Active Courses", value: "6", icon: BookOpenIcon, color: "purple" },
    ],
    quickActions: [
      { label: "View Courses", icon: BookOpenIcon, path: "/courses", color: "blue" },
      { label: "My Results", icon: ChartBarIcon, path: "/student/results", color: "green" },
      { label: "Fee Payment", icon: CreditCardIcon, path: "/student/fees", color: "amber" },
      { label: "Attendance", icon: CalendarDaysIcon, path: "/student/attendance", color: "purple" },
    ],
    recentActivity: [
      { id: 1, title: "Assignment submitted", description: "CS101 - Data Structures", time: "5 min ago", icon: DocumentTextIcon },
      { id: 2, title: "Fee paid", description: "Semester 4 fee - ₹45,000", time: "15 min ago", icon: CreditCardIcon },
      { id: 3, title: "Class attended", description: "Discrete Mathematics", time: "1 hour ago", icon: CalendarIcon },
    ]
  };

  // FACULTY Dashboard Data - Split by hierarchy level
  const facultyData = {
    // Professor Level (Basic access)
    professor: {
      stats: [
        { title: "My Subjects", value: "4", change: "+1", icon: BookOpenIcon, color: "blue" },
        { title: "Today's Classes", value: "3", icon: CalendarDaysIcon, color: "green" },
        { title: "Pending Reviews", value: "12", icon: ClipboardDocumentListIcon, color: "amber" },
        { title: "Attendance Rate", value: "94%", change: "+2%", icon: ChartBarIcon, color: "purple" },
      ],
      quickActions: [
        { label: "Mark Attendance", icon: CalendarDaysIcon, path: "/attendance", color: "blue" },
        { label: "Enter Results", icon: ChartBarIcon, path: "/results", color: "green" },
        { label: "My Subjects", icon: BookOpenIcon, path: "/faculty/my-subjects", color: "purple" },
        { label: "Assignments", icon: ClipboardDocumentListIcon, path: "/assignments", color: "amber" },
      ],
      recentActivity: [
        { id: 1, title: "Attendance marked", description: "CS101 - 85% attendance today", time: "5 min ago", icon: CalendarIcon },
        { id: 2, title: "Assignment graded", description: "Data Structures Assignment", time: "15 min ago", icon: ClipboardDocumentListIcon },
        { id: 3, title: "Meeting scheduled", description: "Department meeting at 3 PM", time: "1 hour ago", icon: UsersIcon },
      ]
    },

    // HOD Level (Professor + Department access)
    hod: {
      stats: [
        { title: "Department Students", value: "245", change: "+12", icon: UserGroupIcon, color: "blue" },
        { title: "Faculty Members", value: "18", icon: UsersIcon, color: "green" },
        { title: "Department Courses", value: "8", icon: BookOpenIcon, color: "amber" },
        { title: "Attendance Avg", value: "89%", change: "+1.5%", icon: ChartBarSquareIcon, color: "purple" },
      ],
      quickActions: [
        { label: "Department Reports", icon: DocumentTextIcon, path: "/reports", color: "blue" },
        { label: "Faculty Management", icon: UsersIcon, path: "/faculty", color: "green" },
        { label: "Department Analytics", icon: ChartBarSquareIcon, path: "/reports", color: "amber" },
        { label: "Course Approvals", icon: DocumentCheckIcon, path: "/courses", color: "purple" },
      ],
      recentActivity: [
        { id: 1, title: "New faculty joined", description: "Dr. Smith - Assistant Professor", time: "5 min ago", icon: UsersIcon },
        { id: 2, title: "Department report generated", description: "Monthly performance report", time: "15 min ago", icon: DocumentTextIcon },
        { id: 3, title: "Course approved", description: "Advanced Machine Learning", time: "1 hour ago", icon: BookOpenIcon },
      ]
    },

    // Dean Level (HOD + College-wide access)
    dean: {
      stats: [
        { title: "Total Students", value: "1,248", change: "+24", icon: AcademicCapIcon, color: "blue" },
        { title: "Total Faculty", value: "48", change: "+3", icon: UserGroupIcon, color: "green" },
        { title: "College Revenue", value: "₹12.4L", change: "+12.3%", icon: BanknotesIcon, color: "amber" },
        { title: "Overall Attendance", value: "87%", change: "+2.1%", icon: ChartBarSquareIcon, color: "purple" },
      ],
      quickActions: [
        { label: "College Overview", icon: BuildingOfficeIcon, path: "/reports", color: "blue" },
        { label: "Financial Reports", icon: BanknotesIcon, path: "/fee-management", color: "green" },
        { label: "Academic Planning", icon: AcademicCapIcon, path: "/courses", color: "amber" },
        { label: "Strategic Analytics", icon: ChartBarSquareIcon, path: "/reports", color: "purple" },
      ],
      recentActivity: [
        { id: 1, title: "College meeting", description: "Quarterly review with trustees", time: "5 min ago", icon: BuildingOfficeIcon },
        { id: 2, title: "Budget approved", description: "New infrastructure development", time: "15 min ago", icon: BanknotesIcon },
        { id: 3, title: "Accreditation visit", description: "NAAC committee scheduled", time: "1 hour ago", icon: DocumentCheckIcon },
      ]
    }
  };

  // ADMIN Dashboard Data
  const adminData = {
    stats: [
      { title: "Total Students", value: "1,248", change: "+4.2%", icon: AcademicCapIcon, color: "blue" },
      { title: "Faculty Members", value: "48", change: "+2.1%", icon: UserGroupIcon, color: "purple" },
      { title: "Active Courses", value: "32", change: "+8.5%", icon: BookOpenIcon, color: "green" },
      { title: "Revenue", value: "₹12.4L", change: "+12.3%", icon: BanknotesIcon, color: "amber" },
    ],
    quickActions: [
      { label: "Manage Students", icon: AcademicCapIcon, path: "/students", color: "blue" },
      { label: "Faculty Management", icon: UserGroupIcon, path: "/faculty", color: "purple" },
      { label: "Fee Management", icon: CreditCardIcon, path: "/fee-management", color: "green" },
      { label: "Generate Reports", icon: DocumentTextIcon, path: "/reports", color: "amber" },
    ],
    recentActivity: [
      { id: 1, title: "New student enrolled", description: "Rahul Sharma joined B.Tech CSE", time: "5 min ago", icon: AcademicCapIcon },
      { id: 2, title: "Fee payment received", description: "₹45,000 from Priya Verma", time: "15 min ago", icon: CreditCardIcon },
      { id: 3, title: "System backup completed", description: "Nightly backup successful", time: "1 hour ago", icon: Cog6ToothIcon },
    ]
  };

  // Determine which data to use based on role and hierarchy
  const getCurrentData = () => {
    if (isStudent) return studentData;
    if (isAdmin) return adminData;
    if (isFaculty) {
      if (isDean) return facultyData.dean;
      if (isHOD) return facultyData.hod;
      return facultyData.professor;
    }
    return studentData; // fallback
  };

  const currentData = getCurrentData();

  // Get role display text
  const getRoleDisplay = () => {
    if (isAdmin) return "Administrator";
    if (isStudent) return "Student";
    if (isFaculty) {
      if (isDean) return "Dean";
      if (isHOD) return "Head of Department";
      return "Professor";
    }
    return "User";
  };

  // Get welcome message based on role
  const getWelcomeMessage = () => {
    if (isAdmin) return "Monitor institutional performance, manage resources, and drive academic excellence.";
    if (isStudent) return "Track your academic journey and achieve your learning goals.";
    if (isFaculty) {
      if (isDean) return "Oversee college-wide operations and drive academic excellence across departments.";
      if (isHOD) return "Lead your department with comprehensive insights and management tools.";
      return "Empower your teaching with smart tools and real-time insights.";
    }
    return "Welcome to AcademeX University Management System";
  };

  // Load announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await fetchAnnouncements();
        if (res?.success) {
          setAnnouncements(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
        }
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark mb-8">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                  {getRoleDisplay()}
                  {isFaculty && facultyLevel !== "PROFESSOR" && ` • ${facultyLevel}`}
                </div>
                <span className="text-white/80 text-sm">{timeGreeting}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Welcome back, <span className="text-yellow-200">{user?.name || "User"}</span>
              </h1>

              <p className="text-lg text-blue-100 max-w-2xl">
                {getWelcomeMessage()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center backdrop-blur-sm">
                  <UserCircleIcon className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">
                    {isAdmin ? "A" : isStudent ? "S" : facultyLevel.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {currentData.stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.change && (
                      <span className="text-sm font-medium text-emerald-600 flex items-center">
                        <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    stat.color === 'green' ? 'from-emerald-500 to-emerald-600' :
                      stat.color === 'amber' ? 'from-amber-500 to-amber-600' :
                        'from-purple-500 to-purple-600'
                  } text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.color === 'blue' ? 'bg-blue-500' :
                        stat.color === 'green' ? 'bg-emerald-500' :
                          stat.color === 'amber' ? 'bg-amber-500' :
                            'bg-purple-500'
                      }`}
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <SparklesSolid className="h-5 w-5 mr-2 text-primary" />
                    Quick Actions
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Jump to frequently used features</p>
                </div>
                <span className="text-xs text-gray-400">{currentData.quickActions.length} actions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentData.quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${action.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          action.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                            action.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                              'bg-purple-50 text-purple-600'
                        } mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {action.label}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Click to navigate</p>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg mt-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Latest updates in your workspace</p>
                </div>
                <Link to="/activity" className="text-sm font-medium text-primary hover:text-primary-dark">
                  View all →
                </Link>
              </div>

              <div className="space-y-4">
                {currentData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-600 mr-4">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Announcements & AI Chat */}
        <div className="space-y-8">
          {/* Announcements */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <BellIcon className="h-5 w-5 mr-2 text-amber-500" />
                    Announcements
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Important updates</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <BellIcon className="h-4 w-4 text-amber-600" />
                </div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <div
                      key={announcement.id || index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {announcement.title}
                        </h4>
                        {announcement.isImportant && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {announcement.body || announcement.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {announcement.category || "General"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BellIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-2">No announcements</p>
                </div>
              )}

              <Link
                to="/announcements"
                className="mt-4 block text-center text-sm font-medium text-primary hover:text-primary-dark py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View all announcements
              </Link>
            </div>
          </Card>

          {/* AI Assistant Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-purple-600" />
                    AI Assistant
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Get instant help</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ask me anything about your academics, schedules, or get help with the system.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openAIChat'))}
                    className="w-full text-left p-3 bg-white/50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {isAdmin ? "Show me student statistics" :
                        isStudent ? "Check my attendance" :
                          "Mark today's attendance"}
                    </span>
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openAIChat'))}
                    className="w-full text-left p-3 bg-white/50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {isAdmin ? "Generate attendance report" :
                        isStudent ? "View my grades" :
                          "Enter student grades"}
                    </span>
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openAIChat'))}
                    className="w-full text-left p-3 bg-white/50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {isAdmin ? "Check fee collection status" :
                        isStudent ? "Pay semester fees" :
                          isDean ? "College-wide analytics" :
                            isHOD ? "Department reports" :
                              "View class schedule"}
                    </span>
                  </button>
                </div>

                <Button
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    // Dispatch event to open floating chat
                    window.dispatchEvent(new CustomEvent('openFloatingAIChat'));
                  }}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Open AI Chat
                </Button>
              </div>
            </div>
          </Card>

          {/* Performance Chart */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isAdmin ? "Institution Trend" :
                    isStudent ? "My Performance" :
                      isDean ? "College Performance" :
                        isHOD ? "Department Trend" :
                          "Teaching Trend"}
                </h2>
                <ChartPieIcon className="h-5 w-5 text-gray-400" />
              </div>

              <div className="relative h-40">
                <div className="absolute inset-0 flex items-end justify-between px-4">
                  {[40, 60, 75, 85, 65, 90, 70].map((height, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-4 rounded-t-lg ${height > 80 ? 'bg-emerald-500' :
                            height > 60 ? 'bg-blue-500' :
                              'bg-amber-500'
                          }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This week</span>
                  <span className="font-bold text-gray-900">+12% improvement</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;