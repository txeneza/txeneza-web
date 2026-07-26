"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Sliders, CheckCircle } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Fotografar",
      desc: "Abra a aplicação e capture uma foto nítida do ponto de lixo acumulado. A imagem ajuda a verificar as dimensões e o tipo de resíduo.",
      icon: Camera,
    },
    {
      num: "02",
      title: "Localizar",
      desc: "O GPS do seu telemóvel deteta a localização geográfica exacta de forma automática. Não precisa de digitar moradas ou saber nomes de ruas.",
      icon: MapPin,
    },
    {
      num: "03",
      title: "Classificar",
      desc: "Indique o nível de gravidade aproximado (pequeno, médio ou crítico) para ajudar as equipas de limpeza a priorizar as ocorrências.",
      icon: Sliders,
    },
    {
      num: "04",
      title: "Confirmar",
      desc: "Submeta o relatório. A ocorrência é guardada, aparece instantaneamente no mapa público e fica pronta para análise municipal.",
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
    <section id="funcionamento" className="py-20 md:py-28 bg-background dark:bg-grey900 text-foreground dark:text-grey50">
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

        {/* Steps — carrossel horizontal no mobile, grelha no desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 -mx-4 px-4 pb-2
                     sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-px
                     sm:bg-slate-200 sm:dark:bg-white/10 sm:border sm:border-slate-200 sm:dark:border-white/10"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="snap-start shrink-0 w-[70%] xs:w-[60%] sm:w-auto border border-slate-200 dark:border-white/10 sm:border-0 bg-background dark:bg-grey900 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <Icon className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-600">
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
