// src/pages/attendance/LeaveApplications.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const DEMO = [
  {
    id: 1,
    applicantId: "2023001",
    applicantName: "John Doe",
    leaveType: "Medical",
    dates: "2023-02-01 to 2023-02-03",
    reason: "Fever and cold",
    appliedOn: "2023-01-30",
    status: "APPROVED",
  },
  {
    id: 2,
    applicantId: "2023002",
    applicantName: "Jane Smith",
    leaveType: "Personal",
    dates: "2023-02-05 to 2023-02-07",
    reason: "Family function",
    appliedOn: "2023-02-01",
    status: "PENDING",
  },
];

function statusBadge(status) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function LeaveApplications() {
  const { addToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setUsingDemo(false);
      try {
        const res = await api.get("/leave-applications", {
          withCredentials: true,
          validateStatus: () => true,
        });

        if (cancelled) return;

        if (res.status === 200 && res.data?.success) {
          setRows(res.data.data);
        } else {
          setRows(DEMO);
          setUsingDemo(true);
          addToast("Failed to load leaves. Showing demo data.", "error");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Leave API error:", err);
        setRows(DEMO);
        setUsingDemo(true);
        addToast("Failed to load leaves. Showing demo data.", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const text = `${r.applicantId} ${r.applicantName} ${r.reason}`
          .toLowerCase();
        const okSearch = text.includes(search.toLowerCase());
        const okStatus =
          statusFilter === "ALL" || r.status === statusFilter;
        return okSearch && okStatus;
      }),
    [rows, search, statusFilter]
  );

  const handleDecision = async (rowId, decision) => {
    if (usingDemo) {
      addToast("Demo mode: not persisted.", "info");
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId ? { ...r, status: decision } : r
        )
      );
      return;
    }

    try {
      const res = await api.post(
        `/leave-applications/${rowId}/decision`,
        { decision },
        { withCredentials: true, validateStatus: () => true }
      );

      if (res.status === 200 && res.data?.success) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === rowId ? { ...r, status: decision } : r
          )
        );
        addToast(
          decision === "APPROVED"
            ? "Leave approved."
            : "Leave rejected.",
          "success"
        );
      } else {
        addToast("Failed to update leave.", "error");
      }
    } catch (err) {
      console.error("Decision error:", err);
      addToast("Failed to update leave.", "error");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Leave Applications
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            View and manage leave applications from students and faculty.
          </p>
        </div>

        <button
          // TODO: wire to /leave-applications/new form
          onClick={() => {}}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
        >
          Apply for Leave
        </button>
      </div>

      {usingDemo && (
        <div className="mb-3 text-xs px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-amber-700">
          Failed to load leave applications. Showing demo data only.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search applicants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                Applicant ID
              </th>
              <th className="px-3 py-3 text-left font-semibold">
                Applicant Name
              </th>
              <th className="px-3 py-3 text-left font-semibold">
                Leave Type
              </th>
              <th className="px-3 py-3 text-left font-semibold">
                Dates
              </th>
              <th className="px-3 py-3 text-left font-semibold">
                Reason
              </th>
              <th className="px-3 py-3 text-left font-semibold">
                Applied On
              </th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">
                Decision
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  {r.applicantId}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {r.applicantName}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {r.leaveType}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{r.dates}</td>
                <td className="px-3 py-3">{r.reason}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {r.appliedOn}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium " +
                      statusBadge(r.status)
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                  {r.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleDecision(r.id, "APPROVED")}
                        className="mr-3 font-medium text-emerald-600 hover:text-emerald-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(r.id, "REJECTED")}
                        className="font-medium text-rose-600 hover:text-rose-800"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">No action</span>
                  )}
                </td>
              </tr>
            ))}
            {!filtered.length && !loading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-xs text-gray-400"
                >
                  No leave applications found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-xs text-gray-400"
                >
                  Loading leave applications...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveApplications;
