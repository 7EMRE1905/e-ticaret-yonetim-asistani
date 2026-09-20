"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useStore } from "@/store/useStore";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { initStore, isInitialized, settings } = useStore();

  const firma = settings?.firma || {};
  const pageTitle = firma.name || "Sepetizm";
  
  // Favicon için resim url'si veya emoji SVG'si oluşturma
  const getFavicon = () => {
    if (firma.logo?.startsWith("http") || firma.logo?.startsWith("/")) return firma.logo;
    if (firma.logo) {
      // Emoji ise SVG Data URI olarak döndür
      return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${firma.logo}</text></svg>`;
    }
    return "/favicon.ico";
  };

  useEffect(() => {
    initStore();
  }, [initStore]);

  if (!isInitialized) {
    return (
      <html lang="tr">
        <head>
          <title>{pageTitle}</title>
          <link rel="icon" href={getFavicon()} />
        </head>
        <body className="flex h-screen items-center justify-center bg-[#05060f]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </body>
      </html>
    );
  }

  return (
    <html lang="tr">
      <head>
        <title>{pageTitle}</title>
        <link rel="icon" href={getFavicon()} />
      </head>
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
