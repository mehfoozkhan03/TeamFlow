
import { useState, useEffect } from "react";
import {steps} from "../Data/home"
import { ArrowRight, CircleCheck, CircleHelp, Link2, MessageSquare, UserRoundPlus, Users, X } from "lucide-react";

export const Home = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [teamData, setTeamData] = useState({
    teamName: "",
    description: "",
    projectName: "",
  });
  const [error, setError] = useState("");

  // Close modal using Escape
  useEffect(() => {
    if (!activeModal) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setError("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  const closeModal = () => {
    setActiveModal(null);
    setError("");
  };

  // Create team form
  const handleCreateTeam = (e) => {
    e.preventDefault();

    if (!teamData.teamName.trim()) {
      setError("Please enter your team name.");
      return;
    }

    if (!teamData.projectName.trim()) {
      setError("Please enter your project name.");
      return;
    }

    // Connect your backend API here
    console.log("Create team:", teamData);
    setError("Connect your backend API to create your workspace.");
  };

  // Join team form
  const handleJoinTeam = (e) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      setError("Please enter your invitation code.");
      return;
    }

    // Connect your backend API here
    console.log("Join team:", inviteCode.trim());
    setError("Connect your backend API to verify this invitation code.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Background Decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute right-0 top-[34rem] h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <MessageSquare size={16} />
            YOUR NEXT CHAPTER
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-blue-950 sm:text-5xl lg:text-6xl">
            Let's get your team started.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-500 sm:text-lg">
            Create a new team or join an existing one to start
            collaborating, managing projects, and achieving more together.
          </p>
        </section>

        {/* Team Cards */}
        <section className="mt-10 flex justify-center">
          <div className="grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
            {/* Create Team Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#e9defe] bg-[#f7f2ff] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(90,50,150,0.12)]">
              <div className="pointer-events-none absolute -right-8 -top-20 h-40 w-40 rounded-full border border-[#eee4fc]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#7c2cf5] text-white shadow-lg shadow-purple-200">
                    <Users size={23} strokeWidth={2.2} />
                  </div>

                  <span className="pt-1 text-[10px] font-bold tracking-[1.5px] text-[#9383b3]">
                    01 / LEAD A WORKSPACE
                  </span>
                </div>

                <h2 className="mt-7 text-[22px] font-extrabold tracking-tight text-[#19172b]">
                  Create a Team
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#7c879a]">
                  Start a new workspace, bring people together, and lead
                  your team towards success.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#72778b]">
                    <CircleCheck size={15} className="shrink-0 text-[#9958ff]" />
                    Become a Team Leader
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("create");
                      setError("");
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#7c2cf5] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6920df] active:scale-95"
                  >
                    Create Team
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Join Team Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#f0edf5] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(50,40,80,0.10)]">
              <div className="pointer-events-none absolute -right-8 -top-20 h-40 w-40 rounded-full border border-[#f0e9fa] bg-[#faf7ff]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#f1e7ff] text-[#8b3df5]">
                    <UserRoundPlus size={23} strokeWidth={2.2} />
                  </div>

                  <span className="pt-1 text-[10px] font-bold tracking-[1.5px] text-[#9383b3]">
                    02 / JOIN YOUR PEOPLE
                  </span>
                </div>

                <h2 className="mt-7 text-[22px] font-extrabold tracking-tight text-[#19172b]">
                  Join a Team
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-[#7c879a]">
                  Already have a team? Join your colleagues and start
                  collaborating on shared projects.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#72778b]">
                    <CircleCheck size={15} className="shrink-0 text-[#9958ff]" />
                    Become a Team Member
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal("join");
                      setError("");
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#e8dafa] bg-white px-5 py-3 text-xs font-bold text-[#7c2cf5] transition hover:bg-[#f8f2ff] active:scale-95"
                  >
                    Join Team
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How TeamFlow Works */}
        <section className="mx-auto mt-10 w-full max-w-5xl border-t border-slate-100 pt-6">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <h2 className="shrink-0 text-sm font-bold text-slate-800">
              How TeamFlow works
            </h2>

            <div className="h-px min-w-5 flex-1 bg-slate-100" />

            <span className="shrink-0 text-[10px] font-bold tracking-[1.8px] text-slate-400">
              THREE SIMPLE STEPS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
            {steps.map(({ number, title, description, Icon }, index) => (
              <div key={title} className="relative flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eee5fc] bg-white text-[#994df5] shadow-[0_1px_5px_rgba(124,44,245,0.08)]">
                  <Icon size={19} strokeWidth={1.9} />
                </div>

                <div className="min-w-0 pt-0.5">
                  <h3 className="text-xs font-bold text-slate-800">
                    <span className="mr-1 text-slate-400">{number}</span>
                    {title}
                  </h3>

                  <p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                </div>

                {index !== steps.length - 1 && (
                  <div className="hidden flex-1 items-center px-3 pt-5 md:flex">
                    <div className="w-full border-t border-dotted border-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= MODALS ================= */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-[26px] bg-white p-7 shadow-2xl sm:p-9"
          >
            {/* Modal Header */}
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7c2cf5]" />
                <span className="text-[11px] font-bold tracking-[2px] text-[#7c2cf5]">
                  {activeModal === "create"
                    ? "NEW WORKSPACE"
                    : "JOIN A WORKSPACE"}
                </span>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Icon */}
            <div className="mb-8 flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-[#f1e7ff] text-[#8738f5]">
              {activeModal === "create" ? (
                <Users size={27} />
              ) : (
                <Link2 size={27} />
              )}
            </div>

            <h2
              id="modal-title"
              className="text-3xl font-extrabold tracking-tight text-[#19172b]"
            >
              {activeModal === "create"
                ? "Create your team"
                : "Join your team"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#7c879a]">
              {activeModal === "create"
                ? "Set up your workspace now. You can invite teammates in the next step."
                : "Enter the unique code your Team Leader shared with you."}
            </p>

            {/* CREATE TEAM FORM */}
            {activeModal === "create" && (
              <form onSubmit={handleCreateTeam} className="mt-9 space-y-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Team Name <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={teamData.teamName}
                    onChange={(e) => {
                      setTeamData({
                        ...teamData,
                        teamName: e.target.value,
                      });
                      setError("");
                    }}
                    placeholder="e.g. Product Design"
                    className="w-full rounded-[18px] border border-[#e9e7ef] px-4 py-4 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Team Description
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={teamData.description}
                    onChange={(e) =>
                      setTeamData({
                        ...teamData,
                        description: e.target.value,
                      })
                    }
                    placeholder="What is your team working towards?"
                    className="w-full resize-none rounded-[18px] border border-[#e9e7ef] px-4 py-4 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Project Name <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={teamData.projectName}
                    onChange={(e) => {
                      setTeamData({
                        ...teamData,
                        projectName: e.target.value,
                      });
                      setError("");
                    }}
                    placeholder="e.g. Mobile app launch"
                    className="w-full rounded-[18px] border border-[#e9e7ef] px-4 py-4 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#7c2cf5] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6920df] active:scale-[0.98]"
                >
                  Create Workspace
                  <ArrowRight size={17} />
                </button>
              </form>
            )}

            {/* JOIN TEAM FORM */}
            {activeModal === "join" && (
              <form onSubmit={handleJoinTeam} className="mt-9">
                <label
                  htmlFor="inviteCode"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Team Invitation Code
                </label>

                <input
                  id="inviteCode"
                  type="text"
                  required
                  autoComplete="off"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your invitation code"
                  className="w-full rounded-[18px] border border-[#e9e7ef] px-4 py-4 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                />

                <div className="mt-3 flex items-start gap-2 rounded-[18px] bg-[#f7f8fa] p-4 text-xs leading-5 text-[#7c879a]">
                  <CircleHelp
                    size={17}
                    className="mt-0.5 shrink-0 text-[#8b3df5]"
                  />
                  <p>
                    Ask your Team Leader for the unique invitation code.
                  </p>
                </div>

                {error && (
                  <p role="alert" className="mt-3 text-xs text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#7c2cf5] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6920df] active:scale-[0.98]"
                >
                  Join Team
                  <ArrowRight size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
