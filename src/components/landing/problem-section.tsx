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
    <section id="problema" className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50 border-y border-forestGreen/10 dark:border-forestGreen/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            01 · O Problema
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            O desafio dos resíduos sólidos na Cidade da Beira
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            A Beira produz cerca de <strong>1.000 toneladas de resíduos sólidos por dia</strong>, mas o Conselho Municipal da Beira (CMB) recolhe apenas metade. Nos bairros periféricos, <strong>45,7% dos munícipes</strong> observam lixo acumulado diariamente.
          </p>
        </div>

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* Card 1: Produção diária & Dificuldade de Recolha */}
          <motion.div variants={itemVariants} className="p-5 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-forestGreen dark:text-limeGreen">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Produção diária vs. Recolha municipal
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Das <strong className="text-foreground dark:text-white font-semibold">1.000 toneladas/dia</strong> geradas na Beira, cerca de <strong className="text-foreground dark:text-white font-semibold">50% ficam sem recolha</strong> adequada. Isto agrava o mau cheiro, a obstrução de ruas e valas de drenagem, e a proliferação de mosquitos com elevado risco de malária e contaminação.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium mb-2">
                <span>Munícipes com lixo diário à porta</span>
                <span className="font-mono text-red-600 dark:text-red-400">45,7% inquiridos</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="w-[45.7%] h-full bg-red-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Falha dos Canais Informais */}
          <motion.div variants={itemVariants} className="p-5 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Ineficácia dos canais informais (WhatsApp)
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                As denúncias atuais são feitas de forma informal em grupos de WhatsApp, <strong className="text-foreground dark:text-white font-semibold">sem dados georreferenciados ou verificáveis</strong>. Apenas <strong className="text-foreground dark:text-white font-semibold">31,4% dos moradores</strong> já denunciaram, com um nível de satisfação médio de apenas <strong className="text-amber-600 dark:text-amber-400 font-semibold">2,74 em 5</strong>.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium mb-2">
                <span>Munícipes que já denunciaram</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">31,4% (Satisfação 2,74/5)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="w-[31.4%] h-full bg-amber-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Motivos para Não Denunciar */}
          <motion.div variants={itemVariants} className="p-5 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                <HeartPulse className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Barreiras à participação cidadã
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Os principais motivos indicados para nunca denunciar um ponto de lixo são <strong className="text-foreground dark:text-white font-semibold">não saber a quem reportar (33%)</strong> e o <strong className="text-foreground dark:text-white font-semibold">desceticismo de que a situação seja resolvida (33%)</strong>.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10 flex items-center gap-4">
              <div className="flex-1 text-center p-2 rounded-xl bg-forestGreen/5 dark:bg-white/5 border border-forestGreen/10 dark:border-white/10">
                <span className="text-2xl font-mono font-bold text-forestGreen dark:text-limeGreen">33%</span>
                <span className="text-[10px] text-slate-500 block">Não sabem a quem reportar</span>
              </div>
              <div className="flex-1 text-center p-2 rounded-xl bg-forestGreen/5 dark:bg-white/5 border border-forestGreen/10 dark:border-white/10">
                <span className="text-2xl font-mono font-bold text-rose-500">33%</span>
                <span className="text-[10px] text-slate-500 block">Acham que não resolveria</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Impacto Ambiental & Inundações */}
          <motion.div variants={itemVariants} className="p-5 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-sky-600 dark:text-sky-400">
                <CloudRain className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Obstrução de drenagem e risco de inundações
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                A acumulação de resíduos não gerida obstrui diretamente as valas da rede de drenagem urbana, elevando drasticamente o risco de inundações em períodos chuvosos nos bairros mais vulneráveis da Cidade da Beira.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10 text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full shrink-0" />
              O Txeneza cria o canal georreferenciado e auditável que faltava para sanar esta lacuna.
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

