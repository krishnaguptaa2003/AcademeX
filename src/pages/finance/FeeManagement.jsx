// src/pages/finance/FeeManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { 
  fetchAllFeePayments, 
  fetchFeesReport,
  updateFeeStatus,
  generateReceipt,
  createFeePayment  // Change from collectFee to createFeePayment
} from "../../api/fees";
import { createPaymentOrder, verifyPayment } from "../../api/payments";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { 
  CreditCardIcon, 
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";

const STATUS_OPTIONS = [
  { value: "All Statuses", label: "All Statuses", color: "gray" },
  { value: "PAID", label: "Paid", color: "green" },
  { value: "PENDING", label: "Pending", color: "yellow" },
  { value: "FAILED", label: "Failed", color: "red" },
  { value: "REFUNDED", label: "Refunded", color: "purple" },
];

export default function FeeManagement() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, reportRes] = await Promise.all([
        fetchAllFeePayments(),
        fetchFeesReport()
      ]);

      if (paymentsRes.data?.success) {
        setRecords(paymentsRes.data.data || []);
      }

      if (reportRes.data?.success) {
        setReport(reportRes.data.data);
      }
    } catch (err) {
      console.error("Fee fetch error:", err);
      addToast("Failed to load fee data", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.student?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.student?.enrollmentNo?.toLowerCase().includes(search.toLowerCase()) ||
        r.receiptNumber?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus =
        statusFilter === "All Statuses" || r.paymentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const handleExport = () => {
    addToast("Export feature coming soon", "info");
  };

  const handleCollectFee = (fee = null) => {
    if (fee) {
      setSelectedFee(fee);
      setShowPaymentModal(true);
    } else {
      navigate("/fee-management/collect");
    }
  };

  const handleViewStructure = () => {
    navigate("/fee-structure");
  };

  const handleStatusUpdate = async (feeId, newStatus) => {
    try {
      const res = await updateFeeStatus(feeId, newStatus);
      if (res.data?.success) {
        addToast(`Fee status updated to ${newStatus}`, "success");
        loadFeeData();
      }
    } catch (error) {
      addToast("Failed to update status", "error");
    }
  };

  const handleDownloadReceipt = async (feeId) => {
    try {
      const blob = await generateReceipt(feeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${feeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addToast("Receipt downloaded successfully", "success");
    } catch (error) {
      addToast("Failed to download receipt", "error");
    }
  };

  const handleRazorpayPayment = async (fee) => {
    setProcessingPayment(true);
    try {
      // Create Razorpay order
      const orderRes = await createPaymentOrder(fee.id);
      
      if (!orderRes.data?.success) {
        throw new Error("Failed to create payment order");
      }

      const { order, key } = orderRes.data;

      // Configure Razorpay options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "AcademeX University",
        description: `Fee Payment - ${fee.student?.user?.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              feeId: fee.id
            });

            addToast("Payment successful!", "success");
            setShowPaymentModal(false);
            loadFeeData();
          } catch (error) {
            addToast("Payment verification failed", "error");
          }
        },
        prefill: {
          name: fee.student?.user?.name || "",
          email: fee.student?.user?.email || "",
          contact: fee.student?.user?.phone || ""
        },
        theme: {
          color: "#1E40AF"
        },
        modal: {
          ondismiss: () => {
            addToast("Payment cancelled", "info");
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      addToast(error.message || "Payment initialization failed", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "FAILED": return "bg-red-100 text-red-800";
      case "REFUNDED": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID": return <CheckCircleIcon className="h-4 w-4" />;
      case "PENDING": return <ClockIcon className="h-4 w-4" />;
      case "FAILED": return <XCircleIcon className="h-4 w-4" />;
      case "REFUNDED": return <ReceiptPercentIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Fee Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage student fee payments with Razorpay integration.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewStructure}
          >
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Fee Structure
          </Button>
          <Button
            size="sm"
            onClick={() => handleCollectFee()}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Collect Fee
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Collected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{report.summary?.totalCollected?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{report.summary?.pendingAmount?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <DocumentArrowDownIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {report.summary?.totalPayments || "0"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {report.summary?.paidPayments || "0"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, enrollment, or receipt..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2">No fee records found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {record.student?.user?.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {record.student?.user?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.student?.enrollmentNo || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.feeStructure?.name || "Fee"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.receiptNumber ? `Receipt: ${record.receiptNumber}` : "No receipt"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{record.amountPaid?.toLocaleString() || "0"}
                      </div>
                      {record.dueDate && new Date(record.dueDate) < new Date() && (
                        <div className="text-xs text-red-600">
                          Overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.paymentDate 
                          ? new Date(record.paymentDate).toLocaleDateString()
                          : "Not paid"}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.paymentStatus)}`}>
                        {getStatusIcon(record.paymentStatus)}
                        <span className="ml-1">{record.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => handleDownloadReceipt(record.id)}
                          disabled={!record.receiptNumber}
                        >
                          Receipt
                        </Button>
                        
                        {record.paymentStatus === "PENDING" && isAdmin && (
                          <>
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => handleCollectFee(record)}
                            >
                              Pay Now
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => handleStatusUpdate(record.id, "PAID")}
                            >
                              Mark Paid
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPaymentModal(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CreditCardIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Process Payment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Student: <strong>{selectedFee.student?.user?.name}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Amount: <strong>₹{selectedFee.amountPaid?.toLocaleString()}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Fee: {selectedFee.feeStructure?.name}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  onClick={() => handleRazorpayPayment(selectedFee)}
                  disabled={processingPayment}
                  className="w-full sm:ml-3 sm:w-auto"
                >
                  {processingPayment ? "Processing..." : "Pay with Razorpay"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}