"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { MapView, PontoRecolhaMapData } from "@/components/map/map-view";
import { useMapStore } from "@/features/map/map.store";
import { OccurrenceCard } from "@/components/occurrences/occurrence-card";
import { useAuth } from "@/hooks/use-auth";

export default function MapPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { markers, heatmapData, fetchMapData, selectedOccurrence, setSelectedOccurrence } = useMapStore();
  const [collectionPoints, setCollectionPoints] = useState<PontoRecolhaMapData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redireciona para login se o carregamento terminar e o usuário não for admin
    if (mounted && !authLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, authLoading, router, mounted]);

  useEffect(() => {
    if (mounted && user && user.role === "admin") {
      // Busca ocorrências
      fetchMapData();
      
      // Busca pontos de recolha cadastrados no banco real
      const loadPoints = async () => {
        try {
          const res = await fetch("/api/pontos-recolha");
          if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              setCollectionPoints(data);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar pontos de recolha:", error);
        }
      };
      loadPoints();
    }
  }, [fetchMapData, user, mounted]);

  if (!mounted || authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 border-2 border-limeGreen border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">A verificar permissões de acesso...</span>
        </div>
      </div>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-grey900 dark:text-grey50 dark:text-white">
            Mapa de Ocorrências Urbanas
          </h1>
          <p className="text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 mt-2">
            Consulte no mapa interactivo os incidentes e problemas reportados na Cidade da Beira.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView
              markers={markers}
              collectionPoints={collectionPoints}
              onMarkerClick={(occ) => setSelectedOccurrence(occ)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-grey100 dark:bg-grey900/40 dark:bg-grey900 border border-grey200 dark:border-grey800 dark:border-grey800 rounded-xl">
              <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white mb-2">Informação Geral</h3>
              <p className="text-sm text-grey600 dark:text-grey300 dark:text-grey300 dark:text-grey500 leading-relaxed">
                Este mapa mostra as ocorrências ativas (pinos vermelhos) e os pontos de recolha cadastrados (pinos verdes com o logotipo Txeneza). Clique num ponto para ver os detalhes.
              </p>
            </div>

            {selectedOccurrence ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-grey900 dark:text-grey50 dark:text-white">Selecionado</h3>
                  <button
                    onClick={() => setSelectedOccurrence(null)}
                    className="text-xs text-grey600 dark:text-grey400 hover:text-grey800 dark:text-grey200 dark:hover:text-grey200 dark:text-grey700"
                  >
                    Limpar
                  </button>
                </div>
                <OccurrenceCard occurrence={selectedOccurrence} />
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-grey300 dark:border-grey700 dark:border-grey700 dark:border-grey800 rounded-xl text-grey300 dark:text-grey500 dark:text-grey600 dark:text-grey300 text-sm">
                Selecione uma ocorrência no mapa para ver detalhes aqui.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
