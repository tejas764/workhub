import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getGoogleAccessToken } from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

type MeetingPayload = {
  title?: string;
  date?: string;
  time?: string;
  durationMinutes?: number;
  departmentId?: string;
  departmentName?: string;
  attendeeEmails?: string[];
  agenda?: string;
  location?: string;
  createGoogleMeet?: boolean;
  timeZone?: string;
};

type GoogleEventResponse = {
  id?: string;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
  };
};

async function createBackendClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (url && serviceKey) {
    return createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createServerSupabaseClient();
}

async function requireSession() {
  const authClient = await createServerSupabaseClient();
  const { data, error } = await authClient.auth.getSession();

  if (error || !data.session?.user) {
    return { error: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  return { session: data.session };
}

const cleanEmails = (emails: unknown) =>
  Array.isArray(emails)
    ? emails
        .map(email => (typeof email === "string" ? email.trim() : ""))
        .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    : [];

function addMinutesToLocalDateTime(date: string, time: string, minutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const value = new Date(year, month - 1, day, hour, minute + minutes, 0);
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:00`;
}

function validatePayload(payload: MeetingPayload) {
  const title = payload.title?.trim();
  const date = payload.date?.trim();
  const time = payload.time?.trim();
  const departmentId = payload.departmentId?.trim();
  const durationMinutes = Number(payload.durationMinutes ?? 30);
  const timeZone = payload.timeZone?.trim() || "Asia/Kolkata";

  if (!title) return { error: "Meeting title is required." };
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Meeting date is required." };
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return { error: "Meeting time is required." };
  if (!departmentId) return { error: "Department is required." };
  if (!Number.isFinite(durationMinutes) || durationMinutes < 15 || durationMinutes > 480) {
    return { error: "Duration must be between 15 minutes and 8 hours." };
  }

  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) return { error: "Meeting date or time is invalid." };

  return {
    data: {
      title,
      date,
      time,
      departmentId,
      departmentName: payload.departmentName?.trim() || "Department",
      durationMinutes,
      startDateTime: `${date}T${time}:00`,
      endDateTime: addMinutesToLocalDateTime(date, time, durationMinutes),
      timeZone,
      attendeeEmails: cleanEmails(payload.attendeeEmails),
      agenda: payload.agenda?.trim() || "",
      location: payload.location?.trim() || "",
      createGoogleMeet: payload.createGoogleMeet !== false,
    },
  };
}

async function createGoogleCalendarEvent(
  accessToken: string,
  meeting: NonNullable<ReturnType<typeof validatePayload>["data"]>,
  organizerEmail?: string
) {
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: meeting.title,
      description: meeting.agenda || undefined,
      location: meeting.location || undefined,
      attendees: meeting.attendeeEmails
        .filter(email => email.toLowerCase() !== organizerEmail?.toLowerCase())
        .map(email => ({ email })),
      start: { dateTime: meeting.startDateTime, timeZone: meeting.timeZone },
      end: { dateTime: meeting.endDateTime, timeZone: meeting.timeZone },
      conferenceData: meeting.createGoogleMeet
        ? {
            createRequest: {
              requestId: `workhub-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          }
        : undefined,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body?.error?.message ?? "Google Calendar rejected the meeting request.";
    return { error: message, status: response.status };
  }

  const event = body as GoogleEventResponse;
  const meetLink = event.hangoutLink
    ?? event.conferenceData?.entryPoints?.find(point => point.entryPointType === "video")?.uri;

  return {
    event: {
      id: event.id,
      calendarLink: event.htmlLink,
      meetingLink: meetLink,
    },
  };
}

const meetingSelect = () => "*";

async function insertMeeting(row: Record<string, unknown>): Promise<{ data: Record<string, unknown> } | { error: string }> {
  const client = await createBackendClient();
  const attempts = [
    row,
    {
      title: row.title,
      meeting_date: row.meeting_date,
      department_id: row.department_id,
      time: row.time,
      location: row.location,
      status: row.status,
    },
    {
      title: row.title,
      meeting_date: row.meeting_date,
      department_id: row.department_id,
    },
  ];

  let lastError = "";

  for (const attempt of attempts) {
    const { data, error } = await client
      .from("meetings")
      .insert(attempt)
      .select(meetingSelect())
      .single();

    if (!error) return { data: (data ?? {}) as unknown as Record<string, unknown> };
    lastError = error.message;
  }

  return { error: lastError || "Meeting could not be saved." };
}

export async function GET() {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const client = await createBackendClient();
  const { data, error } = await client
    .from("meetings")
    .select(meetingSelect())
    .order("meeting_date", { ascending: false });

  if (error) {
    return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireSession();
  if (auth.error) return auth.error;

  const payload = (await request.json()) as MeetingPayload;
  const validated = validatePayload(payload);

  if (validated.error || !validated.data) {
    return NextResponse.json({ error: validated.error ?? "Meeting data is invalid." }, { status: 400 });
  }

  const session = auth.session;
  const accessToken = await getGoogleAccessToken(session.user.id) ?? session.provider_token;

  if (!accessToken) {
    return NextResponse.json(
      {
        error: "Google Calendar access is not connected. Connect Google Calendar & Meet to schedule meetings.",
        needsGoogleAuth: true,
      },
      { status: 403 }
    );
  }

  const googleResult = await createGoogleCalendarEvent(accessToken, validated.data, session.user.email);

  if (googleResult.error) {
    return NextResponse.json(
      {
        error: googleResult.error,
        needsGoogleAuth: googleResult.status === 401 || googleResult.status === 403,
      },
      { status: googleResult.status ?? 500 }
    );
  }

  const now = new Date().toISOString();
  const meetingRow = {
    title: validated.data.title,
    meeting_date: validated.data.startDateTime,
    department_id: validated.data.departmentId,
    department: validated.data.departmentName,
    time: validated.data.time,
    start_time: validated.data.time,
    location: googleResult.event?.meetingLink || validated.data.location || "Google Meet",
    meeting_link: googleResult.event?.meetingLink,
    calendar_link: googleResult.event?.calendarLink,
    google_event_id: googleResult.event?.id,
    organizer: session.user.user_metadata?.full_name ?? session.user.email ?? "Google user",
    organizer_email: session.user.email,
    participants: validated.data.attendeeEmails.length,
    attendee_count: validated.data.attendeeEmails.length,
    attendee_emails: validated.data.attendeeEmails,
    agenda: validated.data.agenda,
    status: "Upcoming",
    created_by: session.user.id,
    created_at: now,
    updated_at: now,
  };

  const saved = await insertMeeting(meetingRow);

  if ("error" in saved) {
    return NextResponse.json(
      {
        error: saved.error,
        googleEvent: googleResult.event,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      ...(saved.data as Record<string, unknown>),
      meeting_link: googleResult.event?.meetingLink,
      calendar_link: googleResult.event?.calendarLink,
      google_event_id: googleResult.event?.id,
      attendee_emails: validated.data.attendeeEmails,
      agenda: validated.data.agenda,
    },
  });
}
