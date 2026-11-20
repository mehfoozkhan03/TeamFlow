import React, { useState } from "react";


export const Settings = () => {
  const [settings, setSettings] = useState({ compact: false, motion: false, monday: true });
  const update = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  const options = [
    { key: "compact", title: "Compact task cards", description: "Show more tasks on screen at once." },
    { key: "motion", title: "Reduce motion", description: "Minimize interface animations." },
    { key: "monday", title: "Start week on Monday", description: "Use Monday as the first day in calendars." },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
        <main className="p-[30px] max-md:p-4">
          <h1 className="text-[30px] font-medium text-slate-900">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Personalize how TeamFlow works for you.</p>
          <section className="mt-7 max-w-[875px] rounded-2xl border border-slate-200 bg-white px-6">
            <h2 className="border-b border-slate-200 py-6 text-lg font-medium text-slate-900">Workspace preferences</h2>
            {options.map((option) => <div key={option.key} className="flex items-center justify-between gap-5 border-b border-slate-100 py-5"><div><b className="text-xs text-slate-800">{option.title}</b><p className="mt-1 text-[10px] text-slate-400">{option.description}</p></div><button onClick={() => update(option.key)} aria-label={`Toggle ${option.title}`} className={`h-6 w-11 shrink-0 rounded-full p-1 transition ${settings[option.key] ? "bg-violet-600" : "bg-slate-300"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${settings[option.key] ? "translate-x-5" : ""}`} /></button></div>)}
          </section>
        </main>
      </div>
  );
};
