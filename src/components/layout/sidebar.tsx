"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Map, MapPin, Flame, X, FileSpreadsheet } from "lucide-react";
import { useUIStore } from "@/features/ui/ui.store";
import { BrandName } from "@/components/brand/brand-name";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  accent?: boolean;
}

const MAIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/occurrences", label: "Ocorrências", icon: <ClipboardList className="w-4 h-4" /> },
  { href: "/admin/collection-points", label: "Pontos de Recolha", icon: <MapPin className="w-4 h-4" /> },
  { href: "/admin/reports", label: "Relatórios", icon: <FileSpreadsheet className="w-4 h-4" /> },
];

const VIEW_ITEMS: NavItem[] = [
  { href: "/admin/map", label: "Mapa de Ocorrências", icon: <Map className="w-4 h-4" /> },
  { href: "/admin/heatmap", label: "Mapa de Calor", icon: <Flame className="w-4 h-4" />, badge: "Beira", accent: true },
];

const SidebarNav: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const pathname = usePathname();

  const renderLink = (item: NavItem) => {
    const isActive =
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
          isActive
            ? "bg-forestGreen/10 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen font-semibold border border-forestGreen/15 dark:border-limeGreen/20 shadow-xs"
            : "text-grey700 dark:text-grey300 font-medium hover:bg-grey200/60 dark:hover:bg-grey800/60 hover:text-grey900 dark:hover:text-grey100"
        }`}
      >
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            isActive
              ? "bg-forestGreen/15 dark:bg-limeGreen/20 text-forestGreen dark:text-limeGreen"
              : "bg-grey100/80 dark:bg-grey800/50 text-grey500 dark:text-grey400 group-hover:text-grey900 dark:group-hover:text-grey100"
          }`}
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
        {item.badge && (
          <span className="ml-auto text-[9px] tracking-wider uppercase px-2 py-0.5 bg-forestGreen/10 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen rounded-md font-extrabold border border-forestGreen/20 dark:border-limeGreen/25">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-1.5">
      <div className="text-[11px] font-bold text-grey400 dark:text-grey500 uppercase tracking-widest px-3 mb-1">
        Painel Principal
      </div>
      {MAIN_ITEMS.map(renderLink)}

      <div className="text-[11px] font-bold text-grey400 dark:text-grey500 uppercase tracking-widest px-3 mt-6 mb-1">
        Visualizações
      </div>
      {VIEW_ITEMS.map(renderLink)}
    </nav>
  );
};

export const Sidebar: React.FC = () => {
  const { sidebarOpen, closeSidebar } = useUIStore();

  return (
    <>
      {/* Barra lateral fixa — desktop */}
      <aside className="w-64 bg-grey50/60 dark:bg-grey900/60 border-r border-grey200/80 dark:border-grey800/80 min-h-[calc(100vh-61px)] p-4 hidden md:block backdrop-blur-sm">
        <SidebarNav />
      </aside>

      {/* Drawer — mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-grey950/60 backdrop-blur-md transition-opacity"
            onClick={closeSidebar}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white dark:bg-grey900 border-r border-grey200 dark:border-grey800 p-5 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-grey100 dark:border-grey800/80 pb-4">
              <span className="text-lg font-black tracking-tight">
                <BrandName />
              </span>
              <button
                onClick={closeSidebar}
                className="p-1.5 rounded-xl text-grey400 dark:text-grey500 hover:bg-grey100 dark:hover:bg-grey800 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarNav onNavigate={closeSidebar} />
          </aside>
        </div>
      )}
    </>
  );
};
