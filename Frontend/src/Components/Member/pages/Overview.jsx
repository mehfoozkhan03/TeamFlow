import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Activity,
  AlertCircle,
  Check,
  Clock3,
  ClipboardList,
  Folder,
  ChevronRight,
} from "lucide-react";

import { MemberSidebar } from "../components/Sidebar";
import { MemberHeader } from "../components/MemberHeader";
import { StatisticCard } from "../components/StatisticCard";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { TaskTable } from "../components/TaskTable";

import { toggleTaskCompletion } from "../../../Store/Member/Member";

// Get today's date in YYYY-MM-DD format.
const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Check whether a task is overdue.
const isOverdue = (task) => {
  return (
    Boolean(task.dueDate) &&
    task.dueDate < getTodayDate() &&
    task.status !== "Completed"
  );
};

// Format ISO date into a readable date.
const formatDueDate = (date) => {
  if (!date) return "No deadline";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};


const activities = [
  [
    "Abhishek",
    "completed",
    "Database Schema Design",
    "Mobile Application",
    "12 min ago",
  ],
  [
    "Manish",
    "was assigned",
    "Build Login Page UI",
    "TeamFlow Website",
    "38 min ago",
  ],
  [
    "Shivam",
    "updated",
    "API Integration",
    "In Progress",
    "1 hr ago",
  ],
  [
    "Sneha",
    "commented on",
    "Dashboard Design",
    "I’ve added the new responsive states.",
    "2 hrs ago",
  ],
  [
    "Aditya",
    "announced",
    "Mobile Application v2",
    "New project",
    "Yesterday, 4:32 PM",
  ],
];


export const MemberDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read the shared task list from Redux.
  const tasks = useSelector(
    (state) => state.member?.tasks ?? []
  );

  // Calculate task counts whenever Redux task data changes.
  const taskCounts = {
    total: tasks.length,

    todo: tasks.filter(
      (task) => task.status === "To Do"
    ).length,

    inProgress: tasks.filter(
      (task) => task.status === "In Progress"
    ).length,

    inReview: tasks.filter(
      (task) => task.status === "In Review"
    ).length,

    completed: tasks.filter(
      (task) => task.status === "Completed"
    ).length,

    overdue: tasks.filter(isOverdue).length,
  };

  // Calculate workload chart segments from current task counts.
  const getChartGradient = () => {
    if (taskCounts.total === 0) {
      return "conic-gradient(#e5e7eb 0deg 360deg)";
    }

    const todo =
      (taskCounts.todo / taskCounts.total) * 360;

    const inProgress =
      (taskCounts.inProgress / taskCounts.total) * 360;

    const inReview =
      (taskCounts.inReview / taskCounts.total) * 360;

    const todoEnd = todo;
    const inProgressEnd = todoEnd + inProgress;
    const inReviewEnd = inProgressEnd + inReview;

    return `conic-gradient(
      #b99af8 0deg ${todoEnd}deg,
      #7028ed ${todoEnd}deg ${inProgressEnd}deg,
      #94a3b8 ${inProgressEnd}deg ${inReviewEnd}deg,
      #20b486 ${inReviewEnd}deg 360deg
    )`;
  };

  // Show incomplete tasks ordered by their due date.
  const upcomingTasks = [...tasks]
    .filter((task) => task.status !== "Completed")
    .sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate)
    )
    .slice(0, 3);

  // Update task status through the shared Redux store.
  const handleTaskToggle = (taskId) => {
    dispatch(toggleTaskCompletion(taskId));
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <MemberSidebar />

      <div className="min-h-screen lg:pl-[244px] xl:pl-[244px]">
        <MemberHeader pageTitle="Overview" />

        <main className="space-y-5 p-6 max-md:p-4">
          <WelcomeBanner />

          {/* Dynamic task statistic cards */}
          <section className="grid grid-cols-4 gap-3.5 max-xl:grid-cols-2 max-sm:grid-cols-1">
            <StatisticCard
              title="Assigned to Me"
              value={taskCounts.total}
              subtitle="Total assigned tasks"
              icon={ClipboardList}
              tone="violet"
            />

            <StatisticCard
              title="In Progress"
              value={taskCounts.inProgress}
              subtitle="Currently working on"
              icon={Clock3}
              tone="blue"
            />

            <StatisticCard
              title="Completed"
              value={taskCounts.completed}
              subtitle="Successfully completed"
              icon={Check}
              tone="green"
            />

            <StatisticCard
              title="Overdue"
              value={taskCounts.overdue}
              subtitle="Require attention"
              icon={AlertCircle}
              tone="red"
            />
          </section>

          {/* Tasks from the shared Redux store */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between p-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  My Tasks
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  Keep track of what needs your attention.
                </p>
              </div>

              <button
                onClick={() => navigate("/member/tasks")}
                className="flex items-center gap-2 text-[11px] font-semibold text-violet-600"
              >
                View all <ChevronRight size={16} />
              </button>
            </div>

            <TaskTable
              tasks={tasks.slice(0, 3)}
              onTaskToggle={handleTaskToggle}
            />
          </section>

          <div className="grid grid-cols-[1.7fr_1fr] gap-4 max-xl:grid-cols-1">
            {/* Dynamic workload chart */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    My Workload
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Your assigned task status.
                  </p>
                </div>

                <span className="text-slate-400">•••</span>
              </div>

              <div className="mt-5 flex items-center gap-7 max-sm:flex-col">
                <div
                  className="grid h-40 w-40 shrink-0 place-items-center rounded-full"
                  style={{
                    background: getChartGradient(),
                  }}
                >
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {taskCounts.total}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Total tasks
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-4 text-xs text-slate-500">
                  {[
                    ["To Do", taskCounts.todo, "bg-violet-300"],
                    [
                      "In Progress",
                      taskCounts.inProgress,
                      "bg-violet-600",
                    ],
                    [
                      "In Review",
                      taskCounts.inReview,
                      "bg-slate-300",
                    ],
                    [
                      "Completed",
                      taskCounts.completed,
                      "bg-emerald-500",
                    ],
                  ].map(([name, count, color]) => (
                    <div
                      key={name}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${color}`}
                      />

                      <span className="flex-1">{name}</span>

                      <b className="text-slate-900">{count}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-800">
                <Activity size={18} />

                <span>
                  <b>Keep going!</b> You’re making progress on your assigned tasks.
                </span>
              </div>
            </section>

            {/* Dynamic upcoming and overdue deadlines */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Upcoming Deadlines
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Plan ahead and stay on track.
                  </p>
                </div>

                <button className="text-[11px] font-semibold text-violet-600">
                  View calendar
                </button>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => {
                    const deadlineDate = task.dueDate
                      ? new Date(`${task.dueDate}T00:00:00`)
                      : null;

                    const day =
                      deadlineDate &&
                      !Number.isNaN(deadlineDate.getTime())
                        ? String(deadlineDate.getDate()).padStart(2, "0")
                        : "--";

                    const month =
                      deadlineDate &&
                      !Number.isNaN(deadlineDate.getTime())
                        ? deadlineDate
                            .toLocaleString("en-US", {
                              month: "short",
                            })
                            .toUpperCase()
                        : "--";

                    const overdue = isOverdue(task);

                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 py-4"
                      >
                        <div
                          className={`rounded-lg px-3 py-2 text-center ${
                            overdue
                              ? "bg-rose-50 text-rose-600"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          <b className="block text-lg">{day}</b>

                          <span className="text-[9px]">
                            {month}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800">
                            {task.title}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {task.project}
                          </p>

                          {overdue && (
                            <p className="mt-1 text-[10px] font-semibold text-rose-500">
                              Overdue
                            </p>
                          )}
                        </div>

                        <span className="rounded-md bg-rose-50 px-2 py-1 text-[9px] font-semibold text-rose-600">
                          {task.priority}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-5 text-center text-xs text-slate-400">
                    No pending deadlines.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Existing project section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  My Projects
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  Projects you’re contributing to.
                </p>
              </div>

              <button
                onClick={() => navigate("/member/projects")}
                className="text-[11px] font-semibold text-violet-600"
              >
                View all <ChevronRight className="inline" size={15} />
              </button>
            </div>

            {[
              ["TeamFlow Website", 72, "3 of 5", "Nov 20, 2026"],
              ["Mobile Application", 45, "2 of 4", "Nov 28, 2026"],
            ].map(([name, progress, completed, date]) => (
              <div
                key={name}
                className="grid grid-cols-[1.3fr_0.7fr_0.7fr_auto] items-center gap-5 border-t border-slate-100 py-5 max-md:grid-cols-1"
              >
                <div className="flex items-center gap-4">
                  <span className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Folder size={22} />
                  </span>

                  <div className="flex-1">
                    <b className="text-xs text-slate-900">
                      {name}
                    </b>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Overall project progress
                    </p>

                    <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-violet-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <b className="text-[10px] text-violet-600">
                    {progress}%
                  </b>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400">
                    My completed tasks
                  </p>

                  <b className="text-xs">{completed}</b>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400">
                    Deadline
                  </p>

                  <b className="text-xs">{date}</b>
                </div>

                <ChevronRight
                  className="text-slate-400"
                  size={20}
                />
              </div>
            ))}
          </section>

          {/* Existing activity section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Recent Team Activity
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  Latest updates from DevSquad.
                </p>
              </div>

              <button
                onClick={() => navigate("/member/activity")}
                className="text-[11px] font-semibold text-violet-600"
              >
                View all
              </button>
            </div>

            <div className="space-y-4">
              {activities.map(
                ([person, action, item, detail, time]) => (
                  <div
                    key={`${person}-${item}`}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-600">
                        <b className="text-slate-800">{person}</b>{" "}
                        {action}{" "}
                        <b className="text-violet-700">{item}</b>
                      </p>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {detail}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-[10px] text-slate-400">
                      {time}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};