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
        <div className="flex-1 rounded-[32px] bg-slate-900 overflow-hidden relative flex flex-col select-none text-white text-xs font-sans">
          
          {/* Status Bar */}
          <div className="h-7 pt-2 px-6 flex justify-between items-center text-[10px] text-slate-400 bg-slate-950/40 backdrop-blur-md z-45">
            <span>08:45</span>
            <div className="flex items-center gap-1">
              <span className="opacity-75">5G</span>
              <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header inside Mockup */}
          <div className="px-4 py-2 bg-forestGreen border-b border-forestGreen/20 flex justify-between items-center z-40">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-limeGreen flex items-center justify-center text-[9px] font-black text-forestGreen">
                T
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
          <div className="flex-1 relative bg-slate-950 overflow-hidden">
            {/* Map Roads Grid Simulation */}
            <svg className="absolute inset-0 w-full h-full opacity-20 stroke-slate-700 stroke-[1.5]" fill="none">
              <path d="M-20 80 H400 M-20 180 H400 M-20 280 H400" />
              <path d="M80 -20 V600 M180 -20 V600 M280 -20 V600" />
              {/* Diagonal roads */}
              <path d="M-20 -20 L400 400 M-20 200 L400 620 M200 -20 L-20 200" />
            </svg>

            {/* Neighborhood Labels */}
            <span className="absolute top-8 left-8 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Munhava</span>
            <span className="absolute top-36 right-8 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Chota</span>
            <span className="absolute bottom-28 left-6 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Matacuane</span>
            <span className="absolute bottom-12 right-10 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Inhamizua</span>

            {/* HEATMAP GLOWS (Glowing circular gradients) */}
            {/* Heat hotspot 1: Munhava */}
            <div className="absolute top-12 left-10 w-24 h-24 bg-red-600 rounded-full filter blur-xl opacity-60 mix-blend-screen animate-pulse" />
            <div className="absolute top-16 left-14 w-12 h-12 bg-amber-500 rounded-full filter blur-lg opacity-70 mix-blend-screen" />
            
            {/* Heat hotspot 2: Chota */}
            <div className="absolute top-32 right-12 w-28 h-28 bg-orange-600 rounded-full filter blur-xl opacity-50 mix-blend-screen" />
            <div className="absolute top-36 right-16 w-14 h-14 bg-red-500 rounded-full filter blur-lg opacity-60 mix-blend-screen" />

            {/* Heat hotspot 3: Matacuane */}
            <div className="absolute bottom-24 left-12 w-20 h-20 bg-red-600 rounded-full filter blur-lg opacity-50 mix-blend-screen" />

            {/* PULSING MARKERS (Pins) */}
            {/* Active Marker 1: Munhava (Large Accumulation) */}
            <div className="absolute top-20 left-16 z-30 group cursor-pointer">
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500/40 rounded-full animate-ping" />
              <div className="w-3 h-3 bg-red-600 rounded-full border border-white flex items-center justify-center shadow-lg relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Active Marker 2: Chota */}
            <div className="absolute top-40 right-20 z-30">
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-orange-500/40 rounded-full animate-ping [animation-delay:0.5s]" />
              <div className="w-3 h-3 bg-orange-500 rounded-full border border-white flex items-center justify-center shadow-lg relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Active Marker 3: Matacuane */}
            <div className="absolute bottom-28 left-20 z-30">
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500/40 rounded-full animate-ping [animation-delay:1s]" />
              <div className="w-3 h-3 bg-amber-500 rounded-full border border-white flex items-center justify-center shadow-lg relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
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
              className="absolute bottom-4 left-4 right-16 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 shadow-xl z-40"
            >
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-white">Acúmulo Crítico</h4>
                  <p className="text-[8px] text-slate-400 mt-0.5 truncate">Mercado de Munhava - Lixo na via pública</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[7px] px-1 bg-red-500/20 text-red-400 rounded-sm">Alta Gravidade</span>
                    <span className="text-[7px] text-slate-500">Há 2 horas</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats Overlay (Shows success) */}
          <div className="absolute top-14 left-4 right-4 py-1.5 px-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-full flex items-center justify-between shadow-lg z-40">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-limeGreen" />
              <span className="text-[9px] font-medium text-slate-200">Denúncia enviada com sucesso!</span>
            </div>
            <span className="text-[8px] text-limeGreen font-bold font-mono">+10 XP</span>
          </div>

        </div>

        {/* Home Indicator Bar */}
        <div className="w-24 h-1 bg-slate-800 rounded-full mx-auto mt-2 shrink-0" />
      </div>
    </div>
  );
};
