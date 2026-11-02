
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicRoute = () => {
  const { isAuth } = useSelector((state) => state.user);

  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};
