"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState("Head of Department");
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);

  // --- GLOBAL DATA STATE ---
  const [faculty, setFaculty] = useState([
    { id: 1, name: "Dr. Aris Thorne", role: "Associate Professor", dept: "Computer Science", email: "a.thorne@workhub.edu", tasks: 4, status: "Active" },
    { id: 2, name: "Prof. Elena Rostova", role: "Assistant Professor", dept: "Data Science", email: "e.rostova@workhub.edu", tasks: 2, status: "Active" },
    { id: 3, name: "Dr. Marcus Vance", role: "Senior Lecturer", dept: "Cybersecurity", email: "m.vance@workhub.edu", tasks: 6, status: "On Leave" },
    { id: 4, name: "Prof. Sarah Jenkins", role: "Dept. Coordinator", dept: "Computer Science", email: "s.jenkins@workhub.edu", tasks: 3, status: "Active" },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Submit Mid-Semester Grades", dueDate: "2026-08-01", priority: "High", status: "Pending", category: "Academic" },
    { id: 2, title: "Curriculum Review Meeting Agenda", dueDate: "2026-07-28", priority: "Medium", status: "In Progress", category: "Department" },
    { id: 3, title: "Approve Faculty Leave Applications", dueDate: "2026-07-25", priority: "High", status: "Pending", category: "Approvals" },
    { id: 4, title: "Upload Course Syllabus PDF", dueDate: "2026-08-10", priority: "Low", status: "Completed", category: "Documentation" },
  ]);

  // Load session state from localStorage on initial render
  useEffect(() => {
    let authed = false;
    try {
      const savedAuth = localStorage.getItem("workhub_auth");
      const savedUser = localStorage.getItem("workhub_user");
      const savedRole = localStorage.getItem("workhub_role");
      const savedTheme = localStorage.getItem("workhub_theme");

      if (savedAuth === "true" && savedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
        authed = true;
      }
      if (savedRole) setActiveRole(savedRole);
      if (savedTheme) setTheme(savedTheme);
    } catch (error) {
      console.error("Failed to restore session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ROUTE GUARD: Redirect unauthenticated users to /login
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const changeRole = (newRole) => {
    setActiveRole(newRole);
    localStorage.setItem("workhub_role", newRole);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("workhub_theme", nextTheme);
      return nextTheme;
    });
  };

  const login = (userData) => {
    let loggedInUser;

    if (userData) {
      const name = userData.name || "User";
      const nameParts = name.trim().split(" ");
      const avatar = nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();

      loggedInUser = {
        name: name,
        email: userData.email || `${name.toLowerCase().replace(/\s+/g, ".")}@workhub.ai`,
        avatar: avatar,
      };

      if (userData.role) {
        changeRole(userData.role);
      }
    } else {
      loggedInUser = {
        name: "Dr. Sarah Jenkins",
        email: "s.jenkins@workhub.edu",
        avatar: "SJ",
      };
    }

    setUser(loggedInUser);
    setIsAuthenticated(true);

    localStorage.setItem("workhub_auth", "true");
    localStorage.setItem("workhub_user", JSON.stringify(loggedInUser));

    router.push("/");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("workhub_auth");
    localStorage.removeItem("workhub_user");
    router.push("/login");
  };

  const addTask = (newTask) => setTasks((prev) => [newTask, ...prev]);

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" }
          : t
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading WorkHub AI...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        activeRole,
        setActiveRole: changeRole,
        theme,
        toggleTheme,
        user,
        setUser,
        logout,
        login,
        faculty,
        setFaculty,
        tasks,
        setTasks,
        addTask,
        toggleTaskStatus,
      }}
    >
      <div className={theme === "dark" ? "dark bg-slate-950 text-slate-100 min-h-screen" : "bg-slate-50 text-slate-900 min-h-screen"}>
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);