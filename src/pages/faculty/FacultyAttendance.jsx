// src/pages/faculty/FacultyAttendance.jsx (NEW FILE)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { 
  CalendarIcon, 
  BookOpenIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

function FacultyAttendance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from API
  const mockSubjects = [
    { id: 1, name: "Data Structures", code: "CS201", semester: 3 },
    { id: 2, name: "Discrete Mathematics", code: "CS202", semester: 3 },
    { id: 3, name: "Computer Networks", code: "CS301", semester: 4 },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubjectSelect = (subjectId) => {
    navigate(`/attendance?subjectId=${subjectId}`);
  };

  const handleTodayAttendance = () => {
    // Navigate to today's attendance for first subject
    if (subjects.length > 0) {
      navigate(`/attendance?subjectId=${subjects[0].id}`);
    } else {
      addToast("No subjects assigned", "info");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a subject to mark or view attendance
        </p>
      </div>

      {/* Quick Action Card */}
      <Card className="mb-6 border-l-4 border-primary">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-primary mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <p className="text-sm text-gray-500">Mark today's attendance quickly</p>
              </div>
            </div>
            <Button onClick={handleTodayAttendance}>
              Mark Today's Attendance
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Information Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900">How to use</p>
            <p className="text-sm text-blue-700 mt-1">
              Select a subject below to mark attendance for specific dates. 
              You can view attendance history and export reports for each subject.
            </p>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </Card>
          ))
        ) : subjects.length > 0 ? (
          subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subject.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{subject.code}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        Semester {subject.semester}
                      </span>
                    </div>
                  </div>
                  <BookOpenIcon className="h-6 w-6 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Marked</span>
                    <span className="font-medium">Today, 10:30 AM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Attendance %</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleSubjectSelect(subject.id)}
                    variant="secondary"
                    className="w-full"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Manage Attendance
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3">
            <Card className="text-center py-12">
              <BookOpenIcon className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Subjects Assigned</h3>
              <p className="mt-2 text-gray-500">
                You haven't been assigned any subjects yet. Contact your department head.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyAttendance;