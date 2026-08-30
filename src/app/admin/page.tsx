"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/dashboard.store";
import { useExport } from "@/hooks/use-export";
import { Button } from "@/components/ui/button";
import {
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  BarChart2,
  Radio,
  RotateCw,
} from "lucide-react";

import { ModuleRegistry, AllCommunityModule } from "ag-charts-community";
// Register all community modules once globally for the admin panel
ModuleRegistry.registerModules([AllCommunityModule]);

import { StatsCard } from "@/features/dashboard/components/stats-card";
import { GravityDonutChart } from "@/features/dashboard/components/gravity-donut-chart";
import { CategoryBarChart } from "@/features/dashboard/components/category-bar-chart";
import { TimelineAreaChart } from "@/features/dashboard/components/timeline-area-chart";

export default function AdminDashboardPage() {
  const { stats, loading, isUpdating, lastUpdated, fetchStats } = useDashboardStore();
  const { exportData, exporting } = useExport();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleExport = async () => {
    if (!stats) return;
    const exportRows = stats.categoryDistribution.map((item) => ({
      Categoria: item.category,
      Total: item.count,
    }));
    await exportData(exportRows, "distribuicao-categorias.csv");
  };

  // Dados de gravidade reais vindos do serviço de estatísticas
  const gravityData = stats?.gravityDistribution || {
    baixa: 0,
    media: 0,
    alta: 0,
    critica: 0,
  };

  // Dados temporais reais vindos do serviço de estatísticas
  const timelineData = stats?.timelineData || [];

  const formatLastSync = (date: Date | null) => {
    if (!date) return "A sincronizar...";
    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-grey900 dark:text-white">
              Painel Geral de Estatísticas
            </h1>
            {/* Live Realtime Indicator */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forestGreen/10 dark:bg-limeGreen/15 border border-forestGreen/20 dark:border-limeGreen/25 text-forestGreen dark:text-limeGreen text-[11px] font-bold"
              title="Ligação ativa ao Supabase Realtime para receção instantânea de denúncias"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forestGreen dark:bg-limeGreen opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forestGreen dark:bg-limeGreen"></span>
              </span>
              <span className="hidden md:inline">Em Direto</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-grey600 dark:text-grey400">
            <span>Resumo quantitativo e análise de dados das ocorrências de Beira.</span>
            {lastUpdated && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-grey400 dark:text-grey500 font-mono">
                · Atualizado às {formatLastSync(lastUpdated)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Botão de Atualização Manual */}
          <button
            onClick={() => fetchStats(false)}
            disabled={loading || isUpdating}
            className="p-2.5 rounded-xl border border-grey200 dark:border-grey800 bg-white dark:bg-grey900 text-grey700 dark:text-grey300 hover:bg-grey50 dark:hover:bg-grey800 transition-colors disabled:opacity-50"
            title="Atualizar dados agora"
            aria-label="Atualizar métricas"
          >
            <RotateCw className={`w-4 h-4 ${isUpdating || loading ? "animate-spin text-forestGreen dark:text-limeGreen" : ""}`} />
          </button>

          <Button
            onClick={handleExport}
            disabled={exporting || loading}
            variant="secondary"
            className="flex-1 sm:flex-none shrink-0"
          >
            {exporting ? (
              "A Exportar..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Exportar Dados
              </span>
            )}
          </Button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="text-center py-16 text-grey600 dark:text-grey400 border border-grey200 dark:border-grey800 rounded-2xl bg-white/50 dark:bg-grey900/50">
          <span className="w-6 h-6 border-2 border-limeGreen border-t-transparent rounded-full animate-spin inline-block mr-2" />
          A carregar métricas em tempo real...
        </div>
      ) : (
        <>
          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Ocorrências"
              value={stats?.total || 0}
              icon={<BarChart2 className="w-5 h-5 text-forestGreen dark:text-limeGreen" />}
              trend={stats?.totalTrend ?? undefined}
            />
            <StatsCard
              title="Pendentes"
              value={stats?.pendentes || 0}
              icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
              borderClass="border-l-4 border-l-amber-500"
              valueClass="text-amber-600 dark:text-amber-500"
            />
            <StatsCard
              title="Em Progresso"
              value={stats?.emProgresso || 0}
              icon={<Clock className="w-5 h-5 text-blue-500" />}
              borderClass="border-l-4 border-l-blue-500"
              valueClass="text-blue-600 dark:text-blue-500"
            />
            <StatsCard
              title="Resolvidas"
              value={stats?.resolvidos || 0}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              borderClass="border-l-4 border-l-emerald-500"
              valueClass="text-emerald-600 dark:text-emerald-500"
            />
          </div>

          {/* AG Charts Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
            <GravityDonutChart data={gravityData} />
            <CategoryBarChart data={stats?.categoryDistribution || []} />
            <div className="lg:col-span-2">
              <TimelineAreaChart data={timelineData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
