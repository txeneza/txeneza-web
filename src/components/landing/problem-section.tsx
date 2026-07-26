"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, ShieldAlert, HeartPulse, CloudRain } from "lucide-react";

export const ProblemSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <section id="problema" className="py-20 md:py-28 bg-slate-50 dark:bg-grey900 text-foreground dark:text-grey50 border-y border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            01 · Estudo de Viabilidade
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            O desafio dos resíduos sólidos na Beira
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            A Cidade da Beira enfrenta desafios severos de saneamento. Dados recolhidos na nossa pesquisa demonstram o impacto crítico da gestão inadequada de resíduos na saúde e infraestrutura.
          </p>
        </div>

        {/* Content Grid — carrossel horizontal no mobile, grelha no desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 -mx-4 px-4 pb-2
                     sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 sm:gap-px
                     sm:bg-slate-200 sm:dark:bg-white/10 sm:border sm:border-slate-200 sm:dark:border-white/10"
        >

          {/* Card 1: 1000 Tons/dia */}
          <motion.div variants={itemVariants} className="snap-start shrink-0 w-[86%] xs:w-[78%] sm:w-auto border border-slate-200 dark:border-white/10 sm:border-0 p-6 sm:p-8 bg-slate-50 dark:bg-grey900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-forestGreen dark:text-limeGreen">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Toneladas produzidas vs. recolhidas
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Diariamente são geradas cerca de <strong className="text-foreground dark:text-white font-semibold">~1000 toneladas</strong> de resíduos sólidos na Beira. Devido a limitações logísticas de recursos, <strong className="text-foreground dark:text-white font-semibold">apenas metade</strong> desse volume é efetivamente recolhida pelo município.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium mb-2">
                <span>Taxa de recolha</span>
                <span className="font-mono text-red-600 dark:text-red-400">~50% acumulado</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10">
                <div className="w-1/2 h-full bg-red-500" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bairros Afectados */}
          <motion.div variants={itemVariants} className="snap-start shrink-0 w-[86%] xs:w-[78%] sm:w-auto border border-slate-200 dark:border-white/10 sm:border-0 p-6 sm:p-8 bg-slate-50 dark:bg-grey900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Bairros vulneráveis e críticos
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                A distribuição de contentores cria disparidades. Os bairros periféricos e de alta densidade populacional são os mais afectados pela falta de infraestruturas de saneamento básico.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 font-medium block mb-3 uppercase tracking-wide font-mono">Zonas mais expostas</span>
              <div className="flex flex-wrap gap-2">
                {["Munhava", "Chota", "Matacuane", "Inhamizua"].map((bairro, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/15"
                  >
                    {bairro}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Doenças e Malária */}
          <motion.div variants={itemVariants} className="snap-start shrink-0 w-[86%] xs:w-[78%] sm:w-auto border border-slate-200 dark:border-white/10 sm:border-0 p-6 sm:p-8 bg-slate-50 dark:bg-grey900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                <HeartPulse className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Vetores de doenças e saúde pública
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                O lixo acumulado nas valas de drenagem atrai mosquitos e parasitas. Segundo o questionário oficial do nosso estudo, <strong className="text-foreground dark:text-white font-semibold">69% dos residentes</strong> entrevistados correlacionam directamente o acúmulo de resíduos à proliferação de <strong className="text-red-600 dark:text-red-400 font-semibold">Malária</strong>.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex items-center gap-5">
              <span className="text-4xl font-mono font-semibold text-red-600 dark:text-red-400">69%</span>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                Dos residentes associam o lixo directamente ao aumento de casos de malária e diarreias.
              </div>
            </div>
          </motion.div>

          {/* Card 4: Inundações / Ciclone Idai */}
          <motion.div variants={itemVariants} className="snap-start shrink-0 w-[86%] xs:w-[78%] sm:w-auto border border-slate-200 dark:border-white/10 sm:border-0 p-6 sm:p-8 bg-slate-50 dark:bg-grey900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
                <CloudRain className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Obstrução de drenagem e inundações
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                A Beira é uma cidade costeira abaixo do nível do mar, altamente suscetível a tempestades tropicais (como o devastador <strong className="text-foreground dark:text-white font-semibold">Ciclone Idai</strong>). Lixo despejado incorretamente bloqueia os canais de drenagem, multiplicando o impacto de inundações urbanas severas.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 shrink-0" />
              Impacto agravado pelo entupimento das saídas de maré da Beira.
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
