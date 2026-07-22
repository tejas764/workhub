import { createClient } from "@/lib/supabase-client";

export async function getMeetings() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createMeeting(
  meeting: {
    title: string;
    meeting_date: string;
    department_id: string;
  }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("meetings")
    .insert([meeting])
    .select();

  if (error) throw error;

  return data;
}