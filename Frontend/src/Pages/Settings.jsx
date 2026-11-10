
import { useState } from "react";

export const Settings = () => {
  const [teamName, setTeamName] = useState("Nova Studio");
  const [description, setDescription] = useState(
    "A cross-functional team building thoughtful digital products."
  );

  const [inviteCode, setInviteCode] = useState("NOVA-7K2P");
  const [visibility, setVisibility] = useState("invitation");

  const [permissions, setPermissions] = useState({
    createProjects: true,
    inviteMembers: false,
    editTasks: false,
    viewReports: true,
  });

  const [message, setMessage] = useState("");

  // Save team profile
  const handleSave = () => {
    setMessage("Team profile saved successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Copy invitation code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setMessage("Invitation code copied!");

      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Unable to copy invitation code.");
    }
  };

  // Generate a new invitation code
  const handleRegenerate = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "NOVA-";

    for (let i = 0; i < 4; i++) {
      code += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setInviteCode(code);
  };

  // Update permission switches
  const handlePermission = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  // Delete team
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${teamName}? This action cannot be undone.`
    );

    if (confirmed) {
      setMessage("Team deletion needs to be connected to your backend.");
    }
  };

  // Permission component
  const PermissionToggle = ({ title, subtitle, permission }) => {
    const isEnabled = permissions[permission];

    return (
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-0">
        <div>
          <h4 className="text-sm font-medium text-gray-800">
            {title}
          </h4>
          <p className="mt-1 text-xs text-gray-400">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handlePermission(permission)}
          aria-label={`Toggle ${title}`}
          aria-pressed={isEnabled}
          className={`relative h-5 w-9 shrink-0 rounded-full transition ${
            isEnabled ? "bg-purple-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
              isEnabled ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
            ● Workspace Administration
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Team settings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage team identity, invitation access, member permissions
            and workspace ownership.
          </p>
        </div>

        {/* Notification */}
        {message && (
          <div className="mb-5 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
            {message}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

          {/* Left Column */}
          <div className="space-y-5 lg:col-span-7">

            {/* Team Profile */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-gray-900">
                Team profile
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Visible to everyone in this workspace
              </p>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl font-bold text-purple-600">
                  {teamName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Team name
                    </label>

                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Team description
                    </label>

                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-purple-700"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </section>

            {/* Member Permissions */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-gray-900">
                Member permissions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Choose what Team Members can do
              </p>

              <div className="mt-3">
                <PermissionToggle
                  title="Create new projects"
                  subtitle="Team Leaders always retain full access."
                  permission="createProjects"
                />

                <PermissionToggle
                  title="Invite additional members"
                  subtitle="Team Leaders always retain full access."
                  permission="inviteMembers"
                />

                <PermissionToggle
                  title="Edit tasks assigned to others"
                  subtitle="Team Leaders always retain full access."
                  permission="editTasks"
                />

                <PermissionToggle
                  title="View reports and analytics"
                  subtitle="Team Leaders always retain full access."
                  permission="viewReports"
                />
              </div>
            </section>

            {/* Danger Zone */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-gray-900">
                Danger zone
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Destructive actions require confirmation
              </p>

              <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl bg-red-50 p-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold text-red-700">
                    Delete {teamName}
                  </h3>

                  <p className="mt-1 text-xs text-red-400">
                    Permanently deletes all projects, tasks and activity.
                    This cannot be undone.
                  </p>
                </div>

                <button
                  onClick={handleDelete}
                  className="shrink-0 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Delete team
                </button>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-5 lg:col-span-5">

            {/* Invitation Code */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-gray-900">
                Invitation code
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Members use this code to join
              </p>

              <div className="mt-4 rounded-xl bg-purple-50 p-4 text-center">
                <h3 className="text-lg font-bold tracking-[0.2em] text-purple-700">
                  {inviteCode}
                </h3>

                <div className="mt-3 flex justify-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-purple-700"
                  >
                    Copy
                  </button>

                  <button
                    onClick={handleRegenerate}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </section>

            {/* Team Visibility */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-bold text-gray-900">
                Team visibility
              </h2>

              <div className="mt-4 space-y-2">

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    visibility === "invitation"
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="invitation"
                    checked={visibility === "invitation"}
                    onChange={() => setVisibility("invitation")}
                    className="mt-1 accent-purple-600"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Invitation only
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Only people with a valid invitation code can join.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    visibility === "discoverable"
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="discoverable"
                    checked={visibility === "discoverable"}
                    onChange={() => setVisibility("discoverable")}
                    className="mt-1 accent-purple-600"
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      Organization discoverable
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      People with your email domain can request access.
                    </p>
                  </div>
                </label>

              </div>
            </section>

            {/* Team Leadership */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg text-purple-600">
                  ♢
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Team leadership
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    You cannot leave this team until ownership is
                    transferred to another eligible member.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
