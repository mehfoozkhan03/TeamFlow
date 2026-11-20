
import {
  LayoutDashboard,
  Folder,
  ClipboardList,
  Users,
  ChartColumn,
  Activity,
  Settings,
  Bell,
  UserRound,
} from "lucide-react";

export const dashboardConfig = {
  leader: {
    label: "Team Leader",
    basePath: "/admin",
    sections: [
      {
        title: "WORKSPACE",
        items: [
          { name: "Overview", path: "overview", icon: LayoutDashboard },
          { name: "Projects", path: "projects", icon: Folder },
          { name: "Tasks", path: "tasks", icon: ClipboardList },
          { name: "Team Members", path: "team", icon: Users },
        ],
      },
      {
        title: "MANAGEMENT",
        items: [
          { name: "Reports & Analytics", path: "reports", icon: ChartColumn },
          { name: "Activity", path: "activity", icon: Activity },
          { name: "Team Settings", path: "settings", icon: Settings },
        ],
      },
    ],
  },

  member: {
    label: "Team Member",
    basePath: "/member",
    sections: [
      {
        title: "WORKSPACE",
        items: [
          { name: "Overview", path: "overview", icon: LayoutDashboard },
          { name: "My Tasks", path: "tasks", icon: ClipboardList },
          { name: "Projects", path: "projects", icon: Folder },
          { name: "Team Members", path: "team", icon: Users },
        ],
      },
      {
        title: "COMMUNICATION",
        items: [
          { name: "Activity", path: "activity", icon: Activity },
          { name: "Notifications", path: "notifications", icon: Bell },
        ],
      },
      {
        title: "PERSONAL",
        items: [
          { name: "My Profile", path: "profile", icon: UserRound },
          { name: "Settings", path: "settings", icon: Settings },
        ],
      },
    ],
  },
};
