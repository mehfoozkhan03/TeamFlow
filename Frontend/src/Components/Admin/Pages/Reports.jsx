
import React from "react";
import {
  CheckCircle2,
  Zap,
  CircleAlert,
  Clock3,
  Download,
  ChevronDown,
  FolderKanban,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Tasks Completed",
    value: "148",
    change: "+12.5%",
    description: "vs last period",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    title: "Completion Rate",
    value: "84%",
    change: "+4.2%",
    description: "vs last period",
    icon: Zap,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
  },
  {
    title: "Overdue Tasks",
    value: "7",
    change: "-3",
    description: "vs last period",
    icon: CircleAlert,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
  },
  {
    title: "Avg. Completion Time",
    value: "2.4d",
    change: "-0.6d",
    description: "faster",
    icon: Clock3,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
];

const statusData = [
  { name: "Done", value: 148, color: "#8b5cf6" },
  { name: "In Progress", value: 46, color: "#3b82f6" },
  { name: "In Review", value: 21, color: "#f59e0b" },
  { name: "To Do", value: 33, color: "#475569" },
];

const projects = [
  { name: "Website Redesign", progress: 90, color: "bg-violet-500" },
  { name: "Mobile Application", progress: 65, color: "bg-blue-500" },
  { name: "Customer CRM", progress: 40, color: "bg-emerald-500" },
  { name: "Marketing Automation", progress: 24, color: "bg-amber-500" },
];

const members = [
  {
    name: "Alex Morgan",
    initials: "AM",
    assigned: 24,
    overdue: 3,
    progress: 86,
    color: "bg-violet-500",
  },
  {
    name: "Rahul Kapoor",
    initials: "RK",
    assigned: 18,
    overdue: 1,
    progress: 67,
    color: "bg-blue-500",
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    assigned: 16,
    overdue: 0,
    progress: 59,
    color: "bg-emerald-500",
  },
  {
    name: "Aman Patel",
    initials: "AP",
    assigned: 11,
    overdue: 2,
    progress: 42,
    color: "bg-amber-500",
  },
];

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-slate-700/70 bg-[#151e33] ${className}`}
  >
    {children}
  </div>
);

export const Reports = () => {
  const totalTasks = statusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const handleExport = () => {
    const rows = [
      ["Category", "Name", "Value"],
      ...stats.map((item) => [
        "Overview",
        item.title,
        item.value,
      ]),
      ...statusData.map((item) => [
        "Task Status",
        item.name,
        item.value,
      ]),
      ...projects.map((item) => [
        "Project Progress",
        item.name,
        `${item.progress}%`,
      ]),
      ...members.map((item) => [
        "Team Workload",
        item.name,
        item.assigned,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "teamflow-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-3 text-xs text-slate-400">
              Acme Studio <span className="mx-2">/</span>
              <span className="font-medium text-slate-200">
                Reports & Analytics
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Reports & Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Understand progress, identify bottlenecks, and make
              better decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#151e33] px-3 py-2 text-xs text-slate-300">
              May 1 - May 26
              <ChevronDown size={14} />
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#151e33] px-4 py-2 text-xs font-medium transition hover:bg-slate-700"
            >
              <Download size={15} />
              Export report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/70 bg-[#151e33] p-3">
          {["All projects", "All members", "Period: This month"].map(
            (filter) => (
              <button
                key={filter}
                className="flex items-center gap-2 rounded-md bg-[#202b45] px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-700"
              >
                {filter}
                <ChevronDown size={12} />
              </button>
            )
          )}

          <button className="ml-auto text-xs text-slate-400 hover:text-white">
            Reset
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2.5 ${item.bg} ${item.color}`}>
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      {item.title}
                    </p>

                    <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                      {item.value}
                    </h2>

                    <p className="mt-2 text-[11px]">
                      <span className="font-semibold text-emerald-400">
                        {item.change}
                      </span>
                      <span className="ml-1 text-slate-400">
                        {item.description}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.8fr_1fr]">

          {/* Task Completion Trend */}
          <Card className="min-w-0 p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">
                Task completion trend
              </h3>

              <button className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">
                Weekly
                <ChevronDown size={13} />
              </button>
            </div>

            <div className="w-full">
              <svg
                viewBox="0 0 700 190"
                className="h-auto w-full"
                role="img"
                aria-label="Illustrative upward task completion trend"
              >
                <defs>
                  <linearGradient
                    id="trendFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity=".30"
                    />
                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[35, 75, 115, 155].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="700"
                    y2={y}
                    stroke="#27334c"
                    strokeWidth="1"
                  />
                ))}

                <path
                  d="M0 138
                  C50 128 80 105 125 109
                  S180 123 225 105
                  S290 77 340 87
                  S410 57 455 55
                  S510 78 560 65
                  S640 38 700 20
                  L700 160 L0 160 Z"
                  fill="url(#trendFill)"
                />

                <path
                  d="M0 138
                  C50 128 80 105 125 109
                  S180 123 225 105
                  S290 77 340 87
                  S410 57 455 55
                  S510 78 560 65
                  S640 38 700 20"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {[
                  ["May 1", 0],
                  ["May 5", 116],
                  ["May 9", 233],
                  ["May 13", 350],
                  ["May 17", 467],
                  ["May 21", 584],
                  ["May 25", 700],
                ].map(([label, x]) => (
                  <text
                    key={label}
                    x={x}
                    y="183"
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor={
                      x === 0
                        ? "start"
                        : x === 700
                        ? "end"
                        : "middle"
                    }
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          </Card>

          {/* Tasks By Status */}
          <Card className="p-4 sm:p-5">
            <h3 className="mb-6 text-sm font-semibold">
              Tasks by status
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-6 py-3">
              <div
                className="relative h-40 w-40 shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    ${statusData
                      .map((item, index) => {
                        const start =
                          (statusData
                            .slice(0, index)
                            .reduce((sum, d) => sum + d.value, 0) /
                            totalTasks) *
                          100;

                        const end =
                          ((statusData
                            .slice(0, index + 1)
                            .reduce((sum, d) => sum + d.value, 0)) /
                            totalTasks) *
                          100;

                        return `${item.color} ${start}% ${end}%`;
                      })
                      .join(",")}
                  )`,
                }}
              >
                <div className="absolute inset-5.5 flex flex-col items-center justify-center rounded-full bg-[#151e33]">
                  <span className="text-2xl font-semibold">
                    {totalTasks}
                  </span>
                  <span className="mt-1 text-[10px] text-slate-400">
                    Total tasks
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {statusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex min-w-32.5 items-center gap-2"
                  >
                    <span
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />

                    <span className="text-xs text-slate-400">
                      {item.name}
                    </span>

                    <span className="ml-auto text-xs font-semibold text-slate-200">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Project Progress + Team Workload */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">

          {/* Project Progress */}
          <Card className="p-4 sm:p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban size={17} className="text-slate-400" />
                <h3 className="text-sm font-semibold">
                  Project progress
                </h3>
              </div>

              <button className="text-xs font-medium text-violet-400 hover:text-violet-300">
                View projects
              </button>
            </div>

            <div className="space-y-6">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[150px_1fr_36px]"
                >
                  <span className="text-xs font-medium text-slate-300">
                    {project.name}
                  </span>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#27334c]">
                    <div
                      className={`h-full rounded-full ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-200 sm:text-right">
                    {project.progress}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Team Workload */}
          <Card className="p-4 sm:p-5">
            <div className="mb-6 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users size={17} className="text-slate-400" />
                <h3 className="text-sm font-semibold">
                  Team workload
                </h3>
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">
                Assigned
                <ChevronDown size={12} />
              </button>
            </div>

            <div className="space-y-5">
              {members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${member.color}`}
                  >
                    {member.initials}
                  </div>

                  <div className="w-23.75 shrink-0">
                    <p className="truncate text-[11px] font-medium text-slate-200">
                      {member.name}
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {member.assigned} assigned
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#27334c]">
                      <div
                        className={`h-full rounded-full ${member.color}`}
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="w-13.75 shrink-0 text-right text-[9px] text-slate-400">
                    {member.overdue} overdue
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500">
          <span>TeamFlow Analytics</span>
          <span>Report overview</span>
        </div>

      </div>
    </div>
  );
};

export default Reports;
