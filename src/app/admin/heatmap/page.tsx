"use client";

import React, { useEffect, useMemo, useState } from "react";
import { HeatmapView } from "@/features/map/components/heatmap-view";
import { useMapStore } from "@/features/map/map.store";
import { findClosestBairro } from "@/core/geo/beira-bairros";
import { Flame, Radio, MapPin, AlertTriangle } from "lucide-react";


export default function HeatmapPage() {
  const { heatmapData, markers, fetchMapData } = useMapStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchMapData();
    }
  }, [fetchMapData, mounted]);

  // Métricas calculadas dinamicamente com base nas denúncias reais registadas no sistema
  const stats = useMemo(() => {
    if (markers && markers.length > 0) {
      const bairrosSet = new Set<string>();
      const bairroWeights: Record<string, number> = {};

      markers.forEach((m) => {
        const b = m.bairro && m.bairro !== "Outro" && m.bairro.trim() !== ""
          ? m.bairro
          : findClosestBairro(m.latitude, m.longitude);
        
        bairrosSet.add(b);

        const grav = (m.gravidade as string)?.toLowerCase();
        const gravWeight = grav === "critica" || grav === "crítico" ? 3 : grav === "alta" ? 2 : 1;
        bairroWeights[b] = (bairroWeights[b] || 0) + gravWeight;
      });

      let topBairro = "Nenhum";
      let maxW = -1;
      Object.entries(bairroWeights).forEach(([bairro, w]) => {
        if (w > maxW) {
          maxW = w;
          topBairro = bairro;
        }
      });

      return {
        totalPoints: markers.length,
        bairrosCount: bairrosSet.size,
        criticalZone: topBairro,
      };
    }

    // Se o banco estiver sem registos reais, apresenta 0 (sem mock)
    return {
      totalPoints: 0,
      bairrosCount: 0,
      criticalZone: "Nenhuma",
    };
  }, [markers]);

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
      </div>

      {/* Faixa de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Radio className="w-4 h-4" />}
          label="Pontos monitorizados"
          value={stats.totalPoints.toString()}
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
