import React from "react";
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
import { C } from "@/constants";
import { cn, hov, initials, unhov } from "@/lib/ui-utils";

export function Avatar({ name, size="md", className }: { name:string; size?:"sm"|"md"|"lg"|"xl"; className?:string }) {
  const sz = { sm:"w-8 h-8 text-xs", md:"w-9 h-9 text-sm", lg:"w-12 h-12 text-base", xl:"w-20 h-20 text-xl" };
  return (
    <div className={cn("rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none", sz[size], className)}
      style={{ background:C.blue50, color:C.blue500 }}>
      {initials(name)}
    </div>
  );
}

export function StatusBadge({ status }: { status:string }) {
  const m: Record<string,{bg:string;text:string}> = {
    "Active":      {bg:C.olive50, text:C.olive500},
    "On Leave":    {bg:C.sky50,   text:C.sky500},
    "Inactive":    {bg:C.gray50,  text:C.gray400},
    "Upcoming":    {bg:C.blue50,  text:C.blue500},
    "Completed":   {bg:C.olive50, text:C.olive500},
    "Cancelled":   {bg:C.gray50,  text:C.gray300},
    "In Progress": {bg:C.blue50,  text:C.blue500},
    "Pending":     {bg:C.gray50,  text:C.gray400},
    "Overdue":     {bg:C.red50,   text:C.red500},
  };
  const s = m[status] ?? {bg:C.gray50, text:C.gray300};
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap" style={{background:s.bg,color:s.text}}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority:string }) {
  const m: Record<string,{bg:string;text:string;border:string}> = {
    High:   {bg:C.red50,   text:C.red500,   border:C.red200},
    Medium: {bg:C.sky50,   text:C.sky500,   border:C.sky200},
    Low:    {bg:C.olive50, text:C.olive500, border:C.olive200},
  };
  const s = m[priority] ?? {bg:C.gray50,text:C.gray300,border:C.gray50};
  return <span className="px-2.5 py-0.5 rounded text-xs font-semibold border whitespace-nowrap" style={{background:s.bg,color:s.text,borderColor:s.border}}>{priority}</span>;
}

export function CategoryBadge({ label }: { label:string }) {
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" style={{background:C.sky50,color:C.sky500}}>{label}</span>;
}

export function Btn({ children, variant="primary", size="md", onClick, className, icon:Icon, disabled }: {
  children?:React.ReactNode; variant?:"primary"|"secondary"|"ghost"|"outline"|"danger"|"ai";
  size?:"sm"|"md"|"lg"; onClick?:()=>void; className?:string;
  icon?:React.ComponentType<any>; disabled?:boolean;
}) {
  const base = "inline-flex items-center gap-2 font-semibold transition-all cursor-pointer select-none";
  const sz = { sm:"px-3 py-1.5 text-xs rounded-lg", md:"px-4 py-2 text-sm rounded-[10px]", lg:"px-5 py-2.5 text-sm rounded-[10px]" };
  const vstyle: Record<string,React.CSSProperties> = {
    primary:   {background:C.blue200, color:"#fff"},
    secondary: {background:C.card, border:`1px solid ${C.border}`, color:C.textPrimary},
    ghost:     {color:C.blue200},
    outline:   {background:C.card, border:`1px solid ${C.border}`, color:C.textPrimary},
    danger:    {background:C.red300, color:"#fff"},
    ai:        {background:`linear-gradient(135deg,${C.blue600},${C.blue400})`, color:"#fff"},
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn(base, sz[size], className, disabled && "opacity-50 cursor-not-allowed")}
      style={disabled ? {...vstyle[variant], opacity:.5, cursor:"not-allowed"} : vstyle[variant]}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}

export function Input({ placeholder, value, onChange, type="text", className, icon:Icon }: {
  placeholder?:string; value?:string; onChange?:(v:string)=>void;
  type?:string; className?:string; icon?:React.ComponentType<any>;
}) {
  return (
    <div className={cn("relative", className)}>
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:C.textMuted}} />}
      <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)}
        className={cn("w-full border bg-white text-sm outline-none transition-all", Icon?"pl-9 pr-3 py-2.5":"px-3 py-2.5")}
        style={{borderColor:C.border, borderRadius:10, color:C.textPrimary}}
        onFocus={e=>{e.target.style.borderColor=C.blue200; e.target.style.boxShadow=`0 0 0 3px ${C.blue50}`;}}
        onBlur={e=>{e.target.style.borderColor=C.border; e.target.style.boxShadow="none";}} />
    </div>
  );
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.35 0-4.34-1.58-5.05-3.72H.93v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.96H.93A9 9 0 0 0 0 9c0 1.45.34 2.82.93 4.04l3.02-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .93 4.96L3.95 7.3C4.66 5.16 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

export function Select({ options, value, onChange, className }: { options:string[]; value?:string; onChange?:(v:string)=>void; className?:string }) {
  return (
    <select value={value} onChange={e=>onChange?.(e.target.value)}
      className={cn("border bg-white text-sm px-3 py-2.5 outline-none cursor-pointer", className)}
      style={{borderColor:C.border, borderRadius:10, color:C.textPrimary}}>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  );
}

export function Card({ children, className, onClick, style }: { children:React.ReactNode; className?:string; onClick?:()=>void; style?:React.CSSProperties }) {
  return (
    <div onClick={onClick} className={cn("bg-white border transition-shadow", className, onClick && "cursor-pointer")}
      style={{borderColor:C.border, borderRadius:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", ...(style||{})}}
      onMouseEnter={e=>{ if(onClick)(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e=>{ if(onClick)(e.currentTarget as HTMLElement).style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-bold" style={{color:C.textPrimary}}>{title}</h2>
        {subtitle && <p className="text-xs mt-0.5" style={{color:C.textMuted}}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon:Icon, title, description, action }: {
  icon:React.ComponentType<any>; title:string; description:string; action?:React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{background:C.blue50}}>
        <Icon size={28} style={{color:C.blue200}} />
      </div>
      <h3 className="text-sm font-bold mb-1" style={{color:C.textPrimary}}>{title}</h3>
      <p className="text-xs max-w-xs mb-4" style={{color:C.textMuted}}>{description}</p>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub, icon:Icon, iconBg, iconColor }: {
  label:string; value:string|number; sub?:string;
  icon:React.ComponentType<any>; iconBg?:string; iconColor?:string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{color:C.textMuted}}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:iconBg??C.blue50}}>
          <Icon size={17} style={{color:iconColor??C.blue200}} />
        </div>
      </div>
      <p className="text-3xl font-black" style={{color:C.textPrimary}}>{value}</p>
      {sub && <p className="text-xs mt-1.5 font-medium" style={{color:C.textMuted}}>{sub}</p>}
    </Card>
  );
}

export function FilterBar({ children }: { children:React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5 bg-white border p-3"
      style={{borderColor:C.border, borderRadius:12, boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
      {children}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs:string[]; active:string; onChange:(t:string)=>void }) {
  return (
    <div className="flex border-b mb-5" style={{borderColor:C.border}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>onChange(t)} className="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px"
          style={t===active ? {borderColor:C.blue200, color:C.blue200} : {borderColor:"transparent", color:C.textSecondary}}>
          {t}
        </button>
      ))}
    </div>
  );
}

export function ChartCard({ title, children, action }: { title:string; children:React.ReactNode; action?:React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold" style={{color:C.textPrimary}}>{title}</h3>
        {action ?? <MoreHorizontal size={16} style={{color:C.textMuted}} className="cursor-pointer" />}
      </div>
      {children}
    </Card>
  );
}

export function Pagination({ current, total, onChange }: { current:number; total:number; onChange:(p:number)=>void }) {
  const pages = Math.max(1, Math.ceil(total/10));
  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{borderColor:C.border}}>
      <p className="text-xs" style={{color:C.textMuted}}>Showing {Math.min((current-1)*10+1,total)}–{Math.min(current*10,total)} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={()=>onChange(Math.max(1,current-1))} disabled={current===1}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40"
          style={{color:C.blue200}}>
          <ChevronLeft size={14} />
        </button>
        {[...Array(pages)].map((_,i)=>(
          <button key={i} onClick={()=>onChange(i+1)} className="w-8 h-8 rounded-lg text-xs font-semibold"
            style={i+1===current ? {background:C.blue200,color:"#fff"} : {color:C.textSecondary}}>
            {i+1}
          </button>
        ))}
        <button onClick={()=>onChange(Math.min(pages,current+1))} disabled={current===pages}
          className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40"
          style={{color:C.blue200}}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function FileTypeIcon({ type }: { type:string }) {
  const s: Record<string,{bg:string;color:string}> = {
    pdf:  {bg:C.red50,   color:C.red500},
    doc:  {bg:C.blue50,  color:C.blue500},
    xlsx: {bg:C.olive50, color:C.olive500},
    ppt:  {bg:C.sky50,   color:C.sky500},
    img:  {bg:C.gray50,  color:C.gray400},
  };
  const c = s[type] ?? s.doc;
  return (
    <div className="w-10 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 flex-shrink-0" style={{background:c.bg}}>
      <File size={14} style={{color:c.color}} />
      <span className="text-[9px] font-black uppercase" style={{color:c.color}}>{type}</span>
    </div>
  );
}

export function NotifIcon({ type }: { type:string }) {
  const map: Record<string,{icon:React.ComponentType<any>;bg:string;color:string}> = {
    announcement: {icon:Megaphone,   bg:C.blue50,  color:C.blue200},
    task:         {icon:CheckSquare, bg:C.olive50, color:C.olive300},
    meeting:      {icon:Video,       bg:C.sky50,   color:C.sky300},
    document:     {icon:FileText,    bg:C.gray50,  color:C.gray300},
    ai:           {icon:Sparkles,    bg:C.pink50,  color:C.pink200},
  };
  const m = map[type] ?? map.document;
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{background:m.bg}}>
      <m.icon size={15} style={{color:m.color}} />
    </div>
  );
}

export function Modal({ title, onClose, children, footer }: { title:string; onClose:()=>void; children:React.ReactNode; footer?:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-4 z-10 shadow-2xl" style={{borderRadius:18}}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{borderColor:C.border}}>
          <h3 className="font-bold" style={{color:C.textPrimary}}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{color:C.textMuted}}
            onMouseEnter={e=>hov(e.target,C.bg)} onMouseLeave={e=>unhov(e.target,"transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t flex justify-end gap-3" style={{borderColor:C.border}}>{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ title, onClose, children, width="w-96" }: { title:string; onClose:()=>void; children:React.ReactNode; width?:string }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className={cn("relative ml-auto bg-white shadow-2xl flex flex-col", width)}>
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{borderColor:C.border}}>
          <h3 className="font-bold" style={{color:C.textPrimary}}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{color:C.textMuted}}
            onMouseEnter={e=>hov(e.target,C.bg)} onMouseLeave={e=>unhov(e.target,"transparent")}>
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, max, color }: { value:number; max:number; color?:string }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{background:C.gray50}}>
      <div className="h-1.5 rounded-full" style={{width:`${Math.round((value/max)*100)}%`, background:color??C.blue200}} />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
