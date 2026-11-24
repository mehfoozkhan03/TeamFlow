
import { Route, Routes, Navigate } from "react-router-dom";

import { Layout } from "../Components/Layout";
import { PrivateRoute } from "../Components/PrivateRoute";
import { PublicRoute } from "../Components/PublicRoute";

import { MemberLayout } from "../Components/Member/MemberLayout";

// Main application pages
import Overview from "../Pages/Overview";
import { Home } from "../Pages/Home";
import { About } from "../Pages/About";
import { Contact } from "../Pages/Contact";
import { Login } from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import { Settings } from "../Pages/Settings";
import { Profile } from "../Pages/Profile";
import { ErrorPage } from "../Pages/ErrorPage";

// Member dashboard pages
import { MemberDashboard } from "../Components/Member/pages/Overview";
import { MyTasks } from "../Components/Member/pages/MyTasks";
import Project from "../Components/Member/pages/Project";
import { TeamMember } from "../Components/Member/pages/TeamMember";
import { Activity } from "../Components/Member/pages/Activity";
import { Notification } from "../Components/Member/pages/Notification";
import { MyProfile } from "../Components/Member/pages/MyProfile";
import { Settings as MemberSettings } from "../Components/Member/pages/Settings";

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

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>

        {/* Main Application Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="overview" element={<Overview />} />
        </Route>

        {/* Member Dashboard Routes */}
        <Route path="/member" element={<MemberLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<MemberDashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="projects" element={<Project />} />
          <Route path="team" element={<TeamMember />} />
          <Route path="activity" element={<Activity />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="settings" element={<MemberSettings />} />
        </Route>

      </Route>

      {/* Unknown Routes */}
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
};

export default AllRoutes;
