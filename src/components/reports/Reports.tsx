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

export function ReportsPage() {
  const [period, setPeriod] = useState("Last 6 Months");
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Reports & Analytics</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Comprehensive department performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select options={["Last 7 Days","Last 30 Days","Last 6 Months","This Year"]} value={period} onChange={setPeriod} />
          <Btn variant="outline" size="sm" icon={Download}>Export PDF</Btn>
          <Btn variant="outline" size="sm" icon={Download}>Export Excel</Btn>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Avg. Faculty Workload" value="21.4 hrs" sub="↑ 8% vs. last period"  icon={Users}       iconBg={C.blue50}  iconColor={C.blue200}  />
        <StatCard label="Task Completion Rate"  value="76%"      sub="↑ 12% vs. last period" icon={CheckSquare} iconBg={C.olive50} iconColor={C.olive300} />
        <StatCard label="Meeting Efficiency"    value="84%"      sub="Agenda coverage rate"  icon={Video}       iconBg={C.sky50}   iconColor={C.sky300}   />
        <StatCard label="AI Queries"            value="234"      sub="This month"            icon={Brain}       iconBg={C.pink50}  iconColor={C.pink200}  />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Faculty Workload by Month (hrs/week)" action={<Btn variant="ghost" size="sm" icon={Download}>Export</Btn>}>
          <ResponsiveContainer width="100%" height={220}>
            <RBar data={workloadData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />
              <XAxis dataKey="month" tick={{fontSize:11,fill:C.textMuted}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:C.textMuted}} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:`1px solid ${C.border}`}} />
              <Bar dataKey="hours" fill={C.blue200} radius={[6,6,0,0]} />
            </RBar>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Task Completion vs Pending" action={<Btn variant="ghost" size="sm" icon={Download}>Export</Btn>}>
          <ResponsiveContainer width="100%" height={220}>
            <RArea data={taskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />
              <XAxis dataKey="month" tick={{fontSize:11,fill:C.textMuted}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:C.textMuted}} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:`1px solid ${C.border}`}} />
              <Area type="monotone" dataKey="completed" stroke={C.blue200} fill={C.blue50}  strokeWidth={2.5} name="Completed" />
              <Area type="monotone" dataKey="pending"   stroke={C.olive100} fill={C.olive50} strokeWidth={2}   name="Pending"   />
              <Legend iconType="line" iconSize={12} wrapperStyle={{fontSize:11}} />
            </RArea>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ChartCard title="Document Uploads by Month">
          <ResponsiveContainer width="100%" height={180}>
            <RLine data={uploadTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />
              <XAxis dataKey="month" tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{fontSize:10,borderRadius:10}} />
              <Line type="monotone" dataKey="docs" stroke={C.sky300} strokeWidth={2.5} dot={{r:3.5,fill:C.sky300}} />
            </RLine>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Meeting Activity">
          <ResponsiveContainer width="100%" height={180}>
            <RBar data={meetingData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />
              <XAxis dataKey="month" tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{fontSize:10,borderRadius:10}} />
              <Bar dataKey="meetings" fill={C.blue100} radius={[4,4,0,0]} />
            </RBar>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Dept. Faculty Distribution">
          <ResponsiveContainer width="100%" height={180}>
            <RPie>
              <Pie data={deptDistData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>
                {deptDistData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{fontSize:10,borderRadius:10}} />
            </RPie>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {deptDistData.map((d,i)=>(
              <div key={d.name} className="flex items-center gap-1.5 text-[10px]" style={{color:C.textSecondary}}>
                <div className="w-2 h-2 rounded-full" style={{background:CHART_COLORS[i]}} />{d.name}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
      <Card className="p-5">
        <SectionHeader title="Faculty Performance Summary" subtitle="Individual metrics for all faculty members" action={<Btn variant="outline" size="sm" icon={Download}>Export</Btn>} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`}}>
                {["Faculty","Department","Workload","Tasks","Completed","Meetings","Docs","Score"].map(h=>(
                  <th key={h} className="px-3 py-3 text-left text-xs font-black uppercase tracking-wide" style={{color:C.textMuted}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FACULTY_DATA.slice(0,6).map((f,i)=>(
                <tr key={f.id} style={{borderBottom:`1px solid ${C.bg}`}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.bg}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                  <td className="px-3 py-4"><div className="flex items-center gap-2"><Avatar name={f.name} size="sm" /><span className="text-sm font-bold" style={{color:C.textPrimary}}>{f.name}</span></div></td>
                  <td className="px-3 py-4 text-sm" style={{color:C.textSecondary}}>{f.department}</td>
                  <td className="px-3 py-4 text-sm font-semibold" style={{color:C.textPrimary}}>{18+i*2} hrs</td>
                  <td className="px-3 py-4 text-sm" style={{color:C.textSecondary}}>{4+i}</td>
                  <td className="px-3 py-4 text-sm" style={{color:C.textSecondary}}>{3+i}</td>
                  <td className="px-3 py-4 text-sm" style={{color:C.textSecondary}}>{6+i}</td>
                  <td className="px-3 py-4 text-sm" style={{color:C.textSecondary}}>{8+i}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2"><ProgressBar value={75+i*3} max={100} /><span className="text-xs font-black" style={{color:C.blue200}}>{75+i*3}%</span></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Department ───────────────────────────────────────────────────────────────

