
const cardStyles = {
  "My Tasks": {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="m8 12 2.5 2.5L16 9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    subtitle: "+3 this week",
  },

  "In Progress": {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="m4 16 5-5 4 3 7-8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 6h6v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    subtitle: "Active tasks",
  },

  "Due Today": {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    subtitle: "Due today",
  },

  Overdue: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M5 21V4m0 1h13l-3 4 3 4H5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    subtitle: "Needs attention",
  },
};

export const StateCard = ({ title, value, subtitle }) => {
  const style = cardStyles[title] || {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 12h16M12 4v16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    subtitle: "Task overview",
  };

  return (
    <div className="group min-w-0 rounded-xl border border-slate-800 bg-[#111a2e] p-4 transition duration-200 hover:border-violet-500/40 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-slate-400">
          {title}
        </p>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.iconColor}`}
        >
          {style.icon}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {value}
        </h2>

        <p className="text-xs text-slate-500">
          {subtitle || style.subtitle}
        </p>
      </div>
    </div>
  );
};

export default StateCard;
