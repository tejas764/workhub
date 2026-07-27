"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Search,
  Plus,
  Mail,
  UserCheck,
  UserX,
  Filter,
} from "lucide-react";

export default function FacultyPage() {
  const { faculty, setFaculty, activeRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State for Add Faculty Modal
  const [showModal, setShowModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    role: "Assistant Professor",
    dept: "Computer Science",
    email: "",
  });

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.email) return;

    const createdMember = {
      id: Date.now(),
      name: newFaculty.name,
      role: newFaculty.role,
      dept: newFaculty.dept,
      email: newFaculty.email,
      tasks: 0,
      status: "Active",
    };

    setFaculty([createdMember, ...faculty]);
    setNewFaculty({
      name: "",
      role: "Assistant Professor",
      dept: "Computer Science",
      email: "",
    });
    setShowModal(false);
  };

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Users className="w-6 h-6 text-indigo-500" /> Faculty Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Directory of department professors, lecturers, and academic staff.
          </p>
        </div>

        {/* Action Button (Restricted by Role if needed) */}
        {(activeRole === "Head of Department" || activeRole === "Dept. Coordinator") && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Faculty Member
          </button>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, department, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-900/50">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {member.role}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  member.status === "Active"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
                    : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                }`}
              >
                {member.status === "Active" ? (
                  <UserCheck className="w-3 h-3" />
                ) : (
                  <UserX className="w-3 h-3" />
                )}
                {member.status}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Department:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {member.dept}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Active Tasks:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {member.tasks} assigned
                </span>
              </div>
            </div>

            <a
              href={`mailto:${member.email}`}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700/50"
            >
              <Mail className="w-3.5 h-3.5" /> Email Faculty
            </a>
          </div>
        ))}
      </div>

      {/* Add Faculty Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Add New Faculty Member
            </h2>

            <form onSubmit={handleAddFaculty} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Smith"
                  value={newFaculty.name}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. j.smith@workhub.edu"
                  value={newFaculty.email}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Role Title
                </label>
                <select
                  value={newFaculty.role}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, role: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Dept. Coordinator">Dept. Coordinator</option>
                </select>
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
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}