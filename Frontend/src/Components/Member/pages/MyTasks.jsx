
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";


import {
  CalendarDays,
  ClipboardList,
  Columns2,
  Folder,
  List,
  MoreHorizontal,
  Search,
  GripVertical,
} from "lucide-react";

import { updateTaskStatus } from "../../../Store/Member/Member";

// ======================================
// HELPERS
// ======================================

const getTaskId = (task) => task.id ?? task._id;

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isOverdue = (task) => {
  return (
    Boolean(task.dueDate) &&
    task.dueDate < getTodayDate() &&
    task.status !== "Completed"
  );
};

const formatDueDate = (date) => {
  if (!date) return "No deadline";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// ======================================
// KANBAN COLUMNS
// ======================================

const columns = [
  { title: "To Do", color: "bg-slate-400" },
  { title: "In Progress", color: "bg-violet-600" },
  { title: "In Review", color: "bg-sky-500" },
  { title: "Completed", color: "bg-emerald-500" },
];

const priorityColors = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-orange-50 text-orange-600",
  Low: "bg-emerald-50 text-emerald-600",
};

// ======================================
// COLLISION DETECTION
// ======================================

const collisionDetectionStrategy = (args) => {
  // Only columns are valid drop targets. This prevents a task card
  // underneath the pointer from being mistaken for the destination.
  const columnContainers = args.droppableContainers.filter((container) =>
    columns.some((column) => column.title === String(container.id))
  );

  const columnArgs = {
    ...args,
    droppableContainers: columnContainers,
  };

  const pointerCollisions = pointerWithin(columnArgs);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return rectIntersection(columnArgs);
};

// ======================================
// TASK CARD
// ======================================

const TaskCard = ({
  task,
  openTask,
  setOpenTask,
  updateStatus,
}) => {
  const taskId = getTaskId(task);

  const priorityColor =
    priorityColors[task.priority] ||
    "bg-slate-50 text-slate-600";

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({
    id: String(taskId),
    data: {
      taskId,
      task,
    },
  });

  return (
    <article
      ref={setNodeRef}
      className={`relative rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-md ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      {/* CARD HEADER */}
      <div className="flex items-center justify-between">

        <span
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${priorityColor}`}
        >
          <span className="mr-1">●</span>
          {task.priority}
        </span>

        <div className="flex items-center gap-2">

          {/* DRAG HANDLE */}
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            aria-label="Drag task"
            className="cursor-grab touch-none text-slate-400 hover:text-violet-600 active:cursor-grabbing"
          >
            <GripVertical size={18} />
          </button>

          {/* OPTIONS */}
          <button
            type="button"
            onClick={() =>
              setOpenTask(
                openTask === taskId ? null : taskId
              )
            }
            aria-label="Task options"
            className="text-slate-400 hover:text-slate-700"
          >
            <MoreHorizontal size={19} />
          </button>

        </div>
      </div>

      {/* TITLE */}
      <h3 className="mt-3 text-sm font-medium text-slate-900">
        {task.title}
      </h3>

      {/* PROJECT */}
      <p className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
        <Folder size={14} />
        {task.project}
      </p>

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

        <div>
          <span
            className={`flex items-center gap-2 text-[10px] ${
              task.priority === "High"
                ? "text-rose-500"
                : "text-slate-400"
            }`}
          >
            <CalendarDays size={15} />
            {formatDueDate(task.dueDate)}
          </span>

          {isOverdue(task) && (
            <span className="mt-1 block text-[10px] font-semibold text-rose-500">
              Overdue
            </span>
          )}
        </div>

        {/* ASSIGNEE */}
        <span className="flex items-center gap-2">

          <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
            {task.initials}
          </span>

          <span className="text-[9px] text-slate-400">
            By {task.assignee}
          </span>

        </span>

      </div>

      {/* STATUS MENU */}
      {openTask === taskId && (
        <div className="absolute right-3 top-11 z-30 w-36 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">

          <p className="px-2 py-1 text-[10px] font-semibold text-slate-400">
            Move to
          </p>

          {columns.map((column) => (
            <button
              key={column.title}
              type="button"
              onClick={() =>
                updateStatus(taskId, column.title)
              }
              className="block w-full rounded-md px-2 py-2 text-left text-[11px] text-slate-600 hover:bg-violet-50 hover:text-violet-700"
            >
              {column.title}
            </button>
          ))}

        </div>
      )}

    </article>
  );
};

// ======================================
// DRAG OVERLAY PREVIEW
// ======================================

const TaskDragPreview = ({ task }) => {
  if (!task) return null;

  const priorityColor =
    priorityColors[task.priority] ||
    "bg-slate-50 text-slate-600";

  return (
    <article className="w-[260px] rotate-1 cursor-grabbing rounded-xl border border-violet-300 bg-white p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${priorityColor}`}
        >
          <span className="mr-1">●</span>
          {task.priority}
        </span>
        <GripVertical size={18} className="text-violet-500" />
      </div>

      <h3 className="mt-3 break-words text-sm font-semibold text-slate-900">
        {task.title}
      </h3>

      <p className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
        <Folder size={14} />
        {task.project}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-2 text-[10px] text-slate-400">
          <CalendarDays size={14} />
          {formatDueDate(task.dueDate)}
        </span>

        <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
          {task.initials}
        </span>
      </div>
    </article>
  );
};

// ======================================
// KANBAN COLUMN
// ======================================

const TaskColumn = ({
  column,
  columnTasks,
  openTask,
  setOpenTask,
  updateStatus,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.title,
    data: {
      status: column.title,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[440px] rounded-xl border p-3 transition-all duration-200 ${
        isOver
          ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
          : "border-slate-100 bg-[#f8f9fb]"
      }`}
    >
      {/* COLUMN HEADER */}
      <div className="mb-3 flex items-center justify-between px-1">

        <div className="flex items-center gap-2">

          <span
            className={`h-2 w-2 rounded-full ${column.color}`}
          />

          <h2 className="text-xs font-semibold text-slate-800">
            {column.title}
          </h2>

          <span className="rounded-full bg-slate-200/70 px-2 py-1 text-[10px] text-slate-600">
            {columnTasks.length}
          </span>

        </div>

        <button
          type="button"
          aria-label={`${column.title} options`}
          className="text-slate-400"
        >
          <MoreHorizontal size={18} />
        </button>

      </div>

      {/* DROP AREA */}
      <div className="min-h-[350px] space-y-2.5">

        {columnTasks.map((task) => (
          <TaskCard
            key={String(getTaskId(task))}
            task={task}
            openTask={openTask}
            setOpenTask={setOpenTask}
            updateStatus={updateStatus}
          />
        ))}

        {/* EMPTY COLUMN */}
        {columnTasks.length === 0 && (
          <div
            className={`flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed text-center ${
              isOver
                ? "border-violet-400 bg-violet-100"
                : "border-slate-300"
            }`}
          >
            <ClipboardList
              size={19}
              className="text-slate-400"
            />

            <p className="mt-2 text-[10px] text-slate-400">
              Drop tasks here
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

// ======================================
// MAIN COMPONENT
// ======================================

export const MyTasks = () => {
  const dispatch = useDispatch();

  // REDUX TASKS
  const tasks = useSelector(
    (state) => state.member?.tasks ?? []
  );

  // LOCAL STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [projectFilter, setProjectFilter] = useState("All projects");
  const [view, setView] = useState("Board");
  const [deadlineOrder, setDeadlineOrder] = useState("default");
  const [openTask, setOpenTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // ======================================
  // DND SENSORS
  // ======================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // ======================================
  // FILTER TASKS
  // ======================================

  const filteredTasks = tasks
    .filter((task) =>
      (task.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter(
      (task) =>
        statusFilter === "All statuses" ||
        task.status === statusFilter
    )
    .filter(
      (task) =>
        priorityFilter === "All priorities" ||
        task.priority === priorityFilter
    )
    .filter(
      (task) =>
        projectFilter === "All projects" ||
        task.project === projectFilter
    )
    .sort((a, b) => {
      if (deadlineOrder === "early") {
        return (a.dueDate || "").localeCompare(
          b.dueDate || ""
        );
      }

      if (deadlineOrder === "late") {
        return (b.dueDate || "").localeCompare(
          a.dueDate || ""
        );
      }

      return String(getTaskId(a)).localeCompare(
        String(getTaskId(b)),
        undefined,
        { numeric: true }
      );
    });

  // ======================================
  // UPDATE STATUS
  // ======================================

  const updateStatus = (taskId, newStatus) => {
    if (!taskId || !newStatus) return;

    dispatch(
      updateTaskStatus({
        taskId,
        newStatus,
      })
    );

    setOpenTask(null);
  };

  // ======================================
  // DRAG START
  // ======================================

  const handleDragStart = ({ active }) => {
    const selectedTask = tasks.find(
      (task) => String(getTaskId(task)) === String(active.id)
    );

    setActiveTask(selectedTask || null);
    setOpenTask(null);
  };

  // ======================================
  // DRAG END
  // ======================================

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);

    if (!over) return;

    const task = tasks.find(
      (item) =>
        String(getTaskId(item)) === String(active.id)
    );

    if (!task) return;

    const newStatus = String(over.id);

    const validColumn = columns.some(
      (column) => column.title === newStatus
    );

    if (!validColumn) return;

    if (task.status === newStatus) return;

    updateStatus(getTaskId(task), newStatus);
  };

  // ======================================
  // DRAG CANCEL
  // ======================================

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  // ======================================
  // DEADLINE SORT
  // ======================================

  const changeDeadlineOrder = () => {
    setDeadlineOrder((current) =>
      current === "default" || current === "late"
        ? "early"
        : "late"
    );
  };

  // ======================================
  // UI
  // ======================================

  return (
    <main className="min-h-full w-full min-w-0 bg-[#f7f8fc] p-4 sm:p-6 lg:p-8">

      {/* PAGE HEADER */}
      <div className="mb-7 flex items-center justify-between gap-5 max-md:flex-col max-md:items-start">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            My Tasks
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage the work assigned to you.
          </p>
        </div>

        {/* BOARD / LIST SWITCH */}
        <div className="flex shrink-0 rounded-xl border border-slate-200 bg-white p-1">

          <button
            type="button"
            onClick={() => setView("Board")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
              view === "Board"
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Columns2 size={17} />
            Board
          </button>

          <button
            type="button"
            onClick={() => setView("List")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
              view === "List"
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <List size={17} />
            List
          </button>

        </div>
      </div>

      {/* TASK CONTAINER */}
      <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4 lg:p-5">

          {/* SEARCH */}
          <div className="flex h-10 min-w-[220px] flex-1 items-center gap-3 rounded-lg border border-slate-200 px-3 text-slate-400">

            <Search size={18} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your tasks..."
              className="w-full min-w-0 bg-transparent text-xs outline-none"
            />

          </div>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
          >
            <option>All statuses</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>In Review</option>
            <option>Completed</option>
          </select>

          {/* PRIORITY */}
          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
          >
            <option>All priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* PROJECT */}
          <select
            value={projectFilter}
            onChange={(event) =>
              setProjectFilter(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
          >
            <option>All projects</option>
            <option>TeamFlow Website</option>
            <option>Mobile Application</option>
          </select>

          {/* DEADLINE */}
          <button
            type="button"
            onClick={changeDeadlineOrder}
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50"
          >
            <CalendarDays size={17} />
            Deadline

            {deadlineOrder === "early"
              ? " ↑"
              : deadlineOrder === "late"
                ? " ↓"
                : ""}
          </button>

        </div>

        {/* TASK COUNT */}
        <div className="flex items-center justify-between px-5 py-4 text-[11px]">

          <p className="text-slate-400">
            <span className="font-bold text-slate-900">
              {filteredTasks.length}
            </span>{" "}
            tasks assigned to you
          </p>

          <p className="text-slate-400">
            Last updated just now
          </p>

        </div>

        {/* ==================================
            BOARD VIEW
        ================================== */}

        {view === "Board" ? (

          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >

            <div className="w-full min-w-0 overflow-x-auto px-4 pb-5 lg:px-5">

              <div className="grid min-w-[1050px] grid-cols-4 items-start gap-4">

                {columns.map((column) => {

                  const columnTasks = filteredTasks.filter(
                    (task) => task.status === column.title
                  );

                  return (
                    <TaskColumn
                      key={column.title}
                      column={column}
                      columnTasks={columnTasks}
                      openTask={openTask}
                      setOpenTask={setOpenTask}
                      updateStatus={updateStatus}
                    />
                  );
                })}

              </div>
            </div>

            <DragOverlay dropAnimation={null}>
              {activeTask ? (
                <TaskDragPreview task={activeTask} />
              ) : null}
            </DragOverlay>

          </DndContext>

        ) : (

          /* ==================================
             LIST VIEW
          ================================== */

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[760px] text-left">

              <thead className="border-y border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase text-slate-400">

                <tr>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredTasks.map((task) => (

                  <tr key={String(getTaskId(task))}>

                    <td className="px-6 py-4 text-xs font-medium text-slate-800">
                      {task.title}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      {task.project}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      {task.priority}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDueDate(task.dueDate)}

                      {isOverdue(task) && (
                        <span className="ml-2 font-semibold text-rose-500">
                          Overdue
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      {task.status}
                    </td>

                  </tr>

                ))}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-xs text-slate-400"
                    >
                      No tasks found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>
    </main>
  );
};
