"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOccurrences } from "@/hooks/use-occurrences";
import { OccurrenceTable } from "@/components/occurrences/occurrence-table";

export default function AdminOccurrencesPage() {
  const router = useRouter();
  const { occurrences, loading, error } = useOccurrences();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-grey900 dark:text-grey50 dark:text-white">
          Gestão de Ocorrências
        </h1>
        <p className="text-grey600 dark:text-grey400 dark:text-grey300 dark:text-grey500 mt-1">
          Veja a lista de ocorrências submetidas pelos munícipes.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-grey600 dark:text-grey400">A carregar ocorrências...</div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-200 rounded-lg">{error}</div>
      ) : (
        <OccurrenceTable
          occurrences={occurrences}
          onSelect={(occ) => router.push(`/admin/occurrences/${occ.id}`)}
        />
      )}
    </div>
  );
}
