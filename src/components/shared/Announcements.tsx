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
import { cn, hov, unhov } from "@/lib/ui-utils";
import { Avatar, Btn, Card, CategoryBadge, ChartCard, Drawer, EmptyState, FileTypeIcon, FilterBar, Input, Modal, NotifIcon, Pagination, PriorityBadge, ProgressBar, SectionHeader, Select, StatCard, StatusBadge, Tabs } from "@/components/ui";

export function AnnouncementsPage({
  role,
  announcements = [],
  loading = false,
}: {
  role:Role;
  announcements?: Announcement[];
  loading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [view, setView] = useState<"grid"|"list">("grid");
  const [selected, setSelected] = useState<Announcement|null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Create Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Academic");
  const [newSummary, setNewSummary] = useState("");
  const [newDepartment, setNewDepartment] = useState("Computer Science");
  const [isPinned, setIsPinned] = useState(false);

  const canCreate = role !== "faculty";

  const handleCreateSubmit = () => {
    setShowCreateModal(false);
    setNewTitle("");
    setNewSummary("");
    setIsPinned(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Announcements</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Department-wide notices and updates</p>
        </div>
        {canCreate && (
          <Btn variant="primary" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Announcement
          </Btn>
        )}
      </div>

      <FilterBar>
        <Input placeholder="Search announcements..." value={search} onChange={setSearch} icon={Search} className="flex-1 min-w-48" />
        <Select options={["All Categories","Academic","Examination","HR","Research","Facilities"]} value={category} onChange={setCategory} />
        
        {/* Date Range Selector with Mini Calendar Dropdown */}
        <div className="relative">
          <div className="cursor-pointer" onClick={() => setShowCalendar(!showCalendar)}>
            <Input 
              placeholder={startDate && endDate ? `${startDate} to ${endDate}` : "Date range..."} 
              icon={Calendar} 
              className="w-48 pointer-events-none" 
            />
          </div>

          {showCalendar && (
            <div 
              className="absolute top-full mt-2 left-0 z-30 bg-white border rounded-2xl p-4 shadow-xl w-64 text-xs"
              style={{ borderColor: C.border }}
            >
              <div className="flex items-center justify-between mb-3 font-bold" style={{ color: C.textPrimary }}>
                <span>Filter by Date</span>
                <button onClick={() => setShowCalendar(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: C.textMuted }}>Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full border rounded-lg p-2 outline-none text-xs"
                    style={{ borderColor: C.border }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: C.textMuted }}>End Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full border rounded-lg p-2 outline-none text-xs"
                    style={{ borderColor: C.border }}
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: C.border }}>
                  <button 
                    onClick={() => { setStartDate(""); setEndDate(""); }}
                    className="text-[11px] font-medium"
                    style={{ color: C.textMuted }}
                  >
                    Clear
                  </button>
                  <Btn size="sm" variant="primary" onClick={() => setShowCalendar(false)}>
                    Apply
                  </Btn>
                </div>
              </div>
            </div>
          )}
        </div>

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
        {announcements.map(a=>(
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

        {!loading && announcements.length===0 && (
          <div className={cn(view==="grid" ? "col-span-full" : "")}>
            <EmptyState icon={Megaphone} title="No announcements found" description="Announcements from Supabase will appear here once records are available to this user." />
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <Modal 
          title="Create Announcement" 
          onClose={() => setShowCreateModal(false)}
          footer={
            <>
              <Btn variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={handleCreateSubmit}>Post Announcement</Btn>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Title</label>
              <Input placeholder="Enter announcement title..." value={newTitle} onChange={setNewTitle} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Category</label>
                <Select 
                  className="w-full"
                  options={["Academic","Examination","HR","Research","Facilities"]} 
                  value={newCategory} 
                  onChange={setNewCategory} 
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Department</label>
                <Input value={newDepartment} onChange={setNewDepartment} placeholder="Department name" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Summary / Content</label>
              <textarea 
                rows={3} 
                placeholder="Write announcement details..." 
                value={newSummary} 
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full text-xs border rounded-xl p-3 outline-none"
                style={{ borderColor: C.border, background: C.bg, color: C.textPrimary }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="pin-announcement" 
                checked={isPinned} 
                onChange={(e) => setIsPinned(e.target.checked)} 
                className="rounded border-gray-300"
              />
              <label htmlFor="pin-announcement" className="text-xs font-semibold cursor-pointer" style={{color:C.textPrimary}}>
                Pin this announcement to top
              </label>
            </div>
          </div>
        </Modal>
      )}

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