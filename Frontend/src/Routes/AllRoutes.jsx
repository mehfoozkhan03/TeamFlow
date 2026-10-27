
import { Route, Routes } from "react-router-dom";

import { Layout } from "../Components/Layout";
import { PrivateRoute } from "../Components/PrivateRoute";
import { PublicRoute } from "../Components/PublicRoutes";

import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Contact } from "../Pages/Contact";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import { ErrorPage } from "../Pages/ErrorPage";

export const AllRoutes = () => {
  return (
    <Routes>
      {/* Public routes: only for unauthenticated users */}
      <Route element={<PublicRoute />}>
        <Route element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>

      {/* Private routes: only for authenticated users */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
