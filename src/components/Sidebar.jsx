"use client";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Sparkles,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { activeRole, setActiveRole, user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Faculty", icon: Users, path: "/faculty", roles: ["Head of Department", "Dept. Coordinator"] },
    { name: "Tasks", icon: CheckSquare, path: "/tasks" },
    { name: "AI Knowledge", icon: Sparkles, path: "/ai-knowledge" },
  ];

  const filteredNav = navigation.filter(
    (item) => !item.roles || item.roles.includes(activeRole)
  );

  return (
    <aside className="w-64 border-r flex flex-col justify-between h-screen sticky top-0 transition-colors duration-200 bg-white border-slate-200 text-slate-700 dark:bg-slate-900/95 dark:border-slate-800 dark:text-slate-200 backdrop-blur-md">
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            W
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              WorkHub <span className="text-indigo-500">AI</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Suite
            </p>
          </div>
        </div>

        {/* Dynamic Role Switcher */}
        <div className="mb-6 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
          <label className="block text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1">
            Active Role
          </label>
          <div className="relative">
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="w-full bg-transparent font-semibold text-xs text-slate-800 dark:text-slate-100 focus:outline-none appearance-none pr-6 cursor-pointer"
            >
              <option value="Head of Department" className="dark:bg-slate-900">
                Head of Department
              </option>
              <option value="Dept. Coordinator" className="dark:bg-slate-900">
                Dept. Coordinator
              </option>
              <option value="Faculty Member" className="dark:bg-slate-900">
                Faculty Member
              </option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-0 top-0.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls: User + Logout Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 truncate">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
            {user?.avatar || "U"}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
              {user?.name ? user.name.split(" ")[0] : "User"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{activeRole}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          title="Sign Out"
          aria-label="Sign Out"
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-all border border-slate-200 dark:border-slate-700/50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}