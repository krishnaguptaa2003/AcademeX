// src\pages\students\Fees.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/student/fees").then((res) => {
      if (res.data?.success) {
        setFees(res.data.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Fees</h1>

      <Card>
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">Semester</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {fees.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-2">Semester {f.semester}</td>
                <td className="px-4 py-2">₹{f.amount}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    f.status === "PAID"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {f.status}
                </td>
                <td className="px-4 py-2 text-right">
                  {f.status === "PENDING" ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/student/pay-fee/${f.id}`)
                      }
                    >
                      Pay Now
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {!fees.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No fee records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
