"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  MapPin,
  Flame,
  FileSpreadsheet,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "@/features/ui/ui.store";
import { BrandName } from "@/components/brand/brand-name";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const MAIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard Geral", icon: LayoutDashboard },
  { href: "/admin/occurrences", label: "Gestão de Ocorrências", icon: ClipboardList },
  { href: "/admin/collection-points", label: "Pontos de Recolha", icon: MapPin },
  { href: "/admin/reports", label: "Exportação de Relatórios", icon: FileSpreadsheet },
];

const VIEW_ITEMS: NavItem[] = [
  { href: "/admin/map", label: "Mapa de Ocorrências", icon: Map },
  { href: "/admin/heatmap", label: "Mapa de Calor (Beira)", icon: Flame, badge: "Live" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    sidebarOpen,
    closeSidebar,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useUIStore();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const renderLink = (item: NavItem, isMobile = false) => {
    const Icon = item.icon;
    const isActive =
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

    const isCollapsed = !isMobile && sidebarCollapsed;

    return (
      <div key={item.href} className="relative">
        <Link
          href={item.href}
          onClick={isMobile ? closeSidebar : undefined}
          onMouseEnter={() => setHoveredItem(item.href)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
            isCollapsed ? "justify-center px-2.5" : ""
          } ${
            isActive
              ? "bg-forestGreen/10 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen shadow-xs border border-forestGreen/20 dark:border-limeGreen/25"
              : "text-grey600 dark:text-grey400 hover:text-grey900 dark:hover:text-grey100 hover:bg-grey100/80 dark:hover:bg-grey800/60"
          }`}
        >
          {/* Active Accent Indicator */}
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-forestGreen dark:bg-limeGreen" />
          )}

          {/* Ícone */}
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
              isActive
                ? "bg-forestGreen text-white dark:bg-limeGreen dark:text-forestGreen shadow-sm shadow-forestGreen/20"
                : "bg-grey100 dark:bg-grey800/80 text-grey500 dark:text-grey400 group-hover:bg-grey200/80 dark:group-hover:bg-grey700 group-hover:text-grey900 dark:group-hover:text-grey100"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>

          {/* Texto e Badge (se expandido) */}
          {!isCollapsed && (
            <>
              <span className="truncate tracking-tight flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>

        {/* Tooltip flutuante quando a barra lateral está recolhida no Desktop */}
        {isCollapsed && hoveredItem === item.href && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="px-3 py-1.5 rounded-xl bg-grey900 dark:bg-grey800 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-grey700/50 flex items-center gap-2">
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white font-extrabold">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* BARRA LATERAL FIXA - DESKTOP */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-grey200/80 dark:border-grey800/80 bg-white/70 dark:bg-grey900/70 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 sticky top-[61px] h-[calc(100vh-61px)] ${
          sidebarCollapsed ? "w-[76px] p-3" : "w-64 p-4"
        }`}
      >
        {/* Navegação Superior */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-0.5 scrollbar-none">
          {/* Seção Principal */}
          <div className="flex flex-col gap-1.5">
            {!sidebarCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-grey400 dark:text-grey500 mb-1">
                Administração
              </div>
            )}
            {MAIN_ITEMS.map((item) => renderLink(item))}
          </div>

          {/* Seção Visualizações */}
          <div className="flex flex-col gap-1.5">
            {!sidebarCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-grey400 dark:text-grey500 mb-1">
                Visualizações
              </div>
            )}
            {VIEW_ITEMS.map((item) => renderLink(item))}
          </div>
        </div>

        {/* Rodapé da Barra Lateral */}
        <div className="pt-3 border-t border-grey200/80 dark:border-grey800/80 flex flex-col gap-2">
          {/* Indicador de Status do Realtime */}
          {!sidebarCollapsed ? (
            <div className="px-3 py-2 rounded-xl bg-forestGreen/5 dark:bg-limeGreen/5 border border-forestGreen/10 dark:border-limeGreen/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forestGreen dark:bg-limeGreen opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-forestGreen dark:bg-limeGreen"></span>
                </span>
                <span className="text-[11px] font-bold text-forestGreen dark:text-limeGreen">
                  Realtime Ativo
                </span>
              </div>
              <span className="text-[10px] font-mono text-grey400 dark:text-grey500">Live</span>
            </div>
          ) : (
            <div className="flex justify-center" title="Transmissão Realtime Ativa">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forestGreen dark:bg-limeGreen opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forestGreen dark:bg-limeGreen"></span>
              </span>
            </div>
          )}

          {/* Botão de Recolher / Expandir no Desktop */}
          <button
            onClick={toggleSidebarCollapsed}
            className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-grey600 dark:text-grey400 hover:text-grey900 dark:hover:text-grey100 hover:bg-grey100 dark:hover:bg-grey800 transition-colors ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
            aria-label="Alternar barra lateral"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span className="text-xs font-bold tracking-tight">Recolher Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* DRAWER FLUTUANTE - MOBILE */}
      {/* ========================================================================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop Blur com transição suave */}
          <div
            className="absolute inset-0 bg-grey950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={closeSidebar}
            aria-hidden
          />

          {/* Painel do Drawer */}
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white dark:bg-grey900 border-r border-grey200 dark:border-grey800 p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-250 ease-out">
            <div>
              {/* Cabeçalho do Drawer */}
              <div className="flex items-center justify-between border-b border-grey100 dark:border-grey800/80 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight">
                    <BrandName />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-forestGreen/10 text-forestGreen dark:bg-limeGreen/15 dark:text-limeGreen">
                    Admin
                  </span>
                </div>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-xl text-grey400 dark:text-grey500 hover:text-grey900 dark:hover:text-white hover:bg-grey100 dark:hover:bg-grey800 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Navegação */}
              <nav className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="px-3 text-[10px] font-black uppercase tracking-widest text-grey400 dark:text-grey500 mb-1">
                    Administração
                  </span>
                  {MAIN_ITEMS.map((item) => renderLink(item, true))}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="px-3 text-[10px] font-black uppercase tracking-widest text-grey400 dark:text-grey500 mb-1">
                    Visualizações
                  </span>
                  {VIEW_ITEMS.map((item) => renderLink(item, true))}
                </div>
              </nav>
            </div>

            {/* Rodapé Mobile */}
            <div className="pt-4 border-t border-grey100 dark:border-grey800/80 flex items-center justify-between text-xs text-grey500 dark:text-grey400 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forestGreen dark:bg-limeGreen animate-pulse" />
                <span>Txeneza Admin Live</span>
              </div>
              <span className="font-mono text-[10px] text-grey400">v1.2</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
