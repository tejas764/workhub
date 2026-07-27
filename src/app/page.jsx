"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Megaphone,
  Plus,
  Video,
  Pin,
} from "lucide-react";

export default function DashboardPage() {
  const { user, activeRole, tasks, faculty } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // Simulated fetch (ready for Supabase integration)
    const mockAnnouncements = [
      {
        id: 1,
        title: "Mid-Semester Assessment Guidelines 2026",
        author: "Dr. Sarah Jenkins (HOD)",
        date: "Jul 22, 2026",
        tag: "Academic",
        pinned: true,
        content: "All faculty members are requested to upload draft question papers by next Friday.",
        roles: ["Head of Department", "Dept. Coordinator", "Faculty Member"],
      },
      {
        id: 2,
        title: "HOD Executive Budget Strategy",
        author: "Finance Committee",
        date: "Jul 21, 2026",
        tag: "Admin",
        pinned: false,
        content: "Confidential review of Q3 equipment allocations.",
        roles: ["Head of Department"],
      },
      {
        id: 3,
        title: "Departmental Research Grant Applications Open",
        author: "Research Committee",
        date: "Jul 20, 2026",
        tag: "Funding",
        pinned: false,
        content: "Submit proposals for Q3 internal funding grants via the document portal.",
        roles: ["Head of Department", "Faculty Member"],
      },
    ];

    const mockMeetings = [
      {
        id: 1,
        title: "Curriculum Alignment Review",
        time: "10:00 AM - 11:30 AM",
        date: "Today",
        location: "Conference Room B / Zoom",
        isOnline: true,
        roles: ["Head of Department", "Dept. Coordinator", "Faculty Member"],
      },
      {
        id: 2,
        title: "HOD & Coordinators Sync",
        time: "02:00 PM - 03:00 PM",
        date: "Tomorrow",
        location: "HOD Office",
        isOnline: false,
        roles: ["Head of Department", "Dept. Coordinator"],
      },
    ];

    setAnnouncements(mockAnnouncements);
    setMeetings(mockMeetings);
  }, []);

  const filteredAnnouncements = announcements.filter(
    (item) => !item.roles || item.roles.includes(activeRole)
  );

  const filteredMeetings = meetings.filter(
    (item) => !item.roles || item.roles.includes(activeRole)
  );

  const pendingTasks = tasks.filter((t) => t.status !== "Completed");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "User"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80">
              Logged in as <span className="font-bold text-white">{activeRole}</span>. Showing updates relevant to your role.
            </p>
          </div>
          <button className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30">
            <Plus className="w-4 h-4" /> Quick Action
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Faculty</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{faculty.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Tasks</p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingTasks.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Tasks</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming Meetings</p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{filteredMeetings.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Bulletin */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Department Bulletin</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">{filteredAnnouncements.length} updates</span>
          </div>

          <div className="space-y-3">
            {filteredAnnouncements.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
                No announcements for this role.
              </div>
            ) : (
              filteredAnnouncements.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 relative">
                  {item.pinned && <Pin className="w-3.5 h-3.5 absolute top-5 right-5 text-indigo-500 fill-indigo-500/20" />}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-slate-400">• {item.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.content}</p>
                  <div className="pt-2 text-[11px] font-semibold text-slate-400">
                    Posted by: <span className="text-slate-700 dark:text-slate-300">{item.author}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Meetings Schedule */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Meetings</h2>
          </div>

          <div className="space-y-3">
            {filteredMeetings.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
                No meetings scheduled for this role.
              </div>
            ) : (
              filteredMeetings.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">{m.date}</span>
                    {m.isOnline && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-500">
                        <Video className="w-3 h-3" /> Online
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{m.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {m.time}
                  </p>
                  <p className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                    📍 {m.location}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}