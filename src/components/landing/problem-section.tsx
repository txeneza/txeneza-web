"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, ShieldAlert, HeartPulse, CloudRain } from "lucide-react";

export const ProblemSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <section id="problema" className="py-20 md:py-28 bg-slate-50 dark:bg-grey900/50 text-foreground dark:text-grey50 relative border-y border-slate-100 dark:border-slate-800/50">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 right-0 w-[30%] aspect-square rounded-full bg-forestGreen/20 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[25%] aspect-square rounded-full bg-limeGreen/5 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-black tracking-widest text-limeGreen uppercase">Estudo de Viabilidade</span>
          <h2 className="text-3.5xl sm:text-5xl font-black tracking-tight mt-3">
            O Desafio dos Resíduos Sólidos na Beira
          </h2>
          <p className="text-slate-605 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            A Cidade da Beira enfrenta desafios severos de saneamento. Dados recolhidos na nossa pesquisa demonstram o impacto crítico da gestão inadequada de resíduos na saúde e infraestrutura.
          </p>
        </div>

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          
          {/* Card 1: 1000 Tons/dia */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-3xl bg-background/80 dark:bg-white/5 border border-slate-205 dark:border-slate-800/80 hover:border-limeGreen/30 hover:bg-background dark:hover:bg-slate-950 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-grey900/90 flex items-center justify-center text-limeGreen group-hover:scale-110 transition-transform">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mt-6 text-foreground dark:text-white group-hover:text-limeGreen transition-colors">
                Tonelas Produzidas vs. Recolhidas
              </h3>
              <p className="text-slate-605 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                Diariamente são geradas cerca de <strong className="text-foreground dark:text-white">~1000 toneladas</strong> de resíduos sólidos na Beira. Contudo, devido a limitações logísticas de recursos, <strong className="text-foreground dark:text-white">apenas metade</strong> desse volume é efetivamente recolhida pelo município. A outra metade acumula-se em lixeiras a céu aberto.
              </p>
            </div>
            
            {/* Stat visual bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900">
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mb-2">
                <span>Taxa de Recolha</span>
                <span className="text-red-500">~50% Acumulado na Cidade</span>
              </div>
              <div className="w-full h-3 bg-slate-150 dark:bg-grey900/90 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bairros Afetados */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-3xl bg-background/80 dark:bg-white/5 border border-slate-205 dark:border-slate-800/80 hover:border-limeGreen/30 hover:bg-background dark:hover:bg-slate-950 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-grey900/90 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mt-6 text-foreground dark:text-white group-hover:text-amber-500 transition-colors">
                Bairros Vulneráveis e Críticos
              </h3>
              <p className="text-slate-605 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                A vulnerabilidade urbana e a distribuição de contentores criam disparidades. Os bairros periféricos e de alta densidade populacional são os mais afetados pela falta de infraestruturas de saneamento básico.
              </p>
            </div>
            
            {/* Neighborhood Pills */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900">
              <span className="text-xs text-slate-500 font-bold block mb-3 uppercase tracking-wider">Zonas Mais Expostas</span>
              <div className="flex flex-wrap gap-2.5">
                {["Munhava", "Chota", "Matacuane", "Inhamizua"].map((bairro, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-grey900/90 text-xs font-bold text-slate-705 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 transition-colors"
                  >
                    {bairro}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Doenças e Malária */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-3xl bg-background/80 dark:bg-white/5 border border-slate-205 dark:border-slate-800/80 hover:border-limeGreen/30 hover:bg-background dark:hover:bg-slate-950 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-grey900/90 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mt-6 text-foreground dark:text-white group-hover:text-red-500 transition-colors">
                Vetores de Doenças e Saúde Pública
              </h3>
              <p className="text-slate-605 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                O lixo acumulado nas valas de drenagem atrai mosquitos e parasitas. Segundo o questionário oficial do nosso estudo, <strong className="text-foreground dark:text-white">69% dos residentes</strong> entrevistados correlacionam diretamente o acúmulo inadequado de resíduos à proliferação de doenças infeciosas, com foco na <strong className="text-red-500 font-bold">Malária</strong>.
              </p>
            </div>
            
            {/* Health Stat */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex items-center gap-5">
              <span className="text-4xl sm:text-5xl font-black text-red-500 font-mono">69%</span>
              <div className="text-xs text-slate-605 dark:text-slate-400 leading-tight">
                Dos residentes associam o lixo diretamente ao aumento de casos de malária e diarreias.
              </div>
            </div>
          </motion.div>

          {/* Card 4: Inundações / Ciclone Idai */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-3xl bg-background/80 dark:bg-white/5 border border-slate-205 dark:border-slate-800/80 hover:border-limeGreen/30 hover:bg-background dark:hover:bg-slate-950 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-grey900/90 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <CloudRain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mt-6 text-foreground dark:text-white group-hover:text-blue-500 transition-colors">
                Obstrução de Drenagem e Inundações
              </h3>
              <p className="text-slate-605 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                A Beira é uma cidade costeira abaixo do nível do mar, altamente suscetível a tempestades tropicais (como o devastador <strong className="text-foreground dark:text-white">Ciclone Idai</strong>). Lixo despejado incorretamente bloqueia os canais de drenagem cruciais, multiplicando drasticamente o impacto de inundações urbanas severas.
              </p>
            </div>
            
            {/* Environmental context */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 text-xs text-slate-500 font-medium italic flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              Impacto crítico agravado pelo entupimento das saídas de maré da Beira.
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
