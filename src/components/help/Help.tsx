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

export function HelpPage() {
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

