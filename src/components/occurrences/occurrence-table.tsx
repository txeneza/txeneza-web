import React from "react";
import { Occurrence } from "@/features/occurrences/occurrences.types";
import { Badge } from "../ui/badge";

interface OccurrenceTableProps {
  occurrences: Occurrence[];
  onSelect?: (occ: Occurrence) => void;
}

export const OccurrenceTable: React.FC<OccurrenceTableProps> = ({ occurrences, onSelect }) => {
  const getBadgeVariant = (status: Occurrence["status"]) => {
    switch (status) {
      case "pendente": return "warning";
      case "em-progresso": return "info";
      case "resolvido": return "success";
      case "rejeitado": return "error";
      default: return "default";
    }
  };

  return (
    <div className="overflow-x-auto w-full border border-grey200 dark:border-grey800 dark:border-grey700 dark:border-grey800 rounded-xl bg-light-background dark:bg-dark-background dark:bg-grey900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-sm">
        <thead className="bg-grey100 dark:bg-grey900/40 dark:bg-gray-800 text-xs font-semibold text-grey600 dark:text-grey400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Título</th>
            <th className="px-6 py-3">Categoria</th>
            <th className="px-6 py-3">Data</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {occurrences.map((occ) => (
            <tr key={occ.id} className="hover:bg-grey100 dark:bg-grey900/40 dark:hover:bg-gray-850 transition-colors">
              <td className="px-6 py-4 font-medium text-grey900 dark:text-grey50 dark:text-gray-100">{occ.title}</td>
              <td className="px-6 py-4 text-grey600 dark:text-grey300 dark:text-grey300 dark:text-grey500">{occ.category}</td>
              <td className="px-6 py-4 text-grey600 dark:text-grey400">{new Date(occ.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <Badge variant={getBadgeVariant(occ.status)}>
                  {occ.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelect?.(occ)}
                  className="text-forestGreen dark:text-limeGreen dark:text-sageGreen dark:text-lightLime hover:underline font-medium"
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
