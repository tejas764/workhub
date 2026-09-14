import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const ACCESS_COOKIE = "workhub_google_access";
const REFRESH_COOKIE = "workhub_google_refresh";
const EXPIRY_COOKIE = "workhub_google_expiry";
const OWNER_COOKIE = "workhub_google_owner";
export const GOOGLE_OAUTH_STATE_COOKIE = "workhub_google_oauth_state";

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export function getGoogleOAuthConfig() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ??
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
    process.env["Client ID"];
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET ??
    process.env["Google Client Secret"] ??
    process.env.CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  return { clientId, clientSecret, redirectUri };
}

export function getGoogleOAuthMissingConfig() {
  const config = getGoogleOAuthConfig();
  return [
    !config.clientId && "GOOGLE_CLIENT_ID",
    !config.clientSecret && "GOOGLE_CLIENT_SECRET",
    !config.redirectUri && "GOOGLE_REDIRECT_URI",
  ].filter(Boolean) as string[];
}

export async function exchangeGoogleCode(code: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(`Missing Google OAuth config: ${getGoogleOAuthMissingConfig().join(", ")}`);
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code,
    }),
  });

  const payload = await response.json() as TokenResponse;

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || "Google authorization failed.");
  }

  return payload;
}

async function refreshGoogleAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getGoogleOAuthConfig();

  if (!clientId || !clientSecret) {
    throw new Error(`Missing Google OAuth config: ${getGoogleOAuthMissingConfig().join(", ")}`);
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const payload = await response.json() as TokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error || "Google Calendar needs to be reconnected.");
  }

  return payload;
}

export async function saveGoogleTokens(userId: string, tokens: TokenResponse) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + Number(tokens.expires_in ?? 3600) * 1000;
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  if (tokens.access_token) {
    cookieStore.set(ACCESS_COOKIE, tokens.access_token, {
      ...cookieOptions,
      maxAge: Number(tokens.expires_in ?? 3600),
    });
    cookieStore.set(EXPIRY_COOKIE, String(expiresAt), {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (tokens.refresh_token) {
    cookieStore.set(REFRESH_COOKIE, tokens.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 90,
    });
  }

  cookieStore.set(OWNER_COOKIE, userId, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 90,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) return;

  const supabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  await supabase.from("google_integrations").upsert({
    user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: new Date(expiresAt).toISOString(),
    scope: tokens.scope,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
}

export async function getGoogleAccessToken(userId: string) {
  const cookieStore = await cookies();
  const owner = cookieStore.get(OWNER_COOKIE)?.value;
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const expiresAt = Number(cookieStore.get(EXPIRY_COOKIE)?.value ?? 0);

  if (owner !== userId) return null;

  if (accessToken && expiresAt > Date.now() + 60_000) {
    return accessToken;
  }

  if (!refreshToken) return null;

  const refreshed = await refreshGoogleAccessToken(refreshToken);
  await saveGoogleTokens(userId, {
    ...refreshed,
    refresh_token: refreshToken,
  });

  return refreshed.access_token ?? null;
}

export async function hasGoogleCalendarConnection(userId: string) {
  const cookieStore = await cookies();
  return cookieStore.get(OWNER_COOKIE)?.value === userId && Boolean(cookieStore.get(REFRESH_COOKIE)?.value || cookieStore.get(ACCESS_COOKIE)?.value);
}
