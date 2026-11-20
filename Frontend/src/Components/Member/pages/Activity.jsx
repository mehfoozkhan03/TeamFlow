
import React, { useState } from "react";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  ClipboardList,
  FolderPlus,
  MessageSquare,
  Search,
  UserPlus,
} from "lucide-react";



// Sample team activity data using the five updated team members.
const events = [
  {
    person: "Abhishek",
    action: "completed",
    subject: "Database Schema Design",
    detail: "Mobile Application",
    time: "12 min ago",
    type: "completed",
  },
  {
    person: "Manish",
    action: "was assigned",
    subject: "Build Login Page UI",
    detail: "TeamFlow Website",
    time: "38 min ago",
    type: "task",
  },
  {
    person: "Shivam",
    action: "updated",
    subject: "API Integration",
    detail: "In Progress",
    time: "1 hr ago",
    type: "updated",
  },
  {
    person: "Sneha",
    action: "commented on",
    subject: "Dashboard Design",
    detail: "“I’ve added the new responsive states.”",
    time: "2 hrs ago",
    type: "comment",
  },
  {
    person: "Aditya",
    action: "announced",
    subject: "Mobile Application v2",
    detail: "New project",
    time: "Yesterday, 4:32 PM",
    type: "project",
  },
];

const icons = {
  completed: CheckCircle2,
  task: ClipboardList,
  updated: ActivityIcon,
  comment: MessageSquare,
  project: FolderPlus,
  member: UserPlus,
};

// Displays team activities with search and category filtering.
export const Activity = () => {
  const [filter, setFilter] = useState("All activity");
  const [search, setSearch] = useState("");

  const filtered = events.filter(
    (event) =>
      (filter === "All activity" || event.type === filter) &&
      `${event.person} ${event.subject} ${event.detail}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

        <main className="p-[30px] max-md:p-4">
          <h1 className="text-[30px] font-medium text-slate-900">
            Team Activity
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            See the latest updates and actions from your team.
          </p>

          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Team Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest updates from DevSquad.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400">
                  <Search size={16} />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search activity..."
                    className="w-36 text-xs outline-none"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
                >
                  <option>All activity</option>
                  <option value="completed">Completed</option>
                  <option value="task">Task assigned</option>
                  <option value="updated">Status updated</option>
                  <option value="comment">Comments</option>
                  <option value="project">Projects</option>
                  <option value="member">Members</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {filtered.map((event, index) => {
                const Icon = icons[event.type];

                return (
                  <div
                    key={`${event.person}-${event.subject}`}
                    className="relative flex gap-4"
                  >
                    {index !== filtered.length - 1 && (
                      <span className="absolute left-[17px] top-10 h-[calc(100%+12px)] w-px bg-slate-200" />
                    )}

                    <span className="z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600">
                      <Icon size={17} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-5 text-slate-600">
                        <b className="text-slate-800">{event.person}</b>{" "}
                        {event.action}{" "}
                        <b className="text-violet-700">{event.subject}</b>
                      </p>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {event.detail}
                      </p>
                    </div>

                    <span className="whitespace-nowrap pt-1 text-[10px] text-slate-400">
                      {event.time}
                    </span>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-400">
                  No activity found.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
  );
};
