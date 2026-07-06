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

export function NotificationsPage() {
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

