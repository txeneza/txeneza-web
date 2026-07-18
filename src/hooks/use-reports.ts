// src/hooks/use-reports.ts

import { useState, useEffect, useCallback } from "react";
import { ReportType, ReportFormat, ReportFilters, ExportHistoryItem } from "@/features/reports/types";

export function useReports() {
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Falha ao carregar o histórico de exportações.");
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de ligação ao carregar histórico.");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const generateReport = async (
    type: ReportType,
    format: ReportFormat,
    filters: ReportFilters = {}
  ) => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, format, filters }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro interno do servidor ao gerar relatório.");
      }

      const reportItem = (await res.json()) as ExportHistoryItem;

      // Forçar descarregamento imediato no navegador.
      // O ficheiro está agora no Supabase Storage (origem diferente da app),
      // e o atributo `download` do <a> é ignorado pela maioria dos browsers
      // em URLs de origem cruzada — por isso vamos buscar o conteúdo como
      // blob e criar um URL local, que força o download de forma fiável.
      try {
        const fileRes = await fetch(reportItem.url);
        if (!fileRes.ok) throw new Error("Não foi possível obter o ficheiro gerado.");
        const blob = await fileRes.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", reportItem.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (downloadErr) {
        // A geração foi bem-sucedida mesmo que o auto-download falhe;
        // o ficheiro fica disponível no histórico para descarregar manualmente.
        console.warn("Falha no auto-download, disponível no histórico:", downloadErr);
      }

      setSuccess("Relatório gerado com sucesso!");
      
      // Atualizar o histórico com a nova entrada
      setHistory((prev) => [reportItem, ...prev].slice(0, 15));

      setTimeout(() => setSuccess(null), 4000);
      return reportItem;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de rede ao gerar o relatório.");
      setTimeout(() => setError(null), 5000);
      return null;
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loadingHistory,
    generating,
    error,
    success,
    generateReport,
    refreshHistory: fetchHistory,
  };
}
