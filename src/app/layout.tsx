import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Department Management System',
  description: 'Department management dashboard built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
