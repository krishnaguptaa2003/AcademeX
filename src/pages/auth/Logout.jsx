// src/pages/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await logout();
      navigate("/login");
    })();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="mx-4 w-full max-w-md rounded-3xl bg-slate-900/80 text-white shadow-[0_24px_60px_rgba(15,23,42,0.9)] overflow-hidden border border-slate-800/60 px-8 py-8">
        <h1 className="text-xl font-semibold mb-2">Signing you out…</h1>
        <p className="text-xs text-slate-400">
          You’ll be redirected to the login page in a moment.
        </p>
      </div>
    </div>
  );
}

export default Logout;
