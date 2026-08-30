"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, WifiOff, CheckCircle2, Bot, LayoutDashboard } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

import { Carousel } from "@/components/ui/carousel";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Registo da Denúncia",
      desc: "O morador tira uma fotografia do ponto de lixo acumulado; o sistema captura as coordenadas GPS automaticamente com elevada precisão.",
      icon: Camera,
    },
    {
      num: "02",
      title: "Classificação por IA (Gemini)",
      desc: "A imagem é enviada à API Gemini, que identifica a categoria do resíduo e o nível de gravidade, permitindo também a correção manual do utilizador.",
      icon: MapPin,
    },
    {
      num: "03",
      title: "Arquitetura Offline-First",
      desc: "Sem internet, a ocorrência é guardada localmente no dispositivo e sincronizada automaticamente assim que a conectividade for restaurada, sem perda de dados.",
      icon: WifiOff,
    },
    {
      num: "04",
      title: "Verificação de Resolução",
      desc: "Após a equipa municipal limpar o local, o morador recebe fotografias de 'antes/depois' para confirmar a resolução; se rejeitada, a ocorrência reabre automaticamente.",
      icon: CheckCircle2,
    },
    {
      num: "05",
      title: "Assistente Conversacional Xeni",
      desc: "Responde a dúvidas sobre gestão de resíduos e reciclagem, fornecendo orientações online (via Gemini) ou offline através de respostas locais pré-definidas.",
      icon: Bot,
    },
    {
      num: "06",
      title: "Painel Administrativo (CMB)",
      desc: "Pensado para uso potencial pelo Conselho Municipal da Beira (CMB), com estatísticas em tempo real, moderador de ocorrências e integração com o sistema 'ponto a ponto'.",
      icon: LayoutDashboard,
    },
  ];

  return (
    <section id="funcionamento" className="py-20 md:py-28 bg-transparent text-foreground dark:text-grey50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="font-mono text-[11px] tracking-[0.2em] text-forestGreen dark:text-limeGreen uppercase">
            02 · Como Funciona
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            Fluxo inteligente e auditável da <BrandName />
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Do registo fotográfico à confirmação da limpeza municipal, a plataforma combina inteligência artificial, modo offline e verificação de 'antes e depois'.
          </p>
        </div>

        {/* Steps Carousel */}
        <Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }} autoPlay interval={6000}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white/80 dark:bg-forestGreen/10 backdrop-blur-xl border border-forestGreen/15 dark:border-forestGreen/30 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-limeGreen/40 dark:hover:border-limeGreen/30 transition-all relative overflow-hidden group h-full min-h-[260px]"
              >
                {/* Accent top line on hover */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-limeGreen to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-forestGreen/5 dark:bg-limeGreen/10 border border-forestGreen/10 dark:border-limeGreen/20">
                      <Icon className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      {step.num}/06
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
};
