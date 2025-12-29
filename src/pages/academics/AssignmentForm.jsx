// src\pages\academics\AssignmentForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

function AssignmentForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post(
        "/assignments",
        {
          title: form.title,
          description: form.description,
          dueDate: form.dueDate,
        },
        { withCredentials: true, validateStatus: () => true }
      );
      if (res.status === 200 && res.data?.success) {
        addToast("Assignment created.", "success");
        navigate("/assignments");
      } else {
        addToast("Failed to create assignment.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to create assignment.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        Create Assignment
      </h1>
      <p className="text-xs text-gray-500 mb-6">
        Define a new assignment for your course.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
      >
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/assignments")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssignmentForm;
