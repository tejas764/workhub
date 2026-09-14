import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { hasGoogleCalendarConnection } from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error } = await supabase.auth.getUser();
  const { data: sessionData } = await supabase.auth.getSession();

  if (error || !userData.user) {
    return NextResponse.json({ connected: false, error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({
    connected: Boolean(sessionData.session?.provider_token) || await hasGoogleCalendarConnection(userData.user.id),
  });
}
