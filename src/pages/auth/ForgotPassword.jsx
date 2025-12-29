// src/pages/auth/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useState } from "react";

function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ email }) => {
    try {
      setSubmitting(true);
      await api.post("/auth/forgot-password", { email });

      addToast(
        "If this email is registered, we’ve sent an OTP to reset your password.",
        "info"
      );

      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error("Forgot password error:", err);
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="mx-4 w-full max-w-lg rounded-3xl bg-slate-900/80 text-white shadow-[0_24px_60px_rgba(15,23,42,0.9)] overflow-hidden border border-slate-800/60">
        <div className="px-8 py-8 sm:px-10 sm:py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
            Forgot password
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Reset your password
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            Enter the email associated with your account. We’ll send a one-time
            code (OTP) to verify your identity.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-sm text-slate-100
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400"
                {...register("email", { required: true })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium 
                         shadow-[0_10px_30px_rgba(37,99,235,0.5)]
                         hover:bg-indigo-500 hover:shadow-[0_10px_35px_rgba(59,130,246,0.7)]
                         disabled:opacity-60 disabled:shadow-none transition-all"
            >
              {submitting ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <Link to="/login" className="hover:text-indigo-300">
                Back to login
              </Link>
              <Link to="/signup" className="text-indigo-300 hover:text-indigo-200">
                Create a student account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
