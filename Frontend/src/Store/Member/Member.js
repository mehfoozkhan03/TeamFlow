
import { createSlice } from "@reduxjs/toolkit";

// Team members shared across Member pages.
const teamMembers = [
  {
    id: 1,
    name: "Abhishek",
    initials: "AB",
    role: "Team Member",
    responsibility: "Assigned project tasks",
  },
  {
    id: 2,
    name: "Manish",
    initials: "MA",
    role: "Team Member",
    responsibility: "Assigned project tasks",
  },
  {
    id: 3,
    name: "Shivam",
    initials: "SH",
    role: "Team Member",
    responsibility: "Assigned project tasks",
  },
  {
    id: 4,
    name: "Sneha",
    initials: "SN",
    role: "Team Member",
    responsibility: "Assigned project tasks",
  },
  {
    id: 5,
    name: "Aditya",
    initials: "AD",
    role: "Team Member",
    responsibility: "Assigned project tasks",
  },
];

// Initial task data shared across Member pages.
const initialState = {
  teamMembers,

  tasks: [
    {
      id: 1,
      title: "Design Dashboard Components",
      project: "TeamFlow Website",
      priority: "Medium",
      dueDate: "2026-11-07",
      status: "To Do",
      assignee: "Abhishek",
      initials: "AB",
    },
    {
      id: 2,
      title: "Write empty state copy",
      project: "TeamFlow Website",
      priority: "Low",
      dueDate: "2026-11-10",
      status: "To Do",
      assignee: "Manish",
      initials: "MA",
    },
    {
      id: 3,
      title: "Build Login Page UI",
      project: "TeamFlow Website",
      priority: "High",
      dueDate: "2026-11-05",
      status: "In Progress",
      assignee: "Shivam",
      initials: "SH",
    },
    {
      id: 4,
      title: "API Integration Testing",
      project: "Mobile Application",
      priority: "High",
      dueDate: "2026-11-08",
      status: "In Progress",
      assignee: "Sneha",
      initials: "SN",
    },
    {
      id: 5,
      title: "Validate authentication flow",
      project: "TeamFlow Website",
      priority: "Medium",
      dueDate: "2026-11-12",
      status: "In Progress",
      assignee: "Aditya",
      initials: "AD",
    },
    {
      id: 6,
      title: "Connect signup form API",
      project: "Mobile Application",
      priority: "Medium",
      dueDate: "2026-11-14",
      status: "In Progress",
      assignee: "Abhishek",
      initials: "AB",
    },
    {
      id: 7,
      title: "Create Responsive Navbar",
      project: "TeamFlow Website",
      priority: "Low",
      dueDate: "2026-11-03",
      status: "Completed",
      assignee: "Manish",
      initials: "MA",
    },
    {
      id: 8,
      title: "Review API documentation",
      project: "Mobile Application",
      priority: "Low",
      dueDate: "2026-11-15",
      status: "Completed",
      assignee: "Shivam",
      initials: "SH",
    },
  ],

  readNotificationIds: [],
};

// Generate notifications from current task data.
export const getMemberNotifications = (tasks) => {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return tasks.map((task) => {
    const isCompleted = task.status === "Completed";
    const isOverdue =
      task.dueDate && task.dueDate < today && !isCompleted;

    return {
      id: `${task.id}-${task.status}-${isOverdue ? "overdue" : "normal"}`,

      title: isOverdue
        ? "Deadline passed"
        : isCompleted
        ? "Task completed"
        : task.status === "In Progress"
        ? "Task status updated"
        : "Task assigned",

      description: isOverdue
        ? `${task.title} assigned to ${task.assignee} is overdue.`
        : isCompleted
        ? `${task.assignee} completed "${task.title}".`
        : task.status === "In Progress"
        ? `${task.assignee} is working on "${task.title}".`
        : `"${task.title}" is assigned to ${task.assignee}.`,

      time: task.dueDate
        ? `Due date: ${task.dueDate}`
        : "Task update",

      type: isOverdue
        ? "deadline"
        : isCompleted
        ? "done"
        : "task",
    };
  });
};

const MemberSlice = createSlice({
  name: "member",
  initialState,

  reducers: {
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload
      );

      if (task) {
        task.status =
          task.status === "Completed" ? "In Progress" : "Completed";
      }
    },

    updateTaskStatus: (state, action) => {
      const { taskId, newStatus } = action.payload;

      const task = state.tasks.find(
        (task) => task.id === taskId
      );

      if (task) {
        task.status = newStatus;
      }
    },

    // Mark one notification as read.
    markNotificationRead: (state, action) => {
      if (!state.readNotificationIds.includes(action.payload)) {
        state.readNotificationIds.push(action.payload);
      }
    },

    // Mark all current notifications as read.
    markAllNotificationsRead: (state, action) => {
      const newIds = action.payload.filter(
        (id) => !state.readNotificationIds.includes(id)
      );

      state.readNotificationIds.push(...newIds);
    },
  },
});

export const {
  toggleTaskCompletion,
  updateTaskStatus,
  markNotificationRead,
  markAllNotificationsRead,
} = MemberSlice.actions;

export default MemberSlice.reducer;
