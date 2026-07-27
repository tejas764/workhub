"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Head of Department");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      name: name || "Dr. Sarah Jenkins",
      email: email || "s.jenkins@workhub.edu",
      role: role,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md space-y-8 relative z-10 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> WorkHub AI Suite
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Enter your credentials to access your departmental workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Sarah Jenkins"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s.jenkins@workhub.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-800/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="Head of Department">Head of Department</option>
              <option value="Dept. Coordinator">Dept. Coordinator</option>
              <option value="Faculty Member">Faculty Member</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 mt-6"
          >
            Sign In to Workspace <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}