// server\src\config\auth.config.js
export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "academex_super_secret_key",
  jwtExpiry: "7d",
  otpExpiryMinutes: 10,
};
