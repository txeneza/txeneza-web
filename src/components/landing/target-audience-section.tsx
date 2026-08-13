"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, Zap, Store, HelpCircle } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const TargetAudienceSection: React.FC = () => {
  const groups = [
    {
      title: "Mulheres Chefes de Família",
      desc: "Historicamente responsáveis pela gestão doméstica e salubridade dos lares. São as primeiras a lidar com as consequências de lixeiras próximas a habitações e o risco directo de saúde para as crianças.",
      icon: Home,
      role: "Gestão do lar & protecção familiar",
    },
    {
      title: "Jovens e Estudantes",
      desc: "A geração conectada da Beira. Funcionam como facilitadores digitais na comunidade, ajudando vizinhos mais velhos a registar reportes e liderando ações voluntárias de limpeza nos bairros.",
      icon: Zap,
      role: "Mobilização digital & voluntariado",
    },
    {
      title: "Vendedores Ambulantes",
      desc: "Trabalham diariamente nos mercados informais e vias públicas. Estão directamente expostos aos focos de resíduos não recolhidos que prejudicam as suas vendas e ameaçam a higiene dos produtos alimentares.",
      icon: Store,
      role: "Higiene no comércio de rua",
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
    <section id="para-quem-e" className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            04 · Impacto Social
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            Para quem é a <BrandName />?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Embora desenhada para toda a população da Beira, a nossa monografia científica identifica três grupos prioritários que mais sofrem com a ineficiência do saneamento e mais beneficiam da plataforma.
          </p>
        </div>

        {/* Audience */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {groups.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all"
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

                <div className="pt-4 border-t border-forestGreen/10 dark:border-white/10 flex justify-between items-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  <span className="font-mono">Papel</span>
                  <span className="text-forestGreen dark:text-limeGreen font-semibold normal-case tracking-normal text-xs">{group.role}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

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
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Informação Geográfica Voluntária (VGI) & Inclusão Cidadã</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              &ldquo;Sob o paradigma da Informação Geográfica Voluntária (Goodchild, 2007), a capacitação do cidadão como sensor urbano permite democratizar o mapeamento georreferenciado e reduzir a assimetria na comunicação com o Conselho Municipal da Beira.&rdquo;
              <span className="font-mono text-forestGreen dark:text-limeGreen font-semibold block mt-1.5 text-[11px]">— Paulo Babucho Issaca Tivane, Monografia UNIZA 2026</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
