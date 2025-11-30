import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../contexts/auth";

export default function AuthorizedRoute() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return <div className="flex items-center justify-center h-screen"><span className="loading primary-text loading-xl"></span></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}