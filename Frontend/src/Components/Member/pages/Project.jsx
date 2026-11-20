
import React from "react";
import { useSelector } from "react-redux";
import {
  Folder,
  Check,
  Activity,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

import { MemberSidebar } from "../components/Sidebar";
import { MemberHeader } from "../components/MemberHeader";
import { StatisticCard } from "../components/StatisticCard";

const Project = () => {
  const projects = useSelector((state) => state.member?.projects ?? []);
  const tasks = useSelector((state) => state.member?.tasks ?? []);

  // Calculate task progress and project details from Redux data.
  const projectData = projects.map((project) => {
    const projectTasks = tasks.filter(
      (task) => task.project === project.name
    );

    const completedTasks = projectTasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const progress =
      projectTasks.length > 0
        ? Math.round((completedTasks / projectTasks.length) * 100)
        : 0;

    const members = [
      ...new Set(
        projectTasks.map((task) => task.initials).filter(Boolean)
      ),
    ];

    let status = "Planning";

    if (projectTasks.length > 0) {
      if (completedTasks === projectTasks.length) {
        status = "Completed";
      } else if (
        projectTasks.some((task) => task.status === "In Progress")
      ) {
        status = "In Progress";
      } else {
        status = "To Do";
      }
    }

    return {
      ...project,
      totalTasks: projectTasks.length,
      completedTasks,
      progress,
      members,
      status,
    };
  });

  const activeProjects = projectData.filter(
    (project) => project.status !== "Completed"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  // Format project deadlines for display.
  const formatDate = (date) => {
    if (!date) return "No deadline";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MemberSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <MemberHeader pageTitle="Projects" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Projects
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your projects in one place.
            </p>
          </div>

          {/* Project Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatisticCard
              title="Active Projects"
              value={activeProjects}
              icon={Folder}
            />

            <StatisticCard
              title="Tasks Across Projects"
              value={tasks.length}
              icon={Activity}
            />

            <StatisticCard
              title="Completed Tasks"
              value={completedTasks}
              icon={Check}
            />
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projectData.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.03)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md"
              >
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <Folder size={21} />
                    </div>

                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                      {project.status}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-800">
                    {project.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {project.description || "Project details"}
                  </p>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Progress
                      </span>

                      <span className="text-sm font-semibold text-violet-600">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Total Tasks
                      </p>

                      <p className="mt-1 text-lg font-semibold text-slate-800">
                        {project.totalTasks}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Completed
                      </p>

                      <p className="mt-1 text-lg font-semibold text-slate-800">
                        {project.completedTasks}
                      </p>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.members.map((member, index) => (
                        <div
                          key={`${member}-${index}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-xs font-semibold text-violet-700"
                        >
                          {member}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(project.deadline)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-5 py-3">
                  <button className="flex w-full items-center justify-between text-sm font-medium text-violet-600">
                    View project
                    <ChevronRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Project;
