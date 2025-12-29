// src\api\payments.js
import api from "../services/api";

/* CREATE RAZORPAY ORDER */
export const createPaymentOrder = async (feeId) => {
  const res = await api.post("/payments/create-order", { feeId });
  return res.data;
};

/* VERIFY PAYMENT */
export const verifyPayment = async (data) => {
  const res = await api.post("/payments/verify", data);
  return res.data;
};
