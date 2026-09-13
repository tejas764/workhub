import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set(["Pending", "In Progress", "Completed"]);

type TaskPayload = {
  title?: string;
  assignedTo?: string;
  dueDate?: string | null;
  status?: string;
  departmentId?: string;
};

async function createBackendClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (url && serviceKey) {
    return createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createServerSupabaseClient();
}

async function requireUser() {
  const authClient = await createServerSupabaseClient();
  const { data, error } = await authClient.auth.getUser();

  if (error || !data.user) {
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  return { user: data.user };
}

const selectTasks = () =>
  "*, assignee:faculty!fk_task_faculty(id, name, email, department_id), department:departments!fk_task_department(id, name, code)";

function validatePayload(payload: TaskPayload, partial = false) {
  const hasDueDate = Object.prototype.hasOwnProperty.call(payload, "dueDate");
  const title = payload.title?.trim();
  const assignedTo = payload.assignedTo?.trim();
  const departmentId = payload.departmentId?.trim();
  const status = payload.status?.trim() || (partial ? undefined : "Pending");
  const dueDate = payload.dueDate ? new Date(payload.dueDate) : null;

  if (!partial || title !== undefined) {
    if (!title) return { error: "Task title is required." };
  }

  if (!partial || assignedTo !== undefined) {
    if (!assignedTo) return { error: "Assignee is required." };
  }

  if (!partial || departmentId !== undefined) {
    if (!departmentId) return { error: "Department is required." };
  }

  if (status && !VALID_STATUSES.has(status)) {
    return { error: "Status must be Pending, In Progress, or Completed." };
  }

  if (payload.dueDate && Number.isNaN(dueDate?.getTime())) {
    return { error: "Due date is invalid." };
  }

  return {
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(assignedTo !== undefined ? { assigned_to: assignedTo } : {}),
      ...(departmentId !== undefined ? { department_id: departmentId } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(hasDueDate ? { due_date: dueDate ? dueDate.toISOString() : null } : {}),
      updated_at: new Date().toISOString(),
    },
  };
}

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const client = await createBackendClient();
  const { data, error } = await client
    .from("tasks")
    .select(selectTasks())
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) {
    return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const payload = (await request.json()) as TaskPayload;
  const validated = validatePayload(payload);

  if (validated.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const taskData = validated.data;

  if (!taskData) {
    return NextResponse.json({ error: "Task data is invalid." }, { status: 400 });
  }

  const client = await createBackendClient();
  const { data, error } = await client
    .from("tasks")
    .insert(taskData)
    .select(selectTasks())
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const payload = (await request.json()) as TaskPayload & { id?: string };
  const id = payload.id?.trim();

  if (!id) {
    return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
  }

  const validated = validatePayload(payload, true);

  if (validated.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const taskData = validated.data;

  if (!taskData) {
    return NextResponse.json({ error: "Task data is invalid." }, { status: 400 });
  }

  const client = await createBackendClient();
  const { data, error } = await client
    .from("tasks")
    .update(taskData)
    .eq("id", id)
    .select(selectTasks())
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
