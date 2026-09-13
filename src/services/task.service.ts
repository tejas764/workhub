import type { BackendRow } from "@/services/backend-data.service";

export type TaskMutation = {
  title: string;
  assignedTo: string;
  dueDate: string | null;
  status: "Pending" | "In Progress" | "Completed";
  departmentId: string;
};

async function parseTaskResponse(response: Response): Promise<BackendRow[]> {
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Task request failed.");
  }

  if (Array.isArray(payload.data)) return payload.data as BackendRow[];
  return payload.data ? [payload.data as BackendRow] : [];
}

export async function getTasks() {
  return parseTaskResponse(await fetch("/api/tasks", { cache: "no-store" }));
}

export async function createTask(input: TaskMutation) {
  return parseTaskResponse(await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }));
}

export async function updateTask(taskId: string, input: Partial<TaskMutation>) {
  return parseTaskResponse(await fetch("/api/tasks", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: taskId, ...input }),
  }));
}
