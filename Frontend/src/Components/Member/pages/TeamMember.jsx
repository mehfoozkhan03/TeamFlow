
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MessageSquare, MoreHorizontal, Search } from "lucide-react";

import { MemberSidebar } from "../components/Sidebar";
import { MemberHeader } from "../components/MemberHeader";

export const TeamMember = () => {
  const [search, setSearch] = useState("");

  // Read team members from the shared Redux store.
  const members = useSelector(
    (state) => state.member?.teamMembers ?? []
  );

  const filtered = members.filter((member) =>
    `${member.name} ${member.role} ${member.responsibility}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <MemberSidebar />

      <div className="min-h-screen lg:pl-[244px] xl:pl-[244px]">
        <MemberHeader pageTitle="Team Members" />

        <main className="p-[30px] max-md:p-4">
          <h1 className="text-[30px] font-medium text-slate-900">
            Team Members
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Meet the people you collaborate with in DevSquad.
          </p>

          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex h-11 w-[365px] max-w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teammates..."
                className="w-full text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              {members.length} team members
            </p>
          </div>

          <section className="mt-5 grid grid-cols-3 gap-5 max-2xl:grid-cols-2 max-lg:grid-cols-1">
            {filtered.map((member) => (
              <article
                key={member.id}
                className="relative min-h-[265px] rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_4px_18px_rgba(15,23,42,0.02)]"
              >
                <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-500" />

                <button
                  className="absolute right-5 top-5 text-slate-400"
                  aria-label="Member options"
                >
                  <MoreHorizontal size={19} />
                </button>

                <div className="mx-auto mt-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-lg font-bold text-white">
                  {member.initials}
                </div>

                <h2 className="mt-4 text-base font-medium text-slate-900">
                  {member.name}
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  {member.role}
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 px-3 py-4">
                  <p className="text-[9px] text-slate-400">
                    Current responsibility
                  </p>

                  <p className="mt-2 text-[10px] font-bold text-slate-800">
                    {member.responsibility}
                  </p>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <MessageSquare size={17} />
                  Message
                </button>
              </article>
            ))}

            {filtered.length === 0 && (
              <p className="col-span-full rounded-xl bg-white p-8 text-center text-sm text-slate-400">
                No teammates found.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
