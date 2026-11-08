import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NotificationsProvider } from './context/Notifications';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Activity } from './pages/Activity';
import { MyTasks } from './pages/MyTasks';
import { Notifications } from './pages/Notifications';
import { Overview } from './pages/Overview';
import { Profile } from './pages/Profile';
import { Projects } from './pages/Projects';
import { Settings } from './pages/Settings';
import { TeamMembers } from './pages/TeamMembers';
import { Session } from './context/Session';

function RequireMember({ children }) {
  const { isAuth, user } = useSelector((state) => state.user);
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/overview" replace />;
  return children || <Outlet />;
}

export default function UserRoutes() {
  return <Routes><Route element={<RequireMember />}><Route element={<Session><NotificationsProvider><DashboardLayout /></NotificationsProvider></Session>}>
    <Route index element={<Overview />} />
    <Route path="tasks" element={<MyTasks />} />
    <Route path="projects" element={<Projects />} />
    <Route path="team" element={<TeamMembers />} />
    <Route path="activity" element={<Activity />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
    <Route path="*" element={<Navigate to="/user" replace />} />
  </Route></Route></Routes>;
}
