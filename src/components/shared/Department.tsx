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

          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Computer Science Department Â· EST. 2001</p>

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

            {[{label:"Faculty",val:"0"},{label:"Students",val:"0"},{label:"Programs",val:"0"},{label:"Research",val:"0"}].map(({label,val})=>(

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

                {["B.Tech â€” Computer Science & Eng.","M.Tech â€” Computer Science","BCA â€” Computer Applications","PhD â€” Computer Science"].map(p=>(

                  <div key={p} className="p-3 rounded-xl border text-xs font-semibold" style={{background:C.bg,borderColor:C.border,color:C.textPrimary}}>{p}</div>

                ))}

              </div>

            </Card>

          </div>

          <div className="space-y-4">

            <Card className="p-5">

              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Head of Department</p>

              <EmptyState icon={UserCheck} title="No HOD assigned" description="The department HOD profile will appear here once it is connected." />

            </Card>

            <Card className="p-5">

              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Coordinator</p>

              <EmptyState icon={Users} title="No coordinator assigned" description="The department coordinator profile will appear here once it is connected." />

            </Card>

            <Card className="p-5">

              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Quick Stats</p>

              <EmptyState icon={BarChart2} title="No stats available" description="Department metrics will appear here once real reporting data is connected." />
            </Card>
          </div>

        </div>

      )}

      {tab!=="Overview" && <EmptyState icon={Layers} title={`${tab} view`} description={`Detailed ${tab.toLowerCase()} information for the department.`} />}

    </div>

  );

}



// â”€â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


