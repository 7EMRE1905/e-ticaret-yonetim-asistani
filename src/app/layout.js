"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="tr">
      <body className="antialiased selection:bg-indigo-500/30">
        <div className="flex min-h-screen">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
