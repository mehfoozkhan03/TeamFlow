import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { getMemberNotifications } from "../../../Store/Member/Member";

import {
  Activity, Bell, CheckSquare, Folder, LayoutGrid, Settings,
  Users, UserRound, ChevronDown, MoreHorizontal
} from "lucide-react";

// Shared navigation for every TeamFlow member page.
const menuGroups = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Overview", to: "/member/overview", icon: LayoutGrid },
      { label: "My Tasks", to: "/member/tasks", icon: CheckSquare },
      { label: "Projects", to: "/member/projects", icon: Folder },
      { label: "Team Members", to: "/member/team", icon: Users },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Activity", to: "/member/activity", icon: Activity },
      { label: "Notifications", to: "/member/notifications", icon: Bell },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { label: "My Profile", to: "/member/profile", icon: UserRound },
      { label: "Settings", to: "/member/settings", icon: Settings },
    ],
  },
];

export const MemberSidebar = () => {
  // Get notification data from the shared Redux store.
  const tasks = useSelector((state) => state.member?.tasks ?? []);
  const readIds = useSelector(
    (state) => state.member?.readNotificationIds ?? []
  );

  const notifications = getMemberNotifications(tasks);

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item.id)
  ).length;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[244px] flex-col border-r border-slate-200 bg-white max-lg:hidden">
      <div className="flex h-[70px] items-center gap-2.5 px-5">
        <img src="/favicon.svg" alt="TeamFlow" className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <span className="block text-[20px] font-extrabold leading-6 tracking-tight text-slate-900">TeamFlow</span>
          <span className="block text-[11px] leading-4 text-slate-400">Work smarter together</span>
        </div>
      </div>

      <button className="mx-2.5 mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-xl font-bold text-white shadow-md shadow-violet-200">D</span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-slate-400">Current team</span>
          <span className="block text-base font-bold text-slate-900">DevSquad</span>
        </span>
        <ChevronDown size={16} className="text-slate-700" />
      </button>

      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-2.5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2.5 px-2.5 text-[10px] font-bold tracking-[0.12em] text-slate-400">{group.title}</p>

            <div className="space-y-1">
              {group.items.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[14px] font-medium transition-colors duration-300 ease-in-out active:translate-y-0.5 ${
                      isActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />

                  <span className="flex-1 transition-transform duration-150 ease-out group-active:-translate-y-0.5">
                    {label}
                  </span>

                  {label === "Notifications" && unreadCount > 0 && (
                    <span className="grid h-6 min-w-6 place-items-center rounded-full bg-violet-600 px-1.5 text-[11px] font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-2.5 flex items-center gap-3 border-t border-slate-200 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-sm font-bold text-white">RS</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">Rahul Sharma</p>
          <p className="text-xs text-slate-400">Team Member</p>
        </div>
        <MoreHorizontal size={20} className="text-slate-700" />
      </div>
    </aside>
  );
};