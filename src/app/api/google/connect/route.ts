import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getGoogleOAuthConfig, getGoogleOAuthMissingConfig, GOOGLE_OAUTH_STATE_COOKIE } from "@/lib/google-oauth";
import { GOOGLE_WORKSPACE_SCOPE } from "@/lib/google-scopes";

export const dynamic = "force-dynamic";

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/meetings";
  return value;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const missing = getGoogleOAuthMissingConfig();
  if (missing.length) {
    return NextResponse.json({ error: `Missing Google OAuth config: ${missing.join(", ")}` }, { status: 500 });
  }

  const { clientId, redirectUri } = getGoogleOAuthConfig();
  const state = randomUUID();
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("next"));
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId!);
  url.searchParams.set("redirect_uri", redirectUri!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_WORKSPACE_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "select_account consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("enable_granular_consent", "true");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, `${state}:${data.user.id}:${encodeURIComponent(returnTo)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}
