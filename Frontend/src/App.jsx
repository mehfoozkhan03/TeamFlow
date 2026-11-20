
import { Routes, Route, Navigate } from "react-router-dom";

import { DashboardLayout } from "./Components/Dashboard/DashboardLayout.jsx";


export const App = () => {
  const user = {
    name: "Manish Parab",
  };

  const teamName = "Nova Studio";

  return (
    <Routes>

      {/* Team Leader */}
      <Route
        path="/leader/*"
        element={
          <DashboardLayout
            role="leader"
            user={user}
            teamName={teamName}
          />
        }
      >
        <Route index element={<div>Leader Overview</div>} />
        <Route path="overview" element={<div>Leader Overview</div>} />
        <Route path="projects" element={<div>Leader Projects</div>} />
        <Route path="tasks" element={<div>Leader Tasks</div>} />
        <Route path="team" element={<div>Leader Team</div>} />
        <Route path="reports" element={<div>Leader Reports</div>} />
        <Route path="activity" element={<div>Leader Activity</div>} />
        <Route path="settings" element={<div>Leader Settings</div>} />
      </Route>

      {/* Team Member */}
      <Route
        path="/member/*"
        element={
          <DashboardLayout
            role="member"
            user={user}
            teamName={teamName}
          />
        }
      >
        <Route index element={<div>Member Overview</div>} />
        <Route path="overview" element={<div>Member Overview</div>} />
        <Route path="mytasks" element={<div>My Tasks</div>} />
        <Route path="projects" element={<div>Member Projects</div>} />
        <Route path="team" element={<div>Team Members</div>} />
        <Route path="activity" element={<div>Activity</div>} />
        <Route path="notifications" element={<div>Notifications</div>} />
        <Route path="profile" element={<div>My Profile</div>} />
        <Route path="settings" element={<div>Settings</div>} />
      </Route>

      <Route path="/" element={<Navigate to="/leader" replace />} />

    </Routes>
  );
}


