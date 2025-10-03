import Loader from "@/components/loader";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const { isAuthenticated, refreshToken, isBootstrapping } = useSelector(
    (state) => state.auth
  );

  if (isBootstrapping) return <Loader />;

  if (!refreshToken) return <Navigate to="/attorney/login" />;

  if (!isAuthenticated) return <Navigate to="/attorney/login" />;

  return <Outlet />;
}
