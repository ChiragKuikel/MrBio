import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../shared/components/loader/Spinner";
import { useAuth } from "./AuthContext";


export const RequireAdminAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  // Ensure the user object exists and has the required roles
  const hasAdminRole = user?.roles?.includes("ADMIN");

  // Check if the user is authenticated and has the admin role
  
  if (!isAuthenticated || !hasAdminRole) {
    return <Navigate to="/page-not-found" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
