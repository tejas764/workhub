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

export function ErrorPage({ code, title, description, onBack }: { code:string; title:string; description:string; onBack:()=>void }) {
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

