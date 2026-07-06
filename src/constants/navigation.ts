import {
  LayoutDashboard, Users, Bell, FileText, CheckSquare, Brain,
  BarChart2, Building2, Settings, HelpCircle, Megaphone, Video,
  User,
} from "lucide-react";
import type { NavItem, Role } from "@/types";

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  hod: [
    { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { id: "faculty",       label: "Faculty",       icon: Users },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "meetings",      label: "Meetings",      icon: Video },
    { id: "documents",     label: "Documents",     icon: FileText },
    { id: "tasks",         label: "Tasks",         icon: CheckSquare },
    { id: "ai-knowledge",  label: "AI Knowledge",  icon: Brain },
    { id: "reports",       label: "Reports",       icon: BarChart2 },
    { id: "department",    label: "Department",    icon: Building2 },
  ],
  coordinator: [
    { id: "dashboard",     label: "Dashboard",         icon: LayoutDashboard },
    { id: "announcements", label: "Announcements",     icon: Megaphone },
    { id: "meetings",      label: "Meetings",          icon: Video },
    { id: "documents",     label: "Documents",         icon: FileText },
    { id: "tasks",         label: "Tasks",             icon: CheckSquare },
    { id: "ai-knowledge",  label: "AI Knowledge",      icon: Brain },
    { id: "department",    label: "Department",        icon: Building2 },
    { id: "faculty",       label: "Faculty Directory", icon: Users },
  ],
  faculty: [
    { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "meetings",      label: "Meetings",      icon: Video },
    { id: "documents",     label: "Documents",     icon: FileText },
    { id: "tasks",         label: "My Tasks",      icon: CheckSquare },
    { id: "ai-knowledge",  label: "AI Knowledge",  icon: Brain },
  ],
};

export const BOTTOM_NAV: NavItem[] = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile",       label: "Profile",       icon: User },
  { id: "settings",      label: "Settings",      icon: Settings },
  { id: "help",          label: "Help",          icon: HelpCircle },
];
