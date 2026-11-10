import React, { useState } from "react";
// import * as icon from "lucide-react";

import {
  Users,
  LayoutDashboard,
  FolderKanban,
  CircleCheck,
  UserRound,
  ChartNoAxesColumn,
  Activity,
  Settings,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Plus,
  Sparkles,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle2,
  Folder,
  X,
  ArrowRight,
  CalendarDays,
  ListTodo,
  Menu,
} from "lucide-react";

const Overview = () => {
  const [activePage, setActivePage] = useState("Overview");
  const [workspaceMode, setWorkspaceMode] = useState("New team");
  const [showInvite, setShowInvite] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  const navigation = [
    {
      title: "WORKSPACE",
      items: [
        { name: "Overview", icon: LayoutDashboard },
        { name: "Projects", icon: FolderKanban },
        { name: "Tasks", icon: CircleCheck },
        { name: "Team Members", icon: Users },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Reports & Analytics", icon: ChartNoAxesColumn },
        { name: "Activity", icon: Activity },
        { name: "Team Settings", icon: Settings },
      ],
    },
  ];

  const stats = [
    {
      title: "Team Members",
      value: members.length + 1,
      description: "Total members",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Projects",
      value: projects.length,
      description: "Currently active",
      icon: FolderKanban,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      title: "Total Tasks",
      value: 0,
      description: "Across all projects",
      icon: ListTodo,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      title: "Completed Tasks",
      value: 0,
      description: "No completed tasks",
      icon: CircleCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Overdue Tasks",
      value: 0,
      description: "Nothing overdue",
      icon: AlertTriangle,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-500",
    },
  ];

  const steps = [
    {
      title: "Team successfully created",
      description: "Your workspace is live.",
      completed: true,
    },
    {
      title: "Invite team members",
      description: "Share your unique code.",
      action: "Invite Members",
    },
    {
      title: "Create your first project",
      description: "Define goals and timelines.",
      action: "Create Project",
    },
    {
      title: "Assign tasks",
      description: "Give everyone clear ownership.",
      action: "Start now",
    },
  ];

  const handleInvite = (e) => {
    e.preventDefault();

    if (!memberEmail.trim()) return;

    setMembers((prev) => [...prev, memberEmail.trim()]);
    setMemberEmail("");
    setShowInvite(false);
  };

  const handleProject = (e) => {
    e.preventDefault();

    if (!projectName.trim()) return;

    setProjects((prev) => [...prev, projectName.trim()]);
    setProjectName("");
    setShowProject(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#172033] font-sans">

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[248px] flex-col border-r border-[#E9EAF1] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[72px] items-center gap-3 border-b border-[#F0F0F4] px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7629F6] text-white shadow-lg shadow-purple-200">
            <Users size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Team<span className="text-[#7629F6]">Flow</span>
          </span>
          <button
            onClick={() => setMobileMenu(false)}
            className="ml-auto text-gray-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Selector */}
        <div className="px-2 pt-4">
          <button className="flex w-full items-center justify-between rounded-2xl border border-[#E9E5F1] bg-[#FBFAFD] p-3 hover:bg-purple-50 transition">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 font-bold text-[#7629F6]">
                N
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">Nova Studio</p>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  Team workspace
                </p>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 space-y-7 overflow-y-auto px-2">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[2px] text-[#A3A8B8]">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.name;

                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActivePage(item.name);
                        setMobileMenu(false);
                      }}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium transition ${
                        active
                          ? "bg-[#F2EAFE] text-[#7629F6]"
                          : "text-[#68748A] hover:bg-gray-50 hover:text-[#7629F6]"
                      }`}
                    >
                      <Icon size={17} />
                      <span>{item.name}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7629F6]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Profile */}
        <div className="border-t border-[#F0F0F4] p-3">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#182238] text-xs font-bold text-white">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">Alex Kumar</p>
              <p className="text-[10px] text-gray-400">Team Leader</p>
            </div>
            <MoreHorizontal size={18} className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-h-screen lg:ml-[248px]">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E9EAF1] bg-white px-4 sm:px-7">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="text-gray-600 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="text-gray-400">Workspace</span>
              <ChevronRight size={13} className="text-gray-300" />
              <span className="hidden text-gray-400 sm:inline">
                Nova Studio
              </span>
              <ChevronRight size={13} className="text-gray-300" />
              <span className="font-bold text-[#273247]">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search */}
            <div className="hidden h-9 w-[260px] items-center gap-2 rounded-xl border border-[#E9EAF1] bg-[#F9FAFC] px-3 md:flex">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search projects, tasks, members..."
                className="w-full bg-transparent text-[11px] outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Notification */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9EAF1] text-gray-500 hover:bg-gray-50">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#7629F6]" />
            </button>

            {/* Invite */}
            <button
              onClick={() => setShowInvite(true)}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#7629F6] px-3 sm:px-4 text-[11px] font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6420DB]"
            >
              <UserRound size={15} />
              <span className="hidden sm:inline">Invite Members</span>
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#172033] text-[10px] font-bold text-white">
              AK
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="mx-auto max-w-[1700px] space-y-5 p-4 sm:p-6 lg:p-7">

          {/* Welcome Section */}
          <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7629F6]" />
                <span className="text-[9px] font-extrabold tracking-[2px] text-[#7629F6]">
                  TEAM LEADER WORKSPACE
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-[29px]">
                Welcome to your team workspace!
              </h1>

              <p className="mt-2 text-xs leading-6 text-[#8490A5]">
                Your team is ready. Invite your members, create projects and
                start organizing your work.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              {/* Workspace Mode */}
              <div className="flex items-center rounded-xl border border-[#E7E8EF] bg-white p-1">
                <button
                  onClick={() => setWorkspaceMode("New team")}
                  className={`rounded-lg px-4 py-2 text-[10px] font-bold transition ${
                    workspaceMode === "New team"
                      ? "bg-[#172033] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  New team
                </button>

                <button
                  onClick={() => setWorkspaceMode("With data")}
                  className={`rounded-lg px-4 py-2 text-[10px] font-bold transition ${
                    workspaceMode === "With data"
                      ? "bg-[#172033] text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  With data
                </button>
              </div>

              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 rounded-xl border border-[#E4E5ED] bg-white px-4 py-2.5 text-[11px] font-bold text-[#273247] hover:bg-gray-50"
              >
                <UserRound size={15} />
                Invite Members
              </button>

              <button
                onClick={() => setShowProject(true)}
                className="flex items-center gap-2 rounded-xl bg-[#7629F6] px-4 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6420DB]"
              >
                <Plus size={16} />
                Create Project
              </button>
            </div>
          </section>

          {/* Workspace Banner */}
          <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5D4FF] bg-[#F6F0FF] p-5 sm:flex-row sm:items-center sm:px-6">

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7629F6] text-white shadow-lg shadow-purple-200">
                <Sparkles size={20} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xs font-extrabold text-[#292044] sm:text-sm">
                    Nova Studio is ready for its first collaborators
                  </h2>
                  <span className="rounded-full bg-[#EDE0FF] px-2.5 py-1 text-[9px] font-bold text-[#7629F6]">
                    Team Leader
                  </span>
                </div>

                <p className="mt-2 text-[10px] text-[#8C80A8]">
                  Created September 24, 2025 · Invite your team with code{" "}
                  <span className="font-bold text-[#7629F6]">NOVA-7K2P</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInvite(true)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7629F6] px-4 py-3 text-[11px] font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6420DB]"
            >
              Invite your first member
              <ArrowRight size={15} />
            </button>
          </section>

          {/* Statistics Cards */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group rounded-2xl border border-[#E9EAF0] bg-white p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon size={18} />
                    </div>

                    <button className="text-gray-300 transition hover:text-gray-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-[#172033]">
                    {stat.value}
                  </h3>

                  <p className="mt-1 text-[10px] font-medium text-[#46536A]">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-[9px] text-[#A0A7B5]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Getting Started */}
          <section className="rounded-2xl border border-[#E9EAF0] bg-white p-5 sm:p-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#172033]">
                  Getting started
                </h2>
                <p className="mt-1 text-[10px] text-[#8792A5]">
                  1 of 4 steps complete
                </p>
              </div>

              <span className="text-[10px] font-bold text-[#7629F6]">
                25%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#ECEEF2]">
              <div className="h-full w-1/4 rounded-full bg-[#7629F6]" />
            </div>

            {/* Steps */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`rounded-2xl border p-4 transition hover:shadow-md ${
                    step.completed
                      ? "border-[#CDEFE0] bg-[#F3FBF7]"
                      : "border-[#E9EAF0] bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">

                    {step.completed ? (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#189B68] text-white">
                        <CheckCircle2 size={15} />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#DDE1E9] text-[9px] font-semibold text-[#8792A5]">
                        {index + 1}
                      </div>
                    )}

                    <div>
                      <h3 className="text-[10px] font-bold text-[#273247]">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-[9px] text-[#9AA4B4]">
                        {step.description}
                      </p>

                      {!step.completed && (
                        <button
                          onClick={() => {
                            if (index === 1) setShowInvite(true);
                            if (index === 2) setShowProject(true);
                            if (index === 3) setActivePage("Tasks");
                          }}
                          className="mt-3 text-[9px] font-bold text-[#7629F6] hover:underline"
                        >
                          {step.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          
          {/* Projects & Upcoming Deadlines */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.85fr_1fr]">

            {/* Your Projects */}
            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[#172033]">
                    Your Projects
                  </h2>
                  <p className="mt-1 text-[10px] text-[#8792A5]">
                    Create and organize work for your team
                  </p>
                </div>

                <button
                  onClick={() => setShowProject(true)}
                  className="text-[10px] font-bold text-[#7629F6] hover:underline"
                >
                  + Create Project
                </button>
              </div>

              <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-[#E9EAF0] bg-white p-6 text-center shadow-sm">

                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-100 bg-[#F7F1FF] text-[#7629F6]">
                  <FolderKanban size={25} />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-purple-400 ring-2 ring-white" />
                </div>

                {projects.length === 0 ? (
                  <>
                    <h3 className="text-sm font-extrabold text-[#172033]">
                      No projects yet
                    </h3>

                    <p className="mt-2 text-[11px] text-[#8792A5]">
                      Create your first project to start organizing your team's work.
                    </p>

                    <button
                      onClick={() => setShowProject(true)}
                      className="mt-5 flex items-center gap-2 rounded-xl bg-[#7629F6] px-5 py-3 text-[11px] font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6420DB]"
                    >
                      <Plus size={16} />
                      Create Project
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                    <h3 className="mb-4 text-sm font-bold text-[#172033]">
                      {projects.length} Active Projects
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {projects.map((project, index) => (
                        <div
                          key={`${project}-${index}`}
                          className="rounded-xl border border-[#E9EAF0] p-4 text-left"
                        >
                          <FolderKanban size={20} className="mb-3 text-[#7629F6]" />
                          <p className="text-xs font-bold text-[#172033]">
                            {project}
                          </p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            Active Project
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="min-w-0">
              <div className="mb-4">
                <h2 className="text-sm font-extrabold text-[#172033]">
                  Upcoming Deadlines
                </h2>
                <p className="mt-1 text-[10px] text-[#8792A5]">
                  Tasks due soon
                </p>
              </div>

              <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-[#E9EAF0] bg-white p-6 text-center shadow-sm">

                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-100 bg-[#F7F1FF] text-[#7629F6]">
                  <CalendarDays size={25} />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-purple-400 ring-2 ring-white" />
                </div>

                <h3 className="text-sm font-extrabold text-[#172033]">
                  No upcoming deadlines
                </h3>

                <p className="mt-2 text-[11px] text-[#8792A5]">
                  Deadlines will appear here after tasks are created.
                </p>
              </div>
            </div>

          </section>

          {/* Recent Tasks & Recent Activity */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.85fr_1fr]">

            {/* Recent Tasks */}
            <div className="min-w-0">
              <div className="mb-4">
                <h2 className="text-sm font-extrabold text-[#172033]">
                  Recent Tasks
                </h2>
                <p className="mt-1 text-[10px] text-[#8792A5]">
                  The latest work across your team
                </p>
              </div>

              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-[#E9EAF0] bg-white p-6 text-center shadow-sm">

                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-100 bg-[#F7F1FF] text-[#7629F6]">
                  <CircleCheck size={25} />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-purple-400 ring-2 ring-white" />
                </div>

                <h3 className="text-sm font-extrabold text-[#172033]">
                  No tasks yet
                </h3>

                <p className="mt-2 text-[11px] text-[#8792A5]">
                  Your team's recent tasks will appear here.
                </p>

                <button
                  onClick={() => setActivePage("Tasks")}
                  className="mt-4 text-[10px] font-bold text-[#7629F6] hover:underline"
                >
                  Go to Tasks →
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="min-w-0">
              <div className="mb-4">
                <h2 className="text-sm font-extrabold text-[#172033]">
                  Recent Activity
                </h2>
                <p className="mt-1 text-[10px] text-[#8792A5]">
                  Latest workspace events
                </p>
              </div>

              <div className="min-h-[180px] rounded-2xl border border-[#E9EAF0] bg-white p-4 shadow-sm">

                <div className="flex items-start gap-3 border-b border-[#EDF0F4] pb-6">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8F1] text-[#19A875]">
                    <CircleCheck size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-[#273247]">
                      Alex Kumar created the team workspace
                    </p>

                    <p className="mt-2 text-[9px] text-[#A0A7B5]">
                      Today, 9:14 AM
                    </p>
                  </div>

                </div>

                <div className="pt-5">
                  <p className="text-[9px] text-[#A0A7B5]">
                    More activity will appear as members join and work begins.
                  </p>
                </div>

              </div>
            </div>

          </section>

          {/* Team Members */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#172033]">
                  Team Members
                </h2>
                <p className="mt-1 text-[11px] text-[#8792A5]">
                  {members.length + 1} {members.length + 1 === 1 ? "member" : "members"} · You are the Team Leader
                </p>
              </div>

              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 rounded-xl border border-[#E5E7EF] bg-white px-4 py-2.5 text-xs font-bold text-[#273247] transition hover:bg-gray-50"
              >
                <UserRound size={15} />
                Invite Members
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E9EAF0] bg-white">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-[#EDF0F4] bg-[#FAFAFC]">
                  <tr className="text-[9px] font-bold tracking-wider text-[#929BAD]">
                    <th className="px-5 py-4">MEMBER</th>
                    <th className="px-5 py-4">ROLE</th>
                    <th className="px-5 py-4">ASSIGNED</th>
                    <th className="px-5 py-4">COMPLETED</th>
                    <th className="px-5 py-4">WORKLOAD</th>
                    <th className="px-5 py-4">STATUS</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0F1F5]">
                  {/* Team Leader */}
                  <tr className="text-[11px] text-[#46536A]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172033] text-xs font-bold text-white">
                          AK
                        </div>
                        <div>
                          <p className="font-bold text-[#273247]">Arnav Kharade</p>
                          <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-[#7629F6]">
                            <CheckCircle2 size={11} />
                            Workspace owner
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">Team Leader</td>
                    <td className="px-5 py-4 font-semibold">8</td>
                    <td className="px-5 py-4 font-semibold">12</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#E9EAF0]">
                          <div className="h-full w-[64%] rounded-full bg-[#7629F6]" />
                        </div>
                        <span className="text-[9px] text-[#8792A5]">64%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#20B981]" />
                        Online
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        aria-label="Team leader options"
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* Invited Members */}
                  {members.map((email, index) => (
                    <tr key={`${email}-${index}`} className="text-[11px] text-[#46536A]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-xs font-bold uppercase text-[#7629F6]">
                            {email.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#273247]">{email}</p>
                            <p className="mt-1 text-[9px] text-[#8792A5]">Invited member</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">Team Member</td>
                      <td className="px-5 py-4 font-semibold">0</td>
                      <td className="px-5 py-4 font-semibold">0</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#E9EAF0]">
                            <div className="h-full w-0 rounded-full bg-[#7629F6]" />
                          </div>
                          <span className="text-[9px] text-[#8792A5]">0%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          Invited
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <MoreHorizontal size={18} className="text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>

      {/* Invite Members Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10172A]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Invite Members</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Add a new member to your workspace.
                </p>
              </div>

              <button
                onClick={() => setShowInvite(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInvite}>
              <label className="mb-2 block text-xs font-bold">
                Member Email
              </label>

              <input
                type="email"
                required
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7629F6] focus:ring-2 focus:ring-purple-100"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#7629F6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6420DB]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10172A]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Create Project</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Start a new project for your team.
                </p>
              </div>

              <button
                onClick={() => setShowProject(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProject}>
              <label className="mb-2 block text-xs font-bold">
                Project Name
              </label>

              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#7629F6] focus:ring-2 focus:ring-purple-100"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProject(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#7629F6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#6420DB]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Overview;





