
import { NavLink } from "react-router-dom";
import { Users, ChevronDown, MoreHorizontal } from "lucide-react";
import { dashboardConfig } from "../Data/dashboardConfig";

export const Sidebar = ({
  role = "member",
  teamName = "Nova Studio",
  user = {},
}) => {
  const config = dashboardConfig[role] || dashboardConfig.member;

  const fullName = user.name || "Team Member";
  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="flex h-full w-[270px] shrink-0 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-[77px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-200">
          <Users size={22} />
        </div>

        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          Team<span className="text-purple-600">Flow</span>
        </h1>
      </div>

      {/* Team Selector */}
      <div className="px-4 py-5">
        <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-3 transition hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-600">
              {teamName.charAt(0).toUpperCase()}
            </div>

            <div className="text-left">
              <p className="text-[11px] text-slate-400">
                Current team
              </p>
              <p className="text-sm font-bold text-slate-800">
                {teamName}
              </p>
            </div>
          </div>

          <ChevronDown size={17} className="text-slate-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-4 pb-5">

        {config.sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 px-3 text-[10px] font-bold tracking-[1.5px] text-slate-400">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const path = `${config.basePath}/${item.path}`;

                return (
                  <NavLink
                    key={item.name}
                    to={path}
                    end={item.path === "overview"}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-all ${
                        isActive
                          ? "bg-purple-50 font-semibold text-purple-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-purple-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon size={19} strokeWidth={1.8} />
                          {item.name}
                        </div>

                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800">
              {fullName}
            </p>
            <p className="text-[10px] font-medium text-purple-600">
              {config.label}
            </p>
          </div>

          <button
            type="button"
            aria-label="More profile options"
            className="text-slate-400 hover:text-slate-700"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

    </aside>
  );
};
