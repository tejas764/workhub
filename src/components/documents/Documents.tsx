import React, { useState } from "react";
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

export function DocumentsPage({ documents = [], loading = false }: { documents?: DocItem[]; loading?: boolean }) {
  const [view, setView] = useState<"grid"|"list">("grid");
  const [selected, setSelected] = useState<DocItem|null>(null);
  const [aiMsg, setAiMsg] = useState("");
  const [chat, setChat] = useState<{from:"user"|"ai";text:string}[]>([]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Documents</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Department document repository</p>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" size="sm" icon={FolderOpen}>Browse Folders</Btn>
          <Btn variant="primary" size="sm" icon={Upload}>Upload Document</Btn>
        </div>
      </div>
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
                  <div className="flex justify-center mb-2"><CategoryBadge label={d.category} /></div>
                  <p className="text-[10px] text-center" style={{color:C.textMuted}}>{d.size} · {d.date}</p>
                  <div className="flex gap-1 mt-3">
                    {[Eye,Download,Trash2].map((Icon,i)=>(
                      <button key={i} className="flex-1 py-1.5 rounded-xl flex items-center justify-center"
                        onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                        <Icon size={12} style={{color:C.blue200}} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FileTypeIcon type={d.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{color:C.textPrimary}}>{d.title}</p>
                    <p className="text-xs" style={{color:C.textMuted}}>{d.category} · {d.uploadedBy} · {d.date}</p>
                  </div>
                  {d.hasSummary && <Sparkles size={13} style={{color:C.pink200}} />}
                  <p className="text-xs" style={{color:C.textMuted}}>{d.size}</p>
                  <div className="flex gap-1">
                    {[Eye,Download,Trash2].map((Icon,i)=>(
                      <button key={i} className="p-1.5 rounded-lg"
                        onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                        <Icon size={13} style={{color:C.blue200}} />
                      </button>
                    ))}
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
                <Btn variant="outline" size="sm" icon={Download}>Download</Btn>
                <Btn variant="outline" size="sm" icon={ExternalLink}>Open</Btn>
              </div>
            </div>
            <Card className="flex-1 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{background:C.bg,borderColor:C.border}}>
                <button style={{color:C.blue200}}><ChevronLeft size={16} /></button>
                <span className="text-xs" style={{color:C.textSecondary}}>Page 1 of 24</span>
                <button style={{color:C.blue200}}><ChevronRight size={16} /></button>
              </div>
              <div className="flex items-center justify-center bg-[#F8F9FA] min-h-64 p-8">
                <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8 space-y-3" style={{borderColor:C.border}}>
                  <div className="h-5 rounded-lg" style={{background:C.blue50, width:"70%"}} />
                  <div className="h-3 rounded-lg" style={{background:C.bg}} />
                  <div className="h-3 rounded-lg" style={{background:C.bg, width:"85%"}} />
                  <div className="h-6" />
                  <div className="h-3 rounded-lg" style={{background:C.border}} />
                  <div className="h-3 rounded-lg" style={{background:C.border, width:"72%"}} />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[...Array(6)].map((_,i)=><div key={i} className="h-16 rounded-xl" style={{background:C.bg}} />)}
                  </div>
                </div>
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
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={aiMsg} onChange={e=>setAiMsg(e.target.value)} placeholder="Ask a question..."
                  onKeyDown={e=>{if(e.key==="Enter"&&aiMsg.trim()){setChat(p=>[...p,{from:"user",text:aiMsg},{from:"ai",text:"Based on the document content, this relates to the updated curriculum structure for the upcoming academic year."}]);setAiMsg("");}}}
                  className="flex-1 text-xs border rounded-[10px] px-3 py-2 outline-none" style={{borderColor:C.border,background:C.bg}} />
                <button className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{background:C.blue200}}>
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


