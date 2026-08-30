"use client";

import React from "react";
import { Header } from "./header";
import { DesktopSidebar, MobileDrawer } from "./sidebar";

interface PageShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f9f9f9] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa]">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <DesktopSidebar />}
        {showSidebar && <MobileDrawer />}

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-6 sm:px-8 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
