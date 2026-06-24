"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, ShieldAlert, CheckCircle2 } from "lucide-react";

export const AppMockup: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[310px] sm:max-w-[340px] aspect-[9/19.5]">
      {/* Glow Effect behind the phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-limeGreen/30 to-forestGreen/40 rounded-[40px] blur-3xl opacity-60 dark:opacity-40 -z-10 animate-pulse" />

      {/* Phone Case */}
      <div className="w-full h-full rounded-[42px] border-[10px] border-slate-900 bg-slate-950 p-2.5 shadow-2xl relative flex flex-col overflow-hidden">
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
        </div>

        {/* Screen Content */}
        <div className="flex-1 rounded-[32px] bg-grey50 overflow-hidden relative flex flex-col select-none text-slate-850 text-xs font-sans">
          
          {/* Status Bar */}
          <div className="h-7 pt-2 px-6 flex justify-between items-center text-[10px] text-slate-600 bg-slate-100/50 backdrop-blur-md z-45">
            <span>08:45</span>
            <div className="flex items-center gap-1">
              <span className="opacity-75">5G</span>
              <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-600 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header inside Mockup */}
          <div className="px-4 py-2 bg-forestGreen border-b border-forestGreen/20 flex justify-between items-center z-40">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                <img src="/icons/TXENEZA.svg" alt="Txeneza Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-[13px] tracking-tight text-white">Txeneza</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-1.5 py-0.5 bg-limeGreen/20 text-limeGreen border border-limeGreen/30 rounded font-semibold">
                Beira
              </span>
            </div>
          </div>

          {/* Simulated Map Area */}
          <div className="flex-1 relative bg-slate-100 overflow-hidden">
            {/* Realistic map screenshot generated for Beira */}
            <img 
              src="/image/beira_map_mockup.png" 
              alt="Beira realistic map view" 
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Neighborhood Labels */}
            <span className="absolute top-8 left-8 text-[9px] text-slate-600 font-extrabold uppercase tracking-wider">Munhava</span>
            <span className="absolute top-36 right-8 text-[9px] text-slate-600 font-extrabold uppercase tracking-wider">Chota</span>
            <span className="absolute bottom-28 left-6 text-[9px] text-slate-600 font-extrabold uppercase tracking-wider">Matacuane</span>
            <span className="absolute bottom-12 right-10 text-[9px] text-slate-600 font-extrabold uppercase tracking-wider">Inhamizua</span>

            {/* HEATMAP GLOWS (Glowing circular gradients) */}
            {/* Heat hotspot 1: Munhava */}
            <div className="absolute top-[20%] left-[22%] w-24 h-24 bg-red-500 rounded-full filter blur-xl opacity-30 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
            <div className="absolute top-[22%] left-[26%] w-12 h-12 bg-amber-400 rounded-full filter blur-lg opacity-40 mix-blend-multiply dark:mix-blend-screen" />
            
            {/* Heat hotspot 2: Chota */}
            <div className="absolute top-[42%] right-[16%] w-28 h-28 bg-orange-500 rounded-full filter blur-xl opacity-25 mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[46%] right-[20%] w-14 h-14 bg-red-400 rounded-full filter blur-lg opacity-35 mix-blend-multiply dark:mix-blend-screen" />

            {/* Heat hotspot 3: Matacuane */}
            <div className="absolute bottom-[32%] left-[22%] w-20 h-20 bg-red-500 rounded-full filter blur-lg opacity-25 mix-blend-multiply dark:mix-blend-screen" />

            {/* PULSING MARKERS (Pins with TXENEZA Logo) */}
            {/* Active Marker 1: Munhava */}
            <div className="absolute top-[28%] left-[30%] z-30 group cursor-pointer">
              <span className="absolute -top-1.5 -left-1.5 w-8 h-8 bg-limeGreen/45 rounded-full animate-ping" />
              <div className="w-5 h-5 bg-slate-950 border border-limeGreen/50 rounded-lg p-0.5 flex items-center justify-center shadow-xl relative transition-transform group-hover:scale-110">
                <img src="/icons/TXENEZA.svg" alt="Trash Pin" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Active Marker 2: Chota */}
            <div className="absolute top-[48%] right-[25%] z-30 group cursor-pointer">
              <span className="absolute -top-1.5 -left-1.5 w-8 h-8 bg-limeGreen/45 rounded-full animate-ping [animation-delay:0.5s]" />
              <div className="w-5 h-5 bg-slate-950 border border-limeGreen/50 rounded-lg p-0.5 flex items-center justify-center shadow-xl relative transition-transform group-hover:scale-110">
                <img src="/icons/TXENEZA.svg" alt="Trash Pin" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Active Marker 3: Matacuane */}
            <div className="absolute bottom-[38%] left-[28%] z-30 group cursor-pointer">
              <span className="absolute -top-1.5 -left-1.5 w-8 h-8 bg-limeGreen/45 rounded-full animate-ping [animation-delay:1s]" />
              <div className="w-5 h-5 bg-slate-950 border border-limeGreen/50 rounded-lg p-0.5 flex items-center justify-center shadow-xl relative transition-transform group-hover:scale-110">
                <img src="/icons/TXENEZA.svg" alt="Trash Pin" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Simulated UI Card Overlays inside Mockup */}
            {/* Floating Report Button */}
            <div className="absolute bottom-4 right-4 z-40">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-limeGreen text-forestGreen rounded-full flex items-center justify-center shadow-lg cursor-pointer"
              >
                <Camera className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
            </div>

            {/* Micro Details Card (Occurrence Preview) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 left-4 right-16 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2.5 shadow-xl z-40"
            >
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-slate-800">Acúmulo Crítico</h4>
                  <p className="text-[8px] text-slate-600 mt-0.5 truncate font-medium">Mercado de Munhava - Lixo na via pública</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[7px] px-1 bg-red-100 text-red-700 rounded-sm font-semibold">Alta Gravidade</span>
                    <span className="text-[7px] text-slate-400">Há 2 horas</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats Overlay (Shows success) */}
          <div className="absolute top-14 left-4 right-4 py-1.5 px-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-between shadow-lg z-40">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-forestGreen" />
              <span className="text-[9px] font-semibold text-slate-800">Denúncia enviada com sucesso!</span>
            </div>
            <span className="text-[8px] text-forestGreen font-bold font-mono">+10 XP</span>
          </div>

        </div>

        {/* Home Indicator Bar */}
        <div className="w-24 h-1 bg-slate-800 rounded-full mx-auto mt-2 shrink-0" />
      </div>
    </div>
  );
};
