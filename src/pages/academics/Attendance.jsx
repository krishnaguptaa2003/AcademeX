// src/pages/academics/Attendance.jsx (FIXED VERSION)
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { 
  CalendarIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

function Attendance() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const subjectId = params.get("subjectId");
  const isFaculty = user?.role === "FACULTY";
  const isStudent = user?.role === "STUDENT";
  const isAdmin = user?.role === "ADMIN";

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subjectInfo, setSubjectInfo] = useState(null);

  // Attendance status options
  const statusOptions = [
    { value: "PRESENT", label: "Present", color: "green" },
    { value: "ABSENT", label: "Absent", color: "red" },
    { value: "LATE", label: "Late", color: "yellow" },
    { value: "HOLIDAY", label: "Holiday", color: "gray" },
  ];

  useEffect(() => {
    // REMOVED the automatic navigation for students
    // Students should use the /student/attendance route
    
    // For Faculty/Admin, load attendance data
    if (isFaculty || isAdmin) {
      loadSubjectData();
    }
  }, [subjectId, isFaculty, isAdmin]);

  const loadSubjectData = async () => {
    if (!subjectId && (isFaculty || isAdmin)) {
      // If no subject selected for faculty/admin, show empty state
      setStudents([]);
      setSubjectInfo(null);
      return;
    }
    
    setLoading(true);
    try {
      // Mock data for demo - in real app, fetch from API
      const mockStudents = [
        { id: 1, user: { name: "John Doe", email: "john@example.com" }, enrollmentNo: "EN2023001", course: { name: "Computer Science" }, semester: 3 },
        { id: 2, user: { name: "Jane Smith", email: "jane@example.com" }, enrollmentNo: "EN2023002", course: { name: "Computer Science" }, semester: 3 },
        { id: 3, user: { name: "Bob Johnson", email: "bob@example.com" }, enrollmentNo: "EN2023003", course: { name: "Computer Science" }, semester: 3 },
      ];
      
      setStudents(mockStudents);
      
      // Initialize attendance as PRESENT by default
      const initialAttendance = {};
      mockStudents.forEach(student => {
        initialAttendance[student.id] = "PRESENT";
      });
      setAttendance(initialAttendance);

      // Set subject info
      setSubjectInfo({
        name: subjectId ? `Subject ${subjectId}` : "Selected Subject",
        course: "Computer Science",
        semester: 3,
      });
      
    } catch (error) {
      console.error("Error loading subject data:", error);
      addToast("Failed to load subject data", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId, status) => {
    if (!isFaculty && !isAdmin) return;
    
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (subjectId) {
      loadSubjectData();
    }
  };

  const handleSaveAttendance = async () => {
    if ((!isFaculty && !isAdmin) || !subjectId) return;
    
    setSaving(true);
    try {
      // Mock save - in real app, call API
      setTimeout(() => {
        addToast("Attendance saved successfully", "success");
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving attendance:", error);
      addToast("Failed to save attendance", "error");
      setSaving(false);
    }
  };

  const calculateStats = () => {
    const total = Object.keys(attendance).length;
    const presentCount = Object.values(attendance).filter(s => s === "PRESENT").length;
    const absentCount = Object.values(attendance).filter(s => s === "ABSENT").length;
    const lateCount = Object.values(attendance).filter(s => s === "LATE").length;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    
    return { total, presentCount, absentCount, lateCount, percentage };
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT": return "bg-green-100 text-green-800";
      case "ABSENT": return "bg-red-100 text-red-800";
      case "LATE": return "bg-yellow-100 text-yellow-800";
      case "HOLIDAY": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PRESENT": return <CheckCircleIcon className="h-4 w-4" />;
      case "ABSENT": return <XCircleIcon className="h-4 w-4" />;
      case "LATE": return <ClockIcon className="h-4 w-4" />;
      default: return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  // If student somehow reaches this page, show message
  if (isStudent) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <CalendarIcon className="h-16 w-16 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Student Attendance Portal</h3>
          <p className="mt-2 text-gray-500">
            Students should view attendance through the "My Attendance" page.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate("/student/attendance")}>
              Go to My Attendance
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Attendance Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              {isFaculty && subjectId 
                ? "Mark and manage attendance for your subject"
                : isAdmin
                ? "Admin attendance overview and management"
                : "View and manage attendance records"}
            </p>
          </div>
          {isFaculty && (
            <Button
              variant="secondary"
              onClick={() => navigate("/faculty/my-subjects")}
            >
              <BookOpenIcon className="h-4 w-4 mr-2" />
              My Subjects
            </Button>
          )}
        </div>
      </div>

      {isFaculty && subjectId && (
        <>
          {/* Subject Info Card */}
          {subjectInfo && (
            <Card className="mb-6">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subjectInfo.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {subjectInfo.course} • Semester {subjectInfo.semester}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {students.length} students
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Date Picker and Stats */}
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.presentCount}</div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.absentCount}</div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.lateCount}</div>
                    <div className="text-xs text-gray-500">Late</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.percentage}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>

                  <Button
                    onClick={handleSaveAttendance}
                    disabled={saving || students.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <InformationCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Instructions:</p>
              <p className="text-xs">Click on student status to change attendance status. Changes are saved when you click "Save Attendance".</p>
            </div>
          </div>
        </>
      )}

      {/* Attendance Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2">
                      {isFaculty && !subjectId 
                        ? "Please select a subject from 'My Subjects' to mark attendance."
                        : "No students found for this subject"}
                    </p>
                    {isFaculty && !subjectId && (
                      <Button
                        className="mt-4"
                        onClick={() => navigate("/faculty/my-subjects")}
                      >
                        View My Subjects
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {student.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.enrollmentNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateAttendance(student.id, option.value)}
                            disabled={!isFaculty && !isAdmin}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              attendance[student.id] === option.value
                                ? `${getStatusColor(option.value)} ring-2 ring-offset-1`
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } ${(!isFaculty && !isAdmin) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          >
                            {getStatusIcon(option.value)}
                            <span className="ml-1">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admin View - When no subject selected */}
      {isAdmin && !subjectId && (
        <Card className="mt-6">
          <div className="p-6">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Admin Attendance Overview</h3>
              <p className="mt-2 text-gray-500">
                As an admin, you can view attendance across all subjects and departments.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Overall Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Today's Classes</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Faculty Active</p>
                  <p className="text-2xl font-bold text-gray-900">38/45</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Attendance;