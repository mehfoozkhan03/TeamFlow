import React from "react";
import { Bell, ChevronDown, Search } from "lucide-react";

// Common top navigation bar used by all member pages.
export const MemberHeader = ({ pageTitle }) => {
  return (
    <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between gap-5 border-b border-slate-200 bg-white/95 px-[30px] backdrop-blur max-md:px-4">
      <div className="flex min-w-0 items-center gap-3 text-[13px]">
        <span className="text-slate-400">Workspace</span>
        <span className="text-slate-300">›</span>
        <span className="text-slate-400">DevSquad</span>
        <span className="text-slate-300">›</span>
        <span className="truncate font-semibold text-slate-800">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-[280px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 max-lg:hidden">
          <Search size={18} />
          <input className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400" placeholder="Search tasks and projects..." />
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px]">⌘ K</span>
        </div>
        <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <button className="flex items-center gap-3 pl-1">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-xs font-bold text-white">RS</span>
          <span className="text-left max-sm:hidden">
            <span className="block text-sm font-bold text-slate-800">Rahul</span>
            <span className="block text-[11px] text-slate-400">Member</span>
          </span>
          <ChevronDown size={15} className="text-slate-700" />
        </button>
      </div>
    </header>
  );
};
