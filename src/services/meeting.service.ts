import type { BackendRow } from "@/services/backend-data.service";

export type CreateMeetingInput = {
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  departmentId: string;
  departmentName?: string;
  attendeeEmails: string[];
  agenda?: string;
  location?: string;
  createGoogleMeet?: boolean;
  timeZone?: string;
};

export async function getMeetings() {
  const response = await fetch("/api/meetings", { cache: "no-store" });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Unable to load meetings.");
  }

  return Array.isArray(payload.data) ? payload.data as BackendRow[] : [];
}

export async function createMeeting(meeting: CreateMeetingInput) {
  const response = await fetch("/api/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meeting),
  });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    const error = new Error(payload.error ?? "Unable to schedule meeting.") as Error & {
      needsGoogleAuth?: boolean;
    };
    error.needsGoogleAuth = Boolean(payload.needsGoogleAuth);
    throw error;
  }

  return payload.data as BackendRow;
}

export async function authorizeGoogleCalendar() {
  window.location.assign("/api/google/connect?next=/meetings");
}

export async function getGoogleCalendarStatus() {
  const response = await fetch("/api/google/status", { cache: "no-store" });
  const payload = await response.json();

  return Boolean(response.ok && payload.connected);
}
