'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
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

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "hod" | "coordinator" | "faculty";
type AppPage =
  | "dashboard" | "faculty" | "announcements" | "meetings"
  | "documents" | "tasks" | "ai-knowledge" | "reports"
  | "department" | "notifications" | "profile" | "settings"
  | "help" | "e404" | "e403" | "e500";
type AuthView = "login" | "signup" | "forgot" | "reset";
type ViewMode = "auth" | "app";

interface NavItem { id: AppPage; label: string; icon: React.ComponentType<any> }
interface FacultyMember { id: number; name: string; email: string; phone: string; designation: string; department: string; role: string; status: "Active" | "On Leave" | "Inactive"; joined: string }
interface Announcement { id: number; title: string; category: string; department: string; postedBy: string; date: string; pinned: boolean; hasAttachment: boolean; summary: string }
interface Meeting { id: number; title: string; organizer: string; date: string; time: string; participants: number; status: "Upcoming" | "Completed" | "Cancelled"; department: string; location: string }
interface DocItem { id: number; title: string; category: string; uploadedBy: string; date: string; type: "pdf" | "doc" | "xlsx" | "ppt" | "img"; size: string; hasSummary: boolean }
interface TaskItem { id: number; title: string; assignee: string; priority: "High" | "Medium" | "Low"; status: "In Progress" | "Pending" | "Completed" | "Overdue"; dueDate: string; department: string; description: string }
interface NotifItem { id: number; type: "announcement" | "task" | "meeting" | "document" | "ai"; title: string; body: string; time: string; read: boolean }

// ─── WorkHub AI Color Tokens ──────────────────────────────────────────────────
const C = {
  blue50: "#DCE3F3", blue100: "#90AEE5", blue200: "#5388D9",
  blue300: "#3970BF", blue400: "#2D5E97", blue500: "#1D3552", blue600: "#030F21",
  sky50: "#E0F0FE", sky100: "#A0C8FB", sky200: "#6EA3F7",
  sky300: "#4380F3", sky400: "#215DB4", sky500: "#133C79",
  pink50: "#FCD2DD", pink100: "#F090B6", pink200: "#F14591",
  pink300: "#C92260", pink400: "#8C1344",
  olive50: "#F1F5BA", olive100: "#CCCF90", olive200: "#A5A776",
  olive300: "#808161", olive400: "#5C5D45", olive500: "#383C2D",
  red50: "#F8D0DE", red100: "#F3ABA9", red200: "#E67D6C",
  red300: "#D74333", red400: "#A95221", red500: "#6D1F17",
  gray50: "#E0E3E5", gray100: "#B0B6C1", gray200: "#8F959B",
  gray300: "#6C7075", gray400: "#4A4E51", gray500: "#2B2D2F",
  bg: "#F8F9FA", card: "#FFFFFF", border: "#E0E3E5",
  textPrimary: "#2B2D2F", textSecondary: "#6C7075",
  textMuted: "#8F959B", textDisabled: "#B0B6C1",
};

const CHART_COLORS = [C.blue200, C.blue100, C.sky200, C.olive300, C.olive100, C.sky300];

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV_CONFIG: Record<Role, NavItem[]> = {
  hod: [
    { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { id: "faculty",       label: "Faculty",       icon: Users },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "meetings",      label: "Meetings",      icon: Video },
    { id: "documents",     label: "Documents",     icon: FileText },
    { id: "tasks",         label: "Tasks",         icon: CheckSquare },
    { id: "ai-knowledge",  label: "AI Knowledge",  icon: Brain },
    { id: "reports",       label: "Reports",       icon: BarChart2 },
    { id: "department",    label: "Department",    icon: Building2 },
  ],
  coordinator: [
    { id: "dashboard",     label: "Dashboard",         icon: LayoutDashboard },
    { id: "announcements", label: "Announcements",     icon: Megaphone },
    { id: "meetings",      label: "Meetings",          icon: Video },
    { id: "documents",     label: "Documents",         icon: FileText },
    { id: "tasks",         label: "Tasks",             icon: CheckSquare },
    { id: "ai-knowledge",  label: "AI Knowledge",      icon: Brain },
    { id: "department",    label: "Department",        icon: Building2 },
    { id: "faculty",       label: "Faculty Directory", icon: Users },
  ],
  faculty: [
    { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "meetings",      label: "Meetings",      icon: Video },
    { id: "documents",     label: "Documents",     icon: FileText },
    { id: "tasks",         label: "My Tasks",      icon: CheckSquare },
    { id: "ai-knowledge",  label: "AI Knowledge",  icon: Brain },
  ],
};

const BOTTOM_NAV: NavItem[] = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile",       label: "Profile",       icon: User },
  { id: "settings",      label: "Settings",      icon: Settings },
  { id: "help",          label: "Help",          icon: HelpCircle },
];

const ROLE_LABELS: Record<Role, string> = {
  hod: "Head of Department", coordinator: "Dept. Coordinator", faculty: "Faculty Member",
};

const AUTH_STORAGE_KEY = "dms-authenticated";
const ROLE_STORAGE_KEY = "dms-role";

const isRole = (value: string | null): value is Role =>
  value === "hod" || value === "coordinator" || value === "faculty";

const BREADCRUMBS: Record<AppPage, string[]> = {
  dashboard: ["Home","Dashboard"], faculty: ["Home","Faculty"],
  announcements: ["Home","Announcements"], meetings: ["Home","Meetings"],
  documents: ["Home","Documents"], tasks: ["Home","Tasks"],
  "ai-knowledge": ["Home","AI Knowledge"], reports: ["Home","Reports"],
  department: ["Home","Department"], notifications: ["Home","Notifications"],
  profile: ["Home","Profile"], settings: ["Home","Settings"],
  help: ["Home","Help & Support"], e404: ["Home","404"],
  e403: ["Home","403"], e500: ["Home","500"],
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const FACULTY_DATA: FacultyMember[] = [
  { id:1,  name:"Dr. Anita Sharma",   email:"anita.sharma@college.edu",   phone:"+91 98765 43210", designation:"Professor",          department:"Computer Science", role:"HOD",         status:"Active",   joined:"2015-08-01" },
  { id:2,  name:"Prof. Rajan Mehta",  email:"rajan.mehta@college.edu",    phone:"+91 87654 32109", designation:"Associate Professor", department:"Computer Science", role:"Coordinator", status:"Active",   joined:"2017-07-15" },
  { id:3,  name:"Dr. Priya Nair",     email:"priya.nair@college.edu",     phone:"+91 76543 21098", designation:"Assistant Professor", department:"Computer Science", role:"Faculty",     status:"Active",   joined:"2019-01-10" },
  { id:4,  name:"Mr. Vikram Singh",   email:"vikram.singh@college.edu",   phone:"+91 65432 10987", designation:"Assistant Professor", department:"Computer Science", role:"Faculty",     status:"On Leave", joined:"2020-06-01" },
  { id:5,  name:"Dr. Sunita Patel",   email:"sunita.patel@college.edu",   phone:"+91 54321 09876", designation:"Associate Professor", department:"Electronics",      role:"HOD",         status:"Active",   joined:"2013-09-15" },
  { id:6,  name:"Prof. Kiran Desai",  email:"kiran.desai@college.edu",    phone:"+91 43210 98765", designation:"Professor",          department:"Mathematics",      role:"Faculty",     status:"Active",   joined:"2010-03-20" },
  { id:7,  name:"Dr. Amit Verma",     email:"amit.verma@college.edu",     phone:"+91 32109 87654", designation:"Assistant Professor", department:"Physics",          role:"Faculty",     status:"Active",   joined:"2021-08-01" },
  { id:8,  name:"Ms. Deepa Krishnan", email:"deepa.krishnan@college.edu", phone:"+91 21098 76543", designation:"Lecturer",           department:"Computer Science", role:"Faculty",     status:"Active",   joined:"2022-07-18" },
  { id:9,  name:"Dr. Rohit Joshi",    email:"rohit.joshi@college.edu",    phone:"+91 10987 65432", designation:"Associate Professor", department:"Mechanical",       role:"Coordinator", status:"Inactive", joined:"2016-01-05" },
  { id:10, name:"Prof. Meera Iyer",   email:"meera.iyer@college.edu",     phone:"+91 09876 54321", designation:"Professor",          department:"Civil",            role:"HOD",         status:"Active",   joined:"2008-06-12" },
];

const ANNOUNCEMENTS_DATA: Announcement[] = [
  { id:1, title:"Annual Academic Review Meeting — All HODs to Attend",  category:"Academic",   department:"All Departments",  postedBy:"Dr. Anita Sharma",  date:"2026-06-28", pinned:true,  hasAttachment:true,  summary:"Mandatory attendance for all HODs. Agenda includes curriculum review and faculty performance metrics for Q2." },
  { id:2, title:"Semester End Examination Schedule Published",           category:"Examination",department:"Computer Science", postedBy:"Prof. Rajan Mehta", date:"2026-06-25", pinned:false, hasAttachment:true,  summary:"End-semester exams scheduled July 15–30. Hall tickets available from July 10." },
  { id:3, title:"New Faculty Onboarding — Orientation Program Details",  category:"HR",         department:"All Departments",  postedBy:"Admin Office",      date:"2026-06-22", pinned:false, hasAttachment:false, summary:"New faculty orientation on July 5th at 10 AM. HR documentation deadline July 3rd." },
  { id:4, title:"Research Grant Application — Last Date July 15th",     category:"Research",   department:"All Departments",  postedBy:"Dr. Anita Sharma",  date:"2026-06-20", pinned:true,  hasAttachment:true,  summary:"SERB research grant applications open. Eligible faculty must submit proposals via the research portal." },
  { id:5, title:"Lab Equipment Calibration — CS Lab Closed July 1–3",   category:"Facilities", department:"Computer Science", postedBy:"Lab Coordinator",   date:"2026-06-18", pinned:false, hasAttachment:false, summary:"CS lab maintenance scheduled. Alternative lab arrangements made for ongoing projects." },
  { id:6, title:"Student Performance Review — Q2 Reports Due",          category:"Academic",   department:"Computer Science", postedBy:"Prof. Rajan Mehta", date:"2026-06-15", pinned:false, hasAttachment:false, summary:"Q2 student performance reports must be submitted by June 30. Format guidelines attached." },
];

const MEETINGS_DATA: Meeting[] = [
  { id:1, title:"Department Faculty Meeting — July Curriculum Planning", organizer:"Dr. Anita Sharma", date:"2026-07-03", time:"10:00 AM", participants:14, status:"Upcoming",  department:"Computer Science", location:"Conference Room A" },
  { id:2, title:"Research Committee Review — Q2 Progress",              organizer:"Prof. Meera Iyer",  date:"2026-07-05", time:"2:00 PM",  participants:8,  status:"Upcoming",  department:"All Departments",  location:"Board Room" },
  { id:3, title:"Student Grievance Redressal Meeting",                  organizer:"Prof. Rajan Mehta", date:"2026-07-07", time:"11:00 AM", participants:5,  status:"Upcoming",  department:"Computer Science", location:"HOD Office" },
  { id:4, title:"Annual Budget Review — FY 2026–27",                    organizer:"Dr. Anita Sharma",  date:"2026-06-20", time:"3:00 PM",  participants:12, status:"Completed", department:"All Departments",  location:"Conference Room B" },
  { id:5, title:"Accreditation Preparation Meeting — NAAC",             organizer:"Principal",          date:"2026-06-15", time:"9:00 AM",  participants:24, status:"Completed", department:"All Departments",  location:"Seminar Hall" },
  { id:6, title:"Placement Cell Coordination — Industry Connect",       organizer:"Prof. Kiran Desai",  date:"2026-06-10", time:"11:30 AM", participants:9,  status:"Completed", department:"Computer Science", location:"Placement Office" },
];

const DOCUMENTS_DATA: DocItem[] = [
  { id:1, title:"Curriculum Framework 2026–27 — CS Department",   category:"Academic",       uploadedBy:"Dr. Anita Sharma",  date:"2026-06-25", type:"pdf",  size:"2.4 MB",  hasSummary:true  },
  { id:2, title:"Faculty Workload Distribution — Semester II",     category:"Administrative", uploadedBy:"Prof. Rajan Mehta", date:"2026-06-22", type:"xlsx", size:"840 KB",  hasSummary:true  },
  { id:3, title:"NAAC Accreditation Report — Self Study Document", category:"Accreditation",  uploadedBy:"Quality Cell",      date:"2026-06-20", type:"pdf",  size:"18.2 MB", hasSummary:true  },
  { id:4, title:"Student Attendance Summary — June 2026",          category:"Academic",       uploadedBy:"Dr. Priya Nair",    date:"2026-06-18", type:"xlsx", size:"1.1 MB",  hasSummary:false },
  { id:5, title:"Research Publication List — Faculty 2025–26",     category:"Research",       uploadedBy:"Dr. Rohit Joshi",   date:"2026-06-15", type:"doc",  size:"560 KB",  hasSummary:true  },
  { id:6, title:"Lab Safety Guidelines — Updated Version",         category:"Facilities",     uploadedBy:"Lab Coordinator",   date:"2026-06-12", type:"pdf",  size:"980 KB",  hasSummary:false },
  { id:7, title:"Department Budget Utilization — Q1 FY2027",       category:"Finance",        uploadedBy:"Prof. Rajan Mehta", date:"2026-06-10", type:"xlsx", size:"720 KB",  hasSummary:true  },
  { id:8, title:"Faculty Development Program Schedule",            category:"HR",             uploadedBy:"HR Office",         date:"2026-06-08", type:"ppt",  size:"4.8 MB",  hasSummary:false },
];

const TASKS_DATA: TaskItem[] = [
  { id:1, title:"Prepare Semester II Timetable Draft",        assignee:"Prof. Rajan Mehta",  priority:"High",   status:"In Progress", dueDate:"2026-07-05", department:"Computer Science", description:"Draft the complete timetable for semester II including lab sessions and tutorial slots." },
  { id:2, title:"Submit NAAC Criterion IV Documentation",     assignee:"Dr. Priya Nair",     priority:"High",   status:"Pending",     dueDate:"2026-07-10", department:"Computer Science", description:"Compile and submit all NAAC Criterion IV documentation." },
  { id:3, title:"Faculty Feedback Analysis — Semester I",     assignee:"Prof. Rajan Mehta",  priority:"Medium", status:"Completed",   dueDate:"2026-06-30", department:"Computer Science", description:"Analyze student feedback for semester I and prepare summary report." },
  { id:4, title:"Update Laboratory Inventory Records",        assignee:"Mr. Vikram Singh",   priority:"Low",    status:"Overdue",     dueDate:"2026-06-20", department:"Computer Science", description:"Update all CS lab equipment inventory as per the new format." },
  { id:5, title:"Research Grant Proposal Submission — SERB",  assignee:"Dr. Priya Nair",     priority:"High",   status:"In Progress", dueDate:"2026-07-15", department:"Computer Science", description:"Prepare and submit SERB research grant proposal for the AI in Education project." },
  { id:6, title:"Review and Approve Question Papers",         assignee:"Dr. Anita Sharma",   priority:"High",   status:"Pending",     dueDate:"2026-07-08", department:"Computer Science", description:"Review all end-semester question papers for technical accuracy." },
  { id:7, title:"Faculty Performance Appraisal Forms",        assignee:"Ms. Deepa Krishnan", priority:"Medium", status:"In Progress", dueDate:"2026-07-12", department:"Computer Science", description:"Collect self-appraisal forms from all faculty and compile for HOD review." },
  { id:8, title:"Update Department Website Content",          assignee:"Mr. Vikram Singh",   priority:"Low",    status:"Pending",     dueDate:"2026-07-20", department:"Computer Science", description:"Update faculty profiles, achievements, and course listings on the department website." },
];

const NOTIFICATIONS_DATA: NotifItem[] = [
  { id:1,  type:"task",         title:"Task Assigned: Review Question Papers",       body:"Dr. Anita Sharma assigned a high-priority task due July 8.",         time:"2 min ago",  read:false },
  { id:2,  type:"meeting",      title:"Meeting Reminder: Faculty Meeting Tomorrow",  body:"Dept. Faculty Meeting on July 3 at 10:00 AM in Conf. Room A.",       time:"1 hr ago",   read:false },
  { id:3,  type:"announcement", title:"New Announcement: Research Grant Deadline",  body:"SERB research grant application deadline is July 15th.",             time:"3 hr ago",   read:false },
  { id:4,  type:"document",     title:"Document Uploaded: Curriculum Framework",    body:"Dr. Anita Sharma uploaded a new document to the Academic category.", time:"5 hr ago",   read:true  },
  { id:5,  type:"ai",           title:"AI Insight: Workload Imbalance Detected",    body:"3 faculty members above 120% workload allocation.",                  time:"6 hr ago",   read:true  },
  { id:6,  type:"task",         title:"Task Overdue: Lab Inventory Update",         body:"Mr. Vikram Singh's task was due June 20 and remains incomplete.",    time:"1 day ago",  read:true  },
  { id:7,  type:"meeting",      title:"Meeting Minutes Available",                  body:"Minutes for Annual Budget Review (June 20) have been uploaded.",    time:"1 day ago",  read:true  },
  { id:8,  type:"announcement", title:"Announcement: CS Lab Closure",               body:"CS Lab will be closed July 1–3 for equipment calibration.",          time:"2 days ago", read:true  },
  { id:9,  type:"document",     title:"Document Approved: NAAC Report",             body:"NAAC Self Study Document has been reviewed and approved.",            time:"2 days ago", read:true  },
  { id:10, type:"ai",           title:"AI Summary Ready: June Announcements",       body:"AI has generated summaries for 6 new announcements this month.",     time:"3 days ago", read:true  },
];

const workloadData    = [{ month:"Jan",hours:18 },{ month:"Feb",hours:22 },{ month:"Mar",hours:19 },{ month:"Apr",hours:25 },{ month:"May",hours:21 },{ month:"Jun",hours:23 }];
const taskTrendData   = [{ month:"Jan",completed:12,pending:4 },{ month:"Feb",completed:15,pending:6 },{ month:"Mar",completed:18,pending:3 },{ month:"Apr",completed:14,pending:8 },{ month:"May",completed:20,pending:5 },{ month:"Jun",completed:17,pending:6 }];
const uploadTrendData = [{ month:"Jan",docs:24 },{ month:"Feb",docs:31 },{ month:"Mar",docs:28 },{ month:"Apr",docs:42 },{ month:"May",docs:38 },{ month:"Jun",docs:35 }];
const meetingData     = [{ month:"Jan",meetings:5 },{ month:"Feb",meetings:8 },{ month:"Mar",meetings:6 },{ month:"Apr",meetings:9 },{ month:"May",meetings:7 },{ month:"Jun",meetings:11 }];
const deptDistData    = [{ name:"Comp. Sci.",value:14 },{ name:"Electronics",value:8 },{ name:"Math",value:6 },{ name:"Physics",value:5 },{ name:"Civil",value:7 },{ name:"Mech.",value:7 }];

// ─── Utilities ────────────────────────────────────────────────────────────────
function cn(...cls: (string|false|undefined|null)[]) { return cls.filter(Boolean).join(" "); }
function initials(n: string) { return n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

// ─── Hover helper ─────────────────────────────────────────────────────────────
function hov(el: EventTarget, bg: string, clr?: string) {
  const e = el as HTMLElement;
  e.style.background = bg;
  if(clr) e.style.color = clr;
}
function unhov(el: EventTarget, bg: string, clr?: string) {
  const e = el as HTMLElement;
  e.style.background = bg;
  if(clr) e.style.color = clr;
}

// ─── Base Components ──────────────────────────────────────────────────────────
function Avatar({ name, size="md", className }: { name:string; size?:"sm"|"md"|"lg"|"xl"; className?:string }) {
  const sz = { sm:"w-8 h-8 text-xs", md:"w-9 h-9 text-sm", lg:"w-12 h-12 text-base", xl:"w-20 h-20 text-xl" };
  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none", sz[size], className)}
      style={{ background:C.blue50, color:C.blue500 }}>
      {initials(name)}
    </div>
  );
}

function StatusBadge({ status }: { status:string }) {
  const m: Record<string,{bg:string;text:string}> = {
    "Active":      {bg:C.olive50, text:C.olive500},
    "On Leave":    {bg:C.sky50,   text:C.sky500},
    "Inactive":    {bg:C.gray50,  text:C.gray400},
    "Upcoming":    {bg:C.blue50,  text:C.blue500},
    "Completed":   {bg:C.olive50, text:C.olive500},
    "Cancelled":   {bg:C.gray50,  text:C.gray300},
    "In Progress": {bg:C.blue50,  text:C.blue500},
    "Pending":     {bg:C.gray50,  text:C.gray400},
    "Overdue":     {bg:C.red50,   text:C.red500},
  };
  const s = m[status] ?? {bg:C.gray50, text:C.gray300};
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap" style={{background:s.bg,color:s.text}}>{status}</span>;
}

function PriorityBadge({ priority }: { priority:string }) {
  const m: Record<string,{bg:string;text:string;border:string}> = {
    High:   {bg:C.red50,   text:C.red500,   border:C.red200},
    Medium: {bg:C.sky50,   text:C.sky500,   border:C.sky200},
    Low:    {bg:C.olive50, text:C.olive500, border:C.olive200},
  };
  const s = m[priority] ?? {bg:C.gray50,text:C.gray300,border:C.gray50};
  return <span className="px-2.5 py-0.5 rounded text-xs font-semibold border whitespace-nowrap" style={{background:s.bg,color:s.text,borderColor:s.border}}>{priority}</span>;
}

function CategoryBadge({ label }: { label:string }) {
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{background:C.sky50,color:C.sky500}}>{label}</span>;
}

function Btn({ children, variant="primary", size="md", onClick, className, icon:Icon, disabled }: {
  children?:React.ReactNode; variant?:"primary"|"secondary"|"ghost"|"outline"|"danger"|"ai";
  size?:"sm"|"md"|"lg"; onClick?:()=>void; className?:string;
  icon?:React.ComponentType<any>; disabled?:boolean;
}) {
  const base = "inline-flex items-center gap-2 font-semibold transition-all cursor-pointer select-none";
  const sz = { sm:"px-3 py-1.5 text-xs rounded-lg", md:"px-4 py-2 text-sm rounded-[10px]", lg:"px-5 py-2.5 text-sm rounded-[10px]" };
  const vstyle: Record<string,React.CSSProperties> = {
    primary:   {background:C.blue200, color:"#fff"},
    secondary: {background:C.card, border:`1px solid ${C.border}`, color:C.textPrimary},
    ghost:     {color:C.blue200},
    outline:   {background:C.card, border:`1px solid ${C.border}`, color:C.textPrimary},
    danger:    {background:C.red300, color:"#fff"},
    ai:        {background:`linear-gradient(135deg,${C.blue600},${C.blue400})`, color:"#fff"},
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn(base, sz[size], className, disabled && "opacity-50 cursor-not-allowed")}
      style={disabled ? {...vstyle[variant], opacity:.5, cursor:"not-allowed"} : vstyle[variant]}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}

function Input({ placeholder, value, onChange, type="text", className, icon:Icon }: {
  placeholder?:string; value?:string; onChange?:(v:string)=>void;
  type?:string; className?:string; icon?:React.ComponentType<any>;
}) {
  return (
    <div className={cn("relative", className)}>
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:C.textMuted}} />}
      <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)}
        className={cn("w-full border bg-white text-sm outline-none transition-all", Icon?"pl-9 pr-3 py-2.5":"px-3 py-2.5")}
        style={{borderColor:C.border, borderRadius:10, color:C.textPrimary}}
        onFocus={e=>{e.target.style.borderColor=C.blue200; e.target.style.boxShadow=`0 0 0 3px ${C.blue50}`;}}
        onBlur={e=>{e.target.style.borderColor=C.border; e.target.style.boxShadow="none";}} />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.35 0-4.34-1.58-5.05-3.72H.93v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.96H.93A9 9 0 0 0 0 9c0 1.45.34 2.82.93 4.04l3.02-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .93 4.96L3.95 7.3C4.66 5.16 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

function Select({ options, value, onChange, className }: { options:string[]; value?:string; onChange?:(v:string)=>void; className?:string }) {
  return (
    <select value={value} onChange={e=>onChange?.(e.target.value)}
      className={cn("border bg-white text-sm px-3 py-2.5 outline-none cursor-pointer", className)}
      style={{borderColor:C.border, borderRadius:10, color:C.textPrimary}}>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  );
}

function Card({ children, className, onClick, style }: { children:React.ReactNode; className?:string; onClick?:()=>void; style?:React.CSSProperties }) {
  return (
    <div onClick={onClick} className={cn("bg-white border transition-shadow", className, onClick && "cursor-pointer")}
      style={{borderColor:C.border, borderRadius:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", ...(style||{})}}
      onMouseEnter={e=>{ if(onClick)(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e=>{ if(onClick)(e.currentTarget as HTMLElement).style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-bold" style={{color:C.textPrimary}}>{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{color:C.textMuted}}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon:Icon, title, description, action }: {
  icon:React.ComponentType<any>; title:string; description:string; action?:React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{background:C.blue50}}>
        <Icon size={28} style={{color:C.blue200}} />
      </div>
      <h3 className="text-sm font-bold mb-1" style={{color:C.textPrimary}}>{title}</h3>
      <p className="text-xs max-w-xs mb-4" style={{color:C.textMuted}}>{description}</p>
      {action}
    </div>
  );
}

function StatCard({ label, value, sub, icon:Icon, iconBg, iconColor }: {
  label:string; value:string|number; sub?:string;
  icon:React.ComponentType<any>; iconBg?:string; iconColor?:string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{color:C.textMuted}}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:iconBg??C.blue50}}>
          <Icon size={17} style={{color:iconColor??C.blue200}} />
        </div>
      </div>
      <p className="text-3xl font-black" style={{color:C.textPrimary}}>{value}</p>
      {sub && <p className="text-xs mt-1.5 font-medium" style={{color:C.textMuted}}>{sub}</p>}
    </Card>
  );
}

function FilterBar({ children }: { children:React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5 bg-white border p-3"
      style={{borderColor:C.border, borderRadius:12, boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
      {children}
    </div>
  );
}

function Tabs({ tabs, active, onChange }: { tabs:string[]; active:string; onChange:(t:string)=>void }) {
  return (
    <div className="flex border-b mb-5" style={{borderColor:C.border}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>onChange(t)} className="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px"
          style={t===active ? {borderColor:C.blue200, color:C.blue200} : {borderColor:"transparent", color:C.textSecondary}}>
          {t}
        </button>
      ))}
    </div>
  );
}

function ChartCard({ title, children, action }: { title:string; children:React.ReactNode; action?:React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold" style={{color:C.textPrimary}}>{title}</h3>
        {action ?? <MoreHorizontal size={16} style={{color:C.textMuted}} className="cursor-pointer" />}
      </div>
      {children}
    </Card>
  );
}

function Pagination({ current, total, onChange }: { current:number; total:number; onChange:(p:number)=>void }) {
  const pages = Math.max(1, Math.ceil(total/10));
  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{borderColor:C.border}}>
      <p className="text-xs" style={{color:C.textMuted}}>Showing {Math.min((current-1)*10+1,total)}–{Math.min(current*10,total)} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={()=>onChange(Math.max(1,current-1))} disabled={current===1}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40"
          style={{color:C.blue200}}>
          <ChevronLeft size={14} />
        </button>
        {[...Array(pages)].map((_,i)=>(
          <button key={i} onClick={()=>onChange(i+1)} className="w-8 h-8 rounded-lg text-xs font-semibold"
            style={i+1===current ? {background:C.blue200,color:"#fff"} : {color:C.textSecondary}}>
            {i+1}
          </button>
        ))}
        <button onClick={()=>onChange(Math.min(pages,current+1))} disabled={current===pages}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40"
          style={{color:C.blue200}}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function FileTypeIcon({ type }: { type:string }) {
  const s: Record<string,{bg:string;color:string}> = {
    pdf:  {bg:C.red50,   color:C.red500},
    doc:  {bg:C.blue50,  color:C.blue500},
    xlsx: {bg:C.olive50, color:C.olive500},
    ppt:  {bg:C.sky50,   color:C.sky500},
    img:  {bg:C.gray50,  color:C.gray400},
  };
  const c = s[type] ?? s.doc;
  return (
    <div className="w-10 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 flex-shrink-0" style={{background:c.bg}}>
      <File size={14} style={{color:c.color}} />
      <span className="text-[9px] font-black uppercase" style={{color:c.color}}>{type}</span>
    </div>
  );
}

function NotifIcon({ type }: { type:string }) {
  const map: Record<string,{icon:React.ComponentType<any>;bg:string;color:string}> = {
    announcement: {icon:Megaphone,   bg:C.blue50,  color:C.blue200},
    task:         {icon:CheckSquare, bg:C.olive50, color:C.olive300},
    meeting:      {icon:Video,       bg:C.sky50,   color:C.sky300},
    document:     {icon:FileText,    bg:C.gray50,  color:C.gray300},
    ai:           {icon:Sparkles,    bg:C.pink50,  color:C.pink200},
  };
  const m = map[type] ?? map.document;
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{background:m.bg}}>
      <m.icon size={15} style={{color:m.color}} />
    </div>
  );
}

function Modal({ title, onClose, children, footer }: { title:string; onClose:()=>void; children:React.ReactNode; footer?:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-4 z-10 shadow-2xl" style={{borderRadius:18}}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{borderColor:C.border}}>
          <h3 className="font-bold" style={{color:C.textPrimary}}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{color:C.textMuted}}
            onMouseEnter={e=>hov(e.target,C.bg)} onMouseLeave={e=>unhov(e.target,"transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t flex justify-end gap-3" style={{borderColor:C.border}}>{footer}</div>}
      </div>
    </div>
  );
}

function Drawer({ title, onClose, children, width="w-96" }: { title:string; onClose:()=>void; children:React.ReactNode; width?:string }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className={cn("relative ml-auto bg-white shadow-2xl flex flex-col", width)}>
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{borderColor:C.border}}>
          <h3 className="font-bold" style={{color:C.textPrimary}}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{color:C.textMuted}}
            onMouseEnter={e=>hov(e.target,C.bg)} onMouseLeave={e=>unhov(e.target,"transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value:number; max:number; color?:string }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{background:C.gray50}}>
      <div className="h-1.5 rounded-full" style={{width:`${Math.round((value/max)*100)}%`, background:color??C.blue200}} />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ role, page, onPage, collapsed, onCollapse, onRoleChange }: {
  role:Role; page:AppPage; onPage:(p:AppPage)=>void;
  collapsed:boolean; onCollapse:()=>void; onRoleChange:(r:Role)=>void;
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navBtn = (id: AppPage, label: string, Icon: React.ComponentType<any>, badge?: number) => {
    const active = page === id;
    return (
      <button key={id} onClick={()=>onPage(id)}
        className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all", collapsed && "justify-center px-2")}
        style={active ? {background:C.blue500, color:"#fff"} : {color:C.textSecondary}}
        onMouseEnter={e=>{ if(!active) hov(e.currentTarget, C.blue50, C.blue500); }}
        onMouseLeave={e=>{ if(!active) unhov(e.currentTarget, "transparent", C.textSecondary); }}>
        <Icon size={17} />
        {!collapsed && <span className="flex-1 text-left">{label}</span>}
        {!collapsed && badge && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black text-white" style={{background:C.blue200}}>{badge}</span>
        )}
      </button>
    );
  };

  return (
    <aside className={cn("flex flex-col h-screen border-r bg-white transition-all duration-300 flex-shrink-0", collapsed ? "w-16" : "w-60")}
      style={{borderColor:C.border}}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0" style={{borderColor:C.border}}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:C.blue600}}>
          <span className="text-xs font-black" style={{color:C.blue200}}>W</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm leading-tight" style={{color:C.blue600}}>WorkHub AI</p>
            <p className="text-[10px]" style={{color:C.textMuted}}>Dept. Management</p>
          </div>
        )}
        <button onClick={onCollapse}
          className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", collapsed ? "ml-0" : "ml-auto")}
          style={{color:C.textMuted}}
          onMouseEnter={e=>hov(e.currentTarget,C.bg)}
          onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Role picker */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 relative">
          <button onClick={()=>setShowRoleMenu(!showRoleMenu)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border"
            style={{borderColor:C.border}}
            onMouseEnter={e=>hov(e.currentTarget,C.bg)}
            onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:C.blue50}}>
              <Shield size={12} style={{color:C.blue200}} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{color:C.textMuted}}>Current Role</p>
              <p className="text-xs font-bold truncate" style={{color:C.blue500}}>{ROLE_LABELS[role]}</p>
            </div>
            <ChevronDown size={12} style={{color:C.textMuted}} />
          </button>
          {showRoleMenu && (
            <div className="mt-1.5 absolute left-3 right-3 bg-white border shadow-lg py-1 z-30" style={{borderColor:C.border, borderRadius:12}}>
              {(["hod","coordinator","faculty"] as Role[]).map(r=>(
                <button key={r} onClick={()=>{ onRoleChange(r); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold"
                  style={{color:r===role ? C.blue500 : C.textSecondary}}
                  onMouseEnter={e=>hov(e.currentTarget,C.bg)}
                  onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {!collapsed && <p className="px-3 pt-2 pb-1.5 text-[9px] font-black uppercase tracking-widest" style={{color:C.textDisabled}}>Navigation</p>}
        {NAV_CONFIG[role].map(({id,label,icon:Icon})=>navBtn(id,label,Icon))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 py-2 border-t space-y-0.5 flex-shrink-0" style={{borderColor:C.border}}>
        {BOTTOM_NAV.map(({id,label,icon:Icon})=>navBtn(id,label,Icon,id==="notifications"?3:undefined))}
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-3 pb-3 pt-2 border-t flex-shrink-0" style={{borderColor:C.border}}>
          <div className="flex items-center gap-2.5">
            <Avatar name="Dr. Anita Sharma" size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{color:C.textPrimary}}>Dr. Anita Sharma</p>
              <p className="text-[10px] truncate" style={{color:C.textMuted}}>anita@college.edu</p>
            </div>
            <LogOut size={13} className="cursor-pointer flex-shrink-0" style={{color:C.textMuted}} />
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── TopNav ───────────────────────────────────────────────────────────────────
function TopNav({ role, page, onPage, onMenu, onLogout }: { role:Role; page:AppPage; onPage:(p:AppPage)=>void; onMenu:()=>void; onLogout:()=>void }) {
  const [search, setSearch] = useState("");
  const [showUser, setShowUser] = useState(false);
  const crumbs = BREADCRUMBS[page] ?? ["Home"];

  return (
    <header className="h-16 bg-white border-b flex items-center gap-4 px-5 flex-shrink-0" style={{borderColor:C.border}}>
      <button onClick={onMenu} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center" style={{color:C.textSecondary}}
        onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
        <Menu size={18} />
      </button>

      <nav className="hidden md:flex items-center gap-1.5 text-sm">
        {crumbs.map((c,i)=>(
          <span key={i} className="flex items-center gap-1.5">
            {i>0 && <ChevronRight size={13} style={{color:C.textDisabled}} />}
            <span className="font-semibold" style={{color:i===crumbs.length-1?C.textPrimary:C.textMuted}}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="hidden lg:flex items-center gap-2 border rounded-[10px] px-3 py-2 w-72" style={{borderColor:C.border, background:C.bg}}>
        <Search size={14} style={{color:C.textMuted}} className="flex-shrink-0" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anything..."
          className="flex-1 text-sm bg-transparent outline-none" style={{color:C.textPrimary}} />
        <kbd className="text-[10px] border rounded px-1.5 py-0.5 font-mono" style={{color:C.textDisabled,borderColor:C.border}}>⌘K</kbd>
      </div>

      <button className="hidden sm:flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        style={{background:`linear-gradient(135deg,${C.blue600},${C.blue400})`}}>
        <Sparkles size={14} style={{color:C.pink200}} />
        <span className="hidden xl:inline">AI Search</span>
      </button>

      <button onClick={()=>onPage("notifications")}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{color:C.textSecondary}}
        onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background:C.blue200}} />
      </button>

      <div className="relative">
        <button onClick={()=>setShowUser(!showUser)} className="flex items-center gap-2 rounded-xl px-2 py-1.5"
          onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
          <Avatar name="Dr. Anita Sharma" size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold leading-tight" style={{color:C.textPrimary}}>Dr. Anita Sharma</p>
            <p className="text-[10px] leading-tight" style={{color:C.textMuted}}>{ROLE_LABELS[role]}</p>
          </div>
          <ChevronDown size={13} style={{color:C.textMuted}} />
        </button>
        {showUser && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border shadow-xl py-2 z-30" style={{borderColor:C.border, borderRadius:14}}>
            <div className="px-3 py-2 border-b mb-1" style={{borderColor:C.border}}>
              <p className="text-xs font-bold" style={{color:C.textPrimary}}>Dr. Anita Sharma</p>
              <p className="text-[10px]" style={{color:C.textMuted}}>anita.sharma@college.edu</p>
            </div>
            {[{label:"View Profile",icon:User,pg:"profile"as AppPage},{label:"Settings",icon:Settings,pg:"settings"as AppPage},{label:"Help",icon:HelpCircle,pg:"help"as AppPage}].map(({label,icon:Icon,pg})=>(
              <button key={label} onClick={()=>{ onPage(pg); setShowUser(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium"
                style={{color:C.textSecondary}}
                onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                <Icon size={14} style={{color:C.blue200}} />{label}
              </button>
            ))}
            <div className="border-t mt-1 pt-1" style={{borderColor:C.border}}>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium" style={{color:C.red300}}
                onMouseEnter={e=>hov(e.currentTarget,C.red50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                <LogOut size={14} />Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onGoogleLogin, onForgot, onSignup, onRoleChange, role }: {
  onLogin:(email:string,password:string)=>Promise<string | null>;
  onGoogleLogin:()=>Promise<void>;
  onForgot:()=>void; onSignup:()=>void; onRoleChange:(r:Role)=>void; role:Role;
}) {
  const [email, setEmail] = useState("anita.sharma@college.edu");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submitLogin = async () => {
    setError("");
    setLoading(true);
    const message = await onLogin(email.trim(), pw);
    if (message) setError(message);
    setLoading(false);
  };

  const submitGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    await onGoogleLogin();
    setGoogleLoading(false);
  };
  return (
    <div className="min-h-screen flex" style={{background:C.bg}}>
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{background:C.blue600}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.08)"}}>
            <span className="text-base font-black" style={{color:C.blue200}}>W</span>
          </div>
          <div>
            <p className="font-black text-lg leading-tight text-white">WorkHub AI</p>
            <p className="text-xs" style={{color:C.gray300}}>Dept. Management System</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black leading-tight mb-4 text-white">Smarter department management, powered by AI.</h2>
          <p className="text-sm leading-relaxed" style={{color:C.gray200}}>A unified platform for faculty, coordinators, and HODs to collaborate, manage tasks, documents, and meetings.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[{label:"Departments",val:"8"},{label:"Faculty Members",val:"47"},{label:"Active Tasks",val:"128"},{label:"Meetings / mo",val:"24"}].map(({label,val})=>(
              <div key={label} className="p-4 rounded-2xl border" style={{background:"rgba(255,255,255,0.04)",borderColor:"rgba(255,255,255,0.08)"}}>
                <p className="text-2xl font-black" style={{color:C.blue200}}>{val}</p>
                <p className="text-xs mt-1" style={{color:C.gray300}}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{color:C.gray400}}>© 2026 WorkHub AI · All rights reserved</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:C.blue600}}>
                <span className="text-xs font-black" style={{color:C.blue200}}>W</span>
              </div>
              <span className="font-black" style={{color:C.blue600}}>WorkHub AI</span>
            </div>
            <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Welcome back</h1>
            <p className="text-sm" style={{color:C.textSecondary}}>Sign in to your workspace to continue</p>
          </div>

          <div className="mb-6 p-4 rounded-2xl border" style={{background:C.bg, borderColor:C.border}}>
            <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{color:C.textMuted}}>Demo — Preview as Role</p>
            <div className="flex gap-2">
              {(["hod","coordinator","faculty"] as Role[]).map(r=>(
                <button key={r} onClick={()=>onRoleChange(r)} className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={r===role ? {background:C.blue500,color:"#fff",borderColor:C.blue500} : {background:"#fff",borderColor:C.border,color:C.textSecondary}}>
                  {r==="hod"?"HOD":r==="coordinator"?"Coord.":"Faculty"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={e=>{ e.preventDefault(); void submitLogin(); }} className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Email address</label>
              <Input value={email} onChange={setEmail} placeholder="you@college.edu" icon={Mail} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold" style={{color:C.textPrimary}}>Password</label>
                <button type="button" onClick={onForgot} className="text-xs font-semibold hover:opacity-70" style={{color:C.blue200}}>Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:C.textMuted}} />
                <input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border bg-white text-sm outline-none"
                  style={{borderColor:C.border, borderRadius:10, color:C.textPrimary}} />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={14} style={{color:C.textMuted}} /> : <Eye size={14} style={{color:C.textMuted}} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rem" checked={remember} onChange={e=>setRemember(e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="rem" className="text-sm" style={{color:C.textSecondary}}>Remember me for 30 days</label>
            </div>
            {error && (
              <div className="rounded-xl border px-3 py-2 text-sm font-medium" style={{background:C.red50,borderColor:C.red100,color:C.red500}}>
                {error}
              </div>
            )}
            <Btn variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to WorkHub"}
            </Btn>
          </form>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{background:C.border}} />
            <span className="text-xs font-semibold uppercase" style={{color:C.textMuted}}>or</span>
            <div className="h-px flex-1" style={{background:C.border}} />
          </div>

          <button type="button" onClick={submitGoogleLogin} disabled={googleLoading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-[10px] border bg-white px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{borderColor:C.border,color:C.textPrimary}}>
            <GoogleIcon />
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <p className="mt-5 text-center text-sm" style={{color:C.textSecondary}}>
            New to WorkHub?{" "}
            <button type="button" onClick={onSignup} className="font-bold hover:opacity-70" style={{color:C.blue200}}>
              Create an account
            </button>
          </p>
          <p className="mt-4 text-center text-xs" style={{color:C.textDisabled}}>Protected by enterprise SSO · Contact IT for access issues</p>
        </div>
      </div>
    </div>
  );
}

function SignupPage({ onSignup, onGoogleLogin, onBack, onRoleChange, role }: {
  onSignup:(name:string,email:string,password:string)=>Promise<string | null>;
  onGoogleLogin:()=>Promise<void>;
  onBack:()=>void; onRoleChange:(r:Role)=>void; role:Role;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submitSignup = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    const result = await onSignup(name.trim(), email.trim(), pw);
    if (result) {
      setError(result);
    } else {
      setMessage("Account created. Check your email to confirm your signup, then sign in.");
      setPw("");
    }
    setLoading(false);
  };

  const submitGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    await onGoogleLogin();
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{background:C.bg}}>
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{background:C.blue600}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.08)"}}>
            <span className="text-base font-black" style={{color:C.blue200}}>W</span>
          </div>
          <div>
            <p className="font-black text-lg leading-tight text-white">WorkHub AI</p>
            <p className="text-xs" style={{color:C.gray300}}>Dept. Management System</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black leading-tight mb-4 text-white">Create your department workspace account.</h2>
          <p className="text-sm leading-relaxed" style={{color:C.gray200}}>Sign up with your college email or use Google to join WorkHub AI.</p>
        </div>
        <p className="text-xs" style={{color:C.gray400}}>© 2026 WorkHub AI · All rights reserved</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-70" style={{color:C.blue200}}>
            <ChevronLeft size={16} />Back to sign in
          </button>
          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Create account</h1>
            <p className="text-sm" style={{color:C.textSecondary}}>Start with your college workspace details</p>
          </div>

          <div className="mb-6 p-4 rounded-2xl border" style={{background:C.bg, borderColor:C.border}}>
            <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{color:C.textMuted}}>Demo - Preview as Role</p>
            <div className="flex gap-2">
              {(["hod","coordinator","faculty"] as Role[]).map(r=>(
                <button key={r} onClick={()=>onRoleChange(r)} className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={r===role ? {background:C.blue500,color:"#fff",borderColor:C.blue500} : {background:"#fff",borderColor:C.border,color:C.textSecondary}}>
                  {r==="hod"?"HOD":r==="coordinator"?"Coord.":"Faculty"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={e=>{ e.preventDefault(); void submitSignup(); }} className="space-y-4">
            <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Full name</label><Input value={name} onChange={setName} placeholder="Dr. Anita Sharma" icon={User} /></div>
            <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Email address</label><Input value={email} onChange={setEmail} placeholder="you@college.edu" icon={Mail} /></div>
            <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Password</label><Input value={pw} onChange={setPw} type="password" placeholder="At least 6 characters" icon={Lock} /></div>
            {error && <div className="rounded-xl border px-3 py-2 text-sm font-medium" style={{background:C.red50,borderColor:C.red100,color:C.red500}}>{error}</div>}
            {message && <div className="rounded-xl border px-3 py-2 text-sm font-medium" style={{background:C.olive50,borderColor:C.olive100,color:C.olive500}}>{message}</div>}
            <Btn variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Btn>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{background:C.border}} />
            <span className="text-xs font-semibold uppercase" style={{color:C.textMuted}}>or</span>
            <div className="h-px flex-1" style={{background:C.border}} />
          </div>

          <button type="button" onClick={submitGoogleLogin} disabled={googleLoading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-[10px] border bg-white px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{borderColor:C.border,color:C.textPrimary}}>
            <GoogleIcon />
            {googleLoading ? "Opening Google..." : "Sign up with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage({ onBack }: { onBack:()=>void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background:C.bg}}>
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-70" style={{color:C.blue200}}>
          <ChevronLeft size={16} />Back to sign in
        </button>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{background:C.blue50}}>
          <Key size={24} style={{color:C.blue200}} />
        </div>
        <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Forgot password?</h1>
        <p className="text-sm mb-6" style={{color:C.textSecondary}}>Enter your work email and we'll send a reset link.</p>
        {sent ? (
          <div className="rounded-2xl p-5 text-center border" style={{background:C.olive50, borderColor:C.olive100}}>
            <CheckCircle size={32} className="mx-auto mb-3" style={{color:C.olive300}} />
            <p className="font-bold mb-1" style={{color:C.olive500}}>Reset link sent!</p>
            <p className="text-sm" style={{color:C.olive300}}>Check your email inbox and follow the instructions.</p>
          </div>
        ) : (
          <form onSubmit={e=>{e.preventDefault(); setSent(true);}} className="space-y-4">
            <Input value={email} onChange={setEmail} placeholder="you@college.edu" icon={Mail} />
            <Btn variant="primary" size="lg" className="w-full justify-center">Send Reset Link</Btn>
          </form>
        )}
      </div>
    </div>
  );
}

function ResetPasswordPage({ onBack }: { onBack:()=>void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background:C.bg}}>
      <div className="w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{background:C.blue50}}>
          <Lock size={24} style={{color:C.blue200}} />
        </div>
        <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Set new password</h1>
        <p className="text-sm mb-6" style={{color:C.textSecondary}}>Must be at least 8 characters with uppercase, number, and symbol.</p>
        <form onSubmit={e=>{e.preventDefault(); onBack();}} className="space-y-4">
          <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>New Password</label><Input value={pw} onChange={setPw} type="password" placeholder="Enter new password" icon={Lock} /></div>
          <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Confirm Password</label><Input type="password" placeholder="Confirm new password" icon={Lock} /></div>
          <Btn variant="primary" size="lg" className="w-full justify-center">Update Password</Btn>
        </form>
      </div>
    </div>
  );
}

// ─── HOD Dashboard ────────────────────────────────────────────────────────────
function HODDashboard({ onPage }: { onPage:(p:AppPage)=>void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Good morning, Dr. Sharma 👋</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Monday, 30 June 2026 · Computer Science Department</p>
        </div>
        <div className="flex gap-3">
          <Btn variant="outline" size="sm" icon={RefreshCw}>Refresh</Btn>
          <Btn variant="primary" size="sm" icon={Plus}>Quick Action</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="Total Faculty"     value={47}  sub="Across 8 depts"   icon={Users}       iconBg={C.blue50}  iconColor={C.blue200}  />
        <StatCard label="Departments"       value={8}   sub="Active this sem"  icon={Building2}   iconBg={C.blue50}  iconColor={C.blue200}  />
        <StatCard label="Active Tasks"      value={23}  sub="5 high priority"  icon={CheckSquare} iconBg={C.olive50} iconColor={C.olive300} />
        <StatCard label="Pending Approvals" value={5}   sub="Needs review"     icon={UserCheck}   iconBg={C.red50}   iconColor={C.red300}   />
        <StatCard label="Meetings Today"    value={3}   sub="Next: 10:00 AM"   icon={Video}       iconBg={C.sky50}   iconColor={C.sky300}   />
        <StatCard label="Documents"         value={142} sub="12 new this week" icon={FileText}    iconBg={C.blue50}  iconColor={C.blue200}  />
        <StatCard label="Announcements"     value={12}  sub="3 pinned"         icon={Megaphone}   iconBg={C.sky50}   iconColor={C.sky300}   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <ChartCard title="Faculty Workload (hrs/week)">
          <ResponsiveContainer width="100%" height={140}>
            <RBar data={workloadData} barSize={20}>
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
            <RLine data={taskTrendData}>
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
            <RArea data={uploadTrendData}>
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
              <Pie data={deptDistData} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={3}>
                {deptDistData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
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
            {ANNOUNCEMENTS_DATA.slice(0,3).map(a=>(
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
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Upcoming Meetings" action={
            <button onClick={()=>onPage("meetings")} className="flex items-center gap-1 text-xs font-bold hover:opacity-70" style={{color:C.blue200}}>View all <ArrowRight size={12} /></button>
          } />
          <div className="space-y-3">
            {MEETINGS_DATA.filter(m=>m.status==="Upcoming").map(m=>(
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
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Pending Approvals" />
            <div className="space-y-2">
              {[{label:"Faculty Leave Request",sub:"Vikram Singh · Jun 30"},{label:"Document Upload Review",sub:"NAAC Report · Needs HOD sign"},{label:"Task Reassignment",sub:"Lab Inventory · Unassigned"}].map((item,i)=>(
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border" style={{background:C.bg,borderColor:C.border}}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{color:C.textPrimary}}>{item.label}</p>
                    <p className="text-[10px]" style={{color:C.textMuted}}>{item.sub}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:C.olive50}}><CheckCircle size={11} style={{color:C.olive300}} /></button>
                    <button className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:C.red50}}><X size={11} style={{color:C.red300}} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="rounded-2xl p-5 border" style={{background:`linear-gradient(135deg,${C.blue600},${C.blue500})`, borderColor:C.blue600}}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} style={{color:C.pink200}} />
              <p className="text-sm font-bold text-white">AI Insights</p>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-black" style={{background:C.pink50,color:C.pink400}}>Live</span>
            </div>
            {["3 faculty above 120% workload threshold","Task completion rate improved 12% this month","2 critical deadlines in the next 48 hours"].map((t,i)=>(
              <p key={i} className="text-xs leading-relaxed mt-1.5" style={{color:C.blue100}}>
                <span style={{color:C.blue200}}>› </span>{t}
              </p>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-5">
        <SectionHeader title="Department Activity Feed" subtitle="Real-time actions across all departments" action={<Btn variant="ghost" size="sm">View all</Btn>} />
        <div className="space-y-3">
          {[
            {who:"Prof. Rajan Mehta", action:"uploaded",           what:"Faculty Workload Distribution — Semester II",      time:"2h ago"},
            {who:"Dr. Priya Nair",    action:"completed task",      what:"Faculty Feedback Analysis — Semester I",           time:"4h ago"},
            {who:"Admin Office",      action:"posted announcement", what:"New Faculty Onboarding — Orientation Program",     time:"6h ago"},
            {who:"Dr. Anita Sharma",  action:"scheduled meeting",   what:"Department Faculty Meeting — July Curriculum",     time:"1d ago"},
            {who:"Quality Cell",      action:"uploaded",            what:"NAAC Accreditation Report — Self Study Document",  time:"1d ago"},
          ].map((item,i)=>(
            <div key={i} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{borderColor:C.bg}}>
              <Avatar name={item.who} size="sm" />
              <p className="flex-1 text-xs" style={{color:C.textSecondary}}>
                <span className="font-bold" style={{color:C.textPrimary}}>{item.who}</span> {item.action} <span style={{color:C.gray400}}>{item.what}</span>
              </p>
              <p className="text-[10px] flex-shrink-0" style={{color:C.textDisabled}}>{item.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Coordinator Dashboard ────────────────────────────────────────────────────
function CoordinatorDashboard({ onPage }: { onPage:(p:AppPage)=>void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Good morning, Prof. Mehta 👋</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Monday, 30 June 2026 · Department Coordinator</p>
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
        <Card className="p-5">
          <SectionHeader title="Today's Schedule" subtitle="Monday, June 30" />
          <div className="space-y-3">
            {[
              {time:"09:00",title:"Faculty Sync — Quick Standup",         type:"meeting",done:true},
              {time:"10:30",title:"Review NAAC Document Submissions",     type:"task",   done:false},
              {time:"14:00",title:"Research Committee Meeting",           type:"meeting",done:false},
              {time:"16:00",title:"Submit Q2 Performance Reports",        type:"task",   done:false},
            ].map((item,i)=>(
              <div key={i} className={cn("flex gap-3 items-start pb-3 border-b last:border-0 last:pb-0",item.done&&"opacity-40")} style={{borderColor:C.bg}}>
                <span className="text-xs font-mono pt-0.5 w-12 flex-shrink-0" style={{color:C.textMuted}}>{item.time}</span>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:item.type==="meeting"?C.blue200:C.olive300}} />
                <p className={cn("text-xs font-semibold",item.done&&"line-through")} style={{color:C.textPrimary}}>{item.title}</p>
              </div>
            ))}
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
          <div className="rounded-2xl p-4 border" style={{background:C.sky50,borderColor:C.sky100}}>
            <div className="flex items-center gap-2 mb-2">
              <Bot size={13} style={{color:C.sky300}} />
              <p className="text-xs font-bold" style={{color:C.sky500}}>AI Recommendations</p>
            </div>
            {["2 tasks nearing deadlines","Reschedule July 5 meeting — 3 conflicts","5 documents pending AI summary"].map((r,i)=>(
              <p key={i} className="text-xs mt-1" style={{color:C.sky400}}>· {r}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Faculty Dashboard ────────────────────────────────────────────────────────
function FacultyDashboard({ onPage }: { onPage:(p:AppPage)=>void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Good morning, Dr. Nair 👋</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Monday, 30 June 2026 · Faculty · Computer Science</p>
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
            {TASKS_DATA.filter(t=>t.assignee==="Dr. Priya Nair").map(t=>(
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

// ─── Faculty Management ───────────────────────────────────────────────────────
function FacultyPage({ role }: { role:Role }) {
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
function AnnouncementsPage({ role }: { role:Role }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [view, setView] = useState<"grid"|"list">("grid");
  const [selected, setSelected] = useState<Announcement|null>(null);
  const canCreate = role !== "faculty";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Announcements</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Department-wide notices and updates</p>
        </div>
        {canCreate && <Btn variant="primary" size="sm" icon={Plus}>Create Announcement</Btn>}
      </div>
      <FilterBar>
        <Input placeholder="Search announcements..." value={search} onChange={setSearch} icon={Search} className="flex-1 min-w-48" />
        <Select options={["All Categories","Academic","Examination","HR","Research","Facilities"]} value={category} onChange={setCategory} />
        <Input placeholder="Date range..." icon={Calendar} className="w-44" />
        <div className="ml-auto flex border rounded-[10px] overflow-hidden" style={{borderColor:C.border}}>
          {[["grid",LayoutGrid],["list",List]].map(([v,Icon]:any)=>(
            <button key={v} onClick={()=>setView(v)} className="px-3 py-2"
              style={view===v?{background:C.blue500,color:"#fff"}:{background:"#fff",color:C.textMuted}}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </FilterBar>

      <div className={cn(view==="grid"?"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4":"space-y-3")}>
        {ANNOUNCEMENTS_DATA.map(a=>(
          <Card key={a.id} className="p-5" onClick={()=>setSelected(a)}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge label={a.category} />
                {a.pinned && <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:C.blue50,color:C.blue500}}><Pin size={9}/>Pinned</span>}
              </div>
              {canCreate && <button onClick={e=>e.stopPropagation()}><MoreHorizontal size={15} style={{color:C.textMuted}} /></button>}
            </div>
            <h3 className="text-sm font-bold leading-snug mb-3 line-clamp-2" style={{color:C.textPrimary}}>{a.title}</h3>
            <div className="mb-3 p-3 rounded-xl border" style={{background:C.sky50,borderColor:C.sky100}}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={10} style={{color:C.pink200}} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{color:C.sky400}}>AI Summary</span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed" style={{color:C.sky500}}>{a.summary}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name={a.postedBy} size="sm" />
                <div>
                  <p className="text-xs font-bold" style={{color:C.textPrimary}}>{a.postedBy}</p>
                  <p className="text-[10px]" style={{color:C.textMuted}}>{a.department} · {a.date}</p>
                </div>
              </div>
              {a.hasAttachment && <Paperclip size={13} style={{color:C.textMuted}} />}
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <Modal title={selected.title} onClose={()=>setSelected(null)}
          footer={<><Btn variant="outline" onClick={()=>setSelected(null)}>Close</Btn>{canCreate&&<Btn variant="primary" icon={Pencil}>Edit</Btn>}</>}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2"><CategoryBadge label={selected.category} /><CategoryBadge label={selected.department} />{selected.pinned&&<CategoryBadge label="📌 Pinned" />}</div>
            <div className="flex items-center gap-3 pb-3 border-b" style={{borderColor:C.border}}>
              <Avatar name={selected.postedBy} size="sm" />
              <div><p className="text-sm font-bold" style={{color:C.textPrimary}}>{selected.postedBy}</p><p className="text-xs" style={{color:C.textMuted}}>{selected.date}</p></div>
            </div>
            <div className="p-4 rounded-2xl border" style={{background:C.sky50,borderColor:C.sky100}}>
              <div className="flex items-center gap-1.5 mb-2"><Sparkles size={12} style={{color:C.pink200}} /><span className="text-xs font-black" style={{color:C.sky500}}>AI Summary</span></div>
              <p className="text-sm" style={{color:C.sky500}}>{selected.summary}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-2" style={{color:C.textMuted}}>Full Content</p>
              <div className="rounded-2xl p-4 min-h-24 text-sm leading-relaxed border" style={{background:C.bg,borderColor:C.border,color:C.textSecondary}}>
                This is the full announcement content. All relevant faculty are expected to take note and comply accordingly. Further details are available upon request from the department office.
              </div>
            </div>
            {selected.hasAttachment && (
              <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{background:C.bg,borderColor:C.border}}>
                <FileTypeIcon type="pdf" />
                <div className="flex-1"><p className="text-xs font-bold" style={{color:C.textPrimary}}>Attached Document.pdf</p><p className="text-[10px]" style={{color:C.textMuted}}>2.4 MB</p></div>
                <Btn variant="ghost" size="sm" icon={Download}>Download</Btn>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Meetings ─────────────────────────────────────────────────────────────────
function MeetingsPage({ role }: { role:Role }) {
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
        {MEETINGS_DATA.filter(m=>m.status===tab).map(m=>(
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
        {MEETINGS_DATA.filter(m=>m.status===tab).length===0 && (
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
              {FACULTY_DATA.slice(0,5).map(f=>(
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{borderColor:C.border}}>
                  <Avatar name={f.name} size="sm" />
                  <div className="flex-1"><p className="text-xs font-bold" style={{color:C.textPrimary}}>{f.name}</p><p className="text-[10px]" style={{color:C.textMuted}}>{f.designation}</p></div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{color:C.olive300}}>
                    <CheckCircle size={13} style={{color:C.olive300}} />Present
                  </div>
                </div>
              ))}
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
function DocumentsPage() {
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
          {DOCUMENTS_DATA.map(d=>(
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
function TasksPage({ role }: { role:Role }) {
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
function AIKnowledgePage() {
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
                : <Avatar name="Dr. Anita Sharma" size="sm" className="flex-shrink-0" />
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
function ReportsPage() {
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
function DepartmentPage({ role }: { role:Role }) {
  const [tab, setTab] = useState("Overview");
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Department</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Computer Science Department · EST. 2001</p>
        </div>
        {role==="hod" && <Btn variant="primary" size="sm" icon={Pencil}>Edit Department</Btn>}
      </div>
      <div className="rounded-2xl p-6 mb-5 text-white shadow-md" style={{background:`linear-gradient(135deg,${C.blue600},${C.blue500} 60%,${C.blue400})`}}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.1)"}}>
            <Building2 size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black">Department of Computer Science</h2>
            <p className="text-sm mt-0.5" style={{color:C.blue100}}>School of Engineering & Technology</p>
          </div>
          <div className="ml-auto grid grid-cols-4 gap-8 text-center">
            {[{label:"Faculty",val:"14"},{label:"Students",val:"420"},{label:"Programs",val:"4"},{label:"Research",val:"28"}].map(({label,val})=>(
              <div key={label}>
                <p className="text-2xl font-black" style={{color:C.blue100}}>{val}</p>
                <p className="text-xs" style={{color:C.blue200}}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Tabs tabs={["Overview","Coordinator","Faculty","Statistics","Activity"]} active={tab} onChange={setTab} />
      {tab==="Overview" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>About</p>
              <p className="text-sm leading-relaxed" style={{color:C.textSecondary}}>The Department of Computer Science offers undergraduate and postgraduate programs in computing, software engineering, and AI. Established in 2001, the department maintains excellence in teaching, research, and industry collaboration.</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Programs Offered</p>
              <div className="grid grid-cols-2 gap-3">
                {["B.Tech — Computer Science & Eng.","M.Tech — Computer Science","BCA — Computer Applications","PhD — Computer Science"].map(p=>(
                  <div key={p} className="p-3 rounded-xl border text-xs font-semibold" style={{background:C.bg,borderColor:C.border,color:C.textPrimary}}>{p}</div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Head of Department</p>
              <div className="flex items-center gap-3">
                <Avatar name="Dr. Anita Sharma" size="lg" />
                <div><p className="font-black text-sm" style={{color:C.blue600}}>Dr. Anita Sharma</p><p className="text-xs" style={{color:C.textMuted}}>Professor, HOD</p><p className="text-xs mt-0.5" style={{color:C.blue200}}>anita.sharma@college.edu</p></div>
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Coordinator</p>
              <div className="flex items-center gap-3">
                <Avatar name="Prof. Rajan Mehta" size="lg" />
                <div><p className="font-black text-sm" style={{color:C.blue600}}>Prof. Rajan Mehta</p><p className="text-xs" style={{color:C.textMuted}}>Assoc. Professor</p><p className="text-xs mt-0.5" style={{color:C.blue200}}>rajan.mehta@college.edu</p></div>
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Quick Stats</p>
              <div className="space-y-2">
                {[{label:"NAAC Grade",val:"A+"},{label:"Research Papers (2025–26)",val:"34"},{label:"Placement Rate",val:"92%"},{label:"Lab Facilities",val:"6 Labs"}].map(({label,val})=>(
                  <div key={label} className="flex justify-between py-2 border-b last:border-0 text-xs" style={{borderColor:C.bg}}>
                    <span style={{color:C.textMuted}}>{label}</span>
                    <span className="font-black" style={{color:C.blue500}}>{val}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      {tab!=="Overview" && <EmptyState icon={Layers} title={`${tab} view`} description={`Detailed ${tab.toLowerCase()} information for the department.`} />}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const unread = NOTIFICATIONS_DATA.filter(n=>!n.read);
  const todayRead = NOTIFICATIONS_DATA.filter(n=>n.read&&(n.time.includes("hr")||n.time.includes("min")));
  const earlier = NOTIFICATIONS_DATA.filter(n=>n.time.includes("day"));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Notifications</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>{unread.length} unread notifications</p>
        </div>
        <div className="flex gap-3">
          <Btn variant="ghost" size="sm" icon={CheckCircle}>Mark all read</Btn>
          <Btn variant="ghost" size="sm" icon={Settings}>Preferences</Btn>
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        {["All","Announcements","Tasks","Meetings","Documents","AI"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="px-3 py-1.5 rounded-xl text-xs font-bold border"
            style={f===filter?{background:C.blue500,color:"#fff",borderColor:C.blue500}:{borderColor:C.border,color:C.textSecondary}}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-6 max-w-2xl">
        {unread.length>0 && (
          <div>
            <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.blue200}}>Unread · {unread.length}</p>
            <div className="space-y-2">
              {unread.map(n=>(
                <Card key={n.id} className="p-4" style={{borderLeft:`3px solid ${C.blue200}`}}>
                  <div className="flex gap-3">
                    <NotifIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold" style={{color:C.textPrimary}}>{n.title}</p>
                        <p className="text-[10px] flex-shrink-0 whitespace-nowrap" style={{color:C.textMuted}}>{n.time}</p>
                      </div>
                      <p className="text-xs mt-0.5" style={{color:C.textSecondary}}>{n.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {todayRead.length>0 && (
          <div>
            <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Today</p>
            <div className="space-y-2">
              {todayRead.map(n=>(
                <Card key={n.id} className="p-4">
                  <div className="flex gap-3">
                    <NotifIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold" style={{color:C.textPrimary}}>{n.title}</p>
                        <p className="text-[10px] flex-shrink-0" style={{color:C.textDisabled}}>{n.time}</p>
                      </div>
                      <p className="text-xs mt-0.5" style={{color:C.textMuted}}>{n.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {earlier.length>0 && (
          <div>
            <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Earlier</p>
            <div className="space-y-2">
              {earlier.map(n=>(
                <Card key={n.id} className="p-4">
                  <div className="flex gap-3">
                    <NotifIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium" style={{color:C.textSecondary}}>{n.title}</p>
                        <p className="text-[10px] flex-shrink-0" style={{color:C.textDisabled}}>{n.time}</p>
                      </div>
                      <p className="text-xs mt-0.5" style={{color:C.textMuted}}>{n.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfilePage() {
  const [tab, setTab] = useState("Personal Info");
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black mb-6" style={{color:C.blue600}}>My Profile</h1>
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar name="Dr. Anita Sharma" size="xl" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-white" style={{background:C.blue200}}>
              <Pencil size={11} />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-black" style={{color:C.blue600}}>Dr. Anita Sharma</h2>
            <p className="text-sm" style={{color:C.textSecondary}}>Professor · Head of Department</p>
            <p className="text-sm" style={{color:C.textMuted}}>Computer Science · Joined August 2015</p>
          </div>
          <div className="ml-auto"><Btn variant="outline" size="sm" icon={Pencil}>Edit Profile</Btn></div>
        </div>
      </Card>
      <Tabs tabs={["Personal Info","Security","Preferences"]} active={tab} onChange={setTab} />
      {tab==="Personal Info" && (
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-wide mb-4" style={{color:C.textMuted}}>Basic Information</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {label:"Full Name",val:"Dr. Anita Sharma",icon:User},
              {label:"Employee ID",val:"EMP-0001",icon:Hash},
              {label:"Designation",val:"Professor",icon:Award},
              {label:"Department",val:"Computer Science",icon:Building2},
              {label:"Email",val:"anita.sharma@college.edu",icon:Mail},
              {label:"Phone",val:"+91 98765 43210",icon:Phone},
              {label:"Office",val:"Room 204, Dept. Block A",icon:MapPin},
              {label:"Joined",val:"01 August 2015",icon:Calendar},
            ].map(({label,val,icon:Icon})=>(
              <div key={label} className="flex items-center gap-3 p-3 rounded-2xl border" style={{background:C.bg,borderColor:C.border}}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:C.blue50}}>
                  <Icon size={14} style={{color:C.blue200}} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{color:C.textMuted}}>{label}</p>
                  <p className="text-sm font-bold truncate" style={{color:C.textPrimary}}>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {tab==="Security" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wide mb-4" style={{color:C.textMuted}}>Change Password</p>
            <div className="space-y-3 max-w-sm">
              <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Current Password</label><Input type="password" placeholder="••••••••" icon={Lock} /></div>
              <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>New Password</label><Input type="password" placeholder="••••••••" icon={Lock} /></div>
              <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Confirm Password</label><Input type="password" placeholder="••••••••" icon={Lock} /></div>
              <Btn variant="primary">Update Password</Btn>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-bold" style={{color:C.textPrimary}}>Two-Factor Authentication</p><p className="text-xs mt-0.5" style={{color:C.textMuted}}>Add an extra layer of security</p></div>
              <Btn variant="outline" size="sm">Enable 2FA</Btn>
            </div>
          </Card>
        </div>
      )}
      {tab==="Preferences" && (
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-wide mb-4" style={{color:C.textMuted}}>Notification Preferences</p>
          <div className="space-y-3">
            {["Email notifications","Push notifications","Weekly digest","Announcement alerts","Task reminders","Meeting reminders"].map(pref=>(
              <div key={pref} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{borderColor:C.bg}}>
                <p className="text-sm font-semibold" style={{color:C.textPrimary}}>{pref}</p>
                <div className="w-10 h-6 rounded-full flex items-center px-1 cursor-pointer" style={{background:C.blue200}}>
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [section, setSection] = useState("Appearance");
  const sections = ["Appearance","Notifications","Language & Region","Account","Privacy","Accessibility"];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-black mb-6" style={{color:C.blue600}}>Settings</h1>
      <div className="flex gap-6">
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {sections.map(s=>(
              <button key={s} onClick={()=>setSection(s)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={s===section?{background:C.blue500,color:"#fff"}:{color:C.textSecondary}}
                onMouseEnter={e=>{ if(s!==section) hov(e.currentTarget,C.blue50,C.blue500); }}
                onMouseLeave={e=>{ if(s!==section) unhov(e.currentTarget,"transparent",C.textSecondary); }}>
                {s}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 max-w-xl space-y-4">
          {section==="Appearance" && <>
            <Card className="p-5">
              <p className="text-sm font-bold mb-4" style={{color:C.textPrimary}}>Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {["Light","Dark","System"].map(t=>(
                  <div key={t} className="p-4 rounded-2xl border-2 cursor-pointer text-center"
                    style={t==="Light"?{borderColor:C.blue200,background:C.blue50}:{borderColor:C.border}}>
                    <div className="w-8 h-8 rounded-xl mx-auto mb-2"
                      style={{background:t==="Dark"?C.blue600:t==="System"?`linear-gradient(135deg,#fff 50%,${C.blue500} 50%)`:"#fff",border:t==="Light"?`1px solid ${C.border}`:"none"}} />
                    <p className="text-xs font-bold" style={{color:t==="Light"?C.blue500:C.textPrimary}}>{t}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <p className="text-sm font-bold mb-4" style={{color:C.textPrimary}}>Density</p>
              <div className="grid grid-cols-3 gap-3">
                {["Compact","Comfortable","Spacious"].map(d=>(
                  <div key={d} className="p-3 rounded-xl border-2 cursor-pointer text-center"
                    style={d==="Comfortable"?{borderColor:C.blue200}:{borderColor:C.border}}>
                    <p className="text-xs font-bold" style={{color:d==="Comfortable"?C.blue500:C.textSecondary}}>{d}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>}
          {section==="Language & Region" && (
            <Card className="p-5">
              <p className="text-sm font-bold mb-4" style={{color:C.textPrimary}}>Language & Region</p>
              <div className="space-y-4">
                <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Interface Language</label><Select options={["English (US)","English (UK)","Hindi","Tamil","Telugu"]} className="w-full" /></div>
                <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Date Format</label><Select options={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"]} className="w-full" /></div>
                <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Time Zone</label><Select options={["Asia/Kolkata (IST +5:30)","UTC","US/Eastern"]} className="w-full" /></div>
              </div>
            </Card>
          )}
          {!["Appearance","Language & Region"].includes(section) && (
            <EmptyState icon={Settings} title={`${section} Settings`} description={`Configure your ${section.toLowerCase()} preferences here.`} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Help ─────────────────────────────────────────────────────────────────────
function HelpPage() {
  const [search, setSearch] = useState("");
  const faqs = [
    {q:"How do I create a new announcement?",  a:"Navigate to Announcements → Click 'Create Announcement' → Fill in the form and publish."},
    {q:"How do I schedule a meeting?",         a:"Go to Meetings → Click 'Schedule Meeting' → Set agenda, participants, date, and time."},
    {q:"How do I upload documents?",           a:"Navigate to Documents → Click 'Upload Document' → Select file and choose category."},
    {q:"How does AI Knowledge work?",          a:"AI Knowledge queries your department's documents, meetings, and announcements to answer questions."},
    {q:"How do I assign tasks?",              a:"Go to Tasks → Create Task → Assign to a faculty member with deadline and priority."},
    {q:"How do I export reports?",            a:"Navigate to Reports (HOD only) → Select report type → Click Export PDF or Export Excel."},
  ];
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black mb-2" style={{color:C.blue600}}>Help & Support</h1>
      <p className="text-sm mb-6" style={{color:C.textSecondary}}>Find answers, guides, and support resources</p>
      <Input placeholder="Search help articles..." value={search} onChange={setSearch} icon={Search} className="mb-6" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{icon:BookOpen,title:"Documentation",desc:"Full user guide"},{icon:Video,title:"Video Tutorials",desc:"Step-by-step videos"},{icon:MessageSquare,title:"Contact Support",desc:"Get help from IT"}].map(({icon:Icon,title,desc})=>(
          <Card key={title} className="p-5 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background:C.blue50}}>
              <Icon size={22} style={{color:C.blue200}} />
            </div>
            <p className="text-sm font-black" style={{color:C.textPrimary}}>{title}</p>
            <p className="text-xs mt-0.5" style={{color:C.textMuted}}>{desc}</p>
          </Card>
        ))}
      </div>
      <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Frequently Asked Questions</p>
      <div className="space-y-2">
        {faqs.map((faq,i)=>(
          <Card key={i} className="overflow-hidden">
            <details className="group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none"
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.bg}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                <p className="text-sm font-bold" style={{color:C.textPrimary}}>{faq.q}</p>
                <ChevronDown size={16} style={{color:C.blue200}} className="group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-5 pb-4 text-sm border-t leading-relaxed" style={{borderColor:C.border,color:C.textSecondary}}>{faq.a}</div>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Error Pages ──────────────────────────────────────────────────────────────
function ErrorPage({ code, title, description, onBack }: { code:string; title:string; description:string; onBack:()=>void }) {
  const styles: Record<string,{bg:string;text:string;border:string}> = {
    "404": {bg:C.blue50,  text:C.blue200,  border:C.blue100},
    "403": {bg:C.pink50,  text:C.pink300,  border:C.pink100},
    "500": {bg:C.red50,   text:C.red300,   border:C.red100},
  };
  const s = styles[code] ?? styles["404"];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-48 h-36 rounded-3xl flex items-center justify-center mb-8 border-2" style={{background:s.bg,borderColor:s.border}}>
        <p className="text-6xl font-black" style={{color:s.text}}>{code}</p>
      </div>
      <h1 className="text-2xl font-black mb-2" style={{color:C.blue600}}>{title}</h1>
      <p className="text-sm max-w-sm mb-8 leading-relaxed" style={{color:C.textSecondary}}>{description}</p>
      <div className="flex gap-3">
        <Btn variant="outline" onClick={onBack} icon={ChevronLeft}>Go Back</Btn>
        <Btn variant="primary" onClick={onBack} icon={Home}>Go to Dashboard</Btn>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App({ initialPage }: { initialPage?: AppPage }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [view, setView]           = useState<ViewMode>("auth");
  const [authPage, setAuthPage]   = useState<AuthView>("login");
  const [role, setRole]           = useState<Role>("hod");
  const [page, setPage]           = useState<AppPage>(initialPage ?? "dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigateTo = (p: AppPage) => {
    setPage(p);
    const path = p === "dashboard" ? "/" : `/${p}`;
    try { router.push(path); } catch (e) { /* noop during build-time */ }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth Error:", error.message);
      alert(`Error signing in: ${error.message}`);
    }
  };

  const handleLogin = async (email:string, password:string) => {
    if (!email || !password) return "Enter your email and password.";

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return error.message;
    if (data.user) openAppForUser(data.user);
    return null;
  };

  const handleSignup = async (name:string, email:string, password:string) => {
    if (!name || !email || !password) return "Enter your name, email, and password.";
    if (password.length < 6) return "Password must be at least 6 characters.";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: name, role },
      },
    });

    if (error) return error.message;
    if (data.session?.user) openAppForUser(data.session.user);
    return null;
  };

  const openAppForUser = (authUser: SupabaseUser) => {
    setUser(authUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
    setView("app");
  };

  const handleRoleChange = (r:Role) => {
    setRole(r);
    if (typeof window !== "undefined") window.localStorage.setItem(ROLE_STORAGE_KEY, r);
    navigateTo("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthPage("login");
    setView("auth");
    navigateTo("dashboard");
  };

  useEffect(()=>{ if(initialPage) setPage(initialPage); }, [initialPage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (isRole(storedRole)) setRole(storedRole);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        openAppForUser(data.user);
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setView("auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        openAppForUser(session.user);
      } else {
        setUser(null);
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setView("auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [initialPage, supabase]);

  if(view==="auth") {
    if(authPage==="forgot") return <ForgotPasswordPage onBack={()=>setAuthPage("login")} />;
    if(authPage==="reset")  return <ResetPasswordPage  onBack={()=>setAuthPage("login")} />;
    if(authPage==="signup") return <SignupPage onSignup={handleSignup} onGoogleLogin={handleGoogleLogin} onBack={()=>setAuthPage("login")} onRoleChange={handleRoleChange} role={role} />;
    return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onForgot={()=>setAuthPage("forgot")} onSignup={()=>setAuthPage("signup")} onRoleChange={handleRoleChange} role={role} />;
  }

  const Dashboard = role==="hod" ? HODDashboard : role==="coordinator" ? CoordinatorDashboard : FacultyDashboard;

  const renderPage = () => {
    switch(page) {
      case "dashboard":     return <Dashboard onPage={navigateTo} />;
      case "faculty":       return <FacultyPage role={role} />;
      case "announcements": return <AnnouncementsPage role={role} />;
      case "meetings":      return <MeetingsPage role={role} />;
      case "documents":     return <DocumentsPage />;
      case "tasks":         return <TasksPage role={role} />;
      case "ai-knowledge":  return <AIKnowledgePage />;
      case "reports":
        if(role!=="hod") return <ErrorPage code="403" title="Access Restricted" description="Reports are available to Head of Department only." onBack={()=>navigateTo("dashboard")} />;
        return <ReportsPage />;
      case "department":    return <DepartmentPage role={role} />;
      case "notifications": return <NotificationsPage />;
      case "profile":       return <ProfilePage />;
      case "settings":      return <SettingsPage />;
      case "help":          return <HelpPage />;
      case "e404": return <ErrorPage code="404" title="Page Not Found"        description="The page you're looking for doesn't exist or has been moved." onBack={()=>setPage("dashboard")} />;
      case "e403": return <ErrorPage code="403" title="Access Forbidden"      description="You don't have permission to access this page."              onBack={()=>setPage("dashboard")} />;
      case "e500": return <ErrorPage code="500" title="Internal Server Error" description="Something went wrong on our end. Please try again."          onBack={()=>setPage("dashboard")} />;
      default:              return <Dashboard onPage={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{background:C.bg, fontFamily:"'Inter',system-ui,sans-serif"}}>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 z-50">
            <Sidebar role={role} page={page} onPage={p=>{ navigateTo(p); setMobileOpen(false); }} collapsed={false} onCollapse={()=>setMobileOpen(false)} onRoleChange={handleRoleChange} />
          </div>
        </div>
      )}

      <div className="hidden md:flex">
        <Sidebar role={role} page={page} onPage={navigateTo} collapsed={collapsed} onCollapse={()=>setCollapsed(!collapsed)} onRoleChange={handleRoleChange} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <TopNav role={role} page={page} onPage={navigateTo} onMenu={()=>setMobileOpen(true)} onLogout={()=>void handleLogout()} />

        {/* Demo bar */}
        <div className="border-b px-5 py-2 flex items-center gap-3 text-xs overflow-x-auto flex-shrink-0" style={{background:C.bg,borderColor:C.border}}>
          <span className="font-black uppercase tracking-widest flex-shrink-0" style={{color:C.textDisabled}}>Demo</span>
          {(["e404","e403","e500"] as AppPage[]).map(ep=>(
            <button key={ep} onClick={()=>setPage(ep)}
              className="px-2.5 py-1 rounded-lg bg-white border font-bold flex-shrink-0"
              style={{borderColor:C.border,color:C.textSecondary}}
              onMouseEnter={e=>{ hov(e.currentTarget,"#fff",C.blue200); (e.currentTarget as HTMLElement).style.borderColor=C.blue200; }}
              onMouseLeave={e=>{ unhov(e.currentTarget,"#fff",C.textSecondary); (e.currentTarget as HTMLElement).style.borderColor=C.border; }}>
              {ep.slice(1)} Error
            </button>
          ))}
          <span style={{color:C.border}}>|</span>
          <button onClick={()=>void handleLogout()}
            className="px-2.5 py-1 rounded-lg bg-white border font-bold flex-shrink-0"
            style={{borderColor:C.border,color:C.textSecondary}}
            onMouseEnter={e=>{ hov(e.currentTarget,"#fff",C.blue200); (e.currentTarget as HTMLElement).style.borderColor=C.blue200; }}
            onMouseLeave={e=>{ unhov(e.currentTarget,"#fff",C.textSecondary); (e.currentTarget as HTMLElement).style.borderColor=C.border; }}>
            ← Back to Login
          </button>
        </div>

        <main className={cn("flex-1 overflow-y-auto", page==="ai-knowledge" && "overflow-hidden")}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
