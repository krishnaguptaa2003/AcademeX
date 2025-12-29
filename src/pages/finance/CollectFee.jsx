// src/pages/finance/CollectFee.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { createPaymentOrder, verifyPayment } from "../../api/fees";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { 
  ArrowLeftIcon, 
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CollectFee() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [form, setForm] = useState({
    studentId: studentId || "",
    studentName: "",
    enrollmentNo: "",
    course: "",
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    semester: 1,
    paymentMethod: "ONLINE",
    feeStructureId: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [feeStructures, setFeeStructures] = useState([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on mount
  useEffect(() => {
    loadRazorpayScript().then(loaded => {
      setRazorpayLoaded(loaded);
      if (!loaded) {
        addToast("Failed to load payment gateway", "error");
      }
    });
  }, [addToast]);

  // Load student details and fee structures
  useEffect(() => {
    if (studentId) {
      loadStudentDetails(studentId);
      loadFeeStructures();
    }
  }, [studentId]);

  const loadStudentDetails = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/students/${id}`);
      if (response.data?.success) {
        const student = response.data.data;
        setStudentDetails(student);
        setForm(prev => ({
          ...prev,
          studentId: id,
          studentName: student.user?.name || "",
          enrollmentNo: student.enrollmentNo || "",
          course: student.course?.name || "",
          semester: student.semester || 1,
        }));
      }
    } catch (error) {
      console.error("Error loading student:", error);
      addToast("Failed to load student details", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadFeeStructures = async () => {
    try {
      const response = await api.get("/fees/structure");
      if (response.data?.success) {
        setFeeStructures(response.data.data);
      }
    } catch (error) {
      console.error("Error loading fee structures:", error);
      addToast("Failed to load fee structures", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // If fee structure selected, update amount
    if (name === "feeStructureId") {
      const selectedFee = feeStructures.find(f => f.id === value);
      if (selectedFee) {
        setForm(f => ({ 
          ...f, 
          amount: selectedFee.amount,
          description: selectedFee.description 
        }));
      }
    }
  };

  const handleOnlinePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      addToast("Payment gateway not loaded. Please refresh the page.", "error");
      return;
    }

    setProcessing(true);
    try {
      // First create the fee payment record
      const feeData = {
        studentId: form.studentId,
        feeStructureId: form.feeStructureId,
        amount: parseFloat(form.amount),
        paymentMethod: "ONLINE",
        semester: parseInt(form.semester),
        description: form.description,
      };

      const feeResponse = await api.post("/fees", feeData);
      
      if (!feeResponse.data?.success) {
        throw new Error("Failed to create fee record");
      }

      const feePayment = feeResponse.data.data;

      // Create Razorpay order
      const orderResponse = await createPaymentOrder(feePayment.id);
      
      if (!orderResponse.data?.success) {
        throw new Error("Failed to create payment order");
      }

      const orderData = orderResponse.data.data;

      // Configure Razorpay options
      const options = {
        key: orderData.key || process.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // Amount in paise
        currency: orderData.currency || "INR",
        name: "AcademeX University",
        description: `Fee Payment - ${orderData.feeStructure}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          // Verify payment
          const verifyResponse = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            feePaymentId: feePayment.id,
          });

          if (verifyResponse.data?.success) {
            addToast("Payment successful! Receipt generated.", "success");
            navigate(`/fees/${feePayment.id}/receipt`, { 
              state: { 
                payment: verifyResponse.data.data,
                print: true 
              } 
            });
          } else {
            addToast("Payment verification failed", "error");
          }
        },
        prefill: {
          name: orderData.student,
          email: studentDetails?.user?.email || "",
          contact: studentDetails?.user?.phone || "",
        },
        notes: {
          studentId: form.studentId,
          enrollmentNo: form.enrollmentNo,
          feeStructure: orderData.feeStructure,
        },
        theme: {
          color: "#1E40AF",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            addToast("Payment cancelled", "info");
          },
        },
      };

      // Open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Online payment error:", error);
      addToast(
        error.response?.data?.message || "Failed to process online payment", 
        "error"
      );
      setProcessing(false);
    }
  };

  const handleOfflinePayment = async () => {
    setProcessing(true);
    try {
      const feeData = {
        studentId: form.studentId,
        feeStructureId: form.feeStructureId,
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        paymentDate: new Date(form.paymentDate),
        semester: parseInt(form.semester),
        description: form.description,
      };

      const response = await api.post("/fees", feeData);
      
      if (response.data?.success) {
        const feePayment = response.data.data;
        addToast("Fee payment recorded successfully", "success");
        
        // Generate and display receipt
        navigate(`/fees/${feePayment.id}/receipt`, { 
          state: { 
            payment: feePayment,
            print: true 
          } 
        });
      }
    } catch (error) {
      console.error("Offline payment error:", error);
      addToast(
        error.response?.data?.message || "Failed to record fee payment", 
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.amount || !form.feeStructureId) {
      addToast("Please fill all required fields", "error");
      return;
    }

    if (form.paymentMethod === "ONLINE") {
      await handleOnlinePayment();
    } else {
      await handleOfflinePayment();
    }
  };

  const paymentMethods = [
    { value: "ONLINE", label: "Online Payment (Razorpay)", icon: CreditCardIcon, color: "blue" },
    { value: "CASH", label: "Cash", icon: BanknotesIcon, color: "green" },
    { value: "CHEQUE", label: "Cheque", icon: ReceiptPercentIcon, color: "purple" },
    { value: "BANK_TRANSFER", label: "Bank Transfer", icon: BanknotesIcon, color: "amber" },
    { value: "UPI", label: "UPI", icon: CreditCardIcon, color: "indigo" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collect Fee</h1>
              <p className="mt-1 text-sm text-gray-500">
                Process fee payments for students
              </p>
            </div>
          </div>

          {/* Student Info Card */}
          {studentDetails && (
            <Card className="mb-6 border-l-4 border-primary">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {studentDetails.user?.name}
                    </h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Enrollment</p>
                        <p className="font-medium">{studentDetails.enrollmentNo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Course</p>
                        <p className="font-medium">{studentDetails.course?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Semester</p>
                        <p className="font-medium">{studentDetails.semester}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-mono text-gray-900">{studentId}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Payment Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fee Structure Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Fee Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Structure *
                  </label>
                  <select
                    name="feeStructureId"
                    value={form.feeStructureId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Select Fee Structure</option>
                    {feeStructures.map((fee) => (
                      <option key={fee.id} value={fee.id}>
                        {fee.name} - ₹{fee.amount.toLocaleString()} 
                        {fee.semester && ` (Semester ${fee.semester})`}
                      </option>
                    ))}
                  </select>
                  {form.description && (
                    <p className="mt-1 text-xs text-gray-500">{form.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    name="semester"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                    value={form.semester}
                    onChange={handleChange}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        form.paymentMethod === method.value
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <div className="ml-3 flex items-center">
                        <method.icon className={`h-5 w-5 mr-2 text-${method.color}-500`} />
                        <span className="text-sm font-medium">{method.label}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === "ONLINE" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Online Payment</p>
                        <p className="text-xs text-blue-700 mt-1">
                          You will be redirected to Razorpay's secure payment gateway.
                          All major credit/debit cards, UPI, and net banking are accepted.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {form.paymentMethod !== "ONLINE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                      value={form.paymentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                rows={3}
                name="description"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                value={form.description}
                onChange={handleChange}
                placeholder="Any additional information about this payment..."
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Student</span>
                  <span className="font-medium">{form.studentName || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">₹{parseFloat(form.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {paymentMethods.find(m => m.value === form.paymentMethod)?.label}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{parseFloat(form.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/fee-management")}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={processing || !form.amount || !form.feeStructureId}
                className="min-w-[140px]"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : form.paymentMethod === "ONLINE" ? (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Record Payment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Security Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Secure Payment</p>
              <ul className="mt-1 text-xs text-green-700 space-y-1">
                <li>• All online payments are processed through Razorpay's secure PCI-DSS compliant platform</li>
                <li>• No credit card details are stored on our servers</li>
                <li>• Instant receipt generation upon successful payment</li>
                <li>• 24/7 payment tracking and support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}