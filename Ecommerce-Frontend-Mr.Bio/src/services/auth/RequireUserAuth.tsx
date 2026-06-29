import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../shared/components/loader/Spinner";
import { useAuth } from "./AuthContext";
import { toastMessage } from "../../shared/components/toast/ToastMessage";
import { useEffect } from "react";

export const RequireUserAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toastMessage("warning", { body: { error: { message: { displayMessage: "Please login to continue" } } } });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/home/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 