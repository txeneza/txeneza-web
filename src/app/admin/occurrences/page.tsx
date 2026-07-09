"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useOccurrences } from "@/hooks/use-occurrences";
import { useExport } from "@/hooks/use-export";
import { OccurrenceTable } from "@/components/occurrences/occurrence-table";
import { OccurrenceStatus } from "@/features/occurrences/occurrences.types";
import {
  OCCURRENCE_STATUS_META,
  OCCURRENCE_STATUS_ORDER,
} from "@/features/occurrences/occurrence-status";
import { ClipboardList, Search, Download, AlertCircle, Inbox } from "lucide-react";

type StatusFiltro = "todas" | OccurrenceStatus;

export default function AdminOccurrencesPage() {
  const router = useRouter();
  const { occurrences, loading, error } = useOccurrences();
  const { exportData, exporting } = useExport();

  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todas");

  const counts = useMemo(() => {
    const base: Record<string, number> = { todas: occurrences.length };
    for (const s of OCCURRENCE_STATUS_ORDER) {
      base[s] = occurrences.filter((o) => o.status === s).length;
    }
    return base;
  }, [occurrences]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return occurrences.filter((o) => {
      const matchesStatus = statusFiltro === "todas" || o.status === statusFiltro;
      const matchesSearch =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        (o.bairro?.toLowerCase().includes(q) ?? false);
      return matchesStatus && matchesSearch;
    });
  }, [occurrences, search, statusFiltro]);

  const handleExport = async () => {
    const rows = filtered.map((o) => ({
      Título: o.title,
      Categoria: o.category,
      Bairro: o.bairro || "",
      Estado: OCCURRENCE_STATUS_META[o.status].label,
      Latitude: o.latitude,
      Longitude: o.longitude,
      Data: new Date(o.createdAt).toLocaleDateString("pt-PT"),
    }));
    await exportData(rows, "ocorrencias-beira.csv");
  };

  const filters: { key: StatusFiltro; label: string }[] = [
    { key: "todas", label: "Todas" },
    ...OCCURRENCE_STATUS_ORDER.map((s) => ({ key: s, label: OCCURRENCE_STATUS_META[s].label })),
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-forestGreen/10 dark:bg-limeGreen/10 rounded-xl">
            <ClipboardList className="w-6 h-6 text-forestGreen dark:text-limeGreen" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-grey900 dark:text-grey50">
              Gestão de Ocorrências
            </h1>
            <p className="text-grey600 dark:text-grey400 text-sm mt-0.5">
              Denúncias de resíduos sólidos submetidas pelos munícipes da Cidade da Beira.
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-forestGreen/5 dark:bg-limeGreen/5 border border-forestGreen/10 dark:border-limeGreen/10 text-forestGreen dark:text-limeGreen hover:bg-forestGreen/10 dark:hover:bg-limeGreen/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {exporting ? "A exportar..." : "Exportar CSV"}
        </button>
      </div>

      {/* Métricas por estado */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {OCCURRENCE_STATUS_ORDER.map((s) => {
          const meta = OCCURRENCE_STATUS_META[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFiltro(statusFiltro === s ? "todas" : s)}
              className={`text-left flex items-center gap-3 p-4 rounded-2xl border bg-light-background dark:bg-dark-background transition-all ${
                statusFiltro === s
                  ? "border-forestGreen/40 dark:border-limeGreen/40 ring-2 ring-forestGreen/10 dark:ring-limeGreen/10"
                  : "border-grey200 dark:border-grey800 hover:border-grey300 dark:hover:border-grey700"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
              <div>
                <p className="text-[11px] font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
                  {meta.label}
                </p>
                <p className="text-xl font-black text-grey900 dark:text-grey50">{counts[s]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Barra de ferramentas */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-xl px-3">
          <Search className="w-4 h-4 text-grey400 dark:text-grey600 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por título, categoria ou bairro..."
            className="w-full bg-transparent py-2.5 text-sm text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey600 focus:outline-none"
          />
        </div>

        <div className="flex gap-1 p-1 bg-light-background dark:bg-dark-background border border-grey200 dark:border-grey800 rounded-xl overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFiltro(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFiltro === f.key
                  ? "bg-forestGreen dark:bg-limeGreen text-white dark:text-forestGreen"
                  : "text-grey600 dark:text-grey400 hover:text-grey900 dark:hover:text-grey50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      {error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-3 items-center text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 border border-grey200 dark:border-grey800 rounded-2xl bg-light-background dark:bg-dark-background">
          <div className="w-8 h-8 border-2 border-limeGreen border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-grey600 dark:text-grey400">A carregar ocorrências...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 border border-grey200 dark:border-grey800 rounded-2xl bg-light-background dark:bg-dark-background text-center px-6">
          <div className="p-4 bg-grey100 dark:bg-grey800/60 rounded-full text-grey400 dark:text-grey500">
            <Inbox className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-grey900 dark:text-grey50">Nenhuma ocorrência encontrada</h4>
          <p className="text-xs text-grey600 dark:text-grey400 max-w-xs leading-relaxed">
            {occurrences.length === 0
              ? "Ainda não há denúncias submetidas."
              : "Nenhuma ocorrência corresponde aos filtros aplicados."}
          </p>
        </div>
      ) : (
        <OccurrenceTable
          occurrences={filtered}
          onSelect={(occ) => router.push(`/admin/occurrences/${occ.id}`)}
        />
      )}
    </div>
  );
}
