"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Eye, Building2, HelpCircle } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

import { Carousel } from "@/components/ui/carousel";

export const TargetAudienceSection: React.FC = () => {
  const groups = [
    {
      title: "Moradores dos Bairros Periféricos",
      desc: "Residentes das zonas mais vulneráveis (Manga, Munhava, Matacuane, Macurungo/Manganhe, Macuti, Chota, entre outros) que registam ocorrências e acompanham ativamente a resolução no terreno.",
      icon: Users,
      role: "Denúncia & Acompanhamento no Terreno",
    },
    {
      title: "Cidadãos em Geral",
      desc: "Qualquer munícipe ou visitante da Cidade da Beira que deseja consultar o mapa georreferenciado público em tempo real, sem necessidade de autenticação obrigatória.",
      icon: Eye,
      role: "Consulta Pública do Mapa",
    },
    {
      title: "Gestores Municipais (CMB)",
      desc: "Técnicos e decisores da Vereação de Higiene e Salubridade do Conselho Municipal da Beira, utilizando o painel web para moderar ocorrências, gerir pontos de recolha e gerar relatórios.",
      icon: Building2,
      role: "Gestão & Decisão Estratégica",
    },
  ];

  return (
    <section id="para-quem-e" className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            04 · Público-Alvo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            Para quem é o <BrandName />?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Uma plataforma inclusiva criada para aproximar cidadãos e gestores municipais na transformação do saneamento urbano da Cidade da Beira.
          </p>
        </div>

        {/* Audience Carousel */}
        <Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }} autoPlay interval={7000}>
          {groups.map((group, index) => {
            const Icon = group.icon;
            return (
              <div
                key={index}
                className="bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all h-full min-h-[290px]"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-forestGreen/5 dark:bg-limeGreen/10 border border-forestGreen/10 dark:border-limeGreen/20 w-fit mb-6">
                    <Icon className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3">
                    {group.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {group.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-forestGreen/10 dark:border-white/10 flex justify-between items-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-auto">
                  <span className="font-mono">Perfil</span>
                  <span className="text-forestGreen dark:text-limeGreen font-semibold normal-case tracking-normal text-xs">{group.role}</span>
                </div>
              </div>
            );
          })}
        </Carousel>

        {/* Monograph Quote Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-6 p-6 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start gap-6"
        >
          <div className="p-3 rounded-2xl bg-forestGreen/5 dark:bg-limeGreen/10 border border-forestGreen/10 dark:border-limeGreen/20 shrink-0">
            <HelpCircle className="w-5 h-5 text-forestGreen dark:text-limeGreen" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Participação Cidadã Digital na Beira</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              &ldquo;A capacitação do cidadão como sensor urbano permite democratizar o mapeamento georreferenciado e reduzir a assimetria na comunicação com a Vereação de Higiene e Salubridade do CMB.&rdquo;
              <span className="font-mono text-forestGreen dark:text-limeGreen font-semibold block mt-1.5 text-[11px]">— Paulo Babucho Issaca Tivane, 2026</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
