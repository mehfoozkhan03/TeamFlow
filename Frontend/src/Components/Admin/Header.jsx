
export const Header = ({
  search = "",
  setSearch = () => {},
  onQuickCreate = () => {},
}) => {
  // Render the dashboard header with search, quick-create, notifications, and profile actions.
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0b1020]">
      <div className="grid min-h-[68px] grid-cols-1 items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[1fr_minmax(280px,440px)_1fr] lg:px-8">

        {/* Display the current workspace location. */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Workspace</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-slate-600"
          >
            <path
              d="m9 18 6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="font-semibold text-slate-200">
            Overview
          </span>
        </div>

        {/* Allow users to search and clear the current search query. */}
        <div className="relative w-full">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m16 16 4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks, projects, people..."
            aria-label="Search tasks, projects and people"
            className="h-11 w-full rounded-xl border border-slate-700/70 bg-[#111a2e] pl-10 pr-24 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
          />

          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              ×
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-700 bg-[#0b1020] px-2 py-1 text-[11px] text-slate-400 sm:flex">
              <span>⌘</span>
              <span>K</span>
            </span>
          )}
        </div>

        {/* Provide quick-create, notification, and profile actions. */}
        <div className="flex items-center justify-between gap-3 sm:justify-end">

          {/* Open the task creation form through the parent callback. */}
          <button
            type="button"
            onClick={onQuickCreate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500 active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <span>Quick Create</span>
          </button>

          {/* Display the notification icon and unread notification count. */}
          <button
            type="button"
            aria-label="Notifications, 4 unread"
            title="Notifications"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-[21px] w-[21px]"
            >
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 21h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>

            <span className="absolute right-0.5 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#0b1020] bg-violet-500 px-1 text-[10px] font-bold text-white">
              4
            </span>
          </button>

          {/* Display the current user's avatar and profile label. */}
          <button
            type="button"
            aria-label="User profile"
            title="Alex Morgan"
            className="flex shrink-0 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/50 bg-gradient-to-br from-violet-500 to-indigo-700 text-xs font-bold text-white shadow-md shadow-violet-900/30">
              AM
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
