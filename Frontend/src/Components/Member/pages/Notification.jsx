
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  CheckCheck,
  ClipboardList,
  Clock3,
  MessageSquare,
  Megaphone,
} from "lucide-react";



import {
  getMemberNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../../Store/Member/Member";

const notificationIcon = {
  task: [ClipboardList, "bg-violet-50 text-violet-600"],
  deadline: [Clock3, "bg-orange-50 text-orange-600"],
  message: [MessageSquare, "bg-sky-50 text-sky-600"],
  done: [Check, "bg-emerald-50 text-emerald-600"],
  announcement: [Megaphone, "bg-violet-50 text-violet-600"],
};

export const Notification = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("All");

  // Get tasks and read notification IDs from Redux.
  const tasks = useSelector((state) => state.member?.tasks ?? []);
  const readIds = useSelector(
    (state) => state.member?.readNotificationIds ?? []
  );

  // Generate notifications from the latest task data.
  const notifications = getMemberNotifications(tasks).map((item) => ({
    ...item,
    unread: !readIds.includes(item.id),
  }));

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const visible = notifications.filter(
    (item) => tab === "All" || item.unread
  );

  // Mark all notifications as read.
  const markAllRead = () => {
    dispatch(
      markAllNotificationsRead(notifications.map((item) => item.id))
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

        <main className="p-[30px] max-md:p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-medium text-slate-900">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Stay up to date with your assignments and team.
              </p>
            </div>

            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </div>

          <section className="mt-7 max-w-[1090px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex gap-6 border-b border-slate-200 px-6">
              {["All", "Unread"].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`relative py-4 text-xs font-semibold ${
                    tab === item
                      ? "text-violet-700"
                      : "text-slate-500"
                  }`}
                >
                  {item}

                  <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                    {item === "All" ? notifications.length : unreadCount}
                  </span>

                  {tab === item && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {visible.map((item) => {
                const [Icon, style] = notificationIcon[item.type];

                return (
                  <button
                    key={item.id}
                    onClick={() => dispatch(markNotificationRead(item.id))}
                    className={`flex w-full items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 ${
                      item.unread ? "bg-violet-50/30" : "bg-white"
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl p-3 ${style}`}
                    >
                      <Icon size={21} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <b className="block text-xs text-slate-900">
                        {item.title}
                      </b>

                      <span className="mt-2 block text-xs text-slate-500">
                        {item.description}
                      </span>

                      <span className="mt-1 block text-[9px] text-slate-400">
                        {item.time}
                      </span>
                    </span>

                    {item.unread && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-violet-600" />
                    )}
                  </button>
                );
              })}

              {visible.length === 0 && (
                <p className="p-10 text-center text-sm text-slate-400">
                  No unread notifications.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
  );
};
