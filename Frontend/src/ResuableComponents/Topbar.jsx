
import { Search, Bell, UserPlus } from "lucide-react";
import { useLocation } from "react-router-dom";

export const Topbar = ({
  role = "member",
  teamName = "Nova Studio",
  user = {},
  onInviteClick,
}) => {
  const location = useLocation();

  const pageName = location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ");

  const title = pageName
    ? pageName.charAt(0).toUpperCase() + pageName.slice(1)
    : "Overview";

  const fullName = user.name || "Team Member";

  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[77px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-8">

      {/* Breadcrumb */}
      <div className="hidden items-center gap-3 text-sm sm:flex">
        <span className="text-slate-400">Workspace</span>

        <span className="text-slate-300">/</span>

        <span className="text-slate-400">{teamName}</span>

        <span className="text-slate-300">/</span>

        <span className="font-semibold capitalize text-slate-800">
          {title}
        </span>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex min-w-0 items-center gap-3">

        {/* Search */}
        <div className="hidden w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 md:flex">
          <Search size={17} className="shrink-0 text-slate-400" />

          <input
            type="search"
            placeholder="Search tasks and projects..."
            className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-purple-600" />
        </button>

        {/* Invite Members - Leader only */}
        {role === "leader" && (
          <button
            type="button"
            onClick={onInviteClick}
            className="hidden items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-purple-100 transition hover:bg-purple-700 sm:flex"
          >
            <UserPlus size={17} />
            Invite Members
          </button>
        )}

        {/* User Avatar */}
        <button
          type="button"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {initials}
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-xs font-bold text-slate-800">
              {fullName}
            </p>

            <p className="text-[10px] capitalize text-slate-400">
              {role === "leader" ? "Team Leader" : "Member"}
            </p>
          </div>
        </button>

      </div>
    </header>
  );
};
