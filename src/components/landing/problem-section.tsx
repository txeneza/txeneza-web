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
            01 · Estudo de Viabilidade
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            O desafio dos resíduos sólidos na Beira
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            A Cidade da Beira enfrenta desafios severos de saneamento. Dados recolhidos na nossa pesquisa demonstram o impacto crítico da gestão inadequada de resíduos na saúde e infraestrutura.
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

          {/* Card 1: 1000 Tons/dia & Separação CMB / SASB */}
          <motion.div variants={itemVariants} className="p-6 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-forestGreen dark:text-limeGreen">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Produção diária vs. Capacidade de recolha
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                A Beira produz cerca de <strong className="text-foreground dark:text-white font-semibold">~1000 toneladas</strong> de resíduos sólidos por dia, das quais o <strong className="text-foreground dark:text-white font-semibold">Conselho Municipal da Beira (CMB)</strong> recolhe apenas metade. A separação institucional entre a CMB (resíduos) e o <strong className="text-foreground dark:text-white font-semibold">SASB</strong> (drenagem) exige um canal estruturado único.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium mb-2">
                <span>Taxa de recolha municipal</span>
                <span className="font-mono text-red-600 dark:text-red-400">~50% recolhido / dia</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-red-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bairros Afectados & Lacuna dos Meios Informais */}
          <motion.div variants={itemVariants} className="p-6 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Bairros periféricos & Lacuna dos canais informais
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Meios informais como grupos de WhatsApp <strong className="text-foreground dark:text-white font-semibold">não geram dados georreferenciados</strong> nem permitem verificar a resolução real das ocorrências. As iniciativas como &ldquo;ponto a ponto&rdquo; e ecopontos exigem uma plataforma centralizada.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10">
              <span className="text-xs text-slate-500 font-medium block mb-3 uppercase tracking-wide font-mono">Bairros prioritários em estudo</span>
              <div className="flex flex-wrap gap-2">
                {["Munhava", "Chota", "Matacuane", "Inhamizua"].map((bairro, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-forestGreen/5 dark:bg-white/5 border border-forestGreen/15 dark:border-white/15 rounded-lg"
                  >
                    {bairro}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Doenças e Malária */}
          <motion.div variants={itemVariants} className="p-6 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                <HeartPulse className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Vetores de doenças e salubridade pública
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                O lixo acumulado em espaços públicos e valas atrai mosquitos e vetores. Na pesquisa de campo, <strong className="text-foreground dark:text-white font-semibold">69% dos moradores</strong> correlacionam diretamente o acúmulo de resíduos à proliferação de <strong className="text-red-600 dark:text-red-400 font-semibold">Malária</strong> e diarreias.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10 flex items-center gap-5">
              <span className="text-4xl font-mono font-semibold text-red-600 dark:text-red-400">69%</span>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                Dos residentes associam o lixo diretamente ao aumento de casos de malária e diarreias.
              </div>
            </div>
          </motion.div>

          {/* Card 4: Inundações / Ciclone Idai & Resiliência Climática */}
          <motion.div variants={itemVariants} className="p-6 sm:p-8 bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all">
            <div>
              <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
                <CloudRain className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Obstrução de drenagem e Ciclone Idai (2019)
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Como o <strong className="text-foreground dark:text-white font-semibold">Ciclone Idai evidenciou em 2019</strong>, a acumulação de resíduos obstrui as redes de drenagem do SASB, conferindo à gestão de resíduos uma dimensão de <strong className="text-foreground dark:text-white font-semibold">resiliência climática</strong> urgente.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-forestGreen/10 dark:border-white/10 text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
              Dimensão de resiliência climática que ultrapassa a simples questão sanitária.
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
