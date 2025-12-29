// src\pages\students\PayFee.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function PayFee() {
  const { feeId } = useParams();
  const navigate = useNavigate();
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/student/fees/${feeId}`).then((res) => {
      if (res.data?.success) {
        setFee(res.data.data);
      }
    });
  }, [feeId]);

  const payNow = async () => {
    setLoading(true);

    try {
      // 1️⃣ Create Razorpay order
      const orderRes = await api.post("/payments/create-order", {
        amount: fee.amount,
      });

      const options = {
        key: orderRes.data.key,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "AcademeX University",
        description: `Semester ${fee.semester} Fee`,
        order_id: orderRes.data.orderId,
        handler: async (response) => {
          // 2️⃣ Verify payment
          await api.post("/payments/verify", {
            ...response,
            feeId,
          });

          navigate("/student/payment-success", {
            state: {
              amount: fee.amount,
              semester: fee.semester,
            },
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!fee) {
    return <div className="text-gray-500">Loading fee…</div>;
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">
        Pay Semester {fee.semester} Fee
      </h2>

      <p className="text-sm mb-2">
        Amount: <strong>₹{fee.amount}</strong>
      </p>

      <Button onClick={payNow} disabled={loading}>
        {loading ? "Processing…" : "Pay with Razorpay"}
      </Button>
    </Card>
  );
}
