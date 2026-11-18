import React from "react";

export const StatisticCard = ({ title, value, subtitle, icon: Icon, tone = "violet" }) => {
  const tones = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-sky-50 text-sky-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-rose-50 text-rose-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="flex min-h-[106px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.02)]">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl p-3 ${tones[tone] || tones.violet}`}>
        {Icon ? <Icon size={20} /> : null}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500">{title}</p>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-[26px] font-bold leading-none text-slate-900">{value}</span>
          <span className="text-[10px] text-slate-400">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};
