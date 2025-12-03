import { Navigate } from 'react-router-dom';
import { User } from '../types/question';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
  requireRole?: 'professor' | 'coordenador';
}

export function ProtectedRoute({ user, children, requireRole }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}