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
      className="p-4 bg-light-background dark:bg-dark-background dark:bg-grey900 border border-grey200 dark:border-grey800 dark:border-grey700 dark:border-grey800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <span className="text-xs text-grey600 dark:text-grey400">{new Date(occurrence.createdAt).toLocaleDateString()}</span>
        <Badge variant={getBadgeVariant(occurrence.status)}>
          {occurrence.status.toUpperCase()}
        </Badge>
      </div>
      <div>
        <h4 className="font-semibold text-grey900 dark:text-grey50 dark:text-gray-100">{occurrence.title}</h4>
        <p className="text-sm text-grey600 dark:text-grey300 dark:text-grey300 dark:text-grey500 line-clamp-2 mt-1">
          {occurrence.description}
        </p>
      </div>
      <div className="text-xs font-medium text-forestGreen dark:text-limeGreen dark:text-sageGreen dark:text-lightLime">
        {occurrence.category}
      </div>
    </div>
  );
};
