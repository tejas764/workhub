"use client";
import React, { useState } from "react";
import {
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const { user, activeRole, theme, toggleTheme } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications sample data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Task Assigned",
      desc: "Mid-Semester grades review needs approval.",
      time: "10m ago",
      type: "info",
      unread: true,
    },
    {
      id: 2,
      title: "Faculty Leave Request",
      desc: "Dr. Marcus Vance requested 2 days leave.",
      time: "1h ago",
      type: "alert",
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
      
      {/* Left Section: Sidebar Toggle Button + Search Bar */}
      <div className="flex items-center gap-3 w-1/2 sm:w-1/3">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/50 transition-all"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, faculty, docs..."
            className="w-full pl-10 pr-4 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Section: Theme Toggle + Notifications + Profile Header */}
      <div className="flex items-center gap-3">
        
        {/* 1. Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/50 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* 2. Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700/50 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 flex gap-3 transition-colors ${
                      n.unread ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                    }`}
                  >
                    {n.type === "alert" ? (
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    )}
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* 3. User Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md shadow-indigo-600/20">
            {user?.avatar || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{activeRole}</p>
          </div>
        </div>

      </div>
    </header>
  );
}