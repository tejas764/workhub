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
import type { Role } from "@/types";
import { C } from "@/constants";
import { Btn, GoogleIcon, Input } from "@/components/ui";

export function LoginPage({ onLogin, onGoogleLogin, onForgot, onSignup, onRoleChange, role }: {
  onLogin:(email:string,password:string)=>Promise<string | null>;
  onGoogleLogin:()=>Promise<void>;
  onForgot:()=>void; onSignup:()=>void; onRoleChange:(r:Role)=>void; role:Role;
}) {
  const [email, setEmail] = useState("anita.sharma@college.edu");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submitLogin = async () => {
    setError("");
    setLoading(true);
    const message = await onLogin(email.trim(), pw);
    if (message) setError(message);
    setLoading(false);
  };

  const submitGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    await onGoogleLogin();
    setGoogleLoading(false);
  };
  return (
    <div className="min-h-screen flex" style={{background:C.bg}}>
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{background:C.blue600}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.08)"}}>
            <span className="text-base font-black" style={{color:C.blue200}}>W</span>
          </div>
          <div>
            <p className="font-black text-lg leading-tight text-white">WorkHub AI</p>
            <p className="text-xs" style={{color:C.gray300}}>Dept. Management System</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black leading-tight mb-4 text-white">Smarter department management, powered by AI.</h2>
          <p className="text-sm leading-relaxed" style={{color:C.gray200}}>A unified platform for faculty, coordinators, and HODs to collaborate, manage tasks, documents, and meetings.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[{label:"Departments",val:"8"},{label:"Faculty Members",val:"47"},{label:"Active Tasks",val:"128"},{label:"Meetings / mo",val:"24"}].map(({label,val})=>(
              <div key={label} className="p-4 rounded-2xl border" style={{background:"rgba(255,255,255,0.04)",borderColor:"rgba(255,255,255,0.08)"}}>
                <p className="text-2xl font-black" style={{color:C.blue200}}>{val}</p>
                <p className="text-xs mt-1" style={{color:C.gray300}}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{color:C.gray400}}>© 2026 WorkHub AI · All rights reserved</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:C.blue600}}>
                <span className="text-xs font-black" style={{color:C.blue200}}>W</span>
              </div>
              <span className="font-black" style={{color:C.blue600}}>WorkHub AI</span>
            </div>
            <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Welcome back</h1>
            <p className="text-sm" style={{color:C.textSecondary}}>Sign in to your workspace to continue</p>
          </div>

          <div className="mb-6 p-4 rounded-2xl border" style={{background:C.bg, borderColor:C.border}}>
            <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{color:C.textMuted}}>Demo — Preview as Role</p>
            <div className="flex gap-2">
              {(["hod","coordinator","faculty"] as Role[]).map(r=>(
                <button key={r} onClick={()=>onRoleChange(r)} className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={r===role ? {background:C.blue500,color:"#fff",borderColor:C.blue500} : {background:"#fff",borderColor:C.border,color:C.textSecondary}}>
                  {r==="hod"?"HOD":r==="coordinator"?"Coord.":"Faculty"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={e=>{ e.preventDefault(); void submitLogin(); }} className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Email address</label>
              <Input value={email} onChange={setEmail} placeholder="you@college.edu" icon={Mail} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold" style={{color:C.textPrimary}}>Password</label>
                <button type="button" onClick={onForgot} className="text-xs font-semibold hover:opacity-70" style={{color:C.blue200}}>Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:C.textMuted}} />
                <input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border bg-white text-sm outline-none"
                  style={{borderColor:C.border, borderRadius:10, color:C.textPrimary}} />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={14} style={{color:C.textMuted}} /> : <Eye size={14} style={{color:C.textMuted}} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rem" checked={remember} onChange={e=>setRemember(e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="rem" className="text-sm" style={{color:C.textSecondary}}>Remember me for 30 days</label>
            </div>
            {error && (
              <div className="rounded-xl border px-3 py-2 text-sm font-medium" style={{background:C.red50,borderColor:C.red100,color:C.red500}}>
                {error}
              </div>
            )}
            <Btn variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to WorkHub"}
            </Btn>
          </form>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{background:C.border}} />
            <span className="text-xs font-semibold uppercase" style={{color:C.textMuted}}>or</span>
            <div className="h-px flex-1" style={{background:C.border}} />
          </div>

          <button type="button" onClick={submitGoogleLogin} disabled={googleLoading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-[10px] border bg-white px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{borderColor:C.border,color:C.textPrimary}}>
            <GoogleIcon />
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <p className="mt-5 text-center text-sm" style={{color:C.textSecondary}}>
            New to WorkHub?{" "}
            <button type="button" onClick={onSignup} className="font-bold hover:opacity-70" style={{color:C.blue200}}>
              Create an account
            </button>
          </p>
          <p className="mt-4 text-center text-xs" style={{color:C.textDisabled}}>Protected by enterprise SSO · Contact IT for access issues</p>
        </div>
      </div>
    </div>
  );
}

export function SignupPage({ onSignup, onGoogleLogin, onBack, onRoleChange, role }: {
  onSignup:(name:string,email:string,password:string)=>Promise<string | null>;
  onGoogleLogin:()=>Promise<void>;
  onBack:()=>void; onRoleChange:(r:Role)=>void; role:Role;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submitSignup = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    const result = await onSignup(name.trim(), email.trim(), pw);
    if (result) {
      setError(result);
    } else {
      setMessage("Account created. Check your email to confirm your signup, then sign in.");
      setPw("");
    }
    setLoading(false);
  };

  const submitGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    await onGoogleLogin();
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{background:C.bg}}>
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12" style={{background:C.blue600}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.08)"}}>
            <span className="text-base font-black" style={{color:C.blue200}}>W</span>
          </div>
          <div>
            <p className="font-black text-lg leading-tight text-white">WorkHub AI</p>
            <p className="text-xs" style={{color:C.gray300}}>Dept. Management System</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-black leading-tight mb-4 text-white">Create your department workspace account.</h2>
          <p className="text-sm leading-relaxed" style={{color:C.gray200}}>Sign up with your college email or use Google to join WorkHub AI.</p>
        </div>
        <p className="text-xs" style={{color:C.gray400}}>© 2026 WorkHub AI · All rights reserved</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-70" style={{color:C.blue200}}>
            <ChevronLeft size={16} />Back to sign in
          </button>
          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Create account</h1>
            <p className="text-sm" style={{color:C.textSecondary}}>Start with your college workspace details</p>
          </div>

          <div className="mb-6 p-4 rounded-2xl border" style={{background:C.bg, borderColor:C.border}}>
            <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{color:C.textMuted}}>Demo - Preview as Role</p>
            <div className="flex gap-2">
              {(["hod","coordinator","faculty"] as Role[]).map(r=>(
                <button key={r} onClick={()=>onRoleChange(r)} className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={r===role ? {background:C.blue500,color:"#fff",borderColor:C.blue500} : {background:"#fff",borderColor:C.border,color:C.textSecondary}}>
                  {r==="hod"?"HOD":r==="coordinator"?"Coord.":"Faculty"}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={e=>{ e.preventDefault(); void submitSignup(); }} className="space-y-4">
            <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Full name</label><Input value={name} onChange={setName} placeholder="Dr. Anita Sharma" icon={User} /></div>
            <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Email address</label><Input value={email} onChange={setEmail} placeholder="you@college.edu" icon={Mail} /></div>
            <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Password</label><Input value={pw} onChange={setPw} type="password" placeholder="At least 6 characters" icon={Lock} /></div>
            {error && <div className="rounded-xl border px-3 py-2 text-sm font-medium" style={{background:C.red50,borderColor:C.red100,color:C.red500}}>{error}</div>}
            {message && <div className="rounded-xl border px-3 py-2 text-sm font-medium" style={{background:C.olive50,borderColor:C.olive100,color:C.olive500}}>{message}</div>}
            <Btn variant="primary" size="lg" className="w-full justify-center" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Btn>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{background:C.border}} />
            <span className="text-xs font-semibold uppercase" style={{color:C.textMuted}}>or</span>
            <div className="h-px flex-1" style={{background:C.border}} />
          </div>

          <button type="button" onClick={submitGoogleLogin} disabled={googleLoading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-[10px] border bg-white px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{borderColor:C.border,color:C.textPrimary}}>
            <GoogleIcon />
            {googleLoading ? "Opening Google..." : "Sign up with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage({ onBack }: { onBack:()=>void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background:C.bg}}>
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold mb-8 hover:opacity-70" style={{color:C.blue200}}>
          <ChevronLeft size={16} />Back to sign in
        </button>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{background:C.blue50}}>
          <Key size={24} style={{color:C.blue200}} />
        </div>
        <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Forgot password?</h1>
        <p className="text-sm mb-6" style={{color:C.textSecondary}}>Enter your work email and we'll send a reset link.</p>
        {sent ? (
          <div className="rounded-2xl p-5 text-center border" style={{background:C.olive50, borderColor:C.olive100}}>
            <CheckCircle size={32} className="mx-auto mb-3" style={{color:C.olive300}} />
            <p className="font-bold mb-1" style={{color:C.olive500}}>Reset link sent!</p>
            <p className="text-sm" style={{color:C.olive300}}>Check your email inbox and follow the instructions.</p>
          </div>
        ) : (
          <form onSubmit={e=>{e.preventDefault(); setSent(true);}} className="space-y-4">
            <Input value={email} onChange={setEmail} placeholder="you@college.edu" icon={Mail} />
            <Btn variant="primary" size="lg" className="w-full justify-center">Send Reset Link</Btn>
          </form>
        )}
      </div>
    </div>
  );
}

export function ResetPasswordPage({ onBack }: { onBack:()=>void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background:C.bg}}>
      <div className="w-full max-w-sm">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{background:C.blue50}}>
          <Lock size={24} style={{color:C.blue200}} />
        </div>
        <h1 className="text-2xl font-black mb-1" style={{color:C.blue600}}>Set new password</h1>
        <p className="text-sm mb-6" style={{color:C.textSecondary}}>Must be at least 8 characters with uppercase, number, and symbol.</p>
        <form onSubmit={e=>{e.preventDefault(); onBack();}} className="space-y-4">
          <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>New Password</label><Input value={pw} onChange={setPw} type="password" placeholder="Enter new password" icon={Lock} /></div>
          <div><label className="text-sm font-bold block mb-1.5" style={{color:C.textPrimary}}>Confirm Password</label><Input type="password" placeholder="Confirm new password" icon={Lock} /></div>
          <Btn variant="primary" size="lg" className="w-full justify-center">Update Password</Btn>
        </form>
      </div>
    </div>
  );
}

// ─── HOD Dashboard ────────────────────────────────────────────────────────────
