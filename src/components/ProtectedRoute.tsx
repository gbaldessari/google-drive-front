import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../commons/LoadingScreen";

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { loading, isAuthenticated, emailVerified, user } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!emailVerified)
    return (
      <Navigate to="/verify-email" replace state={{ email: user?.email }} />
    );
  return children;
}

export default ProtectedRoute;
