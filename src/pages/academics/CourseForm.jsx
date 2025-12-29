// src/pages/academics/CourseForm.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useToast } from "../../contexts/ToastContext";

const demoCourses = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    department: "Computer Science",
    credits: 4,
    semester: 1,
  },
  {
    id: 2,
    code: "EE201",
    name: "Circuit Theory",
    department: "Electrical",
    credits: 3,
    semester: 2,
  },
];

function CourseForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const existing = useMemo(
    () => demoCourses.find((c) => String(c.id) === String(id)),
    [id]
  );

  const [form, setForm] = useState({
    code: existing?.code || "",
    name: existing?.name || "",
    department: existing?.department || "",
    credits: existing?.credits || 3,
    semester: existing?.semester || 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend yet – just show a toast and go back
    addToast(
      `Course ${isEdit ? "updated" : "created"} (demo only, not saved to DB).`,
      "success"
    );
    navigate("/courses");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        {isEdit ? "Edit Course" : "Add Course"}
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        {isEdit
          ? "Update course information."
          : "Create a new course. In this demo the data is not persisted to the server."}
      </p>

      {isEdit && !existing && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          No course found with ID {id}. You can still create a new one.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white border border-gray-200 p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Code
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Credits
            </label>
            <input
              type="number"
              name="credits"
              min={1}
              max={8}
              value={form.credits}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semester
            </label>
            <input
              type="number"
              name="semester"
              min={1}
              max={10}
              value={form.semester}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isEdit ? "Save changes" : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
