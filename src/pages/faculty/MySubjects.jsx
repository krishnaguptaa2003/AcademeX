// src\pages\faculty\MySubjects.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMySubjects } from "../../api/facultyAcademics";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CalendarIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ClockIcon,
  ChartBarSquareIcon,
  UsersIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export default function MySubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    activeClasses: 0,
    totalStudents: 0,
    attendanceRate: 0
  });
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await fetchMySubjects();
      
      if (res.data?.success) {
        const subjectsData = res.data.data;
        setSubjects(subjectsData);
        
        // Calculate stats
        const totalSubjects = subjectsData.length;
        const activeClasses = subjectsData.filter(s => s.isActive).length;
        const totalStudents = subjectsData.reduce((sum, subject) => 
          sum + (subject.studentsCount || 0), 0);
        
        setStats({
          totalSubjects,
          activeClasses,
          totalStudents,
          attendanceRate: 85 // This would come from API in real app
        });
      } else {
        addToast("Failed to load subjects", "error");
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
      addToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (index) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-amber-500 to-amber-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600"
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
              <p className="text-gray-600 mt-2">
                Manage your assigned subjects, track attendance, and evaluate students
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <span>Welcome, {user?.name}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-500 text-white mr-4">
                  <BookOpenIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-purple-500 text-white mr-4">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeClasses}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-amber-500 text-white mr-4">
                  <ChartBarSquareIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {subjects.length === 0 ? (
          <Card className="text-center py-16">
            <BookOpenIcon className="h-16 w-16 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No subjects assigned</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't been assigned any subjects yet. Contact your department head or administrator.
            </p>
            <Button className="mt-6" onClick={() => navigate("/")}>
              Return to Dashboard
            </Button>
          </Card>
        ) : (
          <>
            {/* Subject Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {subjects.map((subject, index) => (
                <Card key={subject.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className={`${getSubjectColor(index)} h-2 rounded-t-xl`}></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {subject.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {subject.course?.name} • Semester {subject.semester}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Code</p>
                        <p className="font-mono font-bold text-gray-900">{subject.code}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          Faculty: <span className="font-medium">{subject.faculty?.user?.name || "You"}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          Credits: <span className="font-medium">{subject.credits || "N/A"}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          Students: <span className="font-medium">{subject.studentsCount || "N/A"} enrolled</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button
                        size="sm"
                        onClick={() => 
                          navigate(`/attendance?subjectId=${subject.id}`)
                        }
                        className="w-full"
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Attendance
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => 
                          navigate(`/results?subjectId=${subject.id}`)
                        }
                        className="w-full"
                      >
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => 
                        navigate(`/faculty/subjects/${subject.id}/students`)
                      }
                      className="w-full"
                    >
                      View Students
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Actions Bar */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate("/attendance")}
                    variant="secondary"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Mark Today's Attendance
                  </Button>
                  <Button
                    onClick={() => navigate("/results/enter")}
                    variant="secondary"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Enter Results
                  </Button>
                  <Button
                    onClick={() => navigate("/assignments/new")}
                    variant="secondary"
                  >
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}