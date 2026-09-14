export type GoogleMessage = {
  id: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
};

export type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
  size?: string;
  owners?: Array<{ displayName?: string; emailAddress?: string }>;
};

export type GoogleSpreadsheet = {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
  owners?: Array<{ displayName?: string; emailAddress?: string }>;
};

export type GoogleIdentity = {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  picture?: string;
};

export type GoogleWorkspaceOverview = {
  identity: GoogleIdentity | null;
  gmail: { data: GoogleMessage[]; error?: string };
  drive: { data: GoogleDriveFile[]; error?: string };
  sheets: { data: GoogleSpreadsheet[]; error?: string };
};

type ApiError = Error & { needsGoogleAuth?: boolean };

async function readPayload<T>(response: Response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.error) {
    const error = new Error(payload.error ?? "Google Workspace request failed.") as ApiError;
    error.needsGoogleAuth = Boolean(payload.needsGoogleAuth);
    throw error;
  }

  return payload.data as T;
}

export async function getGoogleWorkspaceOverview() {
  const response = await fetch("/api/google/workspace", { cache: "no-store" });
  return readPayload<GoogleWorkspaceOverview>(response);
}

export async function refreshGoogleService<T>(type: "gmail" | "drive" | "sheets") {
  const response = await fetch(`/api/google/workspace?type=${type}`, { cache: "no-store" });
  return readPayload<T>(response);
}

export async function getSheetRows(spreadsheetId: string, range: string) {
  const params = new URLSearchParams({ type: "sheetRows", spreadsheetId, range });
  const response = await fetch(`/api/google/workspace?${params.toString()}`, { cache: "no-store" });
  return readPayload<string[][]>(response);
}

async function googleAction<T>(body: Record<string, unknown>) {
  const response = await fetch("/api/google/workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return readPayload<T>(response);
}

export function connectGoogleWorkspace() {
  window.location.assign("/api/google/connect?next=/google");
}

export async function sendGoogleEmail(input: { to: string; cc?: string; subject: string; body: string }) {
  return googleAction<{ id: string; threadId?: string }>({ action: "sendEmail", ...input });
}

export async function createDriveFolder(name: string) {
  return googleAction<GoogleDriveFile>({ action: "createFolder", name });
}

export async function uploadDriveNote(name: string, content: string) {
  return googleAction<GoogleDriveFile>({ action: "uploadNote", name, content });
}

export async function createGoogleSpreadsheet(title: string) {
  return googleAction<{ spreadsheetId: string; spreadsheetUrl?: string; properties?: { title?: string } }>({
    action: "createSpreadsheet",
    title,
  });
}

export async function appendGoogleSheetRow(spreadsheetId: string, range: string, values: string[]) {
  return googleAction<{ updates?: { updatedRange?: string; updatedRows?: number } }>({
    action: "appendSheetRow",
    spreadsheetId,
    range,
    values,
  });
}
