import { createClient } from "@/lib/supabase-client";

export async function getTasks() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("due_date");

  if (error) throw error;

  return data;
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