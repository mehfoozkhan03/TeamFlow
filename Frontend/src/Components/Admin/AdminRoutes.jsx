
import { Routes, Route, Navigate } from "react-router-dom";

import { Dashboard } from "./Dashboard";
import { Overview } from "./Pages/Overview";
import { MyTask } from "./Pages/MyTask";
import { Projects } from "./Pages/Projects";
import { Team } from "./Pages/Team";
import { Notifications } from "./Pages/Notifications";
import { Reports } from "./Pages/Reports";
import { Settings } from "./Pages/Settings";
import {Calendar} from "./Pages/Calendar";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Dashboard />}>
        <Route
          index
          element={<Navigate to="overview" replace />}
        />

        <Route path="overview" element={<Overview />} />
        <Route path="mytask" element={<MyTask />} />
        <Route path="projects" element={<Projects />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="team" element={<Team />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="setting" element={<Settings />} />
      </Route>
    </Routes>
  );
}
