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

export function SettingsPage() {
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

