"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  FileSpreadsheet,
  Map,
  Flame,
  ChevronLeft,
  ChevronRight,
  X,
  LucideIcon,
} from "lucide-react";
import { useUIStore } from "@/features/ui/ui.store";
import { BrandName } from "@/components/brand/brand-name";

// ─── Nav Items ────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

const MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/occurrences", label: "Ocorrências", Icon: ClipboardList },
  { href: "/admin/collection-points", label: "Pontos de Recolha", Icon: MapPin },
  { href: "/admin/reports", label: "Relatórios", Icon: FileSpreadsheet },
];

const VIEW_NAV: NavItem[] = [
  { href: "/admin/map", label: "Mapa de Ocorrências", Icon: Map },
  {
    href: "/admin/heatmap",
    label: "Mapa de Calor",
    Icon: Flame,
    badge: "Live",
    badgeColor: "bg-rose-500",
  },
];

// ─── Single Nav Link ──────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={[
        "group relative flex items-center gap-3 rounded-xl transition-all duration-150 font-medium text-sm select-none",
        collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
        isActive
          ? "bg-[#1a7a4a] text-white shadow-sm"
          : "text-[#52525b] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-white",
      ].join(" ")}
    >
      {/* Icon */}
      <item.Icon
        className={[
          "shrink-0 transition-transform duration-150",
          collapsed ? "w-5 h-5" : "w-[18px] h-[18px]",
          isActive ? "" : "group-hover:scale-105",
        ].join(" ")}
      />

      {/* Label + badge */}
      {!collapsed && (
        <>
          <span className="truncate flex-1 leading-tight">{item.label}</span>
          {item.badge && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white ${item.badgeColor ?? "bg-[#1a7a4a]"}`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip on collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-[#18181b] dark:bg-[#3f3f46] text-white text-xs font-semibold px-3 py-1.5 shadow-xl opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150">
          {item.label}
          {item.badge && (
            <span className={`ml-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded text-white ${item.badgeColor ?? "bg-[#1a7a4a]"}`}>
              {item.badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

// ─── Section Divider ─────────────────────────────────────────────────────────

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return <div className="my-1 h-px bg-[#e4e4e7] dark:bg-[#3f3f46]" />;
  }
  return (
    <p className="px-3 mb-1.5 mt-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#a1a1aa] dark:text-[#71717a] select-none">
      {label}
    </p>
  );
}

// ─── Desktop Sidebar ─────────────────────────────────────────────────────────

export function DesktopSidebar() {
  const { sidebarCollapsed, toggleCollapsed } = useUIStore();

  return (
    <aside
      style={{ width: sidebarCollapsed ? 68 : 240 }}
      className="hidden md:flex flex-col flex-shrink-0 h-full bg-white dark:bg-[#18181b] border-r border-[#e4e4e7] dark:border-[#27272a] transition-[width] duration-300 ease-in-out overflow-hidden"
    >
      {/* Nav area */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 flex flex-col gap-0.5">
        <div className="flex flex-col gap-0.5 mb-4">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>

        <SectionLabel label="Visualizações" collapsed={sidebarCollapsed} />
        <div className="flex flex-col gap-0.5 mt-1.5">
          {VIEW_NAV.map((item) => (
            <NavLink key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>
      </nav>

      {/* Live badge */}
      {!sidebarCollapsed && (
        <div className="mx-2 mb-2 px-3 py-2 rounded-xl bg-[#f0fdf4] dark:bg-[#14532d]/30 border border-[#bbf7d0] dark:border-[#166534]/50 flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]" />
          </span>
          <span className="text-xs font-semibold text-[#15803d] dark:text-[#4ade80]">
            Realtime ativo
          </span>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="border-t border-[#e4e4e7] dark:border-[#27272a] px-2 py-2">
        <button
          onClick={toggleCollapsed}
          title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-[#71717a] dark:text-[#52525b] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-white transition-colors duration-150"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 shrink-0 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

export function MobileDrawer() {
  const { sidebarOpen, closeSidebar } = useUIStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeSidebar]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeSidebar}
        className={[
          "fixed inset-0 z-[80] md:hidden bg-black/50 backdrop-blur-[2px] transition-opacity duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer Panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-[90] md:hidden w-72 max-w-[85vw] flex flex-col bg-white dark:bg-[#18181b] shadow-2xl transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#e4e4e7] dark:border-[#27272a]">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight">
              <BrandName />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dcfce7] dark:bg-[#14532d]/40 text-[#15803d] dark:text-[#4ade80]">
              Admin
            </span>
          </div>
          <button
            onClick={closeSidebar}
            aria-label="Fechar menu"
            className="p-2 rounded-lg text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] hover:text-[#18181b] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
          <div className="flex flex-col gap-0.5 mb-4">
            {MAIN_NAV.map((item) => (
              <NavLink key={item.href} item={item} collapsed={false} onClick={closeSidebar} />
            ))}
          </div>

          <SectionLabel label="Visualizações" collapsed={false} />
          <div className="flex flex-col gap-0.5 mt-1.5">
            {VIEW_NAV.map((item) => (
              <NavLink key={item.href} item={item} collapsed={false} onClick={closeSidebar} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e4e4e7] dark:border-[#27272a] flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]" />
          </span>
          <span className="text-xs font-medium text-[#52525b] dark:text-[#a1a1aa]">
            Realtime ativo
          </span>
        </div>
      </aside>
    </>
  );
}
