import type { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  hod: "Head of Department", coordinator: "Dept. Coordinator", faculty: "Faculty Member",
};

export const isRole = (value: string | null): value is Role =>
  value === "hod" || value === "coordinator" || value === "faculty";
