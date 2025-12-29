// File: src/pages/faculty/UniversityOverview.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  BuildingLibraryIcon,
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BookOpenIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function UniversityOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    departments: 0,
    activeCourses: 0,
    revenue: 0,
    attendance: 0,
    passRate: 0
  });
  const [departments, setDepartments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadUniversityData();
  }, []);

  const loadUniversityData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalStudents: 1248,
          totalFaculty: 48,
          departments: 8,
          activeCourses: 32,
          revenue: 1240000,
          attendance: 87,
          passRate: 85
        });
        
        setDepartments([
          { id: 1, name: "Computer Science", students: 245, faculty: 18, courses: 8, growth: 12 },
          { id: 2, name: "Mechanical Engineering", students: 210, faculty: 15, courses: 6, growth: 8 },
          { id: 3, name: "Electrical Engineering", students: 195, faculty: 12, courses: 5, growth: 10 },
          { id: 4, name: "Civil Engineering", students: 180, faculty: 10, courses: 4, growth: 5 },
          { id: 5, name: "Business Administration", students: 220, faculty: 16, courses: 7, growth: 15 },
        ]);
        
        setRecentActivities([
          { id: 1, title: "NAAC Accreditation Visit", department: "All", date: "2023-12-15", status: "UPCOMING" },
          { id: 2, title: "New Research Grant Approved", department: "Computer Science", date: "2023-12-10", status: "COMPLETED" },
          { id: 3, title: "Infrastructure Development", department: "Campus", date: "2023-12-05", status: "IN_PROGRESS" },
          { id: 4, title: "International Conference", department: "Electrical", date: "2023-12-01", status: "COMPLETED" },
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading university data:", error);
      addToast("Failed to load university data", "error");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "UPCOMING": return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">University Overview</h1>
              <p className="mt-2 text-gray-600">
                Comprehensive view of university operations and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <span>Dean: {user?.name}</span>
            </div>
          </div>

          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-white mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">AcademeX University</h2>
                  <p className="mt-2 opacity-90">
                    Excellence in Education Since 1995 • 8 Departments • 1,248 Students
                  </p>
                </div>
                <div className="hidden md:block">
                  <BuildingLibraryIcon className="h-16 w-16 opacity-20" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    +4.2% this year
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500 text-white">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faculty Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    +3 new hires
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-green-500 text-white">
                  <UsersIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annual Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(stats.revenue / 100000).toFixed(1)}L</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    +12.3% growth
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500 text-white">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.attendance}%</p>
                  <div className="flex items-center mt-1 text-sm text-green-600">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    +2.1% improvement
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500 text-white">
                  <CalendarIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Departments Performance */}
        <Card className="border-0 shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <ChartPieIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Departments Performance
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Key metrics across all university departments
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => addToast("Detailed analytics coming soon", "info")}
              >
                View Analytics
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                            {dept.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{dept.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {dept.students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {dept.faculty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {dept.courses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {dept.growth > 0 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            dept.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {dept.growth > 0 ? '+' : ''}{dept.growth}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => navigate(`/faculty/department`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Recent Activities & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${
                          activity.status === "COMPLETED" ? "bg-green-100 text-green-600" :
                          activity.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-600" :
                          "bg-blue-100 text-blue-600"
                        }`}>
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{activity.department}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card className="border-0 shadow-lg h-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600">Overall Pass Rate</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${stats.passRate}%` }}
                        />
                      </div>
                      <span className="ml-2 text-lg font-bold text-gray-900">{stats.passRate}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeCourses}</p>
                    <p className="text-xs text-gray-500 mt-1">Across {stats.departments} departments</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Student Satisfaction</p>
                    <div className="flex items-center mt-2">
                      <div className="text-amber-400">
                        ★★★★★
                      </div>
                      <span className="ml-2 text-lg font-bold text-gray-900">4.7/5.0</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => navigate("/reports")}
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Generate University Report
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}