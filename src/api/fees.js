// src\api\fees.js
import api from "../services/api";

/* ============================
   FEE PAYMENT APIs
============================ */

/* Create Razorpay Order */
export const createPaymentOrder = async (feePaymentId) => {
  const res = await api.post("/fees/create-order", { feePaymentId });
  return res.data;
};

/* Verify Payment */
export const verifyPayment = async (paymentData) => {
  const res = await api.post("/fees/verify-payment", paymentData);
  return res.data;
};

/* Get Payment Status */
export const getPaymentStatus = async (feePaymentId) => {
  const res = await api.get(`/fees/${feePaymentId}/status`);
  return res.data;
};

/* Create Fee Payment */
export const createFeePayment = async (feeData) => {
  const res = await api.post("/fees", feeData);
  return res.data;
};

/* Get Fee Payment */
export const getFeePayment = async (feePaymentId) => {
  const res = await api.get(`/fees/${feePaymentId}`);
  return res.data;
};

/* Get Receipt */
export const getFeeReceipt = async (feePaymentId) => {
  const res = await api.get(`/fees/${feePaymentId}/receipt`, {
    responseType: 'blob'
  });
  return res.data;
};

/* Generate Receipt (NEW - to fix the import error) */
export const generateReceipt = async (feePaymentId) => {
  return getFeeReceipt(feePaymentId);
};

/* Refund Payment */
export const refundPayment = async (feePaymentId, refundData) => {
  const res = await api.post(`/fees/${feePaymentId}/refund`, refundData);
  return res.data;
};

/* ============================
   FEE STRUCTURE APIs
============================ */

/* Get Fee Structure */
export const fetchFeeStructure = async () => {
  const res = await api.get("/fees/structure");
  return res.data;
};

/* Save Fee Structure */
export const saveFeeStructure = async (data) => {
  const res = await api.post("/fees/structure", data);
  return res.data;
};

/* ============================
   STUDENT FEES APIs
============================ */

/* Get Student Fees */
export const fetchStudentFees = async (studentId) => {
  const url = studentId 
    ? `/fees/student/${studentId}`
    : "/fees";
  const res = await api.get(url);
  return res.data;
};

/* Get All Fee Payments with filters */
export const fetchAllFeePayments = async (params = {}) => {
  const res = await api.get("/fees", { params });
  return res.data;
};

/* Update Fee Payment Status */
export const updateFeeStatus = async (feeId, status) => {
  const res = await api.put(`/fees/${feeId}/status`, { status });
  return res.data;
};

/* ============================
   REPORTS & ANALYTICS
============================ */

/* Get Fees Report */
export const fetchFeesReport = async (params = {}) => {
  const res = await api.get("/fees/report", { params });
  return res.data;
};

/* Get Payment Statistics */
export const fetchPaymentStatistics = async () => {
  const res = await api.get("/fees/statistics");
  return res.data;
};

/* ============================
   HELPER FUNCTIONS
============================ */

/* Initialize Razorpay */
export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* Format Currency */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/* Get Payment Method Icon */
export const getPaymentMethodIcon = (method) => {
  const icons = {
    ONLINE: 'CreditCardIcon',
    CASH: 'BanknotesIcon',
    CHEQUE: 'ReceiptPercentIcon',
    BANK_TRANSFER: 'BanknotesIcon',
    UPI: 'CreditCardIcon',
  };
  return icons[method] || 'CreditCardIcon';
};

/* Get Payment Status Color */
export const getPaymentStatusColor = (status) => {
  const colors = {
    PAID: 'green',
    PENDING: 'yellow',
    FAILED: 'red',
    REFUNDED: 'gray',
  };
  return colors[status] || 'gray';
};