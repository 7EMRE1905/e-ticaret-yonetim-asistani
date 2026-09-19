"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BookOpen,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Gösterge Paneli", href: "/", icon: LayoutDashboard },
  { name: "Ürünler & Stok", href: "/products", icon: Package },
  { name: "Satışlar", href: "/sales", icon: ShoppingCart },
  { name: "Toptancılar", href: "/wholesalers", icon: Truck },
  { name: "İş Rehberi", href: "/guide", icon: BookOpen },
  { name: "Ayarlar", href: "/settings", icon: Settings, divider: true },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const settings = useStore((state) => state.settings);
  const firma = settings.firma;

  const getLogoContent = () => {
    if (firma?.logo?.startsWith("http")) {
      return <img src={firma.logo} alt="Logo" className="h-full w-full object-cover" />;
    }
    if (firma?.logo) {
      return <span>{firma.logo}</span>;
    }
    return <span>US</span>;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0c0d1a] transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/10 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 overflow-hidden">
            {getLogoContent()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-100 leading-tight">
              {firma?.name || "Uygun Sepety"}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              E-Ticaret Paneli
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <div key={item.name}>
                {item.divider && (
                  <div className="my-3 mx-4 h-px bg-white/5" />
                )}
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0c0d1a] bg-indigo-500 text-xs font-bold text-white z-10">
                {settings.partner1?.[0]?.toUpperCase() || "Y"}
              </div>
              {settings.partner2 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0c0d1a] bg-emerald-500 text-xs font-bold text-white">
                  {settings.partner2[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">
                {settings.partner1} {settings.partner2 ? `& ${settings.partner2}` : ""}
              </span>
              <span className="text-[10px] text-slate-400">
                {settings.partner2 ? "Ortaklar" : "Yönetici"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
