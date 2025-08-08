import { useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

function PaymentSuccess() {
  const { state } = useLocation();
  const paymentDetails = state || {
    amount: 0,
    transactionId: 'N/A',
    studentName: 'Unknown'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            Payment Successful
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payment Details
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">{paymentDetails.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-medium">₹{paymentDetails.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium">{paymentDetails.transactionId}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                A receipt has been sent to your email address.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Button
            as="link"
            to="/students"
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;