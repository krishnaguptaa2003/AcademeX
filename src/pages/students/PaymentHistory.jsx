// src\pages\students\PaymentHistory.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/student/payments").then((res) => {
      if (res.data?.success) {
        setPayments(res.data.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Payment History</h1>

      <Card>
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">Semester</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Receipt</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2">Semester {p.semester}</td>
                <td className="px-4 py-2">₹{p.amount}</td>
                <td className="px-4 py-2">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      navigate(`/student/receipt/${p.id}`)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}

            {!payments.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
