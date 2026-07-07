'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { AppPage, AuthView, FacultyMember, Role, ViewMode } from "@/types";
import { AUTH_STORAGE_KEY, ROLE_STORAGE_KEY, isRole } from "@/constants";
import { facultyMemberFromRow, fallbackFacultyFromUser, roleFromFaculty } from "@/lib/faculty-profile";
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage } from "@/components/shared/Auth";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopNav } from "@/components/shared/Topbar";
import { HODDashboard, CoordinatorDashboard, FacultyDashboard } from "@/components/dashboard/Dashboard";
import { FacultyPage } from "@/components/faculty/Faculty";
import { AnnouncementsPage } from "@/components/shared/Announcements";
import { MeetingsPage } from "@/components/meetings/Meetings";
import { DocumentsPage } from "@/components/documents/Documents";
import { TasksPage } from "@/components/tasks/Tasks";
import { AIKnowledgePage } from "@/components/shared/AIKnowledge";
import { ReportsPage } from "@/components/reports/Reports";
import { DepartmentPage } from "@/components/shared/Department";
import { NotificationsPage } from "@/components/notifications/Notifications";
import { ProfilePage } from "@/components/profile/Profile";
import { SettingsPage } from "@/components/settings/Settings";
import { HelpPage } from "@/components/help/Help";
import { ErrorPage } from "@/components/shared/ErrorPage";
import { C } from "@/constants";
import { cn } from "@/lib/ui-utils";

export default function App({ initialPage }: { initialPage?: AppPage }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [currentFaculty, setCurrentFaculty] = useState<FacultyMember>(() => fallbackFacultyFromUser(null));
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [view, setView]           = useState<ViewMode>("auth");
  const [authPage, setAuthPage]   = useState<AuthView>("login");

  const [role, setRole]           = useState<Role>("hod");

  const [page, setPage]           = useState<AppPage>(initialPage ?? "dashboard");

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);



  const navigateTo = (p: AppPage) => {

    setPage(p);

    const path = p === "dashboard" ? "/" : `/${p}`;

    try { router.push(path); } catch (e) { /* noop during build-time */ }

  };



  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth Error:", error.message);
      alert(`Error signing in: ${error.message}`);
    }
  };

  const handleLogin = async (email:string, password:string) => {
    if (!email || !password) return "Enter your email and password.";

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return error.message;
    if (data.user) openAppForUser(data.user);
    return null;
  };

  const handleSignup = async (name:string, email:string, password:string) => {
    if (!name || !email || !password) return "Enter your name, email, and password.";
    if (password.length < 6) return "Password must be at least 6 characters.";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: name, role },
      },
    });

    if (error) return error.message;
    if (data.session?.user) openAppForUser(data.session.user);
    return null;
  };

  const openAppForUser = (authUser: SupabaseUser) => {
    setUser(authUser);
    setCurrentFaculty(fallbackFacultyFromUser(authUser));
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
    setView("app");
  };


  const handleRoleChange = (r:Role) => {

    setRole(r);

    if (typeof window !== "undefined") window.localStorage.setItem(ROLE_STORAGE_KEY, r);

    navigateTo("dashboard");

  };



  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentFaculty(fallbackFacultyFromUser(null));
    setFacultyMembers([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthPage("login");
    setView("auth");
    navigateTo("dashboard");

  };



  useEffect(()=>{ if(initialPage) setPage(initialPage); }, [initialPage]);



  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (isRole(storedRole)) setRole(storedRole);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        openAppForUser(data.user);
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setView("auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        openAppForUser(session.user);
      } else {
        setUser(null);
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setView("auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [initialPage, supabase]);


  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const loadFaculty = async () => {
      setFacultyLoading(true);

      const { data, error } = await supabase
        .from("faculty")
        .select("*");

      if (cancelled) return;

      if (error) {
        console.error("Faculty fetch error:", error.message);
        const fallback = fallbackFacultyFromUser(user);
        setCurrentFaculty(fallback);
        setFacultyMembers([fallback]);
        setFacultyLoading(false);
        return;
      }

      const rows = Array.isArray(data) ? data : [];
      const mapped = rows.map((row, index) => facultyMemberFromRow(row, index));
      const fallback = fallbackFacultyFromUser(user);
      const current = mapped.find(f => f.email.toLowerCase() === (user.email ?? "").toLowerCase())
        ?? mapped.find(f => String(f.id) === user.id)
        ?? fallback;
      const nextRole = roleFromFaculty(current);

      setCurrentFaculty(current);
      setFacultyMembers(mapped.length ? mapped : [fallback]);
      setRole(nextRole);
      if (typeof window !== "undefined") window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
      setFacultyLoading(false);
    };

    void loadFaculty();

    return () => {
      cancelled = true;
    };
  }, [supabase, user]);


  if(view==="auth") {
    if(authPage==="forgot") return <ForgotPasswordPage onBack={()=>setAuthPage("login")} />;
    if(authPage==="reset")  return <ResetPasswordPage  onBack={()=>setAuthPage("login")} />;
    if(authPage==="signup") return <SignupPage onSignup={handleSignup} onGoogleLogin={handleGoogleLogin} onBack={()=>setAuthPage("login")} onRoleChange={handleRoleChange} role={role} />;
    return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onForgot={()=>setAuthPage("forgot")} onSignup={()=>setAuthPage("signup")} onRoleChange={handleRoleChange} role={role} />;
  }


  const Dashboard = role==="hod" ? HODDashboard : role==="coordinator" ? CoordinatorDashboard : FacultyDashboard;



  const renderPage = () => {

    switch(page) {

      case "dashboard":     return <Dashboard onPage={navigateTo} currentFaculty={currentFaculty} />;
      case "faculty":       return <FacultyPage role={role} facultyMembers={facultyMembers} loading={facultyLoading} />;
      case "announcements": return <AnnouncementsPage role={role} />;

      case "meetings":      return <MeetingsPage role={role} />;

      case "documents":     return <DocumentsPage />;

      case "tasks":         return <TasksPage role={role} />;

      case "ai-knowledge":  return <AIKnowledgePage />;

      case "reports":

        if(role!=="hod") return <ErrorPage code="403" title="Access Restricted" description="Reports are available to Head of Department only." onBack={()=>navigateTo("dashboard")} />;

        return <ReportsPage />;

      case "department":    return <DepartmentPage role={role} />;

      case "notifications": return <NotificationsPage />;

      case "profile":       return <ProfilePage currentFaculty={currentFaculty} />;
      case "settings":      return <SettingsPage />;

      case "help":          return <HelpPage />;

      case "e404": return <ErrorPage code="404" title="Page Not Found"        description="The page you're looking for doesn't exist or has been moved." onBack={()=>setPage("dashboard")} />;

      case "e403": return <ErrorPage code="403" title="Access Forbidden"      description="You don't have permission to access this page."              onBack={()=>setPage("dashboard")} />;

      case "e500": return <ErrorPage code="500" title="Internal Server Error" description="Something went wrong on our end. Please try again."          onBack={()=>setPage("dashboard")} />;

      default:              return <Dashboard onPage={navigateTo} currentFaculty={currentFaculty} />;
    }

  };



  return (

    <div className="flex h-screen overflow-hidden" style={{background:C.bg, fontFamily:"'Inter',system-ui,sans-serif"}}>

      {mobileOpen && (

        <div className="fixed inset-0 z-40 md:hidden">

          <div className="absolute inset-0 bg-black/30" onClick={()=>setMobileOpen(false)} />

          <div className="absolute left-0 top-0 bottom-0 z-50">

            <Sidebar role={role} page={page} onPage={p=>{ navigateTo(p); setMobileOpen(false); }} collapsed={false} onCollapse={()=>setMobileOpen(false)} onRoleChange={handleRoleChange} currentFaculty={currentFaculty} onLogout={()=>void handleLogout()} />
          </div>

        </div>

      )}



      <div className="hidden md:flex">

        <Sidebar role={role} page={page} onPage={navigateTo} collapsed={collapsed} onCollapse={()=>setCollapsed(!collapsed)} onRoleChange={handleRoleChange} currentFaculty={currentFaculty} onLogout={()=>void handleLogout()} />
      </div>



      <div className="flex-1 flex flex-col min-w-0">

        <TopNav role={role} page={page} onPage={navigateTo} onMenu={()=>setMobileOpen(true)} onLogout={()=>void handleLogout()} currentFaculty={currentFaculty} />


        <main className={cn("flex-1 overflow-y-auto", page==="ai-knowledge" && "overflow-hidden")}>

          {renderPage()}

        </main>

      </div>

    </div>

  );

}

