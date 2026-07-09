"use client";

import React, { useEffect, useState } from "react";
import { HeatmapView } from "@/components/map/heatmap-view";
import { useMapStore } from "@/features/map/map.store";
import { Flame, ShieldCheck } from "lucide-react";

export default function HeatmapPage() {
  const { heatmapData, fetchMapData } = useMapStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchMapData();
    }
  }, [fetchMapData, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-forestGreen/10 dark:bg-limeGreen/10 rounded-xl">
              <Flame className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-grey900 dark:text-grey50">
                Mapa de Calor
              </h1>
              <p className="text-grey600 dark:text-grey400 text-sm mt-0.5">
                Visualização geográfica de densidade de ocorrências na Cidade da Beira.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-forestGreen/5 dark:bg-limeGreen/5 border border-forestGreen/10 dark:border-limeGreen/10 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-forestGreen dark:text-limeGreen" />
          <span className="text-xs font-bold text-forestGreen dark:text-limeGreen uppercase tracking-wider">
            Premium & Enterprise
          </span>
        </div>
      </div>

      {/* Mapa de Calor */}
      <HeatmapView data={heatmapData} />

      {/* Informações adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
          <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-1">O que mostra</h3>
          <p className="text-sm text-grey900 dark:text-grey50 leading-relaxed">
            Zonas com maior concentração de denúncias de resíduos sólidos reportadas pelos moradores.
          </p>
        </div>
        <div className="p-5 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
          <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-1">Como interpretar</h3>
          <p className="text-sm text-grey900 dark:text-grey50 leading-relaxed">
            Áreas com cores mais intensas (verde-limão) indicam maior incidência de problemas ambientais urbanos.
          </p>
        </div>
        <div className="p-5 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
          <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-1">Ação recomendada</h3>
          <p className="text-sm text-grey900 dark:text-grey50 leading-relaxed">
            Priorize a alocação de equipas de limpeza e contentores nas zonas de alta densidade identificadas.
          </p>
        </div>
      </div>
    </div>
  );
}
