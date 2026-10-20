const getToday = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "No due date";

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const isCompleted = (task) =>
  ["Completed", "Done"].includes(task.status);

export const UpcomingDeadlines = ({ tasks = [] }) => {
  const today = getToday();

  // Incomplete tasks due today or in the future
  const deadlineTasks = tasks
    .filter(
      (task) =>
        !isCompleted(task) &&
        /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate || "") &&
        task.dueDate >= today
    )
    .sort((a, b) => {
      const dateComparison = a.dueDate.localeCompare(b.dueDate);

      if (dateComparison !== 0) return dateComparison;

      // For same deadline, show higher priority first
      const priorityOrder = {
        Urgent: 0,
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return (
        (priorityOrder[a.priority] ?? 4) -
        (priorityOrder[b.priority] ?? 4)
      );
    })
    .slice(0, 5);

  // Incomplete tasks whose deadlines have passed
  const overdueTasks = tasks.filter(
    (task) =>
      !isCompleted(task) &&
      /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate || "") &&
      task.dueDate < today
  );

  return (
    <section className="h-fit overflow-hidden rounded-xl border border-slate-800 bg-[#111a2e]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
        <div>
          <h2 className="text-base font-semibold text-white">
            Upcoming Deadlines
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Keep track of important due dates
          </p>
        </div>

        <span className="text-xl text-slate-400" aria-hidden="true">
          ◷
        </span>
      </div>

      {/* Overdue Warning */}
      {overdueTasks.length > 0 && (
        <div className="mx-5 mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm font-medium text-red-400">
            {overdueTasks.length} overdue{" "}
            {overdueTasks.length === 1 ? "task" : "tasks"}
          </p>

          <p className="mt-1 text-xs text-red-300/70">
            These tasks need your attention.
          </p>
        </div>
      )}

      {/* Upcoming Deadline List */}
      {deadlineTasks.length > 0 ? (
        <div className="divide-y divide-slate-800">
          {deadlineTasks.map((task) => {
            const isDueToday = task.dueDate === today;

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 px-5 py-4 transition hover:bg-slate-800/30"
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    isDueToday ? "bg-amber-400" : "bg-violet-400"
                  }`}
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-slate-200">
                    {task.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {task.project || "No project"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs ${
                        isDueToday
                          ? "font-medium text-amber-400"
                          : "text-slate-400"
                      }`}
                    >
                      {isDueToday
                        ? "Due today"
                        : formatDate(task.dueDate)}
                    </span>

                    <span className="text-slate-700">•</span>

                    <span
                      className={`text-xs ${
                        task.priority === "Urgent"
                          ? "text-red-400"
                          : task.priority === "High"
                          ? "text-orange-400"
                          : task.priority === "Medium"
                          ? "text-amber-400"
                          : task.priority === "Low"
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }`}
                    >
                      {task.priority || "No"} priority
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center px-5 py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl text-slate-400">
            ◷
          </div>

          <p className="text-sm font-medium text-slate-300">
            No upcoming deadlines
          </p>

          <p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">
            Add a future due date to a task and it will appear here.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-center text-xs text-slate-500">
          Showing {deadlineTasks.length} of up to 5 upcoming tasks
        </p>
      </div>
    </section>
  );
};

export default UpcomingDeadlines;