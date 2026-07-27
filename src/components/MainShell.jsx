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
} from "lucide-react";

export default function MainShell({ children }) {
  const pathname = usePathname();
  const { user, activeRole, setActiveRole, logout, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Show a loading screen while checking local storage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-sm font-semibold">
        Loading WorkHub AI...
      </div>
    );
  }

  // 2. If on /login OR not logged in, render the page cleanly without sidebar/navbar
  if (pathname === "/login" || !isAuthenticated) {
    return <main className="min-h-screen bg-slate-950 text-slate-100">{children}</main>;
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-900/50 p-4 space-y-6 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
            W
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-white">WorkHub AI</h2>
            <p className="text-[10px] text-slate-400 font-semibold">Academic Suite</p>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-400" /> Active Role
          </span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-indigo-300 font-semibold focus:outline-none cursor-pointer"
          >
            {availableRoles.map((role) => (
              <option key={role} value={role} className="bg-slate-900 text-white">
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
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-400 font-extrabold flex items-center justify-center text-xs border border-slate-700">
              {user?.avatar || user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-sm text-white">WorkHub AI</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-white font-semibold capitalize">
              {pathname === "/" ? "Dashboard" : pathname.replace("/", "")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5" />
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user?.name || "Dr. Sarah Jenkins"}</p>
              <p className="text-[10px] text-indigo-400 font-semibold">{activeRole}</p>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
            <div className="p-2 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400">Active Role</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="w-full bg-slate-900 text-xs text-indigo-300 p-1.5 rounded-lg border border-slate-700"
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
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                <item.icon className="w-4 h-4 text-indigo-400" />
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