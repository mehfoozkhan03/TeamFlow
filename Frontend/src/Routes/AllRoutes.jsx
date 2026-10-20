
import { Route, Routes } from "react-router-dom";

import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import { OverviewDashboard } from "../Components/Admin/OverviewDash";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/overview"
        element={<OverviewDashboard />}
      />
    </Routes>
  );
};
