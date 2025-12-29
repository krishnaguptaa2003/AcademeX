// src\pages\finance\FeeStructureForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  CurrencyDollarIcon,
  AcademicCapIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";

export default function FeeStructureForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const [form, setForm] = useState({
    name: "",
    courseId: "",
    semester: 1,
    tuitionFee: "",
    examFee: "",
    libraryFee: "",
    labFee: "",
    otherCharges: "",
    totalAmount: "0",
    dueDate: "",
    isActive: true,
    description: ""
  });

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    // Calculate total
    const tuition = parseFloat(form.tuitionFee) || 0;
    const exam = parseFloat(form.examFee) || 0;
    const library = parseFloat(form.libraryFee) || 0;
    const lab = parseFloat(form.labFee) || 0;
    const other = parseFloat(form.otherCharges) || 0;
    
    const total = tuition + exam + library + lab + other;
    setForm(prev => ({ ...prev, totalAmount: total.toString() }));
  }, [form.tuitionFee, form.examFee, form.libraryFee, form.labFee, form.otherCharges]);

  const loadFormData = async () => {
    try {
      // Mock courses
      const mockCourses = [
        { id: 1, name: "B.Tech Computer Science", duration: "4 years" },
        { id: 2, name: "M.Tech Computer Science", duration: "2 years" },
        { id: 3, name: "B.Tech Electrical", duration: "4 years" },
        { id: 4, name: "MBA", duration: "2 years" }
      ];
      setCourses(mockCourses);
      
      if (isEdit) {
        // Mock edit data
        setForm({
          name: "B.Tech CSE - Semester 1",
          courseId: "1",
          semester: 1,
          tuitionFee: "75000",
          examFee: "5000",
          libraryFee: "2000",
          labFee: "3000",
          otherCharges: "5000",
          totalAmount: "90000",
          dueDate: "2023-12-31",
          isActive: true,
          description: "First semester fee structure for B.Tech CSE"
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
      if (!form.name || !form.courseId || !form.totalAmount) {
        addToast("Please fill all required fields", "error");
        setSaving(false);
        return;
      }
      
      setTimeout(() => {
        addToast(
          `Fee structure ${isEdit ? "updated" : "created"} successfully!`,
          "success"
        );
        navigate("/fee-structure");
      }, 1500);
      
    } catch (error) {
      addToast("Failed to save fee structure", "error");
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
                {isEdit ? "Edit Fee Structure" : "Create Fee Structure"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Define fee breakdown for courses and semesters
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee Structure Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  required
                  placeholder="e.g., B.Tech CSE - Semester 1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  placeholder="Describe this fee structure..."
                />
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500" />
                Fee Breakdown
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuition Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="tuitionFee"
                    value={form.tuitionFee}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Examination Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="examFee"
                    value={form.examFee}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Library Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="libraryFee"
                    value={form.libraryFee}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Laboratory Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="labFee"
                    value={form.labFee}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Charges (₹)
                </label>
                <input
                  type="number"
                  name="otherCharges"
                  value={form.otherCharges}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Total & Due Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ReceiptPercentIcon className="h-5 w-5 mr-2 text-amber-500" />
                Total & Due Date
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount (₹)
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.totalAmount}
                      readOnly
                      className="w-full pl-10 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleChange}
                      className="w-full pl-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
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
                  Active (Available for fee collection)
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/fee-structure")}
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
                    {isEdit ? "Update Structure" : "Create Structure"}
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