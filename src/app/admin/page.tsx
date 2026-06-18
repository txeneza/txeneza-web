"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/dashboard.store";
import { useExport } from "@/hooks/use-export";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Painel Geral de Estatísticas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Resumo quantitativo das ocorrências urbanas.
          </p>
        </div>
        <Button onClick={handleExport} disabled={exporting || loading} variant="secondary">
          {exporting ? "A Exportar..." : "📥 Exportar Dados"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">A carregar métricas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Ocorrências</span>
            <div className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats?.total || 0}</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm border-l-4 border-l-yellow-500">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Pendentes</span>
            <div className="text-3xl font-bold mt-2 text-yellow-600">{stats?.pendentes || 0}</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm border-l-4 border-l-blue-500">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Em Progresso</span>
            <div className="text-3xl font-bold mt-2 text-blue-600">{stats?.emProgresso || 0}</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm border-l-4 border-l-green-500">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Resolvidas</span>
            <div className="text-3xl font-bold mt-2 text-green-600">{stats?.resolvidos || 0}</div>
          </div>
        </div>
      )}

      {stats && stats.categoryDistribution.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Métricas por Categoria</h3>
          <div className="flex flex-col gap-3">
            {stats.categoryDistribution.map((item) => (
              <div key={item.category} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
