import React from "react";

const problems = [
  {
    icon: "▦",
    title: "Scattered Work",
    description:
      "Bring tasks, project updates, and conversations into one organized workspace. Stop losing hours digging through disjointed messaging threads.",
    link: "Unified command center",
  },
  {
    icon: "☷",
    title: "Unclear Priorities",
    description:
      "Give everyone a clear view of what matters, what comes next, and what needs attention. Eliminate ambiguous goals and misalignment.",
    link: "Dynamic priority matrix",
  },
  {
    icon: "♟",
    title: "Disconnected Teams",
    description:
      "Help teammates collaborate, share updates, and stay aligned around a common goal, whether working side-by-side or completely remote.",
    link: "Seamless co-presence",
  },
];

const principles = [
  {
    number: "01",
    icon: "◎",
    title: "Clarity",
    description:
      "Make work easier to understand, prioritize, and track. No hidden dependencies or obscure blockers.",
  },
  {
    number: "02",
    icon: "♧",
    title: "Collaboration",
    description:
      "Build a culture of connection and shared forward momentum with mutual trust, fast feedback, and shared ownership.",
  },
  {
    number: "03",
    icon: "⌁",
    title: "Continuous Improvement",
    description:
      "Learn from every project and keep finding better ways to work through introspective insights.",
  },
  {
    number: "04",
    icon: "♜",
    title: "Thoughtful Simplicity",
    description:
      "Put the right tools in everyone's hands, thoughtfully integrated to feel natural in the workspace.",
  },
];

const workflow = [
  {
    number: "1",
    phase: "PHASE: PLAN",
    title: "Plan",
    description:
      "Organize projects, deadlines, and priorities with absolute structural precision.",
    task: "Sprint 03 Delivery",
    status: "On Track",
    tags: ["Design", "API", "Dashboard"],
  },
  {
    number: "2",
    phase: "PHASE: COLLABORATE",
    title: "Collaborate",
    description:
      "Assign tasks, share comments, and coordinate responsibilities in real-time together.",
    task: "API Gateway Redesign",
    status: "In Review",
    tags: ["Frontend", "Backend"],
  },
  {
    number: "3",
    phase: "PHASE: DELIVER",
    title: "Deliver",
    description:
      "Track progress, identify bottlenecks, and celebrate completed work together.",
    task: "Sprint Velocity",
    status: "4/4 pts",
    tags: ["Release", "Completed"],
  },
];

const footerGroups = [
  {
    title: "PRODUCT",
    links: ["Features", "Projects", "Pricing", "Integrations", "Changelog"],
  },
  {
    title: "COMPANY",
    links: ["About Us", "Contact", "Careers", "News"],
  },
  {
    title: "SUPPORT",
    links: ["Help Center", "Documentation", "Community", "Status"],
  },
  {
    title: "LEGAL",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Security",
      "Cookie Settings",
    ],
  },
];

function SectionLabel({ children }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c1a5ff]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#a982ff]" />
      {children}
    </p>
  );
}

function TaskPreview() {
  return (
    <div className="relative mx-auto w-full max-w-122.5 rounded-[22px] border border-white/[0.07] bg-[#141a2b] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#333a50]" />
          <span className="h-2 w-2 rounded-full bg-[#333a50]" />
          <span className="h-2 w-2 rounded-full bg-[#333a50]" />
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">
          ● Live Workspace
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-[#0d1323] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[10px] text-[#c1a5ff]">
            Sprint Alpha · TF-002
          </span>
          <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">
            In Progress
          </span>
        </div>
        <h3 className="text-base font-semibold text-white sm:text-lg">
          Architectural Blueprint Sync
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Sprint 03 · Engineering
        </p>

        <div className="mt-4 flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex -space-x-2">
            {["S", "A", "R", "+"].map((item, i) => (
              <span
                key={item}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0d1323] text-[9px] font-semibold ${
                  i === 0
                    ? "bg-violet-400 text-slate-950"
                    : i === 1
                    ? "bg-cyan-300 text-slate-950"
                    : i === 2
                    ? "bg-pink-300 text-slate-950"
                    : "bg-[#30374b] text-white"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">◷ 3 days left</span>
        </div>

        <p className="mb-3 mt-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">
          Sprint Workflow
        </p>
        {[
          ["Backend Alignment", "Done"],
          ["Real-time State Validation", "Review"],
        ].map(([task, status], i) => (
          <div
            key={task}
            className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-white/[0.035] p-3"
          >
            <span className="text-[10px] text-slate-300">
              <span className="mr-2 text-emerald-300">
                {i === 0 ? "✓" : "◉"}
              </span>
              {task}
            </span>
            <span
              className={`text-[9px] ${
                i === 0 ? "text-emerald-300" : "text-violet-300"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg border border-white/5 bg-white/2.5 px-3 py-3">
        <span className="text-[10px] text-slate-400">
          ◉ 4 team members collaborating
        </span>
        <span className="text-[10px] text-slate-500">↗ 6 tasks synced</span>
      </div>

      <div className="absolute -bottom-4 -left-3 -z-10 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />
    </div>
  );
}

function MissionVisual() {
  return (
    <div className="relative flex min-h-72.5 items-center justify-center overflow-hidden rounded-3xl border border-white/6 bg-[#141a2b] sm:min-h-92.5">
      <div className="absolute h-52 w-52 rounded-full bg-violet-600/10 blur-3xl" />

      {[190, 145, 100, 54].map((size) => (
        <div
          key={size}
          className="absolute rounded-full border border-violet-300/15"
          style={{ width: size, height: size }}
        />
      ))}

      <div className="absolute h-47.5 w-px rotate-45 bg-violet-300/10" />
      <div className="absolute h-47.5 w-px -rotate-45 bg-violet-300/10" />

      <div className="absolute left-1/2 top-[24%] -translate-x-1/2 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/70 bg-[#172b32] text-emerald-300">
          ✓
        </span>
        <span className="mt-1 block text-[9px] text-emerald-300">Quality</span>
      </div>

      <div className="absolute left-[21%] top-[48%] -translate-y-1/2 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-300/70 bg-[#152a33] text-teal-300">
          ◇
        </span>
        <span className="mt-1 block text-[9px] text-slate-400">Plan</span>
      </div>

      <div className="absolute right-[18%] top-[48%] -translate-y-1/2 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/70 bg-[#242039] text-violet-200">
          ♙
        </span>
        <span className="mt-1 block text-[9px] text-slate-400">Team</span>
      </div>

      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/70 bg-[#242039] text-violet-200">
          ▣
        </span>
        <span className="mt-1 block text-[9px] text-slate-400">Delivery</span>
      </div>

      <div className="relative z-10 flex h-14.5 w-14.5 items-center justify-center rounded-full border border-violet-300/50 bg-violet-500/15 shadow-[0_0_45px_rgba(139,92,246,0.3)]">
        <div className="h-6 w-6 rounded-full bg-linear-to-br from-[#d6bdff] to-[#8c5cf6] shadow-[0_0_25px_rgba(168,130,255,0.7)]" />
      </div>
    </div>
  );
}

function WorkflowCard({ item }) {
  return (
    <article className="rounded-2xl border border-white/6 bg-[#151b2c] p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-[#c1a5ff]">
          {item.number}
        </span>
        <span className="text-[9px] font-semibold tracking-wider text-slate-500">
          {item.phase}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
      <p className="mt-2 min-h-13.75 text-xs leading-6 text-slate-400">
        {item.description}
      </p>

      <div className="mt-4 rounded-xl border border-white/6 bg-[#0c1221] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-medium text-slate-200">
            {item.task}
          </span>
          <span className="shrink-0 text-[9px] text-emerald-300">
            {item.status}
          </span>
        </div>

        {item.number === "1" && (
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`h-1.5 flex-1 rounded-full ${
                  n < 4 ? "bg-violet-400" : "bg-[#343b50]"
                }`}
              />
            ))}
          </div>
        )}

        {item.number === "2" && (
          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/20 text-[9px] text-violet-200">
              S
            </span>
            <span className="text-[9px] text-slate-400">Assigned to team</span>
          </div>
        )}

        {item.number === "3" && (
          <div className="mt-3 flex h-7 items-end gap-1">
            {[30, 50, 40, 70, 55, 85, 65, 100].map((height, i) => (
              <span
                key={i}
                className={`flex-1 rounded-t-sm ${
                  i > 5 ? "bg-emerald-400/80" : "bg-violet-400/70"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/6 px-2 py-1 text-[9px] text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function AboutUs() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b1020] font-sans text-white selection:bg-violet-500/30">
      {/* HERO */}
      <section className="relative border-b border-white/[0.035]">
        <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-violet-600/[0.07] blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <SectionLabel>About TeamFlow</SectionLabel>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-[#f2f2ff] sm:text-5xl lg:text-[58px]">
              Great work happens when teams work together.
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
              TeamFlow brings projects, tasks, and team collaboration into one
              organized workspace, helping teams stay focused, work smarter,
              and deliver their best work.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/signup"
                className="rounded-full bg-linear-to-r from-[#b69aff] to-[#9b70f5] px-6 py-3 text-xs font-semibold text-[#111025] shadow-lg shadow-violet-500/10 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Get Started →
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/10 px-6 py-3 text-xs font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-white/4"
              >
                Contact Our Team ↗
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-[10px] text-slate-400">
              {[
                "Unified workspace",
                "Zero context switching",
                "Real-time sync",
              ].map((item) => (
                <span key={item}>
                  <span className="mr-1.5 text-emerald-300">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <TaskPreview />
        </div>
      </section>

      {/* MISSION */}
      <section className="border-b border-white/[0.035]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <SectionLabel>Our Purpose</SectionLabel>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Making teamwork feel effortless.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Our mission is to simplify the way teams plan, organize, and
              complete their work. We want people to spend less time managing
              scattered tools and more time creating meaningful results
              together.
            </p>

            <blockquote className="mt-5 border-l-2 border-violet-400 bg-[#171d2e] px-4 py-4 text-sm italic leading-6 text-slate-300">
              "We believe organizational clarity isn't just an operational
              efficiency—it's the foundation of creative momentum and team
              happiness."
            </blockquote>

            <div className="mt-6 space-y-5">
              {[
                [
                  "◎",
                  "Zero Clutter",
                  "Focus directly on what moves momentum without visual overload or unnecessary procedural friction.",
                ],
                [
                  "♧",
                  "Purposeful Productivity",
                  "Centralize project space, timelines, milestones, and real-time commentary in one transparent ecosystem.",
                ],
                [
                  "↗",
                  "Constant Innovation",
                  "Never ask teams to do things twice. Every card is tethered to overarching project objectives.",
                ],
              ].map(([icon, title, description]) => (
                <div key={title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-300/10 bg-violet-400/10 text-violet-200">
                    {icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MissionVisual />
        </div>
      </section>

      {/* PROBLEMS WE SOLVE */}
      <section className="border-b border-white/[0.035] bg-[#0d1323]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel> The Problem We Solve </SectionLabel>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Less chaos. More meaningful progress.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Traditional workflows fragment communication across email, chat,
              and endless sheets. Here is how we bridge the gap.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {problems.map((problem) => (
              <article
                key={problem.title}
                className="group rounded-2xl border border-white/5 bg-[#171d2e] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/10 text-xl text-violet-200 transition group-hover:bg-violet-400/20">
                  {problem.icon}
                </span>

                <h3 className="mt-5 text-base font-semibold">
                  {problem.title}
                </h3>

                <p className="mt-3 min-h-26.25 text-xs leading-6 text-slate-400">
                  {problem.description}
                </p>

                <p className="mt-4 text-[10px] font-medium text-violet-300">
                  {problem.link} →
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="border-b border-white/[0.035]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-9 grid gap-5 sm:grid-cols-2 sm:items-end">
            <div>
              <SectionLabel>Core Culture</SectionLabel>
              <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                The principles behind TeamFlow.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400 sm:justify-self-end">
              How we architect software, make design decisions, and partner
              with teams around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="border border-white/5.5 bg-[#171d2e] p-5 transition hover:border-violet-400/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/10 text-lg text-violet-200">
                  {principle.icon}
                </div>
                <p className="mt-4 text-[9px] font-semibold tracking-widest text-slate-500">
                  {principle.number} / 4 · PILLAR
                </p>
                <h3 className="mt-2 text-sm font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-3 text-xs leading-6 text-slate-400">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="border-b border-white/[0.035] bg-[#0d1323]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Workflow Engine</SectionLabel>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Everything your team needs to move forward.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              From early conceptual ideation to production deployment, we
              bridge every phase.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {workflow.map((item) => (
              <WorkflowCard key={item.number} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[26px] border border-white/6 bg-[#151b2c] px-5 py-14 text-center sm:px-10 sm:py-20">
          <div className="absolute left-1/2 top-0 h-56 w-72 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[90px]" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-violet-200">
              ✧ Get in sync today
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Ready to bring your team's work together?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-400">
              Create a more organized workspace and help your team focus on
              what matters. Start free with zero onboarding overhead.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="/signup"
                className="rounded-full bg-linear-to-r from-[#b69aff] to-[#9b70f5] px-6 py-3 text-xs font-semibold text-[#111025] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Get Started →
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/10 px-6 py-3 text-xs font-medium text-white transition hover:border-violet-400/40 hover:bg-white/4"
              >
                Contact Us ↗
              </a>
            </div>

            <p className="mt-5 text-[10px] text-slate-500">
              No credit card required. Free 14-day trial for product teams of
              all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/6 bg-[#090e1b]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_2fr]">
            <div>
              <a href="/" className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-300 to-violet-600 font-bold text-[#0b1020]">
                  T
                </span>
                <span className="text-sm font-bold">TeamFlow</span>
              </a>

              <p className="mt-4 max-w-xs text-xs leading-6 text-slate-400">
                Bringing projects, tasks, and teams together in one seamless,
                organized workspace.
              </p>

              <div className="mt-5 flex gap-2">
                {["𝕏", "◎", "in", "✉"].map((social) => (
                  <a
                    key={social}
                    href="/contact"
                    aria-label={`TeamFlow ${social}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-xs text-slate-400 transition hover:border-violet-400/40 hover:text-white"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[10px] font-bold tracking-widest text-white">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href={
                            link === "About Us"
                              ? "/about"
                              : link === "Contact"
                              ? "/contact"
                              : "#"
                          }
                          className="text-[10px] text-slate-400 transition hover:text-violet-200"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 border-t border-white/6 pt-5 text-[9px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 TeamFlow Technologies Inc. All rights reserved.</p>
            <p>Designed for modern engineering and product teams.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
