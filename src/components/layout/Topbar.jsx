"use client";

import { Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export function Topbar({ onMenuClick }) {
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case "/": return "Gösterge Paneli";
      case "/products": return "Ürünler & Stok";
      case "/sales": return "Satışlar";
      case "/wholesalers": return "Toptancılar";
      case "/guide": return "İş Rehberi";
      case "/settings": return "Ayarlar";
      default: return "";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0b0c1a]/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100 md:hidden"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-100">{getTitle()}</h1>
      </div>
    </header>
  );
}
