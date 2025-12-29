// src/pages/faculty/SubjectStudents.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchSubjectStudents, fetchSubjectAttendance } from "../../api/facultyAcademics";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { 
  UserGroupIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  IdentificationIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

export default function SubjectStudents() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadSubjectData();
  }, [subjectId, selectedDate]);

  const loadSubjectData = async () => {
    try {
      setLoading(true);
      
      // Load students for this subject
      const studentsRes = await fetchSubjectStudents(subjectId);
      if (studentsRes.data?.success) {
        const studentList = studentsRes.data.data;
        setStudents(studentList);
        
        // Set subject info from first student
        if (studentList.length > 0 && studentList[0].course) {
          setSubjectInfo({
            name: location.state?.subjectName || "Subject",
            course: studentList[0].course.name,
            semester: studentList[0].semester,
            faculty: user?.name
          });
        }
      }

      // Load attendance for selected date
      const attendanceRes = await fetchSubjectAttendance(subjectId, selectedDate);
      if (attendanceRes.data?.success) {
        const attendanceMap = {};
        attendanceRes.data.data.forEach(record => {
          attendanceMap[record.studentId] = record.status === "PRESENT";
        });
        setAttendance(attendanceMap);
      }
    } catch (error) {
      console.error("Error loading subject data:", error);
      addToast("Failed to load subject data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const records = Object.entries(attendance).map(([studentId, isPresent]) => ({
        studentId,
        status: isPresent ? "PRESENT" : "ABSENT"
      }));

      // Call API to save attendance
      // await submitAttendance({
      //   subjectId,
      //   date: selectedDate,
      //   records
      // });
      
      addToast("Attendance saved successfully", "success");
    } catch (error) {
      console.error("Error saving attendance:", error);
      addToast("Failed to save attendance", "error");
    }
  };

  const columns = [
    {
      header: "Student",
      accessor: "user",
      Cell: ({ value, row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {value?.name?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{value?.name}</div>
            <div className="text-sm text-gray-500">{row.enrollmentNo}</div>
          </div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: "user",
      Cell: ({ value }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <EnvelopeIcon className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-gray-600 truncate">{value?.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Attendance",
      accessor: "id",
      Cell: ({ value }) => (
        <button
          onClick={() => handleMarkAttendance(value)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            attendance[value]
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {attendance[value] ? (
            <>
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Present
            </>
          ) : (
            <>
              <XCircleIcon className="h-3 w-3 mr-1" />
              Absent
            </>
          )}
        </button>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      Cell: ({ value, row }) => (
        <div className="flex space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => navigate(`/results/enter?studentId=${value}&subjectId=${subjectId}`)}
          >
            <ChartBarIcon className="h-3 w-3 mr-1" />
            Marks
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => navigate(`/students/${value}`)}
          >
            <IdentificationIcon className="h-3 w-3 mr-1" />
            Profile
          </Button>
        </div>
      )
    }
  ];

  const calculateAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(Boolean).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent: total - present, percentage };
  };

  const stats = calculateAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subjectInfo?.name || "Subject Students"}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-600">
                    {subjectInfo?.course} • Semester {subjectInfo?.semester}
                  </span>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {students.length} Students
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Faculty</p>
                <p className="font-medium">{subjectInfo?.faculty || "You"}</p>
              </div>
            </div>
          </div>

          {/* Attendance Control Bar */}
          <Card className="border-0 shadow-lg mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.percentage}%</div>
                    <div className="text-xs text-gray-500">Attendance</div>
                  </div>

                  <Button
                    onClick={handleSaveAttendance}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Save Attendance
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Instructions</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Click on student status to toggle between Present/Absent. Changes are saved when you click "Save Attendance".
                    Click "Marks" to enter results or "Profile" to view student details.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student List</h2>
              <div className="text-sm text-gray-500">
                Showing {students.length} of {students.length} students
              </div>
            </div>

            <Table
              columns={columns}
              data={students}
              loading={loading}
            />

            {!loading && students.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No students enrolled</h3>
                <p className="mt-2 text-gray-500">
                  No students are currently enrolled in this subject.
                </p>
              </div>
            )}

            {/* Bulk Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/attendance?subjectId=${subjectId}`)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Attendance Dashboard
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/results?subjectId=${subjectId}`)}
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Enter Results
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Export functionality
                    addToast("Export feature coming soon", "info");
                  }}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500 text-white mr-3">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Today</p>
                  <p className="text-xl font-bold text-gray-900">{stats.percentage}%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500 text-white mr-3">
                  <AcademicCapIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <p className="text-xl font-bold text-gray-900">B+</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500 text-white mr-3">
                  <UserGroupIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Size</p>
                  <p className="text-xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}