// src\pages\students\Results.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function StudentResults() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/student/results")
      .then((res) => {
        if (res.data?.success) {
          setRows(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Student results error:", err);
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">
          My Results
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your examination results.
        </p>
      </div>

      <div className="mb-4 flex gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 border border-blue-200">
        <InformationCircleIcon className="h-4 w-4 mt-[2px]" />
        Results are published by faculty and cannot be edited by students.
      </div>

      <Card>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Marks</th>
              <th className="px-4 py-2 text-left">Grade</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2">
                  {r.subject?.name}
                </td>
                <td className="px-4 py-2">
                  {r.marks}
                </td>
                <td className="px-4 py-2 font-medium">
                  {r.grade}
                </td>
              </tr>
            ))}

            {!rows.length && !loading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-sm text-gray-400"
                >
                  Results not published yet.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-sm text-gray-400"
                >
                  Loading results...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
