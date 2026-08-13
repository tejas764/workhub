import { createClient } from "@/lib/supabase-client";
import { getBackendTable } from "@/services/backend-data.service";

export async function getTasks() {
  return getBackendTable("tasks");
}

export async function updateTask(
  taskId: string,
  status: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select();

  if (error) throw error;

  return data;
}
