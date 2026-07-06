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
import type { AppPage, Role } from "@/types";
import { BOTTOM_NAV, C, NAV_CONFIG, ROLE_LABELS } from "@/constants";
import { hov, unhov } from "@/lib/ui-utils";
import { cn } from "@/lib/ui-utils";
import { Avatar } from "@/components/ui";

export function Sidebar({ role, page, onPage, collapsed, onCollapse, onRoleChange }: {
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
