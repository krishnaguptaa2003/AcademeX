// File: src/pages/faculty/Department.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import {
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  ArrowRightIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  UserPlusIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

export default function Department() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeCourses: 0,
    attendanceRate: 0,
    passRate: 0
  });

  useEffect(() => {
    loadDepartmentData();
  }, []);

  const loadDepartmentData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockData = {
          name: "Computer Science",
          code: "CS",
          hod: "Dr. Anjali Mehta",
          established: "2010",
          description: "Department of Computer Science and Engineering",
          contactEmail: "cs@university.edu",
          location: "Block A, 3rd Floor"
        };
        
        const mockFaculty = [
          { id: 1, name: "Dr. Anjali Mehta", designation: "Professor & HOD", email: "anjali@example.com", status: "ACTIVE" },
          { id: 2, name: "Prof. Rohan Shah", designation: "Associate Professor", email: "rohan@example.com", status: "ACTIVE" },
          { id: 3, name: "Dr. Priya Patel", designation: "Assistant Professor", email: "priya@example.com", status: "ACTIVE" },
          { id: 4, name: "Dr. Amit Kumar", designation: "Assistant Professor", email: "amit@example.com", status: "ACTIVE" },
        ];
        
        const mockCourses = [
          { id: 1, code: "CS101", name: "Introduction to Programming", semester: 1, credits: 4, students: 60 },
          { id: 2, code: "CS201", name: "Data Structures", semester: 2, credits: 4, students: 55 },
          { id: 3, code: "CS301", name: "Algorithms", semester: 3, credits: 4, students: 50 },
          { id: 4, code: "CS401", name: "Database Systems", semester: 4, credits: 3, students: 45 },
        ];
        
        setDepartment(mockData);
        setFaculty(mockFaculty);
        setCourses(mockCourses);
        setStats({
          totalStudents: 245,
          totalFaculty: mockFaculty.length,
          activeCourses: mockCourses.length,
          attendanceRate: 89,
          passRate: 85
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading department:", error);
      addToast("Failed to load department data", "error");
      setLoading(false);
    }
  };

  const facultyColumns = [
    {
      header: "Faculty",
      accessor: "name",
      Cell: ({ value, row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {value.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.designation}</div>
          </div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: "email",
      Cell: ({ value }) => (
        <div className="text-sm text-gray-600">{value}</div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "ACTIVE" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {value}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      Cell: ({ value }) => (
        <div className="flex space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => navigate(`/faculty/${value}`)}
          >
            View
          </Button>
        </div>
      )
    }
  ];

  const courseColumns = [
    {
      header: "Course",
      accessor: "code",
      Cell: ({ value, row }) => (
        <div>
          <div className="font-medium text-gray-900">{value} - {row.name}</div>
          <div className="text-sm text-gray-500">Semester {row.semester} • {row.credits} credits</div>
        </div>
      )
    },
    {
      header: "Students",
      accessor: "students",
      Cell: ({ value }) => (
        <div className="text-sm font-medium">{value} enrolled</div>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      Cell: ({ value }) => (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => navigate(`/courses/${value}`)}
        >
          View Details
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Department Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage {department?.name} department operations and resources
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <span>HOD: {user?.name}</span>
            </div>
          </div>

          {/* Department Info Card */}
          <Card className="border-l-4 border-primary mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white">
                      <BuildingOfficeIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{department?.name}</h2>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="text-sm text-gray-600">Code: {department?.code}</span>
                        <span className="text-sm text-gray-600">HOD: {department?.hod}</span>
                        <span className="text-sm text-gray-600">Established: {department?.established}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{department?.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Email:</span>
                      <span className="font-medium">{department?.contactEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Location:</span>
                      <span className="font-medium">{department?.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => addToast("Edit department feature coming soon", "info")}
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Edit Department
                  </Button>
                  <Button
                    onClick={() => navigate("/faculty/new")}
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Add Faculty
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-500 text-white mr-4">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-500 text-white mr-4">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Faculty Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCourses}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-amber-500 text-white mr-4">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-emerald-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-emerald-500 text-white mr-4">
                  <DocumentChartBarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.passRate}%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Faculty Members Section */}
        <Card className="border-0 shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Faculty Members
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {faculty.length} faculty members in the department
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate("/faculty")}
              >
                View All
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <Table
              columns={facultyColumns}
              data={faculty}
              loading={loading}
            />
          </div>
        </Card>

        {/* Courses Section */}
        <Card className="border-0 shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Department Courses
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {courses.length} courses offered this semester
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate("/courses")}
              >
                View All Courses
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <Table
              columns={courseColumns}
              data={courses}
              loading={loading}
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/faculty/new")}
                className="justify-start"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add New Faculty
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/courses/new")}
                className="justify-start"
              >
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Create Course
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/reports")}
                className="justify-start"
              >
                <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/attendance")}
                className="justify-start"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                View Attendance
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}