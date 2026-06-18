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
    <div className="overflow-x-auto w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
            <tr key={occ.id} className="hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{occ.title}</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{occ.category}</td>
              <td className="px-6 py-4 text-gray-500">{new Date(occ.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <Badge variant={getBadgeVariant(occ.status)}>
                  {occ.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelect?.(occ)}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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
