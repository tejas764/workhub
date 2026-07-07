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

export function AIKnowledgePage() {
  const [query, setQuery] = useState("");
  const [activeHistory, setActiveHistory] = useState(0);
  const [messages, setMessages] = useState<{from:"user"|"ai";text:string}[]>([
    {from:"ai", text:"Hello! I'm your WorkHub AI Knowledge Assistant. I can answer questions about department documents, announcements, meetings, and more. What would you like to know?"}
  ]);

  const suggested = ["Summarize this month's announcements","What are the pending task deadlines?","Generate minutes for the June 20 meeting","Who has the highest workload this month?","List all Academic category documents","What decisions were made in the budget meeting?"];
  const histories = [{title:"Faculty Workload Analysis",date:"Jun 29"},{title:"NAAC Document Review",date:"Jun 28"},{title:"Task Deadline Summary",date:"Jun 27"},{title:"Meeting Minutes Request",date:"Jun 25"},{title:"Announcement Summary",date:"Jun 24"}];

  const sendMsg = () => {
    if(!query.trim()) return;
    setMessages(p=>[...p,
      {from:"user",text:query},
      {from:"ai",text:`Based on the department knowledge base, here's what I found regarding "${query}": The relevant records indicate this relates to ongoing department activities. I've cross-referenced 3 documents, 2 meetings, and 5 tasks. Confidence: 92%.`}
    ]);
    setQuery("");
  };

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Left */}
      <div className="w-64 border-r bg-white flex flex-col flex-shrink-0" style={{borderColor:C.border}}>
        <div className="p-4 border-b" style={{borderColor:C.border}}>
          <Btn variant="primary" size="sm" className="w-full justify-center" icon={Plus}>New Conversation</Btn>
        </div>
        <div className="p-4 border-b" style={{borderColor:C.border}}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{color:C.textDisabled}}>Recent Conversations</p>
          <div className="space-y-1">
            {histories.map((h,i)=>(
              <button key={i} onClick={()=>setActiveHistory(i)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold"
                style={i===activeHistory?{background:C.blue500,color:"#fff"}:{color:C.textSecondary}}
                onMouseEnter={e=>{ if(i!==activeHistory) hov(e.currentTarget,C.blue50,C.blue500); }}
                onMouseLeave={e=>{ if(i!==activeHistory) unhov(e.currentTarget,"transparent",C.textSecondary); }}>
                <p className="font-bold truncate">{h.title}</p>
                <p className="text-[10px] mt-0.5 opacity-60">{h.date}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{color:C.textDisabled}}>Suggested Questions</p>
          <div className="space-y-2">
            {suggested.map((s,i)=>(
              <button key={i} onClick={()=>setQuery(s)}
                className="w-full text-left text-xs font-medium px-3 py-2.5 rounded-xl border leading-snug"
                style={{borderColor:C.border,color:C.textSecondary}}
                onMouseEnter={e=>{ hov(e.currentTarget,C.blue50); (e.currentTarget as HTMLElement).style.borderColor=C.blue200; }}
                onMouseLeave={e=>{ unhov(e.currentTarget,"transparent"); (e.currentTarget as HTMLElement).style.borderColor=C.border; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col" style={{background:C.bg}}>
        <div className="p-4 bg-white border-b flex items-center gap-3" style={{borderColor:C.border}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:`linear-gradient(135deg,${C.blue600},${C.blue400})`}}>
            <Brain size={17} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black" style={{color:C.blue600}}>WorkHub AI Knowledge Assistant</p>
            <p className="text-xs" style={{color:C.textMuted}}>Powered by {DOCUMENTS_DATA.length} docs · {MEETINGS_DATA.length} meetings · {ANNOUNCEMENTS_DATA.length} announcements</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Btn variant="ghost" size="sm" icon={RefreshCw}>Clear</Btn>
            <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m,i)=>(
            <div key={i} className={cn("flex gap-3",m.from==="user"?"flex-row-reverse":"flex-row")}>
              {m.from==="ai"
                ? <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`linear-gradient(135deg,${C.blue600},${C.blue300})`}}><Bot size={14} className="text-white" /></div>
                : <Avatar name="Current User" size="sm" className="flex-shrink-0" />
              }
              <div className="max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
                style={m.from==="user"?{background:C.blue500,color:"#fff"}:{background:"#fff",border:`1px solid ${C.border}`,color:C.textPrimary}}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t" style={{borderColor:C.border}}>
          <div className="flex gap-3 items-end">
            <div className="flex-1 border rounded-2xl flex items-end gap-2 px-4 py-3" style={{borderColor:C.border}}>
              <textarea value={query} onChange={e=>setQuery(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMsg(); }}}
                placeholder="Ask anything about your department knowledge..."
                className="flex-1 text-sm bg-transparent outline-none resize-none max-h-32" rows={1} style={{color:C.textPrimary}} />
              <button className="flex-shrink-0"><Paperclip size={15} style={{color:C.textMuted}} /></button>
            </div>
            <button onClick={sendMsg} className="w-11 h-11 rounded-2xl flex items-center justify-center hover:opacity-90"
              style={{background:`linear-gradient(135deg,${C.blue600},${C.blue200})`}}>
              <Send size={17} className="text-white" />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2" style={{color:C.textDisabled}}>AI may make mistakes. Verify important information from source documents.</p>
        </div>
      </div>

      {/* Right */}
      <div className="w-72 border-l bg-white flex flex-col flex-shrink-0 overflow-y-auto" style={{borderColor:C.border}}>
        <div className="p-4 border-b" style={{borderColor:C.border}}>
          <p className="text-xs font-black" style={{color:C.textPrimary}}>Knowledge Sources</p>
          <p className="text-[10px] mt-0.5" style={{color:C.textMuted}}>Referenced in this conversation</p>
        </div>
        <div className="p-4 border-b" style={{borderColor:C.border}}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold" style={{color:C.textPrimary}}>Response Confidence</p>
            <span className="text-xs font-black" style={{color:C.blue200}}>92%</span>
          </div>
          <ProgressBar value={92} max={100} color={C.blue200} />
          <p className="text-[10px] mt-1.5" style={{color:C.textMuted}}>Based on 3 high-confidence sources</p>
        </div>
        <div className="p-4 border-b" style={{borderColor:C.border}}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{color:C.textDisabled}}>Referenced Documents</p>
          <div className="space-y-2">
            {DOCUMENTS_DATA.slice(0,3).map(d=>(
              <div key={d.id} className="flex items-center gap-2 p-2 rounded-xl cursor-pointer"
                onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                <FileTypeIcon type={d.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate" style={{color:C.textPrimary}}>{d.title}</p>
                  <p className="text-[10px]" style={{color:C.textMuted}}>{d.category}</p>
                </div>
                <Download size={11} style={{color:C.blue200}} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-b" style={{borderColor:C.border}}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{color:C.textDisabled}}>Referenced Meetings</p>
          <div className="space-y-2">
            {MEETINGS_DATA.slice(0,2).map(m=>(
              <div key={m.id} className="p-2 rounded-xl cursor-pointer"
                onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                <p className="text-xs font-bold line-clamp-1" style={{color:C.textPrimary}}>{m.title}</p>
                <p className="text-[10px]" style={{color:C.textMuted}}>{m.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{color:C.textDisabled}}>AI Highlights</p>
          <div className="space-y-2">
            {ANNOUNCEMENTS_DATA.slice(0,2).map(a=>(
              <div key={a.id} className="p-3 rounded-xl border cursor-pointer" style={{background:C.pink50,borderColor:C.pink100}}>
                <div className="flex items-center gap-1 mb-1"><Sparkles size={9} style={{color:C.pink200}} /><span className="text-[9px] font-black uppercase" style={{color:C.pink400}}>AI Highlight</span></div>
                <p className="text-xs font-bold line-clamp-2" style={{color:C.pink400}}>{a.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────


