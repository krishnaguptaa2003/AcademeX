// src\pages\faculty\FacultyForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  UserCircleIcon,
  IdentificationIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function FacultyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const [form, setForm] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    designation: "",
    qualification: "",
    dateOfJoining: new Date().toISOString().split('T')[0],
    salary: "",
    facultyLevel: "PROFESSOR",
    address: "",
    subjects: []
  });

  useEffect(() => {
    loadDepartments();
    if (isEdit) {
      loadFacultyDetails();
    }
  }, [id]);

  const loadDepartments = async () => {
    try {
      // Mock departments - in real app, fetch from API
      const mockDepartments = [
        { id: 1, name: "Computer Science", code: "CS" },
        { id: 2, name: "Electrical Engineering", code: "EE" },
        { id: 3, name: "Mechanical Engineering", code: "ME" },
        { id: 4, name: "Civil Engineering", code: "CE" },
        { id: 5, name: "Business Administration", code: "MBA" }
      ];
      setDepartments(mockDepartments);
    } catch (error) {
      addToast("Failed to load departments", "error");
    }
  };

  const loadFacultyDetails = async () => {
    setLoading(true);
    try {
      // Mock faculty data for edit
      const mockFaculty = {
        id: id,
        employeeId: "FAC1001",
        firstName: "Anjali",
        lastName: "Mehta",
        email: "anjali.mehta@example.com",
        phone: "9876543210",
        departmentId: "1",
        designation: "Professor",
        qualification: "Ph.D. in Computer Science",
        dateOfJoining: "2020-06-15",
        salary: "85000",
        facultyLevel: "PROFESSOR",
        address: "123 Faculty Lane, Mumbai",
        subjects: ["Data Structures", "Algorithms"]
      };
      setForm(mockFaculty);
    } catch (error) {
      addToast("Failed to load faculty details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        subjects: checked 
          ? [...prev.subjects, value]
          : prev.subjects.filter(sub => sub !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate form
      if (!form.employeeId || !form.firstName || !form.email || !form.departmentId) {
        addToast("Please fill all required fields", "error");
        setSaving(false);
        return;
      }

      // Simulate API call
      setTimeout(() => {
        addToast(
          `Faculty ${isEdit ? "updated" : "added"} successfully!`,
          "success"
        );
        navigate("/faculty");
      }, 1500);
      
    } catch (error) {
      addToast("Failed to save faculty details", "error");
    } finally {
      setSaving(false);
    }
  };

  const availableSubjects = [
    "Data Structures", "Algorithms", "Database Systems", 
    "Computer Networks", "Operating Systems", "Software Engineering",
    "Discrete Mathematics", "Artificial Intelligence", "Machine Learning"
  ];

  const facultyLevels = [
    { value: "PROFESSOR", label: "Professor" },
    { value: "ASSOCIATE_PROFESSOR", label: "Associate Professor" },
    { value: "ASSISTANT_PROFESSOR", label: "Assistant Professor" },
    { value: "LECTURER", label: "Lecturer" },
    { value: "HOD", label: "Head of Department" },
    { value: "DEAN", label: "Dean" }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
                {isEdit ? "Edit Faculty Member" : "Add New Faculty"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isEdit 
                  ? "Update faculty member information"
                  : "Register a new faculty member in the system"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                    placeholder="FAC1001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Level
                  </label>
                  <select
                    name="facultyLevel"
                    value={form.facultyLevel}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  >
                    {facultyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-green-500" />
                Professional Information
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
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                    placeholder="e.g., Professor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  required
                  placeholder="e.g., Ph.D. in Computer Science"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Joining
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={form.dateOfJoining}
                      onChange={handleChange}
                      className="w-full pl-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary (₹)
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      className="w-full pl-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                      placeholder="e.g., 85000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BuildingLibraryIcon className="h-5 w-5 mr-2 text-purple-500" />
                Subjects Specialization
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSubjects.map(subject => (
                  <label key={subject} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={subject}
                      checked={form.subjects.includes(subject)}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                placeholder="Enter complete address..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/faculty")}
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
                    {isEdit ? "Update Faculty" : "Add Faculty"}
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