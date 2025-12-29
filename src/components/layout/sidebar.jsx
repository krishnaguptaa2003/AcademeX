// src/components/layout/Sidebar.jsx (Updated - Faculty Hierarchy Filtering)
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  TrophyIcon,
  UserCircleIcon,
  ChevronRightIcon,
  ChartBarIcon as ChartBarOutlineIcon,
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  DocumentChartBarIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role || "STUDENT";
  const isAdmin = role === "ADMIN";
  const isFaculty = role === "FACULTY";
  const isStudent = role === "STUDENT";
  const facultyLevel = user?.facultyLevel || "PROFESSOR";

  // Base navigation items for all roles
  const baseNav = [
    { name: "Dashboard", href: "/", icon: HomeIcon, roles: ["ADMIN", "FACULTY", "STUDENT"] },
    { name: "Announcements", href: "/announcements", icon: MegaphoneIcon, roles: ["ADMIN", "FACULTY", "STUDENT"] },
    { name: "Profile", href: "/profile", icon: UserCircleIcon, roles: ["ADMIN", "FACULTY", "STUDENT"] },
  ];

  // Admin specific navigation
  const adminNav = [
    { name: "Students", href: "/students", icon: AcademicCapIcon, roles: ["ADMIN"] },
    { name: "Faculty", href: "/faculty", icon: UsersIcon, roles: ["ADMIN"] },
    { name: "Courses", href: "/courses", icon: BookOpenIcon, roles: ["ADMIN"] },
    { name: "Subjects", href: "/subjects", icon: BookOpenIcon, roles: ["ADMIN"] },
    { name: "Attendance", href: "/attendance", icon: CalendarIcon, roles: ["ADMIN", "FACULTY"] },
    { name: "Results", href: "/results", icon: ChartBarIcon, roles: ["ADMIN", "FACULTY"] },
    { name: "Fee Management", href: "/fee-management", icon: CurrencyDollarIcon, roles: ["ADMIN"] },
    { name: "Fee Structure", href: "/fee-structure", icon: CreditCardIcon, roles: ["ADMIN"] },
    { name: "Leave Applications", href: "/leave-applications", icon: ClipboardDocumentListIcon, roles: ["ADMIN", "FACULTY", "STUDENT"] },
    { name: "Reports", href: "/reports", icon: DocumentTextIcon, roles: ["ADMIN"] },
  ];

  // Faculty navigation based on hierarchy level
  const facultyNav = [
    // Professor level (basic access)
    { name: "My Subjects", href: "/faculty/my-subjects", icon: BookOpenIcon, roles: ["FACULTY"], level: ["PROFESSOR", "HOD", "DEAN"] },
    { name: "Attendance", href: "/attendance", icon: CalendarIcon, roles: ["FACULTY"], level: ["PROFESSOR", "HOD", "DEAN"] },
    { name: "Results", href: "/results", icon: ChartBarIcon, roles: ["FACULTY"], level: ["PROFESSOR", "HOD", "DEAN"] },
    { name: "Assignments", href: "/assignments", icon: ClipboardDocumentListIcon, roles: ["FACULTY"], level: ["PROFESSOR", "HOD", "DEAN"] },
    
    // HOD level (Professor + Department access)
    { name: "Department", href: "/faculty/department", icon: BuildingLibraryIcon, roles: ["FACULTY"], level: ["HOD", "DEAN"] },
    { name: "Faculty Management", href: "/faculty", icon: UsersIcon, roles: ["FACULTY"], level: ["HOD", "DEAN"] },
    
    // Dean level (HOD + College-wide access)
    { name: "University Overview", href: "/faculty/university", icon: BuildingOfficeIcon, roles: ["FACULTY"], level: ["DEAN"] },
    { name: "College Reports", href: "/reports", icon: DocumentChartBarIcon, roles: ["FACULTY"], level: ["DEAN"] },
  ];

  // Student specific navigation
  const studentNav = [
    { name: "My Courses", href: "/courses", icon: BookOpenIcon, roles: ["STUDENT"] },
    { name: "My Attendance", href: "/student/attendance", icon: CalendarIcon, roles: ["STUDENT"] },
    { name: "My Results", href: "/student/results", icon: ChartBarIcon, roles: ["STUDENT"] },
    { name: "My Fees", href: "/student/fees", icon: CreditCardIcon, roles: ["STUDENT"] },
    { name: "Payment History", href: "/student/payment-history", icon: CurrencyDollarIcon, roles: ["STUDENT"] },
  ];

  // Combine navigation based on role and level
  let navigation = [...baseNav];
  if (isAdmin) navigation = [...navigation, ...adminNav];
  if (isFaculty) {
    const filteredFacultyNav = facultyNav.filter(item => {
      // Check if user has role access
      if (!item.roles.includes("FACULTY")) return false;
      
      // Check if user has level access
      if (!item.level) return true;
      
      // For faculty, check hierarchy level
      if (item.level.includes(facultyLevel)) return true;
      
      // If user is DEAN, they also get HOD access
      if (facultyLevel === "DEAN" && item.level.includes("HOD")) return true;
      
      // If user is HOD, they also get PROFESSOR access
      if (facultyLevel === "HOD" && item.level.includes("PROFESSOR")) return true;
      
      return false;
    });
    navigation = [...navigation, ...filteredFacultyNav];
  }
  if (isStudent) navigation = [...navigation, ...studentNav];

  const handleNavigation = (href, hasAccess) => {
    if (!hasAccess) {
      alert(`You don't have access to this page. Required role: ${role}${isFaculty ? ` at level ${facultyLevel}` : ''}`);
      return;
    }
    
    navigate(href);
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on LEFT side, scrolls with page */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)] lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Content - Scrolls with page */}
        <div className="h-full flex flex-col">
          {/* Navigation Menu - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                
                // Check if user has access
                const hasAccess = item.roles.includes(role) && 
                  (!item.level || 
                   item.level.includes(facultyLevel) ||
                   (facultyLevel === "DEAN" && item.level.includes("HOD")) ||
                   (facultyLevel === "HOD" && item.level.includes("PROFESSOR")));
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href, hasAccess)}
                    className={`group flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                        : hasAccess
                        ? "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary-light"
                        : "text-gray-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                    disabled={!hasAccess}
                    title={!hasAccess ? `Requires: ${role}${item.level ? ` (${item.level.join('/')})` : ''}` : ""}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        active
                          ? "text-white"
                          : hasAccess
                          ? "text-gray-400 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary-light"
                          : "text-gray-300 dark:text-slate-600"
                      }`}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                    {active && <ChevronRightIcon className="h-4 w-4 ml-2" />}
                    {item.level && isFaculty && facultyLevel !== "PROFESSOR" && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {facultyLevel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats Section - Only for admin/faculty with hierarchy */}
            {(isAdmin || (isFaculty && facultyLevel !== "PROFESSOR")) && (
              <div className="mt-8 px-3">
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-100 dark:border-blue-800/30">
                  <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                    <ChartBarOutlineIcon className="h-3 w-3 mr-1" />
                    Quick Stats
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-700 dark:text-blue-400">Active Today</span>
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
                        {isAdmin ? "124" : isFaculty && facultyLevel === "DEAN" ? "45" : "18"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-700 dark:text-blue-400">Weekly Growth</span>
                      <span className={`text-sm font-bold ${
                        isAdmin ? "text-green-600 dark:text-green-400" : 
                        facultyLevel === "DEAN" ? "text-blue-600 dark:text-blue-400" : 
                        "text-amber-600 dark:text-amber-400"
                      }`}>
                        +{isAdmin ? "12" : facultyLevel === "DEAN" ? "8" : "4"}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}