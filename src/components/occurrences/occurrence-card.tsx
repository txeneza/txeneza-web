import React from "react";
import { Occurrence } from "@/features/occurrences/occurrences.types";
import { Badge } from "../ui/badge";

interface OccurrenceCardProps {
  occurrence: Occurrence;
  onClick?: () => void;
}

export const OccurrenceCard: React.FC<OccurrenceCardProps> = ({ occurrence, onClick }) => {
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
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <span className="text-xs text-gray-500">{new Date(occurrence.createdAt).toLocaleDateString()}</span>
        <Badge variant={getBadgeVariant(occurrence.status)}>
          {occurrence.status.toUpperCase()}
        </Badge>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{occurrence.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
          {occurrence.description}
        </p>
      </div>
      <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
        {occurrence.category}
      </div>
    </div>
  );
};
