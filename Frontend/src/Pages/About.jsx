
import { Link } from "react-router-dom";
import {features,values} from "../Data/Features";

import { FaUsers, FaBullseye, FaChartLine, FaEye, FaArrowRight, FaCheckCircle } from "react-icons/fa";

// About page
export const About = () => {
  // Features displayed on the page
  // const features = [
  //   {
  //     icon: <FaUsers />,
  //     title: "Team Collaboration",
  //     description:
  //       "Bring your team together and help everyone stay aligned with shared goals and responsibilities.",
  //     color: "bg-purple-100 text-purple-600",
  //   },
  //   {
  //     icon: <FaBullseye />,
  //     title: "Clear Goals",
  //     description:
  //       "Keep priorities clear and make it easier for your team to focus on what matters most.",
  //     color: "bg-blue-100 text-blue-600",
  //   },
  //   {
  //     icon: <FaChartLine />,
  //     title: "Track Progress",
  //     description:
  //       "Get a clearer picture of your team's progress and identify tasks that need attention.",
  //     color: "bg-green-100 text-green-600",
  //   },
  // ];



  

  return (
    <main className="min-h-screen overflow-hidden bg-white text-gray-800">

      {/* HERO SECTION */}
      <section className="relative bg-linear-to-br from-violet-50 via-white to-indigo-50 px-4 py-20 sm:px-6 lg:py-28">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Hero text */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
              <FaUsers />
              ABOUT TEAMFLOW
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Great teams do
              <span className="block bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                great things together.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg lg:mx-0">
              TeamFlow is designed to help teams organize their work,
              collaborate more effectively, and turn great ideas into
              meaningful results.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-4 font-semibold text-white shadow-lg shadow-purple-200 transition duration-300 hover:-translate-y-1 hover:bg-purple-700 hover:shadow-xl"
              >
                Get Started
                <FaArrowRight />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold text-gray-700 transition duration-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-4xl bg-linear-to-r from-purple-200 to-indigo-200 opacity-50 blur-2xl" />

            <div className="relative rounded-3xl border border-purple-100 bg-white p-5 shadow-2xl shadow-purple-100 sm:p-8">
              {/* Dashboard header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    TEAM WORKSPACE
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Working together
                  </h2>
                </div>

                <div className="flex -space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-purple-500 font-bold text-white">
                    A
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 font-bold text-white">
                    S
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-pink-500 font-bold text-white">
                    R
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-bold text-gray-600">
                    +2
                  </div>
                </div>
              </div>

              {/* Progress card */}
              <div className="mt-6 rounded-2xl bg-purple-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Team progress</p>
                    <p className="mt-1 text-3xl font-extrabold text-purple-700">
                      75%
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-purple-600 shadow-sm">
                    <FaChartLine />
                  </div>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-purple-200">
                  <div className="h-full w-3/4 rounded-full bg-linear-to-r from-purple-600 to-indigo-600" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Illustrative progress indicator
                </p>
              </div>

              {/* Task cards */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                  <FaCheckCircle className="shrink-0 text-green-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-800">
                      Plan the next project
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Team planning
                    </p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Done
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                  <div className="h-5 w-5 shrink-0 rounded-full border-2 border-purple-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-800">
                      Organize team tasks
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Project management
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    In progress
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                  <div className="h-5 w-5 shrink-0 rounded-full border-2 border-blue-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-800">
                      Review team goals
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Weekly review
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
            Our Story
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Making teamwork feel effortless
          </h2>

          <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
            Managing a team can become complicated when tasks, priorities,
            and communication are scattered across different places. TeamFlow
            aims to bring a clearer, more organized approach to working
            together, helping teams spend less time dealing with confusion
            and more time making progress.
          </p>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">

          {/* Mission */}
          <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-600">
              <FaBullseye />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              To make teamwork simpler by helping people organize
              responsibilities, understand priorities, and work toward
              shared goals.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl text-indigo-600">
              <FaEye />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Our Vision
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              To create a workspace where teams can stay connected,
              collaborate confidently, and turn their ideas into results.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
              Why TeamFlow
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything starts with better teamwork
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              A thoughtful approach to organizing work and helping teams
              move forward together.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              
              <div
                key={index}
                className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.color}`}
                >
                  <feature.Icon />20
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
              What We Believe
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our core values
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-purple-600 shadow-md">
                  {value.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {value.title}
                </h3>

                <p className="mx-auto mt-3 max-w-sm leading-7 text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-14 text-center shadow-xl shadow-purple-200 sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to bring your team together?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-purple-100">
            Take the next step toward a more organized and collaborative
            way of working.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-purple-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-purple-50"
          >
            Get Started Today
            <FaArrowRight />
          </Link>
        </div>
      </section>

    </main>
  );
};
