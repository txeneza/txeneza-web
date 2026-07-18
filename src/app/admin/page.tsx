"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/dashboard.store";
import { useExport } from "@/hooks/use-export";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle, Clock, CheckCircle2, BarChart2 } from "lucide-react";

import { ModuleRegistry, AllCommunityModule } from "ag-charts-community";
// Register all community modules once globally for the admin panel
ModuleRegistry.registerModules([AllCommunityModule]);

import { StatsCard } from "@/features/dashboard/components/stats-card";
import { GravityDonutChart } from "@/features/dashboard/components/gravity-donut-chart";
import { CategoryBarChart } from "@/features/dashboard/components/category-bar-chart";
import { TimelineAreaChart } from "@/features/dashboard/components/timeline-area-chart";

export default function AdminDashboardPage() {
  const { stats, loading, fetchStats } = useDashboardStore();
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

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-grey900 dark:text-white">
            Painel Geral de Estatísticas
          </h1>
          <p className="text-sm sm:text-base text-grey600 dark:text-grey500 mt-1">
            Resumo quantitativo e análise de dados das ocorrências urbanas de Beira.
          </p>
        </div>
        <Button onClick={handleExport} disabled={exporting || loading} variant="secondary" className="w-full sm:w-auto shrink-0">
          {exporting ? (
            "A Exportar..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Exportar Dados
            </span>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-grey600 dark:text-grey400">
          <span className="w-6 h-6 border-2 border-limeGreen border-t-transparent rounded-full animate-spin inline-block mr-2" />
          A carregar métricas...
        </div>
      ) : (
        <>
          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Ocorrências"
              value={stats?.total || 0}
              icon={<BarChart2 className="w-5 h-5" />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <GravityDonutChart data={gravityData} />
            <CategoryBarChart data={stats?.categoryDistribution || []} />
            <TimelineAreaChart data={timelineData} />
          </div>
        </>
      )}
    </div>
  );
}
