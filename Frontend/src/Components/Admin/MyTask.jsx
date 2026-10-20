
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "teamflow_tasks";

// Store the team members available for task assignment.
const TEAM_MEMBERS = [
  { name: "Abhishek Gautam", initials: "AG" },
  { name: "Manish Parab", initials: "MP" },
  { name: "Sneha Gupta", initials: "SG" },
  { name: "Shivam Kesharwani", initials: "SK" },
];

// Get today's date in YYYY-MM-DD format.
const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

// Convert a date string into a readable date format.
const formatDate = (dateString) => {
  if (!dateString) return "No date";

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return "No date";

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Get collaborators from current or legacy task data.
const getTaskCollaborators = (task) => {
  if (Array.isArray(task.collaborators)) {
    return task.collaborators;
  }

  if (Array.isArray(task.initials)) {
    return task.initials;
  }

  return [];
};

// Resolve a collaborator's full name from their name or initials.
const getMemberName = (person) => {
  if (typeof person === "string") {
    const member = TEAM_MEMBERS.find(
      (item) => item.initials === person || item.name === person
    );

    return member?.name || person;
  }

  return person?.name || person?.initials || "";
};

// Generate initials for displaying a collaborator's avatar.
const getMemberInitials = (person) => {
  const name = getMemberName(person);

  const member = TEAM_MEMBERS.find((item) => item.name === name);

  if (member) return member.initials;

  return String(name)
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Standardize task status labels for consistent filtering.
const normalizeStatus = (status) => {
  if (status === "In Review") return "Review";
  if (status === "Completed") return "Done";

  return status || "To Do";
};

// Define shared styles for form inputs and dropdowns.
const inputClass =
  "w-full rounded-xl border border-[#33415b] bg-[#0b1020] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";

const selectClass =
  "w-full rounded-xl border border-[#33415b] bg-[#0b1020] px-3 py-3 text-sm text-slate-200 outline-none focus:border-purple-500 md:w-auto";

// Define colors for different task statuses.
const statusStyles = {
  "To Do": "bg-slate-500/15 text-slate-300",
  "In Progress": "bg-blue-500/15 text-blue-300",
  "In Review": "bg-amber-500/15 text-amber-300",
  Review: "bg-amber-500/15 text-amber-300",
  Completed: "bg-emerald-500/15 text-emerald-300",
  Done: "bg-emerald-500/15 text-emerald-300",
};

// Define colors for different task priorities.
const priorityStyles = {
  Low: "bg-slate-500/15 text-slate-300",
  Medium: "bg-blue-500/15 text-blue-300",
  High: "bg-orange-500/15 text-orange-300",
  Urgent: "bg-red-500/15 text-red-300",
};

// Create the default values for the task form.
const getInitialForm = () => ({
  name: "",
  project: "",
  priority: "Medium",
  status: "To Do",
  dueDate: getToday(),
  collaborators: [],
});

// Manage task creation, editing, filtering, selection, and deletion.
export default function MyTasks({
  tasks = [],
  setTasks,
  search = "",
  setSearch = () => {},
  openCreateForm = false,
  setOpenCreateForm = () => {},
}) {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeDateTab, setActiveDateTab] = useState("All");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [statusMenuId, setStatusMenuId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(getInitialForm);

  const isFormOpen = showForm || openCreateForm;

  // Open the create form when the parent component requests it.
  useEffect(() => {
    if (openCreateForm) {
      setForm(getInitialForm());
      setEditingTask(null);
      setShowForm(true);
    }
  }, [openCreateForm]);

  // Save updated tasks to React state and localStorage.
  const persistTasks = (updatedTasks) => {
    setTasks(updatedTasks);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Could not save tasks to localStorage:", error);
    }
  };

  // Open a fresh form for creating a new task.
  const openForm = () => {
    setForm(getInitialForm());
    setEditingTask(null);
    setShowForm(true);
    setOpenCreateForm(false);
  };

  // Close the form and reset its values.
  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setForm(getInitialForm());
    setOpenCreateForm(false);
  };

  // Update a specific field in the task form.
  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Add or remove a collaborator from the selected list.
  const toggleCollaborator = (name) => {
    setForm((previous) => ({
      ...previous,
      collaborators: previous.collaborators.includes(name)
        ? previous.collaborators.filter((item) => item !== name)
        : [...previous.collaborators, name],
    }));
  };

  // Load an existing task into the form for editing.
  const editTask = (task) => {
    const names = getTaskCollaborators(task)
      .map(getMemberName)
      .filter(Boolean);

    setForm({
      name: task.name || "",
      project: task.project || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      dueDate: task.dueDate || getToday(),
      collaborators: names,
    });

    setEditingTask(task);
    setShowForm(true);
    setOpenCreateForm(false);
    setStatusMenuId(null);
  };

  // Validate the form and create a new task or update an existing one.
  const handleSubmit = (event) => {
    event.preventDefault();

    const taskName = form.name.trim();

    if (!taskName) return;

    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              ...form,
              name: taskName,
              id: task.id,
            }
          : task
      );

      persistTasks(updatedTasks);
    } else {
      const newTask = {
        ...form,
        name: taskName,
        id: `task-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      };

      persistTasks([newTask, ...tasks]);
    }

    closeForm();
  };

  // Update a task's status and save the changes.
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: newStatus,
          }
        : task
    );

    persistTasks(updatedTasks);
    setStatusMenuId(null);
  };

  // Confirm and delete a single task.
  const deleteTask = (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    persistTasks(tasks.filter((task) => task.id !== taskId));

    setSelectedTasks((previous) =>
      previous.filter((id) => id !== taskId)
    );
  };

  // Select or deselect an individual task.
  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((previous) =>
      previous.includes(taskId)
        ? previous.filter((id) => id !== taskId)
        : [...previous, taskId]
    );
  };

  // Select or deselect all currently visible tasks.
  const toggleAllSelection = (checked, visibleTasks) => {
    const visibleIds = visibleTasks.map((task) => task.id);

    setSelectedTasks((previous) =>
      checked
        ? [...new Set([...previous, ...visibleIds])]
        : previous.filter((id) => !visibleIds.includes(id))
    );
  };

  // Confirm and delete all selected tasks.
  const deleteSelectedTasks = () => {
    if (!selectedTasks.length) return;

    if (
      !window.confirm(
        `Delete ${selectedTasks.length} selected task(s)?`
      )
    ) {
      return;
    }

    persistTasks(
      tasks.filter((task) => !selectedTasks.includes(task.id))
    );

    setSelectedTasks([]);
  };

  // Filter tasks by search text, status, priority, and due date.
  const filteredTasks = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const today = getToday();

    return tasks.filter((task) => {
      const collaborators = getTaskCollaborators(task)
        .map(getMemberName)
        .join(" ");

      const searchable = [
        task.name,
        task.project,
        task.id,
        task.status,
        task.priority,
        task.dueDate,
        collaborators,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText || searchable.includes(searchText);

      const matchesStatus =
        filterStatus === "All" ||
        normalizeStatus(task.status) === filterStatus;

      const matchesPriority =
        filterPriority === "All" ||
        (task.priority || "Medium") === filterPriority;

      const dueDate = task.dueDate || "";
      const isCompleted = ["Completed", "Done"].includes(task.status);

      const matchesDateTab =
        activeDateTab === "All" ||
        (activeDateTab === "Today" && dueDate === today) ||
        (activeDateTab === "Upcoming" &&
          dueDate > today &&
          !isCompleted) ||
        (activeDateTab === "Overdue" &&
          dueDate < today &&
          Boolean(dueDate) &&
          !isCompleted);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDateTab
      );
    });
  }, [tasks, search, filterStatus, filterPriority, activeDateTab]);

  // Check whether every visible task is selected.
  const allVisibleSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((task) => selectedTasks.includes(task.id));

  const dateTabs = ["All", "Today", "Upcoming", "Overdue"];

  // Calculate task counts for each date tab.
  const taskCounts = useMemo(() => {
    const today = getToday();

    return {
      All: tasks.length,
      Today: tasks.filter(
        (task) => task.dueDate === today
      ).length,
      Upcoming: tasks.filter(
        (task) =>
          task.dueDate > today &&
          !["Completed", "Done"].includes(task.status)
      ).length,
      Overdue: tasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate < today &&
          !["Completed", "Done"].includes(task.status)
      ).length,
    };
  }, [tasks]);

  return (
    <div className="space-y-5 text-white">
      {/* Display the page title and task creation button. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your tasks, deadlines and collaborators.
          </p>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          <span className="text-lg leading-none">+</span>
          Create Task
        </button>
      </div>

      {/* Display date tabs and their task counts. */}
      <div className="flex gap-5 overflow-x-auto border-b border-[#26344d]">
        {dateTabs.map((tab) => {
          const isActive = activeDateTab === tab;

          return (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveDateTab(tab)}
              className={`relative flex shrink-0 items-center gap-2 py-3 text-sm transition ${
                isActive
                  ? "font-semibold text-violet-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}

              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  isActive
                    ? "bg-purple-500/15 text-purple-200"
                    : "bg-[#172238] text-slate-400"
                }`}
              >
                {taskCounts[tab]}
              </span>

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Provide search and dropdown filters for the task list. */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#26344d] bg-[#111a2e] p-3 md:flex-row md:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks, projects or collaborators..."
          aria-label="Search tasks"
          className={`${inputClass} min-w-0 flex-1`}
        />

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          aria-label="Filter by status"
          className={selectClass}
        >
          <option value="All">All statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">In Review</option>
          <option value="Done">Completed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(event) => setFilterPriority(event.target.value)}
          aria-label="Filter by priority"
          className={selectClass}
        >
          <option value="All">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Show bulk actions when tasks are selected. */}
      {selectedTasks.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-purple-200">
            {selectedTasks.length} task(s) selected
          </span>

          <button
            type="button"
            onClick={deleteSelectedTasks}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete selected
          </button>
        </div>
      )}

      {/* Display filtered tasks with their details and actions. */}
      <div className="overflow-hidden rounded-2xl border border-[#26344d] bg-[#111a2e]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead className="bg-[#172238]">
              <tr className="border-b border-[#26344d]">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all visible tasks"
                    checked={allVisibleSelected}
                    onChange={(event) =>
                      toggleAllSelection(
                        event.target.checked,
                        filteredTasks
                      )
                    }
                    className="h-4 w-4 accent-purple-600"
                  />
                </th>

                {[
                  "Task",
                  "Project",
                  "Collaborators",
                  "Due Date",
                  "Priority",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#26344d]">
              {filteredTasks.map((task) => {
                const collaborators = getTaskCollaborators(task);
                const status = normalizeStatus(task.status);

                return (
                  <tr
                    key={task.id}
                    className="transition hover:bg-[#172238]/60"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${task.name}`}
                        checked={selectedTasks.includes(task.id)}
                        onChange={() =>
                          toggleTaskSelection(task.id)
                        }
                        className="h-4 w-4 accent-purple-600"
                      />
                    </td>

                    <td className="max-w-[250px] px-4 py-4">
                      <p className="truncate text-sm font-semibold text-slate-100">
                        {task.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {task.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-300">
                      {task.project || "—"}
                    </td>

                    <td className="px-4 py-4">
                      {collaborators.length > 0 ? (
                        <div className="flex items-center">
                          {collaborators.slice(0, 4).map((person, index) => (
                            <div
                              key={`${getMemberName(person)}-${index}`}
                              title={getMemberName(person)}
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111a2e] bg-purple-500/20 text-[10px] font-bold text-purple-200 ${
                                index > 0 ? "-ml-2" : ""
                              }`}
                            >
                              {getMemberInitials(person)}
                            </div>
                          ))}

                          {collaborators.length > 4 && (
                            <span className="ml-2 text-xs text-slate-400">
                              +{collaborators.length - 4}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      {formatDate(task.dueDate)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityStyles[task.priority] ||
                          priorityStyles.Medium
                        }`}
                      >
                        {task.priority || "Medium"}
                      </span>
                    </td>

                    <td className="relative px-4 py-4">
                      <button
                        type="button"
                        aria-expanded={statusMenuId === task.id}
                        onClick={() =>
                          setStatusMenuId((current) =>
                            current === task.id ? null : task.id
                          )
                        }
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                          statusStyles[task.status] ||
                          statusStyles[status] ||
                          statusStyles["To Do"]
                        }`}
                      >
                        {task.status || "To Do"} ▾
                      </button>

                      {/* Allow users to change a task's status. */}
                      {statusMenuId === task.id && (
                        <div className="absolute left-4 top-12 z-20 min-w-36 rounded-xl border border-[#26344d] bg-[#0b1020] p-1.5 shadow-xl">
                          {[
                            { label: "To Do", value: "To Do" },
                            {
                              label: "In Progress",
                              value: "In Progress",
                            },
                            {
                              label: "In Review",
                              value: "In Review",
                            },
                            {
                              label: "Completed",
                              value: "Completed",
                            },
                          ].map((option) => (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() =>
                                updateTaskStatus(
                                  task.id,
                                  option.value
                                )
                              }
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-[#172238] hover:text-white"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <button
                        type="button"
                        onClick={() => editTask(task)}
                        className="rounded-lg px-2 py-1 text-sm font-semibold text-purple-300 hover:bg-purple-500/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="ml-1 rounded-lg px-2 py-1 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Show a message when no tasks match the current filters. */}
              {filteredTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No tasks found for this tab and filter combination.
                    Try another tab or adjust your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Display the number of visible and total tasks. */}
        <div className="flex flex-col gap-2 border-t border-[#26344d] px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>

          {selectedTasks.length > 0 && (
            <span>
              {selectedTasks.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Display the modal for creating or editing a task. */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="my-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#26344d] bg-[#111a2e] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#26344d] px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Enter task details and assign collaborators.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-[#172238] hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Handle task form fields and form submission. */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Task Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="Enter task name"
                  required
                  autoFocus
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Project
                </label>

                <input
                  type="text"
                  value={form.project}
                  onChange={(event) =>
                    updateField("project", event.target.value)
                  }
                  placeholder="Enter project name"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      updateField("dueDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={(event) =>
                      updateField("priority", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Allow users to assign one or more team members. */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Collaborators
                </label>

                <p className="mb-3 text-xs text-slate-400">
                  Select one or more team members.
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TEAM_MEMBERS.map((member) => {
                    const checked = form.collaborators.includes(
                      member.name
                    );

                    return (
                      <label
                        key={member.name}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                          checked
                            ? "border-purple-500/60 bg-purple-500/10"
                            : "border-[#26344d] bg-[#0b1020] hover:bg-[#172238]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCollaborator(member.name)
                          }
                          className="h-4 w-4 accent-purple-600"
                        />

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-bold text-purple-200">
                          {member.initials}
                        </span>

                        <span className="text-sm font-medium text-slate-200">
                          {member.name}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {form.collaborators.length > 0 && (
                  <p className="mt-2 text-xs text-purple-300">
                    {form.collaborators.length} collaborator(s) selected
                  </p>
                )}
              </div>

              {/* Provide cancel and submit actions for the form. */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#26344d] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-[#33415b] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-[#172238]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
