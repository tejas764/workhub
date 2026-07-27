"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Download,
  Calendar,
} from "lucide-react";

export default function AnalyticsPage() {
  const departmentStats = [
    { label: "Syllabus Completion Rate", value: "94%", trend: "+6% vs last term", color: "emerald" },
    { label: "Task Resolution Velocity", value: "1.8 Days", trend: "-0.4 days avg.", color: "indigo" },
    { label: "Research Submissions", value: "28", trend: "12 pending review", color: "purple" },
    { label: "Faculty Satisfaction", value: "4.8/5.0", trend: "Based on 42 responses", color: "amber" },
  ];

  const recentReports = [
    { id: 1, title: "Q2 Departmental Performance Review", date: "Jul 15, 2026", size: "1.8 MB", format: "PDF" },
    { id: 2, title: "Faculty Workload & Task Distribution", date: "Jul 01, 2026", size: "940 KB", format: "XLSX" },
    { id: 3, title: "Mid-Semester Curriculum Assessment", date: "Jun 20, 2026", size: "3.1 MB", format: "PDF" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <BarChart3 className="w-6 h-6 text-indigo-500" /> Department Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time insights into departmental productivity, task metrics, and compliance reports.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-auto">
          <Download className="w-4 h-4 text-indigo-400" /> Export Full Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {departmentStats.map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            <p className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Key Productivity Indicators
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Exam Paper Submissions</span>
                <span className="text-indigo-400">88%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[88%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Grant Proposal Reviews</span>
                <span className="text-emerald-400">72%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[72%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Faculty Task Completion</span>
                <span className="text-purple-400">95%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[95%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Downloadable Reports list */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Recent Reports
          </h2>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{report.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {report.date} • {report.size}
                  </p>
                </div>
                <button className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}