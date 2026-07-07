import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { FacultyMember, Role } from "@/types";

export type FacultyRow = Record<string, unknown>;

const asText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();

const firstText = (row: FacultyRow, keys: string[]) => {
  for (const key of keys) {
    const value = asText(row[key]);
    if (value) return value;
  }
  return "";
};

const normalizeRole = (value: string): Role | null => {
  const role = value.toLowerCase().replace(/\s+/g, "_");
  if (role === "hod" || role === "head_of_department") return "hod";
  if (role === "coordinator" || role === "dept_coordinator" || role === "department_coordinator") return "coordinator";
  if (role === "faculty" || role === "faculty_member") return "faculty";
  return null;
};

const displayRole = (value: string) => {
  const role = normalizeRole(value);
  if (role === "hod") return "HOD";
  if (role === "coordinator") return "Coordinator";
  return value || "Faculty";
};

const normalizeStatus = (value: string): FacultyMember["status"] => {
  const status = value.toLowerCase().replace(/[_-]+/g, " ");
  if (status === "on leave") return "On Leave";
  if (status === "inactive") return "Inactive";
  return "Active";
};

export const facultyMemberFromRow = (row: FacultyRow, index = 0): FacultyMember => ({
  id: firstText(row, ["id", "faculty_id", "employee_id", "user_id", "auth_user_id"]) || index + 1,
  name: firstText(row, ["name", "full_name", "faculty_name", "display_name"]) || "Faculty Member",
  email: firstText(row, ["email", "email_address", "mail"]),
  phone: firstText(row, ["phone", "phone_number", "mobile", "contact_number"]) || "Not added",
  designation: firstText(row, ["designation", "title", "position"]) || "Faculty",
  department: firstText(row, ["department", "dept", "department_name"]) || "Department",
  role: displayRole(firstText(row, ["role", "faculty_role", "user_role"])),
  status: normalizeStatus(firstText(row, ["status", "employment_status"])),
  joined: firstText(row, ["joined", "date_of_joining", "joining_date", "joined_at", "created_at"]) || "Not added",
});

export const fallbackFacultyFromUser = (user: SupabaseUser | null): FacultyMember => {
  const metadata = user?.user_metadata ?? {};
  const name = asText(metadata.full_name) || asText(metadata.name) || user?.email?.split("@")[0] || "Faculty Member";
  return {
    id: user?.id ?? "current-user",
    name,
    email: user?.email ?? "",
    phone: "Not added",
    designation: "Faculty",
    department: "Department",
    role: displayRole(asText(metadata.role) || "faculty"),
    status: "Active",
    joined: "Not added",
  };
};

export const roleFromFaculty = (faculty: FacultyMember): Role =>
  normalizeRole(faculty.role) ?? "faculty";
