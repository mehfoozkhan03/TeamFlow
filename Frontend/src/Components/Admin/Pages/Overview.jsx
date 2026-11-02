
import {
  CalendarDays,
  Plus,
  FolderKanban,
  CircleCheck,
  CircleAlert,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckSquare,
  Clock3,
  MoreHorizontal,
  ArrowRight,
  Activity,
} from "lucide-react";

import { useNavigate,Link } from "react-router-dom";

const stats = [
  {
    title: "Active Projects",
    value: 12,
    change: "+2",
    description: "this month",
    icon: FolderKanban,
    color: "text-violet-300",
    iconBg: "bg-violet-500/15",
    positive: true,
  },
  {
    title: "Tasks Completed",
    value: 148,
    change: "+12.5%",
    description: "this month",
    icon: CircleCheck,
    color: "text-emerald-300",
    iconBg: "bg-emerald-500/15",
    positive: true,
  },
  {
    title: "Overdue Tasks",
    value: 7,
    change: "-3",
    description: "since last week",
    icon: CircleAlert,
    color: "text-red-300",
    iconBg: "bg-red-500/15",
    positive: false,
  },
  {
    title: "Team Members",
    value: 24,
    change: "+4",
    description: "this month",
    icon: Users,
    color: "text-blue-300",
    iconBg: "bg-blue-500/15",
    positive: true,
  },
];

const projects = [
  {
    name: "Website Redesign",
    initials: "WR",
    due: "May 30",
    progress: 90,
    color: "bg-violet-500",
    avatar: "bg-violet-500/15 text-violet-300",
    status: "On track",
  },
  {
    name: "Mobile Application",
    initials: "MA",
    due: "Jun 14",
    progress: 65,
    color: "bg-blue-500",
    avatar: "bg-blue-500/15 text-blue-300",
    status: "At risk",
  },
  {
    name: "Customer CRM",
    initials: "CC",
    due: "Jul 08",
    progress: 40,
    color: "bg-emerald-500",
    avatar: "bg-emerald-500/15 text-emerald-300",
    status: "On track",
  },
];

const weeklyData = [
  { day: "Mon", value: 16 },
  { day: "Tue", value: 28 },
  { day: "Wed", value: 21 },
  { day: "Thu", value: 37 },
  { day: "Fri", value: 31 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 23 },
];

const taskStats = [
  {
    label: "Completed",
    value: 148,
    color: "bg-emerald-400",
  },
  {
    label: "In progress",
    value: 32,
    color: "bg-blue-400",
  },
  {
    label: "To do",
    value: 18,
    color: "bg-violet-400",
  },
  {
    label: "Overdue",
    value: 7,
    color: "bg-red-400",
  },
];

const activities = [
  {
    initials: "AM",
    name: "Alex Morgan",
    action: "created a new project",
    target: "Website Redesign",
    time: "10 min ago",
    color: "bg-violet-500/15 text-violet-300",
  },
  {
    initials: "JD",
    name: "John Doe",
    action: "completed a task",
    target: "Update homepage UI",
    time: "30 min ago",
    color: "bg-blue-500/15 text-blue-300",
  },
  {
    initials: "SJ",
    name: "Sarah Jones",
    action: "joined the team",
    target: "Mobile Application",
    time: "1 hour ago",
    color: "bg-emerald-500/15 text-emerald-300",
  },
];

const cardStyle =
  "rounded-2xl border border-[#253149] bg-[#151e33] p-5 shadow-sm";

export const Overview = () => {
  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-full space-y-5 bg-[#0b1020] p-6 text-white">

      {/* Header */}
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Good morning, Alex.
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Here's what's happening across your workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#253149] bg-[#111a2e] px-3 text-sm text-slate-300">
            <CalendarDays size={17} className="text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="flex h-11 items-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white transition hover:bg-violet-600 hover:-translate-y-0.5 duration-200"
          >
            <Plus size={19} />
            Create Project
          </button>
        </div>
      </header>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`${cardStyle} transition duration-200  hover:border-slate-600`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    stat.positive
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-red-400/10 text-red-300"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.change}
                </span>

                <span className="text-xs text-slate-400">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Project Progress + Task Completion */}
      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.3fr_0.9fr]">

        {/* Project Progress */}
        <div className={cardStyle}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">
              Project progress
            </h2>

            <button
              onClick={() => navigate("/admin/projects")}
              className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-[#253149]">
            {projects.map((project) => (
              <div key={project.name} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${project.avatar}`}
                  >
                    {project.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {project.name}
                      </h3>

                      <span className="text-xs text-slate-400">
                        Due {project.due}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 sm:gap-3">
                      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#26324a]">
                        <div
                          className={`h-full rounded-full ${project.color}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                      <span className="text-xs font-bold text-white">
                        {project.progress}%
                      </span>

                      <span
                        className={`hidden shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold sm:inline-block ${
                          project.status === "At risk"
                            ? "bg-red-400/10 text-red-300"
                            : "bg-emerald-400/10 text-emerald-300"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className={cardStyle}>
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">
              Task completion
            </h2>

            <select
              defaultValue="week"
              aria-label="Task completion period"
              className="rounded-lg border border-[#253149] bg-[#111a2e] px-3 py-2 text-xs text-slate-300 outline-none focus:border-violet-500"
            >
              <option value="week">This week</option>
            </select>
          </div>

          {/* CSS Bar Chart */}
          <div className="relative">
            <div className="absolute inset-0 flex flex-col justify-between pb-7">
              {[40, 30, 20, 10, 0].map((number) => (
                <div
                  key={number}
                  className="flex items-center gap-2"
                >
                  <span className="w-5 text-[10px] text-slate-500">
                    {number}
                  </span>

                  <div className="h-px flex-1 border-t border-dashed border-[#253149]" />
                </div>
              ))}
            </div>

            <div className="relative flex h-48 items-end justify-between gap-2 pl-7">
              {weeklyData.map((item) => (
                <div
                  key={item.day}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <div
                    title={`${item.value} tasks`}
                    className={`w-full max-w-9 rounded-t-md transition-colors hover:bg-violet-400 ${
                      item.day === "Sat"
                        ? "bg-violet-500"
                        : "bg-violet-500/40"
                    }`}
                    style={{
                      height: `${(item.value / 40) * 100}%`,
                    }}
                  />

                  <span className="mt-2 text-[10px] text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-[#253149] pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">
                {weeklyData.reduce((sum, item) => sum + item.value, 0)} tasks
              </span>

              <span className="text-xs text-emerald-300">
                <ArrowUpRight size={13} className="inline" />
                Weekly sample activity
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Task Overview + Recent Activity */}
      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-2">

        {/* Task Overview */}
        <div className={cardStyle}>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare size={19} className="text-violet-400" />
              <h2 className="text-base font-semibold text-white">
                Task overview
              </h2>
            </div>

            <Link
              to="/admin/mytask"
              className="text-xs font-medium text-violet-400 hover:text-violet-300"
            >
              View all tasks
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold text-white">205</p>
              <p className="mt-1 text-xs text-slate-400">
                Tasks in this overview
              </p>
            </div>

            <div className="rounded-lg bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300">
              All task statuses
            </div>
          </div>

          <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-[#26324a]">
            {taskStats.map((task) => (
              <div
                key={task.label}
                className={`${task.color} transition-all`}
                style={{
                  width: `${(task.value / 205) * 100}%`,
                }}
                title={`${task.label}: ${task.value}`}
              />
            ))}
          </div>

          <div className="space-y-4">
            {taskStats.map((task) => (
              <div key={task.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${task.color}`} />
                    <span className="text-slate-300">
                      {task.label}
                    </span>
                  </div>

                  <span className="font-semibold text-white">
                    {task.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={cardStyle}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={19} className="text-violet-400" />
              <h2 className="text-base font-semibold text-white">
                Recent activity
              </h2>
            </div>

            <button
              type="button"
              className="text-xs font-medium text-violet-400 hover:text-violet-300"
              onClick={() => navigate("/admin/notifications")}
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-[#253149]">
            {activities.map((activity) => (
              <div
                key={activity.name}
                className="flex gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${activity.color}`}
                >
                  {activity.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-6 text-slate-300">
                    <span className="font-semibold text-white">
                      {activity.name}
                    </span>{" "}
                    {activity.action}
                  </p>

                  <p className="truncate text-sm font-medium text-violet-300">
                    {activity.target}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 size={12} />
                    {activity.time}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`More options for ${activity.name}`}
                  className="h-fit rounded-lg p-1 text-slate-500 hover:bg-[#253149] hover:text-white"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
