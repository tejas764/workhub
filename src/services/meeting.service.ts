import { createClient } from "@/lib/supabase-client";
import { getBackendTable } from "@/services/backend-data.service";

export async function getMeetings() {
  return getBackendTable("meetings");
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
