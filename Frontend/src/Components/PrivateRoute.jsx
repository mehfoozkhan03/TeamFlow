
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = () => {
  const { isAuth } = useSelector((state) => state.user);

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};
