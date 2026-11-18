import React from "react";

const priorityStyle = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-orange-50 text-orange-600",
  Low: "bg-emerald-50 text-emerald-600",
};
const statusStyle = {
  "In Progress": "bg-violet-50 text-violet-700",
  "To Do": "bg-slate-100 text-slate-600",
  "In Review": "bg-sky-50 text-sky-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export const TaskTable = ({ tasks = [], compact = false }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] text-left">
      <thead className="border-y border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        <tr>
          <th className="px-6 py-3">Task name</th>
          <th className="px-5 py-3">Project</th>
          <th className="px-5 py-3">Priority</th>
          <th className="px-5 py-3">Due date</th>
          <th className="px-5 py-3">Status</th>
          {!compact && <th className="px-5 py-3"> </th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {tasks.map((task) => (
          <tr key={task.id} className="hover:bg-slate-50/70">
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked={task.status === "Completed"} className="h-4 w-4 rounded border-slate-300 accent-violet-600" />
                <span className="text-xs font-semibold text-slate-800">{task.title}</span>
              </div>
            </td>
            <td className="px-4 py-3.5 text-xs text-slate-500">{task.project}</td>
            <td className="px-4 py-3.5"><span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${priorityStyle[task.priority] || priorityStyle.Low}`}>● {task.priority}</span></td>
            <td className="px-4 py-3.5 text-xs text-slate-600">
              <span className={task.overdue ? "text-rose-500" : ""}>{task.dueDate}</span>
              {task.overdue && <span className="mt-1 block text-[10px] text-rose-500">Overdue</span>}
            </td>
            <td className="px-4 py-3.5"><span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${statusStyle[task.status] || statusStyle["To Do"]}`}>{task.status}</span></td>
            {!compact && <td className="px-4 py-3.5 text-slate-400">•••</td>}
          </tr>
        ))}
        {tasks.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">No tasks to display.</td></tr>}
      </tbody>
    </table>
  </div>
);
