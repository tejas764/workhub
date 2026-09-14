import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getGoogleAccessToken } from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

type GoogleErrorBody = {
  error?: {
    message?: string;
    status?: string;
  };
};

type GoogleIdentity = {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  picture?: string;
};

async function requireGoogleAccessToken() {
  const supabase = await createServerSupabaseClient();
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);
  const user = userData.user;

  if (sessionError || userError || !sessionData.session || !user) {
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  const accessToken = await getGoogleAccessToken(user.id) ?? sessionData.session.provider_token;

  if (!accessToken) {
    return {
      error: NextResponse.json(
        { error: "Google Workspace is not connected.", needsGoogleAuth: true },
        { status: 403 }
      ),
    };
  }

  return { accessToken, user };
}

async function googleJson<T>(accessToken: string, input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const googleBody = body as GoogleErrorBody;
    const message = googleBody.error?.message ?? "Google Workspace request failed.";
    throw Object.assign(new Error(message), { status: response.status });
  }

  return body as T;
}

function base64Url(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function cleanEmailList(value: unknown) {
  const text = Array.isArray(value) ? value.join(",") : String(value ?? "");
  return text
    .split(/[,\n;]/)
    .map(item => item.trim())
    .filter(item => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item));
}

function gmailHeaders(headers?: Array<{ name?: string; value?: string }>) {
  const map = new Map((headers ?? []).map(header => [header.name?.toLowerCase(), header.value]));
  return {
    from: map.get("from") ?? "",
    subject: map.get("subject") ?? "(No subject)",
    date: map.get("date") ?? "",
  };
}

async function getGoogleIdentity(accessToken: string) {
  return googleJson<GoogleIdentity>(accessToken, "https://www.googleapis.com/oauth2/v2/userinfo");
}

async function getGmailMessages(accessToken: string) {
  const list = await googleJson<{ messages?: Array<{ id: string }> }>(
    accessToken,
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8&q=in:anywhere%20newer_than:30d"
  );
  const messages = await Promise.all(
    (list.messages ?? []).map(async message => {
      const detail = await googleJson<{
        id: string;
        snippet?: string;
        payload?: { headers?: Array<{ name?: string; value?: string }> };
      }>(
        accessToken,
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`
      );
      return { id: detail.id, snippet: detail.snippet ?? "", ...gmailHeaders(detail.payload?.headers) };
    })
  );

  return messages;
}

async function sendGmail(accessToken: string, payload: Record<string, unknown>, userEmail?: string) {
  const to = cleanEmailList(payload.to);
  const cc = cleanEmailList(payload.cc);
  const subject = String(payload.subject ?? "").trim();
  const body = String(payload.body ?? "").trim();

  if (!to.length) throw Object.assign(new Error("Add at least one valid recipient."), { status: 400 });
  if (!subject) throw Object.assign(new Error("Subject is required."), { status: 400 });
  if (!body) throw Object.assign(new Error("Message body is required."), { status: 400 });

  const lines = [
    `From: ${userEmail ?? "me"}`,
    `To: ${to.join(", ")}`,
    cc.length ? `Cc: ${cc.join(", ")}` : "",
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].filter(Boolean);

  return googleJson<{ id: string; threadId?: string }>(
    accessToken,
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      body: JSON.stringify({ raw: base64Url(lines.join("\r\n")) }),
    }
  );
}

async function getDriveFiles(accessToken: string) {
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("q", "trashed=false");
  url.searchParams.set("fields", "files(id,name,mimeType,webViewLink,modifiedTime,size,owners(displayName,emailAddress))");

  const data = await googleJson<{
    files?: Array<{
      id: string;
      name: string;
      mimeType: string;
      webViewLink?: string;
      modifiedTime?: string;
      size?: string;
      owners?: Array<{ displayName?: string; emailAddress?: string }>;
    }>;
  }>(accessToken, url.toString());

  return data.files ?? [];
}

async function createDriveFolder(accessToken: string, name: string) {
  const folderName = name.trim();
  if (!folderName) throw Object.assign(new Error("Folder name is required."), { status: 400 });

  return googleJson<{ id: string; name: string; webViewLink?: string }>(
    accessToken,
    "https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink",
    {
      method: "POST",
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      }),
    }
  );
}

async function uploadDriveNote(accessToken: string, payload: Record<string, unknown>) {
  const name = String(payload.name ?? "WorkHub note").trim();
  const content = String(payload.content ?? "").trim();
  if (!name) throw Object.assign(new Error("File name is required."), { status: 400 });
  if (!content) throw Object.assign(new Error("Note content is required."), { status: 400 });

  const boundary = `workhub-${Date.now()}`;
  const metadata = {
    name: name.toLowerCase().endsWith(".txt") ? name : `${name}.txt`,
    mimeType: "text/plain",
  };
  const body = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    content,
    `--${boundary}--`,
  ].join("\r\n");

  return googleJson<{ id: string; name: string; webViewLink?: string }>(
    accessToken,
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
    {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    }
  );
}

async function getSpreadsheets(accessToken: string) {
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("orderBy", "modifiedTime desc");
  url.searchParams.set("q", "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  url.searchParams.set("fields", "files(id,name,webViewLink,modifiedTime,owners(displayName,emailAddress))");

  const data = await googleJson<{ files?: Array<{ id: string; name: string; webViewLink?: string; modifiedTime?: string }> }>(
    accessToken,
    url.toString()
  );
  return data.files ?? [];
}

async function createSpreadsheet(accessToken: string, title: string) {
  const spreadsheetTitle = title.trim();
  if (!spreadsheetTitle) throw Object.assign(new Error("Spreadsheet title is required."), { status: 400 });

  return googleJson<{
    spreadsheetId: string;
    spreadsheetUrl?: string;
    properties?: { title?: string };
  }>(
    accessToken,
    "https://sheets.googleapis.com/v4/spreadsheets",
    {
      method: "POST",
      body: JSON.stringify({
        properties: { title: spreadsheetTitle },
        sheets: [{ properties: { title: "WorkHub" } }],
      }),
    }
  );
}

async function getSheetRows(accessToken: string, spreadsheetId: string, range: string) {
  if (!spreadsheetId) return [];
  const safeRange = range.trim() || "A1:E10";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(safeRange)}`;
  const data = await googleJson<{ values?: string[][] }>(accessToken, url);
  return data.values ?? [];
}

async function appendSheetRow(accessToken: string, payload: Record<string, unknown>) {
  const spreadsheetId = String(payload.spreadsheetId ?? "").trim();
  const range = String(payload.range ?? "A:E").trim();
  const values = Array.isArray(payload.values)
    ? payload.values.map(value => String(value ?? "").trim())
    : String(payload.values ?? "").split(",").map(value => value.trim());

  if (!spreadsheetId) throw Object.assign(new Error("Choose a spreadsheet first."), { status: 400 });
  if (!values.some(Boolean)) throw Object.assign(new Error("Add at least one cell value."), { status: 400 });

  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append`);
  url.searchParams.set("valueInputOption", "USER_ENTERED");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  return googleJson<{ updates?: { updatedRange?: string; updatedRows?: number } }>(
    accessToken,
    url.toString(),
    {
      method: "POST",
      body: JSON.stringify({ values: [values] }),
    }
  );
}

async function loadOverview(accessToken: string) {
  const [identity, gmail, drive, sheets] = await Promise.allSettled([
    getGoogleIdentity(accessToken),
    getGmailMessages(accessToken),
    getDriveFiles(accessToken),
    getSpreadsheets(accessToken),
  ]);

  const result = <T>(settled: PromiseSettledResult<T>) =>
    settled.status === "fulfilled" ? { data: settled.value } : { data: [], error: settled.reason?.message ?? "Request failed." };

  return {
    identity: identity.status === "fulfilled" ? identity.value : null,
    gmail: result(gmail),
    drive: result(drive),
    sheets: result(sheets),
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireGoogleAccessToken();
  if (auth.error) return auth.error;

  const type = request.nextUrl.searchParams.get("type") ?? "overview";
  const spreadsheetId = request.nextUrl.searchParams.get("spreadsheetId") ?? "";
  const range = request.nextUrl.searchParams.get("range") ?? "A1:E10";

  try {
    if (type === "identity") return NextResponse.json({ data: await getGoogleIdentity(auth.accessToken) });
    if (type === "gmail") return NextResponse.json({ data: await getGmailMessages(auth.accessToken) });
    if (type === "drive") return NextResponse.json({ data: await getDriveFiles(auth.accessToken) });
    if (type === "sheets") return NextResponse.json({ data: await getSpreadsheets(auth.accessToken) });
    if (type === "sheetRows") return NextResponse.json({ data: await getSheetRows(auth.accessToken, spreadsheetId, range) });
    return NextResponse.json({ data: await loadOverview(auth.accessToken) });
  } catch (caught) {
    const error = caught as Error & { status?: number };
    return NextResponse.json(
      { error: error.message, needsGoogleAuth: error.status === 401 || error.status === 403 },
      { status: error.status ?? 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireGoogleAccessToken();
  if (auth.error) return auth.error;

  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(payload.action ?? "");

  try {
    if (action === "sendEmail") {
      const identity = await getGoogleIdentity(auth.accessToken).catch(() => null);
      return NextResponse.json({ data: await sendGmail(auth.accessToken, payload, identity?.email ?? auth.user.email) });
    }
    if (action === "createFolder") {
      return NextResponse.json({ data: await createDriveFolder(auth.accessToken, String(payload.name ?? "")) });
    }
    if (action === "uploadNote") {
      return NextResponse.json({ data: await uploadDriveNote(auth.accessToken, payload) });
    }
    if (action === "createSpreadsheet") {
      return NextResponse.json({ data: await createSpreadsheet(auth.accessToken, String(payload.title ?? "")) });
    }
    if (action === "appendSheetRow") {
      return NextResponse.json({ data: await appendSheetRow(auth.accessToken, payload) });
    }

    return NextResponse.json({ error: "Unknown Google Workspace action." }, { status: 400 });
  } catch (caught) {
    const error = caught as Error & { status?: number };
    return NextResponse.json(
      { error: error.message, needsGoogleAuth: error.status === 401 || error.status === 403 },
      { status: error.status ?? 500 }
    );
  }
}
