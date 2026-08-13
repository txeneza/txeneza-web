"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppMockup } from "./app-mockup";
import { PlusCircle, Flame, Info, X } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const HeroSection: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const appUri = "txeneza://";
    const fallbackTimeout = 1200;

    let appOpened = false;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.location.href = appUri;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (!appOpened) {
        setShowToast(true);
        const downloadSection = document.getElementById("download-app");
        if (downloadSection) {
          downloadSection.scrollIntoView({ behavior: "smooth" });
        }
        setTimeout(() => setShowToast(false), 5000);
      }
    }, fallbackTimeout);
  };

  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-forestGreen text-white overflow-hidden">
      {/* Hairline grid frame — signature device, not a gradient blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-y-0 left-4 sm:left-6 lg:left-8 w-px bg-white/[0.06]" />
          <div className="absolute inset-y-0 right-4 sm:right-6 lg:right-8 w-px bg-white/[0.06]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center lg:justify-start gap-2 mx-auto lg:mx-0 w-fit"
            >
              <span className="w-1.5 h-1.5 bg-limeGreen shrink-0" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-limeGreen">
                Saneamento Digital · Cidade da Beira
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <img
                src="/image/TXENEZA.png"
                alt="Txeneza Logo"
                className="w-11 h-14 sm:w-12 sm:h-16 object-contain shrink-0"
              />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                <BrandName variant="onDark" />
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl font-medium text-slate-100 leading-snug max-w-xl mx-auto lg:mx-0"
            >
              Por uma Beira mais limpa e saudável. Denuncie, mapeie e transforme a sua comunidade.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Uma plataforma colaborativa que permite aos cidadãos reportar focos de lixo acumulado em segundos pelo telemóvel e ajuda o Município a priorizar as equipas de recolha.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-4"
            >
              <button
                onClick={handleReportClick}
                className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-md text-sm font-semibold bg-limeGreen text-forestGreen hover:bg-lightLime transition-colors"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                Denunciar um ponto de lixo
              </button>

              <a
                href="#mapa-preview"
                className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-md text-sm font-semibold text-slate-100 border border-white/15 hover:border-white/30 hover:bg-white/5 transition-colors"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                Ver mapa de calor
              </a>
            </motion.div>

            {/* Stat strip — replaces the bouncing scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden lg:grid grid-cols-3 gap-8 mt-10 pt-6 border-t border-white/10 max-w-lg"
            >
              <div>
                <div className="font-mono text-2xl font-medium text-white">~1000t</div>
                <div className="text-[11px] text-slate-400 mt-1">Resíduos gerados/dia</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-medium text-white">69%</div>
                <div className="text-[11px] text-slate-400 mt-1">Associam lixo à malária</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-medium text-white">4</div>
                <div className="text-[11px] text-slate-400 mt-1">Bairros prioritários</div>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Content (Mockup) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center w-full relative"
          >
            <AppMockup />
          </motion.div>

        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] sm:w-full max-w-md"
          >
            <div className="bg-grey950 border border-white/10 shadow-2xl rounded-md p-4 flex gap-3.5 items-start text-white">
              <div className="p-2 rounded-md bg-limeGreen/10 border border-limeGreen/20 text-limeGreen shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-mono text-[11px] uppercase tracking-widest text-limeGreen">
                  Aplicação não detetada
                </h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
                  Para efetuar uma denúncia, necessita da aplicação <BrandName />. A encaminhar para a secção de descarregamento abaixo...
                </p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-slate-500 hover:text-white transition-colors p-1"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Fusão suave com a secção seguinte */}
      <div className="absolute inset-x-0 bottom-0 leading-none pointer-events-none translate-y-px">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-12 sm:h-20 block">
          <path
            d="M0,45 C240,10 480,75 720,48 C960,20 1200,70 1440,38 L1440,90 L0,90 Z"
            className="fill-mintGreen/40 dark:fill-forestGreen/70 transition-colors duration-500"
          />
        </svg>
      </div>
    </section>
  );
};
