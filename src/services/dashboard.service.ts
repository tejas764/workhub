import type { FacultyMember } from "@/types";
import { facultyMemberFromRow, type FacultyRow } from "@/lib/faculty-profile";
import { getBackendTable } from "@/services/backend-data.service";

type AnyRow = Record<string, unknown>;

export interface WorkloadPoint {
  month: string;
  hours: number;
}

export interface TaskTrendPoint {
  month: string;
  completed: number;
  pending: number;
}

export interface UploadTrendPoint {
  month: string;
  docs: number;
}

export interface DepartmentDistributionPoint {
  name: string;
  value: number;
}

export interface DashboardAnnouncement {
  id: string | number;
  title: string;
  category: string;
  date: string;
  pinned: boolean;
}

export interface DashboardMeeting {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

export interface HODDashboardData {
  faculty: FacultyMember[];
  stats: {
    totalFaculty: number;
    departments: number;
    activeTasks: number;
    highPriorityTasks: number;
    pendingApprovals: number;
    meetingsToday: number;
    nextMeetingTime: string;
    documents: number;
    documentsThisWeek: number;
    announcements: number;
    pinnedAnnouncements: number;
  };
  workloadData: WorkloadPoint[];
  taskTrendData: TaskTrendPoint[];
  uploadTrendData: UploadTrendPoint[];
  deptDistData: DepartmentDistributionPoint[];
  recentAnnouncements: DashboardAnnouncement[];
  upcomingMeetings: DashboardMeeting[];
  insights: string[];
}

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const asText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();

const firstText = (row: AnyRow, keys: string[]) => {
  for (const key of keys) {
    const value = asText(row[key]);
    if (value) return value;
  }
  return "";
};

const firstNumber = (row: AnyRow, keys: string[]) => {
  for (const key of keys) {
    const raw = row[key];
    const value = typeof raw === "number" ? raw : Number(raw);
    if (Number.isFinite(value)) return value;
  }
  return 0;
};

const parseDate = (value: unknown) => {
  const text = asText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

const firstDate = (row: AnyRow, keys: string[]) => {
  for (const key of keys) {
    const date = parseDate(row[key]);
    if (date) return date;
  }
  return null;
};

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (key: string) => MONTH[Number(key.slice(5, 7)) - 1] ?? key;

const statusText = (row: AnyRow) => firstText(row, ["status", "task_status", "meeting_status"]).toLowerCase();
const priorityText = (row: AnyRow) => firstText(row, ["priority", "task_priority"]).toLowerCase();

const isCompleted = (row: AnyRow) => ["completed", "done", "closed"].includes(statusText(row));
const isPendingLike = (row: AnyRow) => !isCompleted(row) && !["cancelled", "canceled"].includes(statusText(row));

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const isThisWeek = (date: Date, now: Date) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
};

const latestMonths = (count = 6) => {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
    return monthKey(date);
  });
};

const readTable = async (table: Parameters<typeof getBackendTable>[0]) => {
  try {
    return await getBackendTable(table) as AnyRow[];
  } catch (error) {
    console.error(`${table} fetch error:`, error);
    return [];
  }
};

const mapAnnouncement = (row: AnyRow, index: number): DashboardAnnouncement => ({
  id: firstText(row, ["id", "announcement_id"]) || index + 1,
  title: firstText(row, ["title", "subject", "name"]) || "Untitled announcement",
  category: firstText(row, ["category", "type"]) || "General",
  date: firstText(row, ["date", "created_at", "posted_at", "published_at"]) || "Not dated",
  pinned: ["true", "1", "yes", "pinned"].includes(firstText(row, ["pinned", "is_pinned", "priority"]).toLowerCase()),
});

const mapMeeting = (row: AnyRow, index: number): DashboardMeeting => ({
  id: firstText(row, ["id", "meeting_id"]) || index + 1,
  title: firstText(row, ["title", "subject", "name"]) || "Untitled meeting",
  date: firstText(row, ["meeting_date", "date", "scheduled_at", "starts_at", "created_at"]) || "",
  time: firstText(row, ["time", "meeting_time", "start_time"]) || "TBA",
  location: firstText(row, ["location", "venue", "room", "meeting_link"]) || "TBA",
  status: firstText(row, ["status", "meeting_status"]) || "Upcoming",
});

export async function getHODDashboardData(): Promise<HODDashboardData> {
  const [facultyRows, taskRows, meetingRows, documentRows, announcementRows, approvalRows] = await Promise.all([
    readTable("faculty"),
    readTable("tasks"),
    readTable("meetings"),
    readTable("documents"),
    readTable("announcements"),
    readTable("approvals"),
  ]);

  const now = new Date();
  const faculty = facultyRows.map((row, index) => facultyMemberFromRow(row as FacultyRow, index));
  const departments = new Set(faculty.map(f => f.department).filter(Boolean));
  const monthKeys = latestMonths();

  const workloadTotals = new Map<string, number>();
  taskRows.forEach(row => {
    const date = firstDate(row, ["due_date", "created_at", "updated_at", "completed_at"]);
    if (!date) return;
    const hours = firstNumber(row, ["workload_hours", "hours", "estimated_hours", "duration_hours"]) || 1;
    workloadTotals.set(monthKey(date), (workloadTotals.get(monthKey(date)) ?? 0) + hours);
  });

  const taskTrend = new Map<string, { completed: number; pending: number }>();
  taskRows.forEach(row => {
    const date = firstDate(row, ["due_date", "created_at", "updated_at", "completed_at"]);
    if (!date) return;
    const key = monthKey(date);
    const current = taskTrend.get(key) ?? { completed: 0, pending: 0 };
    if (isCompleted(row)) current.completed += 1;
    else if (isPendingLike(row)) current.pending += 1;
    taskTrend.set(key, current);
  });

  const uploadTrend = new Map<string, number>();
  documentRows.forEach(row => {
    const date = firstDate(row, ["created_at", "uploaded_at", "date"]);
    if (!date) return;
    uploadTrend.set(monthKey(date), (uploadTrend.get(monthKey(date)) ?? 0) + 1);
  });

  const deptCounts = new Map<string, number>();
  faculty.forEach(member => {
    const department = member.department || "Department";
    deptCounts.set(department, (deptCounts.get(department) ?? 0) + 1);
  });
  const busiestDepartment = Array.from(deptCounts, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)[0];
  const overdueTasks = taskRows.filter(row => statusText(row) === "overdue").length;
  const activeTasks = taskRows.filter(isPendingLike).length;
  const highPriorityTasks = taskRows.filter(row => priorityText(row) === "high" && isPendingLike(row)).length;
  const pendingApprovals = approvalRows.filter(isPendingLike).length;

  const upcomingMeetings = meetingRows
    .map(mapMeeting)
    .filter(meeting => {
      const status = meeting.status.toLowerCase();
      const date = parseDate(meeting.date);
      return !["completed", "cancelled", "canceled"].includes(status) && (!date || date >= new Date(now.toDateString()));
    })
    .sort((a, b) => {
      const left = parseDate(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const right = parseDate(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return left - right;
    });

  const meetingsToday = meetingRows.filter(row => {
    const date = firstDate(row, ["meeting_date", "date", "scheduled_at", "starts_at"]);
    return date ? isSameDay(date, now) : false;
  }).length;

  const documentsThisWeek = documentRows.filter(row => {
    const date = firstDate(row, ["created_at", "uploaded_at", "date"]);
    return date ? isThisWeek(date, now) : false;
  }).length;

  const recentAnnouncements = announcementRows
    .map(mapAnnouncement)
    .sort((a, b) => (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0))
    .slice(0, 3);

  return {
    faculty,
    stats: {
      totalFaculty: faculty.length,
      departments: departments.size,
      activeTasks,
      highPriorityTasks,
      pendingApprovals,
      meetingsToday,
      nextMeetingTime: upcomingMeetings[0]?.time ?? "None",
      documents: documentRows.length,
      documentsThisWeek,
      announcements: announcementRows.length,
      pinnedAnnouncements: announcementRows.filter(row => mapAnnouncement(row, 0).pinned).length,
    },
    workloadData: monthKeys.map(key => ({ month: monthLabel(key), hours: workloadTotals.get(key) ?? 0 })),
    taskTrendData: monthKeys.map(key => ({ month: monthLabel(key), completed: taskTrend.get(key)?.completed ?? 0, pending: taskTrend.get(key)?.pending ?? 0 })),
    uploadTrendData: monthKeys.map(key => ({ month: monthLabel(key), docs: uploadTrend.get(key) ?? 0 })),
    deptDistData: Array.from(deptCounts, ([name, value]) => ({ name, value })),
    recentAnnouncements,
    upcomingMeetings: upcomingMeetings.slice(0, 4),
    insights: [
      activeTasks ? `${activeTasks} active tasks are currently open across the department.` : "No active tasks are open right now.",
      highPriorityTasks ? `${highPriorityTasks} high-priority tasks need attention.` : "No high-priority task pressure detected.",
      overdueTasks ? `${overdueTasks} tasks are overdue and should be reviewed first.` : "No overdue task backlog detected.",
      pendingApprovals ? `${pendingApprovals} approval requests are waiting for review.` : "No pending approvals are waiting.",
      busiestDepartment ? `${busiestDepartment.name} has the largest faculty count with ${busiestDepartment.value} members.` : "Faculty distribution will appear after faculty records are available.",
    ],
  };
}
