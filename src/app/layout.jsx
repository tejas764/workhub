"use client";

import "./globals.css"; 
import { AuthProvider } from "@/context/AuthContext";
import MainShell from "@/components/MainShell";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MainShell>{children}</MainShell>
        </AuthProvider>
      </body>
    </html>
  );
}