// src/pages/auth/Signup.jsx
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useState } from "react";

function Signup() {
  const { register, handleSubmit } = useForm();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const payload = {
        username: data.name?.trim() || undefined,
        email: data.email.trim(),
        password: data.password,
      };

      await api.post("/auth/signup", payload, { withCredentials: true });

      addToast("Account created successfully. Please sign in.", "success");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err.response?.data?.message || "Failed to create account. Please try again.";
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="mx-4 w-full max-w-5xl rounded-3xl bg-slate-900/80 text-white shadow-[0_24px_60px_rgba(15,23,42,0.9)] flex flex-col lg:flex-row overflow-hidden border border-slate-800/60">
        {/* Left – brand, similar to login */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between px-10 py-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-900 relative">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-indigo-300/40 blur-3xl -top-10 -left-10 absolute" />
            <div className="w-72 h-72 rounded-full bg-blue-300/30 blur-3xl -bottom-24 right-0 absolute" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg">
                AX
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight">
                  AcademeX
                </div>
                <div className="text-xs text-blue-100/80">
                  University Management Platform
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              Create your student account.
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Sign up as a student to view your dashboard, track attendance,
              and access course information. Faculty and admin accounts are
              created by the university administration.
            </p>
          </div>

          <div className="relative text-xs text-blue-100/60 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="underline text-blue-50">
              Sign in here
            </Link>
          </div>
        </div>

        {/* Right – signup form */}
        <div className="w-full lg:w-1/2 bg-slate-950/60 px-7 py-8 sm:px-10 sm:py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
            Student signup
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Create your AcademeX account
          </h1>
          <p className="mt-1 text-xs text-slate-400 mb-6">
            Use your university email address if possible. You’ll sign in with
            this email and password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name (optional now, we only send as username) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                placeholder="Krishna Gupta"
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-sm text-slate-100
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400"
                {...register("name")}
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a strong password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-sm text-slate-100
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400"
                {...register("password", { required: true, minLength: 6 })}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Minimum 6 characters. You’ll use this to access the Student
                portal.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium 
                         shadow-[0_10px_30px_rgba(37,99,235,0.5)]
                         hover:bg-indigo-500 hover:shadow-[0_10px_35px_rgba(59,130,246,0.7)]
                         disabled:opacity-60 disabled:shadow-none transition-all"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-3 text-[11px] text-slate-500">
              Faculty & Admin accounts are created by your institution. If you
              are a staff member, please contact the system administrator.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
