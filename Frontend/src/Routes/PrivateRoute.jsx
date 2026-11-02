
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Protect routes from unauthenticated users
export const PrivateRoute = () => {
  const { isAuth } = useSelector((state) => state.user);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
