"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Sliders, CheckCircle } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Fotografar & IA",
      desc: "Capture a foto do resíduo. A visão computacional via Inteligência Artificial (Google Gemini) classifica automaticamente a tipologia e o nível de gravidade.",
      icon: Camera,
    },
    {
      num: "02",
      title: "Localizar (Offline-First)",
      desc: "Georreferenciação automática via GPS. Graças à arquitetura Offline-First, a denúncia é guardada sem perda de dados mesmo em conectividade intermitente.",
      icon: MapPin,
    },
    {
      num: "03",
      title: "Assistente Xeni & Status",
      desc: "O assistente conversacional Xeni orienta o cidadão. O mapa de calor georreferenciado (KDE) direciona a ocorrência à equipa municipal adequada.",
      icon: Sliders,
    },
    {
      num: "04",
      title: "Verificação Fotográfica",
      desc: "Após a recolha, o ciclo encerra com a verificação fotográfica antes/depois, garantindo transparência, credibilidade e responsabilização municipal.",
      icon: CheckCircle,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <section id="funcionamento" className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            02 · Fluxo de Reporte
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            Como funciona a <BrandName />?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Reportar um foco de lixo leva menos de 1 minuto. Um fluxo simples e acessível para qualquer cidadão colaborar na melhoria do saneamento da cidade.
          </p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all relative overflow-hidden group"
              >
                {/* Accent top line on hover */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-limeGreen to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-forestGreen/5 dark:bg-limeGreen/10 border border-forestGreen/10 dark:border-limeGreen/20">
                      <Icon className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      {step.num}/04
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
