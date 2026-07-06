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

export function DepartmentPage({ role }: { role:Role }) {
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

