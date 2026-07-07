import type { AppPage } from "@/types";

export const BREADCRUMBS: Record<AppPage, string[]> = {
  dashboard: ["Home", "Dashboard"],
  faculty: ["Home", "Faculty"],
  announcements: ["Home", "Announcements"],
  meetings: ["Home", "Meetings"],
  documents: ["Home", "Documents"],
  tasks: ["Home", "Tasks"],
  "ai-knowledge": ["Home", "AI Knowledge"],
  reports: ["Home", "Reports"],
  department: ["Home", "Department"],
  notifications: ["Home", "Notifications"],
  profile: ["Home", "Profile"],
  settings: ["Home", "Settings"],
  help: ["Home", "Help & Support"],
  e404: ["Home", "404"],
  e403: ["Home", "403"],
  e500: ["Home", "500"],
};
