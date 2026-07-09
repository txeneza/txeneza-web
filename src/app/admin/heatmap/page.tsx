"use client";

import React, { useEffect, useMemo, useState } from "react";
import { HeatmapView } from "@/components/map/heatmap-view";
import { useMapStore } from "@/features/map/map.store";
import { getBeiraHeatmapStats } from "@/features/map/beira-heatmap.data";
import { Flame, ShieldCheck, Radio, MapPin, AlertTriangle } from "lucide-react";

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

  const stats = useMemo(() => getBeiraHeatmapStats(), []);
  const totalPoints = heatmapData.length || stats.totalPoints;

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-forestGreen/10 dark:bg-limeGreen/10 rounded-xl">
            <Flame className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-grey900 dark:text-grey50">
              Mapa de Calor
            </h1>
            <p className="text-grey600 dark:text-grey400 text-sm mt-0.5">
              Densidade georreferenciada de resíduos sólidos urbanos na Cidade da Beira.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-forestGreen/5 dark:bg-limeGreen/5 border border-forestGreen/10 dark:border-limeGreen/10 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-forestGreen dark:text-limeGreen" />
          <span className="text-xs font-bold text-forestGreen dark:text-limeGreen uppercase tracking-wider">
            Estudo de Caso — Beira
          </span>
        </div>
      </div>

      {/* Faixa de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Radio className="w-4 h-4" />}
          label="Pontos monitorizados"
          value={totalPoints.toString()}
        />
        <MetricCard
          icon={<MapPin className="w-4 h-4" />}
          label="Bairros cobertos"
          value={stats.bairrosCount.toString()}
        />
        <MetricCard
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Zona mais crítica"
          value={stats.criticalZone}
          accent
        />
      </div>

      {/* Mapa de Calor */}
      <HeatmapView data={heatmapData} />

      {/* Informações adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="O que mostra">
          Zonas com maior concentração de resíduos sólidos, combinando denúncias dos moradores com a
          distribuição estimada para a área de estudo.
        </InfoCard>
        <InfoCard title="Como interpretar">
          As cores frias (verde) indicam baixa densidade; as cores quentes (âmbar a vermelho) assinalam
          as áreas de maior incidência que exigem atenção prioritária.
        </InfoCard>
        <InfoCard title="Ação recomendada">
          Priorizar a alocação de equipas de recolha e a instalação de contentores nas zonas de alta
          densidade identificadas.
        </InfoCard>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border bg-light-background dark:bg-dark-background ${
        accent
          ? "border-orange-500/20 dark:border-orange-500/20"
          : "border-grey200 dark:border-grey800"
      }`}
    >
      <div
        className={`p-2 rounded-lg ${
          accent
            ? "bg-orange-500/10 text-orange-600 dark:text-orange-500"
            : "bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
          {label}
        </p>
        <p
          className={`text-lg font-black truncate ${
            accent ? "text-orange-600 dark:text-orange-500" : "text-grey900 dark:text-grey50"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl">
      <h3 className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-grey900 dark:text-grey50 leading-relaxed">{children}</p>
    </div>
  );
}
