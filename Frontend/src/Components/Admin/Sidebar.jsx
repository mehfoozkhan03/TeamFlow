
const navigation = [
  { name: "Overview", icon: "▦", active: true },
  { name: "My Tasks", icon: "☑" },
  { name: "Projects", icon: "▱" },
  { name: "Calendar", icon: "▦" },
  { name: "Notifications", icon: "♧", badge: 4 },
];

const personalNavigation = [
  { name: "Settings", icon: "⚙" },
  { name: "Help & Support", icon: "ⓘ" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[284px] flex-col border-r border-slate-800 bg-[#0f172a] px-4 py-6 text-white">
      {/* Logo */}
      <div className="mb-9 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold">
          T
        </div>

        <span className="text-xl font-bold tracking-wide">
          TeamFlow
        </span>
      </div>

      {/* Workspace */}
      <button
        type="button"
        className="mb-8 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-left transition hover:bg-slate-800"
      >
        <div>
          <p className="text-xs text-slate-400">WORKSPACE</p>
          <p className="mt-1 text-sm font-semibold">Acme Inc.</p>
        </div>

      </button>

      {/* Workspace Navigation */}
      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Workspace
      </p>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <button
            key={item.name}
            type="button"
            aria-current={item.active ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
              item.active
                ? "border-l-2 border-violet-500 bg-violet-600/20 font-semibold text-violet-200"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="w-5 text-center text-lg">
              {item.icon}
            </span>

            <span className="flex-1 text-left">{item.name}</span>

            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-semibold text-white">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Personal Navigation */}
      <p className="mb-3 mt-7 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Personal
      </p>

      <nav className="space-y-2">
        {personalNavigation.map((item) => (
          <button
            key={item.name}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <span className="w-5 text-center text-lg">
              {item.icon}
            </span>

            {item.name}
          </button>
        ))}
      </nav>

      {/* Bottom Profile */}
      <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-400/40 bg-violet-600 font-semibold text-white">
            A
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Khan Sir
            </p>

            <p className="truncate text-xs text-slate-400">
              Admin
            </p>
          </div>

          <button
            type="button"
            aria-label="Profile options"
            className="rounded-md px-1 text-lg text-slate-400 transition hover:text-white"
          >
            ⋯
          </button>
        </div>
      </div>
    </aside>
  );
};
