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

export function ProfilePage({ currentFaculty }: { currentFaculty:FacultyMember }) {
  const [tab, setTab] = useState("Personal Info");

  return (

    <div className="p-6 max-w-3xl">

      <h1 className="text-2xl font-black mb-6" style={{color:C.blue600}}>My Profile</h1>

      <Card className="p-6 mb-5">

        <div className="flex items-center gap-5">

          <div className="relative">

            <Avatar name={currentFaculty.name} size="xl" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-white" style={{background:C.blue200}}>

              <Pencil size={11} />

            </button>

          </div>

          <div>

            <h2 className="text-xl font-black" style={{color:C.blue600}}>{currentFaculty.name}</h2>
            <p className="text-sm" style={{color:C.textSecondary}}>{currentFaculty.designation} · {currentFaculty.role}</p>

            <p className="text-sm" style={{color:C.textMuted}}>{currentFaculty.department} · Joined {currentFaculty.joined}</p>

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

              {label:"Full Name",val:currentFaculty.name,icon:User},
              {label:"Employee ID",val:`EMP-${String(currentFaculty.id).padStart(4,"0")}`,icon:Hash},
              {label:"Designation",val:currentFaculty.designation,icon:Award},
              {label:"Department",val:currentFaculty.department,icon:Building2},
              {label:"Email",val:currentFaculty.email,icon:Mail},
              {label:"Phone",val:currentFaculty.phone,icon:Phone},
              {label:"Office",val:"Room 204, Dept. Block A",icon:MapPin},

              {label:"Joined",val:currentFaculty.joined,icon:Calendar},
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

              <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Current Password</label><Input type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" icon={Lock} /></div>

              <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>New Password</label><Input type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" icon={Lock} /></div>

              <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Confirm Password</label><Input type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" icon={Lock} /></div>

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



// â”€â”€â”€ Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


