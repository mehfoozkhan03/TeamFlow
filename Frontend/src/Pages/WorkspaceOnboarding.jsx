
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const WorkspaceOnboarding = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
      };

      const { data } = await axios.post(
        "/api/organizations",
        payload,
        { withCredentials: true }
      );

      const org = data.organization;

      navigate(`/org/${org._id}/dashboard`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create workspace."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-7 text-center">
          <p className="mb-3 text-xs font-bold tracking-widest text-indigo-600">
            ● YOUR NEW WORKSPACE
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Set up your workspace
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Workspaces keep your projects, tasks, and teammates
            organized in one focused place.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
        >
          <div className="space-y-6 p-6 sm:p-7">
            {/* Organization name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-semibold text-slate-800"
              >
                Organization name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Studio"
                maxLength={160}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-[11px] text-slate-400">
                This is the name your teammates will see.
              </p>
            </div>

            {/* Owner information */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  You'll be the workspace owner
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Manage members and workspace settings.
                </p>
              </div>

              <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-[10px] font-semibold text-indigo-600">
                Owner
              </span>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating workspace..."
                : "Create workspace →"}
            </button>
          </div>

          
        </form>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          By creating a workspace, you agree to our Terms
          and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
