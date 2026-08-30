"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Home, RefreshCw, Landmark } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";
import { Carousel } from "@/components/ui/carousel";

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
    <section id="ods" className="relative overflow-hidden py-20 md:py-28 bg-transparent text-foreground dark:text-grey50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Partnerships & Delimitation */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
              05 · Enquadramento Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Apoio à gestão e sustentabilidade urbana
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              A <BrandName /> foi idealizada sob bases científicas para apoiar os planos locais de limpeza e higiene urbana. No âmbito do nosso estudo de viabilidade académica, a solução desenha sinergias com entidades activas na gestão de resíduos da Beira.
            </p>

            {/* Disclaimer Alert */}
            <div className="p-6 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex gap-4 items-start">
              <div className="p-2.5 rounded-2xl bg-forestGreen/5 dark:bg-limeGreen/10 border border-forestGreen/10 dark:border-limeGreen/20 shrink-0">
                <Landmark className="w-5 h-5 text-forestGreen dark:text-limeGreen" />
              </div>
              <div className="text-xs">
                <h4 className="font-semibold text-foreground dark:text-slate-200">Delimitação de integração</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Clarificamos que esta plataforma actua de forma independente como protótipo académico. Não possui integração automática formal instalada nos sistemas internos da <strong>CMB</strong>, <strong>AMOR</strong> ou <strong>Kolekt</strong>, servindo como uma proposta tecnológica viável para futura adopção.
                </p>
              </div>
            </div>

            {/* Entities list */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[10px] font-medium text-slate-500 uppercase tracking-widest block">Entidades e Atores Referenciados</span>
              <div className="flex flex-col divide-y divide-forestGreen/10 dark:divide-white/10 border-y border-forestGreen/10 dark:border-white/10">
                {[
                  "CMB — Conselho Municipal da Beira (Gestão de Resíduos)",
                  "SASB — Serviço Autónomo de Saneamento da Beira (Drenagem)",
                  "AMOR — Associação Moçambicana de Reciclagem (Ecopontos)",
                  "Kolekt — Plataforma de Incentivos",
                ].map((ent, idx) => (
                  <span key={idx} className="py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                    {ent}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Credit */}
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-limeGreen rounded-full" />
              <span>Investigação desenvolvida por <strong>Paulo Babucho Issaca Tivane</strong> — <strong>UNIZA 2026</strong></span>
            </div>
          </div>



            {/* Right Column: ODS blocks */}
          <div className="lg:col-span-7 flex flex-col">
            <span className="font-mono text-[11px] font-medium tracking-widest text-forestGreen dark:text-limeGreen uppercase block px-6 py-4 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-b-0 border-forestGreen/15 dark:border-forestGreen/30 rounded-t-3xl shadow-sm">
              Alinhamento com Objectivos da ONU (ODS)
            </span>

            <div className="p-4 sm:p-6 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-b-3xl shadow-xl">
              <Carousel itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }} autoPlay interval={6500}>
                {odsList.map((ods, idx) => {
                  const Icon = ods.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 sm:p-7 bg-white/60 dark:bg-forestGreen/20 rounded-2xl border border-forestGreen/10 dark:border-white/10 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all min-h-[170px]"
                    >
                      {/* Badge ODS */}
                      <div className="w-12 h-12 rounded-2xl border border-forestGreen/30 dark:border-limeGreen/30 bg-forestGreen/10 dark:bg-limeGreen/10 flex flex-col items-center justify-center shrink-0 text-forestGreen dark:text-limeGreen font-mono shadow-sm">
                        <span className="text-xl font-bold leading-none">{ods.num}</span>
                        <span className="text-[8px] uppercase tracking-widest font-bold mt-0.5">ODS</span>
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-white flex items-center gap-2">
                          {ods.title}
                          <Icon className="w-4.5 h-4.5 text-forestGreen dark:text-limeGreen" />
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                          {ods.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>

        </div>
      </div>

      {/* Fusão suave com o rodapé: onda sólida, sem banding de cor */}
      <div className="absolute inset-x-0 bottom-0 leading-none pointer-events-none translate-y-px">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-12 sm:h-20 block">
          <path
            d="M0,45 C240,80 480,15 720,42 C960,70 1200,20 1440,52 L1440,90 L0,90 Z"
            className="fill-forestGreen"
          />
        </svg>
      </div>
    </section>
  );
};
