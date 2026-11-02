import { Route, Routes } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { PrivateRoute } from "../Components/Routes/PrivateRoute";

import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Contact } from "../Pages/Contact";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import { ErrorPage } from "../Pages/ErrorPage";

import OverviewDash from "../Components/Admin/OverviewDash";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Protect the dashboard route */}
      <Route element={<PrivateRoute />}>
        <Route path="/overview" element={<OverviewDash />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
