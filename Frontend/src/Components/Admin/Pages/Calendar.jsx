
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "JWT Authentication",
    date: "2025-05-22",
    color: "purple",
    project: "Backend",
    assignee: "Alex Morgan",
  },
  {
    id: 2,
    title: "Dashboard Layout",
    date: "2025-05-26",
    color: "yellow",
    project: "Frontend",
    assignee: "Alex Morgan",
  },
  {
    id: 3,
    title: "API Review",
    date: "2025-05-26",
    color: "pink",
    project: "Backend",
    assignee: "Sarah Chen",
  },
  {
    id: 4,
    title: "Settings Page",
    date: "2025-05-27",
    color: "blue",
    project: "Frontend",
    assignee: "Alex Morgan",
  },
  {
    id: 5,
    title: "Website launch",
    date: "2025-05-30",
    color: "green",
    project: "Marketing",
    assignee: "Sarah Chen",
  },
];

const colorStyles = {
  purple: "bg-violet-500/15 text-violet-300",
  yellow: "bg-amber-500/15 text-amber-300",
  pink: "bg-rose-500/15 text-rose-300",
  blue: "bg-blue-500/15 text-blue-300",
  green: "bg-emerald-500/15 text-emerald-300",
};

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const Calendar =  () => {
  const [currentDate, setCurrentDate] = useState(
    new Date(2025, 4, 1)
  );

  const [view, setView] = useState("Month");
  const [project, setProject] = useState("All projects");
  const [assignee, setAssignee] = useState("All assignees");
  const [tasks, setTasks] = useState(initialTasks);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    date: formatDate(new Date()),
    project: "Frontend",
    assignee: "Alex Morgan",
  });

  const today = new Date();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const projectMatch =
        project === "All projects" || task.project === project;

      const assigneeMatch =
        assignee === "All assignees" ||
        task.assignee === assignee;

      return projectMatch && assigneeMatch;
    });
  }, [tasks, project, assignee]);

  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const calendarStart = new Date(monthStart);
  calendarStart.setDate(
    monthStart.getDate() - monthStart.getDay()
  );

  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(
    monthEnd.getDate() + (6 - monthEnd.getDay())
  );

  const days = [];

  for (
    let date = new Date(calendarStart);
    date <= calendarEnd;
    date.setDate(date.getDate() + 1)
  ) {
    days.push(new Date(date));
  }

  const getWeekDates = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + i);
      return day;
    });
  };

  const displayedDays =
    view === "Month"
      ? days
      : view === "Week"
      ? getWeekDates()
      : [new Date(currentDate)];

  const navigate = (direction) => {
    const date = new Date(currentDate);

    if (view === "Month") {
      date.setMonth(date.getMonth() + direction);
    } else if (view === "Week") {
      date.setDate(date.getDate() + direction * 7);
    } else {
      date.setDate(date.getDate() + direction);
    }

    setCurrentDate(date);
  };

  const addTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.date) return;

    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        id: Date.now(),
        title: newTask.title.trim(),
        color: "purple",
      },
    ]);

    setShowTaskForm(false);

    setNewTask({
      title: "",
      date: formatDate(currentDate),
      project: "Frontend",
      assignee: "Alex Morgan",
    });
  };

  const title = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isToday = (date) =>
    formatDate(date) === formatDate(today);

  const changeView = (nextView) => {
    setView(nextView);
  };

  return (
    <section className="min-h-screen bg-[#0b1020] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Calendar heading */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Calendar
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Plan tasks, milestones, and deadlines across your workspace.
            </p>
          </div>

          <button
            onClick={() => {
              setNewTask((prev) => ({
                ...prev,
                date: formatDate(currentDate),
              }));
              setShowTaskForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-500"
          >
            <Plus size={17} />
            Add Task
          </button>
        </div>

        {/* Calendar container */}
        <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#111a2e]">
          {/* Calendar toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="rounded-lg border border-slate-700 bg-[#172238] px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Today
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous period"
                  className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  onClick={() => navigate(1)}
                  aria-label="Next period"
                  className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              <h2 className="ml-1 text-sm font-semibold text-white sm:text-base">
                {view === "Day"
                  ? currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : view === "Week"
                  ? `Week of ${getWeekDates()[0].toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}`
                  : title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Project filter */}
              <div className="relative">
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-700 bg-[#0e1729] py-2 pl-3 pr-8 text-xs text-slate-300 outline-none focus:border-violet-500"
                >
                  <option>All projects</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Marketing</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Assignee filter */}
              <div className="relative">
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-700 bg-[#0e1729] py-2 pl-3 pr-8 text-xs text-slate-300 outline-none focus:border-violet-500"
                >
                  <option>All assignees</option>
                  <option>Alex Morgan</option>
                  <option>Sarah Chen</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* View selector */}
              <div className="flex rounded-lg border border-slate-700 bg-[#0e1729] p-0.5">
                {["Month", "Week", "Day"].map((item) => (
                  <button
                    key={item}
                    onClick={() => changeView(item)}
                    className={`rounded-md px-3 py-1.5 text-xs transition ${
                      view === item
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Weekday headings */}
              <div
                className="grid border-b border-slate-700/80"
                style={{
                  gridTemplateColumns:
                    view === "Day"
                      ? "minmax(0, 1fr)"
                      : "repeat(7, minmax(0, 1fr))",
                }}
              >
                {(view === "Day"
                  ? [
                      currentDate.toLocaleDateString("en-US", {
                        weekday: "long",
                      }).toUpperCase(),
                    ]
                  : weekDays
                ).map((day) => (
                  <div
                    key={day}
                    className="border-r border-slate-700/60 px-3 py-3 text-center text-[10px] font-semibold tracking-wider text-slate-500 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Date cells */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns:
                    view === "Day"
                      ? "minmax(0, 1fr)"
                      : "repeat(7, minmax(0, 1fr))",
                }}
              >
                {displayedDays.map((date, index) => {
                  const dateKey = formatDate(date);

                  const dayTasks = filteredTasks.filter(
                    (task) => task.date === dateKey
                  );

                  const outsideMonth =
                    date.getMonth() !== currentDate.getMonth();

                  return (
                    <div
                      key={dateKey}
                      className={`group min-h-[125px] border-b border-r border-slate-700/60 p-2 transition hover:bg-slate-800/40 sm:min-h-[145px] sm:p-3 ${
                        view === "Day" ? "min-h-[400px]" : ""
                      } ${
                        view === "Month" && outsideMonth
                          ? "bg-[#0b1324]/60"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[11px] font-medium ${
                            isToday(date)
                              ? "bg-violet-500 text-white"
                              : outsideMonth
                              ? "text-slate-600"
                              : "text-slate-300"
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        <button
                          onClick={() => {
                            setNewTask((prev) => ({
                              ...prev,
                              date: dateKey,
                            }));
                            setShowTaskForm(true);
                          }}
                          aria-label={`Add task on ${dateKey}`}
                          className="hidden rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-white group-hover:block"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            title={`${task.title} · ${task.assignee} · ${task.project}`}
                            className={`cursor-default truncate rounded px-1.5 py-1 text-[10px] font-medium sm:text-[11px] ${
                              colorStyles[task.color] ||
                              colorStyles.purple
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add task modal */}
        {showTaskForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowTaskForm(false);
              }
            }}
          >
            <form
              onSubmit={addTask}
              className="w-full max-w-md space-y-4 rounded-2xl border border-slate-700 bg-[#111a2e] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Create task
                </h2>

                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">
                  Task name
                </label>
                <input
                  autoFocus
                  required
                  maxLength={150}
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter task name"
                  className="w-full rounded-lg border border-slate-700 bg-[#0b1020] px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">
                  Due date
                </label>
                <input
                  type="date"
                  required
                  value={newTask.date}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0b1020] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">
                  Project
                </label>
                <select
                  value={newTask.project}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      project: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0b1020] px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                >
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-300">
                  Assignee
                </label>
                <select
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      assignee: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0b1020] px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                >
                  <option>Alex Morgan</option>
                  <option>Sarah Chen</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500"
              >
                <Plus size={16} />
                Create task
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
