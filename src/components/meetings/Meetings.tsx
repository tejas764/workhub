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
import { hov, unhov } from "@/lib/ui-utils";
import { Avatar, Btn, Card, CategoryBadge, ChartCard, Drawer, EmptyState, FileTypeIcon, FilterBar, Input, Modal, NotifIcon, Pagination, PriorityBadge, ProgressBar, SectionHeader, Select, StatCard, StatusBadge, Tabs } from "@/components/ui";

export function MeetingsPage({
  role,
  meetings = [],
  facultyMembers = [],
  loading = false,
}: {
  role:Role;
  meetings?: Meeting[];
  facultyMembers?: FacultyMember[];
  loading?: boolean;
}) {
  const [tab, setTab] = useState("Upcoming");
  const [selected, setSelected] = useState<Meeting|null>(null);
  const [detailTab, setDetailTab] = useState("Agenda");
  const canCreate = role !== "faculty";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Meetings</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Schedule and manage department meetings</p>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" size="sm" icon={Calendar}>Calendar View</Btn>
          {canCreate && <Btn variant="primary" size="sm" icon={Plus}>Schedule Meeting</Btn>}
        </div>
      </div>
      <FilterBar>
        <Input placeholder="Search meetings..." icon={Search} className="flex-1 min-w-40" />
        <Select options={["All Departments","Computer Science","Electronics"]} />
        <Input placeholder="Date..." icon={Calendar} className="w-40" />
        <Select options={["All Status","Upcoming","Completed","Cancelled"]} />
      </FilterBar>
      <Tabs tabs={["Upcoming","Completed","Cancelled"]} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {meetings.filter(m=>m.status===tab).map(m=>(
          <Card key={m.id} className="p-5" onClick={()=>{ setSelected(m); setDetailTab("Agenda"); }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <StatusBadge status={m.status} />
              {canCreate && <button onClick={e=>e.stopPropagation()}><MoreHorizontal size={15} style={{color:C.textMuted}} /></button>}
            </div>
            <h3 className="text-sm font-bold mb-3 leading-snug" style={{color:C.textPrimary}}>{m.title}</h3>
            <div className="space-y-2">
              {[{icon:Calendar,val:`${m.date} · ${m.time}`},{icon:MapPin,val:m.location},{icon:Users,val:`${m.participants} participants`}].map(({icon:Icon,val})=>(
                <div key={val} className="flex items-center gap-2 text-xs" style={{color:C.textSecondary}}><Icon size={12} style={{color:C.blue200}} />{val}</div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{borderColor:C.border}}>
              <div className="flex items-center gap-2"><Avatar name={m.organizer} size="sm" /><p className="text-xs font-semibold" style={{color:C.textSecondary}}>{m.organizer}</p></div>
              {m.status==="Upcoming"&&canCreate&&<Btn variant="outline" size="sm">Manage</Btn>}
            </div>
          </Card>
        ))}
        {!loading && meetings.filter(m=>m.status===tab).length===0 && (
          <div className="col-span-3">
            <EmptyState icon={Video} title={`No ${tab} meetings`} description={`There are no ${tab.toLowerCase()} meetings.`}
              action={canCreate?<Btn variant="primary" icon={Plus}>Schedule Meeting</Btn>:undefined} />
          </div>
        )}
      </div>

      {selected && (
        <Drawer title="Meeting Details" onClose={()=>setSelected(null)} width="w-[580px]">
          <div className="pb-5 mb-5 border-b" style={{borderColor:C.border}}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-base font-black" style={{color:C.blue600}}>{selected.title}</h3>
              <StatusBadge status={selected.status} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{icon:Calendar,val:`${selected.date} · ${selected.time}`},{icon:MapPin,val:selected.location},{icon:Users,val:`${selected.participants} participants`},{icon:User,val:`By ${selected.organizer}`}].map(({icon:Icon,val})=>(
                <div key={val} className="flex items-center gap-2 text-xs" style={{color:C.textSecondary}}><Icon size={12} style={{color:C.blue200}} />{val}</div>
              ))}
            </div>
          </div>
          <Tabs tabs={["Agenda","Minutes","Decisions","Attendance","Action Items","Attachments"]} active={detailTab} onChange={setDetailTab} />
          {detailTab==="Agenda" && (
            <div className="space-y-2">
              {["Opening & Roll Call","Review of Previous Minutes","Curriculum Updates Discussion","Faculty Performance Metrics","Budget Utilization Report","Any Other Business"].map((item,i)=>(
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{background:C.bg}}>
                  <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0" style={{background:C.blue50,color:C.blue500}}>{i+1}</span>
                  <p className="text-sm flex-1" style={{color:C.textPrimary}}>{item}</p>
                  <p className="text-xs flex-shrink-0" style={{color:C.textMuted}}>{10+i*5} min</p>
                </div>
              ))}
            </div>
          )}
          {detailTab==="Attendance" && (
            <div className="space-y-2">
              {facultyMembers.slice(0,5).map(f=>(
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{borderColor:C.border}}>
                  <Avatar name={f.name} size="sm" />
                  <div className="flex-1"><p className="text-xs font-bold" style={{color:C.textPrimary}}>{f.name}</p><p className="text-[10px]" style={{color:C.textMuted}}>{f.designation}</p></div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{color:C.olive300}}>
                    <CheckCircle size={13} style={{color:C.olive300}} />Present
                  </div>
                </div>
              ))}

              {facultyMembers.length===0 && (
                <EmptyState icon={Users} title="No attendance records" description="Faculty records from Supabase will appear here." />
              )}
            </div>
          )}
          {["Minutes","Decisions","Action Items","Attachments"].includes(detailTab) && (
            <EmptyState icon={FileText} title={`No ${detailTab}`} description={`${detailTab} will appear here after the meeting.`} />
          )}
          {selected.status==="Upcoming"&&canCreate && (
            <div className="mt-5 flex gap-3">
              <Btn variant="primary" className="flex-1 justify-center">Start Meeting</Btn>
              <Btn variant="outline" className="flex-1 justify-center">Edit Details</Btn>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────

