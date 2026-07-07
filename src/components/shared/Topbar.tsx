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
import type { AppPage, FacultyMember, Role } from "@/types";
import { BREADCRUMBS, C, ROLE_LABELS } from "@/constants";
import { hov, unhov } from "@/lib/ui-utils";
import { Avatar } from "@/components/ui";

export function TopNav({ role, page, onPage, onMenu, onLogout, currentFaculty }: { role:Role; page:AppPage; onPage:(p:AppPage)=>void; onMenu:()=>void; onLogout:()=>void; currentFaculty:FacultyMember }) {
  const [search, setSearch] = useState("");
  const [showUser, setShowUser] = useState(false);
  const crumbs = BREADCRUMBS[page] ?? ["Home"];

  return (
    <header className="h-16 bg-white border-b flex items-center gap-4 px-5 flex-shrink-0" style={{borderColor:C.border}}>
      <button onClick={onMenu} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center" style={{color:C.textSecondary}}
        onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
        <Menu size={18} />
      </button>

      <nav className="hidden md:flex items-center gap-1.5 text-sm">
        {crumbs.map((c,i)=>(
          <span key={i} className="flex items-center gap-1.5">
            {i>0 && <ChevronRight size={13} style={{color:C.textDisabled}} />}
            <span className="font-semibold" style={{color:i===crumbs.length-1?C.textPrimary:C.textMuted}}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="hidden lg:flex items-center gap-2 border rounded-[10px] px-3 py-2 w-72" style={{borderColor:C.border, background:C.bg}}>
        <Search size={14} style={{color:C.textMuted}} className="flex-shrink-0" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anything..."
          className="flex-1 text-sm bg-transparent outline-none" style={{color:C.textPrimary}} />
        <kbd className="text-[10px] border rounded px-1.5 py-0.5 font-mono" style={{color:C.textDisabled,borderColor:C.border}}>⌘K</kbd>
      </div>

      <button className="hidden sm:flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        style={{background:`linear-gradient(135deg,${C.blue600},${C.blue400})`}}>
        <Sparkles size={14} style={{color:C.pink200}} />
        <span className="hidden xl:inline">AI Search</span>
      </button>

      <button onClick={()=>onPage("notifications")}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{color:C.textSecondary}}
        onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background:C.blue200}} />
      </button>

      <div className="relative">
        <button onClick={()=>setShowUser(!showUser)} className="flex items-center gap-2 rounded-xl px-2 py-1.5"
          onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
          <Avatar name={currentFaculty.name} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold leading-tight" style={{color:C.textPrimary}}>{currentFaculty.name}</p>
            <p className="text-[10px] leading-tight" style={{color:C.textMuted}}>{ROLE_LABELS[role]}</p>
          </div>
          <ChevronDown size={13} style={{color:C.textMuted}} />
        </button>
        {showUser && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white border shadow-xl py-2 z-30" style={{borderColor:C.border, borderRadius:14}}>
            <div className="px-3 py-2 border-b mb-1" style={{borderColor:C.border}}>
              <p className="text-xs font-bold" style={{color:C.textPrimary}}>{currentFaculty.name}</p>
              <p className="text-[10px]" style={{color:C.textMuted}}>{currentFaculty.email}</p>
            </div>
            {[{label:"View Profile",icon:User,pg:"profile"as AppPage},{label:"Settings",icon:Settings,pg:"settings"as AppPage},{label:"Help",icon:HelpCircle,pg:"help"as AppPage}].map(({label,icon:Icon,pg})=>(
              <button key={label} onClick={()=>{ onPage(pg); setShowUser(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium"
                style={{color:C.textSecondary}}
                onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                <Icon size={14} style={{color:C.blue200}} />{label}
              </button>
            ))}
            <div className="border-t mt-1 pt-1" style={{borderColor:C.border}}>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium" style={{color:C.red300}}
                onMouseEnter={e=>hov(e.currentTarget,C.red50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                <LogOut size={14} />Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────
