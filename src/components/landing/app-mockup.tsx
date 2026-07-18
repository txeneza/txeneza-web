"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const AppMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] aspect-[9/19.5]">
      {/* Glow Effect behind the phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-limeGreen/30 to-forestGreen/40 rounded-[40px] blur-3xl opacity-60 dark:opacity-40 -z-10 animate-pulse" />

      {/* Phone Case — acabamento "titânio": aro em degradê + brilho interior */}
      <div className="w-full h-full rounded-[42px] bg-gradient-to-br from-slate-700 via-slate-900 to-black p-[3px] shadow-2xl relative">
        <div className="w-full h-full rounded-[39px] border-[7px] border-slate-950 bg-slate-950 p-1.5 relative flex flex-col overflow-hidden ring-1 ring-white/10">
          {/* Notch / Speaker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-10 h-1 bg-slate-800 rounded-full" />
            <div className="w-2 h-2 bg-slate-950 rounded-full border border-slate-800" />
          </div>

          {/* Botões laterais (detalhe realista) */}
          <div className="absolute -left-[9px] top-[22%] w-[3px] h-8 bg-slate-800 rounded-r-sm" />
          <div className="absolute -left-[9px] top-[32%] w-[3px] h-12 bg-slate-800 rounded-r-sm" />
          <div className="absolute -right-[9px] top-[26%] w-[3px] h-14 bg-slate-800 rounded-l-sm" />

          {/* Screen Content */}
          <div className="flex-1 rounded-[30px] bg-grey50 overflow-hidden relative select-none">
            <img
              src="/image/app-screenshot-mapa.jpg"
              alt="Ecrã da aplicação Txeneza a mostrar o mapa de ocorrências na Beira, com ocorrências pendentes e resolvidas"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Brilho de vidro (reflexo diagonal subtil no topo do ecrã) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Home Indicator Bar */}
          <div className="w-24 h-1 bg-white/70 rounded-full mx-auto mt-1.5 mb-0.5 shrink-0" />
        </div>
      </div>

      {/* Badge flutuante: tempo real (canto superior direito) */}
      <div className="hidden sm:flex absolute -right-6 top-[18%] items-center gap-2 bg-white dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl pl-2.5 pr-3.5 py-2 shadow-xl">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-limeGreen opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forestGreen dark:bg-limeGreen" />
        </span>
        <span className="text-[11px] font-bold text-forestGreen dark:text-grey50 whitespace-nowrap">
          Tempo real
        </span>
      </div>

      {/* Badge flutuante: pendentes (lateral esquerda) */}
      <div className="hidden md:flex absolute -left-8 top-[46%] flex-col gap-0.5 bg-white dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl px-4 py-2.5 shadow-xl">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-lg font-black leading-none">4</span>
        </div>
        <span className="text-[10px] font-bold text-grey600 dark:text-grey400 uppercase tracking-wide">
          Pendentes
        </span>
      </div>

      {/* Badge flutuante: resolvidas (canto inferior direito) */}
      <div className="hidden sm:flex absolute -right-5 bottom-[16%] items-center gap-2 bg-white dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-2xl pl-2.5 pr-3.5 py-2 shadow-xl">
        <CheckCircle2 className="w-4 h-4 text-forestGreen dark:text-limeGreen shrink-0" />
        <span className="text-[11px] font-bold text-forestGreen dark:text-grey50 whitespace-nowrap">
          1 Resolvida
        </span>
      </div>
    </div>
  );
};
