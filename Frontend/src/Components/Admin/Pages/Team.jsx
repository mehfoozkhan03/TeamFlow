
import { useMemo, useState } from "react";
import {
  Users,
  Activity,
  Mail,
  Sparkles,
  Plus,
  Search,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  UserPlus,
} from "lucide-react";

const initialMembers = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex@acmestudio.co",
    initials: "AM",
    color: "bg-violet-500",
    role: "Owner",
    projects: 5,
    tasks: 24,
    status: "Active",
    lastActive: "Now",
    minutes: 0,
  },
  {
    id: 2,
    name: "Rahul Kapoor",
    email: "rahul@acmestudio.co",
    initials: "RK",
    color: "bg-blue-500",
    role: "Admin",
    projects: 4,
    tasks: 18,
    status: "Active",
    lastActive: "8m ago",
    minutes: 8,
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya@acmestudio.co",
    initials: "PS",
    color: "bg-emerald-500",
    role: "Manager",
    projects: 3,
    tasks: 16,
    status: "Active",
    lastActive: "24m ago",
    minutes: 24,
  },
  {
    id: 4,
    name: "Aman Patel",
    email: "aman@acmestudio.co",
    initials: "AP",
    color: "bg-amber-500",
    role: "Member",
    projects: 2,
    tasks: 11,
    status: "Active",
    lastActive: "1h ago",
    minutes: 60,
  },
  {
    id: 5,
    name: "Nina Kim",
    email: "nina@acmestudio.co",
    initials: "NK",
    color: "bg-rose-600",
    role: "Viewer",
    projects: 1,
    tasks: 0,
    status: "Pending",
    lastActive: "Invited May 20",
    minutes: null,
  },
];

const ROLE_OPTIONS = [
  "Owner",
  "Admin",
  "Manager",
  "Member",
  "Viewer",
];

function StatCard({ title, value, subtitle, icon: Icon, theme }) {
  const themes = {
    purple: "bg-violet-500/15 text-violet-300",
    green: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    blue: "bg-blue-500/15 text-blue-300",
  };

  return (
    <div className="min-w-0 rounded-xl border border-[#26334f] bg-[#151e33] p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            themes[theme]
          }`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-blue-200/70">{title}</p>
          <h3 className="mt-1 text-[23px] font-semibold leading-tight text-white">
            {value}
          </h3>
          <p className="mt-2 text-[10px] text-emerald-300">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Active"
      ? "bg-emerald-500/10 text-emerald-400"
      : status === "Pending"
      ? "bg-amber-500/10 text-amber-400"
      : "bg-slate-500/10 text-slate-400";

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function RoleBadge({ role }) {
  const style =
    role === "Owner"
      ? "bg-violet-500/15 text-violet-300"
      : "border border-[#303d59] bg-[#202b43] text-slate-300";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${style}`}
    >
      {role}
    </span>
  );
}

function MemberAvatar({ member }) {
  return (
    <div
      className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${member.color}`}
    >
      {member.initials}
    </div>
  );
}

function FilterSelect({ value, onChange, options, label }) {
  return (
    <div className="relative shrink-0">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[31px] appearance-none rounded-lg border border-[#293752] bg-[#111a2d] py-1 pl-2.5 pr-7 text-[10px] text-blue-100 outline-none transition hover:border-violet-500/60 focus:border-violet-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-[9px] text-slate-400"
      />
    </div>
  );
}

export const Team = () => {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortBy, setSortBy] = useState("Last active");
  const [showInvite, setShowInvite] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "Member",
  });

  const stats = useMemo(() => {
    const total = 24;
    const active = 16;
    const pending = 3;
    const availableSeats = 1;

    return { total, active, pending, availableSeats };
  }, []);

  const filteredMembers = useMemo(() => {
    let result = members.filter((member) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All roles" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All statuses" ||
        member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    if (sortBy === "Last active") {
      result.sort((a, b) => {
        if (a.minutes === null) return 1;
        if (b.minutes === null) return -1;
        return a.minutes - b.minutes;
      });
    } else if (sortBy === "Name A-Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Projects") {
      result.sort((a, b) => b.projects - a.projects);
    }

    return result;
  }, [members, search, roleFilter, statusFilter, sortBy]);

  const changeMemberRole = (id, role) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, role } : member
      )
    );
    setOpenMenu(null);
  };

  const changeMemberStatus = (id, status) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status } : member
      )
    );
    setOpenMenu(null);
  };

  const removeMember = (member) => {
    if (member.role === "Owner") {
      window.alert("The workspace owner cannot be removed.");
      return;
    }

    const confirmed = window.confirm(
      `Remove ${member.name} from the team?`
    );

    if (!confirmed) return;

    setMembers((prev) =>
      prev.filter((item) => item.id !== member.id)
    );

    setOpenMenu(null);
  };

  const inviteMember = (e) => {
    e.preventDefault();

    const name = inviteForm.name.trim();
    const email = inviteForm.email.trim().toLowerCase();

    if (!name || !email) return;

    if (
      members.some(
        (member) => member.email.toLowerCase() === email
      )
    ) {
      window.alert("This member is already in the team.");
      return;
    }

    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const newMember = {
      id: Date.now(),
      name,
      email,
      initials,
      color: "bg-violet-500",
      role: inviteForm.role,
      projects: 0,
      tasks: 0,
      status: "Pending",
      lastActive: "Just invited",
      minutes: null,
    };

    setMembers((prev) => [...prev, newMember]);

    setInviteForm({
      name: "",
      email: "",
      role: "Member",
    });

    setShowInvite(false);
  };

  return (
    <div className="min-h-full bg-[#0b1020] text-white">
      <div className="space-y-[17px] p-5 sm:p-7">

        {/* Page heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[25px] font-medium tracking-tight">
              Team Members
            </h1>

            <p className="mt-2 text-[13px] text-blue-200/80">
              Manage your people, roles, and workspace access.
            </p>
          </div>

          <button
            onClick={() => setShowInvite(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-violet-500 px-3.5 text-[11px] font-semibold text-white shadow-lg shadow-violet-500/10 transition hover:bg-violet-400 hover:-translate-y-0.5 transition-800"
          >
            <UserPlus size={15} />
            Invite Members
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Members"
            value={stats.total}
            subtitle="+4 this month"
            icon={Users}
            theme="purple"
          />

          <StatCard
            title="Active Now"
            value={stats.active}
            subtitle="67% online"
            icon={Activity}
            theme="green"
          />

          <StatCard
            title="Pending Invites"
            value={stats.pending}
            subtitle="2 expire soon"
            icon={Mail}
            theme="amber"
          />

          <StatCard
            title="Available Seats"
            value={stats.availableSeats}
            subtitle="Pro plan"
            icon={Sparkles}
            theme="blue"
          />
        </div>

        {/* Members table container */}
        <div className="overflow-visible rounded-xl border border-[#26334f] bg-[#151e33]">

          {/* Search and filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#26334f] p-3.5">
            <div className="flex h-[33px] w-full items-center gap-2 rounded-lg border border-[#293752] bg-[#111a2d] px-2.5 sm:w-[232px]">
              <Search
                size={14}
                className="shrink-0 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-blue-200/70"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={13} className="text-slate-400" />
                </button>
              )}
            </div>

            <FilterSelect
              label="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { label: "All roles", value: "All roles" },
                ...ROLE_OPTIONS.map((role) => ({
                  label: role,
                  value: role,
                })),
              ]}
            />

            <FilterSelect
              label="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "All statuses", value: "All statuses" },
                { label: "Active", value: "Active" },
                { label: "Pending", value: "Pending" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />

            <FilterSelect
              label="Sort team members"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: "Last active", value: "Last active" },
                { label: "Name A-Z", value: "Name A-Z" },
                { label: "Projects", value: "Projects" },
              ]}
            />
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] table-fixed text-left">
              <colgroup>
                <col className="w-[27%]" />
                <col className="w-[13%]" />
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
                <col className="w-[13%]" />
                <col className="w-[7%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-[#26334f] bg-[#121b2f]">
                  {[
                    "MEMBER",
                    "ROLE",
                    "PROJECTS",
                    "ASSIGNED TASKS",
                    "STATUS",
                    "LAST ACTIVE",
                    "",
                  ].map((heading, index) => (
                    <th
                      key={`${heading}-${index}`}
                      className="px-3 py-3 text-[8px] font-semibold tracking-wide text-blue-200/60 sm:px-3.5"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#26334f]">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-[#1a2540]"
                  >
                    {/* Member */}
                    <td className="px-3 py-3.5 sm:px-3.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <MemberAvatar member={member} />

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold text-white sm:text-[11px]">
                            {member.name}
                          </p>

                          <p className="mt-1 truncate text-[9px] text-blue-200/60">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-3 py-3.5 sm:px-3.5">
                      <RoleBadge role={member.role} />
                    </td>

                    {/* Projects */}
                    <td className="px-3 py-3.5 text-[10px] font-medium text-slate-100 sm:px-3.5">
                      {member.projects}
                    </td>

                    {/* Assigned tasks */}
                    <td className="px-3 py-3.5 text-[10px] font-medium text-slate-100 sm:px-3.5">
                      {member.tasks}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5 sm:px-3.5">
                      <StatusBadge status={member.status} />
                    </td>

                    {/* Last active */}
                    <td className="px-3 py-3.5 text-[10px] text-blue-100 sm:px-3.5">
                      {member.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="relative px-3 py-3.5 text-center sm:px-3.5">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === member.id ? null : member.id
                          )
                        }
                        aria-label={`Actions for ${member.name}`}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-[#293752] hover:text-white"
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      {openMenu === member.id && (
                        <div className="absolute right-5 top-10 z-30 w-44 rounded-lg border border-[#303d59] bg-[#10182b] p-1 text-left shadow-2xl">
                          <p className="px-3 py-2 text-[10px] text-slate-500">
                            Change role
                          </p>

                          {ROLE_OPTIONS.filter(
                            (role) => role !== "Owner"
                          ).map((role) => (
                            <button
                              key={role}
                              onClick={() =>
                                changeMemberRole(member.id, role)
                              }
                              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs text-slate-200 hover:bg-[#26334f]"
                            >
                              {role}
                              {member.role === role && (
                                <Check size={13} />
                              )}
                            </button>
                          ))}

                          <div className="my-1 border-t border-[#26334f]" />

                          {["Active", "Inactive"].map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                changeMemberStatus(member.id, status)
                              }
                              className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-200 hover:bg-[#26334f]"
                            >
                              Set {status.toLowerCase()}
                            </button>
                          ))}

                          {member.role !== "Owner" && (
                            <button
                              onClick={() => removeMember(member)}
                              className="mt-1 w-full border-t border-[#26334f] px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
                            >
                              Remove member
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <Users
                        size={28}
                        className="mx-auto text-slate-500"
                      />

                      <p className="mt-3 text-sm font-medium text-white">
                        No members found
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Try changing your search or filters.
                      </p>

                      <button
                        onClick={() => {
                          setSearch("");
                          setRoleFilter("All roles");
                          setStatusFilter("All statuses");
                        }}
                        className="mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#26334f] px-4 py-3">
            <p className="text-[10px] text-slate-400">
              Showing {filteredMembers.length} of {members.length} members
            </p>

            <p className="text-[10px] text-slate-500">
              TeamFlow Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Invite member modal */}
      {showInvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowInvite(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-[#303d59] bg-[#111a2d] p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Invite member
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Invite someone to your workspace.
                </p>
              </div>

              <button
                onClick={() => setShowInvite(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-[#26334f] hover:text-white"
                aria-label="Close invite modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={inviteMember} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs text-slate-300">
                  Full name
                </label>

                <input
                  required
                  autoFocus
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-[#303d59] bg-[#0b1020] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-300">
                  Email address
                </label>

                <input
                  required
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      email: e.target.value,
                    })
                  }
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-[#303d59] bg-[#0b1020] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-300">
                  Role
                </label>

                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#303d59] bg-[#0b1020] px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
                >
                  {ROLE_OPTIONS.filter(
                    (role) => role !== "Owner"
                  ).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#26334f] pt-5">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="rounded-lg border border-[#303d59] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-[#26334f]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-400"
                >
                  <Plus size={15} />
                  Add member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
