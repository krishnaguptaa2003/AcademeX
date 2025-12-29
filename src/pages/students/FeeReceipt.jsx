// src\pages\students\FeeReceipt.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function FeeReceipt() {
  const { paymentId } = useParams();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    api.get(`/student/payments/${paymentId}`).then((res) => {
      if (res.data?.success) {
        setReceipt(res.data.data);
      }
    });
  }, [paymentId]);

  if (!receipt) {
    return <p className="text-gray-500">Loading receipt…</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-6">
      <Card>
        <h2 className="text-lg font-semibold mb-4 text-center">
          Fee Payment Receipt
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Student:</strong> {receipt.studentName}
          </p>
          <p>
            <strong>Enrollment No:</strong> {receipt.enrollmentNo}
          </p>
          <p>
            <strong>Semester:</strong> {receipt.semester}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₹{receipt.amount}
          </p>
          <p>
            <strong>Payment Date:</strong>{" "}
            {new Date(receipt.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Transaction ID:</strong> {receipt.transactionId}
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={() => window.print()}>
            Print / Save PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}
