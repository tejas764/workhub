import type React from "react";

export type Role = "hod" | "coordinator" | "faculty";
export type AppPage =
  | "dashboard" | "faculty" | "announcements" | "meetings"
  | "documents" | "tasks" | "ai-knowledge" | "reports"
  | "department" | "notifications" | "profile" | "settings"
  | "help" | "e404" | "e403" | "e500";
export type AuthView = "login" | "signup" | "forgot" | "reset";
export type ViewMode = "auth" | "app";

export interface NavItem { id: AppPage; label: string; icon: React.ComponentType<any> }
export interface FacultyMember { id: number | string; name: string; email: string; phone: string; designation: string; department: string; role: string; status: "Active" | "On Leave" | "Inactive"; joined: string }
export interface Announcement { id: number; title: string; category: string; department: string; postedBy: string; date: string; pinned: boolean; hasAttachment: boolean; summary: string }
export interface Meeting { id: number; title: string; organizer: string; date: string; time: string; participants: number; status: "Upcoming" | "Completed" | "Cancelled"; department: string; location: string }
export interface DocItem { id: number; title: string; category: string; uploadedBy: string; date: string; type: "pdf" | "doc" | "xlsx" | "ppt" | "img"; size: string; hasSummary: boolean }
export interface TaskItem { id: number; title: string; assignee: string; priority: "High" | "Medium" | "Low"; status: "In Progress" | "Pending" | "Completed" | "Overdue"; dueDate: string; department: string; description: string }
export interface NotifItem { id: number; type: "announcement" | "task" | "meeting" | "document" | "ai"; title: string; body: string; time: string; read: boolean }
