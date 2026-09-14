import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Key,
  Link,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  User,
  Users,
  Video,
} from "lucide-react";
import type { FacultyMember, Meeting, Role } from "@/types";
import { C } from "@/constants";
import {
  Avatar,
  Btn,
  Card,
  Drawer,
  EmptyState,
  FilterBar,
  Input,
  Modal,
  Select,
  StatusBadge,
  Tabs,
} from "@/components/ui";
import type { CreateMeetingInput } from "@/services/meeting.service";
import { getGoogleCalendarStatus } from "@/services/meeting.service";

export function MeetingsPage({
  meetings = [],
  facultyMembers = [],
  currentFaculty,
  loading = false,
  onCreateMeeting,
  onAuthorizeGoogle,
}: {
  role: Role;
  meetings?: Meeting[];
  facultyMembers?: FacultyMember[];
  currentFaculty?: FacultyMember;
  loading?: boolean;
  onCreateMeeting?: (meeting: CreateMeetingInput) => Promise<void>;
  onAuthorizeGoogle?: () => Promise<void>;
}) {
  const [tab, setTab] = useState("Upcoming");
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [detailTab, setDetailTab] = useState("Agenda");
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [dateFilter, setDateFilter] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [needsGoogleAuth, setNeedsGoogleAuth] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    durationMinutes: "30",
    departmentId: currentFaculty?.departmentId ?? "",
    agenda: "",
    location: "",
    attendeeEmails: [] as string[],
  });

  const departments = useMemo(() => {
    const names = [
      currentFaculty?.department,
      ...facultyMembers.map(member => member.department),
      ...meetings.map(meeting => meeting.department),
    ].filter(Boolean) as string[];

    return ["All Departments", ...Array.from(new Set(names))];
  }, [currentFaculty?.department, facultyMembers, meetings]);

  const filtered = useMemo(() => {
    const formattedFilterDate = dateFilter
      ? new Date(dateFilter).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "";

    return meetings.filter(meeting => {
      const matchesTab = meeting.status === tab;
      const matchesQuery =
        !query ||
        `${meeting.title} ${meeting.organizer} ${meeting.location}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesDepartment =
        departmentFilter === "All Departments" || meeting.department === departmentFilter;
      const matchesDate = !formattedFilterDate || meeting.date.includes(formattedFilterDate);

      return matchesTab && matchesQuery && matchesDepartment && matchesDate;
    });
  }, [dateFilter, departmentFilter, meetings, query, tab]);

  const selectedDepartmentName =
    currentFaculty?.department ?? departments.find(department => department !== "All Departments") ?? "Department";

  useEffect(() => {
    void getGoogleCalendarStatus().then(setCalendarConnected).catch(() => setCalendarConnected(false));

    const params = new URLSearchParams(window.location.search);
    const status = params.get("google_calendar");
    if (status === "connected") setCalendarConnected(true);
    if (status === "error") {
      setError(params.get("reason") || "Google Calendar authorization failed.");
      setNeedsGoogleAuth(true);
      setScheduleOpen(true);
    }
  }, []);

  const updateForm = (key: keyof typeof form, value: string | string[]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const toggleAttendee = (email: string) => {
    setForm(current => ({
      ...current,
      attendeeEmails: current.attendeeEmails.includes(email)
        ? current.attendeeEmails.filter(item => item !== email)
        : [...current.attendeeEmails, email],
    }));
  };

  const copyMeetingLink = async (meeting: Meeting) => {
    if (!meeting.meetingLink) return;
    await navigator.clipboard.writeText(meeting.meetingLink);
    setCopiedId(meeting.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  const submitMeeting = async () => {
    if (!onCreateMeeting) return;

    setSaving(true);
    setError("");
    setNeedsGoogleAuth(false);

    try {
      await onCreateMeeting({
        title: form.title,
        date: form.date,
        time: form.time,
        durationMinutes: Number(form.durationMinutes),
        departmentId: form.departmentId || currentFaculty?.departmentId || currentFaculty?.department || "department",
        departmentName: selectedDepartmentName,
        attendeeEmails: form.attendeeEmails,
        agenda: form.agenda,
        location: form.location,
        createGoogleMeet: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
      });

      setScheduleOpen(false);
      setForm(current => ({
        ...current,
        title: "",
        agenda: "",
        location: "",
        attendeeEmails: [],
      }));
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message || "Unable to schedule meeting.");
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setSaving(false);
    }
  };

  const attendeesForSelected = selected?.attendeeEmails?.length
    ? facultyMembers.filter(member => selected.attendeeEmails?.includes(member.email))
    : facultyMembers.slice(0, 5);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: C.blue600 }}>Meetings</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textSecondary }}>
            Schedule Google Meet sessions, invite faculty, and manage meeting records.
          </p>
        </div>

        <div className="flex gap-3">
          <Btn variant={calendarConnected ? "secondary" : "outline"} size="sm" icon={calendarConnected ? CheckCircle : Key} onClick={() => !calendarConnected && onAuthorizeGoogle?.()}>
            {calendarConnected ? "Google Connected" : "Connect Google"}
          </Btn>
          <Btn variant="primary" size="sm" icon={Plus} onClick={() => setScheduleOpen(true)}>Schedule Meeting</Btn>
        </div>
      </div>

      <FilterBar>
        <Input placeholder="Search meetings..." icon={Search} className="flex-1 min-w-40" value={query} onChange={setQuery} />
        <Select options={departments} value={departmentFilter} onChange={setDepartmentFilter} />
        <Input placeholder="Date..." icon={Calendar} className="w-40" type="date" value={dateFilter} onChange={setDateFilter} />
        <Select options={["Upcoming", "Completed", "Cancelled"]} value={tab} onChange={setTab} />
      </FilterBar>

      <Tabs tabs={["Upcoming", "Completed", "Cancelled"]} active={tab} onChange={setTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(meeting => (
          <Card key={meeting.id} className="p-5" onClick={() => { setSelected(meeting); setDetailTab("Agenda"); }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <StatusBadge status={meeting.status} />
              {meeting.meetingLink && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: C.blue200 }}>
                  <Video size={12} /> Google Meet
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold mb-3 leading-snug" style={{ color: C.textPrimary }}>{meeting.title}</h3>

            <div className="space-y-2">
              {[
                { icon: Calendar, value: `${meeting.date} - ${meeting.time}` },
                { icon: MapPin, value: meeting.meetingLink ? "Google Meet" : meeting.location },
                { icon: Users, value: `${meeting.participants} participants` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
                  <Icon size={12} style={{ color: C.blue200 }} />{value}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2 min-w-0">
                <Avatar name={meeting.organizer} size="sm" />
                <p className="text-xs font-semibold truncate" style={{ color: C.textSecondary }}>{meeting.organizer}</p>
              </div>

              {meeting.meetingLink && (
                <div className="flex gap-2">
                  <Btn variant="outline" size="sm" icon={Copy} onClick={() => void copyMeetingLink(meeting)}>
                    {copiedId === meeting.id ? "Copied" : "Copy"}
                  </Btn>
                  <Btn variant="primary" size="sm" icon={Video} onClick={() => window.open(meeting.meetingLink, "_blank", "noopener,noreferrer")}>
                    Join
                  </Btn>
                </div>
              )}
            </div>
          </Card>
        ))}

        {loading && (
          <div className="col-span-3">
            <EmptyState icon={RefreshCw} title="Loading meetings" description="Fetching the latest meetings from WorkHub." />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="col-span-3">
            <EmptyState
              icon={Video}
              title={`No ${tab} meetings`}
              description={`There are no ${tab.toLowerCase()} meetings.`}
              action={<Btn variant="primary" icon={Plus} onClick={() => setScheduleOpen(true)}>Schedule Meeting</Btn>}
            />
          </div>
        )}
      </div>

      {scheduleOpen && (
        <Modal
          title="Schedule Google Meet"
          onClose={() => !saving && setScheduleOpen(false)}
          footer={
            <>
              {needsGoogleAuth && onAuthorizeGoogle && (
                <Btn variant="outline" icon={Key} onClick={() => void onAuthorizeGoogle()}>Connect Google</Btn>
              )}
              <Btn variant="outline" onClick={() => setScheduleOpen(false)} disabled={saving}>Cancel</Btn>
              <Btn variant="primary" icon={Video} onClick={() => void submitMeeting()} disabled={saving}>
                {saving ? "Scheduling..." : "Create Meet"}
              </Btn>
            </>
          }
        >
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: C.red200, color: C.red500, background: C.red50 }}>
                {error}
              </div>
            )}

            <Input placeholder="Meeting title" value={form.title} onChange={value => updateForm("title", value)} icon={Video} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input type="date" value={form.date} onChange={value => updateForm("date", value)} icon={Calendar} />
              <Input type="time" value={form.time} onChange={value => updateForm("time", value)} icon={Clock} />
              <Select
                value={form.durationMinutes}
                onChange={value => updateForm("durationMinutes", value)}
                options={["15", "30", "45", "60", "90", "120"]}
              />
            </div>

            <Input placeholder="Room or context (optional)" value={form.location} onChange={value => updateForm("location", value)} icon={MapPin} />

            <textarea
              value={form.agenda}
              onChange={event => updateForm("agenda", event.target.value)}
              placeholder="Agenda, notes, or preparation details"
              className="w-full min-h-28 border bg-white text-sm outline-none px-3 py-2.5 resize-none"
              style={{ borderColor: C.border, borderRadius: 10, color: C.textPrimary }}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold" style={{ color: C.textPrimary }}>Attendees</p>
                <p className="text-xs" style={{ color: C.textMuted }}>{form.attendeeEmails.length} selected</p>
              </div>

              <div className="max-h-44 overflow-y-auto border rounded-xl divide-y" style={{ borderColor: C.border }}>
                {facultyMembers.filter(member => member.email).map(member => (
                  <label key={member.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.attendeeEmails.includes(member.email)}
                      onChange={() => toggleAttendee(member.email)}
                    />
                    <Avatar name={member.name} size="sm" />
                    <span className="min-w-0">
                      <span className="block text-xs font-bold truncate" style={{ color: C.textPrimary }}>{member.name}</span>
                      <span className="block text-[10px] truncate" style={{ color: C.textMuted }}>{member.email}</span>
                    </span>
                  </label>
                ))}

                {facultyMembers.filter(member => member.email).length === 0 && (
                  <div className="p-4 text-xs" style={{ color: C.textMuted }}>No faculty emails are available yet.</div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {selected && (
        <Drawer title="Meeting Details" onClose={() => setSelected(null)} width="w-[580px]">
          <div className="pb-5 mb-5 border-b" style={{ borderColor: C.border }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-base font-black" style={{ color: C.blue600 }}>{selected.title}</h3>
              <StatusBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Calendar, value: `${selected.date} - ${selected.time}` },
                { icon: MapPin, value: selected.meetingLink ? "Google Meet" : selected.location },
                { icon: Users, value: `${selected.participants} participants` },
                { icon: User, value: `By ${selected.organizer}` },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
                  <Icon size={12} style={{ color: C.blue200 }} />{value}
                </div>
              ))}
            </div>

            {selected.meetingLink && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn variant="primary" size="sm" icon={Video} onClick={() => window.open(selected.meetingLink, "_blank", "noopener,noreferrer")}>Join Meet</Btn>
                <Btn variant="outline" size="sm" icon={Copy} onClick={() => void copyMeetingLink(selected)}>
                  {copiedId === selected.id ? "Copied" : "Copy Link"}
                </Btn>
                {selected.calendarLink && (
                  <Btn variant="outline" size="sm" icon={ExternalLink} onClick={() => window.open(selected.calendarLink, "_blank", "noopener,noreferrer")}>Calendar</Btn>
                )}
              </div>
            )}
          </div>

          <Tabs tabs={["Agenda", "Minutes", "Decisions", "Attendance", "Action Items", "Attachments"]} active={detailTab} onChange={setDetailTab} />

          {detailTab === "Agenda" && (
            <div className="space-y-2">
              {(selected.agenda
                ? selected.agenda.split("\n").filter(Boolean)
                : ["Opening and roll call", "Review previous minutes", "Discussion items", "Decisions and next actions"]
              ).map((item, index) => (
                <div key={item} className="flex gap-3 p-3 rounded-xl" style={{ background: C.bg }}>
                  <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0" style={{ background: C.blue50, color: C.blue500 }}>
                    {index + 1}
                  </span>
                  <p className="text-sm flex-1" style={{ color: C.textPrimary }}>{item}</p>
                  <p className="text-xs flex-shrink-0" style={{ color: C.textMuted }}>{10 + index * 5} min</p>
                </div>
              ))}
            </div>
          )}

          {detailTab === "Attendance" && (
            <div className="space-y-2">
              {attendeesForSelected.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: C.border }}>
                  <Avatar name={member.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: C.textPrimary }}>{member.name}</p>
                    <p className="text-[10px] truncate" style={{ color: C.textMuted }}>{member.email || member.designation}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.olive300 }}>
                    <CheckCircle size={13} style={{ color: C.olive300 }} />Invited
                  </div>
                </div>
              ))}

              {attendeesForSelected.length === 0 && (
                <EmptyState icon={Users} title="No attendees" description="Invite faculty while scheduling to track attendance here." />
              )}
            </div>
          )}

          {["Minutes", "Decisions", "Action Items", "Attachments"].includes(detailTab) && (
            <EmptyState icon={FileText} title={`No ${detailTab}`} description={`${detailTab} will appear here after the meeting.`} />
          )}

          {selected.status === "Upcoming" && (
            <div className="mt-5 flex gap-3">
              <Btn
                variant="primary"
                icon={Video}
                className="flex-1 justify-center"
                disabled={!selected.meetingLink}
                onClick={() => selected.meetingLink && window.open(selected.meetingLink, "_blank", "noopener,noreferrer")}
              >
                Start Meeting
              </Btn>
              <Btn
                variant="outline"
                icon={Link}
                className="flex-1 justify-center"
                disabled={!selected.meetingLink}
                onClick={() => void copyMeetingLink(selected)}
              >
                Copy Link
              </Btn>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}
