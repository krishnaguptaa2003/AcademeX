// src\pages\students\PaymentSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <div className="text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="mt-3 text-xl font-semibold">
            Payment Successful
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Semester {state?.semester} fee paid successfully.
          </p>

          <p className="mt-2 font-medium">
            Amount: ₹{state?.amount}
          </p>

          <Button
            className="mt-6 w-full"
            onClick={() => navigate("/student/fees")}
          >
            Back to Fees
          </Button>
        </div>
      </Card>
    </div>
  );
}
