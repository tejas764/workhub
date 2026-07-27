"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";

export default function AnalyticsPage() {
  const { activeRole, faculty = [], tasks = [] } = useAuth();

  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Department Insights
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time metric breakdown for <span className="font-bold text-slate-800 dark:text-slate-200">{activeRole}</span>.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Task Efficiency
            </p>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {completionRate}%
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Completion rate across active tasks
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Active Faculty
            </p>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {faculty.length}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Department members logged
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Tasks
            </p>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {completedTasks.length}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Successfully closed items
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pending Items
            </p>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {pendingTasks.length}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Tasks currently in progress
          </p>
        </div>
      </div>

      {/* Analytics Visual Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Tracker */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" /> Goal Completion Progress
            </h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {completionRate}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Overall workload resolution is running smoothly. Keep managing tasks effectively to maintain department performance targets.
          </p>
        </div>

        {/* Resource Allocation / Academic Activity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" /> Academic Activity Summary
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Curriculum Alignment
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                On Track
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Research Proposals
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                In Review
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mid-Sem Submissions
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}