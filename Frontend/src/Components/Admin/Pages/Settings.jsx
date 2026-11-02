
import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Bell,
  Plug,
  CreditCard,
  UserRound,
  Upload,
  LockKeyhole,
  Check,
  X,
  Download,
  Trash2,
  Save,
  Camera,
  Users,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

const settingsTabs = [
  { name: "General", icon: Building2 },
  { name: "Profile & Security", icon: UserRound },
  { name: "Team & Permissions", icon: ShieldCheck },
  { name: "Notifications", icon: Bell },
  { name: "Integrations", icon: Plug },
  { name: "Subscription & Billing", icon: CreditCard },
];

const initialWorkspace = {
  organization: "Acme Studio",
  slug: "acme-studio",
  timezone: "Asia/Kolkata",
  dateFormat: "May 26, 2025",
};

const initialProfile = {
  fullName: "Alex Morgan",
  email: "alex@acmestudio.co",
};

const initialNotifications = [
  {
    title: "Email notifications",
    description: "Receive updates directly in your inbox.",
    enabled: true,
  },
  {
    title: "Task assignments",
    description: "When someone assigns a task to you.",
    enabled: true,
  },
  {
    title: "Project updates",
    description: "Changes to projects you're involved in.",
    enabled: true,
  },
  {
    title: "Mentions & comments",
    description: "When someone mentions you or replies.",
    enabled: true,
  },
  {
    title: "Weekly summary",
    description: "Get a weekly overview of your workspace.",
    enabled: false,
  },
];

const permissions = [
  ["Manage organization settings", 1, 1, 0, 0, 0],
  ["Invite and remove members", 1, 1, 0, 0, 0],
  ["Create and edit projects", 1, 1, 1, 1, 0],
  ["Create and assign tasks", 1, 1, 1, 1, 0],
  ["View reports", 1, 1, 1, 1, 0],
  ["Manage billing", 1, 0, 0, 0, 0],
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For small teams getting started",
    features: ["3 members", "2 projects", "Basic dashboard"],
  },
  {
    name: "Pro",
    price: "$12",
    description: "For growing teams shipping faster",
    features: ["25 members", "Unlimited projects", "Advanced reports"],
    current: true,
  },
  {
    name: "Business",
    price: "$24",
    description: "For organizations needing control",
    features: [
      "Unlimited members",
      "Advanced permissions",
      "Org-wide reporting",
    ],
  },
];

const invoices = [
  { id: "INV-2025-004", date: "May 01, 2025", amount: "$216.00", status: "Paid" },
  { id: "INV-2025-003", date: "Apr 01, 2025", amount: "$216.00", status: "Paid" },
  { id: "INV-2025-002", date: "Mar 01, 2025", amount: "$216.00", status: "Paid" },
];

function SectionTitle({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-1 text-xs text-blue-200/70">{description}</p>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-[#273552] bg-[#151e33] p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="block text-xs font-medium text-blue-100/90">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#293754] bg-[#10182b] px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

function PrimaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-600 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#293754] bg-[#1b2742] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#263452]"
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${
        checked ? "bg-violet-500" : "bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SaveBar({ onSave, onDiscard, label = "Save changes" }) {
  return (
    <div className="mt-4 flex justify-end gap-2 border-t border-[#273552] pt-4">
      <SecondaryButton onClick={onDiscard}>Discard</SecondaryButton>
      <PrimaryButton onClick={onSave}>
        <Save size={14} />
        {label}
      </PrimaryButton>
    </div>
  );
}

// 1. GENERAL SETTINGS
function GeneralSettings() {
  const [form, setForm] = useState(initialWorkspace);
  const [saved, setSaved] = useState(initialWorkspace);
  const [logo, setLogo] = useState("");
  const [message, setMessage] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMessage("");
  };

  const save = () => {
    setSaved(form);
    setMessage("Workspace settings saved locally.");
  };

  const discard = () => {
    setForm(saved);
    setMessage("");
  };

  const deleteWorkspace = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace? This action cannot be undone."
    );

    if (confirmed) {
      alert("Connect your backend API to delete the workspace.");
    }
  };

  return (
    <div>
      <SectionTitle
        title="General settings"
        description="Update your workspace identity and regional preferences."
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-violet-500/20 text-xs font-bold text-violet-200">
            {logo ? (
              <img src={logo} alt="Workspace logo" className="h-full w-full object-cover" />
            ) : (
              "AS"
            )}
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Workspace logo</p>
            <p className="mt-1 text-[10px] text-blue-200/70">
              PNG, JPG or SVG. Max 2 MB.
            </p>

            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#293754] bg-[#1b2742] px-3 py-2 text-xs font-semibold text-white hover:bg-[#263452]">
              <Upload size={13} />
              Upload new
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2 * 1024 * 1024) {
                    alert("Please select an image smaller than 2 MB.");
                    return;
                  }

                  setLogo(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        <div className="my-4 border-t border-[#273552]" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="space-y-3"
        >
          <Field label="Organization name">
            <input
              className={inputClass}
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
              required
            />
          </Field>

          <Field label="Workspace URL">
            <div className="flex overflow-hidden rounded-lg border border-[#293754] bg-[#10182b] focus-within:border-violet-500">
              <span className="flex items-center border-r border-[#293754] px-3 text-xs text-blue-200/60">
                teamflow.app/
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-white outline-none"
                value={form.slug}
                onChange={(e) =>
                  update(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                  )
                }
                required
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Timezone">
              <select
                className={inputClass}
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="UTC">UTC (GMT+0:00)</option>
                <option value="America/New_York">
                  America/New_York
                </option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
              </select>
            </Field>

            <Field label="Date format">
              <select
                className={inputClass}
                value={form.dateFormat}
                onChange={(e) => update("dateFormat", e.target.value)}
              >
                <option>May 26, 2025</option>
                <option>26/05/2025</option>
                <option>2025-05-26</option>
                <option>26 May 2025</option>
              </select>
            </Field>
          </div>

          <SaveBar onSave={save} onDiscard={discard} />
          {message && (
            <p className="text-xs text-emerald-400" role="status">
              {message}
            </p>
          )}
        </form>
      </Card>

      <Card className="mt-3 border-red-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold text-white">
              Delete workspace
            </h3>
            <p className="mt-1 text-[10px] text-blue-200/70">
              Permanently delete {form.organization} and all of its data.
            </p>
          </div>

          <button
            onClick={deleteWorkspace}
            className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            Delete workspace
          </button>
        </div>
      </Card>
    </div>
  );
}

// 2. PROFILE & SECURITY
function ProfileSecurity() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setMessage("");
  };

  return (
    <div className="space-y-3">
      <SectionTitle
        title="Profile & Security"
        description="Manage your personal details and account security."
      />

      <Card>
        <h3 className="mb-4 text-xs font-semibold text-white">
          Profile details
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
              AM
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-white">Profile photo</p>
            <p className="mt-1 text-[10px] text-blue-200/70">
              Recommended size: 400 × 400.
            </p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#293754] bg-[#1b2742] px-3 py-2 text-xs font-semibold text-white hover:bg-[#263452]">
              <Camera size={13} />
              Change photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2 * 1024 * 1024) {
                    alert("Maximum image size is 2 MB.");
                    return;
                  }

                  setPhoto(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        <div className="my-4 border-t border-[#273552]" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSavedProfile(profile);
            setMessage("Profile saved locally.");
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Full name">
              <input
                className={inputClass}
                value={profile.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                required
              />
            </Field>

            <Field label="Email address">
              <input
                type="email"
                className={inputClass}
                value={profile.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </Field>
          </div>

          <SaveBar
            label="Save profile"
            onSave={() => {
              setSavedProfile(profile);
              setMessage("Profile saved locally.");
            }}
            onDiscard={() => {
              setProfile(savedProfile);
              setMessage("");
            }}
          />

          {message && (
            <p className="mt-3 text-xs text-emerald-400" role="status">
              {message}
            </p>
          )}
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 text-xs font-semibold text-white">Security</h3>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#273552] py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-500/15 p-2 text-violet-300">
              <LockKeyhole size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Password</p>
              <p className="mt-1 text-[10px] text-blue-200/70">
                Manage your account password.
              </p>
            </div>
          </div>

          <SecondaryButton onClick={() => setShowPassword(!showPassword)}>
            Change password
          </SecondaryButton>
        </div>

        {showPassword && (
          <form
            className="space-y-3 border-t border-[#273552] py-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Connect your password update API here.");
            }}
          >
            <Field label="Current password">
              <input
                type="password"
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </Field>
            <Field label="New password">
              <input
                type="password"
                className={inputClass}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                className={inputClass}
                minLength={8}
                required
                autoComplete="new-password"
              />
            </Field>
            <PrimaryButton type="submit">Update password</PrimaryButton>
          </form>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#273552] py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-500/15 p-2 text-violet-300">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Two-factor authentication
              </p>
              <p className="mt-1 text-[10px] text-blue-200/70">
                Add an extra layer of security to your account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded px-2 py-1 text-[10px] font-semibold ${
                twoFactor
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {twoFactor ? "Enabled (demo)" : "Not enabled"}
            </span>

            <SecondaryButton
              onClick={() => {
                setTwoFactor(!twoFactor);
                if (!twoFactor) {
                  alert("Demo only. Connect a real MFA provider to enable 2FA.");
                }
              }}
            >
              {twoFactor ? "Disable" : "Set up"}
            </SecondaryButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

// 3. TEAM & PERMISSIONS
function TeamPermissions() {
  const roles = ["Owner", "Admin", "Manager", "Member", "Viewer"];

  return (
    <div>
      <SectionTitle
        title="Team & Permissions"
        description="Define what each role can access within Acme Studio."
      />

      <Card>
        <h3 className="mb-4 text-xs font-semibold text-white">
          Role permissions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="bg-[#10182b] text-[10px] text-blue-200/70">
                <th className="rounded-tl-lg px-3 py-3 font-medium">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role}
                    className="px-2 py-3 text-center font-medium"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {permissions.map((row) => (
                <tr key={row[0]} className="border-t border-[#273552]">
                  <td className="px-3 py-3 text-[10px] font-medium text-white">
                    {row[0]}
                  </td>

                  {row.slice(1).map((allowed, i) => (
                    <td key={i} className="px-2 py-3 text-center">
                      {allowed ? (
                        <Check
                          size={14}
                          className="mx-auto text-emerald-400"
                        />
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-500/10 p-3">
          <ShieldCheck size={15} className="shrink-0 text-blue-300" />
          <p className="text-[10px] leading-5 text-blue-200">
            Permissions apply only within Acme Studio. Members cannot access
            data from other workspaces.
          </p>
        </div>
      </Card>
    </div>
  );
}

// 4. NOTIFICATIONS
function NotificationSettings() {
  const [items, setItems] = useState(initialNotifications);
  const [saved, setSaved] = useState(initialNotifications);
  const [message, setMessage] = useState("");

  const updateItem = (index, enabled) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled } : item
      )
    );
    setMessage("");
  };

  return (
    <div>
      <SectionTitle
        title="Notifications"
        description="Choose how and when you want to receive updates."
      />

      <Card>
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-white">
            Notification preferences
          </h3>
          <p className="mt-1 text-[10px] text-blue-200/70">
            Customize your notification experience.
          </p>
        </div>

        {items.map((item, index) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 border-t border-[#273552] py-4"
          >
            <div>
              <p className="text-xs font-semibold text-white">
                {item.title}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-blue-200/70">
                {item.description}
              </p>
            </div>
            <Toggle
              checked={item.enabled}
              onChange={(value) => updateItem(index, value)}
            />
          </div>
        ))}

        <SaveBar
          onSave={() => {
            setSaved(items);
            setMessage("Notification preferences saved locally.");
          }}
          onDiscard={() => {
            setItems(saved);
            setMessage("");
          }}
        />

        {message && (
          <p className="mt-3 text-xs text-emerald-400" role="status">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}

// 5. INTEGRATIONS
function IntegrationSettings() {
  const integrations = [
    {
      name: "Slack",
      description: "Get project updates in your Slack channels.",
      initials: "S",
      color: "bg-purple-500/20 text-purple-300",
    },
    {
      name: "Google Calendar",
      description: "Sync your tasks and upcoming deadlines.",
      initials: "G",
      color: "bg-blue-500/20 text-blue-300",
    },
    {
      name: "GitHub",
      description: "Connect commits and pull requests to tasks.",
      initials: "GH",
      color: "bg-slate-500/20 text-slate-200",
    },
    {
      name: "Figma",
      description: "Keep your design projects connected.",
      initials: "F",
      color: "bg-pink-500/20 text-pink-300",
    },
  ];

  const [connected, setConnected] = useState({});
  const [message, setMessage] = useState("");

  return (
    <div>
      <SectionTitle
        title="Integrations"
        description="Connect the tools your team already uses."
      />

      <div className="space-y-3">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${integration.color}`}
              >
                {integration.initials}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-white">
                  {integration.name}
                </h3>
                <p className="mt-1 text-[10px] leading-4 text-blue-200/70">
                  {integration.description}
                </p>
                {connected[integration.name] && (
                  <p className="mt-1 text-[10px] text-emerald-400">
                    Demo connection active
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setConnected((prev) => ({
                    ...prev,
                    [integration.name]: !prev[integration.name],
                  }));
                  setMessage(
                    "Demo only. Configure OAuth and backend integration for real connections."
                  );
                }}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  connected[integration.name]
                    ? "border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:text-red-400"
                    : "border-[#293754] bg-[#1b2742] text-white hover:bg-[#263452]"
                }`}
              >
                {connected[integration.name] ? "Disconnect" : "Connect"}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {message && (
        <p className="mt-3 text-xs text-blue-200/70" role="status">
          {message}
        </p>
      )}
    </div>
  );
}

// 6. SUBSCRIPTION & BILLING
function SubscriptionBilling() {
  const [currentPlan, setCurrentPlan] = useState("Pro");
  const [message, setMessage] = useState("");

  const choosePlan = (name) => {
    if (name === currentPlan) return;

    const confirmed = window.confirm(`Switch to the ${name} plan?`);
    if (confirmed) {
      setMessage(
        "Demo only. Connect your billing provider to process plan changes."
      );
    }
  };

  return (
    <div>
      <SectionTitle
        title="Subscription & Billing"
        description="Manage your plan, usage, payment method, and invoices."
      />

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-3.5 ${
              plan.name === currentPlan
                ? "border-violet-500 bg-[#151e33] ring-1 ring-violet-500"
                : "border-[#273552] bg-[#151e33]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-white">
                {plan.name}
              </h3>

              {plan.name === currentPlan && (
                <span className="rounded bg-violet-500/20 px-2 py-1 text-[9px] font-semibold text-violet-200">
                  Current plan
                </span>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                {plan.price}
              </span>
              <span className="text-[9px] text-blue-200/60">
                / member / month
              </span>
            </div>

            <p className="mt-2 min-h-8 text-[10px] leading-4 text-blue-200/70">
              {plan.description}
            </p>

            <ul className="my-3 flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-[10px] text-blue-100"
                >
                  <Check size={13} className="text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => choosePlan(plan.name)}
              className={`w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                plan.name === currentPlan
                  ? "border border-[#293754] bg-[#1b2742] text-white hover:bg-[#263452]"
                  : "bg-violet-500 text-white hover:bg-violet-600"
              }`}
            >
              {plan.name === currentPlan
                ? "Manage plan"
                : plan.name === "Free"
                  ? "Downgrade"
                  : "Upgrade"}
            </button>
          </div>
        ))}
      </div>

      {message && (
        <p className="mt-3 text-xs text-blue-200/70" role="status">
          {message}
        </p>
      )}

      <Card className="mt-3">
        <h3 className="mb-4 text-xs font-semibold text-white">Plan usage</h3>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-white">Members</p>
                <p className="mt-1 text-[9px] text-blue-200/60">
                  18 of 25 seats
                </p>
              </div>
              <span className="text-xs font-semibold text-white">72%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#273552]">
              <div className="h-full w-[72%] rounded-full bg-violet-500" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-white">Storage</p>
                <p className="mt-1 text-[9px] text-blue-200/60">
                  6.4 GB of 20 GB
                </p>
              </div>
              <span className="text-xs font-semibold text-white">32%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#273552]">
              <div className="h-full w-[32%] rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-3">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-semibold text-white">Invoice history</h3>
          <SecondaryButton
            onClick={() =>
              alert("Connect your billing provider to manage payment methods.")
            }
          >
            Payment method
          </SecondaryButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <thead className="bg-[#10182b] text-[9px] uppercase text-blue-200/60">
              <tr>
                <th className="px-3 py-3 font-medium">Invoice</th>
                <th className="px-3 py-3 font-medium">Billing date</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t border-[#273552] text-[10px] text-blue-100"
                >
                  <td className="px-3 py-3">{invoice.id}</td>
                  <td className="px-3 py-3">{invoice.date}</td>
                  <td className="px-3 py-3">{invoice.amount}</td>
                  <td className="px-3 py-3">
                    <span className="rounded bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-400">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() =>
                        alert(
                          `Connect your invoice API to download ${invoice.id}.`
                        )
                      }
                      className="inline-flex items-center gap-1 text-blue-300 hover:text-white"
                    >
                      <Download size={13} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// MAIN SETTINGS PAGE
export const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");

  const activeSettings = {
    General: <GeneralSettings />,
    "Profile & Security": <ProfileSecurity />,
    "Team & Permissions": <TeamPermissions />,
    Notifications: <NotificationSettings />,
    Integrations: <IntegrationSettings />,
    "Subscription & Billing": <SubscriptionBilling />,
  };

  return (
    <div className="min-h-full bg-[#0b1020] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-7">
      <div className="mx-auto max-w-[1100px]">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Settings
          </h1>
          <p className="mt-2 text-xs text-blue-200/70 sm:text-sm">
            Manage your workspace and account preferences.
          </p>
        </div>

        {/* SETTINGS LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[190px_minmax(0,1fr)] lg:gap-5">
          {/* SETTINGS NAVIGATION */}
          <aside className="min-w-0 rounded-xl border border-[#273552] bg-[#151e33] p-1.5">
            <nav
              className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
              aria-label="Settings navigation"
            >
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.name;

                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    aria-current={active ? "page" : undefined}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition md:w-full ${
                      active
                        ? "bg-[#29244f] text-violet-300"
                        : "text-blue-200/70 hover:bg-[#1b2742] hover:text-white"
                    }`}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* SETTINGS CONTENT */}
          <main className="min-w-0">
            {activeSettings[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
};

