import React, { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard, Users, Bell, FileText, CheckSquare, Brain,
  BarChart2, Building2, Settings, HelpCircle, Megaphone, Video,
  BookOpen,
  ChevronLeft, ChevronRight, Search, Plus, Download, Upload,
  Eye, Trash2, MoreHorizontal, X, Menu, Lock, Calendar,
  Pin, Paperclip, MessageSquare, ChevronDown, LogOut, User,
  Shield, Send, Bot, ExternalLink, SortAsc, CheckCircle,
  GraduationCap, Mail, Phone, MapPin, Key, EyeOff, ArrowRight,
  UserCheck, Sparkles, FileUp, File, RefreshCw, Home, Pencil,
  List, Award, SlidersHorizontal, LayoutGrid, Layers,
  FolderOpen, Hash,
} from "lucide-react";
import {
  BarChart as RBar, Bar, LineChart as RLine, Line,
  PieChart as RPie, Pie, Cell, AreaChart as RArea, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { Announcement, AppPage, DocItem, FacultyMember, Meeting, NotifItem, Role, TaskItem } from "@/types";
import { C, CHART_COLORS } from "@/constants";
import { FACULTY_DATA, ANNOUNCEMENTS_DATA, MEETINGS_DATA, DOCUMENTS_DATA, TASKS_DATA, NOTIFICATIONS_DATA, workloadData, taskTrendData, uploadTrendData, meetingData, deptDistData } from "@/data";
import { cn, hov, unhov } from "@/lib/ui-utils";
import { Avatar, Btn, Card, CategoryBadge, ChartCard, Drawer, EmptyState, FileTypeIcon, FilterBar, Input, Modal, NotifIcon, Pagination, PriorityBadge, ProgressBar, SectionHeader, Select, StatCard, StatusBadge, Tabs } from "@/components/ui";
import { getDocumentDownloadUrl, getDocumentMetadataUrl, getDocumentViewUrl } from "@/services/document.service";
import type { RagSource } from "@/types/rag";

const documentTypeFromFile = (file: File) => {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "PDF";
  if (file.type.includes("word") || name.endsWith(".doc") || name.endsWith(".docx")) return "Word";
  if (file.type.includes("excel") || file.type.includes("spreadsheet") || name.endsWith(".xls") || name.endsWith(".xlsx")) return "Excel";
  if (file.type.includes("presentation") || name.endsWith(".ppt") || name.endsWith(".pptx")) return "PowerPoint";
  if (file.type.startsWith("image/")) return "Image";
  return "Document";
};

export function DocumentsPage({ documents = [], loading = false, departmentId, departmentName, onUploadDocument }: {
  documents?: DocItem[];
  loading?: boolean;
  departmentId?: string;
  departmentName?: string;
  onUploadDocument?: (file: File, metadata: { title: string; document_type: string; department_id: string }) => Promise<void>;
}) {
  const [view, setView] = useState<"grid"|"list">("grid");
  const [selected, setSelected] = useState<DocItem|null>(null);
  const [aiMsg, setAiMsg] = useState("");
  const [chat, setChat] = useState<{from:"user"|"ai";text:string;sources?:RagSource[]}[]>([]);
  const [documentChatLoading, setDocumentChatLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSelectedPdf = selected?.type === "pdf";
  const documentViewUrl = selected ? getDocumentViewUrl(String(selected.id)) : "";

  useEffect(() => {
    setChat([]);
    setAiMsg("");
  }, [selected?.id]);

  useEffect(() => {
    if (!selected || !isSelectedPdf) return;

    let cancelled = false;
    setCurrentPage(1);
    setPageCount(null);
    setPdfError("");
    setPdfLoading(true);

    void fetch(getDocumentMetadataUrl(String(selected.id)))
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Unable to load PDF metadata.");
        return payload as { pageCount?: number };
      })
      .then(payload => {
        if (!cancelled) setPageCount(payload.pageCount && payload.pageCount > 0 ? payload.pageCount : null);
      })
      .catch(error => {
        if (!cancelled) {
          setPdfLoading(false);
          setPdfError(error instanceof Error ? error.message : "Unable to load this PDF.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isSelectedPdf, selected]);

  const openDocument = (documentId: DocItem["id"]) => {
    window.open(getDocumentViewUrl(String(documentId)), "_blank", "noopener,noreferrer");
  };

  const downloadDocument = (documentId: DocItem["id"]) => {
    window.location.assign(getDocumentDownloadUrl(String(documentId)));
  };

  const handleUploadFile = async (file: File) => {
    if (!onUploadDocument) return;
    const uploadDepartmentId = departmentId?.trim() || departmentName?.trim() || "cse";

    setUploading(true);
    setUploadMessage("");

    try {
      await onUploadDocument(file, {
        title: file.name,
        document_type: documentTypeFromFile(file),
        department_id: uploadDepartmentId,
      });
      setUploadMessage("Document uploaded and saved.");
    } catch (error) {
      console.error("Document upload error:", error);
      setUploadMessage(error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed. Could not save document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sendDocumentMessage = async () => {
    const question = aiMsg.trim();
    if (!question || !selected || documentChatLoading) return;
    const nextChat = [...chat, { from: "user" as const, text: question }];
    setChat([...nextChat, { from: "ai", text: "Searching this document…" }]);
    setAiMsg("");
    setDocumentChatLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextChat, documentId: String(selected.id) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? "Unable to answer this question.");
      const sources = Array.isArray(payload.sources) ? payload.sources as RagSource[] : [];
      setChat([...nextChat, { from: "ai", text: payload.answer, sources }]);
    } catch (error) {
      setChat([...nextChat, { from: "ai", text: error instanceof Error ? `AI error: ${error.message}` : "AI error: Unable to answer this question." }]);
    } finally {
      setDocumentChatLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Documents</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Department document repository</p>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" size="sm" icon={FolderOpen}>Browse Folders</Btn>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={e=>{
              const file = e.target.files?.[0];
              if (file) void handleUploadFile(file);
            }}
          />

          <Btn
            variant="primary"
            size="sm"
            icon={uploading ? RefreshCw : Upload}
            disabled={uploading}
            onClick={()=>fileInputRef.current?.click()}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Btn>
        </div>
      </div>
      {uploadMessage && (
        <div className="mb-4 rounded-[10px] border px-3 py-2 text-xs font-semibold" style={{borderColor:C.border, background:C.bg, color:C.textSecondary}}>
          {uploadMessage}
        </div>
      )}

      <FilterBar>
        <Input placeholder="Search documents..." icon={Search} className="flex-1 min-w-40" />
        <Select options={["All Categories","Academic","Administrative","Accreditation","Research","Finance","HR","Facilities"]} />
        <Select options={["All Types","PDF","Word","Excel","PowerPoint"]} />
        <Select options={["Date: Newest First","Date: Oldest First","Name A–Z"]} />
        <div className="ml-auto flex border rounded-[10px] overflow-hidden" style={{borderColor:C.border}}>
          {[["grid",LayoutGrid],["list",List]].map(([v,Icon]:any)=>(
            <button key={v} onClick={()=>setView(v)} className="px-3 py-2"
              style={view===v?{background:C.blue500,color:"#fff"}:{background:"#fff",color:C.textMuted}}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </FilterBar>

      {!selected ? (
        <div className={cn(view==="grid"?"grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4":"space-y-3")}>
          {documents.map(d=>(
            <Card key={d.id} className="p-4" onClick={()=>setSelected(d)}>
              {view==="grid" ? (
                <div>
                  <div className="flex justify-center mb-4"><FileTypeIcon type={d.type} /></div>
                  {d.hasSummary && <div className="flex items-center justify-center gap-1 mb-2"><Sparkles size={10} style={{color:C.pink200}} /><span className="text-[10px] font-bold" style={{color:C.textMuted}}>AI Summary</span></div>}
                  <p className="text-xs font-bold text-center line-clamp-2 leading-tight mb-2" style={{color:C.textPrimary}}>{d.title}</p>
                  <div className="flex justify-center gap-1 mb-2"><CategoryBadge label={d.category} /><CategoryBadge label={d.department} /></div>

                  {d.summary && <p className="text-[10px] text-center line-clamp-2 mb-2" style={{color:C.textSecondary}}>{d.summary}</p>}
                  <p className="text-[10px] text-center" style={{color:C.textMuted}}>{d.size} · {d.date}</p>
                  <div className="flex gap-1 mt-3">
                    <button className="flex-1 py-1.5 rounded-xl flex items-center justify-center" onClick={event=>{event.stopPropagation(); setSelected(d);}} onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")} aria-label={`View ${d.title}`}><Eye size={12} style={{color:C.blue200}} /></button>
                    <button className="flex-1 py-1.5 rounded-xl flex items-center justify-center" onClick={event=>{event.stopPropagation(); downloadDocument(d.id);}} onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")} aria-label={`Download ${d.title}`}><Download size={12} style={{color:C.blue200}} /></button>
                    <button className="flex-1 py-1.5 rounded-xl flex items-center justify-center" onClick={event=>event.stopPropagation()} onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")} aria-label={`Delete ${d.title}`}><Trash2 size={12} style={{color:C.blue200}} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FileTypeIcon type={d.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{color:C.textPrimary}}>{d.title}</p>

                    {d.summary && <p className="text-xs truncate mt-1" style={{color:C.textSecondary}}>{d.summary}</p>}
                    <p className="text-xs" style={{color:C.textMuted}}>{d.category} · {d.uploadedBy} · {d.date}</p>
                  </div>
                  <CategoryBadge label={d.department} />

                  {d.hasSummary && <Sparkles size={13} style={{color:C.pink200}} />}
                  <p className="text-xs" style={{color:C.textMuted}}>{d.size}</p>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg" onClick={event=>{event.stopPropagation(); setSelected(d);}} onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")} aria-label={`View ${d.title}`}><Eye size={13} style={{color:C.blue200}} /></button>
                    <button className="p-1.5 rounded-lg" onClick={event=>{event.stopPropagation(); downloadDocument(d.id);}} onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")} aria-label={`Download ${d.title}`}><Download size={13} style={{color:C.blue200}} /></button>
                    <button className="p-1.5 rounded-lg" onClick={event=>event.stopPropagation()} onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")} aria-label={`Delete ${d.title}`}><Trash2 size={13} style={{color:C.blue200}} /></button>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {!loading && documents.length===0 && (
            <div className={cn(view==="grid" ? "col-span-full" : "")}>
              <EmptyState icon={FileText} title="No documents found" description="Documents from Supabase will appear here once records are available to this user." />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-260px)]">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button onClick={()=>setSelected(null)} className="flex items-center gap-2 text-sm font-bold hover:opacity-70" style={{color:C.blue200}}>
                <ChevronLeft size={16} />Back to Documents
              </button>
              <div className="ml-auto flex gap-2">
                <Btn variant="outline" size="sm" icon={Download} onClick={()=>downloadDocument(selected.id)}>Download</Btn>
                <Btn variant="outline" size="sm" icon={ExternalLink} onClick={()=>openDocument(selected.id)}>Open</Btn>
              </div>
            </div>
            <Card className="flex-1 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{background:C.bg,borderColor:C.border}}>
                <button onClick={()=>setCurrentPage(page=>Math.max(1, page-1))} disabled={!isSelectedPdf || currentPage === 1} style={{color:C.blue200}} aria-label="Previous page"><ChevronLeft size={16} /></button>
                <span className="text-xs" style={{color:C.textSecondary}}>Page {currentPage}{pageCount ? ` of ${pageCount}` : ""}</span>
                <button onClick={()=>setCurrentPage(page=>pageCount ? Math.min(pageCount, page+1) : page+1)} disabled={!isSelectedPdf || (pageCount !== null && currentPage >= pageCount)} style={{color:C.blue200}} aria-label="Next page"><ChevronRight size={16} /></button>
              </div>
              <div className="relative flex items-center justify-center bg-[#F8F9FA] min-h-64 flex-1">
                {!isSelectedPdf ? (
                  <p className="text-sm" style={{color:C.textSecondary}}>Preview is available for PDF documents only.</p>
                ) : pdfError ? (
                  <p className="text-sm px-8 text-center" style={{color:C.textSecondary}}>{pdfError}</p>
                ) : (
                  <>
                    {pdfLoading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F8F9FA]"><div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8 space-y-3" style={{borderColor:C.border}}><div className="h-5 rounded-lg" style={{background:C.blue50, width:"70%"}} /><div className="h-3 rounded-lg" style={{background:C.bg}} /><div className="h-3 rounded-lg" style={{background:C.bg, width:"85%"}} /><div className="h-6" /><div className="h-3 rounded-lg" style={{background:C.border}} /><div className="h-3 rounded-lg" style={{background:C.border, width:"72%"}} /></div></div>}
                    <iframe key={currentPage} title={`PDF preview for ${selected.title}`} src={`${documentViewUrl}#page=${currentPage}`} className="h-full min-h-64 w-full border-0" onLoad={()=>setPdfLoading(false)} onError={()=>{setPdfLoading(false);setPdfError("The PDF could not be displayed.");}} />
                  </>
                )}
              </div>
            </Card>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto">
            <Card className="p-4">
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Document Info</p>
              {[{label:"Title",val:selected.title},{label:"Category",val:selected.category},{label:"Uploaded by",val:selected.uploadedBy},{label:"Date",val:selected.date},{label:"Size",val:selected.size},{label:"Type",val:selected.type.toUpperCase()}].map(({label,val})=>(
                <div key={label} className="flex justify-between py-2 text-xs border-b last:border-0" style={{borderColor:C.bg}}>
                  <span style={{color:C.textMuted}}>{label}</span>
                  <span className="font-bold text-right max-w-32 truncate" style={{color:C.textPrimary}}>{val}</span>
                </div>
              ))}
            </Card>
            {selected.hasSummary && (
              <div className="rounded-2xl p-4 border" style={{background:C.sky50,borderColor:C.sky100}}>
                <div className="flex items-center gap-2 mb-2"><Sparkles size={13} style={{color:C.pink200}} /><p className="text-xs font-black" style={{color:C.sky500}}>AI Summary</p></div>
                <p className="text-xs leading-relaxed" style={{color:C.sky400}}>This document outlines the curriculum framework for 2026–27. Key changes include updated lab hours, new elective modules, and revised assessment patterns aligned with NEP 2020.</p>
              </div>
            )}
            <Card className="p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><Bot size={13} style={{color:C.sky300}} /><p className="text-xs font-black" style={{color:C.textPrimary}}>Chat with Document</p></div>
              <div className="flex-1 min-h-20 space-y-2 mb-3">
                {chat.length===0 && <p className="text-xs text-center py-4" style={{color:C.textDisabled}}>Ask anything about this document</p>}
                {chat.map((m,i)=>(
                  <div key={i} className={cn("text-xs rounded-xl px-3 py-2 max-w-[90%]",m.from==="user"?"ml-auto":"border")}
                    style={m.from==="user"?{background:C.blue500,color:"#fff"}:{background:C.bg,borderColor:C.border,color:C.textPrimary}}>
                    {m.text}
                    {m.from === "ai" && m.sources?.map(source => <div key={source.knowledgeItemId} className="mt-2 border-t pt-2" style={{borderColor:C.border}}><p className="font-bold">📄 {source.title}</p><p style={{color:C.textMuted}}>{source.pageNumber ? `Page ${source.pageNumber}` : `Chunk ${source.chunkIndex}`} · {Math.round(source.similarity * 100)}% relevance</p><p className="mt-1 line-clamp-2" style={{color:C.textSecondary}}>{source.excerpt}</p></div>)}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} placeholder="Ask a question..."
                  onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();void sendDocumentMessage();}}}
                  className="flex-1 text-xs border rounded-[10px] px-3 py-2 outline-none" style={{borderColor:C.border,background:C.bg}} />
                <button onClick={()=>void sendDocumentMessage()} disabled={documentChatLoading} className="w-8 h-8 rounded-[10px] flex items-center justify-center disabled:opacity-60" style={{background:C.blue200}}>
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tasks ────────────────────────────────────────────────────────────────────


