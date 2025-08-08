import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/auth/AuthLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AboutUs from './pages/general/AboutUs';
import Home from './pages/dashboard/Home';
import StudentList from './pages/students/StudentList';
import StudentForm from './components/forms/StudentForm';
import StudentDetails from './pages/students/StudentDetails';
import FacultyList from './pages/faculty/FacultyList';
import FacultyForm from './components/forms/FacultyForm';
import FacultyDetails from './pages/faculty/FacultyDetails';
import Courses from './pages/academics/Courses';
import Subjects from './pages/academics/Subjects';
import Results from './pages/academics/Results';
import ResultForm from './components/forms/ResultForm';
import Attendance from './pages/academics/Attendance';
import LeaveApplications from './pages/attendance/LeaveApplications';
import LeaveForm from './components/forms/LeaveForm';
import FeeStructure from './pages/finance/FeeStructure';
import FeePayment from './pages/finance/FeePayment';
import PaymentSuccess from './pages/finance/PaymentSuccess';
import Reports from './pages/reports/Reports';
import Utilities from './pages/utilities/Utilities';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about-us" element={<AboutUs />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              
              {/* Student Routes */}
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm />} />
              <Route path="/students/:id" element={<StudentDetails />} />
              <Route path="/students/:id/edit" element={<StudentForm />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyList />} />
              <Route path="/faculty/new" element={<FacultyForm />} />
              <Route path="/faculty/:id" element={<FacultyDetails />} />
              <Route path="/faculty/:id/edit" element={<FacultyForm />} />
              
              {/* Academic Routes */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/results" element={<Results />} />
              <Route path="/results/:studentId/new" element={<ResultForm />} />
              <Route path="/results/:studentId/edit" element={<ResultForm />} />
              
              {/* Attendance & Leave Routes */}
              <Route path="/leave-applications" element={<LeaveApplications />} />
              <Route path="/leave-applications/new" element={<LeaveForm />} />
              
              {/* Finance Routes */}
              <Route path="/fee-structure" element={<FeeStructure />} />
              <Route path="/fee-payment/:studentId" element={<FeePayment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              
              {/* Reports & Utilities */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/utilities" element={<Utilities />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;