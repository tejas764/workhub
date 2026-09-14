import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { exchangeGoogleCode, GOOGLE_OAUTH_STATE_COOKIE, saveGoogleTokens } from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

function safeReturnTo(value?: string) {
  const decoded = value ? decodeURIComponent(value) : "/meetings";
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return "/meetings";
  return decoded;
}

function redirectAfterGoogle(request: NextRequest, returnTo: string, params: Record<string, string>) {
  const url = new URL(returnTo, request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value ?? "";
  const [expectedState, expectedUserId, rawReturnTo] = stateCookie.split(":");
  const returnTo = safeReturnTo(rawReturnTo);

  if (error) {
    return redirectAfterGoogle(request, returnTo, { google: "error", google_calendar: "error", reason: error });
  }

  if (!code || !state) {
    return redirectAfterGoogle(request, returnTo, { google: "error", google_calendar: "error", reason: "missing_code" });
  }

  if (!expectedState || expectedState !== state) {
    return redirectAfterGoogle(request, returnTo, { google: "error", google_calendar: "error", reason: "invalid_state" });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user || data.user.id !== expectedUserId) {
    return redirectAfterGoogle(request, returnTo, { google: "error", google_calendar: "error", reason: "session_mismatch" });
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    await saveGoogleTokens(data.user.id, tokens);

    const response = redirectAfterGoogle(request, returnTo, { google: "connected", google_calendar: "connected" });
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return response;
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "authorization_failed";
    return redirectAfterGoogle(request, returnTo, { google: "error", google_calendar: "error", reason: message });
  }
}
