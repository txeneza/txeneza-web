"use client";

import React, { useState } from "react";
import { Occurrence } from "@/features/occurrences/occurrences.types";
import { OCCURRENCE_STATUS_META } from "@/features/occurrences/occurrence-status";
import { ImageIcon, MapPin, ChevronRight } from "lucide-react";

interface OccurrenceTableProps {
  occurrences: Occurrence[];
  onSelect?: (occ: Occurrence) => void;
}

const Thumb: React.FC<{ occ: Occurrence }> = ({ occ }) => {
  const [error, setError] = useState(false);
  if (!occ.imageUrl || error) {
    return (
      <div className="w-11 h-11 rounded-lg bg-grey100 dark:bg-grey800 flex items-center justify-center text-grey400 dark:text-grey600 shrink-0">
        <ImageIcon className="w-4 h-4" />
      </div>
    );
  }
  return (
    <img
      src={occ.imageUrl}
      alt={occ.title}
      onError={() => setError(true)}
      loading="lazy"
      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-grey200 dark:border-grey800"
    />
  );
};

export const OccurrenceTable: React.FC<OccurrenceTableProps> = ({ occurrences, onSelect }) => {
  return (
    <div className="w-full border border-grey200 dark:border-grey800 rounded-2xl bg-light-background dark:bg-dark-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-grey100 dark:bg-grey900/40 text-xs font-bold text-grey600 dark:text-grey400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Ocorrência</th>
              <th className="px-5 py-3.5 hidden md:table-cell">Categoria</th>
              <th className="px-5 py-3.5 hidden lg:table-cell">Data</th>
              <th className="px-5 py-3.5">Estado</th>
              <th className="px-5 py-3.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey200 dark:divide-grey800">
            {occurrences.map((occ) => {
              const meta = OCCURRENCE_STATUS_META[occ.status];
              return (
                <tr
                  key={occ.id}
                  onClick={() => onSelect?.(occ)}
                  className="hover:bg-grey100 dark:hover:bg-grey900/40 transition-colors cursor-pointer group"
                >
                  {/* Ocorrência: miniatura + título + bairro */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Thumb occ={occ} />
                      <div className="min-w-0">
                        <p className="font-bold text-grey900 dark:text-grey50 truncate max-w-[220px]">
                          {occ.title}
                        </p>
                        {occ.bairro && (
                          <span className="inline-flex items-center gap-1 text-xs text-grey600 dark:text-grey400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {occ.bairro}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Categoria */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-xs font-medium text-forestGreen dark:text-limeGreen bg-forestGreen/5 dark:bg-limeGreen/5 border border-forestGreen/10 dark:border-limeGreen/10 px-2.5 py-1 rounded-lg">
                      {occ.category}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="px-5 py-3.5 hidden lg:table-cell text-grey600 dark:text-grey400">
                    {new Date(occ.createdAt).toLocaleDateString("pt-PT", { timeZone: "Africa/Maputo" })}
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold py-1 px-2.5 rounded-full border ${meta.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </td>

                  {/* Ação */}
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-forestGreen dark:text-limeGreen opacity-70 group-hover:opacity-100 transition-opacity">
                      Ver detalhes
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
