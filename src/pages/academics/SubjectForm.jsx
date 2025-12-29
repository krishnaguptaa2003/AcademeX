// src\pages\academics\SubjectForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

export default function SubjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    departmentId: "",
    courseId: "",
    semester: 1,
    credits: 3,
    facultyId: "",
    maxStudents: 60,
    isActive: true
  });

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      // Mock data
      const mockDepartments = [
        { id: 1, name: "Computer Science" },
        { id: 2, name: "Electrical Engineering" }
      ];
      
      const mockFaculty = [
        { id: 1, name: "Dr. Anjali Mehta" },
        { id: 2, name: "Prof. Rohan Shah" }
      ];
      
      const mockCourses = [
        { id: 1, name: "B.Tech Computer Science", departmentId: 1 },
        { id: 2, name: "M.Tech Computer Science", departmentId: 1 }
      ];
      
      setDepartments(mockDepartments);
      setFaculty(mockFaculty);
      setCourses(mockCourses);
      
      if (isEdit) {
        // Mock edit data
        setForm({
          code: "CS101",
          name: "Data Structures",
          description: "Introduction to data structures and algorithms",
          departmentId: "1",
          courseId: "1",
          semester: 2,
          credits: 4,
          facultyId: "1",
          maxStudents: 60,
          isActive: true
        });
      }
    } catch (error) {
      addToast("Failed to load form data", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate
      if (!form.code || !form.name || !form.departmentId || !form.courseId) {
        addToast("Please fill all required fields", "error");
        setSaving(false);
        return;
      }
      
      setTimeout(() => {
        addToast(
          `Subject ${isEdit ? "updated" : "created"} successfully!`,
          "success"
        );
        navigate("/subjects");
      }, 1500);
      
    } catch (error) {
      addToast("Failed to save subject", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? "Edit Subject" : "Add New Subject"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isEdit 
                  ? "Update subject information and settings"
                  : "Create a new subject for the curriculum"}
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2 text-blue-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                    placeholder="e.g., CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credits *
                  </label>
                  <input
                    type="number"
                    name="credits"
                    min="1"
                    max="8"
                    value={form.credits}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  required
                  placeholder="e.g., Data Structures and Algorithms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  placeholder="Enter subject description..."
                />
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-green-500" />
                Academic Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses
                      .filter(course => course.departmentId == form.departmentId)
                      .map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Students
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    min="10"
                    max="200"
                    value={form.maxStudents}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Faculty Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-purple-500" />
                Faculty Assignment
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Faculty
                </label>
                <select
                  name="facultyId"
                  value={form.facultyId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select Faculty (Optional)</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active Subject (Available for enrollment)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/subjects")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    {isEdit ? "Update Subject" : "Create Subject"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}