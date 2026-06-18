import React from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Txeneza
        </Link>
        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded font-semibold">
          Web App
        </span>
      </div>
      <nav className="flex items-center gap-4">
        <Link href="/map" className="text-sm font-medium hover:text-blue-600 transition-colors">
          Mapa
        </Link>
        <Link href="/admin" className="text-sm font-medium hover:text-blue-600 transition-colors">
          Admin
        </Link>
        <Link href="/login" className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors">
          Entrar
        </Link>
      </nav>
    </header>
  );
};
