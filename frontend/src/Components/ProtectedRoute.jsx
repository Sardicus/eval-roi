import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoggedIn, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#0f172a]" />; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.userType)) {
    return <Navigate to="/listings" replace />;
  }

  return children;
};
export default ProtectedRoute;