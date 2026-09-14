import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  FileText,
  FolderOpen,
  Key,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Send,
  Table,
  Upload,
} from "lucide-react";
import { C } from "@/constants";
import { cn } from "@/lib/ui-utils";
import { Btn, Card, EmptyState, Input, SectionHeader } from "@/components/ui";
import {
  appendGoogleSheetRow,
  connectGoogleWorkspace,
  createDriveFolder,
  createGoogleSpreadsheet,
  getGoogleWorkspaceOverview,
  getSheetRows,
  refreshGoogleService,
  sendGoogleEmail,
  uploadDriveNote,
  type GoogleDriveFile,
  type GoogleMessage,
  type GoogleSpreadsheet,
  type GoogleWorkspaceOverview,
} from "@/services/google-workspace.service";

type GoogleTab = "gmail" | "drive" | "sheets";

const emptyOverview: GoogleWorkspaceOverview = {
  identity: null,
  gmail: { data: [] },
  drive: { data: [] },
  sheets: { data: [] },
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function fileKind(mimeType: string) {
  if (mimeType.includes("folder")) return "Folder";
  if (mimeType.includes("spreadsheet")) return "Sheet";
  if (mimeType.includes("document")) return "Doc";
  if (mimeType.includes("presentation")) return "Slides";
  if (mimeType.includes("pdf")) return "PDF";
  return "File";
}

function ServiceTile({
  label,
  value,
  Icon,
  accent,
}: {
  label: string;
  value: string | number;
  Icon: React.ComponentType<any>;
  accent: string;
}) {
  return (
    <div className="bg-white border px-4 py-3 flex items-center gap-3" style={{ borderColor: C.border, borderRadius: 12 }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, color: accent }}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold" style={{ color: C.textMuted }}>{label}</p>
        <p className="text-xl font-black leading-tight" style={{ color: C.textPrimary }}>{value}</p>
      </div>
    </div>
  );
}

function GoogleNotice({ tone, text }: { tone: "success" | "error"; text: string }) {
  const success = tone === "success";
  const Icon = success ? CheckCircle : AlertTriangle;
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border"
      style={{
        borderColor: success ? "#34A853" : C.red200,
        background: success ? "#E6F4EA" : C.red50,
        color: success ? "#137333" : C.red500,
        borderRadius: 10,
      }}
    >
      <Icon size={15} />
      <span>{text}</span>
    </div>
  );
}

export function GoogleWorkspacePage() {
  const [tab, setTab] = useState<GoogleTab>("gmail");
  const [overview, setOverview] = useState<GoogleWorkspaceOverview>(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsGoogleAuth, setNeedsGoogleAuth] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });
  const [driveForm, setDriveForm] = useState({
    folderName: "WorkHub",
    noteName: "WorkHub note",
    noteContent: "",
  });
  const [sheetForm, setSheetForm] = useState({
    title: "WorkHub Tracker",
    spreadsheetId: "",
    range: "A:E",
    values: "",
  });
  const [sheetRows, setSheetRows] = useState<string[][]>([]);

  const messages = overview.gmail.data;
  const driveFiles = overview.drive.data;
  const spreadsheets = overview.sheets.data;
  const connectedEmail = overview.identity?.email ?? "";
  const connectedName = overview.identity?.name ?? "Google account";
  const connected = Boolean(connectedEmail) && !needsGoogleAuth;

  const filteredMessages = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return messages;
    return messages.filter(message => `${message.from} ${message.subject} ${message.snippet}`.toLowerCase().includes(q));
  }, [messages, query]);

  const filteredFiles = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return driveFiles;
    return driveFiles.filter(file => `${file.name} ${file.mimeType}`.toLowerCase().includes(q));
  }, [driveFiles, query]);

  const filteredSheets = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return spreadsheets;
    return spreadsheets.filter(sheet => sheet.name.toLowerCase().includes(q));
  }, [spreadsheets, query]);

  const loadOverview = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGoogleWorkspaceOverview();
      setOverview(data);
      const firstSheet = data.sheets.data[0]?.id;
      if (firstSheet) setSheetForm(current => ({ ...current, spreadsheetId: current.spreadsheetId || firstSheet }));
      setNeedsGoogleAuth(false);
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();

    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") setNotice("Google Workspace connected.");
    if (params.get("google") === "error") {
      setError(params.get("reason") || "Google Workspace authorization failed.");
      setNeedsGoogleAuth(true);
    }
  }, []);

  const refreshTab = async () => {
    setBusy("refresh");
    setError("");
    try {
      if (tab === "gmail") {
        const data = await refreshGoogleService<GoogleMessage[]>("gmail");
        setOverview(current => ({ ...current, gmail: { data } }));
      }
      if (tab === "drive") {
        const data = await refreshGoogleService<GoogleDriveFile[]>("drive");
        setOverview(current => ({ ...current, drive: { data } }));
      }
      if (tab === "sheets") {
        const data = await refreshGoogleService<GoogleSpreadsheet[]>("sheets");
        setOverview(current => ({ ...current, sheets: { data } }));
      }
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const submitEmail = async () => {
    setBusy("email");
    setError("");
    setNotice("");
    try {
      await sendGoogleEmail(emailForm);
      setNotice("Email sent from Gmail.");
      setEmailForm({ to: "", cc: "", subject: "", body: "" });
      await refreshTab();
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const submitFolder = async () => {
    setBusy("folder");
    setError("");
    setNotice("");
    try {
      await createDriveFolder(driveForm.folderName);
      setNotice("Drive folder created.");
      const data = await refreshGoogleService<GoogleDriveFile[]>("drive");
      setOverview(current => ({ ...current, drive: { data } }));
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const submitNote = async () => {
    setBusy("note");
    setError("");
    setNotice("");
    try {
      await uploadDriveNote(driveForm.noteName, driveForm.noteContent);
      setNotice("Drive note uploaded.");
      setDriveForm(current => ({ ...current, noteContent: "" }));
      const data = await refreshGoogleService<GoogleDriveFile[]>("drive");
      setOverview(current => ({ ...current, drive: { data } }));
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const submitSpreadsheet = async () => {
    setBusy("spreadsheet");
    setError("");
    setNotice("");
    try {
      const created = await createGoogleSpreadsheet(sheetForm.title);
      setNotice("Spreadsheet created.");
      const data = await refreshGoogleService<GoogleSpreadsheet[]>("sheets");
      setOverview(current => ({ ...current, sheets: { data } }));
      setSheetForm(current => ({ ...current, spreadsheetId: created.spreadsheetId }));
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const previewRows = async () => {
    if (!sheetForm.spreadsheetId) return;
    setBusy("preview");
    setError("");
    try {
      const rows = await getSheetRows(sheetForm.spreadsheetId, sheetForm.range || "A1:E10");
      setSheetRows(rows);
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const appendRow = async () => {
    setBusy("append");
    setError("");
    setNotice("");
    try {
      const values = sheetForm.values.split(",").map(value => value.trim());
      await appendGoogleSheetRow(sheetForm.spreadsheetId, sheetForm.range || "A:E", values);
      setNotice("Sheet row appended.");
      setSheetForm(current => ({ ...current, values: "" }));
      await previewRows();
    } catch (caught) {
      const err = caught as Error & { needsGoogleAuth?: boolean };
      setError(err.message);
      setNeedsGoogleAuth(Boolean(err.needsGoogleAuth));
    } finally {
      setBusy("");
    }
  };

  const tabButton = (id: GoogleTab, label: string, Icon: React.ComponentType<any>, color: string) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold border transition-colors"
        style={{
          borderColor: active ? color : C.border,
          background: active ? `${color}14` : "#fff",
          color: active ? color : C.textSecondary,
          borderRadius: 10,
        }}
      >
        <Icon size={15} />
        {label}
      </button>
    );
  };

  return (
    <main className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border" style={{ borderColor: C.border }}>
                <span className="font-black text-lg" style={{ color: "#4285F4" }}>G</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-black tracking-normal" style={{ color: C.textPrimary }}>Google Workspace</h1>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ background: connected ? "#34A853" : C.red300 }} />
                  <span className="text-xs font-bold" style={{ color: connected ? "#137333" : C.red500 }}>
                    {connected ? "Connected" : "Reconnect required"}
                  </span>
                  {connectedEmail && <span className="text-xs truncate" style={{ color: C.textMuted }}>{connectedEmail}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Btn variant="outline" icon={RefreshCw} onClick={() => void loadOverview()} disabled={loading}>Refresh</Btn>
            <Btn variant={needsGoogleAuth ? "primary" : "secondary"} icon={Key} onClick={connectGoogleWorkspace}>Connect Google</Btn>
          </div>
        </div>

        {(notice || error) && (
          <div className="space-y-2">
            {notice && <GoogleNotice tone="success" text={notice} />}
            {error && <GoogleNotice tone="error" text={error} />}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <ServiceTile label="Gmail" value={loading ? "-" : messages.length} Icon={Mail} accent="#EA4335" />
          <ServiceTile label="Drive" value={loading ? "-" : driveFiles.length} Icon={FolderOpen} accent="#34A853" />
          <ServiceTile label="Sheets" value={loading ? "-" : spreadsheets.length} Icon={Table} accent="#0F9D58" />
          <ServiceTile label="Account" value={connectedEmail ? "Verified" : needsGoogleAuth ? "Fix" : "Ready"} Icon={CheckCircle} accent="#4285F4" />
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {tabButton("gmail", "Gmail", Mail, "#EA4335")}
            {tabButton("drive", "Drive", FolderOpen, "#34A853")}
            {tabButton("sheets", "Sheets", Table, "#0F9D58")}
          </div>
          <div className="flex items-center gap-2">
            <Input value={query} onChange={setQuery} placeholder="Search" icon={Search} className="w-full sm:w-72" />
            <Btn variant="outline" icon={RefreshCw} onClick={() => void refreshTab()} disabled={Boolean(busy)}>Reload</Btn>
          </div>
        </div>

        {tab === "gmail" && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-4">
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b" style={{ borderColor: C.border, background: "linear-gradient(135deg,#FFF7F5,#F8FBFF)" }}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "#EA4335" }}>
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black" style={{ color: C.textPrimary }}>Gmail Inbox</p>
                      <p className="text-xs truncate" style={{ color: C.textMuted }}>{connectedEmail ? `${connectedName} - ${connectedEmail}` : "Connect Google to load your mailbox"}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: "#FCE8E6", color: "#A50E0E" }}>
                    {filteredMessages.length} recent
                  </span>
                </div>
              </div>
              <div className="p-4">
              {overview.gmail.error && <GoogleNotice tone="error" text={overview.gmail.error} />}
              {!filteredMessages.length && !loading ? (
                <EmptyState icon={Mail} title="No messages" description="Recent Gmail messages will appear here." />
              ) : (
                <div className="space-y-2">
                  {filteredMessages.map(message => (
                    <div key={message.id} className="border bg-white px-3 py-3" style={{ borderColor: C.border, borderRadius: 12 }}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ background: "#FCE8E6", color: "#A50E0E" }}>
                          {(message.from.match(/[A-Za-z]/)?.[0] ?? "G").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-black truncate" style={{ color: C.textPrimary }}>{message.subject}</p>
                            <span className="text-[11px] whitespace-nowrap" style={{ color: C.textMuted }}>{formatDate(message.date)}</span>
                          </div>
                          <p className="text-xs font-semibold truncate mt-1" style={{ color: C.textSecondary }}>{message.from}</p>
                          <p className="text-xs mt-2 line-clamp-2" style={{ color: C.textMuted }}>{message.snippet}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </Card>

            <Card className="p-4 border-t-4" style={{ borderTopColor: "#EA4335" }}>
              <SectionHeader title="Compose Gmail" />
              <div className="space-y-3">
                {connectedEmail && (
                  <div className="rounded-xl border px-3 py-2 text-xs font-semibold" style={{ borderColor: "#FCE8E6", background: "#FFF7F5", color: "#A50E0E" }}>
                    Sending from {connectedEmail}
                  </div>
                )}
                <Input placeholder="To" value={emailForm.to} onChange={to => setEmailForm(current => ({ ...current, to }))} />
                <Input placeholder="Cc" value={emailForm.cc} onChange={cc => setEmailForm(current => ({ ...current, cc }))} />
                <Input placeholder="Subject" value={emailForm.subject} onChange={subject => setEmailForm(current => ({ ...current, subject }))} />
                <textarea
                  value={emailForm.body}
                  onChange={event => setEmailForm(current => ({ ...current, body: event.target.value }))}
                  placeholder="Message"
                  className="w-full min-h-44 border bg-white text-sm outline-none px-3 py-2.5 resize-none"
                  style={{ borderColor: C.border, borderRadius: 10, color: C.textPrimary }}
                />
                <Btn className="w-full justify-center" icon={Send} onClick={() => void submitEmail()} disabled={busy === "email"}>
                  {busy === "email" ? "Sending" : "Send Email"}
                </Btn>
              </div>
            </Card>
          </div>
        )}

        {tab === "drive" && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-4">
            <Card className="p-4">
              <SectionHeader title="Recent Drive Files" action={<span className="text-xs font-bold" style={{ color: C.textMuted }}>{filteredFiles.length}</span>} />
              {overview.drive.error && <GoogleNotice tone="error" text={overview.drive.error} />}
              {!filteredFiles.length && !loading ? (
                <EmptyState icon={FolderOpen} title="No Drive files" description="Recent Drive files will appear here." />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {filteredFiles.map(file => (
                    <a
                      key={file.id}
                      href={file.webViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="border bg-white p-3 flex gap-3 transition-colors"
                      style={{ borderColor: C.border, borderRadius: 12, color: C.textPrimary }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E6F4EA", color: "#137333" }}>
                        <FileText size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black truncate">{file.name}</p>
                        <p className="text-xs mt-1" style={{ color: C.textMuted }}>{fileKind(file.mimeType)} - {formatDate(file.modifiedTime)}</p>
                      </div>
                      <ExternalLink size={14} style={{ color: C.textMuted }} />
                    </a>
                  ))}
                </div>
              )}
            </Card>

            <div className="space-y-4">
              <Card className="p-4">
                <SectionHeader title="Create Folder" />
                <div className="space-y-3">
                  <Input placeholder="Folder name" value={driveForm.folderName} onChange={folderName => setDriveForm(current => ({ ...current, folderName }))} />
                  <Btn className="w-full justify-center" icon={Plus} onClick={() => void submitFolder()} disabled={busy === "folder"}>
                    {busy === "folder" ? "Creating" : "Create Folder"}
                  </Btn>
                </div>
              </Card>

              <Card className="p-4">
                <SectionHeader title="Upload Note" />
                <div className="space-y-3">
                  <Input placeholder="File name" value={driveForm.noteName} onChange={noteName => setDriveForm(current => ({ ...current, noteName }))} />
                  <textarea
                    value={driveForm.noteContent}
                    onChange={event => setDriveForm(current => ({ ...current, noteContent: event.target.value }))}
                    placeholder="Note content"
                    className="w-full min-h-36 border bg-white text-sm outline-none px-3 py-2.5 resize-none"
                    style={{ borderColor: C.border, borderRadius: 10, color: C.textPrimary }}
                  />
                  <Btn className="w-full justify-center" icon={Upload} onClick={() => void submitNote()} disabled={busy === "note"}>
                    {busy === "note" ? "Uploading" : "Upload to Drive"}
                  </Btn>
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === "sheets" && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-4">
            <Card className="p-4">
              <SectionHeader title="Spreadsheets" action={<span className="text-xs font-bold" style={{ color: C.textMuted }}>{filteredSheets.length}</span>} />
              {overview.sheets.error && <GoogleNotice tone="error" text={overview.sheets.error} />}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredSheets.map(sheet => {
                  const active = sheetForm.spreadsheetId === sheet.id;
                  return (
                    <button
                      key={sheet.id}
                      onClick={() => setSheetForm(current => ({ ...current, spreadsheetId: sheet.id }))}
                      className="border bg-white p-3 text-left transition-colors"
                      style={{ borderColor: active ? "#0F9D58" : C.border, borderRadius: 12, background: active ? "#E6F4EA" : "#fff" }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#E6F4EA", color: "#0F9D58" }}>
                          <Table size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black truncate" style={{ color: C.textPrimary }}>{sheet.name}</p>
                          <p className="text-xs mt-1" style={{ color: C.textMuted }}>{formatDate(sheet.modifiedTime)}</p>
                        </div>
                        {sheet.webViewLink && (
                          <a href={sheet.webViewLink} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()} style={{ color: C.textMuted }}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t pt-4" style={{ borderColor: C.border }}>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <Input placeholder="Range" value={sheetForm.range} onChange={range => setSheetForm(current => ({ ...current, range }))} className="sm:w-40" />
                  <Btn variant="outline" icon={RefreshCw} onClick={() => void previewRows()} disabled={!sheetForm.spreadsheetId || busy === "preview"}>Preview Rows</Btn>
                </div>
                <div className="overflow-auto border" style={{ borderColor: C.border, borderRadius: 12 }}>
                  <table className="min-w-full text-xs">
                    <tbody>
                      {sheetRows.length ? sheetRows.slice(0, 10).map((row, rowIndex) => (
                        <tr key={rowIndex} className={cn(rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                          {Array.from({ length: Math.max(1, ...sheetRows.map(item => item.length)) }).map((_, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 border-r border-b whitespace-nowrap" style={{ borderColor: C.border, color: C.textSecondary }}>
                              {row[cellIndex] ?? ""}
                            </td>
                          ))}
                        </tr>
                      )) : (
                        <tr>
                          <td className="px-3 py-6 text-center" style={{ color: C.textMuted }}>No rows loaded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4">
                <SectionHeader title="Create Spreadsheet" />
                <div className="space-y-3">
                  <Input placeholder="Spreadsheet title" value={sheetForm.title} onChange={title => setSheetForm(current => ({ ...current, title }))} />
                  <Btn className="w-full justify-center" icon={Plus} onClick={() => void submitSpreadsheet()} disabled={busy === "spreadsheet"}>
                    {busy === "spreadsheet" ? "Creating" : "Create Spreadsheet"}
                  </Btn>
                </div>
              </Card>

              <Card className="p-4">
                <SectionHeader title="Append Row" />
                <div className="space-y-3">
                  <Input placeholder="Comma-separated values" value={sheetForm.values} onChange={values => setSheetForm(current => ({ ...current, values }))} />
                  <Btn className="w-full justify-center" icon={Plus} onClick={() => void appendRow()} disabled={!sheetForm.spreadsheetId || busy === "append"}>
                    {busy === "append" ? "Appending" : "Append Row"}
                  </Btn>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
