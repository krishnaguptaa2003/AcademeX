// src/pages/courses/Courses.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:4000/api";

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    departmentId: "",
    credits: "",
    semester: "",
  });

  const isAdminOrFaculty =
    user?.role === "ADMIN" || user?.role === "FACULTY";

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/courses`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load courses", err);
      setError("Could not fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openNewForm = () => {
    setEditingCourse(null);
    setForm({
      code: "",
      name: "",
      departmentId: "",
      credits: "",
      semester: "",
    });
    setFormOpen(true);
  };

  const openEditForm = (course) => {
    setEditingCourse(course);
    setForm({
      code: course.code,
      name: course.name,
      departmentId: course.departmentId?.toString() || "",
      credits: course.credits?.toString() || "",
      semester: course.semester?.toString() || "",
    });
    setFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        departmentId: Number(form.departmentId),
        credits: Number(form.credits),
        semester: Number(form.semester),
      };

      if (!payload.code || !payload.name || !payload.departmentId) {
        setError("Code, name and department are required.");
        setSaving(false);
        return;
      }

      if (editingCourse) {
        await axios.put(
          `${API_BASE}/courses/${editingCourse.id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${API_BASE}/courses`, payload, {
          withCredentials: true,
        });
      }

      await loadCourses();
      setFormOpen(false);
    } catch (err) {
      console.error("Save course error", err);
      setError("Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all courses offered by the university.
          </p>
        </div>

        {isAdminOrFaculty && (
          <button
            onClick={openNewForm}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
          >
            + Add Course
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading courses…</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-right">Credits</th>
                <th className="px-6 py-3 text-right">Semester</th>
                {isAdminOrFaculty && (
                  <th className="px-6 py-3 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdminOrFaculty ? 6 : 5}
                    className="px-6 py-6 text-center text-gray-400"
                  >
                    No courses found.
                  </td>
                </tr>
              )}

              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50/60">
                  <td className="px-6 py-3 font-medium text-primary">
                    {course.code}
                  </td>
                  <td className="px-6 py-3 text-gray-900">{course.name}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {course.department?.name || "-"}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-700">
                    {course.credits}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-700">
                    {course.semester}
                  </td>
                  {isAdminOrFaculty && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => openEditForm(course)}
                        className="text-primary text-sm font-medium hover:text-primary-dark"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* slide-over / modal form */}
      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCourse ? "Edit course" : "Add new course"}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 text-sm"
                onClick={() => setFormOpen(false)}
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Department ID
                  </label>
                  <input
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Credits
                  </label>
                  <input
                    name="credits"
                    type="number"
                    value={form.credits}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <input
                    name="semester"
                    type="number"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-dark disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCourse
                    ? "Update Course"
                    : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
