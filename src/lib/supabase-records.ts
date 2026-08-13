import type { Announcement, DocItem, Meeting, TaskItem } from "@/types";

type AnyRow = Record<string, unknown>;

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

const firstBoolean = (row: AnyRow, keys: string[]) => {
  for (const key of keys) {
    const raw = row[key];
    if (typeof raw === "boolean") return raw;
    const value = asText(raw).toLowerCase();
    if (["true", "1", "yes", "pinned"].includes(value)) return true;
    if (["false", "0", "no"].includes(value)) return false;
  }
  return false;
};

const formatDate = (value: string) => {
  if (!value) return "Not dated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const normalizeStatus = (value: string): TaskItem["status"] => {
  const status = value.toLowerCase().replace(/[_-]+/g, " ");
  if (["completed", "complete", "done", "closed"].includes(status)) return "Completed";
  if (["overdue", "late"].includes(status)) return "Overdue";
  if (["in progress", "active", "ongoing"].includes(status)) return "In Progress";
  return "Pending";
};

const normalizeMeetingStatus = (value: string): Meeting["status"] => {
  const status = value.toLowerCase().replace(/[_-]+/g, " ");
  if (["completed", "complete", "done"].includes(status)) return "Completed";
  if (["cancelled", "canceled"].includes(status)) return "Cancelled";
  return "Upcoming";
};

const normalizePriority = (value: string): TaskItem["priority"] => {
  const priority = value.toLowerCase();
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Medium";
};

const normalizeDocType = (value: string): DocItem["type"] => {
  const text = value.toLowerCase();
  if (text.includes("doc") || text.includes("word")) return "doc";
  if (text.includes("xls") || text.includes("excel") || text.includes("sheet")) return "xlsx";
  if (text.includes("ppt") || text.includes("powerpoint")) return "ppt";
  if (text.includes("image") || text.includes("jpg") || text.includes("jpeg") || text.includes("png")) return "img";
  return "pdf";
};

const summaryFrom = (value: string) =>
  value ? value.slice(0, 220) : "No AI summary is available for this record yet.";

export const taskItemFromRow = (row: AnyRow, index = 0): TaskItem => ({
  id: firstText(row, ["id", "task_id"]) || index + 1,
  title: firstText(row, ["title", "name", "task_title"]) || "Untitled task",
  assignee: firstText(row, ["assignee", "assignee_name", "assigned_to_name", "assigned_to", "faculty_name"]) || "Unassigned",
  priority: normalizePriority(firstText(row, ["priority", "task_priority"])),
  status: normalizeStatus(firstText(row, ["status", "task_status"])),
  dueDate: formatDate(firstText(row, ["due_date", "deadline", "target_date"])),
  department: firstText(row, ["department", "department_name", "department_id", "dept"]) || "Department",
  description: firstText(row, ["description", "details", "content"]) || "No description added.",
});

export const meetingFromRow = (row: AnyRow, index = 0): Meeting => {
  const participants = Array.isArray(row.participants) ? row.participants.length : firstNumber(row, ["participants", "participant_count", "attendee_count"]);

  return {
    id: firstText(row, ["id", "meeting_id"]) || index + 1,
    title: firstText(row, ["title", "subject", "name"]) || "Untitled meeting",
    organizer: firstText(row, ["organizer", "organizer_name", "created_by", "uploaded_by"]) || "Department",
    date: formatDate(firstText(row, ["meeting_date", "date", "scheduled_at", "starts_at"])),
    time: firstText(row, ["time", "meeting_time", "start_time"]) || "TBA",
    participants,
    status: normalizeMeetingStatus(firstText(row, ["status", "meeting_status"])),
    department: firstText(row, ["department", "department_name", "department_id", "dept"]) || "Department",
    location: firstText(row, ["location", "venue", "room", "meeting_link"]) || "TBA",
  };
};

export const documentFromRow = (row: AnyRow, index = 0): DocItem => {
  const storagePath = firstText(row, ["storage_path", "file_path", "path", "url"]);
  const typeSource = firstText(row, ["type", "document_type", "mime_type"]) || storagePath;

  return {
    id: firstText(row, ["id", "document_id"]) || index + 1,
    title: firstText(row, ["title", "name", "file_name"]) || storagePath.split("/").pop() || "Untitled document",
    category: firstText(row, ["category", "document_type", "type"]) || "General",
    uploadedBy: firstText(row, ["uploaded_by", "uploader", "author", "created_by"]) || "Department",
    date: formatDate(firstText(row, ["created_at", "uploaded_at", "date"])),
    type: normalizeDocType(typeSource),
    size: firstText(row, ["size", "file_size", "display_size"]) || "Unknown size",
    hasSummary: Boolean(firstText(row, ["ai_summary", "summary"])) || firstBoolean(row, ["has_summary"]),
  };
};

export const announcementFromRow = (row: AnyRow, index = 0): Announcement => {
  const content = firstText(row, ["summary", "ai_summary", "content", "body", "description"]);

  return {
    id: firstText(row, ["id", "announcement_id"]) || index + 1,
    title: firstText(row, ["title", "subject", "name"]) || "Untitled announcement",
    category: firstText(row, ["category", "type"]) || "General",
    department: firstText(row, ["department", "department_name", "department_id", "dept"]) || "Department",
    postedBy: firstText(row, ["posted_by", "uploaded_by", "author", "created_by"]) || "Department",
    date: formatDate(firstText(row, ["created_at", "posted_at", "published_at", "date"])),
    pinned: firstBoolean(row, ["pinned", "is_pinned"]) || firstText(row, ["priority"]).toLowerCase() === "pinned",
    hasAttachment: firstBoolean(row, ["has_attachment", "has_attachments"]) || Boolean(firstText(row, ["attachment_url", "file_path", "storage_path"])),
    summary: summaryFrom(content),
  };
};
