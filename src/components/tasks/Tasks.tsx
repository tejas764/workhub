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

export function TasksPage({ role }: { role:Role }) {
  const [tab, setTab] = useState("My Tasks");
  const [selected, setSelected] = useState<TaskItem|null>(null);
  const [comment, setComment] = useState("");
  const canCreate = role !== "faculty";
  const tabs = role==="faculty"?["My Tasks"]:["My Tasks","Department Tasks"];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Tasks</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Manage and track department tasks</p>
        </div>
        {canCreate && <Btn variant="primary" size="sm" icon={Plus}>Create Task</Btn>}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:"Total",      val:TASKS_DATA.length,                                     bg:C.bg,      color:C.textPrimary},
          {label:"In Progress",val:TASKS_DATA.filter(t=>t.status==="In Progress").length, bg:C.blue50,  color:C.blue500},
          {label:"Pending",    val:TASKS_DATA.filter(t=>t.status==="Pending").length,     bg:C.gray50,  color:C.gray400},
          {label:"Overdue",    val:TASKS_DATA.filter(t=>t.status==="Overdue").length,     bg:C.red50,   color:C.red300},
        ].map(({label,val,bg,color})=>(
          <Card key={label} className="p-4 text-center" style={{background:bg}}>
            <p className="text-2xl font-black" style={{color}}>{val}</p>
            <p className="text-xs font-semibold mt-0.5" style={{color}}>{label}</p>
          </Card>
        ))}
      </div>

      <FilterBar>
        <Input placeholder="Search tasks..." icon={Search} className="flex-1 min-w-40" />
        <Select options={["All Priorities","High","Medium","Low"]} />
        <Select options={["All Status","In Progress","Pending","Completed","Overdue"]} />
        <Input placeholder="Due date..." icon={Calendar} className="w-36" />
        {role!=="faculty"&&<Select options={["All Assignees",...FACULTY_DATA.map(f=>f.name)]} />}
      </FilterBar>

      {tabs.length>1 && <Tabs tabs={tabs} active={tab} onChange={setTab} />}

      <div className="space-y-2">
        {TASKS_DATA.map(t=>(
          <Card key={t.id} className="p-4" onClick={()=>setSelected(t)}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0">
                <div className="w-4 h-4 rounded border-2 flex items-center justify-center"
                  style={t.status==="Completed"?{background:C.olive300,borderColor:C.olive300}:{borderColor:C.border}}>
                  {t.status==="Completed"&&<CheckCircle size={10} className="text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className={cn("text-sm font-bold",t.status==="Completed"&&"line-through opacity-40")} style={{color:C.textPrimary}}>{t.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0"><PriorityBadge priority={t.priority} /><StatusBadge status={t.status} /></div>
                </div>
                <p className="text-xs mb-2 line-clamp-1" style={{color:C.textMuted}}>{t.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Avatar name={t.assignee} size="sm" /><span className="text-xs font-semibold" style={{color:C.textSecondary}}>{t.assignee}</span></div>
                  <span className="text-xs flex items-center gap-1" style={{color:C.textMuted}}><Calendar size={11} style={{color:C.blue200}} />Due {t.dueDate}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {canCreate && <button className="p-1.5 rounded-lg" onClick={e=>e.stopPropagation()}
                  onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                  <Pencil size={13} style={{color:C.blue200}} />
                </button>}
                <button className="p-1.5 rounded-lg" onClick={e=>e.stopPropagation()}
                  onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                  <MoreHorizontal size={13} style={{color:C.textMuted}} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <Drawer title="Task Details" onClose={()=>setSelected(null)} width="w-[560px]">
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-black" style={{color:C.blue600}}>{selected.title}</h3>
                <div className="flex gap-2 flex-shrink-0"><PriorityBadge priority={selected.priority} /><StatusBadge status={selected.status} /></div>
              </div>
              <p className="text-sm leading-relaxed" style={{color:C.textSecondary}}>{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{label:"Assignee",val:selected.assignee},{label:"Department",val:selected.department},{label:"Due Date",val:selected.dueDate},{label:"Priority",val:selected.priority}].map(({label,val})=>(
                <div key={label} className="rounded-2xl p-3" style={{background:C.bg}}>
                  <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{color:C.textMuted}}>{label}</p>
                  <p className="text-sm font-bold" style={{color:C.textPrimary}}>{val}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Timeline</p>
              <div className="space-y-3">
                {[{event:"Task Created",date:"Jun 15, 2026",by:"Dr. Anita Sharma"},{event:"Assigned",date:"Jun 16, 2026",by:"Prof. Rajan Mehta"},{event:"In Progress",date:"Jun 20, 2026",by:selected.assignee}].map((e,i)=>(
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:C.blue200}} />
                    <div><p className="font-bold" style={{color:C.textPrimary}}>{e.event}</p><p style={{color:C.textMuted}}>{e.date} · by {e.by}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Comments</p>
              <div className="space-y-3 mb-3">
                {[{who:"Prof. Rajan Mehta",msg:"Ensure all lab records are included.",time:"Jun 18"},{who:"Mr. Vikram Singh",msg:"Will complete by end of this week.",time:"Jun 19"}].map((c,i)=>(
                  <div key={i} className="flex gap-2.5">
                    <Avatar name={c.who} size="sm" />
                    <div className="flex-1 rounded-2xl p-3" style={{background:C.bg}}>
                      <div className="flex justify-between mb-1"><p className="text-xs font-bold" style={{color:C.textPrimary}}>{c.who}</p><p className="text-[10px]" style={{color:C.textMuted}}>{c.time}</p></div>
                      <p className="text-xs" style={{color:C.textSecondary}}>{c.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment..."
                  className="flex-1 text-xs border rounded-[10px] px-3 py-2 outline-none" style={{borderColor:C.border,background:C.bg}} />
                <button className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{background:C.blue200}}>
                  <Send size={12} className="text-white" />
                </button>
              </div>
            </div>
            {canCreate && (
              <div className="flex gap-3 pt-2 border-t" style={{borderColor:C.border}}>
                <Btn variant="primary" className="flex-1 justify-center">Update Status</Btn>
                <Btn variant="outline" className="flex-1 justify-center">Reassign</Btn>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
}

// ─── AI Knowledge ─────────────────────────────────────────────────────────────


