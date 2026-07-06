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

export function FacultyPage({ role }: { role:Role }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selected, setSelected] = useState<FacultyMember|null>(null);
  const [detailTab, setDetailTab] = useState("Basic Info");
  const [pg, setPg] = useState(1);
  const isHOD = role === "hod";

  const filtered = FACULTY_DATA.filter(f=>{
    const q = search.toLowerCase();
    return (f.name.toLowerCase().includes(q)||f.email.toLowerCase().includes(q)) &&
      (deptFilter==="All Departments"||f.department===deptFilter) &&
      (roleFilter==="All Roles"||f.role===roleFilter) &&
      (statusFilter==="All Status"||f.status===statusFilter);
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>{isHOD?"Faculty Management":"Faculty Directory"}</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>{FACULTY_DATA.length} faculty members across 8 departments</p>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" size="sm" icon={Download}>Export</Btn>
          {isHOD && <Btn variant="primary" size="sm" icon={Plus}>Add Faculty</Btn>}
        </div>
      </div>
      <FilterBar>
        <Input placeholder="Search by name, email, or designation..." value={search} onChange={setSearch} icon={Search} className="flex-1 min-w-48" />
        <Select options={["All Departments","Computer Science","Electronics","Mathematics","Physics","Civil","Mechanical"]} value={deptFilter} onChange={setDeptFilter} />
        <Select options={["All Roles","HOD","Coordinator","Faculty"]} value={roleFilter} onChange={setRoleFilter} />
        <Select options={["All Status","Active","On Leave","Inactive"]} value={statusFilter} onChange={setStatusFilter} />
        <Btn variant="ghost" size="sm" icon={SlidersHorizontal}>Filters</Btn>
      </FilterBar>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                {["Faculty","Email","Designation","Department","Role","Status","Actions"].map(h=>(
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wide whitespace-nowrap" style={{color:C.textMuted}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((pg-1)*5,pg*5).map(f=>(
                <tr key={f.id} className="cursor-pointer" style={{borderBottom:`1px solid ${C.bg}`}}
                  onClick={()=>setSelected(f)}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.bg}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar name={f.name} size="sm" /><span className="text-sm font-bold" style={{color:C.textPrimary}}>{f.name}</span></div></td>
                  <td className="px-5 py-4 text-sm" style={{color:C.textSecondary}}>{f.email}</td>
                  <td className="px-5 py-4 text-sm" style={{color:C.textSecondary}}>{f.designation}</td>
                  <td className="px-5 py-4 text-sm" style={{color:C.textSecondary}}>{f.department}</td>
                  <td className="px-5 py-4"><CategoryBadge label={f.role} /></td>
                  <td className="px-5 py-4"><StatusBadge status={f.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg" onClick={e=>{e.stopPropagation();setSelected(f);}}
                        onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                        <Eye size={14} style={{color:C.blue200}} />
                      </button>
                      {isHOD && <>
                        <button className="p-1.5 rounded-lg" onClick={e=>e.stopPropagation()}
                          onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                          <Pencil size={14} style={{color:C.textSecondary}} />
                        </button>
                        <button className="p-1.5 rounded-lg" onClick={e=>e.stopPropagation()}
                          onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                          <MoreHorizontal size={14} style={{color:C.textSecondary}} />
                        </button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5"><Pagination current={pg} total={filtered.length} onChange={setPg} /></div>
      </Card>

      {selected && (
        <Drawer title={selected.name} onClose={()=>setSelected(null)} width="w-[520px]">
          <div className="flex items-center gap-4 pb-5 mb-5 border-b" style={{borderColor:C.border}}>
            <Avatar name={selected.name} size="xl" />
            <div className="flex-1">
              <h3 className="text-lg font-black" style={{color:C.blue600}}>{selected.name}</h3>
              <p className="text-sm" style={{color:C.textSecondary}}>{selected.designation}</p>
              <div className="flex gap-2 mt-2"><StatusBadge status={selected.status} /><CategoryBadge label={selected.role} /></div>
            </div>
            {isHOD && <div className="flex gap-2"><Btn variant="outline" size="sm" icon={Pencil}>Edit</Btn><Btn variant="ghost" size="sm"><MoreHorizontal size={14} /></Btn></div>}
          </div>
          <Tabs tabs={["Basic Info","Contact","Department","Tasks","Documents","Timeline"]} active={detailTab} onChange={setDetailTab} />
          {detailTab==="Basic Info" && (
            <div className="space-y-2">
              {[{label:"Full Name",val:selected.name},{label:"Designation",val:selected.designation},{label:"Employee ID",val:`EMP-${String(selected.id).padStart(4,"0")}`},{label:"Date of Joining",val:selected.joined},{label:"Department",val:selected.department},{label:"Role",val:selected.role}].map(({label,val})=>(
                <div key={label} className="flex justify-between py-2.5 border-b" style={{borderColor:C.bg}}>
                  <span className="text-sm" style={{color:C.textMuted}}>{label}</span>
                  <span className="text-sm font-bold" style={{color:C.textPrimary}}>{val}</span>
                </div>
              ))}
            </div>
          )}
          {detailTab==="Contact" && (
            <div className="space-y-3">
              {[{icon:Mail,label:"Email",val:selected.email},{icon:Phone,label:"Phone",val:selected.phone},{icon:MapPin,label:"Office",val:"Room 204, Dept. Block A"}].map(({icon:Icon,label,val})=>(
                <div key={label} className="flex items-center gap-3 p-3 rounded-2xl" style={{background:C.bg}}>
                  <Icon size={16} style={{color:C.blue200}} />
                  <div><p className="text-[10px] font-black uppercase" style={{color:C.textMuted}}>{label}</p><p className="text-sm font-semibold" style={{color:C.textPrimary}}>{val}</p></div>
                </div>
              ))}
            </div>
          )}
          {detailTab==="Tasks" && (
            <div className="space-y-2">
              {TASKS_DATA.filter(t=>t.assignee.includes(selected.name.split(" ").pop()!)).map(t=>(
                <div key={t.id} className="p-4 rounded-2xl border" style={{borderColor:C.border}}>
                  <div className="flex justify-between gap-2 mb-2"><p className="text-sm font-bold" style={{color:C.textPrimary}}>{t.title}</p><PriorityBadge priority={t.priority} /></div>
                  <div className="flex gap-3"><StatusBadge status={t.status} /><p className="text-xs" style={{color:C.textMuted}}>Due {t.dueDate}</p></div>
                </div>
              ))}
              {TASKS_DATA.filter(t=>t.assignee.includes(selected.name.split(" ").pop()!)).length===0 && (
                <EmptyState icon={CheckSquare} title="No tasks assigned" description="This faculty member has no active tasks." />
              )}
            </div>
          )}
          {["Department","Documents","Timeline"].includes(detailTab) && (
            <EmptyState icon={Layers} title={`${detailTab} details`} description={`Detailed ${detailTab.toLowerCase()} information will appear here.`} />
          )}
        </Drawer>
      )}
    </div>
  );
}

// ─── Announcements ────────────────────────────────────────────────────────────

