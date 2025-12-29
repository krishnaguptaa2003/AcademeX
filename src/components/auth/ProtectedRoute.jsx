// src\components\auth\ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-6 text-center text-red-600">
        You are not authorized to access this page.
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
