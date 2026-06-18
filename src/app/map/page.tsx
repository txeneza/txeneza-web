"use client";

import React, { useEffect } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { MapView } from "@/components/map/map-view";
import { useMapStore } from "@/features/map/map.store";
import { OccurrenceCard } from "@/components/occurrences/occurrence-card";

export default function MapPage() {
  const { markers, heatmapData, fetchMapData, selectedOccurrence, setSelectedOccurrence } = useMapStore();

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Mapa de Ocorrências Urbanas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Consulte no mapa interactivo os incidentes e problemas reportados na Cidade da Beira.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView
              markers={markers}
              heatmapData={heatmapData}
              onMarkerClick={(occ) => setSelectedOccurrence(occ)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Informação Geral</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Este mapa mostra as ocorrências ativas de saneamento, infraestruturas, drenagem, etc. 
                Selecione um ponto ou clique num cartão para ver detalhes.
              </p>
            </div>

            {selectedOccurrence ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Selecionado</h3>
                  <button
                    onClick={() => setSelectedOccurrence(null)}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Limpar
                  </button>
                </div>
                <OccurrenceCard occurrence={selectedOccurrence} />
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-600 text-sm">
                Selecione uma ocorrência no mapa para ver detalhes aqui.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
