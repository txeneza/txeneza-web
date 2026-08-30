import React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface PageShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground dark:bg-grey900 dark:text-grey50">
      <Header />
      <div className="flex flex-1 relative">
        {showSidebar && <Sidebar />}
        <main className="flex-1 min-w-0 p-5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
};
