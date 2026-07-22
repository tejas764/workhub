import { createClient } from "@/lib/supabase-client";

export async function getAnnouncements() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
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