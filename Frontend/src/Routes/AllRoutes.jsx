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
import { Settings } from "../Pages/Settings";
import { Profile } from "../Pages/Profile";
import { ErrorPage } from "../Pages/ErrorPage";
import UserRoutes from "../Components/User/UserRoutes";

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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/overview" element={<Overview />} />
        </Route>
      </Route>

      {/* Unknown Routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
