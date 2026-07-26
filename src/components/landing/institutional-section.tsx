"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Home, RefreshCw, Landmark } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const InstitutionalSection: React.FC = () => {
  const odsList = [
    {
      num: "03",
      title: "Saúde e Bem-Estar",
      desc: "Promover a saúde pública através da redução de lixeiras clandestinas que funcionam como focos de reprodução do mosquito transmissor da Malária e proliferação de diarreias.",
      icon: HeartPulse,
    },
    {
      num: "11",
      title: "Cidades e Comunidades Sustentáveis",
      desc: "Tornar os bairros da Beira mais limpos, resilientes a inundações e sustentáveis, garantindo vias públicas limpas e valas de drenagem desobstruídas.",
      icon: Home,
    },
    {
      num: "12",
      title: "Produção e Consumo Responsáveis",
      desc: "Fomentar a sensibilização comunitária para a redução do descarte desordenado, facilitando a identificação rápida e o encaminhamento correcto dos resíduos.",
      icon: RefreshCw,
    },
  ];

  return (
    <section id="ods" className="py-20 md:py-28 bg-background dark:bg-grey900 text-foreground dark:text-grey50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Partnerships & Delimitation */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
              06 · Enquadramento Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Apoio à gestão e sustentabilidade urbana
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              A <BrandName /> foi idealizada sob bases científicas para apoiar os planos locais de limpeza e higiene urbana. No âmbito do nosso estudo de viabilidade académica, a solução desenha sinergias com entidades activas na gestão de resíduos da Beira.
            </p>

            {/* Disclaimer Alert */}
            <div className="p-5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex gap-4 items-start">
              <Landmark className="w-5 h-5 text-forestGreen dark:text-limeGreen shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-foreground dark:text-slate-200">Delimitação de integração</h4>
                <p className="text-slate-600 dark:text-slate-500 mt-1 leading-relaxed">
                  Clarificamos que esta plataforma actua de forma independente como protótipo académico. Não possui integração automática formal instalada nos sistemas internos da <strong>CMB</strong>, <strong>AMOR</strong> ou <strong>Kolekt</strong>, servindo como uma proposta tecnológica viável para futura adopção.
                </p>
              </div>
            </div>

            {/* Entities list */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[10px] font-medium text-slate-500 uppercase tracking-widest block">Entidades referenciadas</span>
              <div className="flex flex-col divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10">
                {[
                  "CMB — Conselho Municipal da Beira",
                  "AMOR — Associação Moçambicana de Reciclagem",
                  "Kolekt — Plataforma de Incentivos",
                ].map((ent, idx) => (
                  <span key={idx} className="py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                    {ent}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: ODS blocks */}
          <div className="lg:col-span-7 flex flex-col">
            <span className="font-mono text-[11px] font-medium tracking-widest text-forestGreen dark:text-limeGreen uppercase block px-6 py-4 bg-background dark:bg-grey900 border border-b-0 border-slate-200 dark:border-white/10">
              Alinhamento com Objectivos da ONU (ODS)
            </span>

            <div
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 -mx-4 px-4 pb-2 pt-2
                         sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0 sm:overflow-visible sm:flex-col sm:gap-px
                         sm:bg-slate-200 sm:dark:bg-white/10 sm:border sm:border-slate-200 sm:dark:border-white/10"
            >
              {odsList.map((ods, idx) => {
                const Icon = ods.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="snap-start shrink-0 w-[85%] xs:w-[75%] sm:w-auto border border-slate-200 dark:border-white/10 sm:border-0 p-6 bg-background dark:bg-grey900 flex gap-5 items-start"
                  >
                  {/* Badge ODS */}
                  <div className="w-12 h-12 border border-forestGreen/30 dark:border-limeGreen/30 flex flex-col items-center justify-center shrink-0 text-forestGreen dark:text-limeGreen font-mono">
                    <span className="text-lg font-semibold leading-none">{ods.num}</span>
                    <span className="text-[7px] uppercase tracking-wider font-medium mt-0.5">ODS</span>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground dark:text-white flex items-center gap-2">
                      {ods.title}
                      <Icon className="w-4 h-4 text-slate-400" />
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {ods.desc}
                    </p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
