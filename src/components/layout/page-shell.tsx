import React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface PageShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({ children, showSidebar = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
