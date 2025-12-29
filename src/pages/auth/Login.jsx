// src/pages/auth/Login.jsx (Enhanced with faculty levels)
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import { EyeIcon, EyeSlashIcon, AcademicCapIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const PORTALS = [
  {
    key: "STUDENT",
    label: "Student Portal",
    icon: AcademicCapIcon,
    subtitle: "Access courses, attendance & results",
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "FACULTY",
    label: "Faculty Portal",
    icon: UserIcon,
    subtitle: "Manage classes, attendance & evaluations",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    key: "ADMIN",
    label: "Admin Portal",
    icon: ShieldCheckIcon,
    subtitle: "Oversee departments, fees & system settings",
    color: "from-purple-500 to-purple-600",
  },
];

const FACULTY_LEVELS = [
  { value: "PROFESSOR", label: "Professor", description: "Regular faculty member" },
  { value: "HOD", label: "Head of Department", description: "Department head with additional privileges" },
  { value: "DEAN", label: "Dean", description: "Academic dean with administrative access" },
];

function Login() {
  const { register, handleSubmit, watch } = useForm();
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFacultyLevel, setSelectedFacultyLevel] = useState("PROFESSOR");
  
  const portalMeta = useMemo(
    () => PORTALS.find((p) => p.key === activePortal),
    [activePortal]
  );

  const onSubmit = async (data) => {
    const { email, password } = data;

    // Add faculty level to credentials if faculty portal
    const credentials = { email, password };
    if (activePortal === "FACULTY") {
      credentials.facultyLevel = selectedFacultyLevel;
    }

    const result = await login(credentials);

    if (result?.success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-6xl rounded-3xl bg-slate-900/80 text-white shadow-2xl border border-slate-800/60 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Brand Panel */}
          <div className={`hidden lg:flex w-1/2 flex-col justify-between p-10 bg-gradient-to-br ${portalMeta?.color || 'from-blue-600 to-blue-800'} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xl backdrop-blur-sm">
                  AX
                </div>
                <div>
                  <div className="text-2xl font-bold">AcademeX</div>
                  <div className="text-sm text-white/80">University Management System</div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4">Welcome to {portalMeta?.label.split(' ')[0]}</h2>
              <p className="text-white/90 mb-6">
                {activePortal === "STUDENT" && "Track your academic journey, attendance, and performance in one unified dashboard."}
                {activePortal === "FACULTY" && "Manage your classes, evaluate students, and collaborate with colleagues efficiently."}
                {activePortal === "ADMIN" && "Oversee institutional operations with comprehensive analytics and control."}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-sm">Role-based access control</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-sm">Real-time collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-sm">Secure & scalable platform</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-sm text-white/60">
              © {new Date().getFullYear()} AcademeX. All rights reserved.
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 p-8 sm:p-10">
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-slate-400 mb-2">Sign In</p>
                  <h1 className="text-2xl sm:text-3xl font-bold">Access Your Portal</h1>
                </div>
                <div className="text-xs text-slate-400">
                  New here?{" "}
                  <Link to="/signup" className="text-blue-300 hover:text-blue-200 font-medium">
                    Create account
                  </Link>
                </div>
              </div>

              {/* Portal Selector */}
              <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl mb-6">
                {PORTALS.map((portal) => {
                  const isActive = portal.key === activePortal;
                  return (
                    <button
                      key={portal.key}
                      type="button"
                      onClick={() => setActivePortal(portal.key)}
                      className={`flex-1 flex flex-col items-center py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-white/10 shadow-lg'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <portal.icon className={`h-5 w-5 mb-2 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {portal.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-slate-300">
                {portalMeta?.subtitle}
              </p>
            </div>

            {/* Faculty Level Selection (only for faculty portal) */}
            {activePortal === "FACULTY" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select Faculty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FACULTY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSelectedFacultyLevel(level.value)}
                      className={`py-2 px-3 rounded-lg text-sm text-center transition-all ${
                        selectedFacultyLevel === level.value
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs opacity-75">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  autoComplete="email"
                  className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("email", { required: true })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("password", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-300 hover:text-blue-200"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all ${
                  activePortal === "STUDENT" ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                  activePortal === "FACULTY" ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800' :
                  'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {authLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  `Sign in to ${portalMeta?.label}`
                )}
              </button>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 text-center">
                  Your access level is automatically determined by your institutional role.
                  {activePortal === "FACULTY" && " Faculty levels grant different permissions."}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;