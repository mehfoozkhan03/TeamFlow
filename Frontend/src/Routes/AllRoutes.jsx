
import { Route, Routes } from "react-router-dom";

import { Layout } from "../Components/Layout";
import { PrivateRoute } from "../Components/PrivateRoute";
import { PublicRoute } from "../Components/PublicRoute";
import Overview from "../Pages/Overview";
import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Contact } from "../Pages/Contact";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import { ErrorPage } from "../Pages/ErrorPage";

export const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Team Leader Overview */}
          <Route path="/overview" element={<Overview />} />
        </Route>
      </Route>

      {/* Unknown Routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
