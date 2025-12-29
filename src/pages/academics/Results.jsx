// src\pages\academics\Results.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const DEMO_ROWS = [
  { studentId: "2023001", name: "John Doe", marks: 78, grade: "A" },
  { studentId: "2023002", name: "Jane Smith", marks: 42, grade: "C" },
];

function calculateGrade(marks) {
  if (marks >= 85) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 55) return "B";
  if (marks >= 40) return "C";
  return "F";
}

function Results() {
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const subjectId = params.get("subjectId"); // ✅ FACULTY MODE

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setUsingDemo(false);

      try {
        // =========================
        // FACULTY MODE (subject-wise)
        // =========================
        if (subjectId) {
          const res = await api.get(
            `/faculty/subjects/${subjectId}/students`
          );

          if (!cancelled && res.data?.success) {
            setRows(
              res.data.data.map((s) => ({
                studentId: s.id,
                name: s.user.name,
                marks: "",
                grade: "",
              }))
            );
          }
          setLoading(false);
          return;
        }

        // =========================
        // GENERIC / ADMIN MODE
        // =========================
        const res = await api.get("/results", {
          validateStatus: () => true,
        });

        if (cancelled) return;

        if (res.status === 200 && res.data?.success) {
          setRows(res.data.data);
        } else if (res.status === 404) {
          setRows(DEMO_ROWS);
          setUsingDemo(true);
        } else {
          addToast("Failed to load results. Showing demo.", "error");
          setRows(DEMO_ROWS);
          setUsingDemo(true);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setRows(DEMO_ROWS);
          setUsingDemo(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [subjectId, addToast]);

  const updateMarks = (studentId, marks) => {
    setRows((prev) =>
      prev.map((r) =>
        r.studentId === studentId
          ? {
              ...r,
              marks,
              grade: calculateGrade(Number(marks)),
            }
          : r
      )
    );
  };

  const handleSave = async () => {
    if (usingDemo) {
      addToast("Demo mode: data is not saved.", "info");
      return;
    }

    try {
      setSaving(true);

      // =========================
      // FACULTY SAVE
      // =========================
      if (subjectId) {
        await api.post("/results", {
          subjectId,
          records: rows.map((r) => ({
            studentId: r.studentId,
            marks: Number(r.marks),
            grade: r.grade,
          })),
        });
      } else {
        // Generic save
        await api.post("/results", {
          records: rows,
        });
      }

      addToast("Results saved successfully.", "success");
      setLastSavedAt(new Date());
    } catch (err) {
      console.error(err);
      addToast("Failed to save results.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Results
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            {subjectId
              ? "Enter results for selected subject."
              : "View and manage examination results."}
          </p>

          {lastSavedAt && !usingDemo && (
            <p className="mt-1 text-[11px] text-gray-400">
              Last saved at{" "}
              {lastSavedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading || !rows.length}
          className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Results"}
        </button>
      </div>

      {/* Demo banner */}
      {usingDemo && (
        <div className="mb-4 flex gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-700 border">
          <InformationCircleIcon className="h-4 w-4" />
          Demo data only (API not available).
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="py-3 pl-4 text-left">Student ID</th>
              <th className="px-3 py-3 text-left">Name</th>
              <th className="px-3 py-3 text-left">Marks</th>
              <th className="px-3 py-3 text-left">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row) => (
              <tr key={row.studentId}>
                <td className="py-3 pl-4">{row.studentId}</td>
                <td className="px-3 py-3">{row.name}</td>
                <td className="px-3 py-3">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={row.marks}
                    onChange={(e) =>
                      updateMarks(row.studentId, e.target.value)
                    }
                    disabled={!subjectId}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-3 font-medium">
                  {row.grade}
                </td>
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-xs text-gray-400">
                  {loading ? "Loading..." : "No records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Results;
