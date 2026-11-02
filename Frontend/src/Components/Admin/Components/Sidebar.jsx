import { NavLink } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  ListChecks,
  FolderKanban,
  CalendarDays,
  Users,
  ChartColumn,
  Bell,
  Settings,
  Sparkles,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";


const menuItems = [
  { name: "Overview", path: "/admin/overview", icon: LayoutDashboard },
  { name: "My Tasks", path: "/admin/mytask", icon: ListChecks },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Calendar", path: "/admin/calendar", icon: CalendarDays },
  { name: "Team", path: "/admin/team", icon: Users },
  { name: "Reports", path: "/admin/reports", icon: ChartColumn },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Settings", path: "/admin/setting", icon: Settings },
];


export const Sidebar = () => {
  return (
    <aside className="flex h-screen w-63 shrink-0 flex-col overflow-y-auto border-r border-[#253149] bg-[#0f172a] p-4 text-slate-200 scroll-smooth">

      {/* Brand */}
      <div className="mb-6 flex items-center gap-2.5 px-2 py-1">
        <div className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-violet-500 shadow-lg shadow-violet-500/20">
          <Zap size={22} fill="white" className="text-white" />
        </div>

        <h2 className="text-[21px] font-bold text-white">
          TeamFlow
        </h2>
      </div>

      {/* Workspace */}
      <button
        type="button"
        className="mb-5 flex items-center gap-3 rounded-xl border border-[#293650] bg-[#151f35] p-3 text-left transition hover:bg-[#1b2740]"
      >
        <div className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-full bg-linear-to-r from-purple-500 to-violet-700 text-xs font-bold text-white">
          AS
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-xs text-slate-400">
            Workspace
          </span>

          <strong className="text-sm font-semibold text-white">
            Acme Studio
          </strong>
        </div>

        <ChevronsUpDown size={16} className="shrink-0 text-slate-400" />
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/overview"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl border-l-[3px] px-2.5 py-3 text-sm transition-colors ${
                  isActive
                    ? "border-violet-500 bg-[#282348] font-medium text-violet-300"
                    : "border-transparent text-slate-400 hover:bg-[#1b2740] hover:text-white"
                }`
              }
            >
              <Icon
                size={19}
                strokeWidth={1.8}
                className="shrink-0"
              />

              <span className="flex-1">
                {item.name}
              </span>

              {item.name === "Notifications" && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                  5
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro plan */}
      <div className="mt-3 rounded-xl border border-[#38316c] bg-[#1a1d3b] p-3">
        <div className="flex items-center gap-2 text-sm text-violet-300">
          <Sparkles size={17} />
          <strong>Pro plan</strong>
        </div>

        <p className="my-3 text-xs text-slate-400">
          18 of 25 seats used
        </p>

        <div className="h-1.5 overflow-hidden rounded-full bg-[#29344a]">
          <div className="h-full w-[72%] rounded-full bg-violet-500" />
        </div>
      </div>

      {/* Profile */}
      <div className="mt-auto flex items-center gap-2.5 pt-6">
        <div className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-full bg-gradient-to-r from-purple-500 to-violet-700 text-xs font-bold text-white">
          AM
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <strong className="text-sm font-semibold text-white">
            Alex Morgan
          </strong>

          <span className="text-xs text-slate-400">
            Workspace Owner
          </span>
        </div>

        <button
          type="button"
          aria-label="Profile options"
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          <MoreHorizontal size={21} />
        </button>
      </div>
    </aside>
  );
}