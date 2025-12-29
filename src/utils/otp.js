// src\utils\otp.js
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiry() {
  const minutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);
  return new Date(Date.now() + minutes * 60 * 1000);
}
