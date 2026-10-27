
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { StateCard } from "./StateCard";
import MyTasks from "./MyTask";
import { UpcomingDeadlines } from "./UpcomingDeadline";

const STORAGE_KEY = "teamflow_tasks";


const initialTasks = [
  {
    id: "task-1",
    name: "Design Homepage UI",
    project: "Website Redesign",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-10-16",
    collaborators: ["Abhishek Gautam", "Manish Parab"],
  },
  {
    id: "task-2",
    name: "Implement Authentication",
    project: "Mobile App",
    priority: "High",
    status: "In Review",
    dueDate: "2026-10-17",
    collaborators: ["Shivam Kesharwani", "Sneha Gupta"],
  },
  {
    id: "task-3",
    name: "Update Documentation",
    project: "API Development",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-10-18",
    collaborators: ["Manish Parab"],
  },
  {
    id: "task-4",
    name: "Fix Responsive Layout",
    project: "Website Redesign",
    priority: "Low",
    status: "In Progress",
    dueDate: "2026-10-20",
    collaborators: ["Abhishek Gautam", "Shivam Kesharwani"],
  },
];


// Load tasks from localStorage
const getInitialTasks = () => {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks !== null) {
      const parsedTasks = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    }
  } catch (error) {
    console.error("Unable to load saved tasks:", error);
  }

  return initialTasks;
};

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const OverviewDashboard = () => {
  // Shared task data
  const [tasks, setTasks] = useState(getInitialTasks);

  // Independent search states
  const [headerSearch, setHeaderSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");

  // Shared task creation modal
  const [openCreateForm, setOpenCreateForm] = useState(false);

  // Save tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [tasks]);

  const today = getToday();

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const activeTasks = tasks.filter(
      (task) =>
        !["Completed", "Done"].includes(task.status)
    );

    return {
      total: tasks.length,

      inProgress: tasks.filter(
        (task) => task.status === "In Progress"
      ).length,

      dueToday: activeTasks.filter(
        (task) => task.dueDate === today
      ).length,

      overdue: activeTasks.filter(
        (task) => task.dueDate && task.dueDate < today
      ).length,

      completed: tasks.filter(
        (task) =>
          ["Completed", "Done"].includes(task.status)
      ).length,
    };
  }, [tasks, today]);

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      {/* Sidebar */}
      <Sidebar />

      <div className="ml-[284px] min-h-screen">
        {/* Header: independent search + Quick Create */}
        <Header
          search={headerSearch}
          setSearch={setHeaderSearch}
          onQuickCreate={() => setOpenCreateForm(true)}
        />

        <main className="p-8">
          {/* Dashboard heading */}
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">
                Good morning!
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Here's what's on your plate today.{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Dashboard statistics */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StateCard
              title="My Tasks"
              value={stats.total}
            />

            <StateCard
              title="In Progress"
              value={stats.inProgress}
            />

            <StateCard
              title="Due Today"
              value={stats.dueToday}
            />

            <StateCard
              title="Overdue"
              value={stats.overdue}
            />
          </div>

          {/* Task list + Upcoming deadlines */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]">
            <MyTasks
              tasks={tasks}
              setTasks={setTasks}
              search={taskSearch}
              setSearch={setTaskSearch}
              openCreateForm={openCreateForm}
              setOpenCreateForm={setOpenCreateForm}
            />

            <UpcomingDeadlines tasks={tasks} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OverviewDashboard;
