// src/components/layout/Navbar.jsx
import { useEffect, useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Navbar({ onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const pageTitles = {
    "/": "Dashboard",
    "/students": "Students",
    "/faculty": "Faculty",
    "/courses": "Courses",
    "/subjects": "Subjects",
    "/attendance": "Attendance",
    "/fee-structure": "Fee Structure",
    "/fee-management": "Fee Management",
    "/results": "Results",
    "/announcements": "Announcements",
    "/profile": "Profile",
    "/reports": "Reports",
    "/utilities": "Utilities",
    "/leave-applications": "Leave Applications",
    "/assignments": "Assignments",
  };
  
  const currentTitle = pageTitles[location.pathname] || "AcademeX";

  const initials = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 dark:bg-slate-900/90 dark:border-slate-700/50 shadow-sm">
      <div className=" max-w-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Menu Button + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
            onClick={onToggleSidebar}
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white font-bold">
              AX
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                AcademeX
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                University Management
              </span>
            </div>
          </Link>

          {/* Current Page Title */}
          <div className="hidden md:block pl-6 border-l border-gray-200 dark:border-slate-700">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentTitle}
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()} Portal` : "Portal"}
            </p>
          </div>
        </div>

        {/* Center: Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
            <input
              type="search"
              placeholder="Search students, faculty, courses..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative"
              aria-label="Notifications"
            >
              <BellIcon className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Help */}
          <Link
            to="/faq"
            className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Help"
          >
            <QuestionMarkCircleIcon className="h-4 w-4" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username || user?.email || "User"}
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                  {user?.role?.toLowerCase()}
                  {user?.facultyLevel && user.facultyLevel !== "PROFESSOR" && ` • ${user.facultyLevel}`}
                </div>
              </div>
              <ChevronDownIcon className="hidden sm:block h-4 w-4 text-gray-400 dark:text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.username || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                    {user?.role?.toLowerCase()}
                    {user?.facultyLevel && user.facultyLevel !== "PROFESSOR" && ` • ${user.facultyLevel}`}
                  </p>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                  My Profile
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Settings
                </Link>
                
                <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="px-4 py-3 text-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;