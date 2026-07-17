"use client";

import React from "react";

export const AppMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[310px] sm:max-w-[340px] aspect-[9/19.5]">
      {/* Glow Effect behind the phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-limeGreen/30 to-forestGreen/40 rounded-[40px] blur-3xl opacity-60 dark:opacity-40 -z-10 animate-pulse" />

      {/* Phone Case */}
      <div className="w-full h-full rounded-[42px] border-[10px] border-slate-900 bg-slate-950 p-2.5 shadow-2xl relative flex flex-col overflow-hidden">
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-grey900/90 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
        </div>

        {/* Screen Content */}
        <div className="flex-1 rounded-[32px] bg-grey50 overflow-hidden relative select-none">
          <img 
            src="/image/tela app.jpg" 
            alt="Txeneza App Screen" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Home Indicator Bar */}
        <div className="w-24 h-1 bg-slate-800 rounded-full mx-auto mt-2 shrink-0" />
      </div>
    </div>
  );
};
