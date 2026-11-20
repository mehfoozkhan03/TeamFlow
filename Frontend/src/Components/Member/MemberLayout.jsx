
import { Outlet } from "react-router-dom";

import { Sidebar } from "../../ResuableComponents/Sidebar";
import { Topbar } from "../../ResuableComponents/Topbar";

export const MemberLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Reusable Sidebar */}
      <Sidebar
        role="member"
        teamName="DevSquad"
        user={{ name: "Manish Parab" }}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Reusable Topbar */}
        <Topbar
          role="member"
          teamName="DevSquad"
          user={{ name: "Manish Parab" }}
        />

        {/* Dynamic Member Pages */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
