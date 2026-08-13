"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, BarChart3, Fingerprint } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

export const SocialProofSection: React.FC = () => {
  const stats = [
    {
      percentage: 76.7,
      title: "Prontidão para Uso",
      desc: (
        <>
          76,7% dos munícipes entrevistados afirmaram estar totalmente dispostos a adoptar a aplicação <BrandName /> para denunciar problemas no seu bairro.
        </>
      ),
      label: "Dispostos a usar a app",
    },
    {
      percentage: 89.3,
      title: "Funcionalidades Críticas",
      desc: "89,3% expressaram a necessidade crucial de poder anexar fotografias reais e registar automaticamente a sua localização GPS para validação das denúncias.",
      label: "Exigem foto & GPS",
    },
  ];

  const secondaryStats = [
    { icon: Award, value: "100%", label: "Transparência Pública", desc: "Acesso total aos reportes por qualquer cidadão." },
    { icon: BarChart3, value: "2x mais", label: "Eficiência de Resposta", desc: "Priorização inteligente do envio de equipas." },
    { icon: Fingerprint, value: "Privacidade", label: "Anonimato Garantido", desc: "Denuncie com segurança sem expor dados pessoais." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50 border-y border-forestGreen/10 dark:border-forestGreen/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            05 · Validação Científica & Usabilidade
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            Aceitação e Hipóteses Validadas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Inquérito de opinião aos moradores da Beira e avaliação de usabilidade sob a norma <strong className="text-foreground dark:text-white font-semibold">ISO 9241-11</strong> e as <strong className="text-foreground dark:text-white font-semibold">Heurísticas de Nielsen (1994)</strong>. As hipóteses H1, H2 e H3 foram confirmadas.
          </p>
        </div>

        {/* Circular Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all"
            >
              {/* SVG Ring Progress */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-forestGreen dark:stroke-limeGreen"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="301.6"
                    initial={{ strokeDashoffset: 301.6 }}
                    whileInView={{ strokeDashoffset: 301.6 - (301.6 * stat.percentage) / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-mono font-semibold text-foreground dark:text-white">{stat.percentage}%</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold">Apoio</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center md:text-left">
                <span className="font-mono text-[11px] font-medium text-forestGreen dark:text-limeGreen uppercase tracking-wide">{stat.label}</span>
                <h3 className="text-lg font-semibold text-foreground dark:text-white mt-1.5 mb-2.5">
                  {stat.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small stats cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl"
        >
          {secondaryStats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={index} variants={itemVariants} className="p-6 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex gap-4 items-start hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
                <div className="p-2.5 rounded-2xl bg-forestGreen/5 dark:bg-limeGreen/10 border border-forestGreen/10 dark:border-limeGreen/20 shrink-0">
                  <Icon className="w-5 h-5 text-forestGreen dark:text-limeGreen" />
                </div>
                <div>
                  <div className="text-lg font-mono font-semibold text-foreground dark:text-white">{item.value}</div>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{item.label}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
