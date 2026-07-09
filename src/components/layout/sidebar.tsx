import React from "react";
import Link from "next/link";
import { LayoutDashboard, ClipboardList, Map, MapPin, Flame } from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-grey100 dark:bg-grey900/40 border-r border-grey200 dark:border-grey800 min-h-[calc(100vh-65px)] p-6 hidden md:block">
      <nav className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-grey600 dark:text-grey400 uppercase tracking-wider mb-2">
          Painel Principal
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-grey200 dark:hover:bg-grey800 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link
          href="/admin/occurrences"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-grey200 dark:hover:bg-grey800 transition-colors"
        >
          <ClipboardList className="w-4 h-4" /> Ocorrências
        </Link>
        <Link
          href="/admin/collection-points"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-grey200 dark:hover:bg-grey800 transition-colors"
        >
          <MapPin className="w-4 h-4" /> Pontos de Recolha
        </Link>
        
        <div className="text-xs font-semibold text-grey600 dark:text-grey400 uppercase tracking-wider mt-6 mb-2">
          Visualizações
        </div>
        <Link
          href="/map"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-grey200 dark:hover:bg-grey800 transition-colors"
        >
          <Map className="w-4 h-4" /> Mapa de Ocorrências
        </Link>
        <Link
          href="/admin/heatmap"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-grey200 dark:hover:bg-grey800 transition-colors group"
        >
          <Flame className="w-4 h-4 text-forestGreen dark:text-limeGreen" />
          <span>Mapa de Calor</span>
          <span className="ml-auto text-[8px] tracking-wider uppercase px-1.5 py-0.5 bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen rounded-md font-black border border-forestGreen/10 dark:border-limeGreen/10">
            P&E
          </span>
        </Link>
      </nav>
    </aside>
  );
};
