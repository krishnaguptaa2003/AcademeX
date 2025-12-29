// src\config\razorpay.js
// Razorpay Configuration
const RAZORPAY_CONFIG = {
  // Test mode configuration (for development)
  test: {
    key_id: "rzp_test_put_your_key_here",
    key_secret: "your_test_secret_key_here",
    webhook_secret: "your_webhook_secret_here",
  },
  
  // Production configuration
  production: {
    key_id: process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
    webhook_secret: process.env.VITE_RAZORPAY_WEBHOOK_SECRET,
  },
  
  // Common settings
  settings: {
    currency: "INR",
    name: "AcademeX University",
    description: "Fee Payment",
    theme: {
      color: "#1E40AF",
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    notes: {
      system: "AcademeX University Management System",
    },
    modal: {
      ondismiss: () => console.log("Payment cancelled by user"),
      escape: true,
      handleback: true,
    },
  },
  
  // Payment methods
  methods: {
    netbanking: true,
    card: true,
    upi: true,
    wallet: true,
    emi: false,
  },
  
  // Helper functions
  getConfig: () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      ...(isProduction ? RAZORPAY_CONFIG.production : RAZORPAY_CONFIG.test),
      ...RAZORPAY_CONFIG.settings,
    };
  },
  
  // Validate Razorpay response
  validateResponse: (response) => {
    if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
      throw new Error("Invalid Razorpay response");
    }
    return true;
  },
  
  // Generate test payment data (for development)
  generateTestPayment: (amount = 100) => ({
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `test_${Date.now()}`,
    notes: {
      test: true,
      timestamp: new Date().toISOString(),
    },
  }),
};

export default RAZORPAY_CONFIG;