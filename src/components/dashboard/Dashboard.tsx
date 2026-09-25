import React, { useState } from "react";
import {
  LayoutDashboard, Users, Bell, FileText, CheckSquare, Brain,
  BarChart2, Building2, Settings, HelpCircle, Megaphone, Video,
  BookOpen, ChevronLeft, ChevronRight, Search, Plus, Download, Upload,
  Eye, Trash2, MoreHorizontal, X, Menu, Lock, Calendar,
  Pin, Paperclip, MessageSquare, ChevronDown, LogOut, User,
  Shield, Send, Bot, ExternalLink, SortAsc, CheckCircle,
  GraduationCap, Mail, Phone, MapPin, Key, EyeOff, ArrowRight,
  UserCheck, Sparkles, FileUp, File, RefreshCw, Home, Pencil,
  List, Award, SlidersHorizontal, LayoutGrid, Layers,
  FolderOpen, Hash, Clock, AlertCircle, ArrowUpRight, CheckCircle2,
} from "lucide-react";
import {
  BarChart as RBar, Bar, LineChart as RLine, Line,
  PieChart as RPie, Pie, Cell, AreaChart as RArea, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { Announcement, AppPage, DocItem, FacultyMember, Meeting, NotifItem, Role, TaskItem } from "@/types";
import type { HODDashboardData } from "@/services/dashboard.service";
import { C, CHART_COLORS } from "@/constants";
import { FACULTY_DATA, ANNOUNCEMENTS_DATA, MEETINGS_DATA, DOCUMENTS_DATA, TASKS_DATA, NOTIFICATIONS_DATA, workloadData, taskTrendData, uploadTrendData, meetingData, deptDistData } from "@/data";
import { cn, hov, unhov } from "@/lib/ui-utils";
import { Avatar, Btn, Card, CategoryBadge, ChartCard, Drawer, EmptyState, FileTypeIcon, FilterBar, Input, Modal, NotifIcon, Pagination, PriorityBadge, ProgressBar, SectionHeader, Select, StatCard, StatusBadge, Tabs } from "@/components/ui";

export function HODDashboard({
  onPage,
  currentFaculty,
  dashboardData,
  dashboardLoading = false,
  dashboardError,
  onRefreshDashboard,
}: {
  onPage:(p:AppPage)=>void;
  currentFaculty:FacultyMember;
  dashboardData?: HODDashboardData | null;
  dashboardLoading?: boolean;
  dashboardError?: string | null;
  onRefreshDashboard?: () => void | Promise<void>;
}) {
  const stats = dashboardData?.stats;
  const workload = dashboardData?.workloadData ?? [];
  const taskTrend = dashboardData?.taskTrendData ?? [];
  const uploadTrend = dashboardData?.uploadTrendData ?? [];
  const departmentDistribution = dashboardData?.deptDistData ?? [];
  const recentAnnouncements = dashboardData?.recentAnnouncements ?? [];
  const upcomingMeetings = dashboardData?.upcomingMeetings ?? [];
  const insights = dashboardData?.insights ?? [];
  const todayLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (

    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Good morning, {currentFaculty.name}</h1>

          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>{todayLabel} · {currentFaculty.department} Department</p>

        </div>

        <div className="flex gap-3">

          <Btn variant="outline" size="sm" icon={RefreshCw} onClick={()=>void onRefreshDashboard?.()}>{dashboardLoading ? "Refreshing" : "Refresh"}</Btn>

          <Btn variant="primary" size="sm" icon={Plus}>Quick Action</Btn>

        </div>

      </div>



      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">

        <StatCard label="Total Faculty"     value={stats?.totalFaculty ?? 0}  sub={`Across ${stats?.departments ?? 0} depts`}   icon={Users}       iconBg={C.blue50}  iconColor={C.blue200}  />

        <StatCard label="Departments"       value={stats?.departments ?? 0}   sub="Active this sem"  icon={Building2}   iconBg={C.blue50}  iconColor={C.blue200}  />

        <StatCard label="Active Tasks"      value={stats?.activeTasks ?? 0}  sub={`${stats?.highPriorityTasks ?? 0} high priority`}  icon={CheckSquare} iconBg={C.olive50} iconColor={C.olive300} />

        <StatCard label="Pending Approvals" value={stats?.pendingApprovals ?? 0}   sub="Needs review"     icon={UserCheck}   iconBg={C.red50}   iconColor={C.red300}   />

        <StatCard label="Meetings Today"    value={stats?.meetingsToday ?? 0}   sub={`Next: ${stats?.nextMeetingTime ?? "None"}`}   icon={Video}       iconBg={C.sky50}   iconColor={C.sky300}   />

        <StatCard label="Documents"         value={stats?.documents ?? 0} sub={`${stats?.documentsThisWeek ?? 0} new this week`} icon={FileText}    iconBg={C.blue50}  iconColor={C.blue200}  />

        <StatCard label="Announcements"     value={stats?.announcements ?? 0}  sub={`${stats?.pinnedAnnouncements ?? 0} pinned`}         icon={Megaphone}   iconBg={C.sky50}   iconColor={C.sky300}   />

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">

        <ChartCard title="Faculty Workload (hrs/week)">

          <ResponsiveContainer width="100%" height={140}>

            <RBar data={workload} barSize={20}>

              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />

              <XAxis dataKey="month" tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} />

              <YAxis tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} width={24} />

              <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:`1px solid ${C.border}`}} />

              <Bar dataKey="hours" fill={C.blue200} radius={[6,6,0,0]} />

            </RBar>

          </ResponsiveContainer>

        </ChartCard>

        <ChartCard title="Task Completion Trend">

          <ResponsiveContainer width="100%" height={140}>

            <RLine data={taskTrend}>

              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />

              <XAxis dataKey="month" tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} />

              <YAxis tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} width={24} />

              <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:`1px solid ${C.border}`}} />

              <Line type="monotone" dataKey="completed" stroke={C.blue200} strokeWidth={2.5} dot={{r:3,fill:C.blue200}} />

              <Line type="monotone" dataKey="pending" stroke={C.olive100} strokeWidth={2} strokeDasharray="4 4" dot={{r:3,fill:C.olive100}} />

            </RLine>

          </ResponsiveContainer>

        </ChartCard>

        <ChartCard title="Document Upload Trends">

          <ResponsiveContainer width="100%" height={140}>

            <RArea data={uploadTrend}>

              <CartesianGrid strokeDasharray="3 3" stroke={C.bg} vertical={false} />

              <XAxis dataKey="month" tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} />

              <YAxis tick={{fontSize:10,fill:C.textMuted}} axisLine={false} tickLine={false} width={24} />

              <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:`1px solid ${C.border}`}} />

              <Area type="monotone" dataKey="docs" stroke={C.sky300} fill={C.sky50} strokeWidth={2} />

            </RArea>

          </ResponsiveContainer>

        </ChartCard>

        <ChartCard title="Dept. Distribution">

          <ResponsiveContainer width="100%" height={140}>

            <RPie>

              <Pie data={departmentDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={3}>

                {departmentDistribution.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}

              </Pie>

              <Tooltip contentStyle={{fontSize:10,borderRadius:10,border:`1px solid ${C.border}`}} />

            </RPie>

          </ResponsiveContainer>

        </ChartCard>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="p-5">

          <SectionHeader title="Recent Announcements" action={

            <button onClick={()=>onPage("announcements")} className="flex items-center gap-1 text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>View all <ArrowRight size={12} /></button>

          } />

          <div className="space-y-3">

            {recentAnnouncements.map(a=>(

              <div key={a.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0" style={{borderColor:C.bg}}>

                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:C.blue50}}>

                  <Megaphone size={13} style={{color:C.blue200}} />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-1.5 mb-0.5">

                    <p className="text-xs font-bold truncate" style={{color:C.textPrimary}}>{a.title}</p>

                    {a.pinned && <Pin size={10} style={{color:C.blue200}} className="flex-shrink-0" />}

                  </div>

                  <p className="text-[10px]" style={{color:C.textMuted}}>{a.category} · {a.date}</p>

                </div>

              </div>

            ))}

            {!dashboardLoading && recentAnnouncements.length===0 && (
              <EmptyState icon={Megaphone} title="No announcements yet" description="Announcements from Supabase will appear here." />
            )}

          </div>

        </Card>



        <Card className="p-5">

          <SectionHeader title="Upcoming Meetings" action={

            <button onClick={()=>onPage("meetings")} className="flex items-center gap-1 text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>View all <ArrowRight size={12} /></button>

          } />

          <div className="space-y-3">

            {upcomingMeetings.map(m=>(

              <div key={m.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0" style={{borderColor:C.bg}}>

                <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border" style={{background:C.bg,borderColor:C.border}}>

                  <p className="text-[11px] font-black" style={{color:C.blue500}}>{m.date.slice(8)}</p>

                  <p className="text-[9px]" style={{color:C.textMuted}}>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m.date.slice(5,7))-1]}</p>

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-bold mb-0.5 line-clamp-1" style={{color:C.textPrimary}}>{m.title}</p>

                  <p className="text-[10px]" style={{color:C.textMuted}}>{m.time} · {m.location}</p>

                </div>

              </div>

            ))}

            {!dashboardLoading && upcomingMeetings.length===0 && (
              <EmptyState icon={Video} title="No upcoming meetings" description="Meetings from Supabase will appear here." />
            )}

          </div>

        </Card>



        <div className="space-y-4">

          <Card className="p-5">

            <SectionHeader title="Pending Approvals" />

            <EmptyState icon={CheckCircle} title="No pending approvals" description="Approval requests will appear here when they are assigned to you." />

          </Card>

          <div className="rounded-2xl p-5 border" style={{background:`linear-gradient(135deg,${C.blue600},${C.blue500})`, borderColor:C.blue600}}>

            <div className="flex items-center gap-2 mb-3">

              <Sparkles size={14} style={{color:C.pink200}} />

              <p className="text-sm font-bold text-white">AI Insights</p>

              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-black" style={{background:C.pink50,color:C.pink400}}>Live</span>

            </div>

            <div className="space-y-1.5">
              {dashboardError ? (
                <p className="text-xs leading-relaxed" style={{color:C.blue100}}>Some dashboard data could not be loaded. Try refreshing after checking Supabase table access.</p>
              ) : insights.length ? (
                insights.slice(0,4).map((insight, index) => (
                  <p key={index} className="text-xs leading-relaxed" style={{color:C.blue100}}>· {insight}</p>
                ))
              ) : (
                <p className="text-xs leading-relaxed" style={{color:C.blue100}}>Insights will appear after department activity data is available.</p>
              )}
            </div>

          </div>

        </div>

      </div>



      <Card className="p-5">

        <SectionHeader title="Department Activity Feed" subtitle="Real-time actions across all departments" action={<Btn variant="ghost" size="sm">View all</Btn>} />

        <EmptyState icon={Bell} title="No activity yet" description="Recent department actions will appear here once real records are available." />

      </Card>

    </div>

  );

}



// ─── Coordinator Dashboard ───────────────────────────────────────────────────

export function CoordinatorDashboard({ onPage, currentFaculty }: { onPage:(p:AppPage)=>void; currentFaculty:FacultyMember }) {
  const currentDate = new Date();
  
  const todayDateString = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(currentDate);

  const todayShortDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(currentDate);

  const todayScheduleItems = [
    { time: "09:00 AM", title: "Faculty Sync — Quick Standup", type: "meeting", done: true, priority: "normal" },
    { time: "10:30 AM", title: "Review NAAC Document Submissions", type: "task", done: false, priority: "high" },
    { time: "02:00 PM", title: "Research Committee Meeting", type: "meeting", done: false, priority: "normal" },
    { time: "04:00 PM", title: "Submit Q2 Performance Reports", type: "task", done: false, priority: "urgent" },
  ];

  const aiRecommendations = [
    {
      id: 1,
      title: "2 High-Priority Schedule Tasks",
      desc: "NAAC Docs & Q2 Reports are due today. Prioritize completing NAAC review first.",
      tag: "Schedule Risk",
      type: "warning",
      action: "Review Tasks"
    },
    {
      id: 2,
      title: "Meeting Conflict Detected",
      desc: "Research Committee meeting overlaps with 3 faculty office hours at 02:00 PM.",
      tag: "Conflict",
      type: "info",
      action: "Reschedule"
    },
    {
      id: 3,
      title: "5 Pending Documents AI Summary",
      desc: "Faculty uploads are ready for quick automated review.",
      tag: "Automation",
      type: "success",
      action: "View Docs"
    }
  ];

  return (

    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Good morning, {currentFaculty.name}</h1>

          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>{todayDateString} · {currentFaculty.department} · Department Coordinator</p>

        </div>

        <div className="flex gap-3">

          <Btn variant="outline" size="sm" icon={Plus} onClick={()=>onPage("announcements")}>New Announcement</Btn>

          <Btn variant="primary" size="sm" icon={Video} onClick={()=>onPage("meetings")}>Schedule Meeting</Btn>

        </div>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard label="Assigned Tasks" value={18} sub="4 overdue"     icon={CheckSquare} iconBg={C.red50}   iconColor={C.red300}   />

        <StatCard label="My Meetings"    value={5}  sub="2 this week"   icon={Video}       iconBg={C.sky50}   iconColor={C.sky300}   />

        <StatCard label="My Documents"   value={34} sub="3 new uploads" icon={FileText}    iconBg={C.blue50}  iconColor={C.blue200}  />

        <StatCard label="Announcements"  value={8}  sub="2 from me"     icon={Megaphone}   iconBg={C.olive50} iconColor={C.olive300} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="p-5 flex flex-col justify-between">

          <div>
            <SectionHeader title="Today's Schedule" subtitle={todayShortDate} />

            <div className="space-y-3 mt-4">

              {todayScheduleItems.map((item,i)=>(

                <div key={i} className={cn("flex gap-3 items-center p-2.5 rounded-xl transition-all border", item.done ? "bg-slate-50 border-transparent opacity-50" : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm")}>

                  <span className="text-[11px] font-mono font-bold w-16 flex-shrink-0 px-2 py-1 rounded-md text-center" style={{background: item.done ? C.bg : C.blue50, color: item.done ? C.textMuted : C.blue600}}>
                    {item.time}
                  </span>

                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: item.done ? C.textMuted : item.type==="meeting" ? C.blue200 : C.olive300}} />

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-semibold truncate", item.done && "line-through")} style={{color: C.textPrimary}}>{item.title}</p>
                    <span className="text-[10px] capitalize" style={{color: C.textMuted}}>{item.type}</span>
                  </div>

                  {item.done ? (
                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  ) : item.priority === "urgent" ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-red-600 bg-red-50 border border-red-100 flex-shrink-0">Urgent</span>
                  ) : null}

                </div>

              ))}

            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{borderColor: C.border}}>
            <span className="text-slate-500 font-medium">4 items total</span>
            <button onClick={() => onPage("tasks")} className="font-bold flex items-center gap-1 hover:underline" style={{color: C.blue200}}>
              Manage Agenda <ArrowRight size={12} />
            </button>
          </div>

        </Card>

        <Card className="p-5">

          <SectionHeader title="Team Tasks" action={

            <button onClick={()=>onPage("tasks")} className="text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>View all</button>

          } />

          <div className="space-y-3">

            {TASKS_DATA.slice(0,5).map(t=>(

              <div key={t.id} className="flex items-center gap-3">

                <Avatar name={t.assignee} size="sm" />

                <div className="flex-1 min-w-0">

                  <p className="text-xs font-bold truncate" style={{color:C.textPrimary}}>{t.title}</p>

                  <p className="text-[10px]" style={{color:C.textMuted}}>Due {t.dueDate}</p>

                </div>

                <StatusBadge status={t.status} />

              </div>

            ))}

          </div>

        </Card>

        <div className="space-y-4">

          <Card className="p-5">

            <SectionHeader title="Recent Uploads" action={

              <button onClick={()=>onPage("documents")} className="text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>All docs</button>

            } />

            <div className="space-y-2">

              {DOCUMENTS_DATA.slice(0,4).map(d=>(

                <div key={d.id} className="flex items-center gap-2.5 py-1.5">

                  <FileTypeIcon type={d.type} />

                  <div className="min-w-0">

                    <p className="text-xs font-bold truncate" style={{color:C.textPrimary}}>{d.title}</p>

                    <p className="text-[10px]" style={{color:C.textMuted}}>{d.size} · {d.date}</p>

                  </div>

                </div>

              ))}

            </div>

          </Card>

          <div className="rounded-2xl p-4.5 border shadow-sm transition-all relative overflow-hidden" style={{background: "linear-gradient(180deg, #F0F7FF 0%, #E6F0FA 100%)", borderColor: "#BDD8F8"}}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600 text-white shadow-sm">
                  <Sparkles size={14} />
                </div>
                <div>
                  <p className="text-xs font-black tracking-wide uppercase" style={{color: C.blue600}}>AI Schedule Advisor</p>
                  <p className="text-[10px] text-slate-500">Smart schedule optimization</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 border border-blue-200">
                Live Analysis
              </span>
            </div>

            <div className="space-y-2.5">
              {aiRecommendations.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-white/90 border border-blue-100/80 shadow-xs hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-bold leading-snug" style={{color: C.textPrimary}}>{item.title}</p>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0",
                      item.type === "warning" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      item.type === "info" ? "bg-sky-50 text-sky-700 border border-sky-200" :
                      "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    )}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-2" style={{color: C.textSecondary}}>{item.desc}</p>
                  <div className="flex justify-end">
                    <button onClick={()=>onPage("tasks")} className="text-[10px] font-bold flex items-center gap-1 hover:underline" style={{color: C.blue500}}>
                      {item.action} <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}



// ─── Faculty Dashboard ───────────────────────────────────────────────────────

export function FacultyDashboard({ onPage, currentFaculty }: { onPage:(p:AppPage)=>void; currentFaculty:FacultyMember }) {

  return (

    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Good morning, {currentFaculty.name}</h1>

          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>{new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())} · {currentFaculty.role} · {currentFaculty.department}</p>

        </div>

        <Btn variant="outline" size="sm" icon={Upload} onClick={()=>onPage("documents")}>Upload Document</Btn>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard label="My Tasks"      value={6}  sub="2 overdue"        icon={CheckSquare} iconBg={C.red50}   iconColor={C.red300}   />

        <StatCard label="Meetings"      value={3}  sub="Next: Jul 3"      icon={Video}       iconBg={C.sky50}   iconColor={C.sky300}   />

        <StatCard label="Notices"       value={5}  sub="2 unread"         icon={Megaphone}   iconBg={C.blue50}  iconColor={C.blue200}  />

        <StatCard label="My Documents"  value={12} sub="1 uploaded today" icon={FileText}    iconBg={C.olive50} iconColor={C.olive300} />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="p-5 lg:col-span-2">

          <SectionHeader title="My Assigned Tasks" action={

            <button onClick={()=>onPage("tasks")} className="text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>View all</button>

          } />

          <div className="space-y-3">

            {TASKS_DATA.filter(t=>t.assignee===currentFaculty.name).map(t=>(

              <div key={t.id} className="p-4 rounded-2xl border" style={{background:C.bg,borderColor:C.border}}>

                <div className="flex items-start justify-between gap-3 mb-2">

                  <p className="text-sm font-bold" style={{color:C.textPrimary}}>{t.title}</p>

                  <PriorityBadge priority={t.priority} />

                </div>

                <div className="flex items-center gap-4">

                  <p className="text-xs flex items-center gap-1" style={{color:C.textMuted}}><Calendar size={11} style={{color:C.blue200}} /> Due {t.dueDate}</p>

                  <StatusBadge status={t.status} />

                </div>

              </div>

            ))}

          </div>

        </Card>

        <div className="space-y-4">

          <Card className="p-5">

            <SectionHeader title="Upcoming Meetings" action={

              <button onClick={()=>onPage("meetings")} className="text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>All</button>

            } />

            <div className="space-y-3">

              {MEETINGS_DATA.filter(m=>m.status==="Upcoming").slice(0,3).map(m=>(

                <div key={m.id} className="flex gap-3 pb-2.5 border-b last:border-0" style={{borderColor:C.bg}}>

                  <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{background:C.blue50}}>

                    <p className="text-[11px] font-black" style={{color:C.blue500}}>{m.date.slice(8)}</p>

                    <p className="text-[9px]" style={{color:C.blue200}}>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m.date.slice(5,7))-1]}</p>

                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-bold line-clamp-1" style={{color:C.textPrimary}}>{m.title}</p>

                    <p className="text-[10px]" style={{color:C.textMuted}}>{m.time} · {m.location}</p>

                  </div>

                </div>

              ))}

            </div>

          </Card>

          <Card className="p-5">

            <SectionHeader title="Recent Notices" action={

              <button onClick={()=>onPage("announcements")} className="text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>All</button>

            } />

            <div className="space-y-2">

              {ANNOUNCEMENTS_DATA.slice(0,3).map(a=>(

                <div key={a.id} className="py-2 border-b last:border-0" style={{borderColor:C.bg}}>

                  <div className="flex items-start gap-1.5">

                    {a.pinned && <Pin size={10} className="mt-0.5 flex-shrink-0" style={{color:C.blue200}} />}

                    <p className="text-xs font-bold line-clamp-1" style={{color:C.textPrimary}}>{a.title}</p>

                  </div>

                  <p className="text-[10px] mt-0.5" style={{color:C.textMuted}}>{a.date} · {a.category}</p>

                </div>

              ))}

            </div>

          </Card>

        </div>

      </div>

    </div>

  );

}