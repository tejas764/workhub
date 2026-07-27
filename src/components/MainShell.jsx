"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Sparkles,
  BarChart3,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function MainShell({ children }) {
  const pathname = usePathname();
  const {
    user,
    activeRole,
    setActiveRole,
    logout,
    isAuthenticated,
    isLoading,
    theme,
    toggleTheme,
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Show a loading screen while checking session / local storage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-sm font-semibold">
        Loading WorkHub AI...
      </div>
    );
  }

  // 2. If on /login OR not logged in, render the page cleanly without sidebar/navbar
  if (pathname === "/login" || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </main>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Faculty", href: "/faculty", icon: Users },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "AI Knowledge", href: "/ai-knowledge", icon: Sparkles },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const availableRoles = [
    "Head of Department",
    "Dept. Coordinator",
    "Faculty Member",
  ];

  const isDark = theme === "dark";

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-200 ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* SIDEBAR (Desktop) */}
      <aside
        className={`hidden lg:flex w-64 flex-col border-r p-4 space-y-6 shrink-0 transition-colors duration-200 ${
          isDark
            ? "border-slate-800 bg-slate-900/50 text-slate-100"
            : "border-slate-200 bg-white text-slate-800 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
            W
          </div>
          <div>
            <h2
              className={`font-black text-sm tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              WorkHub AI
            </h2>
            <p
              className={`text-[10px] font-semibold ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Academic Suite
            </p>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div
          className={`p-3 rounded-2xl border space-y-1 ${
            isDark
              ? "bg-slate-800/60 border-slate-700/50"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-indigo-500" /> Active Role
          </span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer border ${
              isDark
                ? "bg-slate-900 border-slate-700 text-indigo-300"
                : "bg-white border-slate-300 text-indigo-600"
            }`}
          >
            {availableRoles.map((role) => (
              <option
                key={role}
                value={role}
                className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}
              >
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div
          className={`pt-4 border-t flex items-center justify-between ${
            isDark ? "border-slate-800/80" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full font-extrabold flex items-center justify-center text-xs border ${
                isDark
                  ? "bg-slate-800 text-indigo-400 border-slate-700"
                  : "bg-indigo-50 text-indigo-600 border-indigo-200"
              }`}
            >
              {user?.avatar || user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p
                className={`text-xs font-bold truncate ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {user?.name || "User"}
              </p>
              <p
                className={`text-[10px] truncate ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header
          className={`h-16 border-b px-6 flex items-center justify-between shrink-0 transition-colors duration-200 ${
            isDark
              ? "border-slate-800 bg-slate-900/30 text-slate-100"
              : "border-slate-200 bg-white text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl ${
                isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span
              className={`font-bold text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              WorkHub AI
            </span>
          </div>

          <div
            className={`hidden lg:flex items-center gap-2 text-xs font-medium ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span>Workspace</span>
            <span>/</span>
            <span
              className={`font-semibold capitalize ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {pathname === "/" ? "Dashboard" : pathname.replace("/", "")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* LIGHT / DARK MODE TOGGLE */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              className={`p-2 rounded-xl transition-all border ${
                isDark
                  ? "bg-slate-800/80 text-amber-400 border-slate-700/50 hover:bg-slate-800"
                  : "bg-slate-100 text-indigo-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              className={`p-2 rounded-xl border relative transition-colors ${
                isDark
                  ? "bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/50"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5" />
            </button>

            {/* Active User Info */}
            <div className="text-right hidden sm:block">
              <p
                className={`text-xs font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {user?.name || "Dr. Sarah Jenkins"}
              </p>
              <p className="text-[10px] text-indigo-500 font-semibold">{activeRole}</p>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-b p-4 space-y-3 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-md"
            }`}
          >
            <div
              className={`p-2 rounded-xl space-y-1 ${
                isDark ? "bg-slate-800/80" : "bg-slate-50"
              }`}
            >
              <span
                className={`text-[10px] font-bold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Active Role
              </span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className={`w-full text-xs p-1.5 rounded-lg border ${
                  isDark
                    ? "bg-slate-900 text-indigo-300 border-slate-700"
                    : "bg-white text-indigo-600 border-slate-300"
                }`}
              >
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-4 h-4 text-indigo-500" />
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}