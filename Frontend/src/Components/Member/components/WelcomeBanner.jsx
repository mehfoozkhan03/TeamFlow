
import { CalendarDays, Check, Folder } from "lucide-react";

export const WelcomeBanner = () => {
  // Get the current date dynamically.
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="relative flex min-h-[184px] items-center justify-between overflow-hidden rounded-[22px] border border-violet-100 bg-gradient-to-r from-[#f7f0ff] to-[#f2ebff] px-8 py-6">
      <div className="relative z-10">
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] text-violet-700">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-600 ring-4 ring-violet-200" />
          DEVSQUAD WORKSPACE
        </p>

        <h1 className="text-[26px] font-medium tracking-tight text-slate-900 max-sm:text-2xl">
          Welcome back, Rahul!
        </h1>

        <p className="mt-2.5 text-[13px] text-slate-500">
          Here’s an overview of your tasks, projects and team activities.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-5 text-[12px] text-slate-500">
          <span className="rounded-md bg-violet-100 px-2 py-1 text-[10px] font-semibold text-violet-700">
            Team Member
          </span>

          <span className="flex items-center gap-2">
            <CalendarDays size={17} />
            {currentDate}
          </span>
        </div>
      </div>

      <div className="relative mr-4 grid h-48 w-48 shrink-0 place-items-center rounded-full border border-violet-200 max-lg:hidden">
        <div className="absolute inset-7 rounded-full border border-dashed border-violet-200" />

        <div className="flex -space-x-3">
          {["RS", "PP", "AM"].map((initials, index) => (
            <span
              key={initials}
              className={`grid h-11 w-11 place-items-center rounded-full border-2 border-white text-sm font-bold text-white shadow ${
                index === 1
                  ? "bg-indigo-500"
                  : index === 2
                    ? "bg-sky-500"
                    : "bg-violet-600"
              }`}
            >
              {initials}
            </span>
          ))}
        </div>

        <span className="absolute right-4 top-12 grid h-11 w-11 rotate-6 place-items-center rounded-xl bg-white text-violet-600 shadow-lg">
          <Check size={20} />
        </span>

        <span className="absolute bottom-5 left-0 grid h-11 w-11 -rotate-6 place-items-center rounded-xl bg-white text-violet-600 shadow-lg">
          <Folder size={19} />
        </span>
      </div>
    </section>
  );
};
