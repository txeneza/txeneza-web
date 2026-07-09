"use client";

import React, { useState } from "react";
import { PontoRecolhaData, EstadoFiltro } from "../hooks/use-collection-points";
import { CheckCircle2, XCircle, Clock, MapPin, Inbox, Search, Pencil, Trash2, FileText, FileSpreadsheet, Loader2 } from "lucide-react";

interface CollectionPointsListProps {
  points: PontoRecolhaData[];
  totalCount: number;
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  estadoFiltro: EstadoFiltro;
  setEstadoFiltro: (v: EstadoFiltro) => void;
  editingId: string | null;
  onEdit: (p: PontoRecolhaData) => void;
  onDelete: (p: PontoRecolhaData) => void;
}

const FILTERS: { key: EstadoFiltro; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "activo", label: "Ativos" },
  { key: "inactivo", label: "Inativos" },
];

export const CollectionPointsList: React.FC<CollectionPointsListProps> = ({
  points,
  totalCount,
  loading,
  search,
  setSearch,
  estadoFiltro,
  setEstadoFiltro,
  editingId,
  onEdit,
  onDelete,
}) => {
  const [exporting, setExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleExport = async (format: "pdf" | "excel") => {
    setExporting(true);
    setExportingFormat(format);
    try {
      const ids = points.map((p) => p.id);
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "collection-points", format, filters: { ids } }),
      });
      if (!res.ok) throw new Error("Erro ao exportar dados.");
      const report = await res.json();
      
      const link = document.createElement("a");
      link.href = report.url;
      link.setAttribute("download", report.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Erro ao exportar dados do servidor.");
    } finally {
      setExporting(false);
      setExportingFormat(null);
    }
  };

  return (
    <div className="bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[560px]">
      {/* Cabeçalho + controlos */}
      <div className="p-5 border-b border-grey200 dark:border-grey800 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="font-bold text-grey900 dark:text-grey50">Pontos Oficiais</h3>
            <p className="text-xs text-grey600 dark:text-grey400 mt-0.5">
              Locais autorizados de recolha de resíduos sólidos.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen px-2.5 py-1 rounded-full border border-forestGreen/10 dark:border-limeGreen/10">
              {totalCount} {totalCount === 1 ? "Ponto" : "Pontos"}
            </span>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting || points.length === 0}
              className="p-1.5 rounded-lg text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all disabled:opacity-50"
              title="Exportar PDF Filtrado"
            >
              {exportingFormat === "pdf" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => handleExport("excel")}
              disabled={exporting || points.length === 0}
              className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 transition-all disabled:opacity-50"
              title="Exportar Excel Filtrado"
            >
              {exportingFormat === "excel" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Pesquisa */}
          <div className="flex items-center gap-2 flex-1 bg-grey100 dark:bg-grey950 border border-grey200 dark:border-grey800 rounded-xl px-3">
            <Search className="w-4 h-4 text-grey400 dark:text-grey600 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou bairro..."
              className="w-full bg-transparent py-2 text-sm text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey600 focus:outline-none"
            />
          </div>

          {/* Filtro de estado */}
          <div className="flex gap-1 p-1 bg-grey100 dark:bg-grey950 border border-grey200 dark:border-grey800 rounded-xl">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setEstadoFiltro(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  estadoFiltro === f.key
                    ? "bg-forestGreen dark:bg-limeGreen text-white dark:text-forestGreen"
                    : "text-grey600 dark:text-grey400 hover:text-grey900 dark:hover:text-grey50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 h-full">
            <div className="w-8 h-8 border-2 border-limeGreen border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-grey600 dark:text-grey400">A carregar pontos de recolha...</span>
          </div>
        ) : totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 h-full text-center px-6">
            <div className="p-4 bg-grey100 dark:bg-grey800/60 rounded-full text-grey400 dark:text-grey500">
              <Inbox className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-grey900 dark:text-grey50">Nenhum ponto cadastrado</h4>
            <p className="text-xs text-grey600 dark:text-grey400 max-w-xs leading-relaxed">
              Ainda não há pontos de recolha. Utilize o formulário para registar o primeiro local.
            </p>
          </div>
        ) : points.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full text-center px-6">
            <Search className="w-8 h-8 text-grey400 dark:text-grey600" />
            <p className="text-sm text-grey600 dark:text-grey400">Nenhum ponto corresponde à pesquisa.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-grey100 dark:bg-grey900/80 backdrop-blur-sm">
              <tr className="text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
                <th className="py-3 px-5">Nome / Local</th>
                <th className="py-3 px-5">Bairro</th>
                <th className="py-3 px-5 hidden lg:table-cell">Horário</th>
                <th className="py-3 px-5 hidden md:table-cell">Coordenadas</th>
                <th className="py-3 px-5">Estado</th>
                <th className="py-3 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey200 dark:divide-grey800">
              {points.map((p) => (
                <tr
                  key={p.id}
                  className={`text-sm text-grey900 dark:text-grey50 transition-colors ${
                    editingId === p.id
                      ? "bg-forestGreen/5 dark:bg-limeGreen/5"
                      : "hover:bg-grey100 dark:hover:bg-grey900/40"
                  }`}
                >
                  <td className="py-3.5 px-5 font-bold">{p.nome}</td>
                  <td className="py-3.5 px-5 text-grey600 dark:text-grey400">{p.bairro}</td>
                  <td className="py-3.5 px-5 hidden lg:table-cell">
                    {p.horario ? (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-grey100 dark:bg-grey800 text-grey600 dark:text-grey300 py-1 px-2.5 rounded-lg border border-grey200 dark:border-grey700">
                        <Clock className="w-3.5 h-3.5 text-forestGreen dark:text-limeGreen" />
                        {p.horario}
                      </span>
                    ) : (
                      <span className="text-xs text-grey400 dark:text-grey600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-grey600 dark:text-grey400 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    {p.estado === "activo" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 py-1 px-2.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 py-1 px-2.5 rounded-full border border-red-200 dark:border-red-900/50 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(p)}
                        title="Editar"
                        className="p-2 rounded-lg text-grey600 dark:text-grey400 hover:bg-forestGreen/10 dark:hover:bg-limeGreen/10 hover:text-forestGreen dark:hover:text-limeGreen transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        title="Eliminar"
                        className="p-2 rounded-lg text-grey600 dark:text-grey400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};
