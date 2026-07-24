// src/app/admin/reports/page.tsx

"use client";

import React, { useState } from "react";
import { useReports } from "@/hooks/use-reports";
import { ReportType, ReportFormat } from "@/features/reports/types";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Loader2,
  Calendar,
  MapPin,
  Activity,
  AlertTriangle,
  History,
  Info,
  CheckCircle2,
  AlertCircle,
  FileDigit,
} from "lucide-react";

const BAIRROS_BEIRA = [
  "Munhava",
  "Baixa / Mercado",
  "Manga",
  "Goto",
  "Chaimite",
  "Esturro",
  "Matacuane",
  "Maraza",
  "Palmeiras",
  "Ponta-Gêa",
  "Macúti",
];

const TIPO_LABELS: Record<ReportType, string> = {
  occurrences: "Listagem de Ocorrências",
  "collection-points": "Pontos de Recolha Oficiais",
  summary: "Resumo Geral (Dashboard)",
  heatmap: "Densidade Espacial (Mapa de Calor)",
};

export default function AdminReportsPage() {
  const { history, generating, loadingHistory, error, success, generateReport } = useReports();

  // Estados dos filtros
  const [reportType, setReportType] = useState<ReportType>("occurrences");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bairro, setBairro] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [gravity, setGravity] = useState("Todos");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const filters = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(bairro !== "Todos" && { bairro }),
      ...(status !== "Todos" && { status }),
      ...(gravity !== "Todos" && { gravity }),
    };

    await generateReport(reportType, format, filters);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // O ficheiro fica no Supabase Storage (origem diferente da app), e o
  // atributo `download` do <a> é ignorado pela maioria dos browsers em
  // URLs de origem cruzada. Ir buscar o conteúdo como blob força o
  // descarregamento de forma fiável em qualquer browser.
  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Não foi possível obter o ficheiro.");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Erro ao descarregar relatório:", err);
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-forestGreen/10 dark:bg-limeGreen/10 rounded-xl">
            <FileSpreadsheet className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-grey900 dark:text-grey50">
              Exportação de Relatórios
            </h1>
            <p className="text-grey600 dark:text-grey400 text-sm mt-0.5">
              Extraia indicadores municipais e tabelas nos formatos institucionais PDF e Excel.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-3 items-center text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex gap-3 items-center text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Formulário de Configuração */}
        <div className="xl:col-span-1 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl shadow-sm overflow-hidden p-6 flex flex-col gap-5">
          <h3 className="font-bold text-grey900 dark:text-grey50 border-b border-grey200 dark:border-grey800 pb-3 flex items-center gap-2">
            Configurar Relatório
          </h3>

          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            {/* Tipo de Relatório */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
                Tipo de Relatório
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-grey200 dark:border-grey800 bg-grey50 dark:bg-grey950 text-grey900 dark:text-grey50 focus:border-forestGreen dark:focus:border-limeGreen focus:outline-none"
              >
                <option value="occurrences">Ocorrências (Lista de Focos)</option>
                <option value="collection-points">Pontos de Recolha (Contentores)</option>
                <option value="summary">Resumo Consolidado (Painel)</option>
                <option value="heatmap">Mapa de Calor (Densidade Espacial)</option>
              </select>
            </div>

            {/* Secção de Filtros (Desativados se for Mapa de Calor, que é geral) */}
            <div className={`flex flex-col gap-4 p-4 border border-grey200 dark:border-grey800 rounded-xl bg-grey50/50 dark:bg-grey950/20 ${reportType === "heatmap" ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="text-xs font-bold text-grey900 dark:text-grey50 flex items-center gap-1.5 border-b border-grey200 dark:border-grey800 pb-2 mb-1">
                <Info className="w-3.5 h-3.5 text-forestGreen dark:text-limeGreen" />
                Filtros Opcionais
              </div>

              {/* Bairro */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-grey600 dark:text-grey400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-grey400" /> Bairro
                </label>
                <select
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background text-grey900 dark:text-grey50 focus:outline-none"
                >
                  <option value="Todos">Todos os Bairros</option>
                  {BAIRROS_BEIRA.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Datas de Período */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-grey600 dark:text-grey400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-grey400" /> Início
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background text-grey900 dark:text-grey50 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-grey600 dark:text-grey400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-grey400" /> Fim
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background text-grey900 dark:text-grey50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Filtros específicos de Ocorrências */}
              {reportType !== "collection-points" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-grey600 dark:text-grey400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-grey400" /> Estado
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background text-grey900 dark:text-grey50 focus:outline-none"
                    >
                      <option value="Todos">Todos</option>
                      <option value="pendente">Pendente</option>
                      <option value="em-progresso">Em Progresso</option>
                      <option value="resolvido">Resolvida</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-grey600 dark:text-grey400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-grey400" /> Gravidade
                    </label>
                    <select
                      value={gravity}
                      onChange={(e) => setGravity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background text-grey900 dark:text-grey50 focus:outline-none"
                    >
                      <option value="Todos">Todas</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Filtro específico de Pontos de Recolha */}
              {reportType === "collection-points" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-grey600 dark:text-grey400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-grey400" /> Estado Operacional
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-grey200 dark:border-grey800 bg-light-background dark:bg-dark-background text-grey900 dark:text-grey50"
                  >
                    <option value="Todos">Todos</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              )}
            </div>

            {/* Seleção de Formato */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
                Formato do Relatório
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("pdf")}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 border rounded-xl text-xs font-bold transition-all ${
                    format === "pdf"
                      ? "border-forestGreen dark:border-limeGreen bg-forestGreen/5 dark:bg-limeGreen/5 text-forestGreen dark:text-limeGreen"
                      : "border-grey200 dark:border-grey800 text-grey600 dark:text-grey400 hover:bg-grey100 dark:hover:bg-grey900/30"
                  }`}
                >
                  <FileText className="w-5 h-5 text-red-500" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("excel")}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 border rounded-xl text-xs font-bold transition-all ${
                    format === "excel"
                      ? "border-forestGreen dark:border-limeGreen bg-forestGreen/5 dark:bg-limeGreen/5 text-forestGreen dark:text-limeGreen"
                      : "border-grey200 dark:border-grey800 text-grey600 dark:text-grey400 hover:bg-grey100 dark:hover:bg-grey900/30"
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                  Excel (Sheets)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("csv")}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 border rounded-xl text-xs font-bold transition-all ${
                    format === "csv"
                      ? "border-forestGreen dark:border-limeGreen bg-forestGreen/5 dark:bg-limeGreen/5 text-forestGreen dark:text-limeGreen"
                      : "border-grey200 dark:border-grey800 text-grey600 dark:text-grey400 hover:bg-grey100 dark:hover:bg-grey900/30"
                  }`}
                >
                  <FileDigit className="w-5 h-5 text-amber-500" />
                  CSV Plano
                </button>
              </div>
            </div>

            {/* Botão de Geração */}
            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forestGreen dark:bg-limeGreen text-white dark:text-forestGreen text-sm font-black transition-colors hover:bg-forestGreen/95 dark:hover:bg-limeGreen/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A Gerar Relatório...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Gerar Relatório
                </>
              )}
            </button>
          </form>
        </div>

        {/* Histórico de Exportações */}
        <div className="xl:col-span-2 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[585px]">
          <div className="p-5 border-b border-grey200 dark:border-grey800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-grey900 dark:text-grey50 flex items-center gap-2">
                <History className="w-4 h-4 text-forestGreen dark:text-limeGreen" />
                Histórico de Exportações Recentes
              </h3>
              <p className="text-xs text-grey600 dark:text-grey400 mt-0.5">
                Descarregue relatórios criados anteriormente sem necessidade de nova geração.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center gap-3 h-full">
                <div className="w-8 h-8 border-2 border-limeGreen border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-grey600 dark:text-grey400">A ler histórico...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 h-full text-center px-6">
                <Info className="w-8 h-8 text-grey400 dark:text-grey600" />
                <h4 className="font-bold text-grey900 dark:text-grey50">Nenhum relatório registado</h4>
                <p className="text-xs text-grey600 dark:text-grey400 max-w-xs leading-relaxed">
                  Os relatórios gerados nesta sessão aparecerão aqui para descarregamento rápido.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-grey100 dark:bg-grey900/80 backdrop-blur-sm">
                  <tr className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
                    <th className="py-3 px-5">Nome do Ficheiro</th>
                    <th className="py-3 px-5">Tipo</th>
                    <th className="py-3 px-5 text-center">Formato</th>
                    <th className="py-3 px-5 text-center">Tamanho</th>
                    <th className="py-3 px-5 text-center">Data de Geração</th>
                    <th className="py-3 px-5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey200 dark:divide-grey800">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="text-xs text-grey900 dark:text-grey50 hover:bg-grey100 dark:hover:bg-grey900/40 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono truncate max-w-[180px]" title={item.filename}>
                        {item.filename}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-grey600 dark:text-grey400">
                        {TIPO_LABELS[item.type] || item.type}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {item.format === "pdf" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                            PDF
                          </span>
                        )}
                        {item.format === "excel" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                            EXCEL
                          </span>
                        )}
                        {item.format === "csv" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30">
                            CSV
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center text-grey600 dark:text-grey400">
                        {formatBytes(item.sizeBytes)}
                      </td>
                      <td className="py-3.5 px-5 text-center text-grey600 dark:text-grey400">
                        {new Date(item.createdAt).toLocaleString("pt-PT", { timeZone: "Africa/Maputo" })}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleDownload(item.url, item.filename)}
                            className="p-2 rounded-lg text-forestGreen dark:text-limeGreen hover:bg-forestGreen/10 dark:hover:bg-limeGreen/10 transition-colors flex items-center gap-1.5 font-bold"
                            title="Descarregar ficheiro"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Baixar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
