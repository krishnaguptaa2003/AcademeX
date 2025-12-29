// src\pages\students\Attendance.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import { 
  CalendarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

export default function StudentAttendance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    loadAttendanceData();
  }, [selectedMonth, selectedSubject]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        const mockData = [
          { id: 1, subject: "Data Structures", date: "2023-11-01", status: "PRESENT", faculty: "Dr. Smith", percentage: 95 },
          { id: 2, subject: "Discrete Mathematics", date: "2023-11-02", status: "PRESENT", faculty: "Prof. Johnson", percentage: 90 },
          { id: 3, subject: "Computer Networks", date: "2023-11-03", status: "ABSENT", faculty: "Dr. Williams", percentage: 85 },
          { id: 4, subject: "Database Systems", date: "2023-11-04", status: "PRESENT", faculty: "Prof. Brown", percentage: 92 },
          { id: 5, subject: "Operating Systems", date: "2023-11-05", status: "PRESENT", faculty: "Dr. Davis", percentage: 88 },
          { id: 6, subject: "Software Engineering", date: "2023-11-06", status: "PRESENT", faculty: "Prof. Miller", percentage: 94 },
        ];
        
        const subjects = [...new Set(mockData.map(item => item.subject))];
        const summaryData = {
          totalClasses: mockData.length,
          present: mockData.filter(c => c.status === "PRESENT").length,
          absent: mockData.filter(c => c.status === "ABSENT").length,
          overallPercentage: 92,
          subjectStats: subjects.map(subject => ({
            name: subject,
            total: mockData.filter(c => c.subject === subject).length,
            present: mockData.filter(c => c.subject === subject && c.status === "PRESENT").length,
            percentage: Math.round((mockData.filter(c => c.subject === subject && c.status === "PRESENT").length / 
                          mockData.filter(c => c.subject === subject).length) * 100)
          }))
        };
        
        // Apply filters
        let filteredData = mockData;
        if (selectedSubject !== "all") {
          filteredData = mockData.filter(item => item.subject === selectedSubject);
        }
        
        setAttendance(filteredData);
        setSummary(summaryData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading attendance:", error);
      addToast("Failed to load attendance data", "error");
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Subject",
      accessor: "subject",
      Cell: ({ value }) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {value.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      )
    },
    {
      header: "Date",
      accessor: "date",
      Cell: ({ value }) => (
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          {new Date(value).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      )
    },
    {
      header: "Faculty",
      accessor: "faculty",
      Cell: ({ value }) => (
        <div className="text-sm text-gray-600">{value}</div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          value === "PRESENT" 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value === "PRESENT" ? (
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
        </span>
      )
    },
    {
      header: "Attendance",
      accessor: "percentage",
      Cell: ({ value }) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                value >= 90 ? 'bg-green-500' :
                value >= 75 ? 'bg-blue-500' :
                'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{value}%</span>
        </div>
      )
    }
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
                <p className="text-gray-600 mt-2">
                  Track your attendance records across all subjects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDaysIcon className="h-5 w-5" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Info Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 mb-6">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Attendance Policy</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Minimum 75% attendance required in each subject. Below 75% may affect exam eligibility.
                    Attendance is maintained by faculty and cannot be modified by students.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Overview */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-green-500 text-white mr-4">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.present}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-red-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-red-500 text-white mr-4">
                    <XCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.absent}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-blue-500 text-white mr-4">
                    <ChartBarIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall %</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.overallPercentage}%</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-500 text-white mr-4">
                    <BookOpenIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Classes</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalClasses}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters & Controls */}
        <Card className="border-0 shadow-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>
                        {month} 2023
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="all">All Subjects</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Discrete Mathematics">Discrete Mathematics</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Database Systems">Database Systems</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    addToast("Export feature coming soon", "info");
                  }}
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button
                  onClick={() => navigate("/courses")}
                >
                  View Subjects
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card className="border-0 shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
              <div className="text-sm text-gray-500">
                Showing {attendance.length} of {attendance.length} records
              </div>
            </div>

            <Table
              columns={columns}
              data={attendance}
              loading={loading}
            />

            {!loading && attendance.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No attendance records</h3>
                <p className="mt-2 text-gray-500">
                  No attendance records found for the selected filters.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Subject-wise Breakdown */}
        {summary?.subjectStats && (
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subject-wise Breakdown</h2>
              <div className="space-y-4">
                {summary.subjectStats.map((subject) => (
                  <div key={subject.name} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <h3 className="font-medium text-gray-900">{subject.name}</h3>
                      </div>
                      <span className={`text-sm font-medium ${
                        subject.percentage >= 90 ? 'text-green-600' :
                        subject.percentage >= 75 ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {subject.percentage}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{subject.present} present / {subject.total} total</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subject.percentage >= 75 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subject.percentage >= 75 ? 'Satisfactory' : 'Low'}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.percentage >= 90 ? 'bg-green-500' :
                          subject.percentage >= 75 ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/courses")}
          >
            <BookOpenIcon className="h-4 w-4 mr-2" />
            View Courses
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/results")}
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            View Results
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/profile")}
          >
            <UserGroupIcon className="h-4 w-4 mr-2" />
            My Profile
          </Button>
        </div>
      </div>
    </div>
  );
}