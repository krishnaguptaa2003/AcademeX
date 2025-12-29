// src/pages/auth/VerifyOtp.jsx
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

function VerifyOtp() {
  const { register, handleSubmit } = useForm();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const email = state?.email || "";

  const onSubmit = ({ otp }) => {
    if (!otp || otp.length < 4) {
      addToast("Please enter the 4-digit OTP you received.", "error");
      return;
    }

    // In a real app you'd call /auth/verify-otp here.
    addToast("OTP verified. You can now set a new password.", "success");
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="mx-4 w-full max-w-lg rounded-3xl bg-slate-900/80 text-white shadow-[0_24px_60px_rgba(15,23,42,0.9)] overflow-hidden border border-slate-800/60">
        <div className="px-8 py-8 sm:px-10 sm:py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
            Verify OTP
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Check your inbox
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            We sent a 4-digit code to{" "}
            <span className="font-medium text-slate-200">
              {email || "your email"}
            </span>
            . Enter the code below to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                One-time code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="1234"
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2.5 text-center text-sm tracking-[0.5em] text-slate-100
                           placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400"
                {...register("otp", { required: true })}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Didn’t receive the code? Check spam, or request again from the
                previous step.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium 
                         shadow-[0_10px_30px_rgba(37,99,235,0.5)]
                         hover:bg-indigo-500 hover:shadow-[0_10px_35px_rgba(59,130,246,0.7)]
                         transition-all"
            >
              Verify & continue
            </button>

            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <Link to="/forgot-password" className="hover:text-indigo-300">
                Back to email step
              </Link>
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

export default VerifyOtp;
