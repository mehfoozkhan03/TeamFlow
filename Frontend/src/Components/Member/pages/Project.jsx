import React from "react";
import { Folder, Check, Activity, CalendarDays, ChevronRight } from "lucide-react";
import { MemberSidebar } from "../components/Sidebar";
import { MemberHeader } from "../components/MemberHeader";
import { StatisticCard } from "../components/StatisticCard";

const projects = [
  { name: "TeamFlow Website", description: "A modern collaboration platform for high-performing teams.", progress: 72, status: "In Progress", tone: "violet", assigned: 5, completed: 3, deadline: "Nov 20, 2026", people: "PP SS RS AM" },
  { name: "Mobile Application", description: "Native mobile experience for task and project management.", progress: 45, status: "In Progress", tone: "blue", assigned: 4, completed: 2, deadline: "Nov 28, 2026", people: "PP VS RS" },
  { name: "Design System v2", description: "Shared foundations and accessible components for TeamFlow.", progress: 88, status: "In Review", tone: "orange", assigned: 3, completed: 2, deadline: "Dec 04, 2026", people: "SS RS PP" },
];

export const Project = () => (
  <div className="min-h-screen bg-[#f7f8fc]">
    <MemberSidebar />
    <div className="min-h-screen lg:pl-[244px] xl:pl-[244px]">
      <MemberHeader pageTitle="Projects" />
      <main className="p-[30px] max-md:p-4">
        <h1 className="text-[30px] font-medium text-slate-900">Projects</h1>
        <p className="mt-2 text-sm text-slate-500">Projects you’re part of in the DevSquad team.</p>
        <section className="mt-7 grid max-w-[720px] grid-cols-3 gap-4 max-sm:grid-cols-1">
          <StatisticCard title="Active projects" value="3" icon={Folder} />
          <StatisticCard title="My tasks across projects" value="12" icon={Activity} tone="blue" />
          <StatisticCard title="Tasks completed by me" value="7" icon={Check} tone="green" />
        </section>
        <section className="mt-5 grid grid-cols-3 gap-5 max-2xl:grid-cols-2 max-lg:grid-cols-1">
          {projects.map((project) => (
            <article key={project.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.03)]">
              <div className={`flex h-[110px] items-start justify-between p-6 ${project.tone === "violet" ? "bg-violet-50" : project.tone === "blue" ? "bg-sky-50" : "bg-orange-50"}`}>
                <span className={`rounded-2xl p-4 text-white shadow-lg ${project.tone === "violet" ? "bg-violet-600" : project.tone === "blue" ? "bg-sky-600" : "bg-orange-500"}`}>{project.tone === "blue" ? <Activity size={25} /> : project.tone === "orange" ? <span className="text-2xl">▦</span> : <Folder size={25} />}</span>
                <span className={`rounded-xl px-3 py-3 text-[10px] font-bold text-white shadow-lg ${project.tone === "violet" ? "bg-violet-600" : project.tone === "blue" ? "bg-sky-600" : "bg-orange-500"}`}>{project.status}</span>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-medium text-slate-900">{project.name}</h2>
                <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{project.description}</p>
                <div className="mt-6 flex justify-between text-[10px] text-slate-400"><span>Overall project progress</span><b className="text-violet-600">{project.progress}%</b></div>
                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${project.tone === "violet" ? "bg-violet-600" : project.tone === "blue" ? "bg-sky-500" : "bg-orange-400"}`} style={{ width: `${project.progress}%` }} /></div>
                <p className="mt-2 text-[9px] text-slate-400">This is team-wide progress</p>
                <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] text-slate-400">My assigned tasks</p><b className="mt-1 block text-lg">{project.assigned}</b></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] text-slate-400">Completed by me</p><b className="mt-1 block text-lg">{project.completed}</b></div></div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="flex items-center gap-2 text-[10px] text-slate-400"><CalendarDays size={14} />{project.deadline}</span><span className="text-[10px] font-bold text-slate-500">{project.people}</span></div>
                <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">View project <ChevronRight size={16} /></button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  </div>
);
