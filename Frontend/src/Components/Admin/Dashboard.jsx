
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar";
import { Topbar } from "./Components/Topbar";

export const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1020]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#0b1020] p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
