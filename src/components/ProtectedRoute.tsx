
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // If auth is bypassed, allow access
  const BYPASS_AUTH = true;
  if (BYPASS_AUTH) return <>{children}</>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
