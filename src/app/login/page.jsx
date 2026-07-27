"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, theme, toggleTheme } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. Sarah Jenkins",
    email: "s.jenkins@workhub.edu",
    password: "••••••••",
    role: "Head of Department",
  });

  const isDark = theme === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      name: formData.name || "Academic User",
      email: formData.email,
      role: formData.role,
    });
    router.push("/");
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 relative overflow-hidden ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          className={`p-2.5 rounded-2xl border transition-all duration-200 ${
            isDark
              ? "bg-slate-900/80 text-amber-400 border-slate-800 hover:bg-slate-800 backdrop-blur-md"
              : "bg-white/80 text-indigo-600 border-slate-200 hover:bg-slate-100 shadow-sm backdrop-blur-md"
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT COLUMN: Hero & Branding Section */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative z-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80">
        <div className="space-y-6 max-w-xl">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-600/30">
              W
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                WorkHub AI
              </h2>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Academic Management Suite
              </p>
            </div>
          </div>

          {/* Hero Tagline */}
          <div className="space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" /> Smart Academic Governance
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Powering modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                university workflows
              </span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Streamline department tasks, coordinate faculty workloads, and access AI-driven academic knowledge—all in one unified workspace.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-3">
              <Brain className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Assistant</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Context-aware Q&A</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Role Engine</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Tailored permissions</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Analytics</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Real-time KPI metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Trust Tag */}
        <div className="pt-8 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Trusted by modern academic institutions</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Auth Box */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          <div
            className={`p-8 rounded-3xl border shadow-xl transition-all duration-300 ${
              isDark
                ? "bg-slate-900/90 border-slate-800/80 backdrop-blur-2xl shadow-indigo-950/20"
                : "bg-white border-slate-200/80 shadow-slate-200/60 backdrop-blur-2xl"
            }`}
          >
            {/* Header & Mode Switcher Tabs */}
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {isSignUp ? "Create Account" : "Sign In"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isSignUp
                    ? "Enter details to register your departmental account"
                    : "Access your dashboard using authorized credentials"}
                </p>
              </div>

              {/* Tab Toggle */}
              <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    !isSignUp
                      ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    isSignUp
                      ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  New Account
                </button>
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@university.edu"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Select Academic Role
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="Head of Department">Head of Department</option>
                      <option value="Dept. Coordinator">Dept. Coordinator</option>
                      <option value="Faculty Member">Faculty Member</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
              >
                <span>
                  {isSignUp ? "Register Account" : "Sign In to Workspace"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Sub-text Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need a new account? Register here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}