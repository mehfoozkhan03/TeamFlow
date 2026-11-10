
import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Three animated dots inside the floating message box
const AnimatedDots = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-3 w-3 animate-bounce rounded-full bg-[#A5B4FC] [animation-duration:1.5s]" />

      <span className="h-3 w-3 animate-bounce rounded-full bg-[#818CF8] [animation-delay:200ms] [animation-duration:1.5s]" />

      <span className="h-3 w-3 animate-bounce rounded-full bg-[#6D5BD0] [animation-delay:400ms] [animation-duration:1.5s]" />
    </div>
  );
};

// Reusable small task card
const TaskCard = ({ color, lightColor }) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-4 ${lightColor}`}
    >
      <div
        className={`h-9 w-9 shrink-0 rounded-full ${color}`}
      />

      <div className="flex flex-1 flex-col gap-2">
        <div className={`h-2.5 w-20 rounded-full ${color} opacity-60`} />

        <div className={`h-2 w-14 rounded-full ${color} opacity-25`} />
      </div>
    </div>
  );
};

// Right-side dashboard illustration
const ErrorIllustration = () => {
  return (
    <div className="relative mx-auto flex h-[400px] w-full max-w-[560px] items-center justify-center sm:h-[480px] lg:h-[560px]">

      {/* Large dashed orbit */}
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-dashed border-[#C7D2FE] sm:h-[430px] sm:w-[430px]" />

      {/* Decorative floating dots */}
      <div className="absolute left-[7%] top-[20%] h-3 w-3 animate-bounce rounded-full bg-amber-400 [animation-duration:2.8s]" />

      <div className="absolute right-[4%] top-[35%] h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms] [animation-duration:2.4s]" />

      <div className="absolute bottom-[18%] right-[12%] h-8 w-8 animate-bounce rounded-full bg-amber-400 [animation-delay:500ms] [animation-duration:3s]" />

      <div className="absolute bottom-[14%] left-[8%] h-14 w-14 rounded-full border border-indigo-100" />

      {/* Dashboard shadow */}
      <div className="absolute bottom-[10%] left-1/2 h-10 w-[75%] -translate-x-1/2 rounded-[100%] bg-[#25204A]/10 blur-md" />

      {/* Main dashboard card */}
      <div className="relative z-10 w-[77%] overflow-hidden rounded-[28px] border-2 border-[#E5E4F5] bg-white shadow-[0_25px_70px_rgba(77,65,133,0.13)]">

        {/* Browser top bar */}
        <div className="flex h-[58px] items-center justify-between border-b-2 border-[#E9E7F6] px-5">
          <div className="flex gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-300" />
            <span className="h-3.5 w-3.5 rounded-full bg-amber-300" />
            <span className="h-3.5 w-3.5 rounded-full bg-green-300" />
          </div>

          <div className="h-5 w-20 rounded-full bg-indigo-50" />
        </div>

        {/* Dashboard inner content */}
        <div className="grid grid-cols-[0.85fr_1.15fr] gap-3 p-5 sm:gap-5 sm:p-7">

          {/* Profile card */}
          <div className="relative flex min-h-[145px] flex-col items-center justify-center gap-4 rounded-[22px] bg-[#F4F1FF]">

            {/* Animated avatar */}
            <div className="relative flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-[#C4B5FD] [animation-duration:3s]">

              <div className="absolute top-2 h-9 w-9 rounded-full border-[6px] border-[#715BD1]" />

              <div className="absolute bottom-0 h-7 w-12 rounded-t-full bg-white" />
            </div>

            <div className="h-3 w-[65%] rounded-full bg-[#DCD4FF]" />
            <div className="h-2.5 w-[45%] rounded-full bg-[#E8E2FF]" />
          </div>

          {/* Task cards */}
          <div className="flex flex-col justify-center gap-4">
            <TaskCard
              color="bg-[#818CF8]"
              lightColor="bg-[#EEF2FF]"
            />

            <TaskCard
              color="bg-[#FDBA74]"
              lightColor="bg-[#FFF7ED]"
            />
          </div>
        </div>
      </div>

      {/* Floating purple profile box */}
      <div className="absolute left-[1%] top-[48%] z-20 flex h-24 w-28 animate-bounce flex-col items-center justify-center gap-3 rounded-[22px] bg-[#6D59D2] shadow-[0_20px_40px_rgba(109,89,210,0.22)] sm:h-28 sm:w-32 [animation-duration:3.2s]">

        <div className="relative h-7 w-7 rounded-full bg-[#B6A7FF]">
          <div className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white" />
        </div>

        <div className="h-2.5 w-16 rounded-full bg-[#B6A7FF]" />
      </div>

      {/* Floating message box */}
      <div className="absolute right-[0%] top-[15%] z-20 flex h-20 w-28 animate-bounce items-center justify-center rounded-[24px] border-2 border-[#E9E7F6] bg-white shadow-xl sm:h-24 sm:w-32 [animation-delay:300ms] [animation-duration:3.5s]">

        <AnimatedDots />

        {/* Message bubble tail */}
        <div className="absolute -bottom-3 left-10 h-5 w-5 rotate-45 border-b-2 border-r-2 border-[#E9E7F6] bg-white" />
      </div>

      {/* Bottom purple ring */}
      <div className="absolute bottom-[9%] right-[11%] h-20 w-20 rotate-[-35deg] rounded-full border-[9px] border-l-transparent border-t-[#6D59D2] border-r-[#6D59D2] border-b-[#6D59D2]" />

      <div className="absolute bottom-[14%] right-[3%] h-3.5 w-3.5 rounded-full bg-rose-300" />
    </div>
  );
};

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9FF] font-sans text-[#25213D]">

      {/* Background gradient */}
      <div className="pointer-events-none absolute right-[-150px] top-[-200px] h-[650px] w-[650px] rounded-full bg-indigo-100/50 blur-[110px]" />

      <div className="pointer-events-none absolute bottom-[-200px] left-[-100px] h-[450px] w-[450px] rounded-full bg-purple-100/40 blur-[100px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 sm:px-10 lg:px-16">

        {/* Header */}
        <header className="flex items-center justify-between py-7">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D59D2] text-2xl font-bold text-white shadow-lg shadow-indigo-200">
              ₮
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              teamflow
            </span>
          </Link>

          <Link
            to="/contact"
            className="text-sm font-semibold text-[#77718F] transition-colors hover:text-[#6D59D2]"
          >
            Need help?
          </Link>
        </header>

        {/* Main content */}
        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-2 lg:gap-8 lg:py-0">

          {/* Left content */}
          <div className="mx-auto w-full max-w-[610px] text-center lg:mx-0 lg:text-left">

            {/* Error badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#6652CC] sm:text-sm">

              <span className="h-2 w-2 rounded-full bg-[#705ADB] shadow-[0_0_0_4px_#E9E3FF]" />

              404 — PAGE NOT FOUND
            </div>

            {/* Main heading */}
            <h1 className="text-[clamp(3rem,6vw,5.7rem)] font-extrabold leading-[1.08] tracking-[-0.055em]">
              Looks like this
              <br className="hidden sm:block" />
              {" "}room is
              <br />
              <span className="relative inline-block text-[#705AD5]">
                empty.
                <span className="absolute -bottom-2 left-0 h-[6px] w-full rounded-full bg-[#DDD6FE]" />
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-9 max-w-[520px] text-base leading-8 text-[#77718F] sm:text-lg lg:mx-0">
              The page you're looking for may have moved,
              or the link might be out of date.
              Let's get you back to your team.
            </p>

            {/* Navigation buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">

              <Link
                to="/overview"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#6D59D2] px-6 font-semibold text-white shadow-[0_14px_28px_rgba(109,89,210,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B46C4]"
              >
                <span className="text-xl">⌂</span>
                Back to workspace
              </Link>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-[#E3E1EF] bg-white px-7 font-semibold text-[#25213D] transition-all duration-300 hover:-translate-y-1 hover:border-[#C4B5FD] hover:shadow-md"
              >
                <span className="text-xl">‹</span>
                Go back
              </button>
            </div>
          </div>

          {/* Right illustration */}
          <ErrorIllustration />
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#EAE7F5] py-6 text-xs text-[#938DA5] sm:flex-row sm:text-sm">

          <span>
            © {new Date().getFullYear()} TeamFlow.
            All rights reserved.
          </span>

          <span>
            Built for teams that move forward together.
          </span>
        </footer>
      </div>
    </main>
  );
};
