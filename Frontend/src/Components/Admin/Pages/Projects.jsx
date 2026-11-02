
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  CheckSquare,
  MoreHorizontal,
  LayoutGrid,
  List,
  FolderKanban,
  X,
  Users,
} from "lucide-react";

const initialProjects = [
  {
    id: 1,
    initials: "WR",
    name: "Website Redesign",
    description: "Refresh the public experience and design system.",
    status: "On track",
    progress: 90,
    tasks: 42,
    deadline: "May 30",
    owner: "Alex",
    updated: 6,
    color: "purple",
    team: ["AM", "PS", "RK"],
  },
  {
    id: 2,
    initials: "MA",
    name: "Mobile Application",
    description: "Build the iOS and Android customer experience.",
    status: "At risk",
    progress: 65,
    tasks: 36,
    deadline: "Jun 14",
    owner: "Alex",
    updated: 5,
    color: "blue",
    team: ["AM", "PS", "RK"],
  },
  {
    id: 3,
    initials: "CC",
    name: "Customer CRM",
    description: "Centralize customer data and sales workflows.",
    status: "On track",
    progress: 40,
    tasks: 28,
    deadline: "Jul 08",
    owner: "Alex",
    updated: 4,
    color: "green",
    team: ["AM", "PS", "RK"],
  },
  {
    id: 4,
    initials: "MA",
    name: "Marketing Automation",
    description: "Automate lifecycle campaigns and reporting.",
    status: "Planning",
    progress: 15,
    tasks: 24,
    deadline: "Aug 22",
    owner: "Alex",
    updated: 3,
    color: "orange",
    team: ["AM", "PS", "RK"],
  },
  {
    id: 5,
    initials: "AI",
    name: "API Integration",
    description: "Unify authentication and third-party services.",
    status: "On track",
    progress: 55,
    tasks: 32,
    deadline: "Sep 12",
    owner: "Alex",
    updated: 2,
    color: "pink",
    team: ["AM", "PS", "RK"],
  },
];

const colors = {
  purple: {
    avatar: "bg-violet-500/20 text-violet-200",
    bar: "bg-violet-500",
  },
  blue: {
    avatar: "bg-blue-500/20 text-blue-200",
    bar: "bg-blue-500",
  },
  green: {
    avatar: "bg-emerald-500/20 text-emerald-200",
    bar: "bg-emerald-500",
  },
  orange: {
    avatar: "bg-amber-500/20 text-amber-200",
    bar: "bg-amber-500",
  },
  pink: {
    avatar: "bg-pink-500/20 text-pink-200",
    bar: "bg-pink-500",
  },
};

function StatusBadge({ status }) {
  const styles = {
    "On track": "bg-emerald-500/10 text-emerald-400",
    "At risk": "bg-red-500/10 text-red-400",
    Planning: "bg-amber-500/10 text-amber-400",
    Completed: "bg-blue-500/10 text-blue-400",
    "On hold": "bg-slate-500/20 text-slate-300",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
        styles[status] || styles.Planning
      }`}
    >
      {status}
    </span>
  );
}

function TeamAvatars({ team }) {
  const avatarColors = [
    "bg-violet-500",
    "bg-emerald-500",
    "bg-blue-500",
    "bg-pink-500",
  ];

  return (
    <div className="flex items-center -space-x-2">
      {team.map((member, index) => (
        <div
          key={`${member}-${index}`}
          title={member}
          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#151e33] text-[9px] font-bold text-white ${
            avatarColors[index % avatarColors.length]
          }`}
        >
          {member}
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, onStatusChange, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const color = colors[project.color] || colors.purple;

  return (
    <article className="group relative min-w-0 rounded-xl border border-[#26334f] bg-[#151e33] p-5 transition hover:border-[#51417e]">
      {/* Card top */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${color.avatar}`}
        >
          {project.initials}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md p-1 text-slate-400 hover:bg-[#26334f] hover:text-white"
              aria-label="Project options"
            >
              <MoreHorizontal size={19} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-[#303d59] bg-[#10182b] p-1 shadow-xl">
                <label className="block px-3 py-2 text-xs text-slate-400">
                  Change status
                </label>

                {["On track", "At risk", "Planning", "On hold", "Completed"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(project.id, status);
                        setMenuOpen(false);
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-xs text-slate-200 hover:bg-[#26334f]"
                    >
                      {status}
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    onDelete(project.id);
                    setMenuOpen(false);
                  }}
                  className="mt-1 w-full rounded-md border-t border-[#26334f] px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
                >
                  Delete project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project information */}
      <div className="mt-5">
        <h3 className="truncate text-[15px] font-medium text-white">
          {project.name}
        </h3>

        <p className="mt-2 min-h-5 text-[11px] leading-5 text-blue-300/80">
          {project.description}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between text-[10px]">
          <span className="text-blue-300/80">Progress</span>
          <span className="font-bold text-slate-100">
            {project.progress}%
          </span>
        </div>

        <div className="h-[5px] overflow-hidden rounded-full bg-[#29354d]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color.bar}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tasks and deadline */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-blue-200/80">
        <div className="flex items-center gap-1.5">
          <CheckSquare size={15} className="text-slate-400" />
          <span>{project.tasks} tasks</span>
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays size={15} className="text-slate-400" />
          <span>{project.deadline}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#29354d] pt-4">
        <TeamAvatars team={project.team} />

        <p className="text-[10px] text-blue-200/70">
          Owned by{" "}
          <span className="font-semibold text-slate-200">
            {project.owner}
          </span>
        </p>
      </div>
    </article>
  );
}

export const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortBy, setSortBy] = useState("Recently updated");
  const [view, setView] = useState("grid");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
  });

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "All statuses") {
      result = result.filter(
        (project) => project.status === statusFilter
      );
    }

    if (sortBy === "Recently updated") {
      result.sort((a, b) => b.updated - a.updated);
    } else if (sortBy === "Name A-Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Progress") {
      result.sort((a, b) => b.progress - a.progress);
    }

    return result;
  }, [projects, search, statusFilter, sortBy]);

  const changeProjectStatus = (id, status) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              status,
              progress:
                status === "Completed" ? 100 : project.progress,
            }
          : project
      )
    );
  };

  const deleteProject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const createProject = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    const newProject = {
      id: Date.now(),
      initials: form.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      name: form.name.trim(),
      description: form.description.trim() || "No description provided.",
      status: "Planning",
      progress: 0,
      tasks: 0,
      deadline: form.deadline
        ? new Date(form.deadline + "T00:00:00").toLocaleDateString(
            "en-US",
            { month: "short", day: "2-digit" }
          )
        : "Not set",
      owner: "Alex",
      updated: Date.now(),
      color: "purple",
      team: ["AM"],
    };

    setProjects((prev) => [newProject, ...prev]);
    setForm({ name: "", description: "", deadline: "" });
    setShowModal(false);
  };

  return (
    <div className=" min-h-full bg-[#0b1020] text-white">
      {/* Projects content */}
      <div className="space-y-6 p-5 sm:p-7">

        {/* Page heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-medium tracking-tight text-white">
              Projects
            </h1>
            <p className="mt-2 text-sm text-blue-200/80">
              Plan work, coordinate your team, and deliver on time.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-500/10 transition hover:bg-violet-400"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#26334f] bg-[#111a2d] px-3 sm:max-w-[258px]">
            <Search size={17} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-blue-200/70"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={14} className="text-slate-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[#26334f] bg-[#111a2d] py-2 pl-3 pr-8 text-xs text-blue-100 outline-none hover:border-[#51417e]"
              >
                <option>All statuses</option>
                <option>On track</option>
                <option>At risk</option>
                <option>Planning</option>
                <option>On hold</option>
                <option>Completed</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-3 text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[#26334f] bg-[#111a2d] py-2 pl-3 pr-8 text-xs text-blue-100 outline-none hover:border-[#51417e]"
              >
                <option>Recently updated</option>
                <option>Name A-Z</option>
                <option>Progress</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-3 text-slate-400"
              />
            </div>

            <div className="flex h-9 overflow-hidden rounded-lg border border-[#26334f] bg-[#111a2d]">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                title="Grid view"
                className={`px-2.5 ${
                  view === "grid"
                    ? "bg-[#202b43] text-violet-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={16} />
              </button>

              <button
                onClick={() => setView("list")}
                aria-label="List view"
                title="List view"
                className={`border-l border-[#26334f] px-2.5 ${
                  view === "list"
                    ? "bg-[#202b43] text-violet-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <List size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Project cards */}
        {filteredProjects.length > 0 ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onStatusChange={changeProjectStatus}
                  onDelete={deleteProject}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#26334f] bg-[#151e33]">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="border-b border-[#29354d] text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">Project</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Progress</th>
                    <th className="px-5 py-4 font-medium">Tasks</th>
                    <th className="px-5 py-4 font-medium">Deadline</th>
                    <th className="px-5 py-4 font-medium">Owner</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#29354d]">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="text-slate-200 transition hover:bg-[#1a2540]"
                    >
                      <td className="px-5 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <FolderKanban
                            size={17}
                            className="text-violet-400"
                          />
                          {project.name}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#29354d]">
                            <div
                              className="h-full rounded-full bg-violet-500"
                              style={{
                                width: `${project.progress}%`,
                              }}
                            />
                          </div>
                          {project.progress}%
                        </div>
                      </td>
                      <td className="px-5 py-4">{project.tasks}</td>
                      <td className="px-5 py-4">{project.deadline}</td>
                      <td className="px-5 py-4">{project.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#303d59] px-6 py-20 text-center">
            <div className="mb-4 rounded-2xl bg-[#151e33] p-4">
              <FolderKanban size={28} className="text-violet-400" />
            </div>
            <h3 className="text-base font-semibold text-white">
              No projects found
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
              Try another search or change your status filter to see your projects.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All statuses");
              }}
              className="mt-5 text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Results footer */}
        <div className="flex items-center justify-between border-t border-[#202b43] pt-4 text-xs text-slate-500">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Users size={14} />
            TeamFlow Workspace
          </span>
        </div>
      </div>

      {/* Create project modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#303d59] bg-[#111a2d] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create project
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add a new project to your workspace.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-[#26334f] hover:text-white"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-300">
                  Project name *
                </label>
                <input
                  required
                  autoFocus
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Website Redesign"
                  className="w-full rounded-lg border border-[#303d59] bg-[#0b1020] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What is this project about?"
                  className="w-full resize-none rounded-lg border border-[#303d59] bg-[#0b1020] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-300">
                  Deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#303d59] bg-[#0b1020] px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#26334f] pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-[#303d59] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-[#26334f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-400"
                >
                  <Plus size={15} />
                  Create project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
