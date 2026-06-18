import React from "react";
import Link from "next/link";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-65px)] p-6 hidden md:block">
      <nav className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Painel Principal
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          📊 Dashboard
        </Link>
        <Link
          href="/admin/occurrences"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          📝 Ocorrências
        </Link>
        
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
          Configurações
        </div>
        <Link
          href="/map"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          🗺️ Visualizar Mapa
        </Link>
      </nav>
    </aside>
  );
};
