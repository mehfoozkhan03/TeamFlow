import { useLocation } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  Bell,
} from "lucide-react";

const pageNames = {
  "/admin/overview": "Overview",
  "/admin/tasks": "My Tasks",
  "/admin/projects": "Projects",
  "/admin/calendar": "Calendar",
  "/admin/team": "Team",
  "/admin/reports": "Reports",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings",
};

export const Topbar = () => {
  const location = useLocation();

  const currentPage =
    pageNames[location.pathname.replace(/\/$/, "")] || "Dashboard";

  return (
    <header className="flex h-18 w-full shrink-0 items-center justify-between border-b border-[#253149] bg-[#0b1020] px-4 sm:px-6">

      {/* Breadcrumb */}
      <div className="flex shrink-0 items-center gap-3 text-sm">
        <span className="text-slate-400">
          Acme Studio
        </span>

        <span className="text-slate-600">/</span>

        <span className="font-semibold text-slate-200">
          {currentPage}
        </span>
      </div>

      {/* Actions */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Search */}
        <div className="hidden h-11 w-64 items-center gap-3 rounded-xl border border-[#253149] bg-[#101729] px-3 lg:flex">
          <Search size={19} className="shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Search anything..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
          />

          <kbd className="shrink-0 rounded-md border border-[#253149] px-1.5 py-1 text-xs text-slate-400">
            ⌘ K
          </kbd>
        </div>

        {/* Create New */}
        <button
          type="button"
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-violet-500 px-3 text-sm font-semibold text-white transition hover:bg-violet-600 sm:px-4 hover:-translate-y-0.5 duration-800"
        >
          <Plus size={19} />
          <span className="hidden sm:inline">Create New</span>
          <ChevronDown size={16} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#253149] text-slate-300 hover:bg-[#151f35]"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400" />
        </button>

        {/* Profile */}
        <button
          type="button"
          aria-label="User profile"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white"
        >
          AM
        </button>
      </div>
    </header>
  );
}