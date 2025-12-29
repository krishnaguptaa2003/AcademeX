// src\pages\academics\Assignments.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

function Assignments() {
  const { addToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/assignments", {
          withCredentials: true,
          validateStatus: () => true,
        });
        if (!cancelled && res.status === 200 && res.data?.success) {
          setRows(res.data.data);
        }
      } catch (err) {
        if (!cancelled) addToast("Failed to load assignments.", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [addToast]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Assignments</h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage assignments for your courses.
          </p>
        </div>
        <Link
          to="/assignments/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
        >
          Create Assignment
        </Link>
      </div>

      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-3 py-3 text-left font-semibold">
                Description
              </th>
              <th className="px-3 py-3 text-left font-semibold">Due Date</th>
              <th className="px-3 py-3 text-left font-semibold">
                Created By
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 whitespace-nowrap">{a.title}</td>
                <td className="px-3 py-3">{a.description}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {new Date(a.dueDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {a.createdBy}
                </td>
              </tr>
            ))}
            {!rows.length && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-xs text-gray-400"
                >
                  No assignments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;
