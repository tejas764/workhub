"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function TasksPage() {
  const { tasks, addTask, toggleTaskStatus } = useAuth();
  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Academic",
    priority: "Medium",
    dueDate: "2026-08-01",
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    addTask({
      id: Date.now(),
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      status: "Pending",
    });

    setNewTask({
      title: "",
      category: "Academic",
      priority: "Medium",
      dueDate: "2026-08-01",
    });
    setShowModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Pending") return t.status !== "Completed";
    if (filter === "Completed") return t.status === "Completed";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <CheckSquare className="w-6 h-6 text-indigo-500" /> Department Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track, assign, and manage departmental action items.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {["All", "Pending", "Completed"].map((statusOption) => (
          <button
            key={statusOption}
            onClick={() => setFilter(statusOption)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === statusOption
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {statusOption}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
            No tasks found under this filter.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-center justify-between gap-4 ${
                task.status === "Completed"
                  ? "border-slate-200 dark:border-slate-800/60 opacity-60"
                  : "border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    task.status === "Completed"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                  }`}
                >
                  {task.status === "Completed" && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>

                <div className="space-y-1">
                  <h4
                    className={`font-bold text-xs ${
                      task.status === "Completed"
                        ? "line-through text-slate-400 dark:text-slate-500"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Priority Tag */}
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  task.priority === "High"
                    ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50"
                    : task.priority === "Medium"
                    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {task.priority} Priority
              </span>
            </div>
          ))
        )}
      </div>

      {/* Modal for Creating Task */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Action Task
            </h2>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare Q3 Exam Sheets"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}