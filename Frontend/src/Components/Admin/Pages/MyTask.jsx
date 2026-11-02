
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  List,
  LayoutGrid,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  ArrowUpDown,
  X,
  Check,
  ListChecks,
  CircleAlert,
  PlayCircle,
  Eye,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Redesign dashboard overview",
    description: "Update dashboard UI based on the latest design system.",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    assignee: { name: "Alex Morgan", initials: "AM", color: "bg-violet-500" },
    dueDate: "2026-10-29",
  },
  {
    id: 2,
    title: "Implement authentication flow",
    description: "Connect login and signup screens with the authentication API.",
    project: "Website Redesign",
    status: "To Do",
    priority: "High",
    assignee: { name: "John Doe", initials: "JD", color: "bg-blue-500" },
    dueDate: "2026-10-30",
  },
  {
    id: 3,
    title: "Create mobile navigation",
    description: "Make sidebar navigation responsive for mobile devices.",
    project: "Mobile Application",
    status: "In Review",
    priority: "Medium",
    assignee: { name: "Sarah Jones", initials: "SJ", color: "bg-emerald-500" },
    dueDate: "2026-11-01",
  },
  {
    id: 4,
    title: "Fix responsive layout issues",
    description: "Resolve spacing and overflow issues across screen sizes.",
    project: "Website Redesign",
    status: "To Do",
    priority: "Medium",
    assignee: { name: "Alex Morgan", initials: "AM", color: "bg-violet-500" },
    dueDate: "2026-11-02",
  },
  {
    id: 5,
    title: "Prepare project documentation",
    description: "Document the components, setup process, and API integration.",
    project: "Customer CRM",
    status: "Completed",
    priority: "Low",
    assignee: { name: "Mike Chen", initials: "MC", color: "bg-orange-500" },
    dueDate: "2026-10-26",
  },
  {
    id: 6,
    title: "Review feedback from the team",
    description: "Review the latest comments and update the design.",
    project: "Website Redesign",
    status: "In Progress",
    priority: "Low",
    assignee: { name: "Sarah Jones", initials: "SJ", color: "bg-emerald-500" },
    dueDate: "2026-11-04",
  },
];

const statusStyles = {
  "To Do": "bg-slate-500/10 text-slate-300 border-slate-500/20",
  "In Progress": "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "In Review": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

const priorityStyles = {
  High: "text-red-300 bg-red-500/10",
  Medium: "text-amber-300 bg-amber-500/10",
  Low: "text-emerald-300 bg-emerald-500/10",
};

const statusIcons = {
  "To Do": Circle,
  "In Progress": PlayCircle,
  "In Review": Eye,
  Completed: CheckCircle2,
};

const columns = ["To Do", "In Progress", "In Review", "Completed"];

const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const isOverdue = (task) =>
  task.status !== "Completed" &&
  new Date(`${task.dueDate}T23:59:59`) < new Date();

export const MyTask = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState(true);
  const [view, setView] = useState("list");
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "Website Redesign",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    assignee: "Alex Morgan",
  });

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    if (sortByDate) {
      result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    }

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortByDate]);

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: ListChecks,
      color: "text-violet-300",
      bg: "bg-violet-500/10",
    },
    {
      label: "In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
      icon: PlayCircle,
      color: "text-blue-300",
      bg: "bg-blue-500/10",
    },
    {
      label: "In Review",
      value: tasks.filter((t) => t.status === "In Review").length,
      icon: Eye,
      color: "text-amber-300",
      bg: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === "Completed").length,
      icon: CheckCircle2,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10",
    },
  ];

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "Completed" ? "To Do" : "Completed",
            }
          : task
      )
    );
  };

  const updateStatus = (id, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.dueDate) return;

    const people = {
      "Alex Morgan": {
        name: "Alex Morgan",
        initials: "AM",
        color: "bg-violet-500",
      },
      "John Doe": {
        name: "John Doe",
        initials: "JD",
        color: "bg-blue-500",
      },
      "Sarah Jones": {
        name: "Sarah Jones",
        initials: "SJ",
        color: "bg-emerald-500",
      },
      "Mike Chen": {
        name: "Mike Chen",
        initials: "MC",
        color: "bg-orange-500",
      },
    };

    const task = {
      ...newTask,
      id: Date.now(),
      assignee: people[newTask.assignee],
    };

    setTasks((prev) => [task, ...prev]);
    setShowModal(false);

    setNewTask({
      title: "",
      description: "",
      project: "Website Redesign",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignee: "Alex Morgan",
    });
  };

  return (
    <div className="min-h-full space-y-6 bg-[#0b1020] p-6 text-white">
      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-violet-300">My Tasks</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Tasks
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your tasks, track progress, and stay on top of deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white transition hover:bg-violet-600"
        >
          <Plus size={18} />
          Add Task
        </button>
      </header>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#253149] bg-[#151e33] p-4 transition hover:border-slate-600 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-400 sm:text-sm">
                  {stat.label}
                </span>

                <div className={`rounded-xl p-2 ${stat.bg} ${stat.color}`}>
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tasks in workspace
              </p>
            </div>
          );
        })}
      </section>

      {/* Task Content */}
      <section className="overflow-hidden rounded-2xl border border-[#253149] bg-[#151e33]">
        {/* Toolbar */}
        <div className="space-y-4 border-b border-[#253149] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-base font-semibold">All Tasks</h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredTasks.length} tasks found
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg border border-[#2b3852] bg-[#0f172a] p-1">
                <button
                  onClick={() => setView("list")}
                  title="List view"
                  aria-label="List view"
                  className={`rounded-md p-2 transition ${
                    view === "list"
                      ? "bg-violet-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List size={17} />
                </button>

                <button
                  onClick={() => setView("board")}
                  title="Board view"
                  aria-label="Board view"
                  className={`rounded-md p-2 transition ${
                    view === "board"
                      ? "bg-violet-500 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={17} />
                </button>
              </div>

              <button
                onClick={() => setSortByDate((prev) => !prev)}
                className="flex h-10 items-center gap-2 rounded-lg border border-[#2b3852] bg-[#0f172a] px-3 text-xs text-slate-300 transition hover:border-violet-500"
              >
                <ArrowUpDown size={15} />
                {sortByDate ? "Due date" : "Default order"}
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks, projects, assignees..."
                className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <div className="flex h-11 items-center gap-2 rounded-xl border border-[#2b3852] bg-[#0f172a] px-3">
              <SlidersHorizontal size={15} className="shrink-0 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="min-w-0 flex-1 bg-transparent text-xs text-slate-300 outline-none"
              >
                <option className="bg-[#0f172a]" value="All">All statuses</option>
                {columns.map((status) => (
                  <option className="bg-[#0f172a]" key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex h-11 items-center rounded-xl border border-[#2b3852] bg-[#0f172a] px-3">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
                className="w-full bg-transparent text-xs text-slate-300 outline-none"
              >
                <option className="bg-[#0f172a]" value="All">All priorities</option>
                {["High", "Medium", "Low"].map((priority) => (
                  <option className="bg-[#0f172a]" key={priority} value={priority}>
                    {priority} priority
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-[#253149] bg-[#111a2e]">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Task name</th>
                  <th className="px-4 py-4">Project</th>
                  <th className="px-4 py-4">Assignee</th>
                  <th className="px-4 py-4">Due date</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#253149]">
                {filteredTasks.map((task) => {
                  const StatusIcon = statusIcons[task.status];

                  return (
                    <tr
                      key={task.id}
                      className="group transition hover:bg-[#1b2640]/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleComplete(task.id)}
                            aria-label={`Toggle completion for ${task.title}`}
                            title="Toggle completion"
                            className={`mt-0.5 shrink-0 transition ${
                              task.status === "Completed"
                                ? "text-emerald-400"
                                : "text-slate-500 hover:text-violet-400"
                            }`}
                          >
                            {task.status === "Completed" ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>

                          <div className="min-w-0">
                            <p
                              className={`max-w-[250px] text-sm font-medium ${
                                task.status === "Completed"
                                  ? "text-slate-500 line-through"
                                  : "text-slate-200"
                              }`}
                            >
                              {task.title}
                            </p>
                            <p className="mt-1 max-w-[250px] truncate text-xs text-slate-500">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="whitespace-nowrap text-xs text-slate-400">
                          {task.project}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            title={task.assignee.name}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${task.assignee.color}`}
                          >
                            {task.assignee.initials}
                          </div>
                          <span className="whitespace-nowrap text-xs text-slate-300">
                            {task.assignee.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`flex items-center gap-1.5 whitespace-nowrap text-xs ${
                            isOverdue(task)
                              ? "text-red-300"
                              : "text-slate-400"
                          }`}
                        >
                          <CalendarDays size={14} />
                          {formatDate(task.dueDate)}
                          {isOverdue(task) && (
                            <span className="text-[10px]">(Overdue)</span>
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            size={14}
                            className={
                              task.status === "Completed"
                                ? "text-emerald-400"
                                : task.status === "In Progress"
                                  ? "text-blue-400"
                                  : task.status === "In Review"
                                    ? "text-amber-400"
                                    : "text-slate-500"
                            }
                          />
                          <select
                            aria-label={`Status for ${task.title}`}
                            value={task.status}
                            onChange={(e) =>
                              updateStatus(task.id, e.target.value)
                            }
                            className={`max-w-[125px] rounded-md border px-2 py-1.5 text-[11px] font-medium outline-none ${statusStyles[task.status]} bg-[#111a2e]`}
                          >
                            {columns.map((status) => (
                              <option
                                className="bg-[#0f172a] text-white"
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          aria-label={`Task options for ${task.title}`}
                          title="Task options"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-[#253149] hover:text-white"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTasks.length === 0 && (
              <EmptyState search={search} />
            )}
          </div>
        )}

        {/* Board View */}
        {view === "board" && (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 2xl:grid-cols-4">
            {columns.map((status) => {
              const columnTasks = filteredTasks.filter(
                (task) => task.status === status
              );

              return (
                <div
                  key={status}
                  className="min-w-0 rounded-xl border border-[#253149] bg-[#10192c] p-3"
                >
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === "Completed"
                            ? "bg-emerald-400"
                            : status === "In Progress"
                              ? "bg-blue-400"
                              : status === "In Review"
                                ? "bg-amber-400"
                                : "bg-slate-400"
                        }`}
                      />
                      <h3 className="text-xs font-semibold text-slate-200">
                        {status}
                      </h3>
                    </div>

                    <span className="rounded-md bg-[#253149] px-2 py-1 text-[10px] text-slate-300">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-[#2b3852] bg-[#151e33] p-4 transition hover:border-violet-500/50"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span
                            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${priorityStyles[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                          <button
                            type="button"
                            aria-label={`Task options for ${task.title}`}
                            className="text-slate-500 hover:text-white"
                          >
                            <MoreHorizontal size={17} />
                          </button>
                        </div>

                        <h4 className="text-sm font-semibold leading-5 text-white">
                          {task.title}
                        </h4>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                          {task.description}
                        </p>

                        <p className="mt-3 text-[11px] text-violet-300">
                          {task.project}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#253149] pt-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white ${task.assignee.color}`}
                              title={task.assignee.name}
                            >
                              {task.assignee.initials}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {task.assignee.name.split(" ")[0]}
                            </span>
                          </div>

                          <span
                            className={`flex items-center gap-1 text-[10px] ${
                              isOverdue(task)
                                ? "text-red-300"
                                : "text-slate-400"
                            }`}
                          >
                            <Clock3 size={12} />
                            {formatDate(task.dueDate)}
                          </span>
                        </div>

                        <select
                          aria-label={`Change status for ${task.title}`}
                          value={task.status}
                          onChange={(e) =>
                            updateStatus(task.id, e.target.value)
                          }
                          className="mt-3 w-full rounded-lg border border-[#2b3852] bg-[#0f172a] px-3 py-2 text-xs text-slate-300 outline-none focus:border-violet-500"
                        >
                          {columns.map((option) => (
                            <option
                              className="bg-[#0f172a]"
                              key={option}
                              value={option}
                            >
                              Move to {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="rounded-lg border border-dashed border-[#2b3852] px-3 py-8 text-center text-xs text-slate-500">
                        No tasks here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 border-t border-[#253149] px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
          <p className="text-xs text-slate-500">
            TeamFlow Workspace
          </p>
        </div>
      </section>

      {/* Add Task Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-task-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-[#2b3852] bg-[#151e33] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#253149] p-5">
              <div>
                <h2
                  id="create-task-title"
                  className="text-lg font-semibold text-white"
                >
                  Create new task
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add a task to your workspace.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-[#253149] hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-300">
                  Task name *
                </label>
                <input
                  autoFocus
                  required
                  maxLength={150}
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="e.g. Build the dashboard UI"
                  className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Describe the task..."
                  className="w-full resize-none rounded-xl border border-[#2b3852] bg-[#0f172a] p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Project
                  </label>
                  <select
                    value={newTask.project}
                    onChange={(e) =>
                      setNewTask({ ...newTask, project: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] px-3 text-sm text-slate-300 outline-none focus:border-violet-500"
                  >
                    {["Website Redesign", "Mobile Application", "Customer CRM"].map(
                      (project) => (
                        <option className="bg-[#0f172a]" key={project}>
                          {project}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Assignee
                  </label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask({ ...newTask, assignee: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] px-3 text-sm text-slate-300 outline-none focus:border-violet-500"
                  >
                    {["Alex Morgan", "John Doe", "Sarah Jones", "Mike Chen"].map(
                      (person) => (
                        <option className="bg-[#0f172a]" key={person}>
                          {person}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] px-3 text-sm text-slate-300 outline-none focus:border-violet-500"
                  >
                    {["High", "Medium", "Low"].map((priority) => (
                      <option className="bg-[#0f172a]" key={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Due date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] px-3 text-sm text-slate-300 outline-none focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Initial status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-[#2b3852] bg-[#0f172a] px-3 text-sm text-slate-300 outline-none focus:border-violet-500"
                  >
                    {columns.map((status) => (
                      <option className="bg-[#0f172a]" key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#253149] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 rounded-xl border border-[#2b3852] px-4 text-sm font-medium text-slate-300 transition hover:bg-[#253149]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-600"
                >
                  <Check size={17} />
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
    <div className="mb-4 rounded-2xl bg-violet-500/10 p-4 text-violet-300">
      {search ? <Search size={28} /> : <CircleAlert size={28} />}
    </div>
    <h3 className="text-sm font-semibold text-white">
      No tasks found
    </h3>
    <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
      Try adjusting your search or filters to find what you're looking for.
    </p>
  </div>
);
