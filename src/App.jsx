// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";

// Dashboard / general
import Home from "./pages/dashboard/Home";
import Reports from "./pages/reports/Reports";

// Profile + FAQ
import Profile from "./pages/profile/Profile";
import Faq from "./pages/general/Faq";

// Students (admin area)
import StudentList from "./pages/students/StudentList";
import StudentDetails from "./pages/students/StudentDetails";
import StudentForm from "./pages/students/StudentForm";

// Faculty (admin area)
import FacultyList from "./pages/faculty/FacultyList";
import FacultyDetails from "./pages/faculty/FacultyDetails";
import FacultyForm from "./pages/faculty/FacultyForm";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import SubjectForm from "./pages/academics/SubjectForm";
import FeeStructureForm from "./pages/finance/FeeStructureForm";

// Academics
import Attendance from "./pages/academics/Attendance";
import Courses from "./pages/academics/Courses";
import Subjects from "./pages/academics/Subjects";
import Results from "./pages/academics/Results";
import PrintResult from "./pages/academics/PrintResult";
import CourseForm from "./pages/academics/CourseForm";

// Leave
import LeaveApplications from "./pages/attendance/LeaveApplications";
import LeaveForm from "./pages/attendance/LeaveForm";

// Finance
import FeeManagement from "./pages/finance/FeeManagement";
import CollectFee from "./pages/finance/CollectFee";
import FeeStructure from "./pages/finance/FeeStructure";

// Assignments
import Assignments from "./pages/academics/Assignments";
import AssignmentForm from "./pages/academics/AssignmentForm";

// Announcements
import Announcements from "./pages/general/Announcements";

// Faculty specific pages
import MySubjects from "./pages/faculty/MySubjects";

// Student specific pages
import StudentAttendance from "./pages/students/Attendance";
import StudentFees from "./pages/students/Fees";
import StudentResults from "./pages/students/Results";
import PayFee from "./pages/students/PayFee";
import PaymentHistory from "./pages/students/PaymentHistory";
import FeeReceipt from "./pages/students/FeeReceipt";
import PaymentSuccessStudent from "./pages/students/PaymentSuccess";

import Department from "./pages/faculty/Department";
import UniversityOverview from "./pages/faculty/UniversityOverview";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Main app routes with layout */}
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* General */}
            <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><Faq /></ProtectedRoute>} />

            {/* Profile */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Students – admin only */}
            <Route path="/students" element={<ProtectedRoute roles={["ADMIN"]}><StudentList /></ProtectedRoute>} />
            <Route path="/students/new" element={<ProtectedRoute roles={["ADMIN"]}><StudentForm /></ProtectedRoute>} />
            <Route path="/students/:id" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><StudentDetails /></ProtectedRoute>} />
            <Route path="/students/:id/edit" element={<ProtectedRoute roles={["ADMIN"]}><StudentForm /></ProtectedRoute>} />

            {/* Faculty – admin only */}
            <Route path="/faculty" element={<ProtectedRoute roles={["ADMIN"]}><FacultyList /></ProtectedRoute>} />
            <Route path="/faculty/new" element={<ProtectedRoute roles={["ADMIN"]}><FacultyForm /></ProtectedRoute>} />
            <Route path="/faculty/:id" element={<ProtectedRoute roles={["ADMIN"]}><FacultyDetails /></ProtectedRoute>} />
            <Route path="/faculty/:id/edit" element={<ProtectedRoute roles={["ADMIN"]}><FacultyForm /></ProtectedRoute>} />

            {/* Faculty specific pages */}
            <Route path="/faculty/my-subjects" element={<ProtectedRoute roles={["FACULTY"]}><MySubjects /></ProtectedRoute>} />

            {/* Attendance - Fixed routing for different roles */}
            <Route path="/attendance" element={
              <ProtectedRoute roles={["ADMIN", "FACULTY"]}>
                <Attendance />
              </ProtectedRoute>
            } />

            <Route path="/student/attendance" element={
              <ProtectedRoute roles={["STUDENT"]}>
                <StudentAttendance />
              </ProtectedRoute>
            } />

            {/* Academics */}
            <Route path="/courses" element={<ProtectedRoute roles={["ADMIN", "FACULTY", "STUDENT"]}><Courses /></ProtectedRoute>} />
            <Route path="/courses/new" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><CourseForm /></ProtectedRoute>} />
            <Route path="/courses/:id/edit" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><CourseForm /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><Subjects /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><Results /></ProtectedRoute>} />
            <Route path="/results/:id/print" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><PrintResult /></ProtectedRoute>} />

            {/* Assignments */}
            <Route path="/assignments" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><Assignments /></ProtectedRoute>} />
            <Route path="/assignments/new" element={<ProtectedRoute roles={["ADMIN", "FACULTY"]}><AssignmentForm /></ProtectedRoute>} />

            {/* Reports - Admin only */}
            <Route path="/reports" element={<ProtectedRoute roles={["ADMIN"]}><Reports /></ProtectedRoute>} />

            {/* Leave Applications */}
            <Route path="/leave-applications" element={<ProtectedRoute roles={["ADMIN", "FACULTY", "STUDENT"]}><LeaveApplications /></ProtectedRoute>} />
            <Route path="/leave-applications/new" element={<ProtectedRoute roles={["ADMIN", "FACULTY", "STUDENT"]}><LeaveForm /></ProtectedRoute>} />

            {/* Finance – admin only */}
            <Route path="/fee-management" element={<ProtectedRoute roles={["ADMIN"]}><FeeManagement /></ProtectedRoute>} />
            <Route path="/fee-management/collect" element={<ProtectedRoute roles={["ADMIN"]}><CollectFee /></ProtectedRoute>} />
            <Route path="/finance/collect/:studentId?" element={<ProtectedRoute roles={["ADMIN"]}><CollectFee /></ProtectedRoute>} />
            <Route path="/fee-structure" element={<ProtectedRoute roles={["ADMIN"]}><FeeStructure /></ProtectedRoute>} />

            {/* Student specific pages */}
            <Route path="/student/results" element={<ProtectedRoute roles={["STUDENT"]}><StudentResults /></ProtectedRoute>} />
            <Route path="/student/fees" element={<ProtectedRoute roles={["STUDENT"]}><StudentFees /></ProtectedRoute>} />
            <Route path="/student/payment-history" element={<ProtectedRoute roles={["STUDENT"]}><PaymentHistory /></ProtectedRoute>} />
            <Route path="/student/receipt/:paymentId" element={<ProtectedRoute roles={["STUDENT"]}><FeeReceipt /></ProtectedRoute>} />
            <Route path="/student/payment-success" element={<ProtectedRoute roles={["STUDENT"]}><PaymentSuccessStudent /></ProtectedRoute>} />

            <Route path="/faculty/department" element={<ProtectedRoute roles={["FACULTY"]}><Department /></ProtectedRoute>} />
            <Route path="/faculty/university" element={<ProtectedRoute roles={["FACULTY"]}><UniversityOverview /></ProtectedRoute>} />

            <Route path="/student/payfee/:feeId" element={<ProtectedRoute roles={["STUDENT"]}><PayFee /></ProtectedRoute>} />
            <Route path="/fee-structure/new" element={<ProtectedRoute roles={["ADMIN"]}><FeeStructureForm /></ProtectedRoute>} />
            <Route path="/fee-structure/:id/edit" element={<ProtectedRoute roles={["ADMIN"]}><FeeStructureForm /></ProtectedRoute>} />
            <Route path="/subjects/new" element={<ProtectedRoute roles={["ADMIN"]}><SubjectForm /></ProtectedRoute>} />
            <Route path="/subjects/:id/edit" element={<ProtectedRoute roles={["ADMIN"]}><SubjectForm /></ProtectedRoute>} />

            {/* Any unknown path while logged-in → dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Any unknown path when not matching layout → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;