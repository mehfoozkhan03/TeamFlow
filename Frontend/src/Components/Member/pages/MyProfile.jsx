import React, { useState } from "react";
import { CalendarDays, Camera, Mail, Pencil, Users } from "lucide-react";


export const MyProfile = () => {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("Rahul");
  const [lastName, setLastName] = useState("Sharma");
  const [jobTitle, setJobTitle] = useState("Frontend Developer");
  const [timeZone, setTimeZone] = useState("India Standard Time (UTC+5:30)");
  const [preferences, setPreferences] = useState({ assignments: true, deadlines: true, mentions: true });

  const togglePreference = (key) => setPreferences((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
        <main className="p-[30px] max-md:p-4">
          <h1 className="text-[30px] font-medium text-slate-900">My Profile</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your personal information and preferences.</p>
          <div className="mt-7 grid grid-cols-[315px_1fr] items-start gap-5 max-xl:grid-cols-1">
            <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-[108px] bg-gradient-to-r from-violet-100 to-purple-50" />
              <div className="-mt-12 px-6 pb-6">
                <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-violet-700 text-2xl font-bold text-white">RS<button className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-violet-600"><Pencil size={13} /></button></div>
                <h2 className="mt-3 text-center text-lg font-semibold text-slate-900">{firstName} {lastName}</h2>
                <p className="mt-1 text-center text-[10px] text-slate-400">rahul.sharma@example.com</p>
                <div className="mt-4 text-center"><span className="rounded-lg bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">Team Member</span></div>
                <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3"><span className="rounded-xl bg-violet-600 p-3 text-white"><Users size={20} /></span><div><p className="text-[9px] text-slate-400">Team</p><b className="text-xs text-slate-800">DevSquad</b></div></div>
                  <div className="flex items-center gap-3"><CalendarDays className="ml-2 text-slate-400" size={20} /><div><p className="text-[9px] text-slate-400">Member since</p><b className="text-xs text-slate-500">August 12, 2026</b></div></div>
                </div>
              </div>
            </aside>
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><h2 className="text-lg font-medium text-slate-900">Personal information</h2><p className="mt-1 text-xs text-slate-400">Update your permitted profile details.</p></div><button onClick={() => setEditing(!editing)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600"><Pencil size={15} />{editing ? "Done editing" : "Edit profile"}</button></div>
                <div className="mt-5 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <label className="text-[10px] font-medium text-slate-600">First name<input disabled={!editing} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 outline-none disabled:opacity-100" /></label>
                  <label className="text-[10px] font-medium text-slate-600">Last name<input disabled={!editing} value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 outline-none disabled:opacity-100" /></label>
                  <label className="col-span-2 text-[10px] font-medium text-slate-600 max-sm:col-span-1">Email address<div className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-400"><Mail size={16} /><span className="text-xs">rahul.sharma@example.com</span></div><span className="mt-2 block text-[9px] text-slate-400">Contact your Team Leader to change your account email.</span></label>
                  <label className="text-[10px] font-medium text-slate-600">Job title<input disabled={!editing} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 outline-none disabled:opacity-100" /></label>
                  <label className="text-[10px] font-medium text-slate-600">Time zone<select disabled={!editing} value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 outline-none disabled:opacity-100"><option>India Standard Time (UTC+5:30)</option><option>Coordinated Universal Time (UTC+0)</option><option>Eastern Time (UTC-5)</option></select></label>
                </div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-medium text-slate-900">Notification preferences</h2><p className="mt-1 border-b border-slate-100 pb-5 text-xs text-slate-400">Choose the updates you want to receive.</p>
                {[["assignments","Task assignments","When a new task is assigned to me"],["deadlines","Deadline reminders","Reminders before a task deadline"],["mentions","Mentions and replies","When someone mentions or replies to me"]].map(([key,title,description]) => <div key={key} className="flex items-center justify-between gap-4 border-b border-slate-100 py-5"><div><b className="text-xs text-slate-800">{title}</b><p className="mt-1 text-[10px] text-slate-400">{description}</p></div><button onClick={() => togglePreference(key)} aria-label={`Toggle ${title}`} className={`h-6 w-11 rounded-full p-1 transition ${preferences[key] ? "bg-violet-600" : "bg-slate-300"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${preferences[key] ? "translate-x-5" : ""}`} /></button></div>)}
              </section>
            </div>
          </div>
        </main>
      </div>
    
  );
};
