// src/pages/auth/ResetPassword.jsx
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useState } from "react";

function ResetPassword() {
  const { register, handleSubmit, watch } = useForm();
  const { state } = useLocation();
  const email = state?.email || "";
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/auth/reset-password", {
        email,
        newPassword: password,
      });

      addToast("Password updated. You can now sign in.", "success");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const pwValue = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="mx-4 w-full max-w-lg rounded-3xl bg-slate-900/80 text-white shadow-[0_24px_60px_rgba(15,23,42,0.9)] overflow-hidden border border-slate-800/60">
        <div className="px-8 py-8 sm:px-10 sm:py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
            Reset password
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Set a new password
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            Choose a strong password for{" "}
            <span className="font-medium text-slate-200">
              {email || "your account"}
            </span>
            .
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                New password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-sm text-slate-100
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400"
                {...register("password", { required: true, minLength: 6 })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-sm text-slate-100
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === pwValue || "Passwords do not match",
                })}
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
              {submitting ? "Updating password..." : "Update password"}
            </button>

            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <Link to="/login" className="hover:text-indigo-300">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
