
import React, { useState } from "react";
import {
  CircleCheck,
  Mail,
  Clock3,
  Activity,
  MoreHorizontal,
  Check,
  CheckCheck,
  AtSign,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "task",
    title: "Task assigned to you",
    message: 'Rahul assigned "Review User Registration API" to you.',
    time: "8 minutes ago",
    reference: "TF-103",
    unread: true,
    mention: false,
  },
  {
    id: 2,
    type: "mention",
    title: "New mention",
    message: "Priya mentioned you in a comment on Website Redesign.",
    time: "34 minutes ago",
    reference: "Website Redesign",
    unread: true,
    mention: true,
  },
  {
    id: 3,
    type: "deadline",
    title: "Deadline approaching",
    message: "Implement JWT Authentication is due today.",
    time: "2 hours ago",
    reference: "TF-101",
    unread: false,
    mention: false,
  },
  {
    id: 4,
    type: "project",
    title: "Project status updated",
    message: "Mobile Application was marked At risk by Aman.",
    time: "Yesterday",
    reference: "Mobile Application",
    unread: false,
    mention: false,
  },
  {
    id: 5,
    type: "task",
    title: "Task completed",
    message: "Priya completed the Homepage UI Design task.",
    time: "Yesterday",
    reference: "TF-098",
    unread: true,
    mention: false,
  },
  {
    id: 6,
    type: "mention",
    title: "New mention",
    message: "Alex mentioned you in a project discussion.",
    time: "Yesterday",
    reference: "Customer CRM",
    unread: true,
    mention: true,
  },
  {
    id: 7,
    type: "project",
    title: "Project update",
    message: "Website Redesign progress has been updated.",
    time: "2 days ago",
    reference: "Website Redesign",
    unread: false,
    mention: false,
  },
  {
    id: 8,
    type: "deadline",
    title: "Upcoming deadline",
    message: "API Integration deadline is approaching.",
    time: "2 days ago",
    reference: "TF-092",
    unread: false,
    mention: false,
  },
  {
    id: 9,
    type: "task",
    title: "Task assigned to you",
    message: "Aman assigned a new task to you.",
    time: "3 days ago",
    reference: "TF-087",
    unread: false,
    mention: false,
  },
  {
    id: 10,
    type: "project",
    title: "Project status updated",
    message: "Customer CRM is now In Progress.",
    time: "3 days ago",
    reference: "Customer CRM",
    unread: false,
    mention: false,
  },
  {
    id: 11,
    type: "task",
    title: "Task completed",
    message: "Rahul completed API documentation.",
    time: "4 days ago",
    reference: "TF-081",
    unread: false,
    mention: false,
  },
  {
    id: 12,
    type: "mention",
    title: "New mention",
    message: "You were mentioned in a team update.",
    time: "5 days ago",
    reference: "Team update",
    unread: false,
    mention: false,
  },
];

const styles = {
  task: {
    icon: CircleCheck,
    color: "text-violet-300",
    bg: "bg-violet-500/15",
  },
  mention: {
    icon: Mail,
    color: "text-blue-300",
    bg: "bg-blue-500/15",
  },
  deadline: {
    icon: Clock3,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  project: {
    icon: Activity,
    color: "text-rose-300",
    bg: "bg-rose-500/15",
  },
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [activeTab, setActiveTab] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const unreadCount = notifications.filter(
    (n) => n.unread
  ).length;

  const mentionCount = notifications.filter(
    (n) => n.mention
  ).length;

  const tabs = [
    { name: "All", count: notifications.length },
    { name: "Unread", count: unreadCount },
    { name: "Mentions", count: mentionCount },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "Unread") return n.unread;
    if (activeTab === "Mentions") return n.mention;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
    setOpenMenu(null);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-6 text-xs text-slate-400">
              Acme Studio
              <span className="mx-3">/</span>
              <span className="font-semibold text-slate-200">
                Notifications
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Stay up to date with work that needs your attention.
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-700 bg-[#19233b] px-4 py-3 text-sm font-medium transition hover:bg-slate-700 disabled:opacity-50 sm:self-auto"
          >
            <Check size={17} />
            Mark all as read
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-2 overflow-x-auto border-b border-slate-700/80">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-xs font-medium ${
                activeTab === tab.name
                  ? "text-violet-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.name}

              <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                {tab.count}
              </span>

              {activeTab === tab.name && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-violet-500" />
              )}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="overflow-visible rounded-xl border border-slate-700/70 bg-[#151e33]">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const { icon: Icon, color, bg } =
                styles[item.type];

              return (
                <div
                  key={item.id}
                  className={`relative flex gap-3 border-b border-slate-700/70 p-4 transition last:border-b-0 hover:bg-[#1b2540] sm:gap-4 sm:px-5 sm:py-5 ${
                    item.unread ? "bg-[#19223a]" : ""
                  }`}
                >
                  {/* Notification Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${bg}`}
                  >
                    <Icon size={25} className={color} />
                  </div>

                  {/* Notification Content */}
                  <div className="min-w-0 flex-1 pr-7">
                    <h3 className="text-xs font-semibold text-white sm:text-sm">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {item.message}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 sm:text-[11px]">
                      <span>{item.time}</span>
                      <span>·</span>
                      <span className="font-semibold text-violet-400">
                        {item.reference}
                      </span>
                    </div>
                  </div>

                  {/* Notification Actions */}
                  <div className="absolute right-4 top-5 flex items-center gap-3 sm:right-5">
                    {item.unread && (
                      <span className="h-2 w-2 rounded-full bg-violet-500" />
                    )}

                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.id ? null : item.id
                        )
                      }
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
                      aria-label="Notification actions"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {openMenu === item.id && (
                      <div className="absolute right-0 top-8 z-30 w-48 rounded-lg border border-slate-700 bg-[#111a2e] p-1.5 shadow-xl">
                        {item.unread && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-700"
                          >
                            <CheckCheck size={15} />
                            Mark as read
                          </button>
                        )}

                        <button
                          onClick={() => removeNotification(item.id)}
                          className="w-full rounded-md px-3 py-2.5 text-left text-xs text-rose-400 hover:bg-rose-500/10"
                        >
                          Remove notification
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="mb-4 rounded-full bg-slate-800 p-4">
                <AtSign size={25} className="text-slate-400" />
              </div>

              <h3 className="text-sm font-semibold">
                No notifications found
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                There are no notifications in this category.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing {filteredNotifications.length} notifications
          </span>
          <span>{unreadCount} unread</span>
        </div>
      </div>

      {/* Click outside to close action menu */}
      {openMenu !== null && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-20 cursor-default"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
};


