"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapView, PontoRecolhaMapData } from "@/components/map/map-view";
import { HeatmapView } from "@/components/map/heatmap-view";
import { OccurrenceCard } from "@/components/occurrences/occurrence-card";
import { useMapStore } from "@/features/map/map.store";
import { ArrowLeft, Map as MapIcon, Flame, Info, X, WifiOff, PlusCircle, MousePointerClick } from "lucide-react";
import { BrandName } from "@/components/brand/brand-name";

// Mapa público de ocorrências — acessível a qualquer visitante, sem necessidade de login.
// Reutiliza os mesmos componentes e endpoints (só de leitura) do painel administrativo.
export default function PublicMapPage() {
  const { markers, heatmapData, fetchMapData, selectedOccurrence, setSelectedOccurrence } = useMapStore();
  const [collectionPoints, setCollectionPoints] = useState<PontoRecolhaMapData[]>([]);
  const [pointsError, setPointsError] = useState<string | null>(null);
  const [mode, setMode] = useState<"markers" | "heatmap">("markers");
  const [mounted, setMounted] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const handleReportClick = () => {
    const appUri = "txeneza://";
    window.location.href = appUri;
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = "/#download-app";
      }
    }, 1200);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetchMapData();

    const loadPoints = async () => {
      try {
        const res = await fetch("/api/pontos-recolha");
        if (!res.ok) throw new Error(`API devolveu estado ${res.status}`);
        const data = await res.json();
        setCollectionPoints(Array.isArray(data) ? data : []);
        setPointsError(null);
      } catch (error) {
        console.error("Erro ao carregar pontos de recolha:", error);
        setCollectionPoints([]);
        setPointsError("Não foi possível carregar os pontos de recolha da base de dados.");
      }
    };
    loadPoints();
  }, [fetchMapData, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background dark:bg-grey900 text-foreground dark:text-grey50">
      {/* Cabeçalho simples, sem exigir autenticação */}
      <header className="sticky top-0 z-30 bg-forestGreen border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-tight">
              <BrandName variant="onDark" />
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Alternador Marcadores / Mapa de Calor */}
            <div className="inline-flex border border-white/15">
              <button
                onClick={() => setMode("markers")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                  mode === "markers" ? "bg-limeGreen text-forestGreen" : "text-slate-300 hover:text-white"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Marcadores</span>
              </button>
              <button
                onClick={() => setMode("heatmap")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors border-l border-white/15 ${
                  mode === "heatmap" ? "bg-limeGreen text-forestGreen" : "text-slate-300 hover:text-white"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mapa de Calor</span>
              </button>
            </div>

            <button
              onClick={handleReportClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-limeGreen text-forestGreen hover:bg-lightLime transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Denunciar
            </button>
          </div>
        </div>

        {/* Dica de utilização — só desaparece quando o utilizador a fecha */}
        {showTip && (
          <div className="border-t border-white/10 bg-forestGreen/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 text-xs text-slate-200">
              <MousePointerClick className="w-4 h-4 text-limeGreen shrink-0" />
              <span className="flex-1">
                Toque num marcador <span className="text-red-400 font-semibold">vermelho</span> para ver a denúncia, ou num ponto <span className="text-limeGreen font-semibold">verde</span> para ver um local oficial de recolha do CMB.
              </span>
              <button onClick={() => setShowTip(false)} className="text-slate-400 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa */}
          <div className="lg:col-span-2">
            {mode === "markers" ? (
              <MapView
                markers={markers}
                collectionPoints={collectionPoints}
                onMarkerClick={(occ) => setSelectedOccurrence(occ)}
              />
            ) : (
              <HeatmapView data={heatmapData} />
            )}
          </div>

          {/* Painel lateral */}
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-background dark:bg-grey900 border border-slate-200 dark:border-white/10">
              <h3 className="font-mono text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Legenda
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="p-1 bg-grey900 border border-limeGreen/40 rounded-md shrink-0">
                    <MapIcon className="w-4 h-4 text-red-500" />
                  </span>
                  <span>Foco de resíduos denunciado</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="p-1 bg-forestGreen border border-limeGreen rounded-full shrink-0 w-6 h-6 flex items-center justify-center">
                    <img src="/icons/TXENEZA.svg" alt="Ponto de recolha" className="w-3.5 h-3.5 object-contain" />
                  </span>
                  <span>Ponto de recolha oficial (CMB)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background dark:bg-grey900 border border-slate-200 dark:border-white/10">
                <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">Denúncias</p>
                <p className="text-xl font-mono font-semibold text-red-600 dark:text-red-400">{markers.length}</p>
              </div>
              <div className="p-3 bg-background dark:bg-grey900 border border-slate-200 dark:border-white/10">
                <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pontos CMB</p>
                <p className="text-xl font-mono font-semibold text-forestGreen dark:text-limeGreen">{collectionPoints.length}</p>
              </div>
            </div>

            {pointsError ? (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/15 text-xs text-red-700 dark:text-red-400">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>{pointsError}</span>
              </div>
            ) : collectionPoints.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15 text-xs text-amber-700 dark:text-amber-500">
                <Info className="w-4 h-4 shrink-0" />
                <span>Ainda não há pontos de recolha cadastrados na base de dados.</span>
              </div>
            ) : null}

            {selectedOccurrence ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Denúncia selecionada
                  </h3>
                  <button
                    onClick={() => setSelectedOccurrence(null)}
                    className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Limpar
                  </button>
                </div>
                <OccurrenceCard occurrence={selectedOccurrence} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center p-6 border border-dashed border-slate-300 dark:border-white/15 text-slate-500 dark:text-slate-500">
                <Info className="w-5 h-5" />
                <p className="text-sm">
                  Selecione um <b className="text-red-500">foco de resíduos</b> no mapa para ver os detalhes e a fotografia da denúncia.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
