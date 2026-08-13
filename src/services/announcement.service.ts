import { createClient } from "@/lib/supabase-client";
import { getBackendTable } from "@/services/backend-data.service";

export async function getAnnouncements() {
  return getBackendTable("announcements");
}

export async function createAnnouncement(
  announcement: {
    title: string;
    content: string;
    category: string;
    department_id: string;
    uploaded_by: string;
  }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("announcements")
    .insert([announcement])
    .select();

  if (error) throw error;

  return data;
}
