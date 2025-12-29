import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

function StudentList() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const isAdmin = user?.role === "ADMIN";
  const isFaculty = user?.role === "FACULTY";

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin && !isFaculty) {
      addToast("You are not authorized to view students", "error");
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await api.get("/students");
        setStudents(res.data || []);
      } catch (err) {
        console.error(err);
        addToast("Failed to fetch students", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [isAdmin, isFaculty, addToast]);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment?.includes(searchTerm)
  );

  if (!isAdmin && !isFaculty) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the students in your institution.
          </p>
        </div>

        {isAdmin && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/students/new"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Add student
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="block w-full rounded-md py-1.5 pl-10 ring-1 ring-gray-300 focus:ring-primary sm:text-sm"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {loading ? (
            <div className="p-6 text-center">Loading students...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">
                    Enrollment
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">
                    Course
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">
                    Semester
                  </th>
                  {isAdmin && (
                    <th className="py-3.5 pr-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="py-4 pl-4 text-sm font-medium">
                      {student.name}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {student.enrollment}
                    </td>
                    <td className="px-3 py-4 text-sm">{student.course}</td>
                    <td className="px-3 py-4 text-sm">{student.semester}</td>
                    {isAdmin && (
                      <td className="py-4 pr-4 text-right text-sm">
                        <Link
                          to={`/students/${student.id}/edit`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Edit
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentList;
