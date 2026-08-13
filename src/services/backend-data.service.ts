type BackendTable =
  | "faculty"
  | "tasks"
  | "meetings"
  | "documents"
  | "announcements"
  | "departments"
  | "approvals";

export type BackendRow = Record<string, unknown>;

export async function getBackendTable(table: BackendTable): Promise<BackendRow[]> {
  const response = await fetch(`/api/backend-data?table=${table}`, {
    cache: "no-store",
  });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? `Unable to load ${table}.`);
  }

  return Array.isArray(payload.data) ? payload.data as BackendRow[] : [];
}
