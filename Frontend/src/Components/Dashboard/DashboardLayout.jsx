
import { Outlet } from "react-router-dom";

import { Sidebar } from "../../ResuableComponents/Sidebar";
import { Topbar } from "../../ResuableComponents/Topbar";

export const DashboardLayout = ({
  role = "member",
  teamName = "Nova Studio",
  user,
  onInviteClick,
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">

      {/* Sidebar */}
      <Sidebar
        role={role}
        teamName={teamName}
        user={user}
      />

      {/* Main Dashboard */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <Topbar
          role={role}
          teamName={teamName}
          user={user}
          onInviteClick={onInviteClick}
        />

        {/* Page Content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
