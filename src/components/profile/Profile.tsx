import React, { useState, useEffect } from "react";
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

export function ProfilePage({ currentFaculty }: { currentFaculty: FacultyMember }) {
  const [tab, setTab] = useState("Personal Info");
  const [showEditModal, setShowEditModal] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: currentFaculty.name || "",
    designation: currentFaculty.designation || "Faculty",
    department: currentFaculty.department || "Computer Science",
    email: currentFaculty.email || "",
    phone: currentFaculty.phone || "",
    office: "Room 204, Dept. Block A",
  });

  // Sync state if currentFaculty prop changes initially
  useEffect(() => {
    setProfileData({
      name: currentFaculty.name || "",
      designation: currentFaculty.designation || "Faculty",
      department: currentFaculty.department || "Computer Science",
      email: currentFaculty.email || "",
      phone: currentFaculty.phone || "",
      office: "Room 204, Dept. Block A",
    });
  }, [currentFaculty]);

  const handleSaveProfile = () => {
    setShowEditModal(false);
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: C.blue600 }}>My Profile</h1>

      <Card className="p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar name={profileData.name} size="xl" />
            <button 
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white text-white" 
              style={{ background: C.blue200 }}
            >
              <Pencil size={11} />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-black" style={{ color: C.blue600 }}>{profileData.name}</h2>
            <p className="text-sm" style={{ color: C.textSecondary }}>{profileData.designation} · {currentFaculty.role}</p>
            <p className="text-sm" style={{ color: C.textMuted }}>{profileData.department} · Joined {currentFaculty.joined}</p>
          </div>

          <div className="ml-auto">
            <Btn variant="outline" size="sm" icon={Pencil} onClick={() => setShowEditModal(true)}>
              Edit Profile
            </Btn>
          </div>
        </div>
      </Card>

      <Tabs tabs={["Personal Info", "Security", "Preferences"]} active={tab} onChange={setTab} />

      {tab === "Personal Info" && (
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-wide mb-4" style={{ color: C.textMuted }}>Basic Information</p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Full Name", val: profileData.name, icon: User },
              { label: "Employee ID", val: `EMP-${String(currentFaculty.id).padStart(4, "0")}`, icon: Hash },
              { label: "Designation", val: profileData.designation, icon: Award },
              { label: "Department", val: profileData.department, icon: Building2 },
              { label: "Email", val: profileData.email, icon: Mail },
              { label: "Phone", val: profileData.phone || "Not added", icon: Phone },
              { label: "Office", val: profileData.office, icon: MapPin },
              { label: "Joined", val: currentFaculty.joined, icon: Calendar },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-2xl border" style={{ background: C.bg, borderColor: C.border }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.blue50 }}>
                  <Icon size={14} style={{ color: C.blue200 }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: C.textMuted }}>{label}</p>
                  <p className="text-sm font-bold truncate" style={{ color: C.textPrimary }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Security" && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-black uppercase tracking-wide mb-4" style={{ color: C.textMuted }}>Change Password</p>
            <div className="space-y-3 max-w-sm">
              <div>
                <label className="text-sm font-bold block mb-1.5" style={{ color: C.textPrimary }}>Current Password</label>
                <Input type="password" placeholder="••••••••" icon={Lock} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1.5" style={{ color: C.textPrimary }}>New Password</label>
                <Input type="password" placeholder="••••••••" icon={Lock} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1.5" style={{ color: C.textPrimary }}>Confirm Password</label>
                <Input type="password" placeholder="••••••••" icon={Lock} />
              </div>
              <Btn variant="primary">Update Password</Btn>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: C.textPrimary }}>Two-Factor Authentication</p>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>Add an extra layer of security</p>
              </div>
              <Btn variant="outline" size="sm">Enable 2FA</Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === "Preferences" && (
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-wide mb-4" style={{ color: C.textMuted }}>Notification Preferences</p>
          <div className="space-y-3">
            {["Email notifications", "Push notifications", "Weekly digest", "Announcement alerts", "Task reminders", "Meeting reminders"].map(pref => (
              <div key={pref} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: C.bg }}>
                <p className="text-sm font-semibold" style={{ color: C.textPrimary }}>{pref}</p>
                <div className="w-10 h-6 rounded-full flex items-center px-1 cursor-pointer" style={{ background: C.blue200 }}>
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <Modal
          title="Edit Profile"
          onClose={() => setShowEditModal(false)}
          footer={
            <>
              <Btn variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={handleSaveProfile}>Save Changes</Btn>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.textPrimary }}>Full Name</label>
              <Input 
                value={profileData.name} 
                onChange={(val) => setProfileData(p => ({ ...p, name: val }))} 
                placeholder="Enter full name" 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: C.textPrimary }}>Designation</label>
                <Select 
                  className="w-full"
                  options={["HOD", "Coordinator", "Faculty"]} 
                  value={profileData.designation} 
                  onChange={(val) => setProfileData(p => ({ ...p, designation: val }))} 
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: C.textPrimary }}>Department</label>
                <Select 
                  className="w-full"
                  options={[
                    "Computer Science", 
                    "Electronics & Mathematics", 
                    "Civil", 
                    "Physics", 
                    "Mechanical"
                  ]} 
                  value={profileData.department} 
                  onChange={(val) => setProfileData(p => ({ ...p, department: val }))} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: C.textPrimary }}>Email</label>
                <Input 
                  value={profileData.email} 
                  onChange={(val) => setProfileData(p => ({ ...p, email: val }))} 
                  placeholder="Email address" 
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: C.textPrimary }}>Phone</label>
                <Input 
                  value={profileData.phone} 
                  onChange={(val) => setProfileData(p => ({ ...p, phone: val }))} 
                  placeholder="Phone number" 
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.textPrimary }}>Office Location</label>
              <Input 
                value={profileData.office} 
                onChange={(val) => setProfileData(p => ({ ...p, office: val }))} 
                placeholder="Office room/block" 
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────