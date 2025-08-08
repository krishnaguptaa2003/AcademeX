import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

export default AuthLayout;